import { flag, readChoice, readFlag, readInteger, toQuery } from '../../utils/shareLink.js'
import { DEFAULT_SETTINGS, LIMITS, UNITS } from './lorem.js'

// Only the settings are shared. The text itself is random, so it is not part of the link.
// Example: ?unit=words&amount=100&startWithLorem=1
export function readSharedSettings(params) {
    const unit = readChoice(
        params,
        'unit',
        UNITS.map((option) => option.value),
        DEFAULT_SETTINGS.unit,
    )
    // Each unit has its own range, so the amount is checked against the unit that was chosen.
    const defaultAmount = unit === DEFAULT_SETTINGS.unit ? DEFAULT_SETTINGS.amount : LIMITS[unit].default

    return {
        unit,
        amount: readInteger(params, 'amount', LIMITS[unit], defaultAmount),
        startWithLorem: readFlag(params, 'startWithLorem', DEFAULT_SETTINGS.startWithLorem),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['unit', settings.unit],
        ['amount', settings.amount],
        ['startWithLorem', flag(settings.startWithLorem)],
    ])
}