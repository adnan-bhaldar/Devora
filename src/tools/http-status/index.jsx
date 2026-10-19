import { useMemo, useRef, useState } from 'react'
import { ChevronRight, ExternalLink, SearchX } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState.jsx'
import SearchInput from '../../components/common/SearchInput.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import {
    FAMILIES,
    FAMILY_NAMES,
    FLAG_LABELS,
    STATUS_CODES,
    filterStatusCodes,
    getSourceUrl,
} from './codes.js'

function StatusCard({ entry }) {
    const sourceUrl = getSourceUrl(entry.source)
    const isUnofficial = entry.flag === 'unofficial'
    // Unofficial codes are shown as their own group, whatever their first digit is.
    const familyKey = isUnofficial ? 'unofficial' : entry.family

    return (
        <li className="relative flex">
            <article className="status-card" data-family={familyKey}>
                <header className="status-card__head">
                    <span className="status-card__code">{entry.code}</span>
                    <span className="status-card__family">
                        <span className="status-card__dot" aria-hidden="true" />
                        {FAMILY_NAMES[familyKey]}
                    </span>
                </header>

                <h3 className="status-card__name">
                    {entry.name}
                    {entry.flag && !isUnofficial && (
                        <span className="badge ml-2 align-middle">{FLAG_LABELS[entry.flag]}</span>
                    )}
                </h3>
                <p className="status-card__summary">{entry.summary}</p>

                {/* "name" makes the browser keep only one Details open at a time. The opened text floats over
                    the cards below instead of pushing them down, so no other card changes size. */}
                <details
                    className="status-card__more"
                    name="status-details"
                    onKeyDown={(event) => {
                        if (event.key === 'Escape' && event.currentTarget.open) {
                            event.stopPropagation()
                            event.currentTarget.open = false
                            event.currentTarget.querySelector('summary').focus()
                        }
                    }}
                >
                    <summary className="status-card__toggle">
                        <ChevronRight size={14} aria-hidden="true" className="status-card__chevron" />
                        Details
                    </summary>
                    <div className="status-card__panel">
                        <p className="text-sm">{entry.usage}</p>
                        <p className="mt-2 text-sm text-fg-muted">
                            {isUnofficial ? 'Used by: ' : 'Defined in: '}
                            {sourceUrl ? (
                                <a
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1"
                                >
                                    {entry.source}
                                    <ExternalLink size={13} aria-hidden="true" />
                                    <span className="sr-only"> (opens in a new tab)</span>
                                </a>
                            ) : (
                                entry.source
                            )}
                        </p>
                    </div>
                </details>
            </article>
        </li>
    )
}

export default function HttpStatusTool() {
    const [query, setQuery] = useState('')
    const [family, setFamily] = useState('all')
    const searchRef = useRef(null)

    const results = useMemo(() => filterStatusCodes(query, family), [query, family])

    const clearFilters = () => {
        setQuery('')
        setFamily('all')
    }

    return (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
            <div className="card grid grid-cols-[minmax(0,1fr)] gap-4">
                <SearchInput
                    value={query}
                    onChange={setQuery}
                    inputRef={searchRef}
                    label="Search status codes"
                    placeholder="Search a code or a word, e.g. 404, redirect, 5xx, rate limit…"
                />
                <ChoiceGroup label="Show" options={FAMILIES} value={family} onChange={setFamily} />
            </div>

            <p className="text-sm text-fg-muted" role="status">
                Showing {results.length} of {STATUS_CODES.length} status codes
            </p>

            {results.length > 0 ? (
                <>
                    <h2 className="sr-only">Status codes</h2>
                    <ul className="status-grid">
                        {results.map((entry) => (
                            <StatusCard key={entry.code} entry={entry} />
                        ))}
                    </ul>
                </>
            ) : (
                <EmptyState
                    icon={SearchX}
                    title="No status codes found"
                    description="Try a different word, a code such as 404, or a family such as 4xx."
                >
                    <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                        Clear search and filter
                    </button>
                </EmptyState>
            )}
        </div>
    )
}