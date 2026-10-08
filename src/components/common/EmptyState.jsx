export default function EmptyState({ icon: Icon, title, description, children }) {
    return (
        <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
            {Icon && (
                <span className="icon-tile">
                    <Icon size={18} aria-hidden="true" />
                </span>
            )}
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && <p className="max-w-md text-fg-muted">{description}</p>}
            {children}
        </div>
    )
}