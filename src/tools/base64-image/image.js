import { base64ToBytes, bytesToBase64 } from '../../utils/base64.js'

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

// The sample is Devora's own app icon, written out in code so the example is always valid.
// It has a fixed width and height so it shows at a sensible size when previewed.
const EXAMPLE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24">' +
    '<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="#5b4bff"/><stop offset="100%" stop-color="#c147ff"/>' +
    '</linearGradient></defs>' +
    '<rect width="24" height="24" rx="6" fill="url(#g)"/>' +
    '<g stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" fill="none" transform="translate(3 3) scale(0.75)">' +
    '<path d="M12 19h8"/><path d="m4 17 6-6-6-6"/></g></svg>'

export function createExampleImage() {
    const bytes = new TextEncoder().encode(EXAMPLE_SVG)
    return {
        name: 'devora-icon.svg',
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

// ---------- Saving the decoded image in another format ----------

// The formats the download can be converted to. Browsers can write all three from a canvas.
export const DOWNLOAD_FORMATS = [
    { value: 'original', label: 'Original' },
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPG' },
    { value: 'webp', label: 'WebP' },
]

// JPG and WebP are "lossy": a lower quality gives a smaller file with less detail.
export const LOSSY_FORMATS = ['jpeg', 'webp']
export const DEFAULT_QUALITY = 90

// Very large pictures can make a browser run out of memory, so conversion stops above this.
const MAX_PIXELS = 50_000_000
// SVG images may have no size of their own, so they are drawn at this size when that happens.
const FALLBACK_SVG_SIZE = 1024

const CONVERT_ERRORS = {
    load: 'The image could not be loaded for conversion.',
    tooBig: 'This image is too large to convert in the browser. Download the original instead.',
    canvas: 'Your browser could not prepare the image for conversion.',
}

function loadImage(dataUri) {
    return new Promise((resolve, reject) => {
        const element = new Image()
        element.onload = () => resolve(element)
        element.onerror = () => reject(new Error(CONVERT_ERRORS.load))
        element.src = dataUri
    })
}

function canvasToBlob(canvas, mime, quality) {
    return new Promise((resolve) => canvas.toBlob(resolve, mime, quality))
}

/*
 * Converts a decoded image (from parseImageInput) to PNG, JPG, or WebP by drawing it on a
 * canvas and saving the canvas. quality is 1-100 and only affects JPG and WebP.
 * Returns { ok: true, blob, extension } or { ok: false, error }.
 *
 * - Choosing "original", or the format the image already has, returns the untouched bytes,
 *   so nothing is lost.
 * - JPG cannot store transparency, so transparent areas are filled with white.
 * - Animated images (GIF, WebP) are saved as their first frame.
 */
export async function convertImage(image, target, quality = DEFAULT_QUALITY) {
    if (target === 'original' || target === image.id) {
        return { ok: true, blob: new Blob([image.bytes], { type: image.mime }), extension: image.extension }
    }

    const format = FORMAT_BY_ID[target]
    if (!format) return { ok: false, error: CONVERT_ERRORS.canvas }

    let picture
    try {
        picture = await loadImage(image.dataUri)
    } catch (error) {
        return { ok: false, error: error.message }
    }

    const isSvg = image.id === 'svg'
    const width = picture.naturalWidth || (isSvg ? FALLBACK_SVG_SIZE : 0)
    const height = picture.naturalHeight || (isSvg ? FALLBACK_SVG_SIZE : 0)
    if (width === 0 || height === 0) return { ok: false, error: CONVERT_ERRORS.load }
    if (width * height > MAX_PIXELS) return { ok: false, error: CONVERT_ERRORS.tooBig }

    // Drawing and saving can throw (for example on a very large image), so errors are caught
    // and reported like any other conversion problem.
    let blob
    try {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d')
        if (!context) return { ok: false, error: CONVERT_ERRORS.canvas }

        if (target === 'jpeg') {
            context.fillStyle = '#ffffff'
            context.fillRect(0, 0, width, height)
        }
        context.drawImage(picture, 0, 0, width, height)

        blob = await canvasToBlob(canvas, format.mime, quality / 100)
    } catch {
        return { ok: false, error: CONVERT_ERRORS.canvas }
    }

    // A browser that cannot write a format quietly saves PNG instead, so the type is checked.
    if (!blob || blob.type !== format.mime) {
        return { ok: false, error: `Your browser cannot save images as ${format.label}. Try another format.` }
    }

    return { ok: true, blob, extension: format.extension }
}