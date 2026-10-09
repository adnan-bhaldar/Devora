import { useCallback, useEffect, useRef, useState } from 'react'

export default function useCopyToClipboard(resetMs = 2000) {
    const [copied, setCopied] = useState(false)
    const timer = useRef(null)

    useEffect(() => () => clearTimeout(timer.current), [])

    // Resolves to true on success, false if the browser refused (or has no clipboard access).
    const copy = useCallback(
        async (text) => {
            try {
                await navigator.clipboard.writeText(text)
                setCopied(true)
                clearTimeout(timer.current)
                timer.current = setTimeout(() => setCopied(false), resetMs)
                return true
            } catch {
                setCopied(false)
                return false
            }
        },
        [resetMs],
    )

    return { copied, copy }
}