import { useMemo, useRef, useState } from 'react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import FileDropZone from '../../components/common/FileDropZone.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import { formatBytes } from '../../utils/files.js'
import {
    ACCEPTED_FILES,
    DISPLAY_LIMIT,
    MAX_IMAGE_MB,
    OUTPUT_FORMATS,
    createExampleImage,
    readImageFile,
    toDataUri,
} from './image.js'

export default function ImageToBase64() {
    const [image, setImage] = useState(null)
    const [error, setError] = useState('')
    const [outputFormat, setOutputFormat] = useState('datauri')
    // Each read gets a number, so a slow earlier read can't overwrite a newer choice.
    const requestId = useRef(0)

    const dataUri = useMemo(() => (image ? toDataUri(image.mime, image.base64) : ''), [image])
    const output = outputFormat === 'datauri' ? dataUri : (image?.base64 ?? '')
    const isTruncated = output.length > DISPLAY_LIMIT
    const shown = isTruncated ? output.slice(0, DISPLAY_LIMIT) : output

    const handleFiles = async ([file]) => {
        requestId.current += 1
        const id = requestId.current

        const result = await readImageFile(file)
        if (id !== requestId.current) return

        if (result.ok) {
            setImage(result.image)
            setError('')
        } else {
            setError(result.error)
        }
    }

    const clear = () => {
        requestId.current += 1
        setImage(null)
        setError('')
    }

    const loadExample = () => {
        requestId.current += 1
        setImage(createExampleImage())
        setError('')
    }

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Image"
                actions={
                    <>
                        <ExampleButton onClick={loadExample} />
                        <ClearButton onClick={clear} disabled={!image && !error} />
                    </>
                }
            >
                <div className="grid gap-4">
                    <FileDropZone
                        accept={ACCEPTED_FILES}
                        maxSizeMB={MAX_IMAGE_MB}
                        onFiles={handleFiles}
                        title="Drop an image here, or click to browse"
                        hint={`PNG, JPEG, GIF, WebP, SVG, BMP, or AVIF · up to ${MAX_IMAGE_MB} MB`}
                    />

                    {error && (
                        <p role="alert" className="text-sm text-danger">
                            {error}
                        </p>
                    )}

                    {image && (
                        <figure className="grid gap-2">
                            <img
                                src={dataUri}
                                alt={`Preview of ${image.name}`}
                                className="mx-auto max-h-64 max-w-full rounded-lg border border-border bg-surface-2 object-contain"
                            />
                            <figcaption className="text-sm text-fg-muted">
                                <span className="font-medium text-fg">{image.name}</span> · {image.label} ·{' '}
                                {formatBytes(image.size)} · Base64 is {formatBytes(image.base64.length)}
                            </figcaption>
                        </figure>
                    )}
                </div>
            </ToolPanel>

            <ToolPanel
                title="Base64"
                actions={
                    <CopyButton
                        text={output}
                        label={outputFormat === 'datauri' ? 'Copy data URI' : 'Copy Base64'}
                        variant="primary"
                    />
                }
            >
                <div className="grid gap-4">
                    <ChoiceGroup
                        label="Output format"
                        options={OUTPUT_FORMATS}
                        value={outputFormat}
                        onChange={setOutputFormat}
                    />

                    <div>
                        <label htmlFor="base64-image-output" className="sr-only">
                            Base64 output
                        </label>
                        <textarea
                            id="base64-image-output"
                            className="field field-mono"
                            rows={10}
                            value={shown}
                            readOnly
                            placeholder="The Base64 appears here"
                            spellCheck={false}
                        />
                        {isTruncated && (
                            <p className="mt-2 text-sm text-fg-muted">
                                Showing the first {DISPLAY_LIMIT.toLocaleString()} of {output.length.toLocaleString()}{' '}
                                characters. The copy button copies all of it.
                            </p>
                        )}
                    </div>
                </div>
            </ToolPanel>
        </div>
    )
}