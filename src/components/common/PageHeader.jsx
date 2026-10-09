export default function PageHeader({ title, description, actions, children }) {
    return (
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
                {description && <p className="mt-3 max-w-2xl text-lg text-fg-muted">{description}</p>}
                {children}
            </div>
            {actions}
        </header>
    )
}