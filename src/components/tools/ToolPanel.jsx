// A titled section of a tool (Input, Result, Options...). Stack several inside <div className="tool-stack">.
export default function ToolPanel({ title, actions, className = '', children }) {
    return (
        <section className={`card ${className}`.trim()}>
            <div className="tool-panel__header">
                <h2 className="tool-panel__title">{title}</h2>
                {actions && <div className="tool-panel__actions">{actions}</div>}
            </div>
            {children}
        </section>
    )
}