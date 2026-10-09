import { Link } from 'react-router-dom'
import { siteConfig } from '../../data/site.js'

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container-page flex flex-col gap-6 py-8 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-sm">
                    <p className="font-semibold">{siteConfig.name}</p>
                    <p className="text-sm text-fg-muted">{siteConfig.tagline}</p>
                    <p className="mt-3 text-sm text-fg-muted">
                        Devora runs in your browser and has no backend of its own.
                    </p>
                </div>
                <nav aria-label="Footer" className="flex gap-5 text-sm">
                    <Link to="/">Tools</Link>
                    <Link to="/whats-new">What&rsquo;s New</Link>
                    <Link to="/about">About</Link>
                </nav>
            </div>
        </footer>
    )
}