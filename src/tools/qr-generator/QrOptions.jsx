import { TriangleAlert } from 'lucide-react'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import ColorField from '../../components/ui/ColorField.jsx'
import Field from '../../components/ui/Field.jsx'
import Select from '../../components/ui/Select.jsx'
import { ERROR_LEVELS, ERROR_LEVEL_INFO, MARGINS, SIZES } from './qr.js'

// All presets keep strong contrast between the code and the background.
const CODE_PRESETS = [
    { name: 'Black', value: '#000000' },
    { name: 'Navy', value: '#1e3a8a' },
    { name: 'Violet', value: '#4c1d95' },
    { name: 'Green', value: '#14532d' },
    { name: 'Dark red', value: '#7f1d1d' },
]

const BACKGROUND_PRESETS = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light gray', value: '#f4f4f5' },
    { name: 'Light violet', value: '#ede9fe' },
    { name: 'Light yellow', value: '#fef9c3' },
    { name: 'Light blue', value: '#dbeafe' },
]

export default function QrOptions({ settings, colorWarning, onChange }) {
    return (
        <div className="grid gap-5">
            <div className="grid gap-2">
                <ChoiceGroup
                    label="Error correction"
                    options={ERROR_LEVELS}
                    value={settings.errorLevel}
                    onChange={(errorLevel) => onChange({ errorLevel })}
                />
                <p className="text-sm text-fg-muted">
                    {ERROR_LEVEL_INFO[settings.errorLevel]} Higher levels make a denser code.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Margin" htmlFor="qr-margin">
                    <Select
                        id="qr-margin"
                        options={MARGINS}
                        value={settings.margin}
                        onChange={(event) => onChange({ margin: Number(event.target.value) })}
                    />
                </Field>

                <Field label="Download size" htmlFor="qr-size" hint="The smallest width of the PNG, in pixels.">
                    <Select
                        id="qr-size"
                        options={SIZES}
                        value={settings.size}
                        onChange={(event) => onChange({ size: Number(event.target.value) })}
                    />
                </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <ColorField
                    label="Code color"
                    value={settings.foreground}
                    presets={CODE_PRESETS}
                    onChange={(foreground) => onChange({ foreground })}
                />
                <ColorField
                    label="Background color"
                    value={settings.background}
                    presets={BACKGROUND_PRESETS}
                    onChange={(background) => onChange({ background })}
                />
            </div>

            {colorWarning && (
                <p role="status" className="flex gap-2 text-sm text-fg-muted">
                    <TriangleAlert className="mt-0.5 shrink-0 text-[var(--star)]" size={16} aria-hidden="true" />
                    {colorWarning}
                </p>
            )}
        </div>
    )
}