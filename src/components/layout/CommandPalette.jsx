import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, House, Info, Moon, Search, Sparkles, Sun } from 'lucide-react'
import useTheme from '../../hooks/useTheme.js'
import { searchTools } from '../../utils/search.js'

// With many tools, an empty query shows only a few so the list stays scannable.
const EMPTY_QUERY_TOOL_LIMIT = 6
const TOOL_LIMIT = 10

export default function CommandPalette({ onClose }) {
    const dialogRef = useRef(null)
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const [query, setQuery] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)

    // Native <dialog> gives us focus trapping and an inert background for free.
    useEffect(() => {
        const dialog = dialogRef.current
        const previouslyFocused = document.activeElement
        if (!dialog.open) dialog.showModal()
        return () => {
            if (dialog.open) dialog.close()
            previouslyFocused?.focus?.()
        }
    }, [])

    const items = useMemo(() => {
        const trimmed = query.trim()
        const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean)

        const toolItems = searchTools(trimmed)
            .slice(0, trimmed ? TOOL_LIMIT : EMPTY_QUERY_TOOL_LIMIT)
            .map((tool) => ({
                id: `tool-${tool.id}`,
                group: 'Tools',
                label: tool.name,
                description: tool.description,
                icon: tool.icon,
                run: () => navigate(tool.route),
            }))

        const actionItems = [
            { id: 'home', label: 'Go to Home', icon: House, run: () => navigate('/') },
            { id: 'about', label: 'About Devora', icon: Info, run: () => navigate('/about') },
            { id: 'whats-new', label: "What's New", icon: Sparkles, run: () => navigate('/whats-new') },
            {
                id: 'theme',
                label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
                icon: theme === 'dark' ? Sun : Moon,
                run: toggleTheme,
            },
        ]
            .filter((action) => words.every((word) => action.label.toLowerCase().includes(word)))
            .map((action) => ({ ...action, id: `action-${action.id}`, group: 'Actions' }))

        return [...toolItems, ...actionItems]
    }, [query, navigate, theme, toggleTheme])

    const safeIndex = Math.min(activeIndex, Math.max(items.length - 1, 0))

    useEffect(() => {
        document.getElementById(`palette-option-${safeIndex}`)?.scrollIntoView({ block: 'nearest' })
    }, [safeIndex, items])

    const selectItem = (item) => {
        item.run()
        onClose()
    }

    const handleKeyDown = (event) => {
        if (items.length === 0) return
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            setActiveIndex((safeIndex + 1) % items.length)
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex((safeIndex - 1 + items.length) % items.length)
        } else if (event.key === 'Enter') {
            event.preventDefault()
            selectItem(items[safeIndex])
        }
    }

    const handleDialogClick = (event) => {
        // Clicks on the backdrop are dispatched to the <dialog> element itself.
        if (event.target === dialogRef.current) onClose()
    }

    const handleCancel = (event) => {
        event.preventDefault()
        onClose()
    }

    return (
        <dialog
            ref={dialogRef}
            className="palette"
            aria-label="Command palette"
            onCancel={handleCancel}
            onClick={handleDialogClick}
        >
            <div className="palette-search">
                <Search size={18} aria-hidden="true" />
                <input
                    className="palette-input"
                    type="text"
                    role="combobox"
                    aria-expanded="true"
                    aria-autocomplete="list"
                    aria-controls={items.length ? 'palette-list' : undefined}
                    aria-activedescendant={items.length ? `palette-option-${safeIndex}` : undefined}
                    aria-label="Search tools and commands"
                    placeholder="Search tools and commands…"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value)
                        setActiveIndex(0)
                    }}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    spellCheck={false}
                    autoFocus
                />
                <kbd className="kbd">Esc</kbd>
            </div>

            <p className="sr-only" role="status">
                {items.length} {items.length === 1 ? 'result' : 'results'}
            </p>

            {items.length > 0 ? (
                <ul id="palette-list" role="listbox" aria-label="Results" className="palette-list">
                    {items.map((item, index) => {
                        const Icon = item.icon
                        const showGroup = index === 0 || items[index - 1].group !== item.group
                        return (
                            <Fragment key={item.id}>
                                {showGroup && (
                                    <li role="presentation" className="palette-group">
                                        {item.group}
                                    </li>
                                )}
                                <li
                                    id={`palette-option-${index}`}
                                    role="option"
                                    aria-selected={index === safeIndex}
                                    className="palette-option"
                                    onMouseMove={() => setActiveIndex(index)}
                                    onClick={() => selectItem(item)}
                                >
                                    <span className="palette-option__icon">
                                        <Icon size={16} aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium">{item.label}</span>
                                        {item.description && (
                                            <span className="block truncate text-xs text-fg-muted">{item.description}</span>
                                        )}
                                    </span>
                                    {index === safeIndex && (
                                        <CornerDownLeft className="text-fg-muted" size={14} aria-hidden="true" />
                                    )}
                                </li>
                            </Fragment>
                        )
                    })}
                </ul>
            ) : (
                <p className="palette-empty">No results for “{query.trim()}”.</p>
            )}

            <div className="palette-footer" aria-hidden="true">
                <span>
                    <kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> navigate
                </span>
                <span>
                    <kbd className="kbd">↵</kbd> open
                </span>
                <span>
                    <kbd className="kbd">Esc</kbd> close
                </span>
            </div>
        </dialog>
    )
}