export default function LoadingState({ label = 'Loading…' }) {
    return (
        <div role="status" className="py-12 text-center text-fg-muted">
            {label}
        </div>
    )
}