/*
 * Helpers for shareable tool settings ("Copy link").
 *
 * Rules every tool follows:
 *  - Only harmless settings go in a link (an algorithm, a length, a checkbox). Never text the
 *    person typed, and never anything generated from it (passwords, hashes, tokens, UUIDs).
 *  - Everything read from a link is checked against a whitelist or a number range, so a
 *    hand-edited or broken link falls back to the default instead of breaking the tool.
 */

// A value that must be one of `allowed`; anything else gives `fallback`.
export function readChoice(params, key, allowed, fallback) {
    const value = params.get(key)
    return allowed.includes(value) ? value : fallback
}

// "1" means on, "0" means off. Anything else gives `fallback`.
export function readFlag(params, key, fallback) {
    const value = params.get(key)
    if (value === '1') return true
    if (value === '0') return false
    return fallback
}

// A whole number. Numbers outside the range are clamped to it; anything else gives `fallback`.
export function readInteger(params, key, { min, max }, fallback) {
    const value = params.get(key)
    if (value === null || !/^\d{1,6}$/.test(value)) return fallback
    return Math.min(max, Math.max(min, Number(value)))
}

// Turns [['length', 16], ['symbols', 1]] into "length=16&symbols=1". The values are always
// short whitelisted words or numbers, so no extra encoding is needed (and the link stays readable).
export function toQuery(entries) {
    return entries.map(([key, value]) => `${key}=${value}`).join('&')
}

export function buildShareUrl(query) {
    return `${window.location.origin}${window.location.pathname}?${query}`
}

export const flag = (value) => (value ? 1 : 0)