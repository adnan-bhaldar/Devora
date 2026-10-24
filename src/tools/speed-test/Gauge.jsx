import useAnimatedNumber from '../../hooks/useAnimatedNumber.js'
import { dialFraction, formatSpeed } from './engine.js'

const CENTER = 120
const RADIUS = 96
const LENGTH = Math.PI * RADIUS // length of the half circle

// A point on the dial, at `fraction` (0 = far left, 1 = far right) and `distance` from the centre.
const onDial = (fraction, distance) => {
    const angle = fraction * Math.PI
    return { x: CENTER - distance * Math.cos(angle), y: CENTER - distance * Math.sin(angle) }
}

/**
 * The round speed dial. `value` is the speed in the chosen unit, or null. The arc, the needle and the big
 * number all follow the same animated value, so they rise and fall together.
 */
export default function Gauge({ unit, value, stage, label }) {
    const animated = useAnimatedNumber(value ?? 0, 1000)
    const fraction = dialFraction(unit, animated)

    return (
        <div className="speed-gauge" data-stage={stage}>
            <svg viewBox="0 0 240 132" role="img" aria-label={`Speed dial. ${label}.`}>
                <path className="speed-gauge__track" d={`M ${CENTER - RADIUS} ${CENTER} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER + RADIUS} ${CENTER}`} />
                <path
                    className="speed-gauge__arc"
                    d={`M ${CENTER - RADIUS} ${CENTER} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER + RADIUS} ${CENTER}`}
                    strokeDasharray={LENGTH}
                    strokeDashoffset={LENGTH * (1 - fraction)}
                />
                {unit.ticks.map((tick) => {
                    const at = dialFraction(unit, tick)
                    const inner = onDial(at, RADIUS - 11)
                    const outer = onDial(at, RADIUS - 5)
                    const text = onDial(at, RADIUS - 22)
                    return (
                        <g key={tick} className="speed-gauge__tick">
                            <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} />
                            <text x={text.x} y={text.y} textAnchor="middle" dominantBaseline="middle">
                                {tick}
                            </text>
                        </g>
                    )
                })}
                <g style={{ transform: `rotate(${fraction * 180 - 90}deg)`, transformOrigin: `${CENTER}px ${CENTER}px` }}>
                    <path className="speed-gauge__needle" d={`M ${CENTER - 3} ${CENTER} L ${CENTER} ${CENTER - RADIUS + 28} L ${CENTER + 3} ${CENTER} Z`} />
                </g>
                <circle className="speed-gauge__hub" cx={CENTER} cy={CENTER} r="6" />
            </svg>
            <div className="speed-gauge__readout">
                <p className="speed-gauge__number">
                    {formatSpeed(value == null && stage !== 'download' && stage !== 'upload' ? null : animated)}
                    <span className="speed-gauge__unit">{unit.label}</span>
                </p>
            </div>
        </div>
    )
}