import { useEffect, useMemo, useState } from 'react'
import { Link2 } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import Field from '../../components/ui/Field.jsx'
import SearchSelect from '../../components/ui/SearchSelect.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import { readSharedSettings, toShareQuery } from './share.js'
import {
    DEFAULT_SETTINGS,
    EXAMPLE_DATE,
    EXAMPLE_TIMESTAMP,
    LOCAL,
    UNITS,
    UNIT_NAMES,
    formatHuman,
    formatIso,
    formatPlain,
    formatRelative,
    formatUtcString,
    isDefaultSettings,
    listZones,
    localZone,
    parseDate,
    parseTimestamp,
    resolveZone,
} from './timestamp.js'

const IDS = {
    zone: 'timestamp-zone',
    timestamp: 'timestamp-input',
    date: 'timestamp-date-input',
    timestampError: 'timestamp-error',
    dateError: 'timestamp-date-error',
}

// A list of label and value rows, each with a copy button.
function ResultRows({ rows }) {
    return (
        <ul className="grid gap-2">
            {rows.map(([label, value]) => (
                <li
                    key={label}
                    className="tip-end grid min-w-0 gap-1 rounded-xl border border-border bg-surface-2 px-3 py-2 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] sm:items-center sm:gap-3"
                >
                    <span className="text-sm text-fg-muted">{label}</span>
                    <span className="min-w-0 break-words font-mono text-sm">{value}</span>
                    <CopyButton text={value} label={`Copy ${label}`} copiedLabel="Copied" />
                </li>
            ))}
        </ul>
    )
}

const PLACEHOLDER_ROW = <p className="text-sm text-fg-muted">The results appear here.</p>

export default function TimestampTool() {
    // A shared link can set the time zone and unit (never a time you typed).
    const params = useInitialParams()
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    const [timestampText, setTimestampText] = useState('')
    const [dateText, setDateText] = useState('')
    const [now, setNow] = useState(() => Date.now())

    // The clock and the "x minutes ago" text update every second.
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(timer)
    }, [])

    const zone = resolveZone(settings.zone)
    const updateSettings = (patch) => setSettings((current) => ({ ...current, ...patch }))

    const zoneOptions = useMemo(
        () => [
            { value: LOCAL, label: `Your local time (${localZone()})`, searchText: `local your own ${localZone()}` },
            ...listZones().map((name) => ({ value: name, label: name, searchText: `${name} ${name.replaceAll('_', ' ')}` })),
        ],
        [],
    )

    const fromTimestamp = useMemo(() => parseTimestamp(timestampText, settings.unit), [timestampText, settings.unit])
    const fromDate = useMemo(() => parseDate(dateText, zone), [dateText, zone])

    const seconds = Math.floor(now / 1000)
    const reset = () => {
        setSettings(DEFAULT_SETTINGS)
        setTimestampText('')
        setDateText('')
    }

    const shareUrl = buildShareUrl(toShareQuery(settings))

    const timestampRows =
        fromTimestamp.ok && !fromTimestamp.empty
            ? [
                ['UTC (ISO 8601)', formatIso(fromTimestamp.ms, 'UTC')],
                [zone === 'UTC' ? 'Same, in UTC' : `In ${zone}`, formatIso(fromTimestamp.ms, zone)],
                ['Readable', formatHuman(fromTimestamp.ms, zone)],
                ['HTTP / email date', formatUtcString(fromTimestamp.ms)],
                ['Relative', formatRelative(fromTimestamp.ms, now)],
            ]
            : null

    const dateRows =
        fromDate.ok && !fromDate.empty
            ? [
                ['Seconds', String(Math.floor(fromDate.ms / 1000))],
                ['Milliseconds', String(fromDate.ms)],
                ['UTC (ISO 8601)', formatIso(fromDate.ms, 'UTC')],
                ['Relative', formatRelative(fromDate.ms, now)],
            ]
            : null

    return (
        <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                <ToolPanel title="Current Unix time">
                    <ul className="tip-end grid gap-2">
                        {[
                            ['Seconds', String(seconds)],
                            ['Milliseconds', String(now)],
                        ].map(([label, value]) => (
                            <li key={label} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2">
                                <div className="min-w-0">
                                    <span className="block text-sm text-fg-muted">{label}</span>
                                    <span className="block break-all font-mono text-lg font-semibold">{value}</span>
                                </div>
                                <CopyButton text={value} label={`Copy current ${label.toLowerCase()}`} copiedLabel="Copied" />
                            </li>
                        ))}
                    </ul>
                    <p className="mt-2 text-sm text-fg-muted">
                        {formatHuman(now, zone)}
                    </p>
                </ToolPanel>

                <ToolPanel
                    title="Time zone and unit"
                    actions={
                        <>
                            <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                            <ResetButton onClick={reset} disabled={isDefaultSettings(settings) && timestampText === '' && dateText === ''} />
                        </>
                    }
                >
                    <div className="grid gap-5">
                        <Field
                            label="Time zone"
                            htmlFor={IDS.zone}
                            hint="Used to show dates, and to read a date you type that has no offset such as Z or +05:30."
                        >
                            <SearchSelect
                                id={IDS.zone}
                                options={zoneOptions}
                                value={settings.zone}
                                onChange={(value) => updateSettings({ zone: value })}
                                placeholder="Search a time zone"
                                noResultsText="No time zone found"
                            />
                        </Field>
                        <ChoiceGroup label="Timestamp unit" options={UNITS} value={settings.unit} onChange={(unit) => updateSettings({ unit })} />
                    </div>
                </ToolPanel>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                <ToolPanel
                    title="Timestamp to date"
                    actions={
                        <>
                            <ExampleButton onClick={() => setTimestampText(EXAMPLE_TIMESTAMP)} />
                            <Button variant="ghost" onClick={() => setTimestampText(String(seconds))}>
                                Use now
                            </Button>
                            <ClearButton onClick={() => setTimestampText('')} disabled={timestampText === ''} />
                        </>
                    }
                >
                    <div className="grid gap-4">
                        <Field
                            label="Unix timestamp"
                            htmlFor={IDS.timestamp}
                            hint={
                                fromTimestamp.ok && !fromTimestamp.empty
                                    ? `Read as ${UNIT_NAMES[fromTimestamp.unit]}${fromTimestamp.detected ? ' (detected from the number of digits)' : ''}. Anything finer than a millisecond is dropped.`
                                    : 'A number of seconds, milliseconds, microseconds, or nanoseconds since 1 January 1970 UTC.'
                            }
                        >
                            <input
                                id={IDS.timestamp}
                                type="text"
                                inputMode="decimal"
                                autoComplete="off"
                                spellCheck={false}
                                className="field field-mono"
                                value={timestampText}
                                onChange={(event) => setTimestampText(event.target.value)}
                                placeholder="1700000000"
                                aria-invalid={!fromTimestamp.ok}
                                aria-describedby={!fromTimestamp.ok ? IDS.timestampError : undefined}
                            />
                        </Field>
                        {!fromTimestamp.ok && (
                            <p id={IDS.timestampError} role="alert" className="text-sm text-danger">
                                {fromTimestamp.error}
                            </p>
                        )}
                        {timestampRows ? <ResultRows rows={timestampRows} /> : PLACEHOLDER_ROW}
                    </div>
                </ToolPanel>

                <ToolPanel
                    title="Date to timestamp"
                    actions={
                        <>
                            <ExampleButton onClick={() => setDateText(EXAMPLE_DATE)} />
                            <Button variant="ghost" onClick={() => setDateText(formatPlain(now, zone))}>
                                Use now
                            </Button>
                            <ClearButton onClick={() => setDateText('')} disabled={dateText === ''} />
                        </>
                    }
                >
                    <div className="grid gap-4">
                        <Field
                            label="Date and time"
                            htmlFor={IDS.date}
                            hint={
                                fromDate.ok && !fromDate.empty && fromDate.usedOffset
                                    ? 'The offset you typed is used instead of the time zone.'
                                    : `Year-month-day, then an optional time. Read in ${zone} unless you end with Z or an offset such as +05:30.`
                            }
                        >
                            <input
                                id={IDS.date}
                                type="text"
                                autoComplete="off"
                                spellCheck={false}
                                className="field field-mono"
                                value={dateText}
                                onChange={(event) => setDateText(event.target.value)}
                                placeholder="2026-03-15 09:30:00"
                                aria-invalid={!fromDate.ok}
                                aria-describedby={!fromDate.ok ? IDS.dateError : undefined}
                            />
                        </Field>
                        {!fromDate.ok && (
                            <p id={IDS.dateError} role="alert" className="text-sm text-danger">
                                {fromDate.error}
                            </p>
                        )}
                        {fromDate.ok && fromDate.adjusted && (
                            <p role="status" className="text-sm text-fg-muted">
                                That time does not exist in {zone} because the clocks jump forward. The time an hour later is used.
                            </p>
                        )}
                        {dateRows ? <ResultRows rows={dateRows} /> : PLACEHOLDER_ROW}
                    </div>
                </ToolPanel>
            </div>
        </div>
    )
}