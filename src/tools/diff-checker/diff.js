import { diffArrays, diffChars, diffWords, diffWordsWithSpace, createTwoFilesPatch } from 'diff'

/*
 * The comparison engine. Text is split into lines and the lines are compared; lines that were
 * changed (a removed line next to an added one) are then compared again, word by word or
 * character by character, to show exactly what changed inside the line. Nothing here touches the
 * page, so it can be tested on its own.
 */

export const MAX_LINES = 20000 // per side
export const MAX_FILE_MB = 2
export const CONTEXT = 3 // unchanged lines kept around a change when unchanged lines are hidden
const MAX_INLINE_LENGTH = 2000 // longer lines are shown as changed lines only (no inner highlighting)
const TIME_LIMIT_MS = 4000

export const PRECISIONS = [
    { value: 'smart', label: 'Smart' },
    { value: 'word', label: 'Word' },
    { value: 'char', label: 'Character' },
    { value: 'line', label: 'Line only' },
]

export const VIEWS = [
    { value: 'split', label: 'Side by side' },
    { value: 'unified', label: 'Unified' },
]

export const EXAMPLE_ORIGINAL = `function greet(name) {
  const message = "Hello, " + name;
  console.log(message);
  return message;
}

// Show a welcome message
greet("World");
`

export const EXAMPLE_CHANGED = `function greet(name, punctuation = "!") {
  const message = "Hello, " + name + punctuation;
  console.log(message);
  return message;
}

// Show a welcome message to the user
greet("Devora");
greet("World");
`

// Splits text into lines. A final line break does not create an extra empty line.
export function splitLines(text) {
    const lines = text.split(/\r\n|\r|\n/)
    if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop()
    return text === '' ? [] : lines
}

// The form of a line that is compared, after the "ignore" options are applied.
function makeKey({ ignoreWhitespace, ignoreCase }) {
    return (line) => {
        let key = line
        if (ignoreWhitespace) key = key.replace(/\s+/g, ' ').trim()
        if (ignoreCase) key = key.toLowerCase()
        return key
    }
}

// Finds how much of `source`, starting at `offset`, is the same text as `piece` once the "ignore" options are applied.
// The diff library reports unchanged pieces using the changed text, so the original's own spelling has to be looked up.
function takeMatching(source, offset, piece, { ignoreWhitespace, ignoreCase }) {
    const normalize = (text) => {
        let result = ignoreWhitespace ? text.replace(/\s+/g, ' ') : text
        if (ignoreCase) result = result.toLowerCase()
        return result
    }
    const wanted = normalize(piece)
    for (let end = offset; end <= source.length; end += 1) {
        if (normalize(source.slice(offset, end)) === wanted) return end
    }
    return -1
}

// Colors the differences inside a changed line. Returns { left, right } as lists of { text, changed }, or null.
// `deadline` is the time (in ms) when the whole comparison has used up its time budget.
function inlineParts(before, after, { precision, ignoreWhitespace, ignoreCase }, deadline) {
    if (precision === 'line' || before.length > MAX_INLINE_LENGTH || after.length > MAX_INLINE_LENGTH) return null
    const remaining = deadline - Date.now()
    if (remaining <= 0) return null
    const options = { ignoreCase, timeout: remaining }
    let changes
    if (precision === 'char') changes = diffChars(before, after, options)
    else changes = (ignoreWhitespace ? diffWords : diffWordsWithSpace)(before, after, options)
    if (!changes) return null

    const same = changes.filter((change) => !change.added && !change.removed).reduce((sum, change) => sum + change.value.length, 0)
    // In "smart" mode, lines that share almost nothing are shown as wholly changed, which reads better than confetti.
    if (precision === 'smart' && same < 0.3 * Math.max(before.length, after.length)) return null

    const left = []
    const right = []
    let leftAt = 0
    let rightAt = 0
    for (const change of changes) {
        if (change.added) {
            right.push({ text: change.value, changed: true })
            rightAt += change.value.length
        } else if (change.removed) {
            left.push({ text: change.value, changed: true })
            leftAt += change.value.length
        } else {
            // An unchanged piece is shown exactly as each side wrote it (it can differ in case or spacing).
            const leftEnd = takeMatching(before, leftAt, change.value, { ignoreWhitespace, ignoreCase })
            const rightEnd = takeMatching(after, rightAt, change.value, { ignoreWhitespace, ignoreCase })
            if (leftEnd < 0 || rightEnd < 0) return null
            left.push({ text: before.slice(leftAt, leftEnd), changed: false })
            right.push({ text: after.slice(rightAt, rightEnd), changed: false })
            leftAt = leftEnd
            rightAt = rightEnd
        }
    }
    return { left, right }
}

/**
 * Compares two texts. Returns { ok: true, segments, stats } or { ok: false, error }.
 * A segment is { type: 'equal', rows: [{ left, right, leftText, rightText }] } or
 * { type: 'change', removed: [{ no, text, parts }], added: [{ no, text, parts }] }.
 */
export function compareTexts(original, changed, options) {
    const a = splitLines(original)
    const b = splitLines(changed)
    if (a.length > MAX_LINES || b.length > MAX_LINES) {
        return { ok: false, error: `Each text can have up to ${MAX_LINES.toLocaleString('en-US')} lines. Compare smaller parts of the files.` }
    }

    const deadline = Date.now() + TIME_LIMIT_MS // one time budget for the whole comparison, shared by the line and the inline steps
    const key = makeKey(options)
    const changes = diffArrays(a, b, { comparator: (x, y) => key(x) === key(y), timeout: TIME_LIMIT_MS })
    if (!changes) return { ok: false, error: 'These texts are too different to compare quickly. Try comparing smaller parts.' }

    const segments = []
    const stats = { added: 0, removed: 0, unchanged: 0 }
    let leftNo = 0
    let rightNo = 0
    let pending = null // a change segment being built

    const flush = () => {
        if (!pending) return
        const pairs = Math.min(pending.removed.length, pending.added.length)
        for (let index = 0; index < pairs; index += 1) {
            const parts = inlineParts(pending.removed[index].text, pending.added[index].text, options, deadline)
            if (parts) {
                pending.removed[index].parts = parts.left
                pending.added[index].parts = parts.right
            }
        }
        segments.push(pending)
        pending = null
    }

    for (const change of changes) {
        const count = change.count ?? change.value.length
        if (change.removed || change.added) {
            pending ??= { type: 'change', removed: [], added: [] }
            for (let index = 0; index < count; index += 1) {
                if (change.removed) {
                    pending.removed.push({ no: leftNo + 1, text: a[leftNo], parts: null })
                    leftNo += 1
                    stats.removed += 1
                } else {
                    pending.added.push({ no: rightNo + 1, text: b[rightNo], parts: null })
                    rightNo += 1
                    stats.added += 1
                }
            }
        } else {
            flush()
            const rows = []
            for (let index = 0; index < count; index += 1) {
                rows.push({ left: leftNo + 1, right: rightNo + 1, leftText: a[leftNo], rightText: b[rightNo] })
                leftNo += 1
                rightNo += 1
            }
            stats.unchanged += count
            segments.push({ type: 'equal', rows })
        }
    }
    flush()

    return { ok: true, segments, stats, identical: stats.added === 0 && stats.removed === 0 }
}

// The comparison as a standard unified diff (what `diff -u` or Git shows), for copying or saving.
export function makePatch(original, changed) {
    return createTwoFilesPatch('original', 'changed', original, changed, '', '', { context: CONTEXT })
}