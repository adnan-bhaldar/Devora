import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

/*
 * A dropdown you can search: the "editable combobox with list" pattern. It is a text box that
 * shows the chosen option while you are not typing. Click it (or press the down arrow) to open the
 * list, then type to narrow the list down. The box shows exactly what you typed, and choosing an
 * option puts its label back in the box.
 *
 * options: [{ value, label, searchText }]. searchText is what the typed words are matched against
 * (it defaults to the label). onChange receives the chosen option's value. Pass `id` so a
 * <label htmlFor={id}> can name the control.
 *
 * Keys: Down and Up move through the list, Enter chooses, Escape closes and puts the chosen
 * label back, Tab leaves the box.
 */
export default function SearchSelect({ id, options, value, onChange, placeholder = 'Search…', noResultsText = 'Nothing found' }) {
    const baseId = useId()
    const listId = `${baseId}-list`
    const optionId = (index) => `${baseId}-option-${index}`

    const inputRef = useRef(null)
    const [open, setOpen] = useState(false)
    // null while the person is not typing, so the box shows the chosen label.
    const [query, setQuery] = useState(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const selected = options.find((option) => option.value === value)

    const results = useMemo(() => {
        const words = (query ?? '').toLowerCase().split(/\s+/).filter(Boolean)
        if (words.length === 0) return options

        const matches = options.filter((option) => {
            const text = (option.searchText ?? option.label).toLowerCase()
            return words.every((word) => text.includes(word))
        })
        // Options that start with the first word come first, so "ind" puts India before Argentina.
        // A word such as "+91" or "91" also counts as a start when it begins a calling code.
        const starts = (option) => {
            const text = (option.searchText ?? option.label).toLowerCase()
            return text.startsWith(words[0]) || text.includes(` +${words[0].replace(/^\+/, '')}`) ? 0 : 1
        }
        return matches
            .map((option, index) => ({ option, index }))
            .sort((a, b) => starts(a.option) - starts(b.option) || a.index - b.index)
            .map((item) => item.option)
    }, [options, query])

    const close = () => {
        setOpen(false)
        setQuery(null)
    }

    const choose = (option) => {
        onChange(option.value)
        close()
    }

    // Keeps the highlighted option visible when the list scrolls.
    useEffect(() => {
        if (open) document.getElementById(`${baseId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
    }, [open, activeIndex, baseId, results])

    const openList = () => {
        if (open) return
        const index = results.findIndex((option) => option.value === value)
        setActiveIndex(Math.max(0, index))
        setOpen(true)
    }

    const handleKeyDown = (event) => {
        const last = results.length - 1

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                if (!open) openList()
                else setActiveIndex(Math.min(activeIndex + 1, last))
                break
            case 'ArrowUp':
                event.preventDefault()
                if (!open) openList()
                else setActiveIndex(Math.max(activeIndex - 1, 0))
                break
            case 'Enter':
                if (open) {
                    event.preventDefault()
                    if (results[activeIndex]) choose(results[activeIndex])
                }
                break
            case 'Escape':
                if (open || query !== null) {
                    event.preventDefault()
                    // Stops a surrounding dialog or page handler from also reacting to this Escape.
                    event.stopPropagation()
                    close()
                }
                break
            default:
        }
    }

    return (
        <div className="search-select">
            <input
                ref={inputRef}
                id={id}
                type="text"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={open && results[activeIndex] ? optionId(activeIndex) : undefined}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="field search-select__input"
                placeholder={placeholder}
                value={query ?? selected?.label ?? ''}
                onChange={(event) => {
                    setQuery(event.target.value)
                    setActiveIndex(0)
                    setOpen(true)
                }}
                // Selecting the text means the first key typed replaces the chosen country, also when the
                // box already has focus and is clicked again.
                onFocus={(event) => event.target.select()}
                onClick={(event) => {
                    if (query === null) event.target.select()
                    openList()
                }}
                onBlur={close}
                onKeyDown={handleKeyDown}
            />
            <ChevronDown
                size={16}
                aria-hidden="true"
                className={`search-select__icon ${open ? 'search-select__icon--open' : ''}`}
            />

            {open && (
                <ul
                    id={listId}
                    role="listbox"
                    className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg"
                >
                    {results.length === 0 && <li className="px-3 py-2 text-sm text-fg-muted">{noResultsText}</li>}
                    {results.map((option, index) => {
                        const isSelected = option.value === value
                        return (
                            <li
                                key={option.value}
                                id={optionId(index)}
                                role="option"
                                aria-selected={isSelected}
                                // Keeps keyboard focus in the box while the mouse picks an option.
                                onMouseDown={(event) => event.preventDefault()}
                                onMouseMove={() => setActiveIndex(index)}
                                onClick={() => choose(option)}
                                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${index === activeIndex ? 'bg-surface-2' : ''} ${isSelected ? 'font-semibold' : ''}`}
                            >
                                <span>{option.label}</span>
                                {isSelected && <Check size={16} aria-hidden="true" className="shrink-0 text-accent" />}
                            </li>
                        )
                    })}
                </ul>
            )}

            <span className="sr-only" role="status">
                {open ? (results.length === 0 ? noResultsText : `${results.length} results`) : ''}
            </span>
        </div>
    )
}