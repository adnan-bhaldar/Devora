import { flag, readFlag, readInteger, toQuery } from '../../utils/shareLink.js'
import { CHARACTER_TYPES, DEFAULT_SETTINGS, LIMITS } from './password.js'

// Only the settings are shared: never a password.
// Example: ?length=24&types=lowercase,uppercase,numbers&avoidLookalikes=1
const TYPE_KEYS = CHARACTER_TYPES.map((type) => type.key)

export function readSharedSettings(params) {
    const requested = (params.get('types') ?? '').split(',').filter((key) => TYPE_KEYS.includes(key))
    // At least one type is always needed, so a link with none (or none valid) keeps every type on.
    const types = requested.length > 0 ? requested : TYPE_KEYS

    return {
        length: readInteger(params, 'length', LIMITS, DEFAULT_SETTINGS.length),
        ...Object.fromEntries(TYPE_KEYS.map((key) => [key, types.includes(key)])),
        avoidAmbiguous: readFlag(params, 'avoidLookalikes', DEFAULT_SETTINGS.avoidAmbiguous),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['length', settings.length],
        ['types', TYPE_KEYS.filter((key) => settings[key]).join(',')],
        ['avoidLookalikes', flag(settings.avoidAmbiguous)],
    ])
}