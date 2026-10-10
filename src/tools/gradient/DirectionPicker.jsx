import {
    ArrowDown,
    ArrowDownLeft,
    ArrowDownRight,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ArrowUpLeft,
    ArrowUpRight,
} from 'lucide-react'
import IconButton from '../../components/ui/IconButton.jsx'

const DIRECTIONS = [
    { angle: 0, label: 'To top', icon: ArrowUp },
    { angle: 45, label: 'To top right', icon: ArrowUpRight },
    { angle: 90, label: 'To right', icon: ArrowRight },
    { angle: 135, label: 'To bottom right', icon: ArrowDownRight },
    { angle: 180, label: 'To bottom', icon: ArrowDown },
    { angle: 225, label: 'To bottom left', icon: ArrowDownLeft },
    { angle: 270, label: 'To left', icon: ArrowLeft },
    { angle: 315, label: 'To top left', icon: ArrowUpLeft },
]

export default function DirectionPicker({ angle, onChange }) {
    return (
        <div role="group" aria-label="Direction presets" className="flex flex-wrap gap-1.5">
            {DIRECTIONS.map(({ angle: presetAngle, label, icon: Icon }) => (
                <IconButton
                    key={presetAngle}
                    label={`${label} (${presetAngle}°)`}
                    aria-pressed={angle === presetAngle}
                    onClick={() => onChange(presetAngle)}
                    className="border border-border bg-surface hover:bg-surface-2 aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent"
                >
                    <Icon size={18} aria-hidden="true" />
                </IconButton>
            ))}
        </div>
    )
}