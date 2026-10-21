import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeftRight, Download, Link2, Play, Square } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import RangeField from '../../components/ui/RangeField.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import useToast from '../../hooks/useToast.js'
import { downloadBlob } from '../../utils/files.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import {
    CHART_GROUPS,
    DEFAULT_SETTINGS,
    EXAMPLES,
    MAX_LENGTH,
    MODES,
    PITCH,
    SPEED,
    decode,
    encode,
    isDefaultSettings,
    tidyMorse,
} from './morse.js'
import { readSharedSettings, toShareQuery } from './share.js'
import { MAX_SECONDS, buildPlan, isOnAt, renderWav } from './sound.js'

const IDS = { input: 'morse-input', output: 'morse-output', speed: 'morse-speed', pitch: 'morse-pitch' }

export default function MorseCodeTool() {
    const toast = useToast()
    // A shared link can set the direction, speed, and pitch (never the text).
    const params = useInitialParams()
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    const [text, setText] = useState('')
    const [showLight, setShowLight] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [lampOn, setLampOn] = useState(false)

    const audioRef = useRef(null)
    const segmentsRef = useRef([])
    // The last sound that was made, so playing and downloading the same thing makes it once.
    const soundRef = useRef({ key: '', blob: null, url: '' })

    const isEncode = settings.mode === 'encode'
    const tooLong = text.length > MAX_LENGTH

    const result = useMemo(() => {
        if (tooLong) return { output: '', notes: [] }
        if (isEncode) {
            const { output, skipped } = encode(text)
            return { output, notes: skipped }
        }
        const { output, unknown } = decode(text)
        return { output, notes: unknown }
    }, [text, isEncode, tooLong])

    // The Morse that the sound is made from: the result when encoding, or what was typed when decoding.
    const tidy = useMemo(() => (tooLong ? '' : tidyMorse(isEncode ? result.output : text)), [tooLong, isEncode, result.output, text])
    const plan = useMemo(() => buildPlan(tidy, settings.wpm), [tidy, settings.wpm])
    const soundTooLong = plan.duration > MAX_SECONDS
    const canSound = plan.segments.length > 0 && !soundTooLong

    const stop = () => {
        const audio = audioRef.current
        if (audio) {
            audio.pause()
            audioRef.current = null
        }
        setPlaying(false)
    }

    // Light up the lamp in time with the sound, by checking where the sound is on every screen frame.
    useEffect(() => {
        if (!playing || !showLight) return undefined
        let frame = 0
        const tick = () => {
            const audio = audioRef.current
            if (audio) setLampOn(isOnAt(segmentsRef.current, audio.currentTime))
            frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(frame)
            setLampOn(false)
        }
    }, [playing, showLight])

    // Leaving the page stops the sound and frees the file.
    useEffect(() => {
        const sound = soundRef.current
        return () => {
            audioRef.current?.pause()
            if (sound.url) URL.revokeObjectURL(sound.url)
        }
    }, [])

    const getSound = () => {
        const key = `${tidy}|${settings.wpm}|${settings.frequency}`
        const current = soundRef.current
        if (current.key !== key) {
            if (current.url) URL.revokeObjectURL(current.url)
            const blob = renderWav(plan, settings.frequency)
            soundRef.current = { key, blob, url: URL.createObjectURL(blob) }
        }
        return soundRef.current
    }

    const play = () => {
        stop()
        const audio = new Audio(getSound().url)
        audio.onended = () => setPlaying(false)
        audio.onerror = () => {
            setPlaying(false)
            toast.error('The sound could not be played in this browser. Try the download instead.')
        }
        segmentsRef.current = plan.segments
        audioRef.current = audio
        setPlaying(true)
        audio.play().catch(() => {
            setPlaying(false)
            toast.error('The browser blocked the sound. Press Play again.')
        })
    }

    const download = () => downloadBlob(getSound().blob, 'morse-code.wav')

    const changeText = (value) => {
        stop()
        setText(value)
    }

    const updateSettings = (patch) => {
        stop()
        setSettings((current) => ({ ...current, ...patch }))
    }

    const swap = () => {
        stop()
        setText(result.output)
        setSettings((current) => ({ ...current, mode: current.mode === 'encode' ? 'decode' : 'encode' }))
    }

    const reset = () => {
        stop()
        setSettings(DEFAULT_SETTINGS)
        setText('')
    }

    const shareUrl = buildShareUrl(toShareQuery(settings))
    const inputTitle = isEncode ? 'Text' : 'Morse code'
    const outputTitle = isEncode ? 'Morse code' : 'Text'
    const noteLabel = isEncode ? 'These characters have no Morse code and were skipped' : 'These groups are not Morse letters and show as ?'

    return (
        <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                <ToolPanel
                    title={inputTitle}
                    actions={
                        <>
                            <ExampleButton onClick={() => changeText(EXAMPLES[settings.mode])} />
                            <Button variant="ghost" onClick={swap} disabled={result.output === ''}>
                                <ArrowLeftRight size={16} aria-hidden="true" />
                                Swap
                            </Button>
                            <ClearButton onClick={() => changeText('')} disabled={text === ''} />
                        </>
                    }
                >
                    <div className="grid gap-4">
                        <ChoiceGroup label="Direction" options={MODES} value={settings.mode} onChange={(mode) => updateSettings({ mode })} />
                        <div>
                            <label htmlFor={IDS.input} className="sr-only">
                                {isEncode ? 'Text to turn into Morse code' : 'Morse code to turn into text'}
                            </label>
                            <textarea
                                id={IDS.input}
                                className={`field ${isEncode ? '' : 'field-mono'}`.trim()}
                                rows={7}
                                value={text}
                                onChange={(event) => changeText(event.target.value)}
                                placeholder={
                                    isEncode
                                        ? 'Type or paste text. Each line is converted on its own.'
                                        : 'Use . and - with a space between letters and / between words.'
                                }
                                spellCheck={false}
                                aria-invalid={tooLong}
                                aria-describedby={tooLong ? 'morse-error' : undefined}
                            />
                            {tooLong && (
                                <p id="morse-error" role="alert" className="mt-2 text-sm text-danger">
                                    The text is too long. The limit is {MAX_LENGTH.toLocaleString('en-US')} characters.
                                </p>
                            )}
                        </div>
                    </div>
                </ToolPanel>

                <ToolPanel title={outputTitle} actions={<CopyButton text={result.output} label={`Copy ${outputTitle.toLowerCase()}`} />}>
                    <label htmlFor={IDS.output} className="sr-only">
                        {outputTitle} result
                    </label>
                    <textarea
                        id={IDS.output}
                        className={`field ${isEncode ? 'field-mono' : ''}`.trim()}
                        rows={7}
                        value={result.output}
                        readOnly
                        spellCheck={false}
                        placeholder="Your result appears here"
                    />
                    {result.notes.length > 0 && (
                        <p role="status" className="mt-2 break-words text-sm text-fg-muted">
                            {noteLabel}: <span className="font-mono">{result.notes.join('  ')}</span>
                        </p>
                    )}
                </ToolPanel>
            </div>

            <ToolPanel
                title="Sound"
                actions={
                    <>
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                        <ResetButton onClick={reset} disabled={isDefaultSettings(settings) && text === ''} />
                    </>
                }
            >
                <div className="grid gap-5">
                    <div className="flex flex-wrap items-center gap-3">
                        {playing ? (
                            <Button variant="primary" onClick={stop}>
                                <Square size={16} aria-hidden="true" />
                                Stop
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={play} disabled={!canSound}>
                                <Play size={16} aria-hidden="true" />
                                Play
                            </Button>
                        )}
                        <Button onClick={download} disabled={!canSound}>
                            <Download size={16} aria-hidden="true" />
                            Download .wav
                        </Button>
                        {showLight && <span className="morse-lamp" data-on={lampOn} aria-hidden="true" />}
                        <p className="text-sm text-fg-muted" role="status">
                            {soundTooLong
                                ? `This is longer than ${MAX_SECONDS / 60} minutes of sound, which is the limit. Use a shorter text or a higher speed.`
                                : canSound
                                  ? `Length: ${plan.duration.toFixed(1)} seconds`
                                  : 'Type something to hear it.'}
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <RangeField
                            id={IDS.speed}
                            label="Speed (words per minute)"
                            hint={`From ${SPEED.min} to ${SPEED.max}. At 20, a dot lasts 60 milliseconds.`}
                            min={SPEED.min}
                            max={SPEED.max}
                            value={settings.wpm}
                            onChange={(wpm) => updateSettings({ wpm })}
                        />
                        <RangeField
                            id={IDS.pitch}
                            label="Pitch (hertz)"
                            hint={`From ${PITCH.min} to ${PITCH.max}. A higher number is a higher beep.`}
                            min={PITCH.min}
                            max={PITCH.max}
                            value={settings.frequency}
                            onChange={(frequency) => updateSettings({ frequency })}
                        />
                    </div>

                    <Checkbox
                        label="Flash a light with the sound"
                        hint="Off by default because fast flashing can bother some people."
                        checked={showLight}
                        onChange={setShowLight}
                    />
                </div>
            </ToolPanel>

            <ToolPanel title="Morse code chart">
                <div className="grid gap-5">
                    {CHART_GROUPS.map((group) => (
                        <section key={group.id} aria-labelledby={`morse-chart-${group.id}`}>
                            <h3 id={`morse-chart-${group.id}`} className="mb-2 text-sm font-semibold">
                                {group.name}
                            </h3>
                            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                                {group.items.map(([character, code]) => (
                                    <li key={character} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5">
                                        <span className="font-semibold">{character}</span>
                                        <code className="font-mono text-sm tracking-widest">{code}</code>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </ToolPanel>
        </div>
    )
}
