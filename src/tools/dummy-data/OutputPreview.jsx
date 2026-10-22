const TABLE_ROWS = 100 // rows drawn in the table preview
const RAW_LINES = 400 // lines drawn in the raw preview

// A grid of the generated values. Only the first rows are drawn so a large result stays fast.
function DataTable({ columns, rows }) {
    const shown = rows.slice(0, TABLE_ROWS)
    return (
        <>
            {/* tabIndex 0 lets keyboard users scroll a wide table. */}
            <div className="dd-scroll" tabIndex={0} role="region" aria-label="Generated data table">
                <table className="dd-table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            {columns.map((column) => (
                                <th key={column.id} scope="col">
                                    {column.key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((row, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                {row.map((value, position) => (
                                    <td key={columns[position].id}>
                                        {value === null ? <span className="text-fg-muted">null</span> : String(value)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {rows.length > shown.length && (
                <p className="mt-2 text-sm text-fg-muted">
                    Showing the first {shown.length} of {rows.length} records. Copy and download include all of them.
                </p>
            )}
        </>
    )
}

// The exact text that Copy and Download use, in plain monospaced type (no extra code-highlighting library).
function RawOutput({ text, lineNumbers }) {
    const lines = text.split('\n')
    const shown = lines.length > RAW_LINES ? lines.slice(0, RAW_LINES) : lines
    return (
        <>
            <div className="dd-code">
                {lineNumbers && (
                    <pre className="dd-code__gutter" aria-hidden="true">
                        {shown.map((_, index) => index + 1).join('\n')}
                    </pre>
                )}
                <pre className="code-block dd-code__body" tabIndex={0} aria-label="Generated output">
                    {shown.join('\n')}
                </pre>
            </div>
            {lines.length > shown.length && (
                <p className="mt-2 text-sm text-fg-muted">
                    Showing the first {shown.length} of {lines.length} lines. Copy and download include everything.
                </p>
            )}
        </>
    )
}

export default function OutputPreview({ mode, columns, rows, text, lineNumbers }) {
    return mode === 'table' ? <DataTable columns={columns} rows={rows} /> : <RawOutput text={text} lineNumbers={lineNumbers} />
}