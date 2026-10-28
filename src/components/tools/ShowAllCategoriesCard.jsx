import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

// The last card in "Browse by category" when there are more categories than fit: opens the page with all of them.
export default function ShowAllCategoriesCard({ count }) {
    return (
        <article className="card card-link flex h-full flex-col justify-between gap-4">
            <span className="icon-tile">
                <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
                <h3 className="text-base font-semibold tracking-tight">
                    <Link to="/categories" className="card-stretch">
                        Show all {count} categories
                    </Link>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">See every group of tools in one place.</p>
            </div>
        </article>
    )
}