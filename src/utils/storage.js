// localStorage can throw (private mode, blocked storage), so access is wrapped.
export function readStorage(key) {
    try {
        return window.localStorage.getItem(key)
    } catch {
        return null
    }
}

export function writeStorage(key, value) {
    try {
        window.localStorage.setItem(key, value)
    } catch {
        // Ignore: the app still works, the preference just won't persist.
    }
}