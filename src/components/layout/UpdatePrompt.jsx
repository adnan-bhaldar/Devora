import { useState, useSyncExternalStore } from 'react'
import { RefreshCw } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { applyUpdate, getWaitingWorker, subscribe } from '../../pwa/updateStore.js'

/**
 * Appears when a newer version of Devora has been downloaded in the background. It does not block the page
 * (a modal would trap someone who is in the middle of using a tool), and "Later" hides it until the next visit.
 * It is a status message, not a dialog: screen readers announce it, and keyboard focus stays where it was.
 */
export default function UpdatePrompt() {
    const waiting = useSyncExternalStore(subscribe, getWaitingWorker)
    const [dismissed, setDismissed] = useState(false)
    const [reloading, setReloading] = useState(false)

    if (!waiting || dismissed) return null

    return (
        <div
            className="update-prompt"
            role="status"
            onKeyDown={(event) => {
                if (event.key === 'Escape' && !reloading) setDismissed(true)
            }}
        >
            <span className="update-prompt__icon" aria-hidden="true">
                <RefreshCw size={18} />
            </span>
            <div className="update-prompt__body">
                <p className="update-prompt__title">
                    A new version of Devora is ready
                </p>
                <p className="update-prompt__text">
                    Reload to get the latest tools and fixes. Reloading clears anything you have typed into a tool.
                </p>
                <div className="update-prompt__actions">
                    <Button
                        variant="primary"
                        disabled={reloading}
                        onClick={() => {
                            setReloading(true)
                            applyUpdate()
                        }}
                    >
                        {reloading ? 'Reloading…' : 'Reload now'}
                    </Button>
                    <Button variant="ghost" disabled={reloading} onClick={() => setDismissed(true)}>
                        Later
                    </Button>
                </div>
            </div>
        </div>
    )
}