import { flag, readFlag, toQuery } from '../../utils/shareLink.js'
import { DEFAULT_SETTINGS, TEMPLATE_IDS } from './gitignore.js'

const MAX_SHARED_TEMPLATES = 40

// Only the choices are shared (which templates are ticked and two checkboxes), never the person's own rules.
// Example: ?t=node,macos,vscode&titles=1&dedupe=1
export function readSharedChoices(params) {
    const known = new Set(TEMPLATE_IDS)
    const ids = (params.get('t') ?? '')
        .split(',')
        .filter((id) => known.has(id))
        .slice(0, MAX_SHARED_TEMPLATES)

    return {
        selected: [...new Set(ids)],
        settings: {
            titles: readFlag(params, 'titles', DEFAULT_SETTINGS.titles),
            dedupe: readFlag(params, 'dedupe', DEFAULT_SETTINGS.dedupe),
        },
    }
}

export function toShareQuery(selected, settings) {
    return toQuery([
        ['t', selected.join(',')],
        ['titles', flag(settings.titles)],
        ['dedupe', flag(settings.dedupe)],
    ])
}