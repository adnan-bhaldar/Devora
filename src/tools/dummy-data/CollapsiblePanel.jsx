import { useId, useState } from 'react'
import { ChevronRight } from 'lucide-react'

/*
 * A panel like ToolPanel whose body can be opened and closed. The title is a real button
 * (aria-expanded tells screen readers the state). The action buttons stay beside it, outside
 * the toggle button, so they are never nested inside another button.
 */
export default function CollapsiblePanel({ title, actions, defaultOpen = false, children }) {
    const [open, setOpen] = useState(defaultOpen)
    const bodyId = useId()

    return (
        <section className="card">
            <div className="tool-panel__header" style={open ? undefined : { marginBottom: 0 }}>
                <h2 className="tool-panel__title">
                    <button type="button" className="dd-toggle" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((current) => !current)}>
                        <ChevronRight size={16} aria-hidden="true" className="dd-toggle__chevron" />
                        {title}
                    </button>
                </h2>
                {actions && <div className="tool-panel__actions">{actions}</div>}
            </div>
            <div id={bodyId} hidden={!open}>
                {children}
            </div>
        </section>
    )
}