import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Search, Star } from 'lucide-react'
import EmptyState from '../components/common/EmptyState.jsx'
import SearchInput from '../components/common/SearchInput.jsx'
import ToolCard from '../components/tools/ToolCard.jsx'
import Button from '../components/ui/Button.jsx'
import useHotkey from '../hooks/useHotkey.js'
import usePageMeta from '../hooks/usePageMeta.js'
import useToolPrefs from '../hooks/useToolPrefs.js'
import { modKeyLabel } from '../data/shortcuts.js'
import { categories, getToolById, getToolsByCategory, tools } from '../data/tools.js'
import { searchTools } from '../utils/search.js'

const visibleCategories = categories.filter((category) => getToolsByCategory(category.id).length > 0)

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

    const { favorites, recent } = useToolPrefs()
    const [query, setQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const searchRef = useRef(null)

    useHotkey({ key: '/' }, (event) => {
        event.preventDefault()
        searchRef.current?.focus()
    })

    const results = useMemo(
        () =>
            searchTools(query).filter(
                (tool) => activeCategory === 'all' || tool.categories.includes(activeCategory),
            ),
        [query, activeCategory],
    )

    const isFiltering = query.trim() !== '' || activeCategory !== 'all'
    const favoriteTools = favorites.map(getToolById)
    const recentTools = recent.map(getToolById)

    const clearFilters = () => {
        setQuery('')
        setActiveCategory('all')
    }

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
                            <div className="rise rise-3 mt-8 max-w-xl">
                                <SearchInput
                                    value={query}
                                    onChange={setQuery}
                                    inputRef={searchRef}
                                    label="Search tools"
                                    placeholder="Search tools, e.g. jwt, encode, uuid…"
                                />
                                <p className="mt-3 hidden text-sm text-fg-muted sm:block">
                                    Press <kbd className="kbd">/</kbd> to search, or{' '}
                                    <kbd className="kbd">{modKeyLabel} K</kbd> for the command palette.
                                </p>
                            </div>
                        </div>
                        <HeroPreview />
                    </div>
                </div>
            </section>

            <div id="tools" className="container-page page">
                <div role="group" aria-label="Filter by category" className="mb-10 flex flex-wrap gap-2">
                    <button
                        type="button"
                        className="chip"
                        aria-pressed={activeCategory === 'all'}
                        onClick={() => setActiveCategory('all')}
                    >
                        All tools
                        <span className="badge">{tools.length}</span>
                    </button>
                    {visibleCategories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            data-tone={category.id}
                            className="chip"
                            aria-pressed={activeCategory === category.id}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <span className="chip-dot" aria-hidden="true" />
                            {category.name}
                        </button>
                    ))}
                </div>

                {isFiltering ? (
                    <section aria-label="Search results">
                        <p role="status" className="mb-4 text-sm text-fg-muted">
                            {results.length} {results.length === 1 ? 'tool' : 'tools'} found
                        </p>
                        {results.length > 0 ? (
                            <div className="tool-grid">
                                {results.map((tool) => (
                                    <ToolCard key={tool.id} tool={tool} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Search}
                                title="No tools found"
                                description="Try a different search term or category."
                            >
                                <Button onClick={clearFilters}>Clear filters</Button>
                            </EmptyState>
                        )}
                    </section>
                ) : (
                    <div className="flex flex-col gap-14">
                        {favoriteTools.length > 0 && (
                            <section aria-labelledby="favorites-heading">
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="icon-tile">
                                        <Star size={20} strokeWidth={1.75} aria-hidden="true" />
                                    </span>
                                    <h2 id="favorites-heading" className="text-xl font-semibold tracking-tight">
                                        Favorites
                                    </h2>
                                </div>
                                <div className="tool-grid">
                                    {favoriteTools.map((tool) => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {recentTools.length > 0 && (
                            <section aria-labelledby="recent-heading">
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="icon-tile">
                                        <Clock size={20} strokeWidth={1.75} aria-hidden="true" />
                                    </span>
                                    <h2 id="recent-heading" className="text-xl font-semibold tracking-tight">
                                        Recently used
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentTools.map((tool) => {
                                        const Icon = tool.icon
                                        return (
                                            <Link key={tool.id} to={tool.route} data-tone={tool.categories[0]} className="chip">
                                                <Icon size={16} aria-hidden="true" />
                                                {tool.name}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </section>
                        )}

                        {visibleCategories.map((category) => {
                            const categoryTools = getToolsByCategory(category.id)
                            const CategoryIcon = category.icon

                            return (
                                <section key={category.id} data-tone={category.id} aria-labelledby={`category-${category.id}`}>
                                    <div className="mb-5 flex items-center gap-3">
                                        <span className="icon-tile">
                                            <CategoryIcon size={20} strokeWidth={1.75} aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h2 id={`category-${category.id}`} className="text-xl font-semibold tracking-tight">
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
                )}
            </div>
        </>
    )
}