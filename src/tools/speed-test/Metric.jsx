import useAnimatedNumber from '../../hooks/useAnimatedNumber.js'

// A small bar chart of every sample taken so far. New bars grow in, and the others rescale smoothly.
function Bars({ points }) {
    const shown = points.slice(-24)
    const top = Math.max(...shown, 1)
    return (
        <div className="speed-bars" aria-hidden="true">
            {shown.map((point, index) => (
                <span key={`${points.length - shown.length + index}`} className="speed-bars__bar" style={{ height: `${Math.max(6, (point / top) * 100)}%` }} />
            ))}
        </div>
    )
}

/**
 * One result tile. `value` is a number in the unit shown, or null before it has been measured.
 * `format` turns the animated number into text, and `tone` picks the color.
 */
export default function Metric({ icon: Icon, label, value, unit, format, points = [], tone = 'accent', active = false }) {
    const animated = useAnimatedNumber(value ?? 0, 800)
    return (
        <div className="speed-metric" data-tone={tone} data-active={active} data-ready={value != null}>
            <p className="speed-metric__label">
                <Icon size={16} aria-hidden="true" />
                {label}
            </p>
            <p className="speed-metric__value">
                <span>{value == null ? '—' : format(animated)}</span>
                <span className="speed-metric__unit">{unit}</span>
            </p>
            <Bars points={points} />
        </div>
    )
}