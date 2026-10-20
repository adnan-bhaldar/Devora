import { useMemo, useRef, useState } from 'react'
import { ChevronRight, Download, Link2, SearchX, X } from 'lucide-react'
import ClearButton from '../../components/common/ClearButton.jsx'
import CopyButton from '../../components/common/CopyButton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ResetButton from '../../components/common/ResetButton.jsx'
import SearchInput from '../../components/common/SearchInput.jsx'
import ToolPanel from '../../components/tools/ToolPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import useInitialParams from '../../hooks/useInitialParams.js'
import { downloadBlob } from '../../utils/files.js'
import { buildShareUrl } from '../../utils/shareLink.js'
import {
    DEFAULT_SETTINGS,
    MAX_CUSTOM_CHARS,
    PRESETS,
    buildGitignore,
    filterTemplates,
    isDefaultSettings,
} from './gitignore.js'
import { readSharedChoices, toShareQuery } from './share.js'
import { GROUPS, TEMPLATES } from './templates.js'

const OUTPUT_ID = 'gitignore-output'
const CUSTOM_ID = 'gitignore-custom'

export default function GitignoreTool() {
    // A shared link can set the choices (never the custom rules). They are read once, then removed from the address.
    const params = useInitialParams()
    const [initial] = useState(() => readSharedChoices(params))
    const [selected, setSelected] = useState(initial.selected)
    const [settings, setSettings] = useState(initial.settings)
    const [custom, setCustom] = useState('')
    const [query, setQuery] = useState('')
    // Groups the person has closed. At the start only "Languages and build tools" is open, plus any group that
    // holds a template from a shared link. A search opens every group that has a match.
    const [closedGroups, setClosedGroups] = useState(() =>
        GROUPS.filter(
            (group) =>
                group.id !== 'language' &&
                !initial.selected.some((id) => TEMPLATES.find((template) => template.id === id)?.group === group.id),
        ).map((group) => group.id),
    )
    const searchRef = useRef(null)

    const visible = useMemo(() => filterTemplates(query), [query])
    const result = useMemo(() => buildGitignore(selected, settings, custom), [selected, settings, custom])
    const customTooLong = custom.length > MAX_CUSTOM_CHARS
    // Too much custom text is not used, so the output only ever grows to a sensible size.
    const output = customTooLong ? buildGitignore(selected, settings).text : result.text

    const selectedSet = new Set(selected)
    // Always listed in the same order as the templates, however the boxes were ticked.
    const selectedTemplates = TEMPLATES.filter((template) => selectedSet.has(template.id))

    const toggle = (id, checked) =>
        setSelected((current) => (checked ? [...current, id] : current.filter((item) => item !== id)))

    const setGroupOpen = (id, open) =>
        setClosedGroups((current) => (open ? current.filter((item) => item !== id) : current.includes(id) ? current : [...current, id]))

    const updateSettings = (patch) => setSettings((current) => ({ ...current, ...patch }))

    const reset = () => {
        setSelected([])
        setSettings(DEFAULT_SETTINGS)
        setCustom('')
        setQuery('')
    }

    const download = () => downloadBlob(new Blob([output], { type: 'application/octet-stream' }), '.gitignore')

    const shareUrl = buildShareUrl(toShareQuery(selected, settings))

    return (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
                <ToolPanel
                    title="Templates"
                    actions={<ClearButton onClick={() => setSelected([])} disabled={selected.length === 0} label="Clear selection" />}
                >
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
                        <div>
                            <h3 className="mb-2 text-sm font-medium">Quick start</h3>
                            <div className="flex flex-wrap gap-2">
                                {PRESETS.map((preset) => (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        className="chip"
                                        onClick={() => setSelected(preset.templates)}
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-fg-muted">
                                A quick start replaces your current choices. You can still change any box afterwards.
                            </p>
                        </div>

                        {selectedTemplates.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-sm font-medium">Selected ({selectedTemplates.length})</h3>
                                <ul className="flex flex-wrap gap-2">
                                    {selectedTemplates.map((template) => (
                                        <li key={template.id}>
                                            <button
                                                type="button"
                                                className="chip inline-flex items-center gap-1.5"
                                                onClick={() => toggle(template.id, false)}
                                            >
                                                {template.name}
                                                <X size={13} aria-hidden="true" />
                                                <span className="sr-only"> (remove)</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <SearchInput
                            value={query}
                            onChange={setQuery}
                            inputRef={searchRef}
                            label="Search templates"
                            placeholder="Search a language, framework, editor, or system…"
                        />

                        {visible.length > 0 ? (
                            GROUPS.map((group) => {
                                const items = visible.filter((template) => template.group === group.id)
                                if (items.length === 0) return null
                                const pickedCount = items.filter((template) => selectedSet.has(template.id)).length
                                // While searching, matching groups are always shown so no result is hidden.
                                const isOpen = query.trim() !== '' || !closedGroups.includes(group.id)
                                return (
                                    <details
                                        key={group.id}
                                        className="group-details"
                                        open={isOpen}
                                        onToggle={(event) => setGroupOpen(group.id, event.currentTarget.open)}
                                    >
                                        <summary className="group-details__summary">
                                            <ChevronRight size={16} aria-hidden="true" className="group-details__chevron" />
                                            <span className="group-details__title">{group.name}</span>
                                            <span className="group-details__count">
                                                {pickedCount > 0 ? `${pickedCount} selected` : `${items.length}`}
                                                <span className="sr-only">{pickedCount > 0 ? '' : ' templates'}</span>
                                            </span>
                                        </summary>
                                        <div role="group" aria-label={group.name} className="grid gap-x-4 gap-y-2.5 pt-3 sm:grid-cols-2">
                                            {items.map((template) => (
                                                <Checkbox
                                                    key={template.id}
                                                    label={template.name}
                                                    checked={selectedSet.has(template.id)}
                                                    onChange={(checked) => toggle(template.id, checked)}
                                                />
                                            ))}
                                        </div>
                                    </details>
                                )
                            })
                        ) : (
                            <EmptyState
                                icon={SearchX}
                                title="No templates found"
                                description="Try a shorter word, for example “node” or “python”."
                            >
                                <button type="button" className="btn btn-secondary" onClick={() => setQuery('')}>
                                    Clear search
                                </button>
                            </EmptyState>
                        )}
                    </div>
                </ToolPanel>

                <ToolPanel
                    title="Options"
                    actions={
                        <>
                            <CopyButton text={shareUrl} label="Copy link" copiedLabel="Link copied" icon={Link2} />
                            <ResetButton
                                onClick={reset}
                                disabled={selected.length === 0 && isDefaultSettings(settings) && custom === '' && query === ''}
                            />
                        </>
                    }
                >
                    <div className="grid gap-5">
                        <Checkbox
                            label="Add a title above each template"
                            hint="A comment line such as “# Node.js” makes the file easier to read."
                            checked={settings.titles}
                            onChange={(titles) => updateSettings({ titles })}
                        />
                        <Checkbox
                            label="Remove duplicate rules"
                            hint="A rule that two templates share (such as .DS_Store) is kept only once."
                            checked={settings.dedupe}
                            onChange={(dedupe) => updateSettings({ dedupe })}
                        />
                        <div>
                            <label htmlFor={CUSTOM_ID} className="mb-1.5 block text-sm font-medium">
                                Your own rules
                            </label>
                            <textarea
                                id={CUSTOM_ID}
                                className="field field-mono"
                                rows={4}
                                value={custom}
                                onChange={(event) => setCustom(event.target.value)}
                                placeholder={'One rule per line, for example:\nsecrets/\n*.sqlite'}
                                spellCheck={false}
                                aria-invalid={customTooLong}
                                aria-describedby={customTooLong ? 'gitignore-custom-error' : undefined}
                            />
                            {customTooLong && (
                                <p id="gitignore-custom-error" role="alert" className="mt-2 text-sm text-danger">
                                    Your own rules are too long, so they are left out. The limit is{' '}
                                    {MAX_CUSTOM_CHARS.toLocaleString('en-US')} characters.
                                </p>
                            )}
                        </div>
                    </div>
                </ToolPanel>
            </div>

            <ToolPanel
                title=".gitignore"
                className="lg:sticky lg:top-20"
                actions={
                    <>
                        <Button variant="primary" onClick={download} disabled={output === ''}>
                            <Download size={16} aria-hidden="true" />
                            Download
                        </Button>
                        <CopyButton text={output} label="Copy .gitignore" />
                    </>
                }
            >
                <label htmlFor={OUTPUT_ID} className="sr-only">
                    The generated .gitignore file
                </label>
                <textarea
                    id={OUTPUT_ID}
                    className="field field-mono min-h-[24rem]"
                    rows={24}
                    value={output}
                    readOnly
                    spellCheck={false}
                    placeholder="Pick the tools you use on the left, and your .gitignore appears here."
                />
                <p className="mt-2 text-sm text-fg-muted" role="status">
                    {output === ''
                        ? 'Nothing selected yet.'
                        : `${result.ruleCount.toLocaleString('en-US')} rules in ${result.sectionCount} ${result.sectionCount === 1 ? 'section' : 'sections'}.`}
                </p>
                <p className="mt-1 text-sm text-fg-muted">
                    Save it as <code className="font-mono">.gitignore</code> in the root folder of your repository. Some
                    browsers drop the dot from the start of a downloaded file name, so rename it if you need to.
                </p>
            </ToolPanel>
        </div>
    )
}