import { base64ToBytes, bytesToBase64, bytesToBase64Url } from '../../utils/base64.js'
import { decodeUtf8 } from '../../utils/text.js'

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
    const bytes = new TextEncoder().encode(text)
    return urlSafe ? bytesToBase64Url(bytes) : bytesToBase64(bytes)
}

export function decodeBase64(input) {
    const decoded = base64ToBytes(input)
    if (!decoded.ok) return decoded

    const text = decodeUtf8(decoded.bytes)
    return text.ok ? { ok: true, output: text.text } : { ok: false, error: NOT_TEXT_ERROR }
}

export function convert(mode, input, { urlSafe = false } = {}) {
    if (mode === 'decode') return decodeBase64(input)
    return { ok: true, output: encodeText(input, { urlSafe }) }
}