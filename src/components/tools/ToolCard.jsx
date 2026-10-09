import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function ToolCard({ tool }) {
    const Icon = tool.icon
    const isLive = tool.status === 'live'

    return (
        <Link
            to={tool.route}
            data-tone={tool.categories[0]}
            className="card card-link flex h-full flex-col gap-4"
        >
            <div className="flex items-start justify-between gap-3">
                <span className="icon-tile">
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="flex items-center gap-2">
                    {!isLive && <span className="badge">Coming soon</span>}
                    <ArrowUpRight className="card-arrow" size={18} aria-hidden="true" />
                </div>
            </div>
            <div>
                <h3 className="text-base font-semibold tracking-tight">{tool.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{tool.description}</p>
            </div>
        </Link>
    )
}