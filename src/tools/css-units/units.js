/*
 * The maths for the CSS unit converter. Every unit is first turned into pixels (CSS px), then
 * pixels are turned into the unit you asked for.
 *
 * Absolute units have a fixed size in CSS: 1 inch is exactly 96 px. They are CSS inches, not the
 * physical inches of your screen. Relative units depend on the settings: rem uses the root font
 * size, em and % use the parent font size, and the viewport units use the window size.
 */

export const UNITS = [
    { id: 'px', label: 'px (pixels)', group: 'Absolute' },
    { id: 'pt', label: 'pt (points)', group: 'Absolute' },
    { id: 'pc', label: 'pc (picas)', group: 'Absolute' },
    { id: 'in', label: 'in (inches)', group: 'Absolute' },
    { id: 'cm', label: 'cm (centimeters)', group: 'Absolute' },
    { id: 'mm', label: 'mm (millimeters)', group: 'Absolute' },
    { id: 'Q', label: 'Q (quarter-millimeters)', group: 'Absolute' },
    { id: 'rem', label: 'rem (root font size)', group: 'Relative' },
    { id: 'em', label: 'em (parent font size)', group: 'Relative' },
    { id: '%', label: '% (of parent font size)', group: 'Relative' },
    { id: 'vw', label: 'vw (viewport width)', group: 'Viewport' },
    { id: 'vh', label: 'vh (viewport height)', group: 'Viewport' },
    { id: 'vmin', label: 'vmin (smaller side)', group: 'Viewport' },
    { id: 'vmax', label: 'vmax (larger side)', group: 'Viewport' },
]

export const UNIT_OPTIONS = UNITS.map((unit) => ({ value: unit.id, label: unit.label }))
export const UNIT_IDS = UNITS.map((unit) => unit.id)

// Limits for the number settings. All are whole numbers.
export const LIMITS = {
    root: { min: 1, max: 100 },
    parent: { min: 1, max: 1000 },
    width: { min: 1, max: 10000 },
    height: { min: 1, max: 10000 },
    decimals: { min: 0, max: 6 },
}

export const DEFAULT_SETTINGS = {
    from: 'px',
    to: 'rem',
    root: 16,
    parent: 16,
    width: 1920,
    height: 1080,
    decimals: 4,
    showAll: false,
}

export const EXAMPLE_VALUE = '24'

export const isDefaultSettings = (settings) => Object.keys(DEFAULT_SETTINGS).every((key) => settings[key] === DEFAULT_SETTINGS[key])

// Common pixel sizes listed in the reference table.
export const COMMON_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96]

export const MAX_ABSOLUTE = 1e9

// How many CSS pixels one unit is. Relative units use the settings in `context`.
function pixelsPerUnit(unit, context) {
    switch (unit) {
        case 'px':
            return 1
        case 'in':
            return 96
        case 'cm':
            return 96 / 2.54
        case 'mm':
            return 96 / 25.4
        case 'Q':
            return 96 / 101.6
        case 'pt':
            return 96 / 72
        case 'pc':
            return 16
        case 'rem':
            return context.root
        case 'em':
            return context.parent
        case '%':
            return context.parent / 100
        case 'vw':
            return context.width / 100
        case 'vh':
            return context.height / 100
        case 'vmin':
            return Math.min(context.width, context.height) / 100
        case 'vmax':
            return Math.max(context.width, context.height) / 100
        default:
            return NaN
    }
}

export const toPixels = (value, unit, context) => value * pixelsPerUnit(unit, context)
export const fromPixels = (pixels, unit, context) => pixels / pixelsPerUnit(unit, context)
export const convert = (value, from, to, context) => fromPixels(toPixels(value, from, context), to, context)

const NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i

// Reads what was typed. Returns { empty: true } for a blank box, { error } for something that is not a
// number, and { value } otherwise. A comma is accepted as the decimal mark ("1,5").
export function parseValue(text) {
    const trimmed = text.trim()
    if (trimmed === '') return { empty: true }
    const normal = /^[+-]?\d+,\d+$/.test(trimmed) ? trimmed.replace(',', '.') : trimmed
    if (!NUMBER.test(normal)) return { error: 'Enter a number, such as 24 or 1.5.' }
    const value = Number(normal)
    if (!Number.isFinite(value) || Math.abs(value) > MAX_ABSOLUTE) {
        return { error: `Use a number between -${MAX_ABSOLUTE.toLocaleString('en-US')} and ${MAX_ABSOLUTE.toLocaleString('en-US')}.` }
    }
    return { value }
}

// Rounds to `decimals` places and drops trailing zeros: 1.50000 becomes "1.5". Never uses e-notation.
export function formatNumber(value, decimals) {
    const rounded = Number(value.toFixed(decimals))
    return Object.is(rounded, -0) ? '0' : String(rounded)
}

// "1.5rem" (for % the unit is written right after the number too: "150%").
export const formatWithUnit = (value, unit, decimals) => `${formatNumber(value, decimals)}${unit}`