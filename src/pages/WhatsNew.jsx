import PageHeader from '../components/common/PageHeader.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { changelog } from '../data/changelog.js'

const TYPE_LABELS = { new: 'New', improved: 'Improved', fixed: 'Fixed' }

function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export default function WhatsNew() {
    usePageMeta({
        title: "What's New",
        description: 'Recent additions and improvements to Devora.',
    })

    return (
        <div className="container-page page">
            <div className="max-w-2xl">
                <PageHeader title="What's New" description="Recent additions and improvements to Devora." />
                <ol className="change-list">
                    {changelog.map((entry) => (
                        <li key={entry.id} className="change-item">
                            <div className="flex items-center gap-3">
                                <span className="badge">{TYPE_LABELS[entry.type]}</span>
                                <time dateTime={entry.date} className="text-sm text-fg-muted">
                                    {formatDate(entry.date)}
                                </time>
                            </div>
                            <h2 className="text-lg font-semibold">{entry.title}</h2>
                            <p className="text-fg-muted">{entry.description}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}