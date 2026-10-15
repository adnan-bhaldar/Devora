export const LIMITS = { min: 4, max: 128 }

export const DEFAULT_SETTINGS = {
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: false,
}

export const CHARACTER_TYPES = [
    { key: 'lowercase', label: 'Lowercase letters', hint: 'a–z' },
    { key: 'uppercase', label: 'Uppercase letters', hint: 'A–Z' },
    { key: 'numbers', label: 'Numbers', hint: '0–9' },
    { key: 'symbols', label: 'Symbols', hint: '! @ # $ % ^ & * ( ) - _ = + [ ] { } : ; , . ?' },
]

const SETS = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{}:;,.?',
}

// Characters that are easy to mix up when read or typed.
const AMBIGUOUS = 'Il1O0o'

const MAX_ATTEMPTS = 10000

const ERRORS = {
    noTypes: 'Choose at least one type of character.',
    unavailable: 'This browser does not provide a secure random number generator, so no password was created.',
    failed: 'A password could not be created. Please try again.',
}

export function clampLength(value) {
    if (!Number.isFinite(value)) return DEFAULT_SETTINGS.length
    return Math.min(LIMITS.max, Math.max(LIMITS.min, Math.round(value)))
}

export function isDefaultSettings(settings) {
    return Object.keys(DEFAULT_SETTINGS).every((key) => settings[key] === DEFAULT_SETTINGS[key])
}

// The groups of characters the password may use, one string per selected type.
export function getCharacterSets(settings) {
    return Object.keys(SETS)
        .filter((key) => settings[key])
        .map((key) =>
            settings.avoidAmbiguous
                ? [...SETS[key]].filter((char) => !AMBIGUOUS.includes(char)).join('')
                : SETS[key],
        )
}

/*
 * Returns a random whole number from 0 to size - 1 using the browser's cryptographic generator.
 * A random 32-bit number does not divide evenly into most sizes, so taking it modulo the size
 * would make some characters slightly more likely. Numbers in the uneven leftover range are
 * thrown away and drawn again ("rejection sampling"), which keeps every character equally likely.
 */
function randomIndex(size) {
    const limit = Math.floor(0x100000000 / size) * size
    const buffer = new Uint32Array(1)
    do {
        globalThis.crypto.getRandomValues(buffer)
    } while (buffer[0] >= limit)
    return buffer[0] % size
}

/*
 * Creates a password. Always returns { ok: true, password } or { ok: false, error }.
 * Every selected type is guaranteed to appear. This is done by drawing whole passwords and
 * keeping the first one that qualifies, which keeps every qualifying password equally likely
 * (placing one character of each type in fixed spots first would bias the result).
 */
export function createPassword(settings) {
    const sets = getCharacterSets(settings)
    if (sets.length === 0) return { ok: false, error: ERRORS.noTypes }
    if (!globalThis.crypto?.getRandomValues) return { ok: false, error: ERRORS.unavailable }

    const alphabet = sets.join('')
    const length = clampLength(settings.length)

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        let candidate = ''
        for (let index = 0; index < length; index++) {
            candidate += alphabet[randomIndex(alphabet.length)]
        }
        const usesEveryType = sets.every((set) => [...set].some((char) => candidate.includes(char)))
        if (usesEveryType) return { ok: true, password: candidate }
    }

    return { ok: false, error: ERRORS.failed }
}

/*
 * A rough estimate of how hard the settings make a password to guess: length x log2(number of
 * possible characters), in bits. It assumes every character is chosen at random from the pool
 * and that an attacker knows the settings. Each extra bit doubles the guesses needed.
 */
export function estimateStrength(settings) {
    const poolSize = getCharacterSets(settings).join('').length
    if (poolSize === 0) return null

    const bits = Math.floor(clampLength(settings.length) * Math.log2(poolSize))
    const fraction = Math.min(1, bits / 128)

    if (bits < 40) return { bits, fraction, label: 'Weak', tone: 'danger' }
    if (bits < 64) return { bits, fraction, label: 'Fair', tone: 'warning' }
    if (bits < 100) return { bits, fraction, label: 'Strong', tone: 'good' }
    return { bits, fraction, label: 'Very strong', tone: 'good' }
}