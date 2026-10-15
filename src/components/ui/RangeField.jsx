import { useState } from 'react'
import Field from './Field.jsx'

/*
 * A whole-number control made of a slider and a number box that stay in sync. `value` and
 * `onChange` are always numbers within min..max. Anything typed that is not a whole number in
 * range shows a message and is not applied.
 */
export default function RangeField({ id, label, hint, min, max, value, onChange }) {
    const errorId = `${id}-error`
    // While the user types, `draft` holds their raw text (which may be empty or out of range).
    // It is cleared on blur so the box shows the real value again.
    const [draft, setDraft] = useState(null)

    const parse = (text) => {
        if (!/^\d+$/.test(text.trim())) return null
        const number = Number(text)
        return number >= min && number <= max ? number : null
    }

    const text = draft ?? String(value)
    const invalid = draft !== null && parse(draft) === null

    const handleText = (event) => {
        const nextText = event.target.value
        setDraft(nextText)
        const number = parse(nextText)
        if (number !== null) onChange(number)
    }

    const handleSlider = (event) => {
        setDraft(null)
        onChange(Number(event.target.value))
    }

    return (
        <div>
            <Field label={label} htmlFor={id} hint={hint}>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        aria-label={`${label} slider`}
                        min={min}
                        max={max}
                        step={1}
                        value={value}
                        onChange={handleSlider}
                        className="w-full accent-accent"
                    />
                    <input
                        id={id}
                        type="text"
                        inputMode="numeric"
                        value={text}
                        onChange={handleText}
                        onBlur={() => setDraft(null)}
                        autoComplete="off"
                        aria-invalid={invalid}
                        aria-describedby={invalid ? errorId : undefined}
                        className="field w-24"
                    />
                </div>
            </Field>
            {invalid && (
                <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
                    Enter a whole number from {min} to {max}.
                </p>
            )}
        </div>
    )
}