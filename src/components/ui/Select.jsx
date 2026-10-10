import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

/*
 * Accessible custom dropdown (the "select-only combobox" pattern). Focus stays on the
 * button the whole time; while the list is open, aria-activedescendant tells screen
 * readers which option is highlighted.
 *
 * options: [{ value, label }]. onChange receives the chosen option's value (not an event).
 * Pass `id` so a <label htmlFor={id}> can name the control.
 */
export default function Select({ id, options, value, onChange, disabled = false }) {
    const baseId = useId()
    const listId = `${baseId}-list`
    const optionId = (index) => `${baseId}-option-${index}`

    const rootRef = useRef(null)
    const typeAhead = useRef({ text: '', timer: 0 })
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.value === value),
    )
    const lastIndex = options.length - 1

    const openList = (index = selectedIndex) => {
        setActiveIndex(index)
        setOpen(true)
    }

    const choose = (index) => {
        onChange(options[index].value)
        setOpen(false)
    }

    // Clicking or tapping anywhere outside the dropdown closes it.
    useEffect(() => {
        if (!open) return undefined
        const handlePointerDown = (event) => {
            if (!rootRef.current?.contains(event.target)) setOpen(false)
        }
        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [open])

    // Keep the highlighted option visible when the list scrolls.
    useEffect(() => {
        if (open) document.getElementById(`${baseId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
    }, [open, activeIndex, baseId])

    useEffect(() => {
        const state = typeAhead.current
        return () => window.clearTimeout(state.timer)
    }, [])

    const jumpToTyped = (character) => {
        const state = typeAhead.current
        window.clearTimeout(state.timer)
        state.text += character.toLowerCase()
        state.timer = window.setTimeout(() => {
            state.text = ''
        }, 600)

        const match = options.findIndex((option) => option.label.toLowerCase().startsWith(state.text))
        if (match === -1) return
        if (open) setActiveIndex(match)
        else openList(match)
    }

    const handleKeyDown = (event) => {
        if (disabled) return

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                if (open) setActiveIndex(Math.min(activeIndex + 1, lastIndex))
                else openList()
                break
            case 'ArrowUp':
                event.preventDefault()
                if (open) setActiveIndex(Math.max(activeIndex - 1, 0))
                else openList()
                break
            case 'Home':
                event.preventDefault()
                if (open) setActiveIndex(0)
                else openList(0)
                break
            case 'End':
                event.preventDefault()
                if (open) setActiveIndex(lastIndex)
                else openList(lastIndex)
                break
            case 'Enter':
            case ' ':
                // Handled here (not as a click) so the same key can open the list and choose from it.
                event.preventDefault()
                if (open) choose(activeIndex)
                else openList()
                break
            case 'Escape':
                if (open) {
                    event.preventDefault()
                    setOpen(false)
                }
                break
            case 'Tab':
                setOpen(false)
                break
            default:
                if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                    jumpToTyped(event.key)
                }
        }
    }

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                id={id}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-activedescendant={open ? optionId(activeIndex) : undefined}
                disabled={disabled}
                onClick={() => (open ? setOpen(false) : openList())}
                onKeyDown={handleKeyDown}
                // Some browsers click a button when Space is released, which would toggle the list again.
                onKeyUp={(event) => {
                    if (event.key === ' ') event.preventDefault()
                }}
                className="field flex cursor-pointer items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-60"
            >
                <span className="truncate">{options[selectedIndex]?.label}</span>
                <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={`shrink-0 text-fg-muted transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <ul
                    id={listId}
                    role="listbox"
                    className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg"
                >
                    {options.map((option, index) => {
                        const isSelected = index === selectedIndex
                        return (
                            <li
                                key={option.value}
                                id={optionId(index)}
                                role="option"
                                aria-selected={isSelected}
                                // Keeps keyboard focus on the button while the mouse picks an option.
                                onMouseDown={(event) => event.preventDefault()}
                                onMouseMove={() => setActiveIndex(index)}
                                onClick={() => choose(index)}
                                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${index === activeIndex ? 'bg-surface-2' : ''} ${isSelected ? 'font-semibold' : ''}`}
                            >
                                <span>{option.label}</span>
                                {isSelected && <Check size={16} aria-hidden="true" className="shrink-0 text-accent" />}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}