import { Link } from 'react-router-dom'
import { siteConfig } from '../../data/site.js'

// Read once when the page loads, so the year is always the current one without any setup.
const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container-page flex flex-col gap-3 pb-2 pt-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-sm">
                    <p className="font-semibold">{siteConfig.name}</p>
                    <p className="text-sm text-fg-muted">{siteConfig.tagline}</p>
                </div>
                <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <Link to="/about">About</Link>
                    <a href={siteConfig.repo.url} target="_blank" rel="noopener noreferrer">
                        GitHub<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <a href={siteConfig.repo.contributing} target="_blank" rel="noopener noreferrer">
                        Contributing<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <a href={siteConfig.repo.changelog} target="_blank" rel="noopener noreferrer">
                        Changelog<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                </nav>
            </div>
            <div>
                <div className="container-page flex flex-col gap-0.5 pb-4 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        <span aria-hidden="true">©</span>
                        <span className="sr-only">Copyright</span> {CURRENT_YEAR} {siteConfig.name}. All rights reserved.
                    </p>
                    <p>Everything you enter stays in your browser.</p>
                </div>
            </div>
        </footer>
    )
}