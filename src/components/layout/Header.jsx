import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Terminal, X } from 'lucide-react'
import IconButton from '../ui/IconButton.jsx'
import ThemeToggle from '../ui/ThemeToggle.jsx'
import useHotkey from '../../hooks/useHotkey.js'

const NAV_ITEMS = [
    { to: '/whats-new', label: "What's New" },
    { to: '/about', label: 'About' },
]

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const closeMenu = () => setMenuOpen(false)

    useHotkey({ key: 'Escape', allowInInput: true }, closeMenu)

    const navLinks = NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} className="nav-link" onClick={closeMenu}>
            {item.label}
        </NavLink>
    ))

    return (
        <header className="site-header">
            <div className="site-header__bar">
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
                <nav id="mobile-nav" aria-label="Mobile" className="mobile-nav">
                    {navLinks}
                </nav>
            )}
        </header>
    )
}