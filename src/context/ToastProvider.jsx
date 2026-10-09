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

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-viewport" role="region" aria-label="Notifications" aria-live="polite">
                {toasts.map((toast) => {
                    const Icon = ICONS[toast.type]
                    return (
                        <div
                            key={toast.id}
                            className="toast"
                            data-type={toast.type}
                            role={toast.type === 'error' ? 'alert' : undefined}
                        >
                            <Icon size={18} aria-hidden="true" />
                            <p>{toast.message}</p>
                            <IconButton label="Dismiss notification" tooltip={false} onClick={() => dismiss(toast.id)}>
                                <X size={16} aria-hidden="true" />
                            </IconButton>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}