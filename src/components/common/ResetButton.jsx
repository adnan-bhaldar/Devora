import { RotateCcw } from 'lucide-react'
import Button from '../ui/Button.jsx'

// Reset restores a tool's settings to their defaults.
export default function ResetButton({ onClick, disabled = false, label = 'Reset' }) {
    return (
        <Button variant="ghost" onClick={onClick} disabled={disabled}>
            <RotateCcw size={16} aria-hidden="true" />
            {label}
        </Button>
    )
}