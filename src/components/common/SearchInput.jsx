import { Search, X } from 'lucide-react'
import IconButton from '../ui/IconButton.jsx'

export default function SearchInput({ value, onChange, inputRef, label = 'Search', placeholder }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Escape' && value) {
            event.preventDefault()
            onChange('')
        }
    }

    return (
        <div className="search-input" role="search">
            <Search size={18} aria-hidden="true" />
            <input
                ref={inputRef}
                type="search"
                className="search-input__field"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label={label}
                autoComplete="off"
                spellCheck={false}
            />
            {value && (
                <IconButton
                    label="Clear search"
                    tooltip={false}
                    onClick={() => {
                        onChange('')
                        inputRef?.current?.focus()
                    }}
                >
                    <X size={16} aria-hidden="true" />
                </IconButton>
            )}
        </div>
    )
}