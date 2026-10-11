import jsQR from 'jsqr'
import { encode } from 'uqr'

export const MAX_FILE_MB = 10
export const EXAMPLE_TEXT = 'https://example.com'

// Scanning runs on the main thread, so large photos are scaled down first. Vector (SVG)
// images are drawn at a fixed size, because they stay sharp at any size.
const MAX_RASTER_SIZE = 1600
const SVG_SCAN_SIZE = 1024

const ERRORS = {
    unreadable:
        'This file could not be opened as an image. It may be damaged, or this browser may not support its format.',
    notFound:
        'No QR code was found in this image. Try a sharper image where the whole code is visible, with an empty margin around it.',
    noText: 'A QR code was found, but it does not contain readable text.',
    canvas: 'This image could not be processed in this browser.',
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error('The image failed to load.'))
        image.src = url
    })
}

async function readQrCode(url, { isSvg }) {
    let image
    try {
        image = await loadImage(url)
    } catch {
        return { ok: false, error: ERRORS.unreadable }
    }

    // An SVG without width and height can report a size of 0.
    const naturalWidth = image.naturalWidth || SVG_SCAN_SIZE
    const naturalHeight = image.naturalHeight || SVG_SCAN_SIZE
    const longSide = Math.max(naturalWidth, naturalHeight)
    const scale = isSvg ? SVG_SCAN_SIZE / longSide : Math.min(1, MAX_RASTER_SIZE / longSide)
    const width = Math.max(1, Math.round(naturalWidth * scale))
    const height = Math.max(1, Math.round(naturalHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return { ok: false, error: ERRORS.canvas }

    // Transparent pixels would be read as black, so paint a white background first.
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    const imageData = context.getImageData(0, 0, width, height)

    // jsQR tries the image as-is and inverted, so light-on-dark codes are read too.
    const code = jsQR(imageData.data, width, height)
    if (!code) return { ok: false, error: ERRORS.notFound }
    if (code.data === '') return { ok: false, error: ERRORS.noText }

    return {
        ok: true,
        result: { text: code.data, version: code.version, byteLength: code.binaryData.length },
    }
}

/*
 * Reads a QR code from an image at `url` (usually a blob URL). Always resolves, and never
 * throws: { ok: true, result: { text, version, byteLength } } or { ok: false, error }.
 * Drawing a huge image, reading its pixels, or the decoder itself can all fail in ways we
 * can't predict, and callers must never be left waiting on a promise that rejected.
 */
export async function scanImageUrl(url, { isSvg = false } = {}) {
    try {
        return await readQrCode(url, { isSvg })
    } catch {
        return { ok: false, error: ERRORS.canvas }
    }
}

/* ---------- What kind of content is it? ---------- */

const CONTENT_TYPES = [
    { id: 'url', label: 'Web link', pattern: /^https?:\/\//i },
    { id: 'wifi', label: 'Wi-Fi network', pattern: /^WIFI:/i },
    { id: 'email', label: 'Email', pattern: /^mailto:/i },
    { id: 'phone', label: 'Phone number', pattern: /^tel:/i },
    { id: 'sms', label: 'Text message', pattern: /^smsto?:/i },
    { id: 'geo', label: 'Location', pattern: /^geo:/i },
    { id: 'contact', label: 'Contact card', pattern: /^(BEGIN:VCARD|MECARD:)/i },
]

export function detectContentType(text) {
    const trimmed = text.trim()
    return CONTENT_TYPES.find((type) => type.pattern.test(trimmed)) ?? { id: 'text', label: 'Text' }
}

// Reading a code never makes its content safe, so every result gets a reminder.
const GENERIC_NOTE = 'Devora only reads the code. It does not check that the content is safe or trustworthy.'

const CONTENT_NOTES = {
    url: 'This is a web address. Devora has only read it and has not checked that it is safe. QR codes are sometimes used to send people to fake websites, so check the address carefully before opening it.',
    wifi: 'This code can join a Wi-Fi network and may include its password. Devora has not checked it. Only use it if you trust where it came from.',
}

export function getContentNote(typeId) {
    return CONTENT_NOTES[typeId] ?? GENERIC_NOTE
}

/* ---------- Example ---------- */

// Builds a small SVG QR code image of safe sample text, so the example always works. It
// goes through the same loading and scanning steps as a file the user chooses.
export function createExampleFile() {
    const { data } = encode(EXAMPLE_TEXT, { ecc: 'M', border: 4 })
    const modules = data.length

    let path = ''
    data.forEach((row, y) => {
        row.forEach((isDark, x) => {
            if (isDark) path += `M${x} ${y}h1v1h-1z`
        })
    })

    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${modules * 10}" height="${modules * 10}" ` +
        `viewBox="0 0 ${modules} ${modules}" shape-rendering="crispEdges">` +
        `<rect width="${modules}" height="${modules}" fill="#ffffff"/><path d="${path}"/></svg>`

    return new File([svg], 'example-qr-code.svg', { type: 'image/svg+xml' })
}