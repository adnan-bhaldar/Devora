export default function EmptyState({ icon: Icon, title, description, headingLevel = 2, children }) {
    // The heading level is a prop because the same component is used inside pages that already
    // have a main heading (level 2) and as the whole content of the 404 page (level 1).
    const Heading = `h${headingLevel}`
    const headingClasses =
        headingLevel === 1 ? 'text-2xl font-bold tracking-tight' : 'text-lg font-semibold'

    return (
        <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
            {Icon && (
                <span className="icon-tile">
                    <Icon size={18} aria-hidden="true" />
                </span>
            )}
            <Heading className={headingClasses}>{title}</Heading>
            {description && <p className="max-w-md text-fg-muted">{description}</p>}
            {children}
        </div>
    )
}