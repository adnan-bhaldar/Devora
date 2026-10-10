// Strict UTF-8 decoding: returns { ok: true, text }, or { ok: false } when the bytes are not
// valid UTF-8. fatal: true makes bad bytes throw instead of silently becoming "�" characters,
// and ignoreBOM: true keeps a leading byte-order mark so round trips stay exact.
export function decodeUtf8(bytes) {
    try {
        const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes)
        return { ok: true, text }
    } catch {
        return { ok: false }
    }
}