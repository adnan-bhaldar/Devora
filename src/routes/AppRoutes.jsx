import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import CategoriesPage from '../pages/CategoriesPage.jsx'
import CategoryPage from '../pages/CategoryPage.jsx'
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import NotFound from '../pages/NotFound.jsx'
import ToolPage from '../pages/ToolPage.jsx'
import { tools } from '../data/tools.js'

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                {/* The changelog now lives in CHANGELOG.md. Keep old links and bookmarks working. */}
                <Route path="whats-new" element={<Navigate to="/about" replace />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/:categoryId" element={<CategoryPage />} />
                {tools.map((tool) => (
                    <Route key={tool.id} path={tool.route} element={<ToolPage tool={tool} />} />
                ))}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}