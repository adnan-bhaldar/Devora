import { useMemo, useState } from 'react'
import { Link2 } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import { CASES, DEFAULT_SETTINGS, EXAMPLE_TEXT, convertAll, convertText, isDefaultSettings } from './cases.js'
import { readSharedSettings, toShareQuery } from './share.js'

const INPUT_ID = 'case-input'
const OUTPUT_ID = 'case-output'
const CASE_OPTIONS = CASES.map((item) => ({ value: item.id, label: item.name }))

// One case and its result, with a copy button. Shown for every case after "Try an example".
function ResultCard({ item }) {
    return (
        <li className="grid min-w-0 gap-2 rounded-xl border border-border bg-surface p-3">
            <div className="tip-end flex items-center justify-between gap-2">
                <h3 className="min-w-0 break-words font-mono text-sm font-semibold">{item.name}</h3>
                <CopyButton text={item.output} label={`Copy ${item.name}`} copiedLabel="Copied" />
            </div>
            {/* tabIndex 0 lets keyboard users scroll a long result. */}
            <pre className="code-block max-h-40 min-h-12 overflow-auto whitespace-pre-wrap break-words" tabIndex={0} aria-label={`${item.name} result`}>
                {item.output}
            </pre>
        </li>
    )
}

export default function CaseConverterTool() {
    // A shared link can set the options (never the text). They are read once, then removed from the address.
    const params = useInitialParams()
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    const [text, setText] = useState('')
    // True after "Try an example": every case is listed. Choosing a case goes back to the single result.
    const [showAll, setShowAll] = useState(false)

    const result = useMemo(() => convertText(text, settings), [text, settings])
    const everything = useMemo(() => (showAll ? convertAll(text, settings) : null), [showAll, text, settings])
    const shareUrl = buildShareUrl(toShareQuery(settings))

    const reset = () => {
        setSettings(DEFAULT_SETTINGS)
        setText('')
        setShowAll(false)
    }

    return (
        <div className="grid gap-4">
            <ToolPanel
                title="Text"
                actions={
                    <>
                        <ExampleButton
                            onClick={() => {
                                setText(EXAMPLE_TEXT)
                                setShowAll(true)
                            }}
                        />
                        <ClearButton
                            onClick={() => {
                                setText('')
                                setShowAll(false)
                            }}
                            disabled={text === ''}
                        />
                    </>
                }
            >
                <label htmlFor={INPUT_ID} className="sr-only">
                    Text to convert
                </label>
                <textarea
                    id={INPUT_ID}
                    className="field"
                    rows={6}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Type or paste text, then choose a case below."
                    spellCheck={false}
                    aria-invalid={!result.ok}
                    aria-describedby={!result.ok ? 'case-error' : undefined}
                />
                {!result.ok && (
                    <p id="case-error" role="alert" className="mt-2 text-sm text-danger">
                        {result.error}
                    </p>
                )}
            </ToolPanel>

            {everything?.ok ? (
                <ToolPanel
                    title="All cases"
                    actions={
                        <Button variant="ghost" onClick={() => setShowAll(false)}>
                            Choose one case
                        </Button>
                    }
                >
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {everything.results.map((item) => (
                            <ResultCard key={item.id} item={item} />
                        ))}
                    </ul>
                </ToolPanel>
            ) : (
                <>
                    <ToolPanel title="Convert to">
                        <ChoiceGroup
                            label="Case"
                            options={CASE_OPTIONS}
                            value={settings.caseId}
                            onChange={(caseId) => {
                                setSettings((current) => ({ ...current, caseId }))
                                setShowAll(false)
                            }}
                        />
                    </ToolPanel>

                    <ToolPanel title="Result" actions={<CopyButton text={result.ok ? result.output : ''} label="Copy result" copiedLabel="Copied" />}>
                        <label htmlFor={OUTPUT_ID} className="sr-only">
                            {result.ok ? `${result.name} result` : 'Result'}
                        </label>
                        <textarea
                            id={OUTPUT_ID}
                            className="field field-mono"
                            rows={6}
                            value={result.ok ? result.output : ''}
                            readOnly
                            spellCheck={false}
                            placeholder="Your result appears here"
                        />
                    </ToolPanel>
                </>
            )}

            <ToolPanel
                title="Options"
                actions={
                    <>
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                        <ResetButton onClick={reset} disabled={isDefaultSettings(settings) && text === ''} />
                    </>
                }
            >
                <Checkbox
                    label="Keep small words in lower case in Title Case"
                    hint="Words such as “the”, “of”, and “and” stay small, except at the start or end of a line."
                    checked={settings.smallWords}
                    onChange={(smallWords) => setSettings({ ...settings, smallWords })}
                />
            </ToolPanel>
        </div>
    )
}