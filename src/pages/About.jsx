import PageHeader from '../components/common/PageHeader.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { shortcuts } from '../data/shortcuts.js'

export default function About() {
    usePageMeta({
        title: 'About',
        description: 'What Devora is, why it exists, and how it approaches privacy.',
    })

    return (
        <div className="container-page page">
            <div className="max-w-2xl">
                <PageHeader title="About Devora" />

                <div className="flex flex-col gap-8">
                    <section aria-labelledby="about-what">
                        <h2 id="about-what" className="text-xl font-semibold">
                            What it is
                        </h2>
                        <p className="mt-2 text-fg-muted">
                            Devora is a collection of small developer utilities that open instantly in your
                            browser, with no installation and no account.
                        </p>
                    </section>

                    <section aria-labelledby="about-why">
                        <h2 id="about-why" className="text-xl font-semibold">
                            Why it exists
                        </h2>
                        <p className="mt-2 text-fg-muted">
                            Everyday tasks like decoding a token, generating a UUID, or building a gradient
                            shouldn't mean hunting through cluttered sites. Devora keeps each utility fast,
                            simple, and consistent.
                        </p>
                    </section>

                    <section aria-labelledby="about-privacy">
                        <h2 id="about-privacy" className="text-xl font-semibold">
                            Privacy
                        </h2>
                        <p className="mt-2 text-fg-muted">
                            Devora is a client-side application with no backend of its own. Your favorites,
                            recently used tools, and theme choice are stored only in your browser. The site's
                            font is loaded from Google Fonts. Each tool's page states exactly how it handles
                            your data, and a tool only claims local processing once it genuinely works that way.
                        </p>
                    </section>

                    <section aria-labelledby="about-shortcuts">
                        <h2 id="about-shortcuts" className="text-xl font-semibold">
                            Keyboard shortcuts
                        </h2>
                        <ul className="mt-3 flex flex-col gap-2">
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

                    <section aria-labelledby="about-next">
                        <h2 id="about-next" className="text-xl font-semibold">
                            What's next
                        </h2>
                        <p className="mt-2 text-fg-muted">
                            More tools will be added over time. The project is built so new utilities can be
                            added without reworking the rest of the app.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}