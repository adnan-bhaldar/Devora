// A visible label (plus optional hint) for a single form control. `htmlFor` must match the control's id.
export default function Field({ label, htmlFor, hint, children }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
                {label}
            </label>
            {children}
            {hint && <p className="mt-1.5 text-sm text-fg-muted">{hint}</p>}
        </div>
    )
}