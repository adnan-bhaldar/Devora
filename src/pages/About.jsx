import {
    ArrowUpRight,
    Bug,
    GitPullRequest,
    Keyboard,
    Lightbulb,
    Lock,
    WifiOff,
    Zap,
} from 'lucide-react'
import GithubIcon from '../components/common/GithubIcon.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { shortcuts } from '../data/shortcuts.js'
import { siteConfig } from '../data/site.js'
import { categories, tools } from '../data/tools.js'
import './about.css'

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

const STEPS = [
    {
        icon: Lightbulb,
        title: 'Pick something to improve',
        text: 'Browse the open issues, or suggest a new tool or a fix of your own.',
    },
    {
        icon: GitPullRequest,
        title: 'Make the change',
        text: 'Fork the repository, add or fix a tool, and run the checks listed in the guide.',
    },
    {
        icon: Bug,
        title: 'Open a pull request',
        text: 'Describe what changed and why. Small, focused pull requests are reviewed fastest.',
    },
]

const STACK = ['React', 'Vite', 'Tailwind CSS', 'React Router', 'Web Crypto API', 'Service Worker']

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
            'What Devora is, how it handles your privacy, how to contribute, and who builds it.',
    })

    const { author, repo } = siteConfig

    return (
        <div className="container-page page about">
            <header className="about-hero">
                <span className="pill rise">
                    <span className="pill-dot" aria-hidden="true" />
                    Open source · Client-side
                </span>
                <h1 className="hero-title rise rise-2 mt-6">
                    Small tools, <span className="text-gradient">done properly.</span>
                </h1>
                <p className="rise rise-2 mt-5 max-w-2xl text-lg text-fg-muted sm:text-xl">
                    Devora is a collection of developer utilities that open instantly in your browser. No
                    installation, no account, and nothing leaves your device.
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

            <section aria-labelledby="about-contribute" className="about-section">
                <h2 id="about-contribute" className="about-heading">
                    Contribute
                </h2>
                <p className="about-lead">
                    Devora is open source and contributions are welcome, from a typo fix to a whole new tool.
                    The contribution guide explains how to set the project up and how to add a tool.
                </p>
                <ol className="about-grid">
                    {STEPS.map(({ icon: Icon, title, text }, index) => (
                        <li key={title} className="card about-card">
                            <div className="flex items-center justify-between">
                                <span className="icon-tile">
                                    <Icon size={20} aria-hidden="true" />
                                </span>
                                <span className="about-step" aria-hidden="true">
                                    0{index + 1}
                                </span>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">
                                <span className="sr-only">Step {index + 1}: </span>
                                {title}
                            </h3>
                            <p className="mt-2 text-fg-muted">{text}</p>
                        </li>
                    ))}
                </ol>
                <div className="mt-6 flex flex-wrap gap-3">
                    <ExternalLink href={repo.contributing} className="btn btn-secondary">
                        Read the contribution guide
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </ExternalLink>
                    <ExternalLink href={repo.newIssue} className="btn btn-secondary">
                        Report a bug or suggest a tool
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </ExternalLink>
                    <ExternalLink href={repo.changelog} className="btn btn-ghost">
                        Changelog
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </ExternalLink>
                </div>
            </section>

            <section aria-labelledby="about-developer" className="about-section">
                <h2 id="about-developer" className="about-heading">
                    The developer
                </h2>
                <article className="card dev-card">
                    <div className="dev-card__avatar" aria-hidden="true">
                        {author.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xl font-semibold">{author.name}</h3>
                        <p className="text-sm font-medium text-accent">{author.role}</p>
                        <p className="mt-3 max-w-xl text-fg-muted">{author.bio}</p>
                        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Built with">
                            {STACK.map((item) => (
                                <li key={item} className="badge">
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <ExternalLink href={author.github} className="btn btn-secondary">
                                <GithubIcon size={18} />@{author.githubHandle}
                            </ExternalLink>
                            <ExternalLink href={repo.url} className="btn btn-ghost">
                                Star the project
                                <ArrowUpRight size={16} aria-hidden="true" />
                            </ExternalLink>
                        </div>
                    </div>
                </article>
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