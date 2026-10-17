// Registers the service worker that makes Devora work offline. It is only used in the built
// site: in development a service worker would keep serving old files and hide your changes.
export default function registerServiceWorker() {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

    // Wait until the page has loaded so registering never slows down the first visit.
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Offline support is a bonus. If it can't be set up, the app still works online.
        })
    })
}