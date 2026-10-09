import { useCallback, useEffect, useMemo, useState } from 'react'
import { ToolPrefsContext } from './toolPrefsContext.js'
import { getToolById } from '../data/tools.js'
import { readJSON, writeJSON } from '../utils/storage.js'

const FAVORITES_KEY = 'devora-favorites'
const RECENT_KEY = 'devora-recent'
const MAX_RECENT = 6

// Stored data is untrusted: keep only strings that still match a registered tool.
function loadToolIds(key) {
    const stored = readJSON(key, [])
    if (!Array.isArray(stored)) return []
    return stored.filter((id) => typeof id === 'string' && getToolById(id))
}

export default function ToolPrefsProvider({ children }) {
    const [favorites, setFavorites] = useState(() => loadToolIds(FAVORITES_KEY))
    const [recent, setRecent] = useState(() => loadToolIds(RECENT_KEY))

    useEffect(() => {
        writeJSON(FAVORITES_KEY, favorites)
    }, [favorites])

    useEffect(() => {
        writeJSON(RECENT_KEY, recent)
    }, [recent])

    const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

    const toggleFavorite = useCallback((id) => {
        setFavorites((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [id, ...current],
        )
    }, [])

    const addRecent = useCallback((id) => {
        setRecent((current) => {
            if (current[0] === id) return current
            return [id, ...current.filter((item) => item !== id)].slice(0, MAX_RECENT)
        })
    }, [])

    const value = useMemo(
        () => ({ favorites, recent, isFavorite, toggleFavorite, addRecent }),
        [favorites, recent, isFavorite, toggleFavorite, addRecent],
    )

    return <ToolPrefsContext.Provider value={value}>{children}</ToolPrefsContext.Provider>
}