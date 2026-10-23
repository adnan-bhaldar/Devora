import { useId, useMemo, useState } from 'react'
import { ArrowLeftRight, Link2 } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import Field from '../../components/ui/Field.jsx'
import IconButton from '../../components/ui/IconButton.jsx'
import Select from '../../components/ui/Select.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import {
    COMMON_SIZES,
    DEFAULT_SETTINGS,
    EXAMPLE_VALUE,
    LIMITS,
    UNITS,
    UNIT_OPTIONS,
    convert,
    formatNumber,
    formatWithUnit,
    isDefaultSettings,
    parseValue,
} from './units.js'
import { readSharedSettings, toShareQuery } from './share.js'

const VALUE_ID = 'css-units-value'

// A whole-number setting. The box keeps what is typed; a valid number is used straight away, and the
// box goes back to the number in use when you leave it.
function NumberSetting({ label, hint, value, limits, onCommit }) {
    const id = useId()
    const [text, setText] = useState(String(value))
    const [editing, setEditing] = useState(false)

    const number = Number(text)
    const valid = text.trim() !== '' && Number.isInteger(number) && number >= limits.min && number <= limits.max
    // While you are not editing, show the number in use (it can change from Reset or a link).
    const shown = editing ? text : String(value)

    return (
        <div>
            <Field label={label} htmlFor={id} hint={editing && !valid ? undefined : hint}>
                <input
                    id={id}
                    className="field"
                    inputMode="numeric"
                    value={shown}
                    onFocus={() => {
                        setText(String(value))
                        setEditing(true)
                    }}
                    onChange={(event) => {
                        const next = event.target.value
                        setText(next)
                        const parsed = Number(next)
                        if (next.trim() !== '' && Number.isInteger(parsed) && parsed >= limits.min && parsed <= limits.max) onCommit(parsed)
                    }}
                    onBlur={() => setEditing(false)}
                    aria-invalid={editing && !valid}
                    aria-describedby={editing && !valid ? `${id}-error` : undefined}
                    autoComplete="off"
                />
            </Field>
            {editing && !valid && (
                <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">
                    Enter a whole number from {limits.min.toLocaleString('en-US')} to {limits.max.toLocaleString('en-US')}.
                </p>
            )}
        </div>
    )
}

export default function CssUnitsTool() {
    // A shared link can set the units and settings (never the number). They are read once, then removed from the address.
    const params = useInitialParams()
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    const [text, setText] = useState('')
    const update = (changes) => setSettings((current) => ({ ...current, ...changes }))

    const context = useMemo(
        () => ({ root: settings.root, parent: settings.parent, width: settings.width, height: settings.height }),
        [settings.root, settings.parent, settings.width, settings.height],
    )
    const parsed = useMemo(() => parseValue(text), [text])
    const { decimals } = settings

    const result = parsed.value === undefined ? null : convert(parsed.value, settings.from, settings.to, context)
    const resultText = result === null ? '' : formatNumber(result, decimals)

    // The viewport sizes only matter for the viewport units. The root and parent font sizes are always shown,
    // because the "Common sizes" table below uses them whatever units are chosen. With "show all" every setting matters.
    const used = settings.showAll ? UNITS.map((unit) => unit.id) : [settings.from, settings.to]
    const needs = {
        width: used.some((unit) => ['vw', 'vmin', 'vmax'].includes(unit)),
        height: used.some((unit) => ['vh', 'vmin', 'vmax'].includes(unit)),
    }

    const everyUnit = useMemo(
        () => (settings.showAll && parsed.value !== undefined ? UNITS.map((unit) => ({ ...unit, text: formatWithUnit(convert(parsed.value, settings.from, unit.id, context), unit.id, decimals) })) : []),
        [settings.showAll, parsed.value, settings.from, context, decimals],
    )

    const table = useMemo(
        () => COMMON_SIZES.map((px) => ({ px, rem: convert(px, 'px', 'rem', context), em: convert(px, 'px', 'em', context), pt: convert(px, 'px', 'pt', context), pct: convert(px, 'px', '%', context) })),
        [context],
    )

    const shareUrl = buildShareUrl(toShareQuery(settings))
    const swap = () => update({ from: settings.to, to: settings.from })

    return (
        <div className="grid gap-4">
            <ToolPanel
                title="Convert"
                actions={
                    <>
                        <ExampleButton onClick={() => setText(EXAMPLE_VALUE)} />
                        <ClearButton onClick={() => setText('')} disabled={text === ''} />
                    </>
                }
            >
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
                    <Field label="Value" htmlFor={VALUE_ID}>
                        <input
                            id={VALUE_ID}
                            className="field field-mono"
                            inputMode="decimal"
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            placeholder="For example 24"
                            spellCheck={false}
                            autoComplete="off"
                            aria-invalid={parsed.error !== undefined}
                            aria-describedby={parsed.error ? 'css-units-error' : undefined}
                        />
                    </Field>
                    <Field label="From" htmlFor="css-units-from">
                        <Select id="css-units-from" options={UNIT_OPTIONS} value={settings.from} onChange={(from) => update({ from })} />
                    </Field>
                    <IconButton label="Swap units" onClick={swap} className="size-11 justify-self-start rounded-xl border border-border bg-surface hover:bg-surface-2 sm:justify-self-center">
                        <ArrowLeftRight size={18} aria-hidden="true" />
                    </IconButton>
                    <Field label="To" htmlFor="css-units-to">
                        <Select id="css-units-to" options={UNIT_OPTIONS} value={settings.to} onChange={(to) => update({ to })} />
                    </Field>
                </div>
                {parsed.error && (
                    <p id="css-units-error" role="alert" className="mt-2 text-sm text-danger">
                        {parsed.error}
                    </p>
                )}
            </ToolPanel>

            <ToolPanel
                title="Result"
                actions={
                    <>
                        <CopyButton text={resultText} label="Copy number" copiedLabel="Number copied" />
                        <CopyButton text={result === null ? '' : formatWithUnit(result, settings.to, decimals)} label="Copy with unit" copiedLabel="Copied with unit" variant="primary" />
                    </>
                }
            >
                {result === null ? (
                    <p className="text-sm text-fg-muted">The result appears here.</p>
                ) : (
                    <p className="break-words font-mono text-xl font-semibold" role="status">
                        <span className="text-fg-muted">{formatWithUnit(parsed.value, settings.from, 10)} =</span> {formatWithUnit(result, settings.to, decimals)}
                    </p>
                )}
                {settings.showAll && everyUnit.length > 0 && (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {everyUnit.map((unit) => (
                            <li key={unit.id} className="tip-end flex items-center justify-between gap-2 rounded-xl border border-border bg-surface p-3">
                                <span className="min-w-0 break-words font-mono text-sm">{unit.text}</span>
                                <CopyButton text={unit.text} label={`Copy ${unit.text}`} copiedLabel="Copied" />
                            </li>
                        ))}
                    </ul>
                )}
            </ToolPanel>

            <ToolPanel
                title="Settings"
                actions={
                    <>
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                        <ResetButton onClick={() => setSettings(DEFAULT_SETTINGS)} disabled={isDefaultSettings(settings)} />
                    </>
                }
            >
                <div className="grid gap-4">
                    <Checkbox
                        label="Show all units"
                        hint="Lists the same number in every unit, each with a copy button."
                        checked={settings.showAll}
                        onChange={(showAll) => update({ showAll })}
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <NumberSetting label="Root font size (px)" hint="Used by rem. The font size of the html element; browsers use 16." value={settings.root} limits={LIMITS.root} onCommit={(root) => update({ root })} />
                        <NumberSetting label="Parent font size (px)" hint="Used by em and %." value={settings.parent} limits={LIMITS.parent} onCommit={(parent) => update({ parent })} />
                        {needs.width && (
                            <NumberSetting label="Viewport width (px)" hint="Used by vw, vmin, and vmax." value={settings.width} limits={LIMITS.width} onCommit={(width) => update({ width })} />
                        )}
                        {needs.height && (
                            <NumberSetting label="Viewport height (px)" hint="Used by vh, vmin, and vmax." value={settings.height} limits={LIMITS.height} onCommit={(height) => update({ height })} />
                        )}
                        <NumberSetting label="Decimal places" hint="From 0 to 6." value={settings.decimals} limits={LIMITS.decimals} onCommit={(next) => update({ decimals: next })} />
                    </div>
                </div>
            </ToolPanel>

            <ToolPanel title="Common sizes">
                <p className="mb-3 text-sm text-fg-muted">Pixel sizes converted with the root font size ({settings.root} px) and parent font size ({settings.parent} px) above.</p>
                {/* tabIndex 0 lets keyboard users scroll a wide table. */}
                <div className="dd-scroll" tabIndex={0} role="region" aria-label="Common pixel sizes in other units">
                    <table className="dd-table">
                        <thead>
                            <tr>
                                <th scope="col">px</th>
                                <th scope="col">rem</th>
                                <th scope="col">em</th>
                                <th scope="col">pt</th>
                                <th scope="col">%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table.map((row) => (
                                <tr key={row.px}>
                                    <th scope="row">{row.px}</th>
                                    <td>{formatNumber(row.rem, decimals)}</td>
                                    <td>{formatNumber(row.em, decimals)}</td>
                                    <td>{formatNumber(row.pt, decimals)}</td>
                                    <td>{formatNumber(row.pct, decimals)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ToolPanel>
        </div>
    )
}