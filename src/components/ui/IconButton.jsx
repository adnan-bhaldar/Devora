// Icon-only button. `label` becomes the accessible name and, by default, a tooltip.
export default function IconButton({ label, tooltip = true, className = '', children, ...props }) {
    return (
        <button
            type="button"
            className={`icon-btn ${className}`.trim()}
            aria-label={label}
            data-tip={tooltip ? label : undefined}
            {...props}
        >
            {children}
        </button>
    )
}