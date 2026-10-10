export const MODES = [
    { value: 'encode', label: 'Encode' },
    { value: 'decode', label: 'Decode' },
]

// Safe sample data only: plain text and its Base64 form.
export const EXAMPLES = {
    encode: 'Hello, Devora!',
    decode: 'SGVsbG8sIERldm9yYSE=',
}

const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/
const CHUNK_SIZE = 0x8000

// btoa() works on "binary strings" (one character per byte). Building that string in
// chunks avoids the call-stack limit that spreading a huge array into one call would hit.
function bytesToBase64(bytes) {
    let binary = ''
    for (let index = 0; index < bytes.length; index += CHUNK_SIZE) {
        binary += String.fromCharCode(...bytes.subarray(index, index + CHUNK_SIZE))
    }
    return btoa(binary)
}

export function encodeText(text, { urlSafe = false } = {}) {
    // TextEncoder always produces UTF-8, so emoji and non-English text encode correctly.
    const encoded = bytesToBase64(new TextEncoder().encode(text))
    if (!urlSafe) return encoded
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const ERRORS = {
    characters:
        'The input contains characters that are not valid in Base64. Base64 uses letters, numbers, + and /, with = padding at the end. URL-safe Base64 uses - and _ instead of + and /.',
    length:
        'This is not valid Base64: its length cannot be right. A character may be missing or extra.',
    padding: 'The = padding at the end of the input is incorrect.',
    notText:
        'This Base64 decodes to data that is not valid UTF-8 text. It may be binary data, such as an image or a file, which this tool cannot show as text.',
}

// Accepts standard and URL-safe Base64, ignores whitespace, and does not require padding.
export function decodeBase64(input) {
    const compact = input.replace(/\s+/g, '')
    if (compact === '') return { ok: true, output: '' }

    const standard = compact.replace(/-/g, '+').replace(/_/g, '/')
    if (!BASE64_PATTERN.test(standard)) return { ok: false, error: ERRORS.characters }

    const body = standard.replace(/=+$/, '')
    const paddingCount = standard.length - body.length

    // One leftover character can never encode a whole byte.
    if (body.length % 4 === 1) return { ok: false, error: ERRORS.length }

    const expectedPadding = (4 - (body.length % 4)) % 4
    if (paddingCount > 0 && paddingCount !== expectedPadding) {
        return { ok: false, error: ERRORS.padding }
    }

    let binary
    try {
        binary = atob(body + '='.repeat(expectedPadding))
    } catch {
        return { ok: false, error: ERRORS.characters }
    }

    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))

    try {
        // fatal: true makes invalid UTF-8 throw instead of silently becoming "�" characters.
        const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes)
        return { ok: true, output: text }
    } catch {
        return { ok: false, error: ERRORS.notText }
    }
}

export function convert(mode, input, { urlSafe = false } = {}) {
    if (mode === 'decode') return decodeBase64(input)
    return { ok: true, output: encodeText(input, { urlSafe }) }
}