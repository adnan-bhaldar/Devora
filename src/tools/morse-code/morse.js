/*
 * International Morse code (ITU). A dot is "." and a dash is "-". Letters are separated by a
 * space and words by " / ". Each line of the text is converted on its own.
 */

export const MODES = [
    { value: 'encode', label: 'Text to Morse' },
    { value: 'decode', label: 'Morse to text' },
]

export const MAX_LENGTH = 5000

export const DEFAULT_SETTINGS = { mode: 'encode', wpm: 20, frequency: 600 }
export const SPEED = { min: 5, max: 40 }
export const PITCH = { min: 300, max: 1000 }

export const isDefaultSettings = (settings) =>
    settings.mode === DEFAULT_SETTINGS.mode && settings.wpm === DEFAULT_SETTINGS.wpm && settings.frequency === DEFAULT_SETTINGS.frequency

export const EXAMPLES = {
    encode: 'Hello world',
    decode: '.... . .-.. .-.. --- / .-- --- .-. .-.. -..',
}

// [character, code]
export const LETTERS = [
    ['A', '.-'], ['B', '-...'], ['C', '-.-.'], ['D', '-..'], ['E', '.'], ['F', '..-.'], ['G', '--.'],
    ['H', '....'], ['I', '..'], ['J', '.---'], ['K', '-.-'], ['L', '.-..'], ['M', '--'], ['N', '-.'],
    ['O', '---'], ['P', '.--.'], ['Q', '--.-'], ['R', '.-.'], ['S', '...'], ['T', '-'], ['U', '..-'],
    ['V', '...-'], ['W', '.--'], ['X', '-..-'], ['Y', '-.--'], ['Z', '--..'],
]

export const DIGITS = [
    ['0', '-----'], ['1', '.----'], ['2', '..---'], ['3', '...--'], ['4', '....-'],
    ['5', '.....'], ['6', '-....'], ['7', '--...'], ['8', '---..'], ['9', '----.'],
]

export const PUNCTUATION = [
    ['.', '.-.-.-'], [',', '--..--'], ['?', '..--..'], ["'", '.----.'], ['!', '-.-.--'], ['/', '-..-.'],
    ['(', '-.--.'], [')', '-.--.-'], ['&', '.-...'], [':', '---...'], [';', '-.-.-.'], ['=', '-...-'],
    ['+', '.-.-.'], ['-', '-....-'], ['_', '..--.-'], ['"', '.-..-.'], ['$', '...-..-'], ['@', '.--.-.'],
]

export const CHART_GROUPS = [
    { id: 'letters', name: 'Letters', items: LETTERS },
    { id: 'digits', name: 'Numbers', items: DIGITS },
    { id: 'punctuation', name: 'Punctuation', items: PUNCTUATION },
]

const TO_MORSE = new Map([...LETTERS, ...DIGITS, ...PUNCTUATION])
const FROM_MORSE = new Map([...TO_MORSE].map(([character, code]) => [code, character]))

// Typographic marks that have a plain twin in the table.
const LOOKALIKES = { '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', '−': '-', '…': '...' }

const cleanCharacter = (character) =>
    LOOKALIKES[character] ??
    character
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .toUpperCase()

/*
 * Text to Morse. Accents are dropped (é becomes E). Characters with no Morse code are skipped
 * and returned in `skipped`. Returns { output, skipped }.
 */
export function encode(text) {
    const skipped = new Set()

    const output = text
        .split(/\r?\n/)
        .map((line) =>
            line
                .split(/\s+/)
                .filter(Boolean)
                .map((word) => {
                    const codes = []
                    for (const raw of Array.from(word)) {
                        // "…" and "ß" become several characters, so each result is looked up one by one.
                        for (const character of Array.from(cleanCharacter(raw))) {
                            const code = TO_MORSE.get(character)
                            if (code) codes.push(code)
                            else skipped.add(raw)
                        }
                    }
                    return codes.join(' ')
                })
                .filter(Boolean)
                .join(' / '),
        )
        .join('\n')

    return { output, skipped: [...skipped] }
}

const DOT_MARKS = /[·•∙]/g
const DASH_MARKS = /[–—−‒]/g
// Words are separated by / or | or three spaces in a row.
const WORD_BREAK = /\s*[/|]\s*|\s{3,}/

/*
 * Morse to text. Dots and dashes may also be written as · • or – —. Letters are separated by a
 * space and words by / (or | or three spaces). A group that is not a Morse letter becomes ?
 * and is listed in `unknown`. Returns { output, unknown }.
 */
export function decode(morse) {
    const unknown = new Set()

    const output = morse
        .replace(DOT_MARKS, '.')
        .replace(DASH_MARKS, '-')
        .split(/\r?\n/)
        .map((line) =>
            line
                .trim()
                .split(WORD_BREAK)
                .map((word) =>
                    word
                        .split(/\s+/)
                        .filter(Boolean)
                        .map((group) => {
                            const character = FROM_MORSE.get(group)
                            if (character) return character
                            unknown.add(group)
                            return '?'
                        })
                        .join(''),
                )
                .filter(Boolean)
                .join(' '),
        )
        .join('\n')

    return { output, unknown: [...unknown] }
}

// The Morse made of only dots, dashes, single spaces, and " / ", the form the sound is made from.
export function tidyMorse(morse) {
    return morse
        .replace(DOT_MARKS, '.')
        .replace(DASH_MARKS, '-')
        .split(/\r?\n/)
        .flatMap((line) => line.trim().split(WORD_BREAK))
        .map((word) =>
            word
                .split(/\s+/)
                .filter((group) => /^[.-]+$/.test(group))
                .join(' '),
        )
        .filter(Boolean)
        .join(' / ')
}
