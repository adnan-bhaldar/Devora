import { flag, readChoice, readFlag, toQuery } from '../../utils/shareLink.js'
import { CASES, DEFAULT_SETTINGS } from './cases.js'

// Only the chosen case and the options are shared, never the text. Example: ?case=snake&small=1
export function readSharedSettings(params) {
    return {
        caseId: readChoice(
            params,
            'case',
            CASES.map((item) => item.id),
            DEFAULT_SETTINGS.caseId,
        ),
        smallWords: readFlag(params, 'small', DEFAULT_SETTINGS.smallWords),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['case', settings.caseId],
        ['small', flag(settings.smallWords)],
    ])
}