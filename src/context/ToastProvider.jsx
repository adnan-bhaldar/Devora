import { useCallback, useMemo, useRef, useState } from 'react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { ToastContext } from './toastContext.js'
import IconButton from '../components/ui/IconButton.jsx'

const ICONS = { success: CircleCheck, error: CircleAlert, info: Info }
const DURATIONS = { success: 2500, info: 3000, error: 6000 }
const MAX_VISIBLE = 3

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const nextId = useRef(0)

    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const show = useCallback(
        (message, type) => {
            const id = nextId.current++
            setToasts((current) => [...current, { id, message, type }].slice(-MAX_VISIBLE))
            window.setTimeout(() => dismiss(id), DURATIONS[type])
        },
        [dismiss],
    )

    const value = useMemo(
        () => ({
            info: (message) => show(message, 'info'),
            success: (message) => show(message, 'success'),
            error: (message) => show(message, 'error'),
        }),
        [show],
    )

    const renderToast = (toast) => {
        const Icon = ICONS[toast.type]
        return (
            <div key={toast.id} className="toast" data-type={toast.type}>
                <Icon size={18} aria-hidden="true" />
                <p>{toast.message}</p>
                <IconButton label="Dismiss notification" tooltip={false} onClick={() => dismiss(toast.id)}>
                    <X size={16} aria-hidden="true" />
                </IconButton>
            </div>
        )
    }

    const politeToasts = toasts.filter((toast) => toast.type !== 'error')
    const errorToasts = toasts.filter((toast) => toast.type === 'error')

    /*
     * Two always-mounted live regions (screen readers only announce changes to regions
     * that already exist): polite for success/info, assertive for errors. Errors don't
     * also use role="alert", so each message is announced exactly once.
     */
    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-viewport gap-0" role="region" aria-label="Notifications">
                <div className="flex flex-col gap-2" aria-live="polite">
                    {politeToasts.map(renderToast)}
                </div>
                <div className="flex flex-col gap-2 [&:not(:empty)]:mt-2" aria-live="assertive">
                    {errorToasts.map(renderToast)}
                </div>
            </div>
        </ToastContext.Provider>
    )
}