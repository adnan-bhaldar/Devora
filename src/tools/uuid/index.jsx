import { useState } from 'react'
import { Link2, RefreshCw } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import RangeField from '../../components/ui/RangeField.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import {
    DEFAULT_SETTINGS,
    LIMITS,
    adjustUuids,
    formatUuid,
    generateUuids,
    isDefaultSettings,
} from './uuid.js'
import { readSharedSettings, toShareQuery } from './share.js'

const COUNT_ID = 'uuid-count'
const OUTPUT_ID = 'uuid-output'

export default function UuidTool() {
    // A shared link can set the settings (never the UUIDs). They are read once, then removed from the address.
    const params = useInitialParams()
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    // The raw UUIDs (always lowercase with hyphens). Formatting is applied when they are shown.
    const [uuids, setUuids] = useState([])
    const [error, setError] = useState('')

    // Random values are created from event handlers (not while rendering), because every call
    // gives a different answer.
    const apply = (result) => {
        if (result.ok) {
            setUuids(result.uuids)
            setError('')
        } else {
            setError(result.error)
        }
    }

    const updateSettings = (patch) => setSettings((current) => ({ ...current, ...patch }))

    const generate = () => apply(generateUuids(settings.count))

    const changeCount = (count) => {
        updateSettings({ count })
        // Before the first Generate there is nothing to resize.
        if (uuids.length > 0) apply(adjustUuids(uuids, count))
    }

    const clear = () => {
        setUuids([])
        setError('')
    }

    const reset = () => {
        setSettings(DEFAULT_SETTINGS)
        clear()
    }

    const shareUrl = buildShareUrl(toShareQuery(settings))
    const output = uuids.map((uuid) => formatUuid(uuid, settings)).join('\n')
    const hasUuids = uuids.length > 0

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Settings"
                actions={
                    <>
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                        <ResetButton onClick={reset} disabled={isDefaultSettings(settings) && !hasUuids} />
                    </>
                }
            >
                <div className="grid gap-5">
                    <RangeField
                        id={COUNT_ID}
                        label="How many"
                        hint={`From ${LIMITS.min} to ${LIMITS.max} UUIDs.`}
                        min={LIMITS.min}
                        max={LIMITS.max}
                        value={settings.count}
                        onChange={changeCount}
                    />

                    <Checkbox
                        label="Uppercase"
                        hint="Writes the letters A–F in capitals."
                        checked={settings.uppercase}
                        onChange={(uppercase) => updateSettings({ uppercase })}
                    />

                    <Checkbox
                        label="Include hyphens"
                        hint="Turn off for a plain 32-character string."
                        checked={settings.hyphens}
                        onChange={(hyphens) => updateSettings({ hyphens })}
                    />
                </div>
            </ToolPanel>

            <ToolPanel
                title="UUIDs"
                actions={
                    <>
                        <Button variant="primary" onClick={generate}>
                            <RefreshCw size={16} aria-hidden="true" />
                            {hasUuids ? 'Regenerate' : 'Generate'}
                        </Button>
                        <CopyButton text={output} label={uuids.length === 1 ? 'Copy UUID' : 'Copy UUIDs'} />
                        <ClearButton onClick={clear} disabled={!hasUuids} />
                    </>
                }
            >
                <label htmlFor={OUTPUT_ID} className="sr-only">
                    Generated UUIDs, one per line
                </label>
                <textarea
                    id={OUTPUT_ID}
                    className="field field-mono"
                    rows={Math.min(Math.max(uuids.length, 3), 12)}
                    value={output}
                    readOnly
                    placeholder="Press Generate"
                    spellCheck={false}
                    wrap="off"
                />

                {hasUuids && (
                    <p className="mt-2 text-sm text-fg-muted">
                        {uuids.length} {uuids.length === 1 ? 'UUID' : 'UUIDs'} · version 4 (random)
                    </p>
                )}

                {error && (
                    <p role="alert" className="mt-2 text-sm text-danger">
                        {error}
                    </p>
                )}
            </ToolPanel>
        </div>
    )
}