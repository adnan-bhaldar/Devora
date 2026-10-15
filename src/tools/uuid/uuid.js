export const LIMITS = { min: 1, max: 100 }

export const DEFAULT_SETTINGS = { count: 1, uppercase: false, hyphens: true }

const ERRORS = {
    unavailable: 'This browser does not provide a secure random number generator, so no UUID was created.',
}

export function isDefaultSettings(settings) {
    return Object.keys(DEFAULT_SETTINGS).every((key) => settings[key] === DEFAULT_SETTINGS[key])
}

/*
 * One random (version 4) UUID, always lowercase with hyphens. crypto.randomUUID() is the best
 * choice, but browsers only offer it on secure pages (HTTPS or localhost). The fallback builds
 * the same kind of UUID from crypto.getRandomValues, which works on any page.
 */
function randomUuid() {
    if (typeof globalThis.crypto.randomUUID === 'function') return globalThis.crypto.randomUUID()

    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
    // A UUID is 128 bits, but 6 of them are fixed: 4 say "version 4" and 2 mark the standard layout.
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
    return [
        hex.slice(0, 4).join(''),
        hex.slice(4, 6).join(''),
        hex.slice(6, 8).join(''),
        hex.slice(8, 10).join(''),
        hex.slice(10).join(''),
    ].join('-')
}

function createUuids(count) {
    return Array.from({ length: count }, randomUuid)
}

// Call this from event handlers, never while rendering, because every call gives new values.
// Always returns { ok: true, uuids } or { ok: false, error }.
export function generateUuids(count) {
    if (!globalThis.crypto?.getRandomValues) return { ok: false, error: ERRORS.unavailable }
    return { ok: true, uuids: createUuids(count) }
}

// Changes the list to `count` UUIDs: extra ones are cut from the end, missing ones are added.
// The UUIDs already in the list are kept.
export function adjustUuids(current, count) {
    if (count <= current.length) return { ok: true, uuids: current.slice(0, count) }

    const added = generateUuids(count - current.length)
    return added.ok ? { ok: true, uuids: [...current, ...added.uuids] } : added
}

// Formatting only changes how a UUID is shown. The value underneath is the same.
export function formatUuid(uuid, { uppercase, hyphens }) {
    const text = hyphens ? uuid : uuid.replace(/-/g, '')
    return uppercase ? text.toUpperCase() : text
}