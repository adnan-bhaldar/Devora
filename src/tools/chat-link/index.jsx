import { useMemo, useState } from 'react'
import { Download, ExternalLink } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import Field from '../../components/ui/Field.jsx'
import useToast from '../../hooks/useToast.js'
import { downloadBlob } from '../../utils/files.js'
import { buildSvg, generateQr, renderPngBlob } from '../qr-generator/qr.js'
import { APPS, EXAMPLES, MAX_MESSAGE_LENGTH, TELEGRAM_MODES, buildLink } from './links.js'

const IDS = {
    phone: 'chat-link-phone',
    username: 'chat-link-username',
    url: 'chat-link-url',
    message: 'chat-link-message',
    error: 'chat-link-error',
    link: 'chat-link-output',
}

// A QR code for a link is always made the same way: black on white, medium error correction.
const QR_STYLE = { foreground: '#000000', background: '#ffffff' }
const QR_SIZE = 512

export default function ChatLinkTool() {
    const toast = useToast()
    const [app, setApp] = useState('whatsapp')
    const [telegramMode, setTelegramMode] = useState('username')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')
    const [url, setUrl] = useState('')
    const [message, setMessage] = useState('')

    const mode = app === 'whatsapp' ? 'whatsapp' : telegramMode
    const appName = APPS.find((option) => option.value === app).label

    const result = useMemo(
        () => buildLink({ mode, phone, username, url, message }),
        [mode, phone, username, url, message],
    )
    const link = result.ok ? result.link : ''
    const error = result.ok ? '' : result.error
    const messageTooLong = message.trim().length > MAX_MESSAGE_LENGTH
    // Which box the error belongs to, so a screen reader announces it with that box.
    const errorField = !error ? null : messageTooLong ? 'message' : mode === 'share' ? 'url' : mode === 'username' ? 'username' : 'phone'

    const qrResult = useMemo(() => (link ? generateQr(link, { errorLevel: 'M', margin: 4 }) : { ok: true, qr: null }), [link])
    const qr = qrResult.ok ? qrResult.qr : null
    const qrError = qrResult.ok ? '' : qrResult.error

    const svg = useMemo(() => (qr ? buildSvg(qr.matrix, { ...QR_STYLE, size: QR_SIZE }) : ''), [qr])
    const svgUrl = svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : ''

    const fileName = `${app}-qr-code`
    const downloadSvg = () => downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `${fileName}.svg`)
    const downloadPng = async () => {
        const blob = await renderPngBlob(qr.matrix, { ...QR_STYLE, minSize: QR_SIZE })
        if (blob) downloadBlob(blob, `${fileName}.png`)
        else toast.error('The PNG file could not be created. Try the SVG download instead.')
    }

    const fillExample = () => {
        const example = EXAMPLES[mode === 'whatsapp' ? 'whatsapp' : mode === 'share' ? 'share' : 'telegram']
        setMessage(example.message)
        if (mode === 'whatsapp') setPhone(example.phone)
        if (mode === 'username') setUsername(example.username)
        if (mode === 'phone') setPhone(EXAMPLES.whatsapp.phone)
        if (mode === 'share') setUrl(example.url)
    }

    const clearAll = () => {
        setPhone('')
        setUsername('')
        setUrl('')
        setMessage('')
    }

    const invalidProps = (field) => ({
        'aria-invalid': errorField === field,
        'aria-describedby': errorField === field ? IDS.error : undefined,
    })

    const hasInput = phone !== '' || username !== '' || url !== '' || message !== ''

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Details"
                className="lg:col-start-1 lg:row-start-1"
                actions={
                    <>
                        <ExampleButton onClick={fillExample} />
                        <ClearButton onClick={clearAll} disabled={!hasInput} />
                    </>
                }
            >
                <div className="grid gap-5">
                    <ChoiceGroup label="App" options={APPS} value={app} onChange={setApp} />

                    {app === 'telegram' && (
                        <ChoiceGroup label="Link type" options={TELEGRAM_MODES} value={telegramMode} onChange={setTelegramMode} />
                    )}

                    {(mode === 'whatsapp' || mode === 'phone') && (
                        <Field
                            label={mode === 'whatsapp' ? 'Phone number (optional)' : 'Phone number'}
                            htmlFor={IDS.phone}
                            hint={
                                mode === 'whatsapp'
                                    ? 'With the country code, for example +44 7700 900123. Leave it empty to let people choose who to send the message to.'
                                    : 'With the country code, for example +44 7700 900123. The person must have Telegram and allow people to find them by number.'
                            }
                        >
                            <input
                                id={IDS.phone}
                                type="tel"
                                inputMode="tel"
                                autoComplete="off"
                                className="field"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                placeholder="+44 7700 900123"
                                {...invalidProps('phone')}
                            />
                        </Field>
                    )}

                    {mode === 'username' && (
                        <Field label="Telegram username" htmlFor={IDS.username} hint="With or without the @, for example @telegram.">
                            <input
                                id={IDS.username}
                                type="text"
                                autoComplete="off"
                                autoCapitalize="off"
                                spellCheck={false}
                                className="field"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="@username"
                                {...invalidProps('username')}
                            />
                        </Field>
                    )}

                    {mode === 'share' && (
                        <Field label="Web address to share" htmlFor={IDS.url} hint="Telegram asks the person to pick a chat, then sends this address.">
                            <input
                                id={IDS.url}
                                type="url"
                                autoComplete="off"
                                spellCheck={false}
                                className="field"
                                value={url}
                                onChange={(event) => setUrl(event.target.value)}
                                placeholder="https://example.com"
                                {...invalidProps('url')}
                            />
                        </Field>
                    )}

                    <Field
                        label="Message (optional)"
                        htmlFor={IDS.message}
                        hint={
                            mode === 'phone' || mode === 'username'
                                ? 'Appears ready to send in the chat box. The person still has to press send.'
                                : 'Appears ready to send. The person still has to press send.'
                        }
                    >
                        <textarea
                            id={IDS.message}
                            className="field"
                            rows={4}
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Hi! I have a question about…"
                            {...invalidProps('message')}
                        />
                    </Field>

                    {error && (
                        <p id={IDS.error} role="alert" className="text-sm text-danger">
                            {error}
                        </p>
                    )}
                </div>
            </ToolPanel>

            <ToolPanel
                title="Link and QR code"
                className="lg:sticky lg:top-20 lg:col-start-2 lg:row-span-1 lg:row-start-1"
                actions={
                    link && (
                        <>
                            <CopyButton text={link} label="Copy link" copiedLabel="Link copied" />
                            <a
                                className="btn btn-secondary"
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink size={16} aria-hidden="true" />
                                Open link
                                <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                        </>
                    )
                }
            >
                <div className="grid gap-4">
                    <div>
                        <label htmlFor={IDS.link} className="mb-1.5 block text-sm font-medium">
                            {appName} link
                        </label>
                        <textarea
                            id={IDS.link}
                            className="field field-mono"
                            rows={3}
                            value={link}
                            readOnly
                            spellCheck={false}
                            placeholder="Your link appears here"
                        />
                    </div>

                    {qr ? (
                        <figure className="grid gap-3">
                            <img
                                src={svgUrl}
                                alt={`QR code that opens the ${appName} link`}
                                className="mx-auto aspect-square w-full max-w-xs rounded-lg border border-border"
                                draggable={false}
                            />
                            <figcaption className="flex flex-wrap justify-center gap-2">
                                <Button variant="primary" onClick={downloadPng}>
                                    <Download size={16} aria-hidden="true" />
                                    Download PNG
                                </Button>
                                <Button onClick={downloadSvg}>
                                    <Download size={16} aria-hidden="true" />
                                    Download SVG
                                </Button>
                            </figcaption>
                        </figure>
                    ) : (
                        <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-border px-4 text-center text-sm text-fg-muted sm:mx-auto">
                            {error || qrError ? 'No QR code could be made' : 'Your QR code appears here'}
                        </div>
                    )}

                    {qrError && (
                        <p role="alert" className="text-sm text-danger">
                            {qrError}
                        </p>
                    )}
                </div>
            </ToolPanel>
        </div>
    )
}