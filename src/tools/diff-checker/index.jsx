import { useDeferredValue, useId, useMemo, useRef, useState } from 'react'
import { ArrowLeftRight, Download, FolderOpen, Link2 } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import ExampleButton from '../../components/common/ExampleButton.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import ChoiceGroup from '../../components/ui/ChoiceGroup.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import useToast from '../../hooks/useToast.js'
import { downloadBlob } from '../../utils/files.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import DiffView from './DiffView.jsx'
import { EXAMPLE_CHANGED, EXAMPLE_ORIGINAL, MAX_FILE_MB, PRECISIONS, VIEWS, compareTexts, makePatch, splitLines } from './diff.js'
import { DEFAULT_SETTINGS, isDefaultSettings } from './settings.js'
import { readSharedSettings, toShareQuery } from './share.js'

// One of the two text boxes, with its own Open file and Clear buttons. A file can also be dropped on the box.
function TextInput({ id, label, value, onChange, onError, wrap }) {
    const fileInput = useRef(null)
    const [dragging, setDragging] = useState(false)

    const readFile = async (file) => {
        if (!file) return
        if (file.size > MAX_FILE_MB * 1024 * 1024) {
            onError(`“${file.name}” is larger than ${MAX_FILE_MB} MB.`)
            return
        }
        try {
            const text = await file.text()
            if (text.includes('\u0000')) {
                onError(`“${file.name}” does not look like a text file.`)
                return
            }
            onError('')
            onChange(text)
        } catch {
            onError(`“${file.name}” could not be read.`)
        }
    }

    return (
        <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <label htmlFor={id} className="text-sm font-medium">
                    {label}
                </label>
                <div className="flex gap-1">
                    <Button variant="ghost" onClick={() => fileInput.current?.click()}>
                        <FolderOpen size={16} aria-hidden="true" />
                        Open file<span className="sr-only"> for {label.toLowerCase()}</span>
                    </Button>
                    <ClearButton onClick={() => onChange('')} disabled={value === ''} />
                </div>
            </div>
            <input
                ref={fileInput}
                type="file"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(event) => {
                    readFile(event.target.files?.[0])
                    event.target.value = ''
                }}
            />
            <textarea
                id={id}
                className="field field-mono diff-input"
                data-dragging={dragging}
                rows={12}
                wrap={wrap ? 'soft' : 'off'}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onDragOver={(event) => {
                    event.preventDefault()
                    setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                    event.preventDefault()
                    setDragging(false)
                    readFile(event.dataTransfer.files?.[0])
                }}
                placeholder="Paste text here, open a file, or drop a file on this box"
                spellCheck={false}
            />
            <p className="mt-1.5 text-sm text-fg-muted">{splitLines(value).length.toLocaleString('en-US')} lines</p>
        </div>
    )
}

export default function DiffCheckerTool() {
    // A shared link can set the display choices (never the texts). They are read once, then removed from the address.
    const params = useInitialParams()
    const toast = useToast()
    const ids = { original: useId(), changed: useId() }
    const [settings, setSettings] = useState(() => readSharedSettings(params))
    const [original, setOriginal] = useState('')
    const [changed, setChanged] = useState('')
    const [fileError, setFileError] = useState('')
    const update = (changes) => setSettings((current) => ({ ...current, ...changes }))

    // The comparison runs a moment after typing stops, so big texts do not make typing sluggish.
    const slowOriginal = useDeferredValue(original)
    const slowChanged = useDeferredValue(changed)
    const options = useMemo(
        () => ({ precision: settings.precision, ignoreWhitespace: settings.ignoreWhitespace, ignoreCase: settings.ignoreCase }),
        [settings.precision, settings.ignoreWhitespace, settings.ignoreCase],
    )
    const hasText = slowOriginal !== '' || slowChanged !== ''
    const result = useMemo(() => (hasText ? compareTexts(slowOriginal, slowChanged, options) : null), [hasText, slowOriginal, slowChanged, options])
    const patch = useMemo(() => (result?.ok && !result.identical ? makePatch(slowOriginal, slowChanged) : ''), [result, slowOriginal, slowChanged])

    const swap = () => {
        setOriginal(changed)
        setChanged(original)
    }

    const download = () => {
        downloadBlob(new Blob([patch], { type: 'text/x-diff;charset=utf-8' }), 'changes.patch')
        toast.success('Downloaded changes.patch')
    }

    const shareUrl = buildShareUrl(toShareQuery(settings))
    const stale = original !== slowOriginal || changed !== slowChanged

    return (
        <div className="dd-stack tip-end gap-4">
            <ToolPanel
                title="Texts to compare"
                actions={
                    <>
                        <ExampleButton
                            onClick={() => {
                                setOriginal(EXAMPLE_ORIGINAL)
                                setChanged(EXAMPLE_CHANGED)
                                setFileError('')
                            }}
                        />
                        <Button variant="ghost" onClick={swap} disabled={original === '' && changed === ''}>
                            <ArrowLeftRight size={16} aria-hidden="true" />
                            Swap
                        </Button>
                        <ClearButton
                            label="Clear both"
                            onClick={() => {
                                setOriginal('')
                                setChanged('')
                                setFileError('')
                            }}
                            disabled={original === '' && changed === ''}
                        />
                    </>
                }
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <TextInput id={ids.original} label="Original text" value={original} onChange={setOriginal} onError={setFileError} wrap={settings.wrap} />
                    <TextInput id={ids.changed} label="Changed text" value={changed} onChange={setChanged} onError={setFileError} wrap={settings.wrap} />
                </div>
                {fileError && (
                    <p role="alert" className="mt-3 text-sm text-danger">
                        {fileError}
                    </p>
                )}
            </ToolPanel>

            <ToolPanel
                title="Options"
                actions={
                    <>
                        <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                        <ResetButton onClick={() => setSettings({ ...DEFAULT_SETTINGS, view: settings.view })} disabled={isDefaultSettings(settings)} />
                    </>
                }
            >
                <div className="grid gap-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <ChoiceGroup label="View" options={VIEWS} value={settings.view} onChange={(next) => update({ view: next })} />
                        <ChoiceGroup label="Highlight changes inside a line by" options={PRECISIONS} value={settings.precision} onChange={(next) => update({ precision: next })} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Checkbox
                            label="Ignore whitespace"
                            hint="Ignores spaces and tabs at the start and end of a line, and extra spaces between words."
                            checked={settings.ignoreWhitespace}
                            onChange={(next) => update({ ignoreWhitespace: next })}
                        />
                        <Checkbox label="Ignore upper and lower case" checked={settings.ignoreCase} onChange={(next) => update({ ignoreCase: next })} />
                        <Checkbox
                            label="Hide unchanged lines"
                            hint="Keeps three lines around each change and folds the rest."
                            checked={settings.hideUnchanged}
                            onChange={(next) => update({ hideUnchanged: next })}
                        />
                        <Checkbox label="Wrap long lines" checked={settings.wrap} onChange={(next) => update({ wrap: next })} />
                    </div>
                </div>
            </ToolPanel>

            <ToolPanel
                title="Differences"
                actions={
                    <>
                        <Button variant="secondary" onClick={download} disabled={patch === ''}>
                            <Download size={16} aria-hidden="true" />
                            Download .patch
                        </Button>
                        <CopyButton text={patch} label="Copy diff" copiedLabel="Diff copied" variant="primary" />
                    </>
                }
            >
                {result === null ? (
                    <p className="text-sm text-fg-muted">Paste or open two texts to see what changed between them.</p>
                ) : !result.ok ? (
                    <p role="alert" className="text-sm text-danger">
                        {result.error}
                    </p>
                ) : (
                    <div className="dd-stack gap-3" aria-busy={stale}>
                        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" role="status">
                            <span className="diff-stat" data-kind="added">+{result.stats.added.toLocaleString('en-US')} added</span>
                            <span className="diff-stat" data-kind="removed">−{result.stats.removed.toLocaleString('en-US')} removed</span>
                            <span className="text-fg-muted">{result.stats.unchanged.toLocaleString('en-US')} unchanged</span>
                        </p>
                        {result.identical ? (
                            <p className="rounded-xl border border-dashed border-border-strong p-6 text-center text-sm text-fg-muted">
                                No differences. The two texts are the same{settings.ignoreWhitespace || settings.ignoreCase ? ' with the ignore options you chose' : ''}.
                            </p>
                        ) : (
                            // A new key when the texts change closes any folded stretches that were opened.
                            <DiffView
                                key={`${slowOriginal.length}-${slowChanged.length}-${settings.ignoreWhitespace}-${settings.ignoreCase}`}
                                segments={result.segments}
                                view={settings.view}
                                hideUnchanged={settings.hideUnchanged}
                                wrap={settings.wrap}
                            />
                        )}
                    </div>
                )}
                {result?.ok && !result.identical && (
                    <p className="mt-3 text-xs text-fg-muted">
                        Copy diff and Download .patch use the standard unified diff format (the one Git shows) and compare the texts exactly, without the ignore options.
                    </p>
                )}
            </ToolPanel>
        </div>
    )
}