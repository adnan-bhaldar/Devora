export function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`
    const units = ['KB', 'MB', 'GB']
    let value = bytes / 1024
    let unit = 0
    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024
        unit++
    }
    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`
}

// `accept` entries can be MIME types ('image/png'), wildcards ('image/*'), or extensions ('.png').
function matchesAccept(file, accept) {
    if (accept.length === 0) return true
    const name = file.name.toLowerCase()
    return accept.some((rule) => {
        const lower = rule.toLowerCase()
        if (lower.startsWith('.')) return name.endsWith(lower)
        if (lower.endsWith('/*')) return file.type.startsWith(lower.slice(0, -1))
        return file.type === lower
    })
}

export function validateFiles(files, { accept = [], maxSizeBytes, multiple = false } = {}) {
    if (files.length === 0) return { valid: [], error: '' }

    if (!multiple && files.length > 1) {
        return { valid: [], error: 'Please provide a single file.' }
    }

    const wrongType = files.find((file) => !matchesAccept(file, accept))
    if (wrongType) {
        return { valid: [], error: `“${wrongType.name}” is not a supported file type.` }
    }

    const tooLarge = maxSizeBytes ? files.find((file) => file.size > maxSizeBytes) : undefined
    if (tooLarge) {
        return {
            valid: [],
            error: `“${tooLarge.name}” is too large (${formatBytes(tooLarge.size)}). The limit is ${formatBytes(maxSizeBytes)}.`,
        }
    }

    return { valid: files, error: '' }
}