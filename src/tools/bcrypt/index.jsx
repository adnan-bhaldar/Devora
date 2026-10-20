import { useRef, useState } from 'react'
import { CircleCheck, CircleX, Eye, EyeOff, Link2, LoaderCircle } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import Field from '../../components/ui/Field.jsx'
import RangeField from '../../components/ui/RangeField.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import {
    COST,
    DEFAULT_SETTINGS,
    EXAMPLE_HASH,
    EXAMPLE_PASSWORD,
    MAX_PASSWORD_BYTES,
    MODES,
    VERSIONS,
    byteLength,
    generateHash,
    isDefaultSettings,
    parseHash,
    verifyPassword,
} from './bcrypt.js'
import { readSharedSettings, toShareQuery } from './share.js'

const IDS = {
    password: 'bcrypt-password',
    cost: 'bcrypt-cost',
    hash: 'bcrypt-hash',
    output: 'bcrypt-output',
    error: 'bcrypt-error',
}

export default function BcryptTool() {
    // A shared link can set the mode, cost, and version. Passwords and hashes are never part of a link.
    const params = useInitialParams()
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [hashText, setHashText] = useState('')
    // The latest finished result. It is thrown away when anything it depends on changes.
    const [outcome, setOutcome] = useState(null)
    const [busy, setBusy] = useState(false)
    // Each run gets a number, so a slow earlier run can never overwrite a newer one.
    const requestId = useRef(0)

    const isGenerate = settings.mode === 'generate'

    const discardResult = () => {
        requestId.current += 1
        setOutcome(null)
        setBusy(false)
    }

    const updateSettings = (patch) => {
        setSettings((current) => ({ ...current, ...patch }))
        discardResult()
    }

    const changePassword = (value) => {
        setPassword(value)
        discardResult()
    }

    const changeHash = (value) => {
        setHashText(value)
        discardResult()
    }

    const run = async (event) => {
        event.preventDefault()
        requestId.current += 1
        const id = requestId.current
        setOutcome(null)
        setBusy(true)

        const result = isGenerate ? await generateHash(password, settings) : await verifyPassword(password, hashText)
        if (id !== requestId.current) return

        setOutcome({ ...result, kind: settings.mode })
        setBusy(false)
    }

    const reset = () => {
        setSettings(DEFAULT_SETTINGS)
        setPassword('')
        setHashText('')
        setShowPassword(false)
        discardResult()
    }

    const fillExample = () => {
        setPassword(EXAMPLE_PASSWORD)
        if (!isGenerate) setHashText(EXAMPLE_HASH)
        discardResult()
    }

    const clear = () => {
        setPassword('')
        setHashText('')
        discardResult()
    }

    const shareUrl = buildShareUrl(toShareQuery(settings))
    const tooLong = byteLength(password) > MAX_PASSWORD_BYTES
    const hashInfo = !isGenerate && hashText.trim() !== '' ? parseHash(hashText) : null
    const canRun = !busy && password !== '' && (isGenerate || (hashInfo !== null && hashInfo.ok))
    const current = outcome !== null && outcome.kind === settings.mode ? outcome : null

    return (
        <form className="grid gap-4 lg:grid-cols-2 lg:items-start" onSubmit={run} noValidate>
            <ToolPanel
                title="Input"
                actions={
                    <>
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                        <ExampleButton onClick={fillExample} />
                        <ClearButton onClick={clear} disabled={password === '' && hashText === ''} />
                        <ResetButton onClick={reset} disabled={isDefaultSettings(settings) && password === '' && hashText === ''} />
                    </>
                }
            >
                <div className="grid gap-5">
                    <ChoiceGroup label="What do you want to do?" options={MODES} value={settings.mode} onChange={(mode) => updateSettings({ mode })} />

                    <Field label="Password" htmlFor={IDS.password}>
                        <div className="flex items-stretch gap-2">
                            <input
                                id={IDS.password}
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="off"
                                spellCheck={false}
                                className="field field-mono min-w-0 flex-1"
                                value={password}
                                onChange={(event) => changePassword(event.target.value)}
                                placeholder="The password to hash"
                            />
                            <Button onClick={() => setShowPassword((shown) => !shown)} aria-pressed={showPassword}>
                                {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                                {showPassword ? 'Hide' : 'Show'}
                            </Button>
                        </div>
                        {tooLong && (
                            <p role="status" className="mt-1.5 text-sm text-fg-muted">
                                bcrypt only uses the first {MAX_PASSWORD_BYTES} bytes of a password. Anything after that is ignored.
                            </p>
                        )}
                    </Field>

                    {isGenerate ? (
                        <>
                            <RangeField
                                id={IDS.cost}
                                label="Cost (rounds)"
                                hint={`From ${COST.min} to ${COST.max}. Every step up doubles the work. 10 to 12 is common today.`}
                                min={COST.min}
                                max={COST.max}
                                value={settings.cost}
                                onChange={(cost) => updateSettings({ cost })}
                            />
                            <ChoiceGroup label="Version prefix" options={VERSIONS} value={settings.version} onChange={(version) => updateSettings({ version })} />
                        </>
                    ) : (
                        <Field
                            label="bcrypt hash"
                            htmlFor={IDS.hash}
                            hint="The hash to check the password against. It starts with $2a$, $2b$, or $2y$."
                        >
                            <textarea
                                id={IDS.hash}
                                className="field field-mono"
                                rows={2}
                                value={hashText}
                                onChange={(event) => changeHash(event.target.value)}
                                placeholder="$2b$10$…"
                                spellCheck={false}
                                aria-invalid={hashInfo !== null && !hashInfo.ok}
                                aria-describedby={hashInfo !== null && !hashInfo.ok ? IDS.error : undefined}
                            />
                            {hashInfo !== null && !hashInfo.ok && (
                                <p id={IDS.error} role="alert" className="mt-1.5 text-sm text-danger">
                                    {hashInfo.error}
                                </p>
                            )}
                        </Field>
                    )}

                    <div>
                        <Button type="submit" variant="primary" disabled={!canRun}>
                            {busy && <LoaderCircle size={16} aria-hidden="true" className="animate-spin" />}
                            {busy ? 'Working…' : isGenerate ? 'Generate hash' : 'Check password'}
                        </Button>
                    </div>
                </div>
            </ToolPanel>

            <ToolPanel
                title="Result"
                className="lg:sticky lg:top-20"
                actions={current?.ok && isGenerate ? <CopyButton text={current.hash} label="Copy hash" copiedLabel="Hash copied" /> : null}
            >
                <div aria-live="polite" className="grid gap-4">
                    {busy && (
                        <p className="text-sm text-fg-muted" role="status">
                            Working. A higher cost takes longer.
                        </p>
                    )}

                    {current && !current.ok && (
                        <p role="alert" className="text-sm text-danger">
                            {current.error}
                        </p>
                    )}

                    {current?.ok && isGenerate && (
                        <>
                            <div>
                                <label htmlFor={IDS.output} className="mb-1.5 block text-sm font-medium">
                                    bcrypt hash
                                </label>
                                <textarea id={IDS.output} className="field field-mono" rows={3} value={current.hash} readOnly spellCheck={false} />
                            </div>
                            <p className="text-sm text-fg-muted">
                                Version ${current.version}$, cost {current.cost}, made in {current.milliseconds} ms. The 60 characters hold the version, the cost, a
                                random salt, and the hash, so you only need to store this one string. Generating again gives a different hash for the same
                                password, because the salt is random.
                            </p>
                        </>
                    )}

                    {current?.ok && !isGenerate && (
                        <div
                            className={`flex items-start gap-3 rounded-xl border p-4 ${current.match ? 'border-success text-success' : 'border-danger text-danger'}`}
                            role="status"
                        >
                            {current.match ? <CircleCheck size={22} aria-hidden="true" className="mt-0.5 shrink-0" /> : <CircleX size={22} aria-hidden="true" className="mt-0.5 shrink-0" />}
                            <div>
                                <p className="font-semibold">{current.match ? 'It matches' : 'It does not match'}</p>
                                <p className="text-sm text-fg-muted">
                                    {current.match ? 'The password produces this hash.' : 'The password does not produce this hash.'} Version ${current.version}$, cost{' '}
                                    {current.cost}, checked in {current.milliseconds} ms.
                                </p>
                            </div>
                        </div>
                    )}

                    {!busy && !current && (
                        <p className="text-sm text-fg-muted">
                            {isGenerate ? 'Type a password and choose “Generate hash”.' : 'Type a password and a hash, then choose “Check password”.'}
                        </p>
                    )}
                </div>
            </ToolPanel>
        </form>
    )
}