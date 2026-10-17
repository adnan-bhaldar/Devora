import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

// A card that opens a category page. Used in the "Browse by category" section on the home page.
export default function CategoryCard({ category, count }) {
    const Icon = category.icon

    return (
        <article data-tone={category.id} className="card card-link flex h-full flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <span className="icon-tile">
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="badge">
                    {count} {count === 1 ? 'tool' : 'tools'}
                </span>
            </div>
            <div>
                <h3 className="text-base font-semibold tracking-tight">
                    <Link to={`/categories/${category.id}`} className="card-stretch">
                        {category.name}
                    </Link>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{category.description}</p>
            </div>
            <ArrowUpRight className="card-arrow absolute bottom-4 right-4" size={18} aria-hidden="true" />
        </article>
    )
}