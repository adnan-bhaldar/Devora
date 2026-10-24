// Remembers whether a newer version of Devora has been downloaded and is waiting to take over.
// The page reads it with useSyncExternalStore (see UpdatePrompt), and the service worker code writes it.
let waiting = null
const listeners = new Set()

export const subscribe = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

export const getWaitingWorker = () => waiting

export function setWaitingWorker(worker) {
    waiting = worker
    listeners.forEach((listener) => listener())
}

// Tells the waiting version to take over, then reloads once it has. The reload is what makes the page
// use the new files, and it works like a hard refresh because the old saved files are removed first.
export function applyUpdate() {
    if (!waiting) {
        window.location.reload()
        return
    }
    let reloaded = false
    const reload = () => {
        if (reloaded) return
        reloaded = true
        window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true })
    waiting.postMessage({ type: 'SKIP_WAITING' })
    // If the switch is somehow slow, reload anyway instead of leaving the button doing nothing.
    window.setTimeout(reload, 4000)
}