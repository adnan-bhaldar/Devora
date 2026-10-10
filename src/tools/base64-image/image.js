import { BASE64_ERRORS, base64ToBytes, bytesToBase64 } from '../../utils/base64.js'

export const MAX_IMAGE_MB = 5
export const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024

// How many characters of a long result are shown on screen. Copying always uses the full text.
export const DISPLAY_LIMIT = 20000

export const OUTPUT_FORMATS = [
    { value: 'datauri', label: 'Data URI' },
    { value: 'base64', label: 'Base64 only' },
]

export const IMAGE_FORMATS = [
    { id: 'png', mime: 'image/png', extension: 'png', label: 'PNG' },
    { id: 'jpeg', mime: 'image/jpeg', extension: 'jpg', label: 'JPEG' },
    { id: 'gif', mime: 'image/gif', extension: 'gif', label: 'GIF' },
    { id: 'webp', mime: 'image/webp', extension: 'webp', label: 'WebP' },
    { id: 'svg', mime: 'image/svg+xml', extension: 'svg', label: 'SVG' },
    { id: 'bmp', mime: 'image/bmp', extension: 'bmp', label: 'BMP' },
    { id: 'avif', mime: 'image/avif', extension: 'avif', label: 'AVIF' },
]

// Both MIME types and extensions, because some browsers leave newer formats untyped.
export const ACCEPTED_FILES = [
    ...IMAGE_FORMATS.map((format) => format.mime),
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.svg',
    '.bmp',
    '.avif',
]

const ERRORS = {
    unreadable: 'That file could not be read. Please try again.',
    notImage:
        'This is valid Base64, but the decoded data is not a supported image (PNG, JPEG, GIF, WebP, SVG, BMP, or AVIF).',
    tooLarge: `This image is larger than the ${MAX_IMAGE_MB} MB limit.`,
    dataUri: 'The data URI is incomplete: it needs a comma before the data.',
    notBase64Uri: 'Only base64 data URIs are supported. The part before the comma must end in ;base64.',
}

const FORMAT_BY_ID = Object.fromEntries(IMAGE_FORMATS.map((format) => [format.id, format]))

const ascii = (text) => [...text].map((char) => char.charCodeAt(0))

function hasSignature(bytes, signature, offset = 0) {
    return signature.every((value, index) => bytes[offset + index] === value)
}

// The type is read from the file's first bytes, never trusted from its name or from the
// "data:image/..." text in front of it, which can be wrong or misleading.
export function detectImageFormat(bytes) {
    if (hasSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return FORMAT_BY_ID.png
    if (hasSignature(bytes, [0xff, 0xd8, 0xff])) return FORMAT_BY_ID.jpeg
    if (hasSignature(bytes, ascii('GIF8'))) return FORMAT_BY_ID.gif
    if (hasSignature(bytes, ascii('RIFF')) && hasSignature(bytes, ascii('WEBP'), 8)) return FORMAT_BY_ID.webp
    if (hasSignature(bytes, ascii('BM'))) return FORMAT_BY_ID.bmp
    if (
        hasSignature(bytes, ascii('ftyp'), 4) &&
        (hasSignature(bytes, ascii('avif'), 8) || hasSignature(bytes, ascii('avis'), 8))
    ) {
        return FORMAT_BY_ID.avif
    }

    // SVG is text, so look for the opening tag near the start.
    const start = new TextDecoder().decode(bytes.subarray(0, 2048))
    if (/<svg[\s>]/i.test(start)) return FORMAT_BY_ID.svg

    return null
}

export function toDataUri(mime, base64) {
    return `data:${mime};base64,${base64}`
}

// Image -> Base64: returns { ok: true, image } or { ok: false, error }.
export async function readImageFile(file) {
    let bytes
    try {
        bytes = new Uint8Array(await file.arrayBuffer())
    } catch {
        return { ok: false, error: ERRORS.unreadable }
    }

    const format = detectImageFormat(bytes)
    if (!format) {
        return {
            ok: false,
            error: `“${file.name}” does not look like a supported image. Its contents do not match PNG, JPEG, GIF, WebP, SVG, BMP, or AVIF.`,
        }
    }

    return {
        ok: true,
        image: {
            name: file.name,
            mime: format.mime,
            label: format.label,
            size: bytes.length,
            base64: bytesToBase64(bytes),
        },
    }
}

// Base64 -> Image. Accepts a base64 data URI or raw Base64. Returns
// { ok: true, image } (image is null for empty input) or { ok: false, error }.
export function parseImageInput(input) {
    const trimmed = input.trim()
    if (trimmed === '') return { ok: true, image: null }

    let payload = trimmed
    if (/^data:/i.test(trimmed)) {
        const comma = trimmed.indexOf(',')
        if (comma === -1) return { ok: false, error: ERRORS.dataUri }
        if (!/;base64$/i.test(trimmed.slice(0, comma))) return { ok: false, error: ERRORS.notBase64Uri }
        payload = trimmed.slice(comma + 1)
    }

    const compact = payload.replace(/\s+/g, '')
    if (compact === '') return { ok: true, image: null }

    // Every 4 Base64 characters hold 3 bytes. Checking first avoids decoding something huge.
    if (Math.floor((compact.length * 3) / 4) > MAX_IMAGE_BYTES) {
        return { ok: false, error: ERRORS.tooLarge }
    }

    const decoded = base64ToBytes(compact)
    if (!decoded.ok) return { ok: false, error: decoded.error }

    const format = detectImageFormat(decoded.bytes)
    if (!format) return { ok: false, error: ERRORS.notImage }

    return {
        ok: true,
        image: {
            ...format,
            bytes: decoded.bytes,
            size: decoded.bytes.length,
            dataUri: toDataUri(format.mime, bytesToBase64(decoded.bytes)),
        },
    }
}

// A small, safe sample generated in code, so the example is always valid.
const EXAMPLE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#5b4bff"/><stop offset="1" stop-color="#c147ff"/>' +
    '</linearGradient></defs>' +
    '<rect width="160" height="160" rx="32" fill="url(#g)"/>' +
    '<circle cx="80" cy="80" r="36" fill="none" stroke="#fff" stroke-width="10"/></svg>'

export function createExampleImage() {
    const bytes = new TextEncoder().encode(EXAMPLE_SVG)
    return {
        name: 'example.svg',
        mime: 'image/svg+xml',
        label: 'SVG',
        size: bytes.length,
        base64: bytesToBase64(bytes),
    }
}

export function createExampleDataUri() {
    const { mime, base64 } = createExampleImage()
    return toDataUri(mime, base64)
}