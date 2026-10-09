import { Lightbulb } from 'lucide-react'
import Button from '../ui/Button.jsx'

// Only fills in safe sample data via `onClick`; it never runs the tool on its own.
export default function ExampleButton({ onClick, label = 'Try an example' }) {
    return (
        <Button variant="ghost" onClick={onClick}>
            <Lightbulb size={16} aria-hidden="true" />
            {label}
        </Button>
    )
}