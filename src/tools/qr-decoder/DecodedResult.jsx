import { TriangleAlert } from 'lucide-react'
import { detectContentType, getContentNote } from './scan.js'

// The text is rendered as plain text. React escapes it, and it is never turned into a link.
export default function DecodedResult({ result }) {
    const type = detectContentType(result.text)

    return (
        <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{type.label}</span>
                <span className="text-sm text-fg-muted">
                    QR version {result.version} · {result.byteLength} {result.byteLength === 1 ? 'byte' : 'bytes'}
                </span>
            </div>

            <pre className="code-block">{result.text}</pre>

            <p role="note" className="flex gap-2 text-sm text-fg-muted">
                <TriangleAlert className="mt-0.5 shrink-0 text-[var(--star)]" size={16} aria-hidden="true" />
                {getContentNote(type.id)}
            </p>
        </div>
    )
}