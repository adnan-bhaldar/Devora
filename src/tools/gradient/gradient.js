export const MIN_STOPS = 2
export const MAX_STOPS = 8

export const GRADIENT_TYPES = [
    { value: 'linear', label: 'Linear' },
    { value: 'radial', label: 'Radial' },
    { value: 'reflected', label: 'Reflected' },
    { value: 'diamond', label: 'Diamond' },
]

export const RADIAL_SHAPES = [
    { value: 'circle', label: 'Circle' },
    { value: 'ellipse', label: 'Ellipse' },
]

export const RADIAL_POSITIONS = [
    { value: 'center', label: 'Center' },
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'top left', label: 'Top left' },
    { value: 'top right', label: 'Top right' },
    { value: 'bottom left', label: 'Bottom left' },
    { value: 'bottom right', label: 'Bottom right' },
]

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i
const URL_HEX_PATTERN = /^[0-9a-f]{6}$/i

// Types whose direction is controlled by an angle.
export function usesAngle(type) {
    return type === 'linear' || type === 'reflected'
}

// Types where stop 0% is the center and 100% is the outer edge.
export function isCenterOut(type) {
    return type === 'reflected' || type === 'diamond'
}

export function clampNumber(value, min, max, fallback = min) {
    if (!Number.isFinite(value)) return fallback
    return Math.min(max, Math.max(min, value))
}

// Whole numbers print as "135", decimals keep one digit ("33.3").
export function formatNumber(value) {
    return String(Number(value.toFixed(1)))
}

export function isValidHex(value) {
    return HEX_PATTERN.test(value.trim())
}

// "#FFF", "fff" and "#ffffff" all become "#ffffff".
export function normalizeHex(value) {
    const digits = value.trim().replace('#', '').toLowerCase()
    const full = digits.length === 3 ? [...digits].map((char) => char + char).join('') : digits
    return `#${full}`
}

function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function mixHex(from, to, amount) {
    const [r1, g1, b1] = hexToRgb(from)
    const [r2, g2, b2] = hexToRgb(to)
    const channel = (a, b) =>
        Math.round(a + (b - a) * amount)
            .toString(16)
            .padStart(2, '0')
    return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`
}

// Each stop gets a stable id so React can track rows while colors and positions change.
let stopCounter = 0
export function createStop(color, position) {
    stopCounter += 1
    return {
        id: `stop-${stopCounter}`,
        color: normalizeHex(color),
        position: clampNumber(position, 0, 100),
    }
}

export function createDefaultConfig() {
    return {
        type: 'linear',
        angle: 135,
        shape: 'circle',
        position: 'center',
        stops: [createStop('#5b4bff', 0), createStop('#c147ff', 100)],
    }
}

export function createExampleConfig() {
    return {
        type: 'linear',
        angle: 120,
        shape: 'circle',
        position: 'center',
        stops: [createStop('#f97316', 0), createStop('#ec4899', 50), createStop('#6366f1', 100)],
    }
}

function sortedStops(stops) {
    return [...stops].sort((a, b) => a.position - b.position)
}

// New stops go in the widest gap, colored as a blend of their neighbors.
export function insertStop(stops) {
    if (stops.length >= MAX_STOPS) return stops

    const sorted = sortedStops(stops)
    let gapStart = 0
    let widest = -1
    for (let i = 0; i < sorted.length - 1; i++) {
        const gap = sorted[i + 1].position - sorted[i].position
        if (gap > widest) {
            widest = gap
            gapStart = i
        }
    }

    const left = sorted[gapStart]
    const right = sorted[gapStart + 1] ?? left
    return [
        ...stops,
        createStop(mixHex(left.color, right.color, 0.5), (left.position + right.position) / 2),
    ]
}

function buildStopList(stops) {
    return sortedStops(stops)
        .map((stop) => `${stop.color} ${formatNumber(stop.position)}%`)
        .join(', ')
}

/*
 * Reflected gradient: a linear gradient mirrored around its midline. A stop at position p
 * (0 = center, 100 = edge) is written twice, at 50 - p/2 and 50 + p/2. Where the mirrored
 * copies would be identical neighbors (a stop at 0% lands on 50% twice), one is dropped.
 */
function buildReflectedStopList(stops) {
    const sorted = sortedStops(stops)
    const entries = [
        ...[...sorted].reverse().map((stop) => ({ color: stop.color, position: 50 - stop.position / 2 })),
        ...sorted.map((stop) => ({ color: stop.color, position: 50 + stop.position / 2 })),
    ]

    return entries
        .filter((entry, index) => {
            const previous = entries[index - 1]
            return !(previous && previous.color === entry.color && previous.position === entry.position)
        })
        .map((entry) => `${entry.color} ${formatNumber(entry.position)}%`)
        .join(', ')
}

/*
 * Diamond gradient: CSS has no single diamond gradient, so four linear gradients each fill
 * one quadrant, running from the center (0%) to that quadrant's corner (100%). A corner
 * keyword like "to top left" makes the color bands run parallel to the opposite diagonal,
 * and the four quadrants together form diamond-shaped bands. Each tile is 1px larger than
 * half the box so neighboring tiles overlap and no seam shows.
 */
const DIAMOND_TILE_SIZE = 'calc(50% + 1px)'
const DIAMOND_QUADRANTS = [
    { direction: 'to top left', origin: 'left top' },
    { direction: 'to top right', origin: 'right top' },
    { direction: 'to bottom left', origin: 'left bottom' },
    { direction: 'to bottom right', origin: 'right bottom' },
]

function buildDiamond(stops) {
    const stopList = buildStopList(stops)
    return DIAMOND_QUADRANTS.map(
        ({ direction, origin }) =>
            `linear-gradient(${direction}, ${stopList}) ${origin} / ${DIAMOND_TILE_SIZE} ${DIAMOND_TILE_SIZE} no-repeat`,
    ).join(', ')
}

// Returns a complete value for the CSS `background` property.
export function buildGradient(config) {
    switch (config.type) {
        case 'radial':
            return `radial-gradient(${config.shape} at ${config.position}, ${buildStopList(config.stops)})`
        case 'reflected':
            return `linear-gradient(${formatNumber(config.angle)}deg, ${buildReflectedStopList(config.stops)})`
        case 'diamond':
            return buildDiamond(config.stops)
        default:
            return `linear-gradient(${formatNumber(config.angle)}deg, ${buildStopList(config.stops)})`
    }
}

export function buildCss(config) {
    const value = buildGradient(config)
    // Diamond is several comma-separated layers, so put each on its own line.
    const formatted = config.type === 'diamond' ? value.split('), linear-gradient').join('),\n    linear-gradient') : value
    return `background: ${formatted};`
}

/* ---------- Shareable URL state ----------
   Example: ?type=linear&angle=135&stops=5b4bff~0,c147ff~100
   Only colors, angle, shape, position and stop positions are ever stored. */

export function toQueryString(config) {
    const parts = [`type=${config.type}`]

    if (config.type === 'radial') {
        parts.push(`shape=${config.shape}`, `pos=${config.position.replace(' ', '-')}`)
    } else if (usesAngle(config.type)) {
        parts.push(`angle=${formatNumber(config.angle)}`)
    }

    const stops = config.stops
        .map((stop) => `${stop.color.slice(1)}~${formatNumber(stop.position)}`)
        .join(',')
    parts.push(`stops=${stops}`)

    return parts.join('&')
}

// URL values are untrusted. Every field is checked against a whitelist or a strict
// pattern and anything invalid falls back to the default, so a crafted link can never
// put arbitrary text into the generated CSS.
export function parseConfig(params) {
    const config = createDefaultConfig()

    const type = params.get('type')
    if (GRADIENT_TYPES.some((option) => option.value === type)) config.type = type

    const angle = params.get('angle')
    if (angle) config.angle = clampNumber(Number(angle), 0, 360, config.angle)

    const shape = params.get('shape')
    if (RADIAL_SHAPES.some((option) => option.value === shape)) config.shape = shape

    const position = params.get('pos')
    const knownPosition = RADIAL_POSITIONS.find((option) => option.value.replace(' ', '-') === position)
    if (knownPosition) config.position = knownPosition.value

    const rawStops = params.get('stops')
    if (rawStops) {
        const parsed = rawStops
            .split(',')
            .slice(0, MAX_STOPS)
            .map((entry) => {
                const [hex, rawPosition] = entry.split('~')
                if (!URL_HEX_PATTERN.test(hex ?? '')) return null
                if (!rawPosition) return null
                const stopPosition = Number(rawPosition)
                if (!Number.isFinite(stopPosition)) return null
                return createStop(`#${hex}`, stopPosition)
            })
            .filter(Boolean)

        if (parsed.length >= MIN_STOPS) config.stops = parsed
    }

    return config
}

export const DEFAULT_QUERY = toQueryString(createDefaultConfig())