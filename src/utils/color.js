const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

// Accepts "#5b4bff", "5b4bff", "#fff", or "FFF".
export function isValidHex(value) {
    return HEX_PATTERN.test(value.trim())
}

// "#FFF", "fff" and "#ffffff" all become "#ffffff".
export function normalizeHex(value) {
    const digits = value.trim().replace('#', '').toLowerCase()
    const full = digits.length === 3 ? [...digits].map((char) => char + char).join('') : digits
    return `#${full}`
}