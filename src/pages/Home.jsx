import Button from '../components/ui/Button.jsx'
import ToolCard from '../components/tools/ToolCard.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { categories, getToolsByCategory } from '../data/tools.js'

function HeroPreview() {
    return (
        <div className="preview rise rise-3" aria-hidden="true">
            <div className="preview-window">
                <div className="preview-bar">
                    <span className="preview-dot" />
                    <span className="preview-dot" />
                    <span className="preview-dot" />
                    <span className="preview-title">gradient.css</span>
                </div>
                <pre className="preview-code">
                    <code>
                        <span className="tok-p">.hero</span> {'{'}
                        {'\n  '}background: <span className="tok-s">linear-gradient</span>(
                        {'\n    '}
                        <span className="tok-n">135deg</span>, <span className="tok-n">#5b4bff</span>,{' '}
                        <span className="tok-n">#c147ff</span>
                        {'\n  '});
                        {'\n}'}
                    </code>
                </pre>
                <div className="preview-swatch" />
            </div>
            <div className="preview-chip">
                <span className="tok-p">uuid</span>
                <span>7c9e6679-7425-40de-944b</span>
            </div>
        </div>
    )
}

export default function Home() {
    usePageMeta()

    const visibleCategories = categories.filter(
        (category) => getToolsByCategory(category.id).length > 0,
    )

    return (
        <>
            <section className="hero">
                <div className="hero-bg" aria-hidden="true" />
                <div className="container-page hero-content py-16 sm:py-24">
                    <div className="hero-grid">
                        <div>
                            <span className="pill rise">
                                <span className="pill-dot" aria-hidden="true" />
                                Client-side · No account required
                            </span>
                            <h1 className="hero-title rise rise-2 mt-6 max-w-3xl">
                                Developer tools, <span className="text-gradient">right in your browser.</span>
                            </h1>
                            <p className="rise rise-2 mt-5 max-w-xl text-lg text-fg-muted sm:text-xl">
                                A growing collection of fast, focused utilities for everyday development tasks:
                                encode, decode, generate, and inspect.
                            </p>
                            <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
                                <a href="#tools" className="btn btn-primary">
                                    Browse tools
                                </a>
                                <Button to="/about">About Devora</Button>
                            </div>
                        </div>
                        <HeroPreview />
                    </div>
                </div>
            </section>

            <div id="tools" className="container-page page scroll-mt-16">
                <nav aria-label="Categories" className="mb-12 flex flex-wrap gap-2">
                    {visibleCategories.map((category) => (
                        <a
                            key={category.id}
                            href={`#category-${category.id}`}
                            data-tone={category.id}
                            className="chip"
                        >
                            <span className="chip-dot" aria-hidden="true" />
                            {category.name}
                        </a>
                    ))}
                </nav>

                <div className="flex flex-col gap-14">
                    {visibleCategories.map((category) => {
                        const categoryTools = getToolsByCategory(category.id)
                        const CategoryIcon = category.icon

                        return (
                            <section
                                key={category.id}
                                data-tone={category.id}
                                aria-labelledby={`category-${category.id}`}
                                className="scroll-mt-24"
                            >
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="icon-tile">
                                        <CategoryIcon size={20} strokeWidth={1.75} aria-hidden="true" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <h2
                                            id={`category-${category.id}`}
                                            className="text-xl font-semibold tracking-tight"
                                        >
                                            {category.name}
                                        </h2>
                                        <p className="text-sm text-fg-muted">{category.description}</p>
                                    </div>
                                    <span className="badge">{categoryTools.length}</span>
                                </div>
                                <div className="tool-grid">
                                    {categoryTools.map((tool) => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>
            </div>
        </>
    )
}