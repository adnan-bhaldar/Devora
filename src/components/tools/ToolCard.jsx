import { Link } from 'react-router-dom'

export default function ToolCard({ tool }) {
    const Icon = tool.icon
    const isLive = tool.status === 'live'

    return (
        <Link to={tool.route} className="card card-link flex h-full flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <span className="icon-tile">
                    <Icon size={18} aria-hidden="true" />
                </span>
                {!isLive && <span className="badge">Coming soon</span>}
            </div>
            <div>
                <h3 className="text-base font-semibold">{tool.name}</h3>
                <p className="mt-1 text-sm text-fg-muted">{tool.description}</p>
            </div>
        </Link>
    )
}