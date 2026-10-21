/*
 * Turns Morse into a beep pattern, and the pattern into a WAV file.
 *
 * Timing follows the PARIS standard. One "unit" lasts 1.2 / WPM seconds, so 20 words per minute
 * is 60 ms per unit. A dot is 1 unit, a dash is 3, the gap between the dots and dashes of one
 * letter is 1, between letters is 3, and between words is 7.
 */

// The longest sound that is made, so a file or a sound never becomes huge.
export const MAX_SECONDS = 300

const SAMPLE_RATE = 22050 // Enough for tones up to 1,000 Hz, and it keeps files small.
const RAMP_SECONDS = 0.005 // A short fade in and out stops the clicks a sudden start would make.
const TAIL_SECONDS = 0.2
const VOLUME = 0.6

/*
 * `tidy` is Morse such as ".... .. / - .... . .-. ." (see tidyMorse). Returns
 * { segments: [{ on, start, end }], duration } with times in seconds.
 */
export function buildPlan(tidy, wpm) {
    const unit = 1.2 / wpm
    const segments = []
    let time = 0

    const add = (on, units) => {
        const end = time + units * unit
        const last = segments[segments.length - 1]
        if (last && last.on === on) last.end = end
        else segments.push({ on, start: time, end })
        time = end
    }

    tidy.split(' / ').forEach((word, wordIndex) => {
        if (word === '') return
        if (wordIndex > 0) add(false, 7)
        word.split(' ').forEach((letter, letterIndex) => {
            if (letterIndex > 0) add(false, 3)
            Array.from(letter).forEach((mark, markIndex) => {
                if (markIndex > 0) add(false, 1)
                add(true, mark === '-' ? 3 : 1)
            })
        })
    })

    return { segments, duration: time }
}

// Which beep (if any) is sounding at `seconds`. Used to light the lamp in time with the sound.
export function isOnAt(segments, seconds) {
    let low = 0
    let high = segments.length - 1
    while (low <= high) {
        const middle = (low + high) >> 1
        const segment = segments[middle]
        if (seconds < segment.start) high = middle - 1
        else if (seconds >= segment.end) low = middle + 1
        else return segment.on
    }
    return false
}

function writeText(view, offset, text) {
    for (let index = 0; index < text.length; index += 1) view.setUint8(offset + index, text.charCodeAt(index))
}

// A mono, 16-bit WAV file of the beeps.
export function renderWav(plan, frequency) {
    const total = Math.ceil((plan.duration + TAIL_SECONDS) * SAMPLE_RATE)
    const view = new DataView(new ArrayBuffer(44 + total * 2))

    writeText(view, 0, 'RIFF')
    view.setUint32(4, 36 + total * 2, true)
    writeText(view, 8, 'WAVE')
    writeText(view, 12, 'fmt ')
    view.setUint32(16, 16, true) // size of this part
    view.setUint16(20, 1, true) // plain PCM
    view.setUint16(22, 1, true) // one channel
    view.setUint32(24, SAMPLE_RATE, true)
    view.setUint32(28, SAMPLE_RATE * 2, true) // bytes per second
    view.setUint16(32, 2, true) // bytes per sample
    view.setUint16(34, 16, true) // bits per sample
    writeText(view, 36, 'data')
    view.setUint32(40, total * 2, true)

    const step = (2 * Math.PI * frequency) / SAMPLE_RATE
    for (const segment of plan.segments) {
        if (!segment.on) continue
        const first = Math.round(segment.start * SAMPLE_RATE)
        const last = Math.min(total, Math.round(segment.end * SAMPLE_RATE))
        const ramp = Math.min(RAMP_SECONDS * SAMPLE_RATE, (last - first) / 2)
        for (let index = first; index < last; index += 1) {
            const fade = Math.min(1, (index - first) / ramp, (last - 1 - index) / ramp)
            const sample = Math.sin(step * index) * fade * VOLUME
            view.setInt16(44 + index * 2, Math.round(sample * 32767), true)
        }
    }

    return new Blob([view], { type: 'audio/wav' })
}
