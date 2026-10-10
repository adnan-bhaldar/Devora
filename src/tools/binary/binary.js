import { decodeUtf8 } from '../../utils/text.js'

export const MODES = [
    { value: 'encode', label: 'Text → Binary' },
    { value: 'decode', label: 'Binary → Text' },
]

// Safe sample data. The binary example is generated from it, so the two always match.
export const EXAMPLE_TEXT = 'Hello, Devora!'

const BINARY_PATTERN = /^[01]+$/

const ERRORS = {
    characters:
        'The input contains characters other than 0 and 1. Binary text uses only 0 and 1. Spaces and line breaks are ignored.',
    notText:
        'These bytes are not valid UTF-8 text. They may be binary data that is not text, or text in a different encoding.',
}

export function textToBinary(text, { spaced = true } = {}) {
    // TextEncoder always produces UTF-8, so characters like é or emoji become several bytes.
    const bytes = new TextEncoder().encode(text)
    const groups = Array.from(bytes, (byte) => byte.toString(2).padStart(8, '0'))
    return groups.join(spaced ? ' ' : '')
}

// Returns { ok: true, output } or { ok: false, error }.
export function binaryToText(input) {
    const groups = input.trim().split(/\s+/).filter(Boolean)
    if (groups.length === 0) return { ok: true, output: '' }

    if (!groups.every((group) => BINARY_PATTERN.test(group))) {
        return { ok: false, error: ERRORS.characters }
    }

    // Each space-separated group must hold whole bytes. Without this check, groups of the
    // wrong size (such as 7-bit values) could decode to the wrong text without any warning.
    const badIndex = groups.findIndex((group) => group.length % 8 !== 0)
    if (badIndex !== -1) {
        const bits = groups[badIndex].length
        const where = groups.length === 1 ? 'The input has' : `Group ${badIndex + 1} has`
        return {
            ok: false,
            error: `${where} ${bits} ${bits === 1 ? 'bit' : 'bits'}. Binary text needs a multiple of 8 bits for each byte, so a digit may be missing or extra.`,
        }
    }

    const bits = groups.join('')
    const bytes = new Uint8Array(bits.length / 8)
    for (let index = 0; index < bytes.length; index++) {
        bytes[index] = parseInt(bits.slice(index * 8, index * 8 + 8), 2)
    }

    const text = decodeUtf8(bytes)
    return text.ok ? { ok: true, output: text.text } : { ok: false, error: ERRORS.notText }
}

export function convert(mode, input, { spaced = true } = {}) {
    if (mode === 'decode') return binaryToText(input)
    return { ok: true, output: textToBinary(input, { spaced }) }
}