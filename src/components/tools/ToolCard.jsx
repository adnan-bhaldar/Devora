import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import FavoriteButton from './FavoriteButton.jsx'

// The whole card is clickable through the title link's stretched ::after, which avoids
// putting a button (the favorite star) inside a link, something HTML doesn't allow.
export default function ToolCard({ tool }) {
    const Icon = tool.icon
    const isLive = tool.status === 'live'

    return (
        <article data-tone={tool.categories[0]} className="card card-link flex h-full flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <span className="icon-tile">
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="flex items-center gap-1.5">
                    {!isLive && <span className="badge">Coming soon</span>}
                    <FavoriteButton toolId={tool.id} toolName={tool.name} />
                </div>
            </div>
            <div>
                <h3 className="text-base font-semibold tracking-tight">
                    <Link to={tool.route} className="card-stretch">
                        {tool.name}
                    </Link>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{tool.description}</p>
            </div>
            <ArrowUpRight className="card-arrow absolute bottom-4 right-4" size={18} aria-hidden="true" />
        </article>
    )
}