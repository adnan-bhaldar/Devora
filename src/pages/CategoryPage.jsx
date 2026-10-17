import { Link, useParams } from 'react-router-dom'
import { Layers } from 'lucide-react'
import EmptyState from '../components/common/EmptyState.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import ToolCard from '../components/tools/ToolCard.jsx'
import Button from '../components/ui/Button.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { categories, getToolsByCategory } from '../data/tools.js'
import { sortLiveFirst } from '../utils/toolOrder.js'
import NotFound from './NotFound.jsx'

function CategoryView({ category }) {
    usePageMeta({
        title: category.name,
        description: `${category.description} Free ${category.name.toLowerCase()} tools that run in your browser.`,
    })

    const tools = sortLiveFirst(getToolsByCategory(category.id))
    const otherCategories = categories.filter(
        (other) => other.id !== category.id && getToolsByCategory(other.id).length > 0,
    )

    return (
        <div data-tone={category.id} className="container-page page">
            <nav aria-label="Breadcrumb" className="breadcrumb">
                <ol>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li aria-current="page">{category.name}</li>
                </ol>
            </nav>

            <PageHeader
                title={category.name}
                description={category.description}
                actions={
                    <span className="badge">
                        {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                    </span>
                }
            />

            {tools.length > 0 ? (
                <div className="tool-grid">
                    {tools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Layers}
                    title="No tools here yet"
                    description="Tools for this category are on the way."
                >
                    <Button to="/" variant="primary">
                        Browse all tools
                    </Button>
                </EmptyState>
            )}

            {otherCategories.length > 0 && (
                <section aria-labelledby="other-categories" className="mt-14">
                    <h2 id="other-categories" className="mb-4 text-lg font-semibold tracking-tight">
                        Other categories
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {otherCategories.map((other) => {
                            const Icon = other.icon
                            return (
                                <Link key={other.id} to={`/categories/${other.id}`} data-tone={other.id} className="chip">
                                    <Icon size={16} aria-hidden="true" />
                                    {other.name}
                                </Link>
                            )
                        })}
                    </div>
                </section>
            )}
        </div>
    )
}

export default function CategoryPage() {
    const { categoryId } = useParams()
    const category = categories.find((item) => item.id === categoryId)

    // An address like /categories/nope is treated like any other page that does not exist.
    if (!category) return <NotFound />
    return <CategoryView category={category} />
}