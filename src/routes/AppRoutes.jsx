import { Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
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
                {tools.map((tool) => (
                    <Route key={tool.id} path={tool.route} element={<ToolPage tool={tool} />} />
                ))}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}