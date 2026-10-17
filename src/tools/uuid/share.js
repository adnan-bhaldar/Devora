import { flag, readFlag, readInteger, toQuery } from '../../utils/shareLink.js'
import { DEFAULT_SETTINGS, LIMITS } from './uuid.js'

// Only the settings are shared: never the UUIDs themselves.
// Example: ?count=5&uppercase=1&hyphens=0
export function readSharedSettings(params) {
    return {
        count: readInteger(params, 'count', LIMITS, DEFAULT_SETTINGS.count),
        uppercase: readFlag(params, 'uppercase', DEFAULT_SETTINGS.uppercase),
        hyphens: readFlag(params, 'hyphens', DEFAULT_SETTINGS.hyphens),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['count', settings.count],
        ['uppercase', flag(settings.uppercase)],
        ['hyphens', flag(settings.hyphens)],
    ])
}