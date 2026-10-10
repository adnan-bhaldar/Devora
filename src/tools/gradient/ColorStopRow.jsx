import { useId, useState } from 'react'
import { Trash2 } from 'lucide-react'
import IconButton from '../../components/ui/IconButton.jsx'
import { clampNumber, isValidHex, normalizeHex } from './gradient.js'

export default function ColorStopRow({ stop, index, canRemove, onChange, onRemove }) {
    // While the user types in the hex box, `draft` holds their raw text (which may be
    // half-finished). It is cleared on blur so the box shows the real color again.
    const [draft, setDraft] = useState(null)
    const errorId = useId()

    const number = index + 1
    const hexText = draft ?? stop.color
    const hexInvalid = draft !== null && !isValidHex(draft)

    const handleHexChange = (event) => {
        const value = event.target.value
        setDraft(value)
        if (isValidHex(value)) onChange({ color: normalizeHex(value) })
    }

    return (
        <li className="rounded-xl border border-border bg-surface-2 p-3">
            <div className="flex flex-wrap items-center gap-2">
                <span className="w-14 text-sm font-medium text-fg-muted">Stop {number}</span>

                <input
                    type="color"
                    aria-label={`Stop ${number} color`}
                    value={stop.color}
                    onChange={(event) => onChange({ color: event.target.value })}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-border bg-surface p-1"
                />

                <input
                    type="text"
                    aria-label={`Stop ${number} hex value`}
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

                <div className="flex items-center gap-1.5">
                    <input
                        type="number"
                        aria-label={`Stop ${number} position in percent`}
                        min={0}
                        max={100}
                        step={1}
                        value={stop.position}
                        onChange={(event) =>
                            onChange({ position: clampNumber(Number(event.target.value), 0, 100, 0) })
                        }
                        className="field w-20"
                    />
                    <span aria-hidden="true" className="text-sm text-fg-muted">
                        %
                    </span>
                </div>

                <IconButton
                    label={`Remove stop ${number}`}
                    disabled={!canRemove}
                    onClick={onRemove}
                    className="ml-auto disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                    <Trash2 size={16} aria-hidden="true" />
                </IconButton>
            </div>

            {hexInvalid && (
                <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
                    Enter a hex color such as #5b4bff.
                </p>
            )}
        </li>
    )
}