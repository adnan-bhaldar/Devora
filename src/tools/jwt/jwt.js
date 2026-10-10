import { base64ToBytes, bytesToBase64Url } from '../../utils/base64.js'
import { decodeUtf8 } from '../../utils/text.js'

const fail = (error) => ({ ok: false, error })

const ERRORS = {
    encrypted:
        'This token has five parts, so it looks like an encrypted JWT (JWE). Its contents cannot be read without the decryption key, and Devora does not support them.',
}

// One segment of a token: Base64URL -> UTF-8 text -> JSON object.
function decodeJsonSegment(segment, name) {
    if (segment === '') return fail(`The ${name} is empty.`)

    const bytes = base64ToBytes(segment)
    if (!bytes.ok) return fail(`The ${name} is not valid Base64URL, so it cannot be decoded.`)

    const text = decodeUtf8(bytes.bytes)
    if (!text.ok) return fail(`The ${name} decodes to data that is not valid UTF-8 text.`)

    let value
    try {
        value = JSON.parse(text.text)
    } catch {
        return fail(`The ${name} is not valid JSON.`)
    }

    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        return fail(`The ${name} is not a JSON object.`)
    }

    return { ok: true, value }
}

/*
 * Decodes a token. This does NOT verify anything. Returns { ok: true, token } (token is null
 * for empty input) or { ok: false, error }. A damaged signature does not fail the decode:
 * the header and payload are still worth showing when a token has been cut off.
 */
export function decodeJwt(input) {
    // Pasted tokens often come with an "Authorization: Bearer" prefix or stray line breaks.
    const compact = input
        .trim()
        .replace(/^bearer\s+/i, '')
        .replace(/\s+/g, '')
    if (compact === '') return { ok: true, token: null }

    const parts = compact.split('.')
    if (parts.length === 5) return fail(ERRORS.encrypted)
    if (parts.length !== 3) {
        return fail(
            `A JWT has three parts separated by dots (header.payload.signature), but this input has ${parts.length} ${parts.length === 1 ? 'part' : 'parts'}.`,
        )
    }

    const header = decodeJsonSegment(parts[0], 'header')
    if (!header.ok) return header

    const payload = decodeJsonSegment(parts[1], 'payload')
    if (!payload.ok) return payload

    const signatureText = parts[2]
    let signatureLength = 0
    if (signatureText !== '') {
        const decoded = base64ToBytes(signatureText)
        signatureLength = decoded.ok ? decoded.bytes.length : null
    }

    return {
        ok: true,
        token: {
            header: header.value,
            payload: payload.value,
            headerText: JSON.stringify(header.value, null, 2),
            payloadText: JSON.stringify(payload.value, null, 2),
            signature: { text: signatureText, length: signatureLength },
        },
    }
}

/* ---------- Token information ---------- */

const TEXT_CLAIMS = [
    ['iss', 'Issuer'],
    ['sub', 'Subject'],
    ['aud', 'Audience'],
    ['jti', 'JWT ID'],
]

const TIME_CLAIMS = [
    ['iat', 'Issued at'],
    ['nbf', 'Not valid before'],
    ['exp', 'Expires'],
]

const RELATIVE_UNITS = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
]

const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

// "in 3 hours", "2 days ago", "yesterday"... for a number of seconds from now.
function formatRelativeTime(secondsFromNow) {
    const absolute = Math.abs(secondsFromNow)
    const [unit, size] = RELATIVE_UNITS.find(([, unitSize]) => absolute >= unitSize) ?? ['second', 1]
    return relativeFormat.format(Math.round(secondsFromNow / size), unit)
}

// Claim values come from the token, so anything could be in them. This turns any value into text.
function displayValue(value) {
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    return JSON.stringify(value)
}

function formatAudience(value) {
    return Array.isArray(value) && value.every((item) => typeof item === 'string')
        ? value.join(', ')
        : displayValue(value)
}

// Time claims are "seconds since 1970". Anything else (or an impossible date) is not a timestamp.
function isTimestamp(value) {
    return (
        typeof value === 'number' &&
        Number.isFinite(value) &&
        !Number.isNaN(new Date(value * 1000).getTime())
    )
}

function describeTimeClaim(value, nowSeconds) {
    if (!isTimestamp(value)) {
        return {
            value: displayValue(value),
            detail: 'Not a valid timestamp. It should be a number of seconds since 1970.',
        }
    }

    const date = new Date(value * 1000)
    return {
        value: date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' }),
        detail: `${formatRelativeTime(value - nowSeconds)} · ${date.toISOString()}`,
    }
}

function getStatus(payload, nowSeconds) {
    const { exp, nbf } = payload

    if (isTimestamp(exp) && exp <= nowSeconds) {
        return { tone: 'danger', label: 'Expired', detail: `Expired ${formatRelativeTime(exp - nowSeconds)}.` }
    }
    if (isTimestamp(nbf) && nbf > nowSeconds) {
        return {
            tone: 'warning',
            label: 'Not valid yet',
            detail: `Becomes valid ${formatRelativeTime(nbf - nowSeconds)}.`,
        }
    }
    if (isTimestamp(exp)) {
        return {
            tone: 'neutral',
            label: 'Not expired',
            detail: `Expires ${formatRelativeTime(exp - nowSeconds)}.`,
        }
    }
    return {
        tone: 'neutral',
        label: 'No expiry claim',
        detail: 'The token does not say when it expires.',
    }
}

// Pure: the time is passed in, so the same token and time always give the same result.
export function getTokenInfo(token, nowMs) {
    const nowSeconds = Math.floor(nowMs / 1000)
    const { header, payload } = token
    const rows = []

    rows.push({
        label: 'Algorithm',
        value: header.alg === undefined ? 'Not specified' : displayValue(header.alg),
    })
    if (header.typ !== undefined) rows.push({ label: 'Type', value: displayValue(header.typ) })
    if (header.kid !== undefined) rows.push({ label: 'Key ID', value: displayValue(header.kid) })

    for (const [claim, label] of TEXT_CLAIMS) {
        if (payload[claim] === undefined) continue
        const value = claim === 'aud' ? formatAudience(payload[claim]) : displayValue(payload[claim])
        rows.push({ label, value })
    }

    for (const [claim, label] of TIME_CLAIMS) {
        if (payload[claim] === undefined) continue
        rows.push({ label, ...describeTimeClaim(payload[claim], nowSeconds) })
    }

    return { status: getStatus(payload, nowSeconds), rows }
}

// A token with no signature, or "alg": "none", can be created by anyone.
export function isUnsigned(token) {
    const alg = typeof token.header.alg === 'string' ? token.header.alg.toLowerCase() : ''
    return alg === 'none' || token.signature.text === ''
}

/* ---------- Example ---------- */

const encoder = new TextEncoder()
const encodePart = (value) => bytesToBase64Url(encoder.encode(JSON.stringify(value)))

// Made-up data with fixed dates, so the example is always the same. The "signature" is just
// text and is not a real signature.
export function createExampleToken() {
    const header = { alg: 'HS256', typ: 'JWT' }
    const payload = {
        iss: 'https://example.com',
        sub: 'example-user-1',
        name: 'Example User',
        iat: 1700000000,
        exp: 1700003600,
    }
    const signature = bytesToBase64Url(encoder.encode('example-signature-not-verified'))
    return `${encodePart(header)}.${encodePart(payload)}.${signature}`
}