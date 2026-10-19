import { useMemo, useRef, useState } from 'react'
import { Info, SearchX } from 'lucide-react'
import CopyButton from '../../components/common/CopyButton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import SearchInput from '../../components/common/SearchInput.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import { GROUPS, GROUP_NAMES, RECIPES, filterRecipes } from './commands.js'

function RecipeCard({ recipe }) {
    return (
        <li>
            <article className="card recipe-card grid grid-cols-[minmax(0,1fr)] gap-3" data-group={recipe.group}>
                <header className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-semibold">{recipe.title}</h3>
                    <span className="recipe-card__group">{GROUP_NAMES[recipe.group]}</span>
                </header>

                <p className="text-sm text-fg-muted">{recipe.summary}</p>

                <div className="tip-end flex items-start gap-2">
                    {/* tabIndex 0 lets keyboard users scroll a long command sideways. */}
                    <pre className="code-block min-w-0 flex-1" tabIndex={0} aria-label={`Command: ${recipe.title}`}>
                        <code>{recipe.command}</code>
                    </pre>
                    <CopyButton text={recipe.command} label={`Copy command: ${recipe.title}`} copiedLabel="Copied" />
                </div>

                {recipe.note && (
                    <p className="flex gap-2 text-sm text-fg-muted">
                        <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                        <span>{recipe.note}</span>
                    </p>
                )}

                <details className="text-sm">
                    <summary className="cursor-pointer font-medium">What the options mean</summary>
                    <dl className="mt-2 grid gap-2">
                        {recipe.parts.map(([piece, meaning]) => (
                            <div key={piece} className="grid gap-0.5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-3">
                                <dt>
                                    <code className="font-mono text-[0.8125rem]">{piece}</code>
                                </dt>
                                <dd className="text-fg-muted">{meaning}</dd>
                            </div>
                        ))}
                    </dl>
                </details>
            </article>
        </li>
    )
}

export default function FfmpegTool() {
    const [query, setQuery] = useState('')
    const [group, setGroup] = useState('all')
    const searchRef = useRef(null)

    const results = useMemo(() => filterRecipes(query, group), [query, group])

    const clearFilters = () => {
        setQuery('')
        setGroup('all')
    }

    return (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
            <div className="card grid grid-cols-[minmax(0,1fr)] gap-4">
                <SearchInput
                    value={query}
                    onChange={setQuery}
                    inputRef={searchRef}
                    label="Search FFmpeg commands"
                    placeholder="Search a job or a word, e.g. compress, gif, crop, mp3…"
                />
                <ChoiceGroup label="Show" options={GROUPS} value={group} onChange={setGroup} />
            </div>

            <div className="grid gap-1 text-sm text-fg-muted">
                <p role="status">
                    Showing {results.length} of {RECIPES.length} commands
                </p>
                <p>File names such as input.mp4 are placeholders. Replace them with your own files.</p>
            </div>

            {results.length > 0 ? (
                <>
                    <h2 className="sr-only">Commands</h2>
                    <ul className="grid grid-cols-[minmax(0,1fr)] gap-4">
                        {results.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </ul>
                </>
            ) : (
                <EmptyState
                    icon={SearchX}
                    title="No commands found"
                    description="Try a different word, such as the file type or the job you want to do."
                >
                    <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                        Clear search and filter
                    </button>
                </EmptyState>
            )}
        </div>
    )
}