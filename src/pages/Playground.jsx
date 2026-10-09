import { useState } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import ClearButton from '../components/common/ClearButton.jsx'
import CopyButton from '../components/common/CopyButton.jsx'
import ExampleButton from '../components/common/ExampleButton.jsx'
import FileDropZone from '../components/common/FileDropZone.jsx'
import ResetButton from '../components/common/ResetButton.jsx'
import ToolDocs from '../components/tools/ToolDocs.jsx'
import ToolPanel from '../components/tools/ToolPanel.jsx'
import Button from '../components/ui/Button.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import useToast from '../hooks/useToast.js'
import { formatBytes } from '../utils/files.js'

const sampleDocs = {
    about: 'This is a sample documentation block. Each tool supplies its own content in this shape.',
    howItWorks: ['The tool reads the input.', 'It processes the input in the browser.', 'It shows the result.'],
    example: { input: 'Hello', output: 'SGVsbG8=' },
    notes: ['Sample note one.', 'Sample note two.'],
    privacy: 'Sample privacy text. Real tools only describe what their implementation actually does.',
}

export default function Playground() {
    usePageMeta({ title: 'Component playground' })
    const toast = useToast()
    const [text, setText] = useState('')
    const [file, setFile] = useState(null)

    return (
        <div className="container-page page">
            <PageHeader
                title="Component playground"
                description="Development only. This page is not included in production builds."
            />

            <div className="tool-stack">
                <ToolPanel
                    title="Text and actions"
                    actions={
                        <>
                            <ExampleButton onClick={() => setText('Hello, Devora!')} />
                            <ClearButton onClick={() => setText('')} disabled={!text} />
                            <ResetButton onClick={() => setText('Default value')} />
                        </>
                    }
                >
                    <label htmlFor="playground-text" className="sr-only">
                        Sample text
                    </label>
                    <textarea
                        id="playground-text"
                        className="field field-mono"
                        rows={4}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="Type something…"
                    />
                    <div className="mt-3">
                        <CopyButton text={text} />
                    </div>
                </ToolPanel>

                <ToolPanel title="File drop zone" actions={<ClearButton onClick={() => setFile(null)} disabled={!file} />}>
                    <FileDropZone
                        accept={['image/*']}
                        maxSizeMB={5}
                        hint="Images only, up to 5 MB"
                        onFiles={(files) => setFile(files[0])}
                    />
                    {file && (
                        <p className="mt-3 text-sm text-fg-muted">
                            Selected: {file.name} ({formatBytes(file.size)})
                        </p>
                    )}
                </ToolPanel>

                <ToolPanel title="Toasts">
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => toast.success('Saved successfully')}>Success toast</Button>
                        <Button onClick={() => toast.error('Something needs your attention')}>Error toast</Button>
                        <Button onClick={() => toast.info('Just letting you know')}>Info toast</Button>
                    </div>
                </ToolPanel>
            </div>

            <ToolDocs docs={sampleDocs} />
        </div>
    )
}