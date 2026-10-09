import { Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Hammer } from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import LoadingState from '../components/common/LoadingState.jsx'
import FavoriteButton from '../components/tools/FavoriteButton.jsx'
import Button from '../components/ui/Button.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import useToolPrefs from '../hooks/useToolPrefs.js'
import { toolComponents } from '../tools/index.jsx'

export default function ToolPage({ tool }) {
    usePageMeta(tool.seo)
    const { addRecent } = useToolPrefs()
    const ToolComponent = toolComponents[tool.id]

    // Only tools that actually exist count as "recently used".
    useEffect(() => {
        if (ToolComponent) addRecent(tool.id)
    }, [ToolComponent, tool.id, addRecent])

    return (
        <div className="container-page page">
            <nav aria-label="Breadcrumb" className="breadcrumb">
                <ol>
                    <li>
                        <Link to="/">Tools</Link>
                    </li>
                    <li aria-current="page">{tool.name}</li>
                </ol>
            </nav>

            <PageHeader
                title={tool.name}
                description={tool.description}
                actions={<FavoriteButton toolId={tool.id} toolName={tool.name} variant="button" />}
            />

            {ToolComponent ? (
                <Suspense fallback={<LoadingState />}>
                    <ToolComponent />
                </Suspense>
            ) : (
                <EmptyState
                    icon={Hammer}
                    title="This tool is coming soon"
                    description="It's on the roadmap and not built yet. The page and URL already exist so links to it will keep working."
                >
                    <Button to="/" variant="primary">
                        Browse all tools
                    </Button>
                </EmptyState>
            )}
        </div>
    )
}