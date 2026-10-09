import { Link, NavLink } from 'react-router-dom'
import { Terminal } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle.jsx'

export default function Header() {
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
                    <nav aria-label="Main" className="flex items-center gap-1">
                        <NavLink to="/" end className="nav-link">
                            Tools
                        </NavLink>
                        <NavLink to="/about" className="nav-link">
                            About
                        </NavLink>
                    </nav>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}