export const UNITS = [
    { value: 'words', label: 'Words' },
    { value: 'sentences', label: 'Sentences' },
    { value: 'paragraphs', label: 'Paragraphs' },
]

export const LIMITS = {
    words: { min: 1, max: 1000, default: 50 },
    sentences: { min: 1, max: 100, default: 5 },
    paragraphs: { min: 1, max: 50, default: 3 },
}

export const DEFAULT_SETTINGS = { unit: 'paragraphs', amount: 3, startWithLorem: true }

// The first text shown is made from this seed, so the page looks the same every time it opens.
export const INITIAL_SEED = 1

const WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
    'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
    'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
    'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
    'mollit', 'anim', 'id', 'est', 'laborum', 'curabitur', 'pretium', 'tincidunt', 'lacus',
    'gravida', 'orci', 'odio', 'nullam', 'varius', 'turpis', 'pharetra', 'eros', 'bibendum',
    'nunc', 'vivamus', 'vel', 'sapien', 'mauris', 'vehicula', 'massa', 'integer', 'porta',
    'semper', 'quam', 'feugiat', 'nibh', 'sollicitudin', 'fermentum', 'ligula', 'aenean',
    'dignissim', 'faucibus', 'hendrerit', 'iaculis', 'justo', 'lectus', 'maecenas', 'neque',
    'posuere', 'suscipit', 'tellus', 'ultrices', 'vitae', 'viverra', 'volutpat',
]

const OPENING_WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit']
const OPENING_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

export function clampAmount(unit, value) {
    const { min, max } = LIMITS[unit]
    if (!Number.isFinite(value)) return LIMITS[unit].default
    return Math.min(max, Math.max(min, Math.round(value)))
}

// Reads a typed amount. Returns a number, or null if it is not a whole number in range.
export function parseAmount(unit, text) {
    if (!/^\d+$/.test(text.trim())) return null
    const value = Number(text)
    const { min, max } = LIMITS[unit]
    return value >= min && value <= max ? value : null
}

// Call this from an event handler (like a button click), never while rendering.
export function createRandomSeed() {
    return Math.floor(Math.random() * 0xffffffff) + 1
}

/*
 * A small seeded random number generator (mulberry32). The same seed always gives the same
 * sequence, which makes generateLorem a pure function: same settings and seed, same text.
 */
function createRandom(seed) {
    let state = seed >>> 0
    return () => {
        state = (state + 0x6d2b79f5) >>> 0
        let t = state
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function randomInt(random, min, max) {
    return min + Math.floor(random() * (max - min + 1))
}

// Random words, never the same word twice in a row.
function pickWords(count, random, previous = '') {
    const picked = []
    let last = previous
    while (picked.length < count) {
        const word = WORDS[Math.floor(random() * WORDS.length)]
        if (word === last) continue
        picked.push(word)
        last = word
    }
    return picked
}

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

// A sentence of 6 to 14 words, with an occasional comma that never lands near the end.
function buildSentence(random) {
    const words = pickWords(randomInt(random, 6, 14), random)

    let text = ''
    let sinceComma = 0
    words.forEach((word, index) => {
        text += (index === 0 ? '' : ' ') + word
        sinceComma += 1
        const isNearEnd = index >= words.length - 3
        if (!isNearEnd && sinceComma >= 3 && random() < 0.2) {
            text += ','
            sinceComma = 0
        }
    })

    return `${capitalize(text)}.`
}

// A paragraph of 3 to 7 sentences. `firstSentence` lets the classic opening line lead it.
function buildParagraph(random, firstSentence) {
    const count = randomInt(random, 3, 7)
    const sentences = firstSentence ? [firstSentence] : []
    while (sentences.length < count) sentences.push(buildSentence(random))
    return sentences.join(' ')
}

/*
 * Builds the text for the given settings. Because the numbers come from the seed in order,
 * asking for more simply adds to the end, so the text does not jump around when the amount
 * changes. A new seed gives completely different text.
 */
export function generateLorem({ unit, amount, startWithLorem }, seed) {
    const random = createRandom(seed)
    const count = clampAmount(unit, amount)

    if (unit === 'words') {
        const lead = startWithLorem ? OPENING_WORDS.slice(0, count) : []
        const words = [...lead, ...pickWords(count - lead.length, random, lead[lead.length - 1] ?? '')]
        return capitalize(words.join(' '))
    }

    if (unit === 'sentences') {
        const sentences = []
        for (let index = 0; index < count; index++) {
            sentences.push(index === 0 && startWithLorem ? OPENING_SENTENCE : buildSentence(random))
        }
        return sentences.join(' ')
    }

    const paragraphs = []
    for (let index = 0; index < count; index++) {
        paragraphs.push(buildParagraph(random, index === 0 && startWithLorem ? OPENING_SENTENCE : null))
    }
    return paragraphs.join('\n\n')
}

export function countWords(text) {
    const trimmed = text.trim()
    return trimmed === '' ? 0 : trimmed.split(/\s+/).length
}

export function isDefaultSettings(settings) {
    return Object.keys(DEFAULT_SETTINGS).every((key) => settings[key] === DEFAULT_SETTINGS[key])
}