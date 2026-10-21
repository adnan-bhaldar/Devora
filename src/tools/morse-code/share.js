import { readChoice, readInteger, toQuery } from '../../utils/shareLink.js'
import { DEFAULT_SETTINGS, MODES, PITCH, SPEED } from './morse.js'

// Only the direction, speed, and pitch are shared, never the text. Example: ?mode=decode&wpm=15&pitch=700
export function readSharedSettings(params) {
    return {
        mode: readChoice(
            params,
            'mode',
            MODES.map((option) => option.value),
            DEFAULT_SETTINGS.mode,
        ),
        wpm: readInteger(params, 'wpm', SPEED, DEFAULT_SETTINGS.wpm),
        frequency: readInteger(params, 'pitch', PITCH, DEFAULT_SETTINGS.frequency),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['mode', settings.mode],
        ['wpm', settings.wpm],
        ['pitch', settings.frequency],
    ])
}
