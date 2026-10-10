import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import { EXAMPLES, MODES, convert } from './base64.js'

const INPUT_ID = 'base64-input'
const OUTPUT_ID = 'base64-output'
const ERROR_ID = 'base64-error'

export default function Base64Tool() {
    const [mode, setMode] = useState('encode')
    const [input, setInput] = useState('')
    const [urlSafe, setUrlSafe] = useState(false)

    // The result is derived from the three values above, so it needs no state of its own.
    const result = useMemo(() => convert(mode, input, { urlSafe }), [mode, input, urlSafe])

    const isEncode = mode === 'encode'
    const output = result.ok ? result.output : ''
    const error = !result.ok && input.trim() !== '' ? result.error : ''

    // Switching mode starts fresh: text meant for one mode makes no sense in the other.
    // Choosing the mode that is already selected changes nothing.
    const handleModeChange = (nextMode) => {
        if (nextMode === mode) return
        setMode(nextMode)
        setInput('')
    }

    // Swap is the one deliberate exception: it moves the result into the input and flips
    // the mode, so encode -> decode round trips are one click.
    const swap = () => {
        setMode(isEncode ? 'decode' : 'encode')
        setInput(output)
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Input"
                actions={
                    <>
                        <ExampleButton onClick={() => setInput(EXAMPLES[mode])} />
                        <ClearButton onClick={() => setInput('')} disabled={input === ''} />
                    </>
                }
            >
                <div className="grid gap-4">
                    <ChoiceGroup label="Mode" options={MODES} value={mode} onChange={handleModeChange} />

                    {isEncode ? (
                        <Checkbox
                            label="URL-safe output"
                            hint="Uses - and _ instead of + and /, and leaves out the = padding."
                            checked={urlSafe}
                            onChange={setUrlSafe}
                        />
                    ) : (
                        <p className="text-sm text-fg-muted">
                            Decoding accepts standard and URL-safe Base64, with or without = padding. Spaces and
                            line breaks are ignored.
                        </p>
                    )}

                    <div>
                        <label htmlFor={INPUT_ID} className="sr-only">
                            {isEncode ? 'Text to encode' : 'Base64 to decode'}
                        </label>
                        <textarea
                            id={INPUT_ID}
                            className="field field-mono"
                            rows={8}
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder={isEncode ? 'Type or paste text to encode…' : 'Paste Base64 to decode…'}
                            spellCheck={false}
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? ERROR_ID : undefined}
                        />
                        {error && (
                            <p id={ERROR_ID} role="alert" className="mt-2 text-sm text-danger">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            </ToolPanel>

            <ToolPanel
                title="Result"
                actions={
                    <>
                        <Button
                            variant="ghost"
                            onClick={swap}
                            disabled={output === ''}
                            title="Use the result as the new input and switch mode"
                        >
                            <ArrowUpDown size={16} aria-hidden="true" />
                            Swap
                        </Button>
                        <CopyButton text={output} label="Copy result" variant="primary" />
                    </>
                }
            >
                <label htmlFor={OUTPUT_ID} className="sr-only">
                    Result
                </label>
                <textarea
                    id={OUTPUT_ID}
                    className="field field-mono"
                    rows={8}
                    value={output}
                    readOnly
                    placeholder="The result appears here"
                    spellCheck={false}
                />
            </ToolPanel>
        </div>
    )
}