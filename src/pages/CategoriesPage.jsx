import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import CategoryCard from '../components/tools/CategoryCard.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { categories, getToolsByCategory } from '../data/tools.js'

const visibleCategories = categories.filter((category) => getToolsByCategory(category.id).length > 0)

// /categories: every category, so none is hidden when the home page only has room for a few.
export default function CategoriesPage() {
    usePageMeta({
        title: 'All categories',
        description: 'Browse every group of developer tools on Devora: encoders, generators, security, images, text, network and more. Free and in your browser.',
    })

    return (
        <div className="container-page page">
            <nav aria-label="Breadcrumb" className="breadcrumb">
                <ol>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li aria-current="page">Categories</li>
                </ol>
            </nav>

            <PageHeader
                title="All categories"
                description="Every group of tools, in one place."
                actions={<span className="badge">{visibleCategories.length} categories</span>}
            />

            {/* The cards have h3 headings, so this h2 keeps the heading levels in order for screen readers. */}
            <h2 className="sr-only">Categories</h2>
            <div className="tool-grid">
                {visibleCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} count={getToolsByCategory(category.id).length} />
                ))}
            </div>
        </div>
    )
}