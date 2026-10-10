import { useId, useState } from 'react'
import { isValidHex, normalizeHex } from '../../utils/color.js'

/*
 * A color control with three ways to choose: the browser's color picker, a hex text box,
 * and optional preset swatches (presets: [{ name, value }], with value as "#rrggbb").
 * `value` and `onChange` always use a normalized "#rrggbb" string.
 */
export default function ColorField({ label, value, onChange, presets = [] }) {
    const id = useId()
    const labelId = `${id}-label`
    const errorId = `${id}-error`

    // While the user types in the hex box, `draft` holds their raw text (which may be
    // half-finished). It is cleared on blur so the box shows the real color again.
    const [draft, setDraft] = useState(null)
    const hexText = draft ?? value
    const hexInvalid = draft !== null && !isValidHex(draft)

    const choose = (color) => {
        setDraft(null)
        onChange(color)
    }

    const handleHexChange = (event) => {
        const text = event.target.value
        setDraft(text)
        if (isValidHex(text)) onChange(normalizeHex(text))
    }

    return (
        <div role="group" aria-labelledby={labelId}>
            <span id={labelId} className="mb-1.5 block text-sm font-medium">
                {label}
            </span>

            <div className="flex items-center gap-2">
                <input
                    type="color"
                    aria-label={`${label} picker`}
                    value={value}
                    onChange={(event) => choose(event.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-border bg-surface p-1"
                />
                <input
                    type="text"
                    aria-label={`${label} hex value`}
                    value={hexText}
                    onChange={handleHexChange}
                    onBlur={() => setDraft(null)}
                    maxLength={7}
                    spellCheck={false}
                    autoComplete="off"
                    aria-invalid={hexInvalid}
                    aria-describedby={hexInvalid ? errorId : undefined}
                    className="field field-mono w-28"
                />
            </div>

            {hexInvalid && (
                <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
                    Enter a hex color such as #5b4bff.
                </p>
            )}

            {presets.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {presets.map((preset) => (
                        <button
                            key={preset.value}
                            type="button"
                            aria-label={`${preset.name} (${preset.value})`}
                            title={preset.name}
                            aria-pressed={preset.value === value}
                            onClick={() => choose(preset.value)}
                            style={{ background: preset.value }}
                            className="size-7 cursor-pointer rounded-full border border-border aria-pressed:ring-2 aria-pressed:ring-accent aria-pressed:ring-offset-2 aria-pressed:ring-offset-surface"
                        />
                    ))}
                </div>
            )}
        </div>
    )
}