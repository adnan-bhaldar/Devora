import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import { downloadBlob, formatBytes } from '../../utils/files.js'
import { createExampleDataUri, parseImageInput } from './image.js'

const INPUT_ID = 'base64-image-input'
const ERROR_ID = 'base64-image-error'

export default function Base64ToImage() {
    const [input, setInput] = useState('')
    // Remember which image the browser failed to show / measured, so stale results are ignored.
    const [failedUri, setFailedUri] = useState('')
    const [measured, setMeasured] = useState(null)

    const result = useMemo(() => parseImageInput(input), [input])
    const image = result.ok ? result.image : null
    const error = result.ok ? '' : result.error
    const previewFailed = image !== null && failedUri === image.dataUri
    const dimensions = image && measured?.uri === image.dataUri && measured.width > 0 ? measured : null

    const download = () => {
        downloadBlob(new Blob([image.bytes], { type: image.mime }), `decoded-image.${image.extension}`)
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Base64"
                actions={
                    <>
                        <ExampleButton onClick={() => setInput(createExampleDataUri())} />
                        <ClearButton onClick={() => setInput('')} disabled={input === ''} />
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
                    onChange={(event) => setInput(event.target.value)}
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
                    <Button variant="primary" onClick={download} disabled={!image || previewFailed}>
                        <Download size={16} aria-hidden="true" />
                        Download
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
                            onContextMenu={(e) => e.preventDefault()} 
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