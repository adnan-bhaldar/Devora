/*
 * Every field the generator can make. `type` is the kind of value, so structured formats can
 * write numbers and booleans as numbers and booleans (not as text).
 * `options` lists the extra settings a field has. Fields without options show no controls.
 */

export const GROUPS = [
    { id: 'personal', name: 'Personal information' },
    { id: 'address', name: 'Address and location' },
    { id: 'contact', name: 'Contact information' },
    { id: 'professional', name: 'Professional information' },
    { id: 'technical', name: 'Technical and database' },
]

const DATE_OPTIONS = [
    { key: 'from', label: 'From', kind: 'date', default: '2020-01-01' },
    { key: 'to', label: 'To', kind: 'date', default: '2026-12-31' },
]

export const FIELDS = [
    { id: 'firstName', label: 'First name', group: 'personal', type: 'string' },
    { id: 'lastName', label: 'Last name', group: 'personal', type: 'string' },
    { id: 'fullName', label: 'Full name', group: 'personal', type: 'string' },
    { id: 'username', label: 'Username', group: 'personal', type: 'string' },
    { id: 'gender', label: 'Gender', group: 'personal', type: 'string' },
    { id: 'dateOfBirth', label: 'Date of birth', group: 'personal', type: 'string' },
    { id: 'age', label: 'Age', group: 'personal', type: 'number' },

    { id: 'streetAddress', label: 'Street address', group: 'address', type: 'string' },
    { id: 'streetName', label: 'Street name', group: 'address', type: 'string' },
    { id: 'buildingNumber', label: 'House / building number', group: 'address', type: 'number' },
    { id: 'city', label: 'City', group: 'address', type: 'string' },
    { id: 'state', label: 'State / province / region', group: 'address', type: 'string' },
    { id: 'postalCode', label: 'Postal / ZIP code', group: 'address', type: 'string' },
    { id: 'country', label: 'Country', group: 'address', type: 'string' },
    { id: 'countryCode', label: 'Country code', group: 'address', type: 'string' },
    { id: 'latitude', label: 'Latitude', group: 'address', type: 'number' },
    { id: 'longitude', label: 'Longitude', group: 'address', type: 'number' },

    { id: 'phone', label: 'Phone number', group: 'contact', type: 'string' },
    {
        id: 'email',
        label: 'Email address',
        group: 'contact',
        type: 'string',
        options: [{ key: 'domain', label: 'Email domain', kind: 'text', default: 'example.com' }],
    },
    { id: 'website', label: 'Website / URL', group: 'contact', type: 'string' },

    { id: 'company', label: 'Company name', group: 'professional', type: 'string' },
    { id: 'jobTitle', label: 'Job title', group: 'professional', type: 'string' },
    { id: 'department', label: 'Department', group: 'professional', type: 'string' },

    { id: 'id', label: 'ID', group: 'technical', type: 'number' },
    { id: 'uuid', label: 'UUID', group: 'technical', type: 'string' },
    { id: 'boolean', label: 'Boolean value', group: 'technical', type: 'boolean' },
    {
        id: 'integer',
        label: 'Integer',
        group: 'technical',
        type: 'number',
        options: [
            { key: 'min', label: 'Minimum', kind: 'number', default: 0 },
            { key: 'max', label: 'Maximum', kind: 'number', default: 1000 },
        ],
    },
    {
        id: 'decimal',
        label: 'Decimal number',
        group: 'technical',
        type: 'number',
        options: [
            { key: 'min', label: 'Minimum', kind: 'number', default: 0 },
            { key: 'max', label: 'Maximum', kind: 'number', default: 1000 },
        ],
    },
    { id: 'date', label: 'Date', group: 'technical', type: 'string', options: DATE_OPTIONS },
    { id: 'timestamp', label: 'Timestamp', group: 'technical', type: 'string', options: DATE_OPTIONS },
    { id: 'ipAddress', label: 'IP address', group: 'technical', type: 'string' },
    { id: 'colorHex', label: 'Color hex code', group: 'technical', type: 'string' },
]

export const FIELD_IDS = FIELDS.map((field) => field.id)
export const getField = (id) => FIELDS.find((field) => field.id === id)

// Fields that are never made empty by the "empty values" setting, because they identify a record.
export const KEY_FIELDS = ['id', 'uuid']

// userId style names: firstName becomes first_name.
export const toSnake = (id) => id.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const PRESETS = [
    { id: 'person', label: 'Person', fields: ['id', 'fullName', 'email', 'phone', 'dateOfBirth'] },
    { id: 'address', label: 'Address', fields: ['streetAddress', 'city', 'state', 'postalCode', 'country', 'latitude', 'longitude'] },
    { id: 'user', label: 'Database users', fields: ['id', 'uuid', 'username', 'email', 'boolean', 'timestamp'] },
    { id: 'employee', label: 'Employees', fields: ['id', 'fullName', 'jobTitle', 'department', 'company', 'email'] },
]