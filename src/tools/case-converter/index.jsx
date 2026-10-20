import { useMemo, useState } from 'react'
import { Link2 } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import { DEFAULT_SETTINGS, EXAMPLE_TEXT, GROUPS, convertAll, isDefaultSettings } from './cases.js'
import { readSharedSettings, toShareQuery } from './share.js'

const INPUT_ID = 'case-input'

function ResultCard({ item }) {
    return (
        <li className="grid min-w-0 gap-2 rounded-xl border border-border bg-surface p-3">
            <div className="tip-end flex items-center justify-between gap-2">
                <h4 className="min-w-0 break-words font-mono text-sm font-semibold">{item.name}</h4>
                <CopyButton text={item.output} label={`Copy ${item.name}`} copiedLabel="Copied" />
            </div>
            {/* tabIndex 0 lets keyboard users scroll a long result. */}
            <pre
                className="code-block max-h-40 min-h-12 overflow-auto whitespace-pre-wrap break-words"
                tabIndex={0}
                aria-label={`${item.name} result`}
            >
                {item.output === '' ? <span className="text-fg-muted">Your result appears here</span> : item.output}
            </pre>
        </li>
    )
}

export default function CaseConverterTool() {
    // A shared link can set the options (never the text). They are read once, then removed from the address.
    const params = useInitialParams()
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    const [text, setText] = useState('')

    const result = useMemo(() => convertAll(text, settings), [text, settings])
    const shareUrl = buildShareUrl(toShareQuery(settings))

    const reset = () => {
        setSettings(DEFAULT_SETTINGS)
        setText('')
    }

    return (
        <div className="grid gap-4">
            <ToolPanel
                title="Text"
                actions={
                    <>
                        <ExampleButton onClick={() => setText(EXAMPLE_TEXT)} />
                        <ClearButton onClick={() => setText('')} disabled={text === ''} />
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
                    placeholder="Type or paste text. Every case below updates as you type."
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

            <ToolPanel title="Results">
                {result.ok && (
                    <div className="grid gap-6">
                        {GROUPS.map((group) => (
                            <section key={group.id} aria-labelledby={`case-group-${group.id}`}>
                                <h3 id={`case-group-${group.id}`} className="text-sm font-semibold">
                                    {group.name}
                                </h3>
                                <p className="mb-3 text-sm text-fg-muted">{group.hint}</p>
                                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {result.results
                                        .filter((item) => item.group === group.id)
                                        .map((item) => (
                                            <ResultCard key={item.id} item={item} />
                                        ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                )}
            </ToolPanel>

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