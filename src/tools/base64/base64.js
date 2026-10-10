import { base64ToBytes, bytesToBase64 } from '../../utils/base64.js'

export const MODES = [
    { value: 'encode', label: 'Encode' },
    { value: 'decode', label: 'Decode' },
]

// Safe sample data only: plain text and its Base64 form.
export const EXAMPLES = {
    encode: 'Hello, Devora!',
    decode: 'SGVsbG8sIERldm9yYSE=',
}

const NOT_TEXT_ERROR =
    'This Base64 decodes to data that is not valid UTF-8 text. It may be binary data, such as an image or a file, which this tool cannot show as text.'

export function encodeText(text, { urlSafe = false } = {}) {
    // TextEncoder always produces UTF-8, so emoji and non-English text encode correctly.
    const encoded = bytesToBase64(new TextEncoder().encode(text))
    if (!urlSafe) return encoded
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeBase64(input) {
    const decoded = base64ToBytes(input)
    if (!decoded.ok) return decoded

    try {
        // fatal: true makes invalid UTF-8 throw instead of silently becoming "�" characters.
        const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(decoded.bytes)
        return { ok: true, output: text }
    } catch {
        return { ok: false, error: NOT_TEXT_ERROR }
    }
}

export function convert(mode, input, { urlSafe = false } = {}) {
    if (mode === 'decode') return decodeBase64(input)
    return { ok: true, output: encodeText(input, { urlSafe }) }
}