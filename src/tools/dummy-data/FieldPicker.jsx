import { ChevronRight } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import Checkbox from '../../components/ui/Checkbox.jsx'
import { FIELDS, FIELD_IDS, GROUPS, PRESETS } from './fields.js'

/*
 * Choose which fields each record has. Fields are grouped in collapsible sections; a group that
 * has something selected starts open. The order of the fields is set below, in the column list.
 */
export default function FieldPicker({ selected, onChange }) {
    const selectedSet = new Set(selected)

    const toggle = (id, checked) => {
        // New fields go at the end, so the columns you already ordered stay where they are.
        onChange(checked ? [...selected, id] : selected.filter((item) => item !== id))
    }

    const setGroup = (groupId, checked) => {
        const ids = FIELDS.filter((field) => field.group === groupId).map((field) => field.id)
        onChange(checked ? [...selected, ...ids.filter((id) => !selectedSet.has(id))] : selected.filter((id) => !ids.includes(id)))
    }

    return (
        <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Start from</span>
                {PRESETS.map((preset) => (
                    <button key={preset.id} type="button" className="chip" onClick={() => onChange(preset.fields)}>
                        {preset.label}
                    </button>
                ))}
                <span className="ml-auto flex gap-1">
                    <Button variant="ghost" onClick={() => onChange(FIELD_IDS)} disabled={selected.length === FIELD_IDS.length}>
                        Select all
                    </Button>
                    <Button variant="ghost" onClick={() => onChange([])} disabled={selected.length === 0}>
                        Clear
                    </Button>
                </span>
            </div>

            {GROUPS.map((group, position) => {
                const fields = FIELDS.filter((field) => field.group === group.id)
                const pickedCount = fields.filter((field) => selectedSet.has(field.id)).length
                return (
                    <details key={group.id} className="group-details" open={position === 0}>
                        <summary className="group-details__summary">
                            <ChevronRight size={16} aria-hidden="true" className="group-details__chevron" />
                            <span className="group-details__title">{group.name}</span>
                            <span className="group-details__count">
                                {pickedCount} of {fields.length}
                                <span className="sr-only"> selected</span>
                            </span>
                        </summary>
                        <div className="pt-3">
                            <div className="mb-2 flex gap-1">
                                <Button variant="ghost" onClick={() => setGroup(group.id, true)} disabled={pickedCount === fields.length}>
                                    Select group<span className="sr-only">: {group.name}</span>
                                </Button>
                                <Button variant="ghost" onClick={() => setGroup(group.id, false)} disabled={pickedCount === 0}>
                                    Clear group<span className="sr-only">: {group.name}</span>
                                </Button>
                            </div>
                            <div role="group" aria-label={group.name} className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                                {fields.map((field) => (
                                    <Checkbox
                                        key={field.id}
                                        label={field.label}
                                        checked={selectedSet.has(field.id)}
                                        onChange={(checked) => toggle(field.id, checked)}
                                    />
                                ))}
                            </div>
                        </div>
                    </details>
                )
            })}
        </div>
    )
}