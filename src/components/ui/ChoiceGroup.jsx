import { useId } from 'react'

// Pick one of a few options. Each option is a toggle button, so it works with mouse,
// keyboard and screen readers (the selected one is announced as "pressed").
export default function ChoiceGroup({ label, options, value, onChange }) {
    const labelId = useId()

    return (
        <div role="group" aria-labelledby={labelId}>
            <span id={labelId} className="mb-2 block text-sm font-medium">
                {label}
            </span>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className="chip"
                        aria-pressed={value === option.value}
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}