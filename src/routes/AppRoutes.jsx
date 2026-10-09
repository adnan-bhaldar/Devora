import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import LoadingState from '../components/common/LoadingState.jsx'
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import WhatsNew from '../pages/WhatsNew.jsx'
import NotFound from '../pages/NotFound.jsx'
import ToolPage from '../pages/ToolPage.jsx'
import { tools } from '../data/tools.js'

// Development-only page for trying the shared components. Not part of production builds.
const Playground = import.meta.env.DEV ? lazy(() => import('../pages/Playground.jsx')) : null

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="whats-new" element={<WhatsNew />} />
                {tools.map((tool) => (
                    <Route key={tool.id} path={tool.route} element={<ToolPage tool={tool} />} />
                ))}
                {Playground && (
                    <Route
                        path="_playground"
                        element={
                            <Suspense fallback={<LoadingState />}>
                                <Playground />
                            </Suspense>
                        }
                    />
                )}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}