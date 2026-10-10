import { encode } from 'uqr'

export const EXAMPLE_TEXT = 'https://example.com'

export const ERROR_LEVELS = [
    { value: 'L', label: 'Low' },
    { value: 'M', label: 'Medium' },
    { value: 'Q', label: 'Quartile' },
    { value: 'H', label: 'High' },
]

export const ERROR_LEVEL_INFO = {
    L: 'Recovers from about 7% damage. The smallest, simplest code.',
    M: 'Recovers from about 15% damage. A good default.',
    Q: 'Recovers from about 25% damage.',
    H: 'Recovers from about 30% damage. The densest code.',
}

// Most plain text a code can hold (at its largest size) for each error-correction level.
const CAPACITY = { L: 2953, M: 2331, Q: 1663, H: 1273 }

// The most any QR code can hold: 7,089 digits (largest size, Low error correction, digits
// only). Digits are the most compact content, so longer text cannot fit in any mode. The
// check runs before encoding because uqr builds one array entry per bit of the text before
// it notices the text is too long, which would freeze the page on a huge paste.
const MAX_TEXT_LENGTH = 7089

export const MARGINS = [
    { value: 0, label: 'None' },
    { value: 2, label: 'Small (2 modules)' },
    { value: 4, label: 'Standard (4 modules)' },
    { value: 8, label: 'Large (8 modules)' },
]

export const SIZES = [
    { value: 256, label: 'Small (256 px)' },
    { value: 512, label: 'Medium (512 px)' },
    { value: 1024, label: 'Large (1024 px)' },
]

export const DEFAULT_SETTINGS = {
    errorLevel: 'M',
    margin: 4,
    size: 512,
    foreground: '#000000',
    background: '#ffffff',
}

export function isDefaultSettings(settings) {
    return Object.keys(DEFAULT_SETTINGS).every((key) => settings[key] === DEFAULT_SETTINGS[key])
}

// Colors are inserted into SVG markup, so only plain 6-digit hex values are ever allowed through.
function normalizeColor(value, fallback) {
    return /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : fallback
}

// A "module" is one square of the code. A version 1 code is 21 x 21 modules, and each
// version adds 4 modules per side.
export function modulesPerSide(version) {
    return 17 + 4 * version
}

function tooLongMessage(level) {
    const name = ERROR_LEVELS.find((option) => option.value === level).label.toLowerCase()
    const advice = level === 'L' ? 'Try shorter text.' : 'Try shorter text or a lower error-correction level.'
    return `This text is too long for a QR code at the ${name} error-correction level. At this level a code holds about ${CAPACITY[level].toLocaleString()} characters of ordinary text, and fewer with emoji or non-English text. ${advice}`
}

const OVER_LIMIT_MESSAGE = `This text is longer than any QR code can hold. The absolute limit is ${MAX_TEXT_LENGTH.toLocaleString()} digits, and ordinary text fits far less (about ${CAPACITY.L.toLocaleString()} characters at best). Try much shorter text.`

/*
 * Returns { ok: true, qr } (qr is null for empty text) or { ok: false, error }.
 * qr.matrix is a grid read as matrix[row][column], true for a dark module. It already
 * includes the margin, because uqr adds the requested border to the grid.
 */
export function generateQr(text, { errorLevel, margin }) {
    if (text === '') return { ok: true, qr: null }
    if (text.length > MAX_TEXT_LENGTH) return { ok: false, error: OVER_LIMIT_MESSAGE }

    try {
        const result = encode(text, { ecc: errorLevel, border: margin })
        return { ok: true, qr: { matrix: result.data, version: result.version } }
    } catch (error) {
        if (error instanceof RangeError) return { ok: false, error: tooLongMessage(errorLevel) }
        return { ok: false, error: 'This text could not be turned into a QR code.' }
    }
}

// Calls back once for every horizontal run of dark modules: (startColumn, row, length).
// Drawing runs instead of single squares keeps the SVG and the canvas work small.
function forEachDarkRun(matrix, callback) {
    matrix.forEach((row, y) => {
        let x = 0
        while (x < row.length) {
            if (!row[x]) {
                x += 1
                continue
            }
            const start = x
            while (x < row.length && row[x]) x += 1
            callback(start, y, x - start)
        }
    })
}

export function buildSvg(matrix, { foreground, background, size }) {
    const modules = matrix.length
    const dark = normalizeColor(foreground, DEFAULT_SETTINGS.foreground)
    const light = normalizeColor(background, DEFAULT_SETTINGS.background)

    let path = ''
    forEachDarkRun(matrix, (x, y, length) => {
        path += `M${x} ${y}h${length}v1h-${length}z`
    })

    return (
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
        `viewBox="0 0 ${modules} ${modules}" shape-rendering="crispEdges">` +
        `<rect width="${modules}" height="${modules}" fill="${light}"/>` +
        `<path fill="${dark}" d="${path}"/></svg>`
    )
}

// Every module is drawn a whole number of pixels wide so edges stay sharp, so the image
// is at least `minSize` pixels and sometimes a little larger.
export function getPngSize(matrix, minSize) {
    const modules = matrix.length
    return modules * Math.max(1, Math.ceil(minSize / modules))
}

// Resolves to a PNG Blob, or null if the browser could not create one.
export function renderPngBlob(matrix, { foreground, background, minSize }) {
    const modules = matrix.length
    const scale = getPngSize(matrix, minSize) / modules

    const canvas = document.createElement('canvas')
    canvas.width = modules * scale
    canvas.height = modules * scale

    const context = canvas.getContext('2d')
    if (!context) return Promise.resolve(null)

    context.fillStyle = normalizeColor(background, DEFAULT_SETTINGS.background)
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = normalizeColor(foreground, DEFAULT_SETTINGS.foreground)
    forEachDarkRun(matrix, (x, y, length) => {
        context.fillRect(x * scale, y * scale, length * scale, scale)
    })

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

/* ---------- Color contrast ---------- */

function relativeLuminance(hex) {
    const [red, green, blue] = [1, 3, 5]
        .map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
        .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

// Scanners are built for dark codes on light backgrounds, so warn about the risky cases.
export function getColorWarning(foreground, background) {
    const dark = normalizeColor(foreground, DEFAULT_SETTINGS.foreground)
    const light = normalizeColor(background, DEFAULT_SETTINGS.background)
    const darkLuminance = relativeLuminance(dark)
    const lightLuminance = relativeLuminance(light)

    if (darkLuminance > lightLuminance) {
        return 'The code is lighter than its background. Some scanners can only read dark codes on a light background.'
    }
    if ((lightLuminance + 0.05) / (darkLuminance + 0.05) < 3) {
        return 'These colors have low contrast, so the code may be hard to scan.'
    }
    return ''
}