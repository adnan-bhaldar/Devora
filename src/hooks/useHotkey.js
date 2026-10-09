import { useEffect, useRef } from 'react'

function isTypingTarget(element) {
    if (!element) return false
    const tag = element.tagName
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable
}

// mod = Ctrl on Windows/Linux, Cmd on macOS. Single-key shortcuts (like "/")
// are ignored while the user is typing; mod shortcuts work everywhere.
export default function useHotkey({ key, mod = false, allowInInput = mod }, handler) {
    const handlerRef = useRef(handler)

    useEffect(() => {
        handlerRef.current = handler
    })

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key.toLowerCase() !== key.toLowerCase()) return
            if (mod !== (event.metaKey || event.ctrlKey)) return
            if (!mod && event.altKey) return
            if (!allowInInput && isTypingTarget(event.target)) return
            handlerRef.current(event)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [key, mod, allowInInput])
}