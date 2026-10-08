export default function PageHeader({ title, description, children }) {
    return (
        <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            {description && <p className="mt-3 max-w-2xl text-lg text-fg-muted">{description}</p>}
            {children}
        </header>
    )
}