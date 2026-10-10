const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/
const CHUNK_SIZE = 0x8000

export const BASE64_ERRORS = {
    characters:
        'The input contains characters that are not valid in Base64. Base64 uses letters, numbers, + and /, with = padding at the end. URL-safe Base64 uses - and _ instead of + and /.',
    length:
        'This is not valid Base64: its length cannot be right. A character may be missing or extra.',
    padding: 'The = padding at the end of the input is incorrect.',
}

// btoa() works on "binary strings" (one character per byte). Building that string in
// chunks avoids the call-stack limit that spreading a huge array into one call would hit.
export function bytesToBase64(bytes) {
    let binary = ''
    for (let index = 0; index < bytes.length; index += CHUNK_SIZE) {
        binary += String.fromCharCode(...bytes.subarray(index, index + CHUNK_SIZE))
    }
    return btoa(binary)
}

// Accepts standard and URL-safe Base64, ignores whitespace, and does not require padding.
// Returns { ok: true, bytes } or { ok: false, error }.
export function base64ToBytes(input) {
    const compact = input.replace(/\s+/g, '')
    if (compact === '') return { ok: true, bytes: new Uint8Array(0) }

    const standard = compact.replace(/-/g, '+').replace(/_/g, '/')
    if (!BASE64_PATTERN.test(standard)) return { ok: false, error: BASE64_ERRORS.characters }

    const body = standard.replace(/=+$/, '')
    const paddingCount = standard.length - body.length

    // One leftover character can never encode a whole byte.
    if (body.length % 4 === 1) return { ok: false, error: BASE64_ERRORS.length }

    const expectedPadding = (4 - (body.length % 4)) % 4
    if (paddingCount > 0 && paddingCount !== expectedPadding) {
        return { ok: false, error: BASE64_ERRORS.padding }
    }

    let binary
    try {
        binary = atob(body + '='.repeat(expectedPadding))
    } catch {
        return { ok: false, error: BASE64_ERRORS.characters }
    }

    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index++) {
        bytes[index] = binary.charCodeAt(index)
    }
    return { ok: true, bytes }
}