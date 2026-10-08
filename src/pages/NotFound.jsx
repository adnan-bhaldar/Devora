import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState.jsx'
import Button from '../components/ui/Button.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { tools } from '../data/tools.js'

export default function NotFound() {
    usePageMeta({
        title: 'Page not found',
        description: 'The page you were looking for does not exist.',
    })

    return (
        <div className="container-page page">
            <EmptyState
                icon={Compass}
                title="Page not found"
                description="That address doesn't match anything on Devora. It may have moved or never existed."
            >
                <Button to="/" variant="primary">
                    Back to Devora
                </Button>
                <p className="mt-4 text-sm text-fg-muted">Or try one of these tools:</p>
                <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
                    {tools.slice(0, 4).map((tool) => (
                        <li key={tool.id}>
                            <Link to={tool.route}>{tool.name}</Link>
                        </li>
                    ))}
                </ul>
            </EmptyState>
        </div>
    )
}