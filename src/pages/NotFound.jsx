import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Compass } from 'lucide-react'
import EmptyState from '../components/common/EmptyState.jsx'
import Button from '../components/ui/Button.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { tools } from '../data/tools.js'
import { searchTools } from '../utils/search.js'

export default function NotFound() {
    usePageMeta({
        title: 'Page not found',
        description: 'The page you were looking for does not exist.',
    })

    const { pathname } = useLocation()

    // Treat the mistyped address as a search ("/jw" -> "jw") to suggest likely tools.
    const { suggestions, isGuess } = useMemo(() => {
        const guess = pathname.replace(/[^a-z0-9]+/gi, ' ').trim()
        const matches = guess ? searchTools(guess) : []
        return matches.length > 0
            ? { suggestions: matches.slice(0, 4), isGuess: true }
            : { suggestions: tools.slice(0, 4), isGuess: false }
    }, [pathname])

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
                <p className="mt-4 text-sm text-fg-muted">
                    {isGuess ? 'Did you mean one of these?' : 'Or try one of these tools:'}
                </p>
                <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
                    {suggestions.map((tool) => (
                        <li key={tool.id}>
                            <Link to={tool.route}>{tool.name}</Link>
                        </li>
                    ))}
                </ul>
            </EmptyState>
        </div>
    )
}