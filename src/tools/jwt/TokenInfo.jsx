const TONE_CLASSES = {
    danger: 'border-danger text-danger',
    warning: 'border-[var(--star)] text-[var(--star)]',
    neutral: '',
}

export default function TokenInfo({ info }) {
    const { status, rows } = info

    return (
        <div className="grid gap-4">
            <div>
                <span className={`badge text-sm font-semibold ${TONE_CLASSES[status.tone]}`}>
                    {status.label}
                </span>
                <p className="mt-2 text-sm text-fg-muted">
                    {status.detail} This only compares the token’s own claims with your device’s clock. It does
                    not mean the token is valid.
                </p>
            </div>

            <dl className="grid gap-3">
                {rows.map((row) => (
                    <div key={row.label}>
                        <dt className="text-sm text-fg-muted">{row.label}</dt>
                        <dd className="font-medium">{row.value}</dd>
                        {row.detail && <dd className="text-sm text-fg-muted">{row.detail}</dd>}
                    </div>
                ))}
            </dl>
        </div>
    )
}