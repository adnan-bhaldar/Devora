import { useState } from 'react'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import Base64ToImage from './Base64ToImage.jsx'
import ImageToBase64 from './ImageToBase64.jsx'

const MODES = [
    { value: 'encode', label: 'Image → Base64' },
    { value: 'decode', label: 'Base64 → Image' },
]

export default function Base64ImageTool() {
    const [mode, setMode] = useState('encode')

    // Each mode is its own component with its own state, so switching modes starts fresh.
    return (
        <div className="grid gap-4">
            <ChoiceGroup label="Mode" options={MODES} value={mode} onChange={setMode} />
            {mode === 'encode' ? <ImageToBase64 /> : <Base64ToImage />}
        </div>
    )
}