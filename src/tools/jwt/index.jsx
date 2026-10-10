import { useMemo, useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import useNow from '../../hooks/useNow.js'
import TokenInfo from './TokenInfo.jsx'
import { createExampleToken, decodeJwt, getTokenInfo, isUnsigned } from './jwt.js'

const INPUT_ID = 'jwt-input'
const ERROR_ID = 'jwt-error'

function signatureNote(token) {
    if (isUnsigned(token)) {
        return 'This token has no signature. Anyone can create a token like this, so it proves nothing about who issued it.'
    }
    if (token.signature.length === null) {
        return 'The signature is not valid Base64URL, so the token may be damaged or cut off.'
    }
    return `${token.signature.length} bytes. Devora does not verify signatures, so this value is shown as it appears in the token and has not been checked.`
}

export default function JwtTool() {
    const [input, setInput] = useState('')
    const now = useNow()

    const result = useMemo(() => decodeJwt(input), [input])
    const token = result.ok ? result.token : null
    const error = result.ok ? '' : result.error
    const info = useMemo(() => (token ? getTokenInfo(token, now) : null), [token, now])

    return (
        <div className="grid gap-4">
            <ToolPanel
                title="Token"
                actions={
                    <>
                        <ExampleButton onClick={() => setInput(createExampleToken())} />
                        <ClearButton onClick={() => setInput('')} disabled={input === ''} />
                    </>
                }
            >
                <label htmlFor={INPUT_ID} className="sr-only">
                    JWT to decode
                </label>
                <textarea
                    id={INPUT_ID}
                    className="field field-mono"
                    rows={6}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Paste a JWT, e.g. eyJhbGciOiJIUzI1NiIs…"
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? ERROR_ID : undefined}
                />
                {error && (
                    <p id={ERROR_ID} role="alert" className="mt-2 text-sm text-danger">
                        {error}
                    </p>
                )}
            </ToolPanel>

            {token && info && (
                <>
                    <div role="note" className="card flex gap-3">
                        <ShieldAlert className="mt-0.5 shrink-0 text-[var(--star)]" size={20} aria-hidden="true" />
                        <div>
                            <p className="font-semibold">Decoded, not verified</p>
                            <p className="text-sm text-fg-muted">
                                Anyone can create a JWT with any contents. Devora does not check the signature, so
                                nothing shown here proves the token is genuine or trustworthy.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                        <ToolPanel
                            title="Header"
                            actions={<CopyButton text={token.headerText} label="Copy header" />}
                        >
                            <pre className="code-block">{token.headerText}</pre>
                        </ToolPanel>

                        <ToolPanel
                            title="Payload"
                            actions={<CopyButton text={token.payloadText} label="Copy payload" />}
                        >
                            <pre className="code-block">{token.payloadText}</pre>
                        </ToolPanel>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                        <ToolPanel title="Token information">
                            <TokenInfo info={info} />
                        </ToolPanel>

                        <ToolPanel
                            title="Signature"
                            actions={
                                <CopyButton
                                    text={token.signature.text}
                                    label="Copy signature"
                                    disabled={token.signature.text === ''}
                                />
                            }
                        >
                            <pre className="code-block">{token.signature.text || '(empty)'}</pre>
                            <p className="mt-3 text-sm text-fg-muted">{signatureNote(token)}</p>
                        </ToolPanel>
                    </div>
                </>
            )}
        </div>
    )
}