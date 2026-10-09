import { Eraser } from 'lucide-react'
import Button from '../ui/Button.jsx'

// Clear removes what the user typed or loaded.
export default function ClearButton({ onClick, disabled = false, label = 'Clear' }) {
    return (
        <Button variant="ghost" onClick={onClick} disabled={disabled}>
            <Eraser size={16} aria-hidden="true" />
            {label}
        </Button>
    )
}