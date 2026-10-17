import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PREVIEW_COUNT, sortLiveFirst } from '../../utils/toolOrder.js'
import ToolCard from './ToolCard.jsx'

function ShowAllCard({ category, count }) {
    return (
        <article data-tone={category.id} className="card card-link flex h-full flex-col justify-between gap-4">
            <span className="icon-tile">
                <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
                <h3 className="text-base font-semibold tracking-tight">
                    <Link to={`/categories/${category.id}`} className="card-stretch">
                        Show all {count} tools
                    </Link>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                    See everything in {category.name}.
                </p>
            </div>
        </article>
    )
}

export default function CategorySection({ category, tools }) {
    const CategoryIcon = category.icon
    const ordered = sortLiveFirst(tools)
    const hasMore = ordered.length > PREVIEW_COUNT
    const shown = hasMore ? ordered.slice(0, PREVIEW_COUNT) : ordered

    return (
        <section data-tone={category.id} aria-labelledby={`category-${category.id}`}>
            <div className="mb-5 flex items-center gap-3">
                <span className="icon-tile">
                    <CategoryIcon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                    <h2 id={`category-${category.id}`} className="text-xl font-semibold tracking-tight">
                        <Link to={`/categories/${category.id}`}>{category.name}</Link>
                    </h2>
                    <p className="text-sm text-fg-muted">{category.description}</p>
                </div>
                <span className="badge">{ordered.length}</span>
            </div>

            <div className="tool-grid">
                {shown.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
                {hasMore && <ShowAllCard category={category} count={ordered.length} />}
            </div>
        </section>
    )
}