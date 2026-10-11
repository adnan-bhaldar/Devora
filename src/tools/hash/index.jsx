import { useRef, useState } from 'react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import { ALGORITHMS, EXAMPLE_TEXT, FORMATS, computeDigest, formatDigest } from './hash.js'

const INPUT_ID = 'hash-input'
const OUTPUT_ID = 'hash-output'

export default function HashTool() {
    const [input, setInput] = useState('')
    const [algorithm, setAlgorithm] = useState('SHA-256')
    const [format, setFormat] = useState('hex')
    // The latest finished hash, together with the text and algorithm it was made from.
    const [outcome, setOutcome] = useState(null)
    // Each calculation gets a number, so a slow earlier one can't overwrite a newer one.
    const requestId = useRef(0)

    // Web Crypto hashing is asynchronous, so it runs from the event handlers (when the text or
    // algorithm changes) rather than from an effect.
    const calculate = async (text, algorithmName) => {
        requestId.current += 1
        const id = requestId.current

        if (text === '') {
            setOutcome(null)
            return
        }

        const result = await computeDigest(text, algorithmName)
        if (id !== requestId.current) return

        setOutcome({ ...result, text, algorithm: algorithmName })
    }

    const handleInputChange = (text) => {
        setInput(text)
        calculate(text, algorithm)
    }

    const handleAlgorithmChange = (algorithmName) => {
        setAlgorithm(algorithmName)
        calculate(input, algorithmName)
    }

    const clear = () => handleInputChange('')

    const output = outcome?.ok ? formatDigest(outcome.digest, format) : ''
    const error = outcome && !outcome.ok ? outcome.error : ''
    const resultBits = outcome?.ok
        ? ALGORITHMS.find((option) => option.value === outcome.algorithm).bits
        : 0
    // While a new hash is being calculated, the previous one is still on screen. It is only
    // copyable once it matches what is currently typed and selected.
    const isCurrent = outcome !== null && outcome.text === input && outcome.algorithm === algorithm

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <ToolPanel
                title="Input"
                actions={
                    <>
                        <ExampleButton onClick={() => handleInputChange(EXAMPLE_TEXT)} />
                        <ClearButton onClick={clear} disabled={input === ''} />
                    </>
                }
            >
                <div className="grid gap-4">
                    <ChoiceGroup
                        label="Algorithm"
                        options={ALGORITHMS}
                        value={algorithm}
                        onChange={handleAlgorithmChange}
                    />

                    <div>
                        <label htmlFor={INPUT_ID} className="sr-only">
                            Text to hash
                        </label>
                        <textarea
                            id={INPUT_ID}
                            className="field field-mono"
                            rows={8}
                            value={input}
                            onChange={(event) => handleInputChange(event.target.value)}
                            placeholder="Type or paste text to hash…"
                            spellCheck={false}
                        />
                        <p className="mt-2 text-sm text-fg-muted">
                            Every character counts, including spaces and line breaks.
                        </p>
                    </div>
                </div>
            </ToolPanel>

            <ToolPanel
                title="Hash"
                actions={<CopyButton text={isCurrent ? output : ''} label="Copy hash" variant="primary" />}
            >
                <div className="grid gap-4">
                    <ChoiceGroup label="Output format" options={FORMATS} value={format} onChange={setFormat} />

                    <div>
                        <label htmlFor={OUTPUT_ID} className="sr-only">
                            Hash result
                        </label>
                        <textarea
                            id={OUTPUT_ID}
                            className="field field-mono"
                            rows={4}
                            value={output}
                            readOnly
                            placeholder="The hash appears here"
                            spellCheck={false}
                        />
                        {outcome?.ok && (
                            <p className="mt-2 text-sm text-fg-muted">
                                {outcome.algorithm} · {resultBits}-bit hash · {outcome.inputBytes}{' '}
                                {outcome.inputBytes === 1 ? 'byte' : 'bytes'} hashed
                            </p>
                        )}
                        {error && (
                            <p role="alert" className="mt-2 text-sm text-danger">
                                {error}
                            </p>
                        )}
                    </div>

                    <p className="text-sm text-fg-muted">
                        Hashing is one-way. It is not encryption, and the original text cannot be recovered from
                        a hash.
                    </p>
                </div>
            </ToolPanel>
        </div>
    )
}