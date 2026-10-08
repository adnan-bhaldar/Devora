import Button from '../components/ui/Button.jsx'
import ToolCard from '../components/tools/ToolCard.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { categories, getToolsByCategory } from '../data/tools.js'

export default function Home() {
    usePageMeta()

    return (
        <div className="container-page page">
            <section className="pb-12 pt-6 sm:pt-12">
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                    Developer tools, right in your browser.
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-fg-muted">
                    Devora is a growing collection of fast, focused utilities for everyday development
                    tasks: encode, decode, generate, and inspect.
                </p>
                <div className="mt-6">
                    <Button to="/about">About Devora</Button>
                </div>
            </section>

            <div className="flex flex-col gap-12">
                {categories.map((category) => {
                    const categoryTools = getToolsByCategory(category.id)
                    if (categoryTools.length === 0) return null

                    return (
                        <section key={category.id} aria-labelledby={`category-${category.id}`}>
                            <h2 id={`category-${category.id}`} className="text-xl font-semibold">
                                {category.name}
                            </h2>
                            <p className="mb-4 mt-1 text-fg-muted">{category.description}</p>
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
    )
}