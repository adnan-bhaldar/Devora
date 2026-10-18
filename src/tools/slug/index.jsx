import { useMemo, useState } from 'react'
import { Link2 } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import RangeField from '../../components/ui/RangeField.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import {
    DEFAULT_SETTINGS,
    EXAMPLE_TEXT,
    LENGTH_LIMITS,
    SEPARATORS,
    isDefaultSettings,
    slugifyText,
} from './slug.js'
import { readSharedSettings, toShareQuery } from './share.js'

const INPUT_ID = 'slug-input'
const OUTPUT_ID = 'slug-output'
const LENGTH_ID = 'slug-max-length'

export default function SlugTool() {
    // A shared link can set the settings (never the text). They are read once, then removed from the address.
    const params = useInitialParams()
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    const [text, setText] = useState('')

    const result = useMemo(() => slugifyText(text, settings), [text, settings])
    const output = result.ok ? result.output : ''
    const lineCount = text === '' ? 0 : text.split(/\r?\n/).length

    const updateSettings = (patch) => setSettings((current) => ({ ...current, ...patch }))

    const reset = () => {
        setSettings(DEFAULT_SETTINGS)
        setText('')
    }

    const shareUrl = buildShareUrl(toShareQuery(settings))

    return (
        <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
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
                        Text to turn into slugs, one per line
                    </label>
                    <textarea
                        id={INPUT_ID}
                        className="field"
                        rows={8}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="Type or paste a title. Each line becomes its own slug."
                        spellCheck={false}
                        aria-invalid={!result.ok}
                        aria-describedby={!result.ok ? 'slug-error' : undefined}
                    />
                    {!result.ok && (
                        <p id="slug-error" role="alert" className="mt-2 text-sm text-danger">
                            {result.error}
                        </p>
                    )}
                </ToolPanel>

                <ToolPanel title="Slug" actions={<CopyButton text={output} label={lineCount > 1 ? 'Copy slugs' : 'Copy slug'} />}>
                    <label htmlFor={OUTPUT_ID} className="sr-only">
                        Generated slugs, one per line
                    </label>
                    <textarea
                        id={OUTPUT_ID}
                        className="field field-mono"
                        rows={8}
                        value={output}
                        readOnly
                        placeholder="Your slug appears here"
                        spellCheck={false}
                        wrap="off"
                    />
                    {result.ok && result.skipped > 0 && (
                        <p className="mt-2 text-sm text-fg-muted" role="status">
                            {result.skipped === 1 ? '1 line' : `${result.skipped} lines`} had no letters or
                            numbers that a slug can keep, so {result.skipped === 1 ? 'it is' : 'they are'} empty.
                            Turn on “Keep non-Latin letters” if the text uses another alphabet.
                        </p>
                    )}
                </ToolPanel>
            </div>

            <ToolPanel
                title="Options"
                actions={
                    <>
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                        <ResetButton onClick={reset} disabled={isDefaultSettings(settings) && text === ''} />
                    </>
                }
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="grid content-start gap-5">
                        <ChoiceGroup
                            label="Separator"
                            options={SEPARATORS}
                            value={settings.separator}
                            onChange={(separator) => updateSettings({ separator })}
                        />
                        <Checkbox
                            label="Lowercase"
                            hint="Turns capital letters into small ones."
                            checked={settings.lowercase}
                            onChange={(lowercase) => updateSettings({ lowercase })}
                        />
                    </div>

                    <div className="grid content-start gap-5">
                        <Checkbox
                            label="Remove small words"
                            hint="Drops words such as “the”, “and”, and “of”."
                            checked={settings.removeStopWords}
                            onChange={(removeStopWords) => updateSettings({ removeStopWords })}
                        />
                        <Checkbox
                            label="Keep non-Latin letters"
                            hint="Keeps letters from other alphabets, such as Greek, Cyrillic, or Japanese, instead of dropping them."
                            checked={settings.keepUnicode}
                            onChange={(keepUnicode) => updateSettings({ keepUnicode })}
                        />
                        <Checkbox
                            label="Limit the length"
                            hint="Stops at a whole word so the slug never ends mid-word."
                            checked={settings.limitLength}
                            onChange={(limitLength) => updateSettings({ limitLength })}
                        />
                        {settings.limitLength && (
                            <RangeField
                                id={LENGTH_ID}
                                label="Maximum length"
                                hint={`From ${LENGTH_LIMITS.min} to ${LENGTH_LIMITS.max} characters.`}
                                min={LENGTH_LIMITS.min}
                                max={LENGTH_LIMITS.max}
                                value={settings.maxLength}
                                onChange={(maxLength) => updateSettings({ maxLength })}
                            />
                        )}
                    </div>
                </div>
            </ToolPanel>
        </div>
    )
}