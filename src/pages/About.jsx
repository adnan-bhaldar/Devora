import { GitPullRequest, Keyboard, Lock, WifiOff, Zap } from 'lucide-react'
import GithubIcon from '../components/common/GithubIcon.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { shortcuts } from '../data/shortcuts.js'
import { siteConfig } from '../data/site.js'
import { categories, tools } from '../data/tools.js'
// Read from package.json when the site is built, so it can never go out of date.
import { version } from '../../package.json'

const liveTools = tools.filter((tool) => tool.status === 'live')

const STATS = [
    { value: liveTools.length, label: 'Tools' },
    { value: categories.length, label: 'Categories' },
    { value: '0', label: 'Servers' },
    { value: '100%', label: 'In your browser' },
]

const PRINCIPLES = [
    {
        icon: Lock,
        title: 'Private by design',
        text: 'Everything runs in your browser. What you type is never sent to a server, logged, or stored.',
    },
    {
        icon: Zap,
        title: 'Fast and focused',
        text: 'Each tool does one job and opens instantly. No account, no installation, no clutter.',
    },
    {
        icon: WifiOff,
        title: 'Works offline',
        text: 'After your first visit, every tool keeps working without a connection, and you can install Devora as an app.',
    },
]

function ExternalLink({ href, className, children }) {
    return (
        <a href={href} className={className} target="_blank" rel="noopener noreferrer">
            {children}
            <span className="sr-only"> (opens in a new tab)</span>
        </a>
    )
}

export default function About() {
    usePageMeta({
        title: 'About',
        description:
            'What Devora is, how it handles your privacy, and how to contribute.',
    })

    const { repo } = siteConfig

    return (
        <div className="container-page page about">
            <header className="about-hero">
                <span className="about-version rise">
                    {/* Tailwind's animate-ping grows and fades the outer circle, which gives the pulsing ring. */}
                    <span className="relative flex size-2" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                        <span className="relative inline-flex size-2 rounded-full bg-accent" />
                    </span>
                    <span className="about-version__label">Version</span>
                    <span className="about-version__number">{version}</span>
                </span>
                <h1 className="hero-title rise rise-2 mt-6">
                    Small tools, <span className="text-gradient">done properly.</span>
                </h1>
                <p className="rise rise-2 mt-5 max-w-2xl text-lg text-fg-muted sm:text-xl">
                    Devora is a collection of developer utilities that open instantly in your browser. No
                    installation, no account, and what you type never leaves your browser.
                </p>
                <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
                    <ExternalLink href={repo.url} className="btn btn-primary">
                        <GithubIcon size={18} />
                        View on GitHub
                    </ExternalLink>
                    <ExternalLink href={repo.contributing} className="btn btn-secondary">
                        <GitPullRequest size={18} aria-hidden="true" />
                        Contribute
                    </ExternalLink>
                </div>
            </header>

            <dl className="about-stats rise rise-3">
                {STATS.map((stat) => (
                    <div key={stat.label} className="about-stat">
                        <dt className="text-sm text-fg-muted">{stat.label}</dt>
                        <dd className="about-stat__value text-gradient">{stat.value}</dd>
                    </div>
                ))}
            </dl>

            <section aria-labelledby="about-why" className="about-section">
                <h2 id="about-why" className="about-heading">
                    Why it exists
                </h2>
                <p className="about-lead">
                    Everyday tasks like decoding a token, generating a UUID, or building a gradient shouldn't
                    mean hunting through cluttered sites full of ads and sign-ups. Devora keeps each utility
                    fast, simple and consistent, and is built so new tools can be added without reworking the
                    rest of the app.
                </p>
                <ul className="about-grid">
                    {PRINCIPLES.map(({ icon: Icon, title, text }) => (
                        <li key={title} className="card about-card">
                            <span className="icon-tile">
                                <Icon size={20} aria-hidden="true" />
                            </span>
                            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                            <p className="mt-2 text-fg-muted">{text}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section aria-labelledby="about-privacy" className="about-section">
                <h2 id="about-privacy" className="about-heading">
                    Privacy
                </h2>
                <div className="card about-privacy">
                    <p className="text-fg-muted">
                        Devora is a client-side application with no backend of its own. Your favorites,
                        recently used tools and theme choice are stored only in your browser. The site's font
                        is loaded from Google Fonts. To work offline, Devora also saves its own files in your
                        browser after your first visit. Your input is never saved. Each tool's page states
                        exactly how it handles your data, and a tool only claims local processing once it
                        genuinely works that way.
                    </p>
                </div>
            </section>

            <section aria-labelledby="about-shortcuts" className="about-section">
                <h2 id="about-shortcuts" className="about-heading">
                    <Keyboard size={22} aria-hidden="true" className="inline-block align-[-3px]" /> Keyboard
                    shortcuts
                </h2>
                <ul className="card about-shortcuts">
                    {shortcuts.map((shortcut) => (
                        <li key={shortcut.id} className="flex items-center justify-between gap-4 text-fg-muted">
                            <span>{shortcut.description}</span>
                            <span className="flex shrink-0 gap-1">
                                {shortcut.keys.map((key) => (
                                    <kbd key={key} className="kbd">
                                        {key}
                                    </kbd>
                                ))}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}