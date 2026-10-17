import { Link } from 'react-router-dom'
import { siteConfig } from '../../data/site.js'

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container-page flex flex-col gap-6 py-8 sm:flex-row sm:items-start sm:justify-between">
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
        </footer>
    )
}