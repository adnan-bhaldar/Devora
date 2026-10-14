import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import CopyButton from '../../components/common/CopyButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import Field from '../../components/ui/Field.jsx'
import {
    DEFAULT_SETTINGS,
    INITIAL_SEED,
    LIMITS,
    UNITS,
    countWords,
    createRandomSeed,
    generateLorem,
    isDefaultSettings,
    parseAmount,
} from './lorem.js'

const AMOUNT_ID = 'lorem-amount'
const AMOUNT_ERROR_ID = 'lorem-amount-error'
const OUTPUT_ID = 'lorem-output'

export default function LoremTool() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    const [seed, setSeed] = useState(INITIAL_SEED)
    // While the user types in the number box, `draft` holds their raw text (which may be empty
    // or out of range). It is cleared on blur so the box shows the real amount again.
    const [draft, setDraft] = useState(null)

    // The text is derived from the settings and the seed, so it needs no state of its own.
    const output = useMemo(() => generateLorem(settings, seed), [settings, seed])
    const wordCount = useMemo(() => countWords(output), [output])

    const { min, max } = LIMITS[settings.unit]
    const amountText = draft ?? String(settings.amount)
    const amountInvalid = draft !== null && parseAmount(settings.unit, draft) === null

    const updateSettings = (patch) => setSettings((current) => ({ ...current, ...patch }))

    const changeUnit = (unit) => {
        setDraft(null)
        updateSettings({ unit, amount: LIMITS[unit].default })
    }

    const handleAmountText = (event) => {
        const text = event.target.value
        setDraft(text)
        const amount = parseAmount(settings.unit, text)
        if (amount !== null) updateSettings({ amount })
    }

    const handleSlider = (event) => {
        setDraft(null)
        updateSettings({ amount: Number(event.target.value) })
    }

    const reset = () => {
        setDraft(null)
        setSettings(DEFAULT_SETTINGS)
        setSeed(INITIAL_SEED)
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Settings"
                actions={
                    <ResetButton onClick={reset} disabled={isDefaultSettings(settings) && seed === INITIAL_SEED} />
                }
            >
                <div className="grid gap-5">
                    <ChoiceGroup label="Generate" options={UNITS} value={settings.unit} onChange={changeUnit} />

                    <Field label="Amount" htmlFor={AMOUNT_ID} hint={`From ${min} to ${max.toLocaleString()}.`}>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                aria-label="Amount slider"
                                min={min}
                                max={max}
                                step={1}
                                value={settings.amount}
                                onChange={handleSlider}
                                className="w-full accent-accent"
                            />
                            <input
                                id={AMOUNT_ID}
                                type="text"
                                inputMode="numeric"
                                value={amountText}
                                onChange={handleAmountText}
                                onBlur={() => setDraft(null)}
                                autoComplete="off"
                                aria-invalid={amountInvalid}
                                aria-describedby={amountInvalid ? AMOUNT_ERROR_ID : undefined}
                                className="field w-24"
                            />
                        </div>
                    </Field>
                    {amountInvalid && (
                        <p id={AMOUNT_ERROR_ID} role="alert" className="-mt-3 text-sm text-danger">
                            Enter a whole number from {min} to {max.toLocaleString()}.
                        </p>
                    )}

                    <Checkbox
                        label="Start with “Lorem ipsum dolor sit amet…”"
                        hint="Begins with the classic opening line. Turn off for fully random text."
                        checked={settings.startWithLorem}
                        onChange={(startWithLorem) => updateSettings({ startWithLorem })}
                    />
                </div>
            </ToolPanel>

            <ToolPanel
                title="Text"
                actions={
                    <>
                        <Button variant="primary" onClick={() => setSeed(createRandomSeed())}>
                            <RefreshCw size={16} aria-hidden="true" />
                            Generate new text
                        </Button>
                        <CopyButton text={output} label="Copy text" />
                    </>
                }
            >
                <label htmlFor={OUTPUT_ID} className="sr-only">
                    Generated placeholder text
                </label>
                <textarea
                    id={OUTPUT_ID}
                    className="field"
                    rows={14}
                    value={output}
                    readOnly
                    spellCheck={false}
                />
                <p className="mt-2 text-sm text-fg-muted">
                    {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'} ·{' '}
                    {output.length.toLocaleString()} characters
                </p>
            </ToolPanel>
        </div>
    )
}