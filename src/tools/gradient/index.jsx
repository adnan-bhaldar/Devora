import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link2, Plus } from 'lucide-react'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import Field from '../../components/ui/Field.jsx'
import Select from '../../components/ui/Select.jsx'
import ColorStopRow from './ColorStopRow.jsx'
import DirectionPicker from './DirectionPicker.jsx'
import {
    DEFAULT_QUERY,
    GRADIENT_TYPES,
    MAX_STOPS,
    MIN_STOPS,
    RADIAL_POSITIONS,
    RADIAL_SHAPES,
    buildCss,
    buildGradient,
    clampNumber,
    createDefaultConfig,
    createExampleConfig,
    insertStop,
    isCenterOut,
    parseConfig,
    toQueryString,
    usesAngle,
} from './gradient.js'

export default function GradientTool() {
    const location = useLocation()
    const navigate = useNavigate()

    // Read the shared link once, when the tool first loads. After that, this state is the
    // only source of truth, and the address bar is not used to store it.
    const [config, setConfig] = useState(() => parseConfig(new URLSearchParams(location.search)))

    // Once the settings have been loaded, replace the address with the clean tool URL.
    // "replace" swaps the current history entry, so Back doesn't return to the long link.
    useEffect(() => {
        if (location.search) navigate(location.pathname, { replace: true })
    }, [location.pathname, location.search, navigate])

    const gradient = useMemo(() => buildGradient(config), [config])
    const css = useMemo(() => buildCss(config), [config])
    const query = useMemo(() => toQueryString(config), [config])
    const shareUrl = `${window.location.origin}${window.location.pathname}?${query}`
    const isDefault = query === DEFAULT_QUERY

    const update = (patch) => setConfig((current) => ({ ...current, ...patch }))

    const updateStop = (id, patch) =>
        setConfig((current) => ({
            ...current,
            stops: current.stops.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)),
        }))

    const removeStop = (id) =>
        setConfig((current) =>
            current.stops.length <= MIN_STOPS
                ? current
                : { ...current, stops: current.stops.filter((stop) => stop.id !== id) },
        )

    const addStop = () => setConfig((current) => ({ ...current, stops: insertStop(current.stops) }))

    const setAngle = (value) => update({ angle: clampNumber(Number(value), 0, 360, 0) })

    const angleHint =
        config.type === 'reflected'
            ? 'The first stop sits on the center line and the colors mirror outward in both directions. 0° points up, and angles increase clockwise.'
            : '0° points up, and angles increase clockwise.'

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:items-start">
            <ToolPanel title="Preview" className="lg:col-start-1 lg:row-start-1">
                <div
                    role="img"
                    aria-label={`Preview of the ${config.type} gradient`}
                    className="h-56 rounded-xl border border-border sm:h-72"
                    style={{ background: gradient }}
                />
            </ToolPanel>

            <div className="grid content-start gap-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                <ToolPanel
                    title="Settings"
                    actions={
                        <>
                            <ExampleButton onClick={() => setConfig(createExampleConfig())} />
                            <ResetButton onClick={() => setConfig(createDefaultConfig())} disabled={isDefault} />
                        </>
                    }
                >
                    <div className="grid gap-5">
                        <ChoiceGroup
                            label="Type"
                            options={GRADIENT_TYPES}
                            value={config.type}
                            onChange={(type) => update({ type })}
                        />

                        {usesAngle(config.type) && (
                            <>
                                <Field label="Angle" htmlFor="gradient-angle" hint={angleHint}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            id="gradient-angle"
                                            type="range"
                                            min={0}
                                            max={360}
                                            step={1}
                                            value={config.angle}
                                            onChange={(event) => setAngle(event.target.value)}
                                            className="w-full accent-accent"
                                        />
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="number"
                                                aria-label="Angle in degrees"
                                                min={0}
                                                max={360}
                                                step={1}
                                                value={config.angle}
                                                onChange={(event) => setAngle(event.target.value)}
                                                className="field w-20"
                                            />
                                            <span aria-hidden="true" className="text-sm text-fg-muted">
                                                °
                                            </span>
                                        </div>
                                    </div>
                                </Field>

                                <div>
                                    <p className="mb-2 text-sm font-medium">Direction</p>
                                    <DirectionPicker angle={config.angle} onChange={(angle) => update({ angle })} />
                                </div>
                            </>
                        )}

                        {config.type === 'radial' && (
                            <>
                                <ChoiceGroup
                                    label="Shape"
                                    options={RADIAL_SHAPES}
                                    value={config.shape}
                                    onChange={(shape) => update({ shape })}
                                />
                                <Field label="Position" htmlFor="gradient-position">
                                    <Select
                                        id="gradient-position"
                                        options={RADIAL_POSITIONS}
                                        value={config.position}
                                        onChange={(position) => update({ position })}
                                    />
                                </Field>
                            </>
                        )}

                        {config.type === 'diamond' && (
                            <p className="text-sm text-fg-muted">
                                A diamond gradient spreads from the center to the corners and has no extra
                                settings. The first stop is at the center and the last is at the corners.
                            </p>
                        )}
                    </div>
                </ToolPanel>

                <ToolPanel
                    title="Color stops"
                    actions={
                        <Button onClick={addStop} disabled={config.stops.length >= MAX_STOPS}>
                            <Plus size={16} aria-hidden="true" />
                            Add stop
                        </Button>
                    }
                >
                    <ul className="grid gap-3">
                        {config.stops.map((stop, index) => (
                            <ColorStopRow
                                key={stop.id}
                                stop={stop}
                                index={index}
                                canRemove={config.stops.length > MIN_STOPS}
                                onChange={(patch) => updateStop(stop.id, patch)}
                                onRemove={() => removeStop(stop.id)}
                            />
                        ))}
                    </ul>
                    <p className="mt-3 text-sm text-fg-muted">
                        {config.stops.length} of {MAX_STOPS} stops used.
                        {isCenterOut(config.type) && ' Position 0% is the center and 100% is the outer edge.'}
                    </p>
                </ToolPanel>
            </div>

            <ToolPanel
                title="CSS"
                className="lg:col-start-1 lg:row-start-2"
                actions={
                    <>
                        <CopyButton text={css} label="Copy CSS" variant="primary" />
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                    </>
                }
            >
                <pre className="code-block">{css}</pre>
            </ToolPanel>
        </div>
    )
}