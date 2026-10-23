import { useEffect, useId, useMemo, useState } from 'react'
import { Download, Link2, X } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import FileDropZone from '../../components/common/FileDropZone.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import RangeField from '../../components/ui/RangeField.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import useToast from '../../hooks/useToast.js'
import { downloadBlob, formatBytes } from '../../utils/files.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import {
    ADJUST,
    CHARSETS,
    EXAMPLE_TEXT,
    FILLS,
    FONTS,
    LAYOUTS,
    MAX_FILE_MB,
    MAX_TEXT,
    WIDTH,
    loadFont,
    pixelsToAscii,
    renderText,
} from './ascii.js'
import { openImage, samplePixels } from './image.js'
import { DEFAULT_SETTINGS, MODES, SIZES, isDefaultSettings } from './settings.js'
import { readSharedSettings, toShareQuery } from './share.js'

const TEXT_ID = 'ascii-text'
const SIZE_CHOICES = SIZES.map((item) => ({ value: item.value, label: item.label }))
const CHARSET_CHOICES = CHARSETS.map((item) => ({ value: item.value, label: item.label }))

export default function AsciiArtTool() {
    // A shared link can set the choices (never text or pictures). They are read once, then removed from the address.
    const params = useInitialParams()
    const toast = useToast()
    const ids = { width: useId(), contrast: useId(), brightness: useId() }
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    const [text, setText] = useState('')
    const [picture, setPicture] = useState(null) // { name, size, bitmap }
    const [pictureError, setPictureError] = useState('')
    const [textArt, setTextArt] = useState({ art: '', error: '' })
    const update = (changes) => setSettings((current) => ({ ...current, ...changes }))

    // ---- text mode ----
    const { font, layout, fill, mode } = settings
    useEffect(() => {
        if (mode !== 'text') return undefined
        let cancelled = false
        if (text.trim() === '') {
            // Nothing to draw. Done in a callback so state is not set while the effect runs.
            Promise.resolve().then(() => !cancelled && setTextArt({ art: '', error: '' }))
            return () => {
                cancelled = true
            }
        }
        loadFont(font)
            .then(() => {
                if (cancelled) return
                try {
                    setTextArt({ art: renderText(text, { font, layout, fill }), error: '' })
                } catch {
                    setTextArt({ art: '', error: 'This text could not be drawn with that font. Try another font or shorter text.' })
                }
            })
            .catch(() => {
                if (!cancelled) setTextArt({ art: '', error: 'The font could not be loaded. Check your connection and try again.' })
            })
        return () => {
            cancelled = true
        }
    }, [mode, text, font, layout, fill])

    // ---- image mode ----
    // The decoded picture is released when it is replaced or the tool closes.
    useEffect(() => {
        const bitmap = picture?.bitmap
        return () => bitmap?.close()
    }, [picture])

    const loadPicture = async (file) => {
        setPictureError('')
        try {
            const bitmap = await openImage(file)
            setPicture({ name: file.name, size: file.size, bitmap })
        } catch (error) {
            setPictureError(error.message)
        }
    }

    const imageArt = useMemo(() => {
        if (mode !== 'image' || !picture) return ''
        const { data, rows } = samplePixels(picture.bitmap, settings.columns)
        return pixelsToAscii(data, settings.columns, rows, settings)
    }, [mode, picture, settings])

    const art = mode === 'text' ? textArt.art : imageArt
    const lines = art === '' ? [] : art.split('\n')
    const widest = lines.reduce((most, line) => Math.max(most, [...line].length), 0)

    const download = () => {
        downloadBlob(new Blob([`${art}\n`], { type: 'text/plain;charset=utf-8' }), 'ascii-art.txt')
        toast.success('Downloaded ascii-art.txt')
    }

    const reset = () => setSettings(DEFAULT_SETTINGS)
    const shareUrl = buildShareUrl(toShareQuery(settings))

    return (
        <div className="dd-stack tip-end gap-4">
            <ToolPanel title="Input" actions={mode === 'text' ? <><ExampleButton onClick={() => setText(EXAMPLE_TEXT)} /><ClearButton onClick={() => setText('')} disabled={text === ''} /></> : undefined}>
                <div className="grid gap-4">
                    <ChoiceGroup label="Mode" options={MODES} value={mode} onChange={(next) => update({ mode: next })} />

                    {mode === 'text' ? (
                        <div>
                            <label htmlFor={TEXT_ID} className="mb-1.5 block text-sm font-medium">
                                Text
                            </label>
                            <textarea
                                id={TEXT_ID}
                                className="field"
                                rows={3}
                                maxLength={MAX_TEXT}
                                value={text}
                                onChange={(event) => setText(event.target.value)}
                                placeholder="Type a word or a short line"
                                spellCheck={false}
                            />
                            <p className="mt-1.5 text-sm text-fg-muted">
                                {text.length} of {MAX_TEXT} characters. Each line is drawn on its own.
                            </p>
                        </div>
                    ) : picture ? (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3">
                            <p className="min-w-0 break-words text-sm">
                                <span className="font-medium">{picture.name}</span>
                                <span className="text-fg-muted">
                                    {' '}· {picture.bitmap.width} × {picture.bitmap.height} px · {formatBytes(picture.size)}
                                </span>
                            </p>
                            <Button variant="ghost" onClick={() => setPicture(null)}>
                                <X size={16} aria-hidden="true" />
                                Remove picture
                            </Button>
                        </div>
                    ) : (
                        <FileDropZone
                            accept={['image/*']}
                            maxSizeMB={MAX_FILE_MB}
                            onFiles={([file]) => loadPicture(file)}
                            title="Drop a picture here, or click to browse"
                            hint={`PNG, JPG, WebP, or GIF · up to ${MAX_FILE_MB} MB`}
                        />
                    )}
                    {pictureError && mode === 'image' && (
                        <p role="alert" className="text-sm text-danger">
                            {pictureError}
                        </p>
                    )}
                </div>
            </ToolPanel>

            <ToolPanel
                title="Options"
                actions={
                    <>
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                        <ResetButton onClick={reset} disabled={isDefaultSettings(settings)} />
                    </>
                }
            >
                {mode === 'text' ? (
                    <div className="grid gap-5">
                        <ChoiceGroup label="Font" options={FONTS} value={settings.font} onChange={(next) => update({ font: next })} />
                        <ChoiceGroup label="Fill" options={FILLS} value={settings.fill} onChange={(next) => update({ fill: next })} />
                        <ChoiceGroup label="Letter spacing" options={LAYOUTS} value={settings.layout} onChange={(next) => update({ layout: next })} />
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <RangeField id={ids.width} label="Width (characters)" min={WIDTH.min} max={WIDTH.max} value={settings.columns} onChange={(next) => update({ columns: next })} />
                            <RangeField id={ids.contrast} label="Contrast (%)" hint="100 is unchanged." min={ADJUST.min} max={ADJUST.max} value={settings.contrast} onChange={(next) => update({ contrast: next })} />
                            <RangeField id={ids.brightness} label="Brightness (%)" hint="100 is unchanged." min={ADJUST.min} max={ADJUST.max} value={settings.brightness} onChange={(next) => update({ brightness: next })} />
                        </div>
                        <ChoiceGroup label="Character set" options={CHARSET_CHOICES} value={settings.charset} onChange={(next) => update({ charset: next })} />
                        <Checkbox
                            label="Invert"
                            hint="Swaps dark and light. Use it when you will paste the art on a dark background."
                            checked={settings.invert}
                            onChange={(next) => update({ invert: next })}
                        />
                    </div>
                )}
            </ToolPanel>

            <ToolPanel
                title="Result"
                actions={
                    <>
                        <Button variant="secondary" onClick={download} disabled={art === ''}>
                            <Download size={16} aria-hidden="true" />
                            Download .txt
                        </Button>
                        <CopyButton text={art} label="Copy ASCII art" copiedLabel="Copied" variant="primary" />
                    </>
                }
            >
                {textArt.error && mode === 'text' && (
                    <p role="alert" className="mb-2 text-sm text-danger">
                        {textArt.error}
                    </p>
                )}
                {art === '' ? (
                    <p className="text-sm text-fg-muted">{mode === 'text' ? 'Your ASCII art appears here.' : 'Add a picture to see it drawn in characters.'}</p>
                ) : (
                    <>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-fg-muted" role="status">
                                {lines.length} lines · up to {widest} characters wide
                            </p>
                            <ChoiceGroup label="Text size" options={SIZE_CHOICES} value={settings.size} onChange={(next) => update({ size: next })} />
                        </div>
                        {/* tabIndex 0 lets keyboard users scroll wide art. */}
                        <pre
                            className="code-block ascii-art"
                            tabIndex={0}
                            aria-label="ASCII art result"
                            data-mode={mode}
                            style={{ fontSize: `${SIZES.find((item) => item.value === settings.size)?.[mode] ?? 1}rem` }}
                        >
                            {art}
                        </pre>
                    </>
                )}
            </ToolPanel>
        </div>
    )
}