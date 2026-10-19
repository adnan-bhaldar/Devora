import { getCountry } from './countries.js'

export const APPS = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
]

export const WHATSAPP_MODES = [
    { value: 'whatsapp-phone', label: 'Chat by phone number' },
    { value: 'whatsapp-username', label: 'Chat by username' },
]

export const TELEGRAM_MODES = [
    { value: 'username', label: 'Chat by username' },
    { value: 'phone', label: 'Chat by phone number' },
    { value: 'share', label: 'Share a link' },
]

// The message is also placed inside a QR code, so it is kept short enough to scan easily.
export const MAX_MESSAGE_LENGTH = 1000

export const EXAMPLES = {
    phone: { country: 'IN', national: '7700 900123' },
    'whatsapp-username': { username: 'jane.doe' },
    username: { username: 'telegram' },
    share: { url: 'https://example.com' },
    message: 'Hi! I found you through your website and have a question.',
    shareMessage: 'Worth a look!',
}

const MIN_PHONE_DIGITS = 7
const MAX_PHONE_DIGITS = 15 // The international limit (E.164).

const LENGTH_ERROR = `A phone number with its country code has between ${MIN_PHONE_DIGITS} and ${MAX_PHONE_DIGITS} digits.`
const CHARACTER_ERROR = 'Use only digits in the phone number. Spaces, dashes, and brackets are fine.'

/*
 * Turns what the person typed into the digits both apps want: the country code followed by
 * the number, with no +, spaces, or leading zeros. Returns { ok: true, digits } or
 * { ok: false, error }. An empty number is "ok" with empty digits, so the caller decides
 * whether a number is required.
 *
 * - With a country chosen, the number is the local one ("07700 900123") and the country code
 *   is added in front. The 0 that local numbers start with is dropped (except where it is part
 *   of the number, such as Italy).
 * - With "Other" chosen, or when the number starts with +, the person typed the whole
 *   international number, so no country code is added.
 */
export function resolvePhone(countryCode, input) {
    const trimmed = input.trim()
    if (trimmed === '') return { ok: true, digits: '' }

    if (!/^\+?[\d\s().-]+$/.test(trimmed)) return { ok: false, error: CHARACTER_ERROR }

    const typed = trimmed.replace(/\D/g, '')
    const country = getCountry(countryCode)
    const isFull = country === null || trimmed.startsWith('+')

    let digits
    if (isFull) {
        if (typed.startsWith('0')) {
            return {
                ok: false,
                error: 'Start with the country code, for example 44 for the UK. Leave out 00 and leading zeros, or choose the country above and type the local number.',
            }
        }
        digits = typed
    } else {
        const local = country.keepZero ? typed : typed.replace(/^0+/, '')
        if (local === '') return { ok: false, error: 'Enter the phone number after the country code.' }
        digits = `${country.dial}${local}`
    }

    if (digits.length < MIN_PHONE_DIGITS || digits.length > MAX_PHONE_DIGITS) {
        return { ok: false, error: LENGTH_ERROR }
    }
    return { ok: true, digits }
}

// Telegram usernames start with a letter and use letters, digits, and underscores. Most are 5 to
// 32 characters long, and collectible usernames can be as short as 4.
// People often paste "@name" or "t.me/name", so those are accepted and cleaned up.
export function normalizeUsername(input) {
    const cleaned = input
        .trim()
        .replace(/^(?:https?:\/\/)?(?:www\.)?t\.me\//i, '')
        .replace(/^@/, '')
    if (cleaned === '') return { ok: true, username: '' }

    if (!/^[A-Za-z][A-Za-z0-9_]{3,31}$/.test(cleaned)) {
        return {
            ok: false,
            error: 'A Telegram username starts with a letter and has letters, digits, or underscores. It is 4 to 32 characters long (usually 5 or more).',
        }
    }
    return { ok: true, username: cleaned }
}

// WhatsApp usernames are new and are still being rolled out, so these rules follow what has been
// published so far: 3 to 30 characters, lowercase letters, digits, underscores, and periods, with
// at least one letter, and no period at the start or end or two in a row.
// "@name" and "wa.me/name" are accepted, and capital letters are changed to small ones.
export function normalizeWhatsappUsername(input) {
    const cleaned = input
        .trim()
        .replace(/^(?:https?:\/\/)?(?:www\.)?wa\.me\//i, '')
        .replace(/^@/, '')
        .toLowerCase()
    if (cleaned === '') return { ok: true, username: '' }

    const valid =
        cleaned.length >= 3 &&
        cleaned.length <= 30 &&
        /^[a-z0-9_.]+$/.test(cleaned) &&
        /[a-z]/.test(cleaned) &&
        !cleaned.startsWith('.') &&
        !cleaned.endsWith('.') &&
        !cleaned.includes('..')
    if (!valid) {
        return {
            ok: false,
            error: 'A WhatsApp username is 3 to 30 characters long, with letters, digits, underscores, or periods. It needs at least one letter, and cannot start or end with a period or have two in a row.',
        }
    }
    return { ok: true, username: cleaned }
}

function normalizeShareUrl(input) {
    const trimmed = input.trim()
    if (trimmed === '') return { ok: true, url: '' }

    try {
        const parsed = new URL(trimmed)
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return { ok: true, url: parsed.href }
    } catch {
        // Falls through to the error below.
    }
    return { ok: false, error: 'Enter a full web address that starts with http:// or https://.' }
}

// encodeURIComponent turns spaces, line breaks, emoji, and symbols into safe %XX text.
const encode = (text) => encodeURIComponent(text)

/*
 * Builds the link. Returns one of:
 *  - { ok: true, link }        a link that can be opened or turned into a QR code
 *  - { ok: true, link: '' }    nothing has been entered yet (no error to show)
 *  - { ok: false, error }      something entered is not valid
 * `mode` is one of "whatsapp-phone", "whatsapp-username", "username" (Telegram), "phone"
 * (Telegram), or "share" (Telegram).
 */
export function buildLink({ mode, country, national, username, url, message }) {
    const text = message.trim()
    if (text.length > MAX_MESSAGE_LENGTH) {
        return { ok: false, error: `The message is too long. The limit is ${MAX_MESSAGE_LENGTH.toLocaleString('en-US')} characters.` }
    }
    const query = text ? `text=${encode(text)}` : ''

    if (mode === 'whatsapp-phone') {
        const number = resolvePhone(country, national)
        if (!number.ok) return number
        if (number.digits === '' && text === '') return { ok: true, link: '' }
        // Without a number the link opens WhatsApp so the person can choose who to send the message to.
        return { ok: true, link: `https://wa.me/${number.digits}${query ? `?${query}` : ''}` }
    }

    if (mode === 'whatsapp-username') {
        const name = normalizeWhatsappUsername(username)
        if (!name.ok) return name
        if (name.username === '') return { ok: true, link: '' }
        return { ok: true, link: `https://wa.me/${name.username}${query ? `?${query}` : ''}` }
    }

    if (mode === 'username') {
        const name = normalizeUsername(username)
        if (!name.ok) return name
        if (name.username === '') return { ok: true, link: '' }
        return { ok: true, link: `https://t.me/${name.username}${query ? `?${query}` : ''}` }
    }

    if (mode === 'phone') {
        const number = resolvePhone(country, national)
        if (!number.ok) return number
        if (number.digits === '') return { ok: true, link: '' }
        return { ok: true, link: `https://t.me/+${number.digits}${query ? `?${query}` : ''}` }
    }

    if (mode === 'share') {
        const target = normalizeShareUrl(url)
        if (!target.ok) return target
        if (target.url === '') return { ok: true, link: '' }
        return { ok: true, link: `https://t.me/share/url?url=${encode(target.url)}${query ? `&${query}` : ''}` }
    }

    return { ok: true, link: '' }
}