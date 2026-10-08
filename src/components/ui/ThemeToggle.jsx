import { Moon, Sun } from 'lucide-react'
import useTheme from '../../hooks/useTheme.js'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const Icon = theme === 'dark' ? Sun : Moon

    return (
        <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
        >
            <Icon size={18} aria-hidden="true" />
        </button>
    )
}