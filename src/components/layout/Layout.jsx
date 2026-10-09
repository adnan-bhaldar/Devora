import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import CommandPalette from './CommandPalette.jsx'
import useHotkey from '../../hooks/useHotkey.js'

export default function Layout() {
    const { pathname } = useLocation()
    const [paletteOpen, setPaletteOpen] = useState(false)
    const previousPath = useRef(pathname)

    useHotkey({ key: 'k', mod: true }, (event) => {
        event.preventDefault()
        setPaletteOpen((open) => !open)
    })

    // On client-side navigation, reset scroll and move focus to the page so
    // keyboard and screen-reader users start at the top of the new content.
    useEffect(() => {
        if (previousPath.current === pathname) return
        previousPath.current = pathname
        window.scrollTo(0, 0)
        document.getElementById('main')?.focus({ preventScroll: true })
    }, [pathname])

    return (
        <div className="flex min-h-screen flex-col">
            <a href="#main" className="skip-link">
                Skip to content
            </a>
            <Header onOpenPalette={() => setPaletteOpen(true)} />
            <main id="main" tabIndex={-1} className="flex-1">
                <Outlet />
            </main>
            <Footer />
            {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
        </div>
    )
}