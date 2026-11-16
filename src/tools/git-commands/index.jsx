import { useMemo, useRef, useState } from 'react'
import { ChevronRight, Info, SearchX } from 'lucide-react'
import CopyButton from '../../components/common/CopyButton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import SearchInput from '../../components/common/SearchInput.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import { GROUPS, GROUP_NAMES, COMMANDS, filterCommands } from './commands.js'

function CommandCard({ entry }) {
    return (
        <li>
            <article className="card git-card grid grid-cols-[minmax(0,1fr)] gap-3" data-group={entry.group}>
                <header className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-semibold">{entry.title}</h3>
                    <span className="git-card__group">{GROUP_NAMES[entry.group]}</span>
                </header>

                <p className="text-sm text-fg-muted">{entry.summary}</p>

                <div className="tip-end flex items-start gap-2">
                    {/* tabIndex 0 lets keyboard users scroll a long command sideways. */}
                    <pre className="code-block min-w-0 flex-1" tabIndex={0} aria-label={`Command: ${entry.title}`}>
                        <code>{entry.command}</code>
                    </pre>
                    <CopyButton text={entry.command} label={`Copy command: ${entry.title}`} copiedLabel="Copied" />
                </div>

                {entry.note && (
                    <p className="flex gap-2 text-sm text-fg-muted">
                        <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                        <span>{entry.note}</span>
                    </p>
                )}

                {/* "name" makes the browser keep only one of these open at a time: opening another closes the first. */}
                <details
                    className="recipe-more text-sm"
                    name="git-options"
                    onKeyDown={(event) => {
                        if (event.key === 'Escape' && event.currentTarget.open) {
                            event.stopPropagation()
                            event.currentTarget.open = false
                            event.currentTarget.querySelector('summary').focus()
                        }
                    }}
                >
                    <summary className="recipe-more__toggle">
                        <ChevronRight size={16} aria-hidden="true" className="recipe-more__chevron" />
                        What the options mean
                    </summary>
                    <dl className="mt-2 grid gap-2">
                        {entry.parts.map(([piece, meaning]) => (
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

export default function GitCommandsTool() {
    const [query, setQuery] = useState('')
    const [group, setGroup] = useState('all')
    const searchRef = useRef(null)

    const results = useMemo(() => filterCommands(query, group), [query, group])

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
                    label="Search Git commands"
                    placeholder="Search a job or a word, e.g. undo, branch, stash, rebase…"
                />
                <ChoiceGroup label="Show" options={GROUPS} value={group} onChange={setGroup} />
            </div>

            <div className="grid gap-1 text-sm text-fg-muted">
                <p role="status">
                    Showing {results.length} of {COMMANDS.length} commands
                </p>
                <p>Names such as feature/login, path/to/file.txt, and &lt;commit&gt; are placeholders. Replace them with your own.</p>
            </div>

            {results.length > 0 ? (
                <>
                    <h2 className="sr-only">Commands</h2>
                    <ul className="grid grid-cols-[minmax(0,1fr)] gap-4">
                        {results.map((entry) => (
                            <CommandCard key={entry.id} entry={entry} />
                        ))}
                    </ul>
                </>
            ) : (
                <EmptyState
                    icon={SearchX}
                    title="No commands found"
                    description="Try a different word, such as the job you want to do or the name of a Git command."
                >
                    <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                        Clear search and filter
                    </button>
                </EmptyState>
            )}
        </div>
    )
}