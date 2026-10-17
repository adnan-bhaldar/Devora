import { readChoice, toQuery } from '../../utils/shareLink.js'
import { ALGORITHMS, FORMATS } from './hash.js'

// Only the algorithm and the output format are shared. The text being hashed never is.
// Example: ?algorithm=sha-512&format=base64
export function readSharedSettings(params) {
    const algorithms = ALGORITHMS.map((option) => option.value)
    const algorithm = params.get('algorithm')?.toUpperCase()

    return {
        algorithm: algorithms.includes(algorithm) ? algorithm : 'SHA-256',
        format: readChoice(
            params,
            'format',
            FORMATS.map((option) => option.value),
            'hex',
        ),
    }
}

export function toShareQuery({ algorithm, format }) {
    return toQuery([
        ['algorithm', algorithm.toLowerCase()],
        ['format', format],
    ])
}