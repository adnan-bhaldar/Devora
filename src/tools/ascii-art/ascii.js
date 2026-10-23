import figlet from 'figlet'

/*
 * The ASCII art engine. Text mode uses the figlet library and its fonts (each font is its own small
 * download, fetched only when you pick it). Image mode turns each pixel's brightness into a character.
 * Nothing here touches the page, so it can be tested on its own.
 */

// ---- text mode ----

// Every font is listed in full so the build can find each file. `file` is the figlet font name.
const FONT_LIST = [
    { id: 'standard', label: 'Standard', load: () => import('figlet/importable-fonts/Standard.js') },
    { id: 'slant', label: 'Slant', load: () => import('figlet/importable-fonts/Slant.js') },
    { id: 'big', label: 'Big', load: () => import('figlet/importable-fonts/Big.js') },
    { id: 'block', label: 'Block', load: () => import('figlet/importable-fonts/Block.js') },
    { id: 'shadow', label: 'Shadow', load: () => import('figlet/importable-fonts/Shadow.js') },
    { id: '3d', label: '3-D', load: () => import('figlet/importable-fonts/3-D.js') },
    { id: 'banner3', label: 'Banner', load: () => import('figlet/importable-fonts/Banner3.js') },
    { id: 'small', label: 'Small', load: () => import('figlet/importable-fonts/Small.js') },
    { id: 'mini', label: 'Mini', load: () => import('figlet/importable-fonts/Mini.js') },
    { id: 'doom', label: 'Doom', load: () => import('figlet/importable-fonts/Doom.js') },
    { id: 'ogre', label: 'Ogre', load: () => import('figlet/importable-fonts/Ogre.js') },
    { id: 'larry3d', label: 'Larry 3D', load: () => import('figlet/importable-fonts/Larry 3D.js') },
    { id: 'bubble', label: 'Bubble', load: () => import('figlet/importable-fonts/Bubble.js') },
    { id: 'colossal', label: 'Colossal', load: () => import('figlet/importable-fonts/Colossal.js') },
    { id: 'graffiti', label: 'Graffiti', load: () => import('figlet/importable-fonts/Graffiti.js') },
    { id: 'speed', label: 'Speed', load: () => import('figlet/importable-fonts/Speed.js') },
    { id: 'starwars', label: 'Star Wars', load: () => import('figlet/importable-fonts/Star Wars.js') },
]

export const FONTS = FONT_LIST.map(({ id, label }) => ({ value: id, label }))
export const FONT_IDS = FONTS.map((font) => font.value)

export const LAYOUTS = [
    { value: 'default', label: 'Font default' },
    { value: 'full', label: 'Full spacing' },
    { value: 'fitted', label: 'Fitted' },
    { value: 'smush', label: 'Smushed (tight)' },
]
const FIGLET_LAYOUT = { default: 'default', full: 'full', fitted: 'fitted', smush: 'controlled smushing' }

// The character that replaces the font's own. "Font's own" keeps the font's characters.
export const FILLS = [
    { value: 'font', label: 'Original', char: null },
    { value: 'block', label: '█', ariaLabel: 'Solid block', char: '█' },
    { value: 'shade', label: '▓', ariaLabel: 'Dark shade', char: '▓' },
    { value: 'hash', label: '#', ariaLabel: 'Hash', char: '#' },
    { value: 'star', label: '*', ariaLabel: 'Asterisk', char: '*' },
    { value: 'at', label: '@', ariaLabel: 'At sign', char: '@' },
    { value: 'bullet', label: '•', ariaLabel: 'Bullet', char: '•' },
]

export const MAX_TEXT = 200
export const EXAMPLE_TEXT = 'Hello, Devora!'

const loadedFonts = new Map()

// Loads and registers a font, once.
export function loadFont(id) {
    const entry = FONT_LIST.find((font) => font.id === id) ?? FONT_LIST[0]
    if (!loadedFonts.has(entry.id)) {
        const promise = entry.load().then((module) => {
            figlet.parseFont(entry.id, module.default)
        })
        loadedFonts.set(entry.id, promise)
        promise.catch(() => loadedFonts.delete(entry.id))
    }
    return loadedFonts.get(entry.id)
}

// Replaces every visible character with `fill`; spaces stay spaces.
export function applyFill(art, fillId) {
    const char = FILLS.find((item) => item.value === fillId)?.char
    return char ? art.replace(/[^\s]/gu, char) : art
}

const trimEnds = (text) =>
    text
        .split('\n')
        .map((line) => line.replace(/\s+$/u, ''))
        .join('\n')

// Draws the text as figlet art. Each line you type is drawn on its own and never wrapped. The font must be loaded first.
export function renderText(text, { font, layout, fill }) {
    const lines = text.replace(/\r\n?/g, '\n').split('\n')
    const blocks = lines.map((line) => {
        if (line.trim() === '') return ''
        const art = figlet.textSync(line, {
            font,
            horizontalLayout: FIGLET_LAYOUT[layout] ?? 'default',
            width: 100000, // never wrap: the art stays on one line, and you scroll sideways
        })
        return trimEnds(art).replace(/^\n+|\n+$/g, '')
    })
    // Keep one empty row where the person left an empty line.
    return applyFill(blocks.join('\n\n').replace(/^\n+|\n+$/g, ''), fill)
}

// ---- image mode ----

// Characters from dark to light. A dark pixel gets the first one.
export const CHARSETS = [
    { value: 'classic', label: 'Classic', chars: '@%#*+=-:. ' },
    { value: 'detailed', label: 'Detailed', chars: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ' },
    { value: 'blocks', label: 'Blocks', chars: '█▓▒░ ' },
    { value: 'simple', label: 'Simple', chars: '#. ' },
    { value: 'binary', label: 'Binary', chars: '10 ' },
]

export const WIDTH = { min: 20, max: 200 }
export const ADJUST = { min: 0, max: 200 } // contrast and brightness, 100 means "unchanged"
export const MAX_FILE_MB = 10

// A character cell is about twice as tall as it is wide, so the picture is squeezed vertically.
const CELL_ASPECT = 0.5

// How many rows a picture needs for a given number of columns.
export const rowsFor = (imageWidth, imageHeight, columns) =>
    Math.max(1, Math.round((columns * imageHeight * CELL_ASPECT) / imageWidth))

// Brightness 0 (black) to 1 (white) of every pixel. Transparent pixels count as white paper.
export function lightness(data, count) {
    const result = new Float32Array(count)
    for (let index = 0; index < count; index += 1) {
        const offset = index * 4
        const alpha = data[offset + 3] / 255
        const channel = (value) => (value * alpha + 255 * (1 - alpha)) / 255
        result[index] = 0.2126 * channel(data[offset]) + 0.7152 * channel(data[offset + 1]) + 0.0722 * channel(data[offset + 2])
    }
    return result
}

/*
 * Turns brightness values into text. `contrast` and `brightness` are percentages where 100 means
 * unchanged. "Invert" swaps dark and light, which suits light text on a dark background.
 */
export function pixelsToAscii(data, columns, rows, { charset, contrast, brightness, invert }) {
    const chars = [...(CHARSETS.find((item) => item.value === charset) ?? CHARSETS[0]).chars]
    const values = lightness(data, columns * rows)
    const lines = []
    for (let row = 0; row < rows; row += 1) {
        let line = ''
        for (let column = 0; column < columns; column += 1) {
            let value = values[row * columns + column]
            value = (value - 0.5) * (contrast / 100) + 0.5 // contrast around the middle grey
            value *= brightness / 100
            value = Math.min(1, Math.max(0, value))
            if (invert) value = 1 - value
            line += chars[Math.min(chars.length - 1, Math.floor(value * chars.length))]
        }
        lines.push(line.replace(/\s+$/u, ''))
    }
    return lines.join('\n')
}