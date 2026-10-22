import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Download, Link2, RefreshCw } from 'lucide-react'
import CopyButton from '../../components/common/CopyButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import Field from '../../components/ui/Field.jsx'
import Select from '../../components/ui/Select.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import useToast from '../../hooks/useToast.js'
import { downloadBlob, formatBytes } from '../../utils/files.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import CollapsiblePanel from './CollapsiblePanel.jsx'
import ColumnEditor from './ColumnEditor.jsx'
import FieldPicker from './FieldPicker.jsx'
import OutputPreview from './OutputPreview.jsx'
import { formatOutput } from './formats.js'
import { buildColumns, generate } from './generate.js'
import { LOCALE_OPTIONS, getLocale } from './locales.js'
import { COUNT, DATE_FORMATS, DEFAULT_SETTINGS, DIALECTS, FORMATS, KEY_STYLES, PHONE_FORMATS, PREVIEW_MODES } from './settings.js'
import { readSharedSettings, toShareQuery } from './share.js'

const COUNT_PRESETS = COUNT.presets.map((value) => ({ value, label: value.toLocaleString('en-US') }))
const FORMAT_LABELS = Object.fromEntries(FORMATS.map((format) => [format.value, format.label]))

// A new random word each time, used as the seed when none is typed.
const randomToken = () => Math.random().toString(36).slice(2, 10)

const sameSettings = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export default function DummyDataTool() {
    // A shared link can set the choices (never typed text). They are read once, then removed from the address.
    const params = useInitialParams()
    const toast = useToast()
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    const [runId, setRunId] = useState(randomToken)
    const [countText, setCountText] = useState(() => String(settings.count))
    const [result, setResult] = useState({ status: 'loading', columns: [], rows: [], issues: [] })

    const ids = {
        count: useId(),
        locale: useId(),
        seed: useId(),
        empty: useId(),
        date: useId(),
        phone: useId(),
        ageMin: useId(),
        ageMax: useId(),
        asOf: useId(),
        table: useId(),
        root: useId(),
        record: useId(),
    }

    const update = useCallback((changes) => setSettings((current) => ({ ...current, ...changes })), [])

    // ---- generating ----
    // Only these settings change the data. Output-format settings (JSON style, SQL table, ...) do not
    // regenerate it, so switching format never changes a value.
    const { fields, count, locale, seed, unique, nullPercent, dateFormat, phoneFormat, ageMin, ageMax, asOf, fieldOptions, names, keyStyle } = settings
    const generationSettings = useMemo(
        () => ({
            ...DEFAULT_SETTINGS,
            fields,
            count,
            locale,
            seed: seed.trim() || runId,
            unique,
            nullPercent,
            dateFormat,
            phoneFormat,
            ageMin,
            ageMax,
            asOf,
            fieldOptions,
            names,
            keyStyle,
        }),
        [fields, count, locale, seed, runId, unique, nullPercent, dateFormat, phoneFormat, ageMin, ageMax, asOf, fieldOptions, names, keyStyle],
    )

    useEffect(() => {
        let cancelled = false
        // A short pause, so typing a number or a name does not generate on every key press.
        const timer = window.setTimeout(() => {
            generate(generationSettings)
                .then((made) => {
                    if (!cancelled) setResult({ status: 'ready', ...made })
                })
                .catch(() => {
                    if (!cancelled) setResult({ status: 'error', columns: [], rows: [], issues: [] })
                })
        }, 150)
        return () => {
            cancelled = true
            window.clearTimeout(timer)
        }
    }, [generationSettings])

    const columns = useMemo(() => buildColumns(settings), [settings])
    const output = useMemo(
        () => (result.status === 'ready' && result.columns.length > 0 ? formatOutput(result.columns, result.rows, settings) : null),
        [result, settings],
    )
    const localeInfo = getLocale(settings.locale)
    const has = (...wanted) => settings.fields.some((id) => wanted.includes(id))
    const isDefault = sameSettings({ ...settings, seed: settings.seed }, DEFAULT_SETTINGS)

    // ---- editing ----
    const moveField = (position, step) => {
        const next = [...settings.fields]
        const target = position + step
        if (target < 0 || target >= next.length) return
            ;[next[position], next[target]] = [next[target], next[position]]
        update({ fields: next })
    }

    const commitCount = (text) => {
        setCountText(text)
        const number = Number(text)
        if (text.trim() !== '' && Number.isInteger(number) && number >= COUNT.min && number <= COUNT.max) update({ count: number })
    }

    const reset = () => {
        setSettings(DEFAULT_SETTINGS)
        setCountText(String(DEFAULT_SETTINGS.count))
        setRunId(randomToken())
    }

    const download = () => {
        if (!output) return
        downloadBlob(new Blob([output.text], { type: `${output.mime};charset=utf-8` }), `dummy-data.${output.extension}`)
        toast.success(`Downloaded dummy-data.${output.extension}`)
    }

    const countValid = Number.isInteger(Number(countText)) && countText.trim() !== '' && Number(countText) >= COUNT.min && Number(countText) <= COUNT.max
    const shareUrl = buildShareUrl(toShareQuery(settings))
    const outputSize = output ? new Blob([output.text]).size : 0
    const lineCount = output ? output.text.split('\n').length : 0

    return (
        <div className="dd-stack tip-end gap-4">
            <CollapsiblePanel title="1. Choose fields" defaultOpen>
                <FieldPicker selected={settings.fields} onChange={(next) => update({ fields: next })} />
            </CollapsiblePanel>

            {settings.fields.length > 0 && (
                <CollapsiblePanel title="2. Order and rename columns">
                    <div className="mb-4 max-w-sm">
                        <ChoiceGroup label="Column names" options={KEY_STYLES} value={settings.keyStyle} onChange={(next) => update({ keyStyle: next })} />
                    </div>
                    <ColumnEditor
                        settings={settings}
                        columns={columns}
                        onMove={moveField}
                        onRemove={(id) => update({ fields: settings.fields.filter((item) => item !== id) })}
                        onRename={(id, name) => update({ names: { ...settings.names, [id]: name } })}
                        onOption={(id, key, value) =>
                            update({ fieldOptions: { ...settings.fieldOptions, [id]: { ...settings.fieldOptions[id], [key]: value } } })
                        }
                    />
                </CollapsiblePanel>
            )}

            <CollapsiblePanel
                title="3. Settings"
                actions={
                    <>
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                        <ResetButton onClick={reset} disabled={isDefault && countText === String(DEFAULT_SETTINGS.count)} />
                    </>
                }
            >
                <div className="grid gap-5">
                    <div className="grid gap-3">
                        <ChoiceGroup
                            label="Number of records"
                            options={COUNT_PRESETS}
                            value={settings.count}
                            onChange={(next) => {
                                update({ count: next })
                                setCountText(String(next))
                            }}
                        />
                        <div className="max-w-xs">
                            <Field
                                label="Or a custom number"
                                htmlFor={ids.count}
                                hint={countValid ? `From ${COUNT.min} to ${COUNT.max.toLocaleString('en-US')}.` : undefined}
                            >
                                <input
                                    id={ids.count}
                                    className="field"
                                    inputMode="numeric"
                                    value={countText}
                                    onChange={(event) => commitCount(event.target.value)}
                                    onBlur={() => setCountText(String(settings.count))}
                                    aria-invalid={!countValid}
                                    aria-describedby={countValid ? undefined : `${ids.count}-error`}
                                    autoComplete="off"
                                />
                            </Field>
                            {!countValid && (
                                <p id={`${ids.count}-error`} role="alert" className="mt-1.5 text-sm text-danger">
                                    Enter a whole number from {COUNT.min} to {COUNT.max.toLocaleString('en-US')}. {settings.count.toLocaleString('en-US')} is used until then.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="Locale and country"
                            htmlFor={ids.locale}
                            hint={
                                localeInfo.cities
                                    ? 'Names, phone numbers, and addresses follow this country. City, region, postal code, and coordinates match each other.'
                                    : 'Names and phone numbers follow this country. City, region, and postal code come from Faker and may not belong together.'
                            }
                        >
                            <Select id={ids.locale} options={LOCALE_OPTIONS} value={settings.locale} onChange={(next) => update({ locale: next })} />
                        </Field>
                        <Field
                            label="Seed (optional)"
                            htmlFor={ids.seed}
                            hint="The same seed and settings give the same data every time. Leave it empty for new data on each run."
                        >
                            <input
                                id={ids.seed}
                                className="field field-mono"
                                value={settings.seed}
                                onChange={(event) => update({ seed: event.target.value })}
                                placeholder="Any word or number"
                                maxLength={100}
                                spellCheck={false}
                                autoComplete="off"
                            />
                        </Field>
                        <Field label="Empty values (%)" htmlFor={ids.empty} hint="Share of values left empty (null). ID and UUID are never empty.">
                            <input
                                id={ids.empty}
                                className="field"
                                type="number"
                                min={0}
                                max={100}
                                step={1}
                                value={settings.nullPercent}
                                onChange={(event) => update({ nullPercent: Math.min(100, Math.max(0, Math.trunc(Number(event.target.value)) || 0)) })}
                            />
                        </Field>
                        {has('date', 'dateOfBirth') && (
                            <Field label="Date format" htmlFor={ids.date}>
                                <Select id={ids.date} options={DATE_FORMATS} value={settings.dateFormat} onChange={(next) => update({ dateFormat: next })} />
                            </Field>
                        )}
                        {has('phone') && (
                            <Field label="Phone number format" htmlFor={ids.phone}>
                                <Select id={ids.phone} options={PHONE_FORMATS} value={settings.phoneFormat} onChange={(next) => update({ phoneFormat: next })} />
                            </Field>
                        )}
                    </div>

                    {has('age', 'dateOfBirth') && (
                        <fieldset className="grid gap-4 sm:grid-cols-3">
                            <legend className="mb-2 text-sm font-medium">Ages</legend>
                            <Field label="Youngest" htmlFor={ids.ageMin}>
                                <input id={ids.ageMin} className="field" type="number" min={0} max={120} value={settings.ageMin} onChange={(event) => update({ ageMin: event.target.value })} />
                            </Field>
                            <Field label="Oldest" htmlFor={ids.ageMax}>
                                <input id={ids.ageMax} className="field" type="number" min={0} max={120} value={settings.ageMax} onChange={(event) => update({ ageMax: event.target.value })} />
                            </Field>
                            <Field label="Counted as of" htmlFor={ids.asOf} hint="Age always matches the date of birth on this day.">
                                <input id={ids.asOf} className="field" type="date" value={settings.asOf} onChange={(event) => update({ asOf: event.target.value })} />
                            </Field>
                        </fieldset>
                    )}

                    {has('username', 'email') && (
                        <Checkbox
                            label="Make usernames and emails unique"
                            hint="A number is added to a repeated value. IDs and UUIDs are always unique."
                            checked={settings.unique}
                            onChange={(next) => update({ unique: next })}
                        />
                    )}
                </div>
            </CollapsiblePanel>

            <CollapsiblePanel title="4. Output format" defaultOpen>
                <div className="grid gap-4">
                    <ChoiceGroup label="Format" options={FORMATS} value={settings.format} onChange={(next) => update({ format: next })} />

                    {settings.format === 'json' && (
                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                            <Checkbox label="Formatted (indented)" checked={settings.jsonPretty} onChange={(next) => update({ jsonPretty: next })} disabled={settings.jsonLines} />
                            <Checkbox
                                label="One record per line (JSON Lines)"
                                hint="No surrounding array; save it as .jsonl."
                                checked={settings.jsonLines}
                                onChange={(next) => update({ jsonLines: next })}
                            />
                        </div>
                    )}

                    {settings.format === 'sql' && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Table name" htmlFor={ids.table}>
                                <input
                                    id={ids.table}
                                    className="field field-mono"
                                    value={settings.sqlTable}
                                    onChange={(event) => update({ sqlTable: event.target.value })}
                                    spellCheck={false}
                                    autoComplete="off"
                                    maxLength={64}
                                />
                            </Field>
                            <ChoiceGroup label="Database" options={DIALECTS} value={settings.dialect} onChange={(next) => update({ dialect: next })} />
                        </div>
                    )}

                    {settings.format === 'xml' && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Root element" htmlFor={ids.root}>
                                <input id={ids.root} className="field field-mono" value={settings.xmlRoot} onChange={(event) => update({ xmlRoot: event.target.value })} spellCheck={false} autoComplete="off" maxLength={64} />
                            </Field>
                            <Field label="Record element" htmlFor={ids.record}>
                                <input id={ids.record} className="field field-mono" value={settings.xmlRecord} onChange={(event) => update({ xmlRecord: event.target.value })} spellCheck={false} autoComplete="off" maxLength={64} />
                            </Field>
                        </div>
                    )}
                </div>
            </CollapsiblePanel>

            <CollapsiblePanel
                title="5. Result"
                defaultOpen
                actions={
                    <>
                        <Button variant="ghost" onClick={() => setRunId(randomToken())} disabled={settings.seed.trim() !== ''}>
                            <RefreshCw size={16} aria-hidden="true" />
                            Regenerate
                        </Button>
                        <Button variant="secondary" onClick={download} disabled={!output}>
                            <Download size={16} aria-hidden="true" />
                            Download
                        </Button>
                        <CopyButton text={output?.text ?? ''} label="Copy output" copiedLabel="Copied" />
                    </>
                }
            >
                <div className="dd-stack gap-3">
                    {settings.seed.trim() !== '' && (
                        <p className="text-sm text-fg-muted">Regenerate is off while a seed is set, because the same seed always gives the same data. Clear the seed for new data.</p>
                    )}
                    {result.issues.map((issue) => (
                        <p key={issue} role="status" className="text-sm text-danger">
                            {issue}
                        </p>
                    ))}

                    {settings.fields.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-border-strong p-6 text-center text-sm text-fg-muted">Choose at least one field to generate data.</p>
                    ) : result.status === 'error' ? (
                        <p role="alert" className="text-sm text-danger">
                            The data for this locale could not be loaded. Check your connection and try again.
                        </p>
                    ) : output ? (
                        <>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm text-fg-muted" role="status">
                                    {result.rows.length.toLocaleString('en-US')} records · {FORMAT_LABELS[settings.format]} · {lineCount.toLocaleString('en-US')} lines · {formatBytes(outputSize)}
                                </p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <ChoiceGroup label="Preview" options={PREVIEW_MODES} value={settings.preview} onChange={(next) => update({ preview: next })} />
                                    {settings.preview === 'raw' && (
                                        <Checkbox label="Line numbers" checked={settings.lineNumbers} onChange={(next) => update({ lineNumbers: next })} />
                                    )}
                                </div>
                            </div>
                            <OutputPreview mode={settings.preview} columns={result.columns} rows={result.rows} text={output.text} lineNumbers={settings.lineNumbers} />
                        </>
                    ) : (
                        <p className="text-sm text-fg-muted" role="status">
                            Generating…
                        </p>
                    )}

                    <p className="text-xs text-fg-muted">
                        All of this is made-up test data, created in your browser. Email addresses use example.com, and nothing is sent anywhere.
                    </p>
                </div>
            </CollapsiblePanel>
        </div>
    )
}