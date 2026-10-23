import { useId, useRef } from 'react'

/*
 * Choose exactly one of a few options. This follows the standard "radio group" pattern:
 * screen readers announce "1 of 3, selected", only the chosen option is in the Tab order,
 * and the arrow keys (plus Home and End) move the choice, wrapping around at the ends.
 */
// options: [{ value, label, ariaLabel }]. ariaLabel is optional: use it when the label is a symbol that a screen reader would not read well.
export default function ChoiceGroup({ label, options, value, onChange }) {
    const labelId = useId()
    const buttons = useRef([])
    const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.value === value),
    )

    const moveTo = (index) => {
        onChange(options[index].value)
        buttons.current[index]?.focus()
    }

    const handleKeyDown = (event, index) => {
        const last = options.length - 1

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault()
                moveTo(index === last ? 0 : index + 1)
                break
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault()
                moveTo(index === 0 ? last : index - 1)
                break
            case 'Home':
                event.preventDefault()
                moveTo(0)
                break
            case 'End':
                event.preventDefault()
                moveTo(last)
                break
            default:
        }
    }

    return (
        <div role="radiogroup" aria-labelledby={labelId}>
            <span id={labelId} className="mb-2 block text-sm font-medium">
                {label}
            </span>
            <div className="flex flex-wrap gap-2">
                {options.map((option, index) => (
                    <button
                        key={option.value}
                        ref={(element) => {
                            buttons.current[index] = element
                        }}
                        type="button"
                        role="radio"
                        aria-checked={option.value === value}
                        aria-label={option.ariaLabel}
                        tabIndex={index === selectedIndex ? 0 : -1}
                        className="chip"
                        onClick={() => onChange(option.value)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}