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

// How long the new version gets to take over before the person is told that it did not start.
const TAKE_OVER_TIMEOUT_MS = 5000

// Tells the waiting version to take over, and reloads once it has. This follows the service worker life cycle:
// the new version removes the saved files of the old one while it activates, and then claims the open page.
// The reload comes only after that, so the page is always served by the new version.
// It resolves to false, without reloading, if the new version did not take over. A reload at that point would
// be served by the old version again.
export async function applyUpdate() {
    // Ask the browser for the version that is waiting right now. The one stored earlier may have been replaced.
    let registration
    try {
        registration = await navigator.serviceWorker.getRegistration()
    } catch {
        // Use the stored one.
    }
    const worker = registration?.waiting ?? (waiting?.state === 'installed' ? waiting : null)

    // Nothing is waiting any more (for example, another tab already applied the update), so there is nothing to offer.
    if (!worker) {
        setWaitingWorker(null)
        return false
    }

    return new Promise((resolve) => {
        let finished = false
        const finish = (switched) => {
            if (finished) return
            finished = true
            window.clearTimeout(timer)
            navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
            worker.removeEventListener('statechange', onStateChange)
            if (switched) window.location.reload()
            resolve(switched)
        }
        const onControllerChange = () => finish(true)
        const onStateChange = () => {
            if (worker.state === 'activated') finish(true)
            else if (worker.state === 'redundant') finish(false)
        }
        const timer = window.setTimeout(() => finish(false), TAKE_OVER_TIMEOUT_MS)

        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
        worker.addEventListener('statechange', onStateChange)
        worker.postMessage({ type: 'SKIP_WAITING' })
    })
}