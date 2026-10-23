import { flag, readFlag, readInteger, toQuery } from '../../utils/shareLink.js'
import { DEFAULT_SETTINGS, LIMITS, UNIT_IDS } from './units.js'

// A "%" cannot go in a link as it is, so it is written as "pct" and turned back when the link is read.
const encodeUnit = (unit) => (unit === '%' ? 'pct' : unit)
const readUnit = (params, key, fallback) => {
    const raw = params.get(key)
    const unit = raw === 'pct' ? '%' : raw
    return UNIT_IDS.includes(unit) ? unit : fallback
}

// Only the units and settings are shared, never the number you typed. Example: ?from=px&to=rem&root=16
export function readSharedSettings(params) {
    return {
        from: readUnit(params, 'from', DEFAULT_SETTINGS.from),
        to: readUnit(params, 'to', DEFAULT_SETTINGS.to),
        root: readInteger(params, 'root', LIMITS.root, DEFAULT_SETTINGS.root),
        parent: readInteger(params, 'parent', LIMITS.parent, DEFAULT_SETTINGS.parent),
        width: readInteger(params, 'vw', LIMITS.width, DEFAULT_SETTINGS.width),
        height: readInteger(params, 'vh', LIMITS.height, DEFAULT_SETTINGS.height),
        decimals: readInteger(params, 'dp', LIMITS.decimals, DEFAULT_SETTINGS.decimals),
        showAll: readFlag(params, 'all', DEFAULT_SETTINGS.showAll),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['from', encodeUnit(settings.from)],
        ['to', encodeUnit(settings.to)],
        ['root', settings.root],
        ['parent', settings.parent],
        ['vw', settings.width],
        ['vh', settings.height],
        ['dp', settings.decimals],
        ['all', flag(settings.showAll)],
    ])
}