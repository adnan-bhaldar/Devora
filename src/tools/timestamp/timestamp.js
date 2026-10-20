/*
 * Unix timestamp helpers. A Unix timestamp counts the time since 1 January 1970 00:00:00 UTC
 * (the "epoch"). Everything here works in whole milliseconds, which is what JavaScript dates use.
 */

export const UNITS = [
    { value: 'auto', label: 'Auto-detect' },
    { value: 's', label: 'Seconds' },
    { value: 'ms', label: 'Milliseconds' },
    { value: 'us', label: 'Microseconds' },
    { value: 'ns', label: 'Nanoseconds' },
]

export const UNIT_NAMES = { s: 'seconds', ms: 'milliseconds', us: 'microseconds', ns: 'nanoseconds' }

// The years this tool can show: 0001-01-01 00:00:00 UTC to 9999-12-31 23:59:59.999 UTC.
export const MIN_MS = -62135596800000
export const MAX_MS = 253402300799999

export const EXAMPLE_TIMESTAMP = '1700000000'
export const EXAMPLE_DATE = '2026-03-15 09:30:00'

export const LOCAL = 'local'
export const DEFAULT_SETTINGS = { zone: LOCAL, unit: 'auto' }
export const isDefaultSettings = (settings) => settings.zone === DEFAULT_SETTINGS.zone && settings.unit === DEFAULT_SETTINGS.unit

const RANGE_ERROR = 'That date is outside the years 1 to 9999, which this tool can show.'

// ---------------------------------------------------------------------------------------------
// Time zones

export function localZone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    } catch {
        return 'UTC'
    }
}

export const resolveZone = (zone) => (zone === LOCAL ? localZone() : zone)

const FALLBACK_ZONES = [
    'UTC',
    'America/Los_Angeles',
    'America/New_York',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Paris',
    'Africa/Cairo',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Pacific/Auckland',
]

export function listZones() {
    try {
        const zones = Intl.supportedValuesOf('timeZone')
        return zones.includes('UTC') ? zones : ['UTC', ...zones]
    } catch {
        return FALLBACK_ZONES
    }
}

const formatters = new Map()
function formatterFor(zone) {
    if (!formatters.has(zone)) {
        formatters.set(
            zone,
            new Intl.DateTimeFormat('en-US', {
                timeZone: zone,
                hourCycle: 'h23',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),
        )
    }
    return formatters.get(zone)
}

// A UTC time from year/month/day parts. setUTCFullYear avoids Date.UTC's rule that turns years 0 to 99 into 1900 to 1999.
function utcFromParts(year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0) {
    const date = new Date(0)
    date.setUTCFullYear(year, month - 1, day)
    date.setUTCHours(hour, minute, second, millisecond)
    return date.getTime()
}

// The wall-clock time in a zone, and how many minutes that zone is ahead of UTC at that moment.
export function partsInZone(ms, zone) {
    const values = {}
    for (const part of formatterFor(zone).formatToParts(new Date(ms))) {
        if (part.type !== 'literal') values[part.type] = Number(part.value)
    }
    const wholeSecond = Math.floor(ms / 1000) * 1000
    const asIfUtc = utcFromParts(values.year, values.month, values.day, values.hour, values.minute, values.second)
    return {
        year: values.year,
        month: values.month,
        day: values.day,
        hour: values.hour,
        minute: values.minute,
        second: values.second,
        offset: Math.round((asIfUtc - wholeSecond) / 60000),
    }
}

const pad = (number, length = 2) => String(number).padStart(length, '0')

// "+05:30", or "Z" for UTC itself.
const formatOffset = (minutes, zone) => {
    if (zone === 'UTC') return 'Z'
    const sign = minutes < 0 ? '-' : '+'
    const absolute = Math.abs(minutes)
    return `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`
}

// "2026-03-15T09:30:00.000+05:30"
export function formatIso(ms, zone) {
    const p = partsInZone(ms, zone)
    const millisecond = ((ms % 1000) + 1000) % 1000
    return `${pad(p.year, 4)}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}.${pad(millisecond, 3)}${formatOffset(p.offset, zone)}`
}

// "2026-03-15 09:30:00", the form the date box accepts.
export function formatPlain(ms, zone) {
    const p = partsInZone(ms, zone)
    return `${pad(p.year, 4)}-${pad(p.month)}-${pad(p.day)} ${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}`
}

// "Friday, March 15, 2026 at 9:30:00 AM GMT+5:30"
export function formatHuman(ms, zone) {
    return new Intl.DateTimeFormat('en-US', { timeZone: zone, dateStyle: 'full', timeStyle: 'long' }).format(new Date(ms))
}

// "Fri, 15 Mar 2026 04:00:00 GMT": the form used by HTTP headers and email.
export const formatUtcString = (ms) => new Date(ms).toUTCString()

const RELATIVE_STEPS = [
    ['year', 365.2425 * 86400],
    ['month', (365.2425 / 12) * 86400],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
]

// "3 hours ago", "in 2 days", "now". `nowMs` is passed in so the same text is shown until the clock ticks.
export function formatRelative(ms, nowMs) {
    const seconds = Math.round((ms - nowMs) / 1000)
    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    for (const [unit, size] of RELATIVE_STEPS) {
        if (Math.abs(seconds) >= size || unit === 'second') return formatter.format(Math.round(seconds / size), unit)
    }
    return ''
}

// ---------------------------------------------------------------------------------------------
// Timestamp to date

// Which unit a number most likely uses, from the number of digits before any decimal point.
export function detectUnit(integerDigits) {
    const length = integerDigits.length
    if (length <= 11) return 's'
    if (length <= 14) return 'ms'
    if (length <= 17) return 'us'
    return 'ns'
}

const floorDivide = (a, b) => {
    const quotient = a / b
    return a % b !== 0n && a < 0n ? quotient - 1n : quotient
}

const BIG_MIN = BigInt(MIN_MS)
const BIG_MAX = BigInt(MAX_MS)

/*
 * Turns what was typed into milliseconds. Returns { ok: true, empty: true } for an empty box,
 * { ok: true, ms, unit, detected } on success, or { ok: false, error }.
 * Whole numbers use BigInt, so nanosecond timestamps (19 digits) lose nothing before they are
 * reduced to milliseconds. Anything finer than a millisecond is dropped, as JavaScript dates do.
 */
export function parseTimestamp(input, unitChoice) {
    const text = input.trim().replace(/[\s_]/g, '')
    if (text === '') return { ok: true, empty: true }

    if (!/^-?\d+(\.\d+)?$/.test(text)) {
        return { ok: false, error: 'Enter a number such as 1700000000. Letters and symbols are not allowed.' }
    }

    const integerDigits = text.replace(/^-/, '').split('.')[0]
    const detected = unitChoice === 'auto'
    const unit = detected ? detectUnit(integerDigits) : unitChoice

    let ms
    if (/^-?\d+$/.test(text)) {
        const value = BigInt(text)
        const scaled = { s: value * 1000n, ms: value, us: floorDivide(value, 1000n), ns: floorDivide(value, 1000000n) }[unit]
        if (scaled < BIG_MIN || scaled > BIG_MAX) return { ok: false, error: RANGE_ERROR }
        ms = Number(scaled)
    } else {
        const factor = { s: 1000, ms: 1, us: 0.001, ns: 0.000001 }[unit]
        ms = Math.round(Number(text) * factor)
        if (!Number.isFinite(ms) || ms < MIN_MS || ms > MAX_MS) return { ok: false, error: RANGE_ERROR }
    }

    return { ok: true, ms, unit, detected }
}

// ---------------------------------------------------------------------------------------------
// Date to timestamp

// A wall-clock time in a zone, turned into the real moment. Returns { ms, adjusted }.
// `adjusted` is true when the time does not exist in that zone (clocks skipped forward).
//
// The zone's offset can change near the time (daylight saving), so the offsets one day before and one
// day after are tried. Each gives a possible moment, and only the ones that really show the typed
// wall-clock time are kept:
//  - two kept (the clocks went back and the time happened twice): the earlier one is used.
//  - one kept: that one.
//  - none kept (the clocks jumped forward and the time never happened): the offset from before the
//    jump is used, which lands on the same wall-clock time one hour later, as most software does.
// Looking at both sides works for zones east and west of UTC alike.
function zonedToMs(year, month, day, hour, minute, second, millisecond, zone) {
    const wall = utcFromParts(year, month, day, hour, minute, second, millisecond)
    const DAY = 86400000
    const before = partsInZone(wall - DAY, zone).offset
    const after = partsInZone(wall + DAY, zone).offset

    const matches = [...new Set([before, after])]
        .map((offset) => wall - offset * 60000)
        .filter((candidate) => {
            const shown = partsInZone(candidate, zone)
            return (
                shown.year === year &&
                shown.month === month &&
                shown.day === day &&
                shown.hour === hour &&
                shown.minute === minute &&
                shown.second === second
            )
        })

    if (matches.length > 0) return { ms: Math.min(...matches), adjusted: false }
    return { ms: wall - before * 60000, adjusted: true }
}

const DATE_PATTERN =
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/i

const DATE_ERROR = 'Use a form such as 2026-03-15 09:30:00 or 2026-03-15T09:30:00Z. Year, month, and day are needed.'

/*
 * Reads a date typed as text: YYYY-MM-DD, optionally followed by a time (HH:mm, HH:mm:ss, or
 * HH:mm:ss.SSS) and optionally by Z or an offset such as +05:30. Without an offset the time is
 * read in the chosen zone. Returns { ok: true, empty: true }, { ok: true, ms, adjusted, usedOffset }
 * or { ok: false, error }.
 */
export function parseDate(input, zone) {
    const text = input.trim()
    if (text === '') return { ok: true, empty: true }

    const match = DATE_PATTERN.exec(text)
    if (!match) return { ok: false, error: DATE_ERROR }

    const [year, month, day, hour = 0, minute = 0, second = 0] = match.slice(1, 7).map((part) => (part === undefined ? undefined : Number(part)))
    const millisecond = match[7] ? Number(match[7].padEnd(3, '0').slice(0, 3)) : 0

    if (year < 1) return { ok: false, error: RANGE_ERROR }
    if (month < 1 || month > 12) return { ok: false, error: 'The month must be from 01 to 12.' }
    if (hour > 23 || minute > 59 || second > 59) {
        return { ok: false, error: 'The time must be from 00:00:00 to 23:59:59.' }
    }
    const daysInMonth = new Date(utcFromParts(year, month + 1, 0)).getUTCDate()
    if (day < 1 || day > daysInMonth) return { ok: false, error: `That month has ${daysInMonth} days.` }

    let ms
    let adjusted = false
    const offsetText = match[8]
    if (offsetText) {
        let offset = 0
        if (offsetText.toUpperCase() !== 'Z') {
            const digits = offsetText.slice(1).replace(':', '')
            const offsetHours = Number(digits.slice(0, 2))
            const offsetMinutes = Number(digits.slice(2))
            if (offsetHours > 23 || offsetMinutes > 59) return { ok: false, error: 'The offset must be like +05:30 or -08:00.' }
            offset = (offsetText[0] === '-' ? -1 : 1) * (offsetHours * 60 + offsetMinutes)
        }
        ms = utcFromParts(year, month, day, hour, minute, second, millisecond) - offset * 60000
    } else {
        ; ({ ms, adjusted } = zonedToMs(year, month, day, hour, minute, second, millisecond, zone))
    }

    if (ms < MIN_MS || ms > MAX_MS) return { ok: false, error: RANGE_ERROR }
    return { ok: true, ms, adjusted, usedOffset: Boolean(offsetText) }
}