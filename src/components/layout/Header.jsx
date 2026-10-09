import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Search, Terminal, X } from 'lucide-react'
import IconButton from '../ui/IconButton.jsx'
import ThemeToggle from '../ui/ThemeToggle.jsx'
import useHotkey from '../../hooks/useHotkey.js'
import { modKeyLabel } from '../../data/shortcuts.js'

const NAV_ITEMS = [
    { to: '/', label: 'Tools', end: true },
    { to: '/whats-new', label: "What's New" },
    { to: '/about', label: 'About' },
]

export default function Header({ onOpenPalette }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = () => setMenuOpen(false)

    useHotkey({ key: 'Escape', allowInInput: true }, closeMenu)

    const navLinks = NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className="nav-link" onClick={closeMenu}>
            {item.label}
        </NavLink>
    ))

    return (
        <header className="site-header">
            <div className="container-page site-header__inner">
                <Link to="/" className="brand" aria-label="Devora home">
                    <span className="brand-mark">
                        <Terminal size={16} strokeWidth={2.25} aria-hidden="true" />
                    </span>
                    <span>Devora</span>
                </Link>

                <div className="flex items-center gap-1">
                    <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
                        {navLinks}
                    </nav>

                    <button type="button" className="search-trigger" onClick={onOpenPalette} aria-label="Search tools">
                        <Search size={16} aria-hidden="true" />
                        <span className="search-trigger__text">Search tools…</span>
                        <kbd className="kbd">{modKeyLabel} K</kbd>
                    </button>

                    <ThemeToggle />

                    <IconButton
                        label={menuOpen ? 'Close menu' : 'Open menu'}
                        className="sm:hidden"
                        aria-expanded={menuOpen}
                        aria-controls="mobile-nav"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
                    </IconButton>
                </div>
            </div>

            {menuOpen && (
                <nav id="mobile-nav" aria-label="Mobile" className="mobile-nav container-page">
                    {navLinks}
                </nav>
            )}
        </header>
    )
}