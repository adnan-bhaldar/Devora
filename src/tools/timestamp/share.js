import { readChoice, toQuery } from '../../utils/shareLink.js'
import { DEFAULT_SETTINGS, LOCAL, UNITS, listZones } from './timestamp.js'

// Only the time zone and the unit are shared, never a timestamp or date you typed.
// Example: ?zone=Asia/Kolkata&unit=ms (the zone is "local" for the visitor's own zone)
export function readSharedSettings(params) {
    return {
        zone: readChoice(params, 'zone', [LOCAL, ...listZones()], DEFAULT_SETTINGS.zone),
        unit: readChoice(
            params,
            'unit',
            UNITS.map((option) => option.value),
            DEFAULT_SETTINGS.unit,
        ),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['zone', settings.zone],
        ['unit', settings.unit],
    ])
}