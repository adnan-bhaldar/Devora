import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './themeContext.js'
import { readStorage, writeStorage } from '../utils/storage.js'

const STORAGE_KEY = 'devora-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function getInitialTheme() {
    const applied = document.documentElement.dataset.theme
    if (applied === 'light' || applied === 'dark') return applied
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

export default function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
    }, [theme])

    // Follow system changes only until the user makes an explicit choice.
    useEffect(() => {
        const mediaQuery = window.matchMedia(DARK_QUERY)
        const handleChange = (event) => {
            const stored = readStorage(STORAGE_KEY)
            if (stored !== 'light' && stored !== 'dark') {
                setTheme(event.matches ? 'dark' : 'light')
            }
        }
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const toggleTheme = useCallback(() => {
        setTheme((current) => {
            const next = current === 'dark' ? 'light' : 'dark'
            writeStorage(STORAGE_KEY, next)
            return next
        })
    }, [])

    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}