import { readChoice, readInteger, toQuery } from '../../utils/shareLink.js'
import { COST, DEFAULT_SETTINGS, MODES, VERSIONS } from './bcrypt.js'

// Only the mode, cost, and version are shared. Passwords and hashes never are.
// Example: ?mode=verify&cost=12&version=2y
export function readSharedSettings(params) {
    return {
        mode: readChoice(
            params,
            'mode',
            MODES.map((option) => option.value),
            DEFAULT_SETTINGS.mode,
        ),
        cost: readInteger(params, 'cost', COST, DEFAULT_SETTINGS.cost),
        version: readChoice(
            params,
            'version',
            VERSIONS.map((option) => option.value),
            DEFAULT_SETTINGS.version,
        ),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['mode', settings.mode],
        ['cost', settings.cost],
        ['version', settings.version],
    ])
}