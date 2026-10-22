import { FIELDS, FIELD_IDS } from './fields.js'

export const COUNT = { min: 1, max: 5000, presets: [10, 50, 100, 500, 1000] }

export const DATE_FORMATS = [
    { value: 'iso', label: '2026-03-05' },
    { value: 'us', label: '03/05/2026' },
    { value: 'eu', label: '05/03/2026' },
    { value: 'long', label: 'March 5, 2026' },
]

export const PHONE_FORMATS = [
    { value: 'international', label: 'International (+country code)' },
    { value: 'national', label: 'National (local style)' },
]

export const KEY_STYLES = [
    { value: 'custom', label: 'My column names' },
    { value: 'snake', label: 'snake_case' },
    { value: 'camel', label: 'camelCase' },
]

export const FORMATS = [
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' },
    { value: 'html', label: 'HTML' },
    { value: 'sql', label: 'SQL' },
    { value: 'xml', label: 'XML' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
]

export const DIALECTS = [
    { value: 'postgres', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
]

export const PREVIEW_MODES = [
    { value: 'table', label: 'Table' },
    { value: 'raw', label: 'Output' },
]

// The date that ages are counted from. It is fixed when the page opens, so a result does not change while you work.
const today = new Date().toISOString().slice(0, 10)

export const DEFAULT_SETTINGS = {
    fields: ['id', 'firstName', 'lastName', 'email', 'phone', 'city', 'country'],
    count: 10,
    locale: 'en-US',
    seed: '',
    unique: true,
    nullPercent: 0,
    dateFormat: 'iso',
    phoneFormat: 'international',
    ageMin: 18,
    ageMax: 80,
    asOf: today,
    // Per-field settings and column names the person changed. Only changed values are stored.
    fieldOptions: {},
    names: {},
    format: 'json',
    jsonPretty: true,
    jsonLines: false,
    keyStyle: 'custom',
    sqlTable: 'dummy_data',
    dialect: 'postgres',
    xmlRoot: 'records',
    xmlRecord: 'record',
    preview: 'table',
    lineNumbers: false,
}

// The default of a per-field option, or the value the person set.
export function getOption(settings, fieldId, option) {
    const stored = settings.fieldOptions[fieldId]?.[option.key]
    return stored === undefined ? option.default : stored
}

export const hasOptions = (fieldId) => Boolean(FIELDS.find((field) => field.id === fieldId)?.options)
export const isKnownField = (id) => FIELD_IDS.includes(id)