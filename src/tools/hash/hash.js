import { bytesToBase64 } from '../../utils/base64.js'

// Only the SHA-2 family: these are the strong hashes the browser's Web Crypto API offers.
// MD5 and SHA-1 are left out on purpose (see the docs).
export const ALGORITHMS = [
    { value: 'SHA-256', label: 'SHA-256', bits: 256 },
    { value: 'SHA-384', label: 'SHA-384', bits: 384 },
    { value: 'SHA-512', label: 'SHA-512', bits: 512 },
]

export const FORMATS = [
    { value: 'hex', label: 'Hex' },
    { value: 'hex-upper', label: 'Hex (uppercase)' },
    { value: 'base64', label: 'Base64' },
]

export const EXAMPLE_TEXT = 'Hello, Devora!'

const ERRORS = {
    unavailable:
        'Hashing needs a secure connection. Open Devora over HTTPS (or on localhost), because browsers only provide the Web Crypto API there.',
    failed: 'The hash could not be calculated. Try again, or try shorter text.',
}

/*
 * Hashes `text` (as UTF-8 bytes) with the given algorithm name. Always resolves, and never
 * throws: { ok: true, digest, inputBytes } or { ok: false, error }.
 * `digest` is a Uint8Array of the raw hash bytes.
 */
export async function computeDigest(text, algorithm) {
    if (!globalThis.crypto?.subtle) return { ok: false, error: ERRORS.unavailable }

    try {
        const data = new TextEncoder().encode(text)
        const buffer = await globalThis.crypto.subtle.digest(algorithm, data)
        return { ok: true, digest: new Uint8Array(buffer), inputBytes: data.length }
    } catch {
        return { ok: false, error: ERRORS.failed }
    }
}

function toHex(bytes) {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function formatDigest(digest, format) {
    if (format === 'base64') return bytesToBase64(digest)
    const hex = toHex(digest)
    return format === 'hex-upper' ? hex.toUpperCase() : hex
}