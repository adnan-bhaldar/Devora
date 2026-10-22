/*
 * Faker normally seeds itself slowly, which would make "seed every value separately" far too slow
 * for thousands of records. This small generator replaces Faker's own random source. It is cheap to
 * re-seed, and the same seed always gives the same numbers.
 */

// Turns any text into a 32-bit number (the "xmur3" string hash).
export function hashText(text) {
    let hash = 1779033703 ^ text.length
    for (let index = 0; index < text.length; index += 1) {
        hash = Math.imul(hash ^ text.charCodeAt(index), 3432918353)
        hash = (hash << 13) | (hash >>> 19)
    }
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    return (hash ^ (hash >>> 16)) >>> 0
}

// The "mulberry32" generator, in the shape Faker expects: next() gives 0 up to (not including) 1.
export function createRandomizer() {
    let state = 0
    return {
        next() {
            state = (state + 0x6d2b79f5) >>> 0
            let t = state
            t = Math.imul(t ^ (t >>> 15), t | 1)
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296
        },
        seed(seed) {
            state = (Array.isArray(seed) ? seed[0] : seed) >>> 0
        },
    }
}