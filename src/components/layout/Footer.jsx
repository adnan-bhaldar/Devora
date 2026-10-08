import { Link } from 'react-router-dom'
import { siteConfig } from '../../data/site.js'

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="font-semibold">{siteConfig.name}</p>
                    <p className="text-sm text-fg-muted">{siteConfig.tagline}</p>
                </div>
                <nav aria-label="Footer" className="flex gap-4 text-sm">
                    <Link to="/">Tools</Link>
                    <Link to="/about">About</Link>
                </nav>
            </div>
        </footer>
    )
}