import { flag, readFlag, toQuery } from '../../utils/shareLink.js'
import { DEFAULT_SETTINGS } from './cases.js'

// Only the options are shared, never the text. Example: ?small=1
export function readSharedSettings(params) {
    return { smallWords: readFlag(params, 'small', DEFAULT_SETTINGS.smallWords) }
}

export function toShareQuery(settings) {
    return toQuery([['small', flag(settings.smallWords)]])
}