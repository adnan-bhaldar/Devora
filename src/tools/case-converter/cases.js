// The longest text the tool will convert. Longer text would make every keystroke slow.
export const MAX_LENGTH = 100000

export const DEFAULT_SETTINGS = { caseId: 'upper', smallWords: false }

export const isDefaultSettings = (settings) =>
    settings.caseId === DEFAULT_SETTINGS.caseId && settings.smallWords === DEFAULT_SETTINGS.smallWords

export const EXAMPLE_TEXT = 'the quick brown fox: XMLHttpRequest and user_id jump over the lazy dog. it’s 2026!'

// Words that stay in lower case inside a title (unless they are the first or last word).
const SMALL_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'the', 'to', 'vs', 'via'])

// A word for the "writing" cases: letters and digits, with apostrophes kept inside ("don’t").
const WORD = /[\p{L}\p{M}\p{N}]+(?:['’][\p{L}\p{M}\p{N}]+)*/gu

const capitalize = (word) => {
    const [first = '', ...rest] = Array.from(word)
    return first.toUpperCase() + rest.join('').toLowerCase()
}

function toTitleCase(text, { smallWords }) {
    return text
        .split('\n')
        .map((line) => {
            const total = (line.match(WORD) ?? []).length
            let position = 0
            return line.replace(WORD, (word) => {
                const index = position
                position += 1
                const lower = word.toLowerCase()
                if (smallWords && index !== 0 && index !== total - 1 && SMALL_WORDS.has(lower)) return lower
                return capitalize(word)
            })
        })
        .join('\n')
}

// Capital letter at the start of the text, of each line, and after . ! or ?
function toSentenceCase(text) {
    return text
        .toLowerCase()
        .replace(/(^\s*|\n\s*|[.!?…]["')\]”’]*\s+)(\p{L})/gu, (_match, before, letter) => before + letter.toUpperCase())
}

function toAlternatingCase(text) {
    let isUpper = false
    return Array.from(text)
        .map((character) => {
            if (character.toLowerCase() === character.toUpperCase()) return character // not a letter
            isUpper = !isUpper
            return isUpper ? character.toLowerCase() : character.toUpperCase()
        })
        .join('')
}

function toInverseCase(text) {
    return Array.from(text)
        .map((character) => {
            const lower = character.toLowerCase()
            return character === lower ? character.toUpperCase() : lower
        })
        .join('')
}

/*
 * Splits a line into words for the "programming" cases. Words break at anything that is not a
 * letter or digit (spaces, - _ . / and so on) and inside camelCase, so "XMLHttpRequest" gives
 * XML, Http, Request. Apostrophes are dropped ("don’t" gives dont). Digits stay with their word.
 */
export function splitWords(line) {
    return (
        line
            .replace(/['’]/g, '')
            .replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, '$1 $2')
            .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')
            .match(/[\p{L}\p{M}\p{N}]+/gu) ?? []
    )
}

// Every line is converted on its own, so a list of names gives a list of identifiers.
const perLine = (text, build) => text.split(/\r?\n/).map((line) => build(splitWords(line))).join('\n')

const lowerAll = (words) => words.map((word) => word.toLowerCase())
const upperAll = (words) => words.map((word) => word.toUpperCase())
const capitalizeAll = (words) => words.map(capitalize)

// `convert(text, settings)` returns the converted text. Only the chosen case is ever calculated.
export const CASES = [
    { id: 'upper', name: 'UPPERCASE', convert: (text) => text.toUpperCase() },
    { id: 'lower', name: 'lowercase', convert: (text) => text.toLowerCase() },
    { id: 'title', name: 'Title Case', convert: toTitleCase },
    { id: 'sentence', name: 'Sentence case', convert: (text) => toSentenceCase(text) },
    { id: 'alternating', name: 'aLtErNaTiNg case', convert: (text) => toAlternatingCase(text) },
    { id: 'inverse', name: 'iNVERSE cASE', convert: (text) => toInverseCase(text) },

    {
        id: 'camel',
        group: 'code',
        name: 'camelCase',
        convert: (text) =>
            perLine(text, (words) => lowerAll(words).map((word, index) => (index === 0 ? word : capitalize(word))).join('')),
    },
    { id: 'pascal', name: 'PascalCase', convert: (text) => perLine(text, (words) => capitalizeAll(words).join('')) },
    { id: 'snake', name: 'snake_case', convert: (text) => perLine(text, (words) => lowerAll(words).join('_')) },
    { id: 'constant', name: 'CONSTANT_CASE', convert: (text) => perLine(text, (words) => upperAll(words).join('_')) },
    { id: 'kebab', name: 'kebab-case', convert: (text) => perLine(text, (words) => lowerAll(words).join('-')) },
    { id: 'header', name: 'Header-Case', convert: (text) => perLine(text, (words) => capitalizeAll(words).join('-')) },
    { id: 'cobol', name: 'COBOL-CASE', convert: (text) => perLine(text, (words) => upperAll(words).join('-')) },
    { id: 'dot', name: 'dot.case', convert: (text) => perLine(text, (words) => lowerAll(words).join('.')) },
    { id: 'path', name: 'path/case', convert: (text) => perLine(text, (words) => lowerAll(words).join('/')) },
]

export function convertText(text, settings) {
    if (text.length > MAX_LENGTH) {
        return { ok: false, error: `The text is too long. The limit is ${MAX_LENGTH.toLocaleString('en-US')} characters.` }
    }
    const chosen = CASES.find((item) => item.id === settings.caseId) ?? CASES[0]
    return { ok: true, output: chosen.convert(text, settings), name: chosen.name }
}

// Every case at once. Used by "Try an example" so a first-time visitor can see what each one does.
export function convertAll(text, settings) {
    if (text.length > MAX_LENGTH) {
        return { ok: false, error: `The text is too long. The limit is ${MAX_LENGTH.toLocaleString('en-US')} characters.` }
    }
    return { ok: true, results: CASES.map((item) => ({ ...item, output: item.convert(text, settings) })) }
}