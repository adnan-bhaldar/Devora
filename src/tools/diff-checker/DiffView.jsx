import { useMemo, useState } from 'react'
import { CONTEXT } from './diff.js'

const MAX_ROWS = 4000 // rows drawn at once, so a huge result stays fast (copy and download still include everything)

// The text of one line, with the changed words or characters marked.
function LineText({ line, kind }) {
    const content =
        line.parts ? line.parts.map((part, index) => (part.changed ? <mark key={index} className="diff-mark">{part.text}</mark> : part.text)) : line.text === '' ? ' ' : line.text
    return (
        <>
            {kind !== 'equal' && <span className="sr-only">{kind === 'removed' ? 'Removed: ' : 'Added: '}</span>}
            {content}
        </>
    )
}

/*
 * Turns the comparison into the list of rows to draw. Unchanged stretches longer than a few lines
 * can be folded into one "Show N unchanged lines" row (and opened again one at a time).
 */
function buildRows(segments, view, hideUnchanged, expanded) {
    const rows = []
    segments.forEach((segment, index) => {
        if (segment.type === 'equal') {
            const list = segment.rows
            const first = index === 0
            const last = index === segments.length - 1
            const keepBefore = first ? 0 : CONTEXT
            const keepAfter = last ? 0 : CONTEXT
            const foldable = hideUnchanged && !expanded.has(index) && list.length > keepBefore + keepAfter + 1
            if (!foldable) {
                list.forEach((row) => rows.push({ kind: 'equal', row }))
                return
            }
            list.slice(0, keepBefore).forEach((row) => rows.push({ kind: 'equal', row }))
            const hidden = list.length - keepBefore - keepAfter
            rows.push({ kind: 'fold', segment: index, hidden })
            list.slice(list.length - keepAfter).forEach((row) => rows.push({ kind: 'equal', row }))
        } else if (view === 'split') {
            const count = Math.max(segment.removed.length, segment.added.length)
            for (let line = 0; line < count; line += 1) {
                rows.push({ kind: 'change', left: segment.removed[line] ?? null, right: segment.added[line] ?? null })
            }
        } else {
            segment.removed.forEach((line) => rows.push({ kind: 'removed', line }))
            segment.added.forEach((line) => rows.push({ kind: 'added', line }))
        }
    })
    return rows
}

export default function DiffView({ segments, view, hideUnchanged, wrap }) {
    // Folded stretches the person opened. Keyed by position, so it is reset (by a new key) when the texts change.
    const [expanded, setExpanded] = useState(() => new Set())
    const rows = useMemo(() => buildRows(segments, view, hideUnchanged, expanded), [segments, view, hideUnchanged, expanded])
    const shown = rows.slice(0, MAX_ROWS)

    const expand = (segment) => setExpanded((current) => new Set(current).add(segment))

    return (
        <>
            {/* tabIndex 0 lets keyboard users scroll a wide comparison. */}
            <div className="diff-scroll" tabIndex={0} role="region" aria-label="Differences between the two texts">
                <table className="diff-table" data-view={view} data-wrap={wrap}>
                    <caption className="sr-only">
                        {view === 'split' ? 'Original text on the left, changed text on the right' : 'Removed and added lines, in one column'}
                    </caption>
                    <tbody>
                        {shown.map((item, index) => {
                            if (item.kind === 'fold') {
                                return (
                                    <tr key={`fold-${item.segment}`} className="diff-fold">
                                        <td colSpan={4}>
                                            <button type="button" className="diff-expand" onClick={() => expand(item.segment)}>
                                                Show {item.hidden} unchanged {item.hidden === 1 ? 'line' : 'lines'}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }
                            if (view === 'split') {
                                const left = item.kind === 'equal' ? { no: item.row.left, text: item.row.leftText } : item.left
                                const right = item.kind === 'equal' ? { no: item.row.right, text: item.row.rightText } : item.right
                                const leftKind = item.kind === 'equal' ? 'equal' : left ? 'removed' : 'empty'
                                const rightKind = item.kind === 'equal' ? 'equal' : right ? 'added' : 'empty'
                                return (
                                    <tr key={index}>
                                        <td className="diff-no" data-kind={leftKind}>{left?.no}</td>
                                        <td className="diff-text" data-kind={leftKind}>{left && <LineText line={left} kind={leftKind} />}</td>
                                        <td className="diff-no" data-kind={rightKind}>{right?.no}</td>
                                        <td className="diff-text" data-kind={rightKind}>{right && <LineText line={right} kind={rightKind} />}</td>
                                    </tr>
                                )
                            }
                            // unified: two number columns, a sign, and the text
                            const kind = item.kind
                            const line = kind === 'equal' ? { text: item.row.rightText, parts: null } : item.line
                            return (
                                <tr key={index}>
                                    <td className="diff-no" data-kind={kind}>{kind === 'added' ? '' : kind === 'equal' ? item.row.left : line.no}</td>
                                    <td className="diff-no" data-kind={kind}>{kind === 'removed' ? '' : kind === 'equal' ? item.row.right : line.no}</td>
                                    <td className="diff-sign" data-kind={kind} aria-hidden="true">{kind === 'added' ? '+' : kind === 'removed' ? '−' : ''}</td>
                                    <td className="diff-text" data-kind={kind}><LineText line={line} kind={kind} /></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {rows.length > shown.length && (
                <p className="mt-2 text-sm text-fg-muted">
                    Showing the first {shown.length.toLocaleString('en-US')} of {rows.length.toLocaleString('en-US')} rows. Turn on “Hide unchanged lines”, or use Copy diff or Download to get everything.
                </p>
            )}
        </>
    )
}