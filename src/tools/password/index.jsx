import { useState } from 'react'
import { Eye, EyeOff, Link2, RefreshCw } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import IconButton from '../../components/ui/IconButton.jsx'
import RangeField from '../../components/ui/RangeField.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import {
    CHARACTER_TYPES,
    DEFAULT_SETTINGS,
    LIMITS,
    createPassword,
    estimateStrength,
    isDefaultSettings,
} from './password.js'
import { readSharedSettings, toShareQuery } from './share.js'

const LENGTH_ID = 'password-length'
const PASSWORD_ID = 'password-output'
const TYPES_LABEL_ID = 'password-types-label'

const METER_TONES = {
    danger: 'bg-danger',
    warning: 'bg-[var(--star)]',
    good: 'bg-[var(--success)]',
}

export default function PasswordTool() {
    // A shared link can set the settings (never a password). They are read once, then removed from the address.
    const params = useInitialParams()
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    // The latest result, or null before anything has been generated. It only ever lives here,
    // in memory: it is never stored, logged, or put in the address.
    const [result, setResult] = useState(null)
    const [visible, setVisible] = useState(true)

    // Randomness is generated from event handlers (not while rendering), because every call
    // gives a different answer.
    const applySettings = (next) => {
        setSettings(next)
        setResult(createPassword(next))
    }
    const update = (patch) => applySettings({ ...settings, ...patch })
    const generate = () => setResult(createPassword(settings))
    const clear = () => setResult(null)
    const reset = () => {
        setSettings(DEFAULT_SETTINGS)
        setResult(null)
    }

    const password = result?.ok ? result.password : ''
    const error = result && !result.ok ? result.error : ''
    const strength = estimateStrength(settings)
    const shareUrl = buildShareUrl(toShareQuery(settings))
    const selectedCount = CHARACTER_TYPES.filter((type) => settings[type.key]).length

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Settings"
                actions={
                    <>
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                        <ResetButton onClick={reset} disabled={isDefaultSettings(settings) && !result} />
                    </>
                }
            >
                <div className="grid gap-5">
                    <RangeField
                        id={LENGTH_ID}
                        label="Length"
                        hint={`From ${LIMITS.min} to ${LIMITS.max} characters.`}
                        min={LIMITS.min}
                        max={LIMITS.max}
                        value={settings.length}
                        onChange={(length) => update({ length })}
                    />

                    <div role="group" aria-labelledby={TYPES_LABEL_ID} className="grid gap-3">
                        <span id={TYPES_LABEL_ID} className="text-sm font-medium">
                            Characters to include
                        </span>
                        {CHARACTER_TYPES.map((type) => (
                            <Checkbox
                                key={type.key}
                                label={type.label}
                                hint={type.hint}
                                checked={settings[type.key]}
                                // The last selected type can't be turned off, so a password is always possible.
                                disabled={settings[type.key] && selectedCount === 1}
                                onChange={(checked) => update({ [type.key]: checked })}
                            />
                        ))}
                        <p className="text-sm text-fg-muted">At least one type is required.</p>
                    </div>

                    <Checkbox
                        label="Avoid look-alike characters"
                        hint="Leaves out l, 1, I, O, 0, and o, which are easy to confuse."
                        checked={settings.avoidAmbiguous}
                        onChange={(avoidAmbiguous) => update({ avoidAmbiguous })}
                    />

                    {strength && (
                        <div>
                            <div className="mb-1.5 flex items-center justify-between text-sm">
                                <span className="font-medium">Estimated strength</span>
                                <span className="text-fg-muted">
                                    {strength.label} · about {strength.bits} bits
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                                <div
                                    className={`h-full rounded-full transition-[width] duration-300 ${METER_TONES[strength.tone]}`}
                                    style={{ width: `${Math.max(4, strength.fraction * 100)}%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm text-fg-muted">
                                An estimate for a random, unique password. It does not protect against reuse or leaks.
                            </p>
                        </div>
                    )}
                </div>
            </ToolPanel>

            <ToolPanel
                title="Password"
                actions={
                    <>
                        <Button variant="primary" onClick={generate}>
                            <RefreshCw size={16} aria-hidden="true" />
                            {password ? 'Regenerate' : 'Generate'}
                        </Button>
                        <CopyButton text={password} label="Copy password" />
                        <ClearButton onClick={clear} disabled={!result} />
                    </>
                }
            >
                <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                        <label htmlFor={PASSWORD_ID} className="sr-only">
                            Generated password
                        </label>
                        <input
                            id={PASSWORD_ID}
                            type={visible ? 'text' : 'password'}
                            value={password}
                            readOnly
                            placeholder="Press Generate"
                            autoComplete="off"
                            spellCheck={false}
                            className="field field-mono min-w-0 flex-1 text-lg tracking-wide"
                        />
                        <IconButton
                            label={visible ? 'Hide password' : 'Show password'}
                            aria-pressed={visible}
                            onClick={() => setVisible((current) => !current)}
                            className="size-11"
                        >
                            {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                        </IconButton>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-danger">
                            {error}
                        </p>
                    )}

                    <p className="text-sm text-fg-muted">
                        Generated in your browser with a cryptographic random number generator. It is not sent
                        anywhere or saved. Copying leaves it on your clipboard until you copy something else.
                    </p>
                </div>
            </ToolPanel>
        </div>
    )
}