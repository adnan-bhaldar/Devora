import { useEffect, useMemo, useRef, useState } from 'react'
import { Activity, ArrowDown, ArrowUp, Check, Gauge as GaugeIcon, Play, RotateCcw, Square, Timer, Waves } from 'lucide-react'
import CopyButton from '../../components/common/CopyButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import Gauge from './Gauge.jsx'
import Metric from './Metric.jsx'
import { EMPTY_LIVE, ENGINE_OPTIONS, UNITS, formatMs, formatSpeed, readResults, speedIn } from './engine.js'

const UNIT_CHOICES = UNITS.map((unit) => ({ value: unit.value, label: unit.label }))

// The three stages, in the order they run.
const STAGES = [
    { id: 'latency', label: 'Ping', icon: Timer },
    { id: 'download', label: 'Download', icon: ArrowDown },
    { id: 'upload', label: 'Upload', icon: ArrowUp },
]

const STAGE_TEXT = {
    idle: 'Ready to test',
    latency: 'Measuring ping…',
    download: 'Measuring download speed…',
    upload: 'Measuring upload speed…',
    done: 'Test complete',
    stopped: 'Test stopped',
    error: 'Test failed',
}

const stageIndex = (id) => STAGES.findIndex((item) => item.id === id)

const stageState = (id, stage, phase) => {
    const order = STAGES.map((item) => item.id)
    if (phase === 'done') return 'done'
    if (phase === 'idle') return 'pending'
    const at = order.indexOf(stage)
    const index = order.indexOf(id)
    if (index < at) return 'done'
    if (index === at) return phase === 'running' ? 'active' : 'pending'
    return 'pending'
}

export default function SpeedTestTool() {
    const [unitId, setUnitId] = useState('mbps')
    const [phase, setPhase] = useState('idle') // idle | running | done | stopped | error
    const [stage, setStage] = useState('idle') // latency | download | upload while running
    const [live, setLive] = useState(EMPTY_LIVE)
    const [error, setError] = useState('')
    const engine = useRef(null)
    const runId = useRef(0)
    const unit = UNITS.find((item) => item.value === unitId)

    // Leaving the page stops a test that is still running, so it does not keep using the connection.
    useEffect(
        () => () => {
            runId.current += 1
            engine.current?.pause()
            engine.current = null
        },
        [],
    )

    const stop = (nextPhase) => {
        runId.current += 1
        engine.current?.pause()
        engine.current = null
        setPhase(nextPhase)
    }

    const start = async () => {
        stop('running')
        const id = runId.current
        setLive(EMPTY_LIVE)
        setError('')
        setStage('latency')
        try {
            // The library is large, so it is only downloaded when a test starts.
            const { default: SpeedTest } = await import('@cloudflare/speedtest')
            if (id !== runId.current) return
            const test = new SpeedTest(ENGINE_OPTIONS)
            engine.current = test
            let finished = false
            test.onResultsChange = ({ type }) => {
                if (id !== runId.current) return
                // The stage only moves forward, even if the library interleaves a ping inside the download stage.
                setStage((current) => (stageIndex(type) > stageIndex(current) ? type : current))
                setLive(readResults(test.results))
            }
            test.onError = (message) => {
                if (id === runId.current) setError((current) => current || String(message))
            }
            // When a measurement fails for good (for example the servers cannot be reached), the library stops
            // and calls onError, but never onFinish. Its "stopped running" signal is the only sign that the test
            // is over. A normal finish also stops it, so the check waits a moment and skips runs that finished,
            // and runs that were stopped or replaced.
            test.onRunningChange = (isRunning) => {
                if (isRunning) return
                window.setTimeout(() => {
                    if (id !== runId.current || finished) return
                    engine.current = null
                    setPhase('error')
                }, 100)
            }
            test.onFinish = (results) => {
                if (id !== runId.current) return
                finished = true
                const final = readResults(results)
                setLive(final)
                engine.current = null
                if (final.download == null && final.upload == null && final.ping == null) {
                    setPhase('error')
                } else {
                    setPhase('done')
                }
            }
            test.play()
        } catch {
            if (id !== runId.current) return
            setError('The speed test could not be loaded.')
            setPhase('error')
        }
    }

    const running = phase === 'running'
    const shownStage = phase === 'running' ? stage : phase === 'done' ? 'done' : phase
    const gaugeBits = stage === 'upload' && running ? live.upload : live.download
    const gaugeValue = phase === 'idle' ? null : speedIn(unit, phase === 'done' ? live.download : gaugeBits)
    const gaugeStage = running ? stage : phase === 'done' ? 'download' : 'idle'

    const summary = useMemo(() => {
        if (phase !== 'done') return ''
        const speed = (bits) => (bits == null ? 'not measured' : `${formatSpeed(speedIn(unit, bits))} ${unit.label}`)
        return [
            `Download: ${speed(live.download)}`,
            `Upload: ${speed(live.upload)}`,
            `Ping: ${live.ping == null ? 'not measured' : `${formatMs(live.ping)} ms`}`,
            `Jitter: ${live.jitter == null ? 'not measured' : `${formatMs(live.jitter, 1)} ms`}`,
            `Measured with speed.cloudflare.com on ${new Date().toLocaleString()}`,
        ].join('\n')
    }, [phase, live, unit])

    return (
        <div className="dd-stack tip-end gap-4">
            <ToolPanel
                title="Speed test"
                actions={<ChoiceGroup label="Unit" options={UNIT_CHOICES} value={unitId} onChange={setUnitId} />}
            >
                <ol className="speed-steps" aria-label="Test stages">
                    {STAGES.map((item, index) => {
                        const state = stageState(item.id, stage, phase)
                        return (
                            <li key={item.id} className="speed-steps__item" data-state={state}>
                                <span className="speed-steps__dot">
                                    {state === 'done' ? <Check size={14} aria-hidden="true" /> : <item.icon size={14} aria-hidden="true" />}
                                </span>
                                <span className="speed-steps__label">{item.label}</span>
                                {index < STAGES.length - 1 && <span className="speed-steps__line" aria-hidden="true" />}
                            </li>
                        )
                    })}
                </ol>

                <Gauge unit={unit} value={gaugeValue} stage={gaugeStage} label={STAGE_TEXT[shownStage]} />

                <p className="speed-status" role="status" data-phase={phase}>
                    {STAGE_TEXT[shownStage]}
                    {phase === 'done' && <span className="sr-only">. {summary.split('\n').slice(0, 4).join('. ')}</span>}
                </p>

                <div className="speed-actions">
                    {running ? (
                        <Button variant="secondary" onClick={() => stop('stopped')}>
                            <Square size={16} aria-hidden="true" />
                            Stop
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={start}>
                            {phase === 'idle' ? <Play size={16} aria-hidden="true" /> : <RotateCcw size={16} aria-hidden="true" />}
                            {phase === 'idle' ? 'Start test' : 'Test again'}
                        </Button>
                    )}
                    <CopyButton text={summary} label="Copy results" copiedLabel="Results copied" variant="secondary" />
                </div>

                {phase === 'error' && (
                    <p role="alert" className="mt-3 text-center text-sm text-danger">
                        {error || 'The speed test servers could not be reached.'} Check your internet connection. Some ad blockers and
                        company networks block speed.cloudflare.com.
                    </p>
                )}
                {phase === 'idle' && (
                    <p className="mt-4 text-center text-sm text-fg-muted">
                        The test sends data to and from Cloudflare’s speed servers. It can use up to about 1.3 GB on a fast connection, so
                        think twice before running it on mobile data.
                    </p>
                )}
            </ToolPanel>

            <ToolPanel title="Results">
                <div className="speed-grid">
                    <Metric
                        icon={ArrowDown}
                        label="Download"
                        unit={unit.label}
                        value={speedIn(unit, live.download)}
                        format={formatSpeed}
                        points={live.downloadPoints.map((bits) => speedIn(unit, bits))}
                        active={running && stage === 'download'}
                    />
                    <Metric
                        icon={ArrowUp}
                        label="Upload"
                        tone="success"
                        unit={unit.label}
                        value={speedIn(unit, live.upload)}
                        format={formatSpeed}
                        points={live.uploadPoints.map((bits) => speedIn(unit, bits))}
                        active={running && stage === 'upload'}
                    />
                    <Metric
                        icon={Timer}
                        label="Ping"
                        tone="warn"
                        unit="ms"
                        value={live.ping}
                        format={(value) => formatMs(value)}
                        points={live.pingPoints}
                        active={running && stage === 'latency'}
                    />
                    <Metric icon={Activity} label="Jitter" tone="warn" unit="ms" value={live.jitter} format={(value) => formatMs(value, 1)} />
                    <Metric icon={Waves} label="Ping while downloading" tone="warn" unit="ms" value={live.downloadLatency} format={(value) => formatMs(value)} />
                    <Metric icon={GaugeIcon} label="Ping while uploading" tone="warn" unit="ms" value={live.uploadLatency} format={(value) => formatMs(value)} />
                </div>
            </ToolPanel>
        </div>
    )
}