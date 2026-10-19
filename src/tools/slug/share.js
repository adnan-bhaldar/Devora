import { flag, readChoice, readFlag, readInteger, toQuery } from '../../utils/shareLink.js'
import { DEFAULT_SETTINGS, LENGTH_LIMITS, SEPARATORS } from './slug.js'

// Only the settings are shared, never the text. Example: ?separator=underscore&lowercase=0&limit=1&max=40
export function readSharedSettings(params) {
    return {
        separator: readChoice(
            params,
            'separator',
            SEPARATORS.map((option) => option.value),
            DEFAULT_SETTINGS.separator,
        ),
        lowercase: readFlag(params, 'lowercase', DEFAULT_SETTINGS.lowercase),
        removeStopWords: readFlag(params, 'stopwords', DEFAULT_SETTINGS.removeStopWords),
        keepUnicode: readFlag(params, 'unicode', DEFAULT_SETTINGS.keepUnicode),
        limitLength: readFlag(params, 'limit', DEFAULT_SETTINGS.limitLength),
        maxLength: readInteger(params, 'max', LENGTH_LIMITS, DEFAULT_SETTINGS.maxLength),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['separator', settings.separator],
        ['lowercase', flag(settings.lowercase)],
        ['stopwords', flag(settings.removeStopWords)],
        ['unicode', flag(settings.keepUnicode)],
        ['limit', flag(settings.limitLength)],
        ['max', settings.maxLength],
    ])
}