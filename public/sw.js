/*
 * Devora service worker: lets the app open and work without a connection.
 *
 * - The build (see vite.config.js) fills in VERSION and PRECACHE below, so every file the app
 *   needs (every tool included) is saved on the first visit.
 * - Saved files are served first. Page loads fall back to the saved app shell (index.html),
 *   because Devora is a single-page app and every route is drawn by that one page. Addresses
 *   that point at a file (sitemap.xml, robots.txt, ...) are left to the network instead.
 * - The site font (Google Fonts) is saved as it is used, so it also works offline.
 * - Nothing else is intercepted: no tool data ever goes through this file.
 * - A new version waits instead of taking over at once, so an open page never asks for files that the
 *   new version has already removed. It takes over when every Devora tab is closed, or when the person
 *   presses "Reload" in the update message (the page then sends SKIP_WAITING, see the listener below).
 */
const VERSION = '__BUILD_VERSION__'
const PRECACHE = '__PRECACHE_LIST__'

const APP_CACHE = `devora-app-${VERSION}`
const FONT_CACHE = 'devora-fonts'
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com']

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(APP_CACHE).then((cache) => cache.addAll(PRECACHE)))
})

self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            // Remove the saved files of older versions.
            const names = await caches.keys()
            await Promise.all(
                names
                    .filter((name) => name.startsWith('devora-app-') && name !== APP_CACHE)
                    .map((name) => caches.delete(name)),
            )
            await self.clients.claim()
        })(),
    )
})

async function fontResponse(event) {
    const { request } = event
    const cache = await caches.open(FONT_CACHE)
    const saved = await cache.match(request)

    // The latest save, so the worker can be kept alive until it finishes.
    let saving = Promise.resolve()
    const refresh = fetch(request)
        .then((response) => {
            if (response.ok || response.type === 'opaque') {
                // A failed save must never stop the font from being shown, so errors are ignored.
                saving = cache.put(request, response.clone()).catch(() => { })
            }
            return response
        })
        .catch(() => undefined)

    // Without this, the browser may stop the worker as soon as the response is sent, before the
    // font has been saved for offline use.
    event.waitUntil(refresh.then(() => saving))

    // Serve the saved font at once (and refresh it in the background), or wait for the network.
    return saved ?? (await refresh) ?? Response.error()
}

self.addEventListener('fetch', (event) => {
    const { request } = event
    if (request.method !== 'GET') return

    const url = new URL(request.url)

    if (FONT_HOSTS.includes(url.hostname)) {
        event.respondWith(fontResponse(event))
        return
    }

    if (url.origin !== self.location.origin) return

    // Opening or reloading a page: use the saved app shell, then the network. A file address
    // such as /sitemap.xml has a dot in its last part, is not a page, and must not get the shell.
    const lastPart = url.pathname.split('/').pop()
    if (request.mode === 'navigate' && !lastPart.includes('.')) {
        event.respondWith(
            caches.match('/index.html', { ignoreVary: true }).then((shell) => shell ?? fetch(request)),
        )
        return
    }

    // Everything else: the saved copy if there is one, otherwise the network.
    // ignoreVary: some servers add "Vary: Origin", and a saved file would then never match the browser's own request.
    event.respondWith(caches.match(request, { ignoreVary: true }).then((saved) => saved ?? fetch(request)))
})