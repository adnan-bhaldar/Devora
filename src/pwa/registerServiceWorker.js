import { setWaitingWorker } from './updateStore.js'

// How often an open tab asks the server whether there is a new version (the browser also checks on every page load).
const CHECK_EVERY_MS = 30 * 60 * 1000

// Registers the service worker that makes Devora work offline. It is only used in the built
// site: in development a service worker would keep serving old files and hide your changes.
export default function registerServiceWorker() {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

    // Wait until the page has loaded so registering never slows down the first visit.
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                // A new version only counts as an update when an older one is already running the page.
                // On the very first visit there is nothing to replace, so nobody is asked anything.
                const offer = (worker) => {
                    if (worker && navigator.serviceWorker.controller) setWaitingWorker(worker)
                }

                // Offers a new version once it has finished downloading.
                const watch = (worker) => {
                    if (!worker) return
                    if (worker.state === 'installed') {
                        offer(worker)
                        return
                    }
                    worker.addEventListener('statechange', () => {
                        if (worker.state === 'installed') offer(registration.waiting ?? worker)
                    })
                }

                // The browser looks for a new version as soon as the page opens, which can be before this code runs.
                // So a version may already be waiting, or already downloading, and "updatefound" will not fire again for it.
                // Both cases are handled here, and later updates are caught by the listener below.
                offer(registration.waiting)
                watch(registration.installing)
                registration.addEventListener('updatefound', () => watch(registration.installing))

                // Tabs stay open for days, so also look for a new version when the person comes back to the tab.
                const check = () => registration.update().catch(() => { })
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') check()
                })
                window.setInterval(check, CHECK_EVERY_MS)
            })
            .catch(() => {
                // Offline support is a bonus. If it can't be set up, the app still works online.
            })
    })
}