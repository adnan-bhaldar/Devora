import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import useToast from '../../hooks/useToast.js'
import { downloadBlob } from '../../utils/files.js'
import QrOptions from './QrOptions.jsx'
import {
    DEFAULT_SETTINGS,
    EXAMPLE_TEXT,
    buildSvg,
    generateQr,
    getColorWarning,
    getPngSize,
    isDefaultSettings,
    modulesPerSide,
    renderPngBlob,
} from './qr.js'

const INPUT_ID = 'qr-input'
const ERROR_ID = 'qr-error'

export default function QrGeneratorTool() {
    const toast = useToast()
    const [text, setText] = useState('')
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    const { errorLevel, margin, size, foreground, background } = settings

    const content = text.trim()

    // Everything below is derived from the text and settings, so it needs no state of its own.
    const result = useMemo(() => generateQr(content, { errorLevel, margin }), [content, errorLevel, margin])
    const qr = result.ok ? result.qr : null
    const error = result.ok ? '' : result.error

    const svg = useMemo(
        () => (qr ? buildSvg(qr.matrix, { foreground, background, size }) : ''),
        [qr, foreground, background, size],
    )
    const svgUrl = svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : ''
    const colorWarning = getColorWarning(foreground, background)

    const updateSettings = (patch) => setSettings((current) => ({ ...current, ...patch }))

    const downloadSvg = () => {
        downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'qr-code.svg')
    }

    const downloadPng = async () => {
        const blob = await renderPngBlob(qr.matrix, { foreground, background, minSize: size })
        if (blob) {
            downloadBlob(blob, 'qr-code.png')
        } else {
            toast.error('The PNG file could not be created. Try the SVG download instead.')
        }
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Content"
                className="lg:col-start-1 lg:row-start-1"
                actions={
                    <>
                        <ExampleButton onClick={() => setText(EXAMPLE_TEXT)} />
                        <ClearButton onClick={() => setText('')} disabled={text === ''} />
                    </>
                }
            >
                <label htmlFor={INPUT_ID} className="sr-only">
                    Text or URL to turn into a QR code
                </label>
                <textarea
                    id={INPUT_ID}
                    className="field"
                    rows={5}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Type or paste text or a URL…"
                    spellCheck={false}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? ERROR_ID : undefined}
                />
                {error && (
                    <p id={ERROR_ID} role="alert" className="mt-2 text-sm text-danger">
                        {error}
                    </p>
                )}
            </ToolPanel>

            <ToolPanel
                title="QR code"
                className="lg:sticky lg:top-20 lg:col-start-2 lg:row-span-2 lg:row-start-1"
                actions={
                    qr && (
                        <>
                            <Button variant="primary" onClick={downloadPng}>
                                <Download size={16} aria-hidden="true" />
                                Download PNG
                            </Button>
                            <Button onClick={downloadSvg}>
                                <Download size={16} aria-hidden="true" />
                                Download SVG
                            </Button>
                            <CopyButton text={svg} label="Copy SVG code" />
                        </>
                    )
                }
            >
                {qr ? (
                    <figure className="grid gap-3">
                        <img
                            src={svgUrl}
                            alt="QR code for the text you entered"
                            className="mx-auto aspect-square w-full max-w-sm rounded-lg border border-border"
                        />
                        <figcaption className="text-center text-sm text-fg-muted">
                            Version {qr.version} ({modulesPerSide(qr.version)} × {modulesPerSide(qr.version)}{' '}
                            modules) · PNG {getPngSize(qr.matrix, size)} × {getPngSize(qr.matrix, size)} px
                        </figcaption>
                    </figure>
                ) : (
                    <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-xl border border-dashed border-border px-4 text-center text-sm text-fg-muted sm:mx-auto">
                        {error ? 'No QR code could be made' : 'Your QR code appears here'}
                    </div>
                )}
            </ToolPanel>

            <ToolPanel
                title="Options"
                className="lg:col-start-1 lg:row-start-2"
                actions={<ResetButton onClick={() => setSettings(DEFAULT_SETTINGS)} disabled={isDefaultSettings(settings)} />}
            >
                <QrOptions settings={settings} colorWarning={colorWarning} onChange={updateSettings} />
            </ToolPanel>
        </div>
    )
}