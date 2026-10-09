import { useId, useState } from 'react'
import { Upload } from 'lucide-react'
import { validateFiles } from '../../utils/files.js'

export default function FileDropZone({
    onFiles,
    accept = [],
    maxSizeMB = 10,
    multiple = false,
    disabled = false,
    title = 'Drop a file here, or click to browse',
    hint,
}) {
    const [dragging, setDragging] = useState(false)
    const [error, setError] = useState('')
    const errorId = useId()

    const handleFiles = (fileList) => {
        const { valid, error: message } = validateFiles(Array.from(fileList), {
            accept,
            maxSizeBytes: maxSizeMB * 1024 * 1024,
            multiple,
        })
        setError(message)
        if (valid.length > 0) onFiles(valid)
    }

    const handleDragOver = (event) => {
        event.preventDefault()
        if (!disabled) setDragging(true)
    }

    const handleDragLeave = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false)
    }

    const handleDrop = (event) => {
        event.preventDefault()
        setDragging(false)
        if (!disabled) handleFiles(event.dataTransfer.files)
    }

    const handleChange = (event) => {
        handleFiles(event.target.files)
        // Reset so choosing the same file again still triggers onChange.
        event.target.value = ''
    }

    return (
        <div>
            {/* The label wraps a real (visually hidden) file input, so click, keyboard and screen readers all work. */}
            <label
                className="dropzone"
                data-dragging={dragging}
                data-disabled={disabled}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="sr-only"
                    accept={accept.join(',')}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={handleChange}
                    aria-describedby={error ? errorId : undefined}
                />
                <Upload size={22} aria-hidden="true" />
                <span className="font-medium text-fg">{title}</span>
                <span className="text-sm">{hint ?? `Maximum size ${maxSizeMB} MB`}</span>
            </label>
            {error && (
                <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
                    {error}
                </p>
            )}
        </div>
    )
}