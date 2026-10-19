export const APPS = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
]

export const TELEGRAM_MODES = [
    { value: 'username', label: 'Chat by username' },
    { value: 'phone', label: 'Chat by phone number' },
    { value: 'share', label: 'Share a link' },
]

// The message is also placed inside a QR code, so it is kept short enough to scan easily.
export const MAX_MESSAGE_LENGTH = 1000

export const DEFAULT_SETTINGS = { app: 'whatsapp', telegramMode: 'username' }

export const EXAMPLES = {
    whatsapp: { phone: '+44 7700 900123', message: 'Hi! I found you through your website and have a question.' },
    telegram: { username: 'telegram', message: 'Hi! I found you through your website.' },
    share: { url: 'https://example.com', message: 'Worth a look!' },
}

/*
 * Phone numbers are written in many ways ("+44 (7700) 900-123"), but both apps want only the
 * digits, starting with the country code. Returns { ok: true, digits } or { ok: false, error }.
 * An empty value is "ok" with empty digits, so the caller decides whether a number is required.
 */
export function normalizePhone(input) {
    const trimmed = input.trim()
    if (trimmed === '') return { ok: true, digits: '' }

    if (!/^\+?[\d\s().-]+$/.test(trimmed)) {
        return { ok: false, error: 'Use only digits in the phone number. Spaces, dashes, brackets, and a leading + are fine.' }
    }

    const digits = trimmed.replace(/\D/g, '')
    if (digits.startsWith('0')) {
        return { ok: false, error: 'Start with the country code, for example 44 for the UK. Leave out + signs, 00, and leading zeros.' }
    }
    if (digits.length < 7 || digits.length > 15) {
        return { ok: false, error: 'A phone number with its country code has between 7 and 15 digits.' }
    }
    return { ok: true, digits }
}

// Telegram usernames are 5 to 32 letters, digits, or underscores, and start with a letter.
// People often paste "@name" or "t.me/name", so those are accepted and cleaned up.
export function normalizeUsername(input) {
    const cleaned = input
        .trim()
        .replace(/^(?:https?:\/\/)?(?:www\.)?t\.me\//i, '')
        .replace(/^@/, '')
    if (cleaned === '') return { ok: true, username: '' }

    if (!/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(cleaned)) {
        return {
            ok: false,
            error: 'A Telegram username has 5 to 32 letters, digits, or underscores, and starts with a letter.',
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
 * `mode` is "whatsapp", or one of the Telegram modes: "username", "phone", "share".
 */
export function buildLink({ mode, phone, username, url, message }) {
    const text = message.trim()
    if (text.length > MAX_MESSAGE_LENGTH) {
        return { ok: false, error: `The message is too long. The limit is ${MAX_MESSAGE_LENGTH.toLocaleString('en-US')} characters.` }
    }
    const query = text ? `text=${encode(text)}` : ''

    if (mode === 'whatsapp') {
        const number = normalizePhone(phone)
        if (!number.ok) return number
        if (number.digits === '' && text === '') return { ok: true, link: '' }
        // Without a number the link opens WhatsApp so the person can choose who to send the message to.
        return { ok: true, link: `https://wa.me/${number.digits}${query ? `?${query}` : ''}` }
    }

    if (mode === 'username') {
        const name = normalizeUsername(username)
        if (!name.ok) return name
        if (name.username === '') return { ok: true, link: '' }
        return { ok: true, link: `https://t.me/${name.username}${query ? `?${query}` : ''}` }
    }

    if (mode === 'phone') {
        const number = normalizePhone(phone)
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