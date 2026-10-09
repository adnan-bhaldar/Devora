import { Moon, Sun } from 'lucide-react'
import IconButton from './IconButton.jsx'
import useTheme from '../../hooks/useTheme.js'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const Icon = theme === 'dark' ? Sun : Moon

    return (
        <IconButton label={`Switch to ${nextTheme} theme`} onClick={toggleTheme}>
            <Icon size={18} aria-hidden="true" />
        </IconButton>
    )
}