import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Hammer } from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import LoadingState from '../components/common/LoadingState.jsx'
import Button from '../components/ui/Button.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { toolComponents } from '../tools/index.js'

export default function ToolPage({ tool }) {
    usePageMeta(tool.seo)
    const ToolComponent = toolComponents[tool.id]

    return (
        <div className="container-page page">
            <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium">
                <ArrowLeft size={16} aria-hidden="true" />
                All tools
            </Link>

            <PageHeader title={tool.name} description={tool.description} />

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