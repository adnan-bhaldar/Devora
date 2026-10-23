import { flag, readChoice, readFlag, readInteger, toQuery } from '../../utils/shareLink.js'
import { ADJUST, CHARSETS, FILLS, FONT_IDS, LAYOUTS, WIDTH } from './ascii.js'
import { DEFAULT_SETTINGS, MODES, SIZES } from './settings.js'

// Only the choices are shared, never your text or picture. Example: ?mode=text&font=slant&fill=hash
export function readSharedSettings(params) {
    return {
        mode: readChoice(params, 'mode', MODES.map((item) => item.value), DEFAULT_SETTINGS.mode),
        font: readChoice(params, 'font', FONT_IDS, DEFAULT_SETTINGS.font),
        layout: readChoice(params, 'layout', LAYOUTS.map((item) => item.value), DEFAULT_SETTINGS.layout),
        fill: readChoice(params, 'fill', FILLS.map((item) => item.value), DEFAULT_SETTINGS.fill),
        columns: readInteger(params, 'cols', WIDTH, DEFAULT_SETTINGS.columns),
        contrast: readInteger(params, 'contrast', ADJUST, DEFAULT_SETTINGS.contrast),
        brightness: readInteger(params, 'bright', ADJUST, DEFAULT_SETTINGS.brightness),
        charset: readChoice(params, 'chars', CHARSETS.map((item) => item.value), DEFAULT_SETTINGS.charset),
        invert: readFlag(params, 'invert', DEFAULT_SETTINGS.invert),
        size: readChoice(params, 'size', SIZES.map((item) => item.value), DEFAULT_SETTINGS.size),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['mode', settings.mode],
        ['font', settings.font],
        ['layout', settings.layout],
        ['fill', settings.fill],
        ['cols', settings.columns],
        ['contrast', settings.contrast],
        ['bright', settings.brightness],
        ['chars', settings.charset],
        ['invert', flag(settings.invert)],
        ['size', settings.size],
    ])
}