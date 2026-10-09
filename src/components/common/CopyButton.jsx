import { Check, Copy } from 'lucide-react'
import Button from '../ui/Button.jsx'
import useCopyToClipboard from '../../hooks/useCopyToClipboard.js'
import useToast from '../../hooks/useToast.js'

export default function CopyButton({
    text,
    label = 'Copy',
    copiedLabel = 'Copied',
    variant = 'secondary',
    disabled = false,
}) {
    const { copied, copy } = useCopyToClipboard()
    const toast = useToast()

    const handleClick = async () => {
        const ok = await copy(text)
        if (!ok) toast.error('Could not access the clipboard. Select the text and copy it manually.')
    }

    const Icon = copied ? Check : Copy

    return (
        <>
            <Button variant={variant} onClick={handleClick} disabled={disabled || !text}>
                <Icon size={16} aria-hidden="true" />
                {copied ? copiedLabel : label}
            </Button>
            <span className="sr-only" role="status">
                {copied ? 'Copied to clipboard' : ''}
            </span>
        </>
    )
}