import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

/*
 * Renders a tool's documentation as an accordion (one section open at a time). Every
 * field is optional:
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

/*
 * Accessible accordion item: a heading containing a button (aria-expanded) that controls
 * a panel. The panel animates its height by transitioning a grid row between 0fr and 1fr,
 * which works in every browser. `visibility` is transitioned too: it flips to hidden only
 * after the closing animation ends (and to visible immediately on open), so collapsed
 * content is never focusable or read by screen readers.
 */
function DocSection({ baseId, id, title, openId, onToggle, children }) {
    const open = openId === id
    const triggerId = `${baseId}-${id}-trigger`
    const panelId = `${baseId}-${id}-panel`

    return (
        <section className="rounded-xl border border-border bg-surface">
            <h2 className="mb-0 text-base font-semibold">
                <button
                    type="button"
                    id={triggerId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => onToggle(id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3 text-left hover:bg-surface-2 ${open ? 'rounded-b-none' : ''}`}
                >
                    <span>{title}</span>
                    <ChevronDown
                        size={18}
                        aria-hidden="true"
                        className={`shrink-0 text-fg-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    />
                </button>
            </h2>
            <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out ${open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'}`}
            >
                {/* min-h-0 + overflow-hidden let this row shrink to nothing. Padding lives on the inner div so it can't hold the row open. */}
                <div className="min-h-0 overflow-hidden">
                    <div className="grid gap-2 px-4 pb-4">{children}</div>
                </div>
            </div>
        </section>
    )
}

export default function ToolDocs({ docs }) {
    const { about, howItWorks, example, notes, privacy } = docs
    const baseId = useId()
    // One value is the whole accordion state: the id of the open section, or null for none.
    const [openId, setOpenId] = useState('about')

    const toggle = (id) => setOpenId((current) => (current === id ? null : id))
    const sectionProps = { baseId, openId, onToggle: toggle }

    return (
        <div className="docs gap-3">
            {about && (
                <DocSection id="about" title="About" {...sectionProps}>
                    <Block value={about} />
                </DocSection>
            )}
            {howItWorks && (
                <DocSection id="how" title="How it works" {...sectionProps}>
                    <Block value={howItWorks} ordered />
                </DocSection>
            )}
            {example && (
                <DocSection id="example" title="Example" {...sectionProps}>
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
                </DocSection>
            )}
            {notes && (
                <DocSection id="notes" title="Notes & limitations" {...sectionProps}>
                    <Block value={notes} />
                </DocSection>
            )}
            {privacy && (
                <DocSection id="privacy" title="Security & privacy" {...sectionProps}>
                    <Block value={privacy} />
                </DocSection>
            )}
        </div>
    )
}