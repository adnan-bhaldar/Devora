/*
 * Renders a tool's documentation. Every field is optional:
 *   about:      string
 *   howItWorks: string | string[]   (an array renders as numbered steps)
 *   example:    { input: string, output: string }
 *   notes:      string | string[]
 *   privacy:    string              (only include claims the implementation truly supports)
 */
function Block({ value, ordered = false }) {
    if (Array.isArray(value)) {
        const List = ordered ? 'ol' : 'ul'
        return (
            <List className="docs-list" data-ordered={ordered}>
                {value.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </List>
        )
    }
    return <p>{value}</p>
}

export default function ToolDocs({ docs }) {
    const { about, howItWorks, example, notes, privacy } = docs

    return (
        <div className="docs">
            {about && (
                <section aria-labelledby="docs-about">
                    <h2 id="docs-about">About</h2>
                    <Block value={about} />
                </section>
            )}
            {howItWorks && (
                <section aria-labelledby="docs-how">
                    <h2 id="docs-how">How it works</h2>
                    <Block value={howItWorks} ordered />
                </section>
            )}
            {example && (
                <section aria-labelledby="docs-example">
                    <h2 id="docs-example">Example</h2>
                    <div className="docs-example">
                        <div>
                            <p className="docs-label">Input</p>
                            <pre className="code-block">{example.input}</pre>
                        </div>
                        <div>
                            <p className="docs-label">Output</p>
                            <pre className="code-block">{example.output}</pre>
                        </div>
                    </div>
                </section>
            )}
            {notes && (
                <section aria-labelledby="docs-notes">
                    <h2 id="docs-notes">Notes &amp; limitations</h2>
                    <Block value={notes} />
                </section>
            )}
            {privacy && (
                <section aria-labelledby="docs-privacy">
                    <h2 id="docs-privacy">Security &amp; privacy</h2>
                    <Block value={privacy} />
                </section>
            )}
        </div>
    )
}