import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Button from '../ui/Button.jsx'
import ToolCard from './ToolCard.jsx'

// A category with more tools than FOLD_AFTER shows only the first PREVIEW_COUNT, so the home
// page stays short however many tools exist. Small categories are always shown in full.
const PREVIEW_COUNT = 6
const FOLD_AFTER = 9

export default function CategorySection({ category, tools }) {
    const [expanded, setExpanded] = useState(false)
    const gridId = useId()
    const CategoryIcon = category.icon

    // Finished tools come first, so unfinished ones never push them out of the preview.
    const ordered = [...tools].sort((a, b) => Number(b.status === 'live') - Number(a.status === 'live'))
    const canFold = ordered.length > FOLD_AFTER
    const shown = canFold && !expanded ? ordered.slice(0, PREVIEW_COUNT) : ordered

    return (
        <section data-tone={category.id} aria-labelledby={`category-${category.id}`}>
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
                <span className="badge">{ordered.length}</span>
            </div>

            <div id={gridId} className="tool-grid">
                {shown.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>

            {canFold && (
                <div className="mt-4">
                    <Button
                        variant="ghost"
                        aria-expanded={expanded}
                        aria-controls={gridId}
                        onClick={() => setExpanded((current) => !current)}
                    >
                        {expanded ? 'Show fewer' : `Show all ${ordered.length} ${category.name.toLowerCase()} tools`}
                        <ChevronDown
                            size={16}
                            aria-hidden="true"
                            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        />
                    </Button>
                </div>
            )}
        </section>
    )
}