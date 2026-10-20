import bcrypt from 'bcryptjs'

/*
 * bcrypt turns a password into a hash that is slow to calculate on purpose, so guessing
 * passwords is slow too. bcryptjs is a pure JavaScript version, so it runs in the browser.
 * Its async functions work in short steps, which keeps the page responsive while it works.
 */

export const COST = { min: 4, max: 14 }
// A hash that someone else made can use a higher cost. Above this the browser would be busy for too long.
export const MAX_VERIFY_COST = 15

export const VERSIONS = [
    { value: '2b', label: '$2b$ (current)' },
    { value: '2a', label: '$2a$ (older)' },
    { value: '2y', label: '$2y$ (PHP)' },
]

export const MODES = [
    { value: 'generate', label: 'Generate a hash' },
    { value: 'verify', label: 'Check a password' },
]

export const DEFAULT_SETTINGS = { mode: 'generate', cost: 10, version: '2b' }
export const isDefaultSettings = (settings) =>
    settings.mode === DEFAULT_SETTINGS.mode && settings.cost === DEFAULT_SETTINGS.cost && settings.version === DEFAULT_SETTINGS.version

// bcrypt only reads the first 72 bytes of a password.
export const MAX_PASSWORD_BYTES = 72
export const byteLength = (text) => new TextEncoder().encode(text).length

// A sample pair for "Try an example". The hash was made from this password at cost 10.
export const EXAMPLE_PASSWORD = 'correct horse battery'
export const EXAMPLE_HASH = '$2b$10$8uNXOKG3ws0.On39Maw75.6Hnsp0Dtgkh27/vB7Wkkc3s9L1Zac7W'

// $2b$10$ then 22 characters of salt and 31 characters of hash.
const HASH_PATTERN = /^\$(2[aby])\$(\d{2})\$([./A-Za-z0-9]{53})$/

// Reads the version and cost out of a hash. Returns { ok: true, version, cost } or { ok: false, error }.
export function parseHash(text) {
    const match = HASH_PATTERN.exec(text.trim())
    if (!match) {
        return { ok: false, error: 'This does not look like a bcrypt hash. It starts with $2a$, $2b$, or $2y$ and is 60 characters long.' }
    }
    const cost = Number(match[2])
    if (cost < 4 || cost > 31) return { ok: false, error: 'A bcrypt cost is from 04 to 31.' }
    if (cost > MAX_VERIFY_COST) {
        return { ok: false, error: `This hash has a cost of ${cost}. Checking it would keep your browser busy for far too long, so costs above ${MAX_VERIFY_COST} are not supported.` }
    }
    return { ok: true, version: match[1], cost }
}

const GENERIC_ERROR = 'Something went wrong while hashing. Try again.'

export async function generateHash(password, { cost, version }) {
    try {
        const started = performance.now()
        // genSalt makes a random salt with the "$2b$" prefix. The prefix is swapped for the chosen version.
        const salt = (await bcrypt.genSalt(cost)).replace(/^\$2[aby]\$/, `$${version}$`)
        const hash = await bcrypt.hash(password, salt)
        return { ok: true, hash, version, cost, milliseconds: Math.round(performance.now() - started) }
    } catch {
        return { ok: false, error: GENERIC_ERROR }
    }
}

export async function verifyPassword(password, hash) {
    const info = parseHash(hash)
    if (!info.ok) return info
    try {
        const started = performance.now()
        const match = await bcrypt.compare(password, hash.trim())
        return { ok: true, match, version: info.version, cost: info.cost, milliseconds: Math.round(performance.now() - started) }
    } catch {
        return { ok: false, error: GENERIC_ERROR }
    }
}