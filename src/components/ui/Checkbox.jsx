import { useId } from 'react'

// A labelled checkbox with optional help text. The label is a real <label>, so clicking
// the text toggles it too, and the help text is announced by screen readers.
export default function Checkbox({ label, hint, checked, onChange, disabled = false }) {
    const id = useId()
    const hintId = `${id}-hint`

    return (
        <div className="flex items-start gap-2.5">
            <input
                id={id}
                type="checkbox"
                className="mt-1 size-4 shrink-0 cursor-pointer accent-accent disabled:cursor-not-allowed"
                checked={checked}
                disabled={disabled}
                onChange={(event) => onChange(event.target.checked)}
                aria-describedby={hint ? hintId : undefined}
            />
            <div>
                <label htmlFor={id} className="cursor-pointer text-sm font-medium">
                    {label}
                </label>
                {hint && (
                    <p id={hintId} className="text-sm text-fg-muted">
                        {hint}
                    </p>
                )}
            </div>
        </div>
    )
}