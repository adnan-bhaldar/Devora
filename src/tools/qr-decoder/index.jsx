import { useEffect, useRef, useState } from 'react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import FileDropZone from '../../components/common/FileDropZone.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import DecodedResult from './DecodedResult.jsx'
import { MAX_FILE_MB, createExampleFile, scanImageUrl } from './scan.js'

export default function QrDecoderTool() {
    const [source, setSource] = useState(null) // { name, url } of the image being shown
    const [outcome, setOutcome] = useState(null) // null, or the result of the last scan
    const [busy, setBusy] = useState(false)

    // Each scan gets a number, so a slow earlier scan can't overwrite a newer one.
    const requestId = useRef(0)
    // The blob URL of the current preview, kept so it can be released when replaced or on exit.
    const urlHolder = useRef({ url: '' })
    const figureRef = useRef(null)

    useEffect(() => {
        const holder = urlHolder.current
        return () => {
            if (holder.url) URL.revokeObjectURL(holder.url)
        }
    }, [])

    // When the drop zone disappears, move focus to the preview so keyboard users aren't lost.
    useEffect(() => {
        if (source) figureRef.current?.focus({ preventScroll: true })
    }, [source])

    const releaseUrl = () => {
        if (urlHolder.current.url) URL.revokeObjectURL(urlHolder.current.url)
        urlHolder.current.url = ''
    }

    const scanFile = async (file) => {
        requestId.current += 1
        const id = requestId.current

        releaseUrl()
        const url = URL.createObjectURL(file)
        urlHolder.current.url = url

        setSource({ name: file.name, url })
        setOutcome(null)
        setBusy(true)

        // scanImageUrl always resolves (it never throws), so busy is always cleared below.
        const result = await scanImageUrl(url, { isSvg: file.type === 'image/svg+xml' })
        if (id !== requestId.current) return

        setOutcome(result)
        setBusy(false)
    }

    const clear = () => {
        requestId.current += 1
        releaseUrl()
        setSource(null)
        setOutcome(null)
        setBusy(false)
    }

    // The drop zone is hidden while an image is being read or has been read successfully.
    // It shows when there is no image yet, or when the last one failed, so another can be tried.
    const showDropZone = !source || outcome?.ok === false

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Image"
                actions={
                    <>
                        <ExampleButton onClick={() => scanFile(createExampleFile())} />
                        <ClearButton onClick={clear} disabled={!source} />
                    </>
                }
            >
                <div className="grid gap-4">
                    {showDropZone && (
                        <FileDropZone
                            accept={['image/*']}
                            maxSizeMB={MAX_FILE_MB}
                            onFiles={([file]) => scanFile(file)}
                            title="Drop an image with a QR code here, or click to browse"
                            hint={`Any image type your browser can open · up to ${MAX_FILE_MB} MB`}
                        />
                    )}

                    {source && (
                        // Focus lands here after a scan starts. The global focus-visible style draws
                        // the ring, which browsers show for keyboard use and usually hide for mouse use.
                        <figure ref={figureRef} tabIndex={-1} className="grid gap-2 rounded-lg">
                            <img
                                src={source.url}
                                alt={`Preview of ${source.name}`}
                                className="mx-auto max-h-72 max-w-full rounded-lg border border-border bg-white object-contain"
                                draggable={false}
                            />
                            <figcaption className="text-sm text-fg-muted">
                                <span className="font-medium text-fg">{source.name}</span>
                            </figcaption>
                        </figure>
                    )}
                </div>
            </ToolPanel>

            <ToolPanel
                title="Result"
                actions={
                    outcome?.ok && <CopyButton text={outcome.result.text} label="Copy result" variant="primary" />
                }
            >
                {busy && (
                    <p role="status" className="text-sm text-fg-muted">
                        Reading the image…
                    </p>
                )}

                {outcome?.ok && <DecodedResult result={outcome.result} />}

                {outcome && !outcome.ok && (
                    <p role="alert" className="text-sm text-danger">
                        {outcome.error}
                    </p>
                )}

                {!busy && !outcome && (
                    <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border px-4 text-center text-sm text-fg-muted">
                        The decoded text appears here
                    </div>
                )}
            </ToolPanel>
        </div>
    )
}