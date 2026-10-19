export const MAX_INPUT_CHARS = 50000

export const SEPARATORS = [
    { value: 'hyphen', label: 'Hyphen ( - )', char: '-' },
    { value: 'underscore', label: 'Underscore ( _ )', char: '_' },
    { value: 'dot', label: 'Dot ( . )', char: '.' },
]

export const LENGTH_LIMITS = { min: 10, max: 200 }

export const DEFAULT_SETTINGS = {
    separator: 'hyphen',
    lowercase: true,
    removeStopWords: false,
    keepUnicode: false,
    limitLength: false,
    maxLength: 60,
}

export function isDefaultSettings(settings) {
    return Object.keys(DEFAULT_SETTINGS).every((key) => settings[key] === DEFAULT_SETTINGS[key])
}

// Small words that add little to a URL. Only removed when the person turns the option on.
const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it',
    'of', 'on', 'or', 'so', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to',
    'was', 'will', 'with',
])

// Letters that do not split into "letter + accent", so they need their own plain-letter spelling.
const SPECIAL_LETTERS = {
    ß: 'ss', æ: 'ae', Æ: 'AE', œ: 'oe', Œ: 'OE', ø: 'o', Ø: 'O', đ: 'd', Đ: 'D',
    ð: 'd', Ð: 'D', þ: 'th', Þ: 'Th', ł: 'l', Ł: 'L', ı: 'i', ħ: 'h', Ħ: 'H',
}
const SPECIAL_PATTERN = new RegExp(`[${Object.keys(SPECIAL_LETTERS).join('')}]`, 'g')

// "Café" -> "Cafe". Only accents on Latin letters are removed, so other scripts keep theirs.
function removeLatinAccents(text) {
    return text
        .replace(SPECIAL_PATTERN, (letter) => SPECIAL_LETTERS[letter])
        .normalize('NFD')
        .replace(/(\p{Script=Latin})\p{M}+/gu, '$1')
        .normalize('NFC')
}

// Length is counted in whole characters (code points), not UTF-16 units, so a letter outside the
// basic range (like 𐐨) counts as one and is never cut in half.
const charLength = (text) => Array.from(text).length

function takeWithinLength(words, separator, maxLength) {
    const kept = []
    let length = 0

    for (const word of words) {
        const added = kept.length === 0 ? charLength(word) : separator.length + charLength(word)
        if (length + added <= maxLength) {
            kept.push(word)
            length += added
        } else {
            // A first word that is longer than the limit on its own is cut, so the result is never empty.
            if (kept.length === 0) kept.push(Array.from(word).slice(0, maxLength).join(''))
            break
        }
    }

    return kept
}

// Turns one line of text into a slug.
export function slugify(text, settings) {
    const separator = SEPARATORS.find((option) => option.value === settings.separator)?.char ?? '-'

    let prepared = removeLatinAccents(text)
    // Apostrophes are removed rather than turned into separators, so "don't" becomes "dont".
    prepared = prepared.replace(/['’‘`´]/g, '')
    if (settings.lowercase) prepared = prepared.toLowerCase()

    // With Unicode kept, a letter or number may be followed by combining marks (\p{M}), so a word
    // like "नमस्ते" stays in one piece instead of splitting at each vowel sign.
    const pattern = settings.keepUnicode ? /(?:[\p{L}\p{N}]\p{M}*)+/gu : /[A-Za-z0-9]+/g
    let words = prepared.match(pattern) ?? []

    if (settings.removeStopWords) {
        const meaningful = words.filter((word) => !STOP_WORDS.has(word.toLowerCase()))
        // If every word was a stop word ("The"), keep them rather than return nothing.
        if (meaningful.length > 0) words = meaningful
    }

    if (settings.limitLength) words = takeWithinLength(words, separator, settings.maxLength)

    return words.join(separator)
}

/*
 * Every line of the input becomes its own slug, and blank lines stay blank so the output lines
 * up with the input. Returns { ok: true, output, count, skipped } or { ok: false, error }.
 * "skipped" counts lines that had text but nothing a slug can keep (for example only symbols).
 */
export function slugifyText(text, settings) {
    if (text.length > MAX_INPUT_CHARS) {
        return { ok: false, error: `The text is too long. The limit is ${MAX_INPUT_CHARS.toLocaleString('en-US')} characters.` }
    }

    const lines = text.split(/\r?\n/)
    let count = 0
    let skipped = 0

    const slugs = lines.map((line) => {
        const slug = slugify(line, settings)
        if (slug) count++
        else if (line.trim() !== '') skipped++
        return slug
    })

    return { ok: true, output: slugs.join('\n'), count, skipped }
}

export const EXAMPLE_TEXT = '10 Tips for Writing Better Code — Café Édition & Más!\nDon’t Repeat Yourself (DRY): A Beginner’s Guide'