import { useId } from 'react'
import { ArrowDown, ArrowUp, X } from 'lucide-react'
import IconButton from '../../components/ui/IconButton.jsx'
import { getField, toSnake } from './fields.js'
import { getOption } from './settings.js'

// One extra setting of a field (minimum, maximum, date range, email domain).
function OptionInput({ fieldId, fieldLabel, option, value, onChange }) {
    const id = useId()
    return (
        <div className="min-w-0">
            <label htmlFor={id} className="mb-1 block text-xs font-medium text-fg-muted">
                {option.label}
                <span className="sr-only"> ({fieldLabel})</span>
            </label>
            <input
                id={id}
                className="field"
                type={option.kind === 'date' ? 'date' : 'text'}
                inputMode={option.kind === 'number' ? 'decimal' : undefined}
                value={value}
                onChange={(event) => onChange(fieldId, option.key, event.target.value)}
                spellCheck={false}
                autoComplete="off"
            />
        </div>
    )
}

/*
 * The chosen fields as an ordered list of columns. Each column can be moved, renamed (when
 * "My column names" is on), and have its own settings. Renaming changes only the name in the
 * output; the kind of data the column holds stays the same.
 */
export default function ColumnEditor({ settings, columns, onMove, onRemove, onRename, onOption }) {
    const renameId = useId()

    return (
        <ol className="grid gap-3" aria-label="Columns">
            {settings.fields.map((fieldId, position) => {
                const field = getField(fieldId)
                if (!field) return null
                const column = columns.find((item) => item.id === fieldId)
                return (
                    <li key={fieldId} className="grid min-w-0 gap-3 rounded-xl border border-border bg-surface p-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="min-w-0 flex-1 text-sm font-semibold">
                                <span className="text-fg-muted">{position + 1}. </span>
                                {field.label}
                            </span>
                            <IconButton label={`Move ${field.label} up`} onClick={() => onMove(position, -1)} disabled={position === 0} className="size-9 rounded-lg disabled:opacity-40">
                                <ArrowUp size={16} aria-hidden="true" />
                            </IconButton>
                            <IconButton
                                label={`Move ${field.label} down`}
                                onClick={() => onMove(position, 1)}
                                disabled={position === settings.fields.length - 1}
                                className="size-9 rounded-lg disabled:opacity-40"
                            >
                                <ArrowDown size={16} aria-hidden="true" />
                            </IconButton>
                            <IconButton label={`Remove ${field.label}`} onClick={() => onRemove(fieldId)} className="size-9 rounded-lg">
                                <X size={16} aria-hidden="true" />
                            </IconButton>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {settings.keyStyle === 'custom' ? (
                                <div className="min-w-0">
                                    <label htmlFor={`${renameId}-${fieldId}`} className="mb-1 block text-xs font-medium text-fg-muted">
                                        Column name<span className="sr-only"> ({field.label})</span>
                                    </label>
                                    <input
                                        id={`${renameId}-${fieldId}`}
                                        className="field field-mono"
                                        value={settings.names[fieldId] ?? ''}
                                        placeholder={toSnake(fieldId)}
                                        onChange={(event) => onRename(fieldId, event.target.value)}
                                        spellCheck={false}
                                        autoComplete="off"
                                        maxLength={64}
                                    />
                                </div>
                            ) : (
                                <p className="min-w-0 self-end break-words text-sm text-fg-muted">
                                    Named <code className="font-mono text-fg">{column?.key}</code>
                                </p>
                            )}
                            {field.options?.map((option) => (
                                <OptionInput
                                    key={option.key}
                                    fieldId={fieldId}
                                    fieldLabel={field.label}
                                    option={option}
                                    value={getOption(settings, fieldId, option)}
                                    onChange={onOption}
                                />
                            ))}
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}