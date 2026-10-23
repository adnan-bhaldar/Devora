import { flag, readChoice, readFlag, toQuery } from '../../utils/shareLink.js'
import { PRECISIONS, VIEWS } from './diff.js'
import { DEFAULT_SETTINGS, defaultView } from './settings.js'

// Only the display choices are shared, never the texts. Example: ?view=unified&precision=word&space=1
export function readSharedSettings(params) {
    return {
        view: readChoice(params, 'view', VIEWS.map((item) => item.value), defaultView()),
        precision: readChoice(params, 'precision', PRECISIONS.map((item) => item.value), DEFAULT_SETTINGS.precision),
        ignoreWhitespace: readFlag(params, 'space', DEFAULT_SETTINGS.ignoreWhitespace),
        ignoreCase: readFlag(params, 'case', DEFAULT_SETTINGS.ignoreCase),
        hideUnchanged: readFlag(params, 'hide', DEFAULT_SETTINGS.hideUnchanged),
        wrap: readFlag(params, 'wrap', DEFAULT_SETTINGS.wrap),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['view', settings.view],
        ['precision', settings.precision],
        ['space', flag(settings.ignoreWhitespace)],
        ['case', flag(settings.ignoreCase)],
        ['hide', flag(settings.hideUnchanged)],
        ['wrap', flag(settings.wrap)],
    ])
}