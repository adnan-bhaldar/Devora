import { useSyncExternalStore } from 'react'

/*
 * The current time, refreshed every 30 seconds. Reading Date.now() directly while rendering
 * would make a component impure (its output would change between identical renders), so the
 * clock is exposed as an external store that React subscribes to instead.
 */
let currentTime = Date.now()

function subscribe(onChange) {
    currentTime = Date.now()
    const timer = window.setInterval(() => {
        currentTime = Date.now()
        onChange()
    }, 30000)
    return () => window.clearInterval(timer)
}

const getSnapshot = () => currentTime

export default function useNow() {
    return useSyncExternalStore(subscribe, getSnapshot)
}