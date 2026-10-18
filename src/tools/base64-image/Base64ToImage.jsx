import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import RangeField from '../../components/ui/RangeField.jsx'
import { downloadBlob, formatBytes } from '../../utils/files.js'
import {
    convertImage,
    createExampleDataUri,
    DEFAULT_QUALITY,
    DOWNLOAD_FORMATS,
    LOSSY_FORMATS,
    parseImageInput,
} from './image.js'

const INPUT_ID = 'base64-image-input'
const ERROR_ID = 'base64-image-error'
const QUALITY_ID = 'base64-image-quality'

export default function Base64ToImage() {
    const [input, setInput] = useState('')
    // Remember which image the browser failed to show / measured, so stale results are ignored.
    const [failedUri, setFailedUri] = useState('')
    const [measured, setMeasured] = useState(null)
    const [downloadFormat, setDownloadFormat] = useState('original')
    const [quality, setQuality] = useState(DEFAULT_QUALITY)
    const [converting, setConverting] = useState(false)
    const [downloadError, setDownloadError] = useState('')

    const result = useMemo(() => parseImageInput(input), [input])
    const image = result.ok ? result.image : null
    const error = result.ok ? '' : result.error
    const previewFailed = image !== null && failedUri === image.dataUri
    const dimensions = image && measured?.uri === image.dataUri && measured.width > 0 ? measured : null

    const isLossy = LOSSY_FORMATS.includes(downloadFormat)

    const changeInput = (value) => {
        setInput(value)
        setDownloadError('')
    }

    const download = async () => {
        setConverting(true)
        setDownloadError('')

        // "finally" runs whether the conversion worked or threw, so the button can never get
        // stuck on "Converting…".
        try {
            const result = await convertImage(image, downloadFormat, quality)
            if (!result.ok) {
                setDownloadError(result.error)
                return
            }
            downloadBlob(result.blob, `decoded-image.${result.extension}`)
        } catch {
            setDownloadError('Something went wrong while converting the image. Please try again.')
        } finally {
            setConverting(false)
        }
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Base64"
                actions={
                    <>
                        <ExampleButton onClick={() => changeInput(createExampleDataUri())} />
                        <ClearButton onClick={() => changeInput('')} disabled={input === ''} />
                    </>
                }
            >
                <label htmlFor={INPUT_ID} className="sr-only">
                    Base64 or data URI of an image
                </label>
                <textarea
                    id={INPUT_ID}
                    className="field field-mono"
                    rows={10}
                    value={input}
                    onChange={(event) => changeInput(event.target.value)}
                    placeholder="Paste a data URI (data:image/png;base64,…) or raw Base64…"
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
                title="Image"
                actions={
                    <Button variant="primary" onClick={download} disabled={!image || previewFailed || converting}>
                        <Download size={16} aria-hidden="true" />
                        {converting ? 'Converting…' : 'Download'}
                    </Button>
                }
            >
                {image && !previewFailed && (
                    <figure className="grid gap-3">
                        <img
                            src={image.dataUri}
                            alt="Decoded image"
                            className="mx-auto max-h-80 max-w-full rounded-lg border border-border bg-surface-2 object-contain"
                            onError={() => setFailedUri(image.dataUri)}
                            draggable={false}
                            onLoad={(event) =>
                                setMeasured({
                                    uri: image.dataUri,
                                    width: event.currentTarget.naturalWidth,
                                    height: event.currentTarget.naturalHeight,
                                })
                            }
                        />
                        <figcaption className="text-sm text-fg-muted">
                            {image.label} · {formatBytes(image.size)}
                            {dimensions && ` · ${dimensions.width} × ${dimensions.height} px`}
                        </figcaption>
                    </figure>
                )}

                {image && !previewFailed && (
                    <div className="mt-5 grid gap-4 border-t border-border pt-4">
                        <ChoiceGroup
                            label="Download as"
                            options={DOWNLOAD_FORMATS.map((format) =>
                                format.value === 'original'
                                    ? { ...format, label: `Original (${image.label})` }
                                    : format,
                            )}
                            value={downloadFormat}
                            onChange={(value) => {
                                setDownloadFormat(value)
                                setDownloadError('')
                            }}
                        />
                        {isLossy && (
                            <RangeField
                                id={QUALITY_ID}
                                label="Quality"
                                hint="Lower quality makes a smaller file with less detail."
                                min={1}
                                max={100}
                                value={quality}
                                onChange={setQuality}
                            />
                        )}
                        {downloadFormat === 'jpeg' && (
                            <p className="text-sm text-fg-muted">
                                JPG cannot store transparency, so transparent areas become white.
                            </p>
                        )}
                        {downloadError && (
                            <p role="alert" className="text-sm text-danger">
                                {downloadError}
                            </p>
                        )}
                    </div>
                )}

                {previewFailed && (
                    <p role="alert" className="text-sm text-danger">
                        The data looks like {image.label}, but the browser could not display it. It may be
                        damaged or incomplete.
                    </p>
                )}

                {!image && (
                    <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-border px-4 text-center text-sm text-fg-muted">
                        The decoded image appears here
                    </div>
                )}
            </ToolPanel>
        </div>
    )
}