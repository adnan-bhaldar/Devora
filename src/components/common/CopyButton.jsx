import { Check, Copy } from 'lucide-react'
import IconButton from '../ui/IconButton.jsx'
import useCopyToClipboard from '../../hooks/useCopyToClipboard.js'
import useToast from '../../hooks/useToast.js'

// Both variants are 44px squares so they line up with the text buttons beside them.
const VARIANT_CLASSES = {
    primary:
        'size-11 rounded-xl bg-[image:var(--grad)] text-[var(--accent-fg)] enabled:hover:brightness-110',
    secondary: 'size-11 rounded-xl border border-border bg-surface enabled:hover:bg-surface-2',
}

/*
 * Icon-only copy button. `label` is the accessible name and the tooltip ("Copy CSS");
 * after a successful copy the icon becomes a check mark and the tooltip shows `copiedLabel`.
 * Pass `icon` to use something other than the copy icon (e.g. a link icon for "Copy link").
 */
export default function CopyButton({
    text,
    label = 'Copy',
    copiedLabel = 'Copied',
    icon = Copy,
    variant = 'secondary',
    disabled = false,
}) {
    const { copied, copy } = useCopyToClipboard()
    const toast = useToast()

    const handleClick = async () => {
        const ok = await copy(text)
        if (!ok) toast.error('Could not access the clipboard. Select the text and copy it manually.')
    }

    const Icon = copied ? Check : icon

    return (
        <>
            <IconButton
                label={label}
                data-tip={copied ? copiedLabel : label}
                onClick={handleClick}
                disabled={disabled || !text}
                className={`${VARIANT_CLASSES[variant]} disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <Icon size={18} aria-hidden="true" />
            </IconButton>
            <span className="sr-only" role="status">
                {copied ? 'Copied to clipboard' : ''}
            </span>
        </>
    )
}