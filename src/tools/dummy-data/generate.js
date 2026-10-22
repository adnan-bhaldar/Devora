import { getField, KEY_FIELDS, toSnake } from './fields.js'
import { loadFaker } from './fakers.js'
import { countryName, getLocale } from './locales.js'
import { hashText } from './random.js'
import { getOption } from './settings.js'

/*
 * Makes the records with Faker. Every value is drawn after re-seeding from (seed, locale, record
 * number, its own key), so the same settings and seed always give the same data, and choosing
 * other fields never changes the values of the ones you kept.
 */

const DAY_MS = 86400000
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// ---- dates (a "day" is a whole number of days since 1 January 1970, UTC) ----

const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseDay(text) {
    const match = ISO_DAY.exec(String(text ?? '').trim())
    if (!match) return null
    const [year, month, day] = match.slice(1).map(Number)
    const date = new Date(0)
    date.setUTCFullYear(year, month - 1, day)
    // Reject 2026-02-31 (JavaScript would roll it over to March).
    if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
    return Math.floor(date.getTime() / DAY_MS)
}

const dateOf = (day) => new Date(day * DAY_MS)
const pad = (number) => String(number).padStart(2, '0')

export function formatDay(day, style) {
    const date = dateOf(day)
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1
    const dayOfMonth = date.getUTCDate()
    if (style === 'us') return `${pad(month)}/${pad(dayOfMonth)}/${year}`
    if (style === 'eu') return `${pad(dayOfMonth)}/${pad(month)}/${year}`
    if (style === 'long') return `${MONTHS[month - 1]} ${dayOfMonth}, ${year}`
    return `${year}-${pad(month)}-${pad(dayOfMonth)}`
}

// The day that is `years` before `day`. 29 February in a year without one becomes 28 February.
function yearsBefore(day, years) {
    const date = dateOf(day)
    const year = date.getUTCFullYear() - years
    const month = date.getUTCMonth()
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    const result = new Date(0)
    result.setUTCFullYear(year, month, Math.min(date.getUTCDate(), lastDay))
    return Math.floor(result.getTime() / DAY_MS)
}

function ageOn(birthDay, day) {
    const birth = dateOf(birthDay)
    const now = dateOf(day)
    let age = now.getUTCFullYear() - birth.getUTCFullYear()
    const hadBirthday =
        now.getUTCMonth() > birth.getUTCMonth() ||
        (now.getUTCMonth() === birth.getUTCMonth() && now.getUTCDate() >= birth.getUTCDate())
    if (!hadBirthday) age -= 1
    return age
}

// ---- small helpers ----

const fold = (text) =>
    text
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/ß/g, 'ss')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase()

const round = (value, places) => {
    const factor = 10 ** places
    return Math.round(value * factor) / factor
}

// A blank box counts as "not a number" (Number('') would be 0), so the fallback is used instead.
const toNumber = (raw) => (String(raw ?? '').trim() === '' ? NaN : Number(raw))

const clampInt = (value, fallback) => {
    const number = Math.trunc(toNumber(value))
    return Number.isFinite(number) ? Math.min(1e12, Math.max(-1e12, number)) : fallback
}

// Both ends of a range, swapped if they are the wrong way round.
const ordered = (a, b) => (a <= b ? [a, b] : [b, a])

const DOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i

// ---- the columns ----

/*
 * The name each column gets in the output. "My column names" uses what the person typed (or the
 * snake_case name when nothing was typed). Names are made unique, because two columns with the
 * same name would overwrite each other in JSON.
 */
export function buildColumns(settings) {
    const used = new Set()
    return settings.fields
        .map((id) => getField(id))
        .filter(Boolean)
        .map((field) => {
            let key
            if (settings.keyStyle === 'camel') key = field.id
            else if (settings.keyStyle === 'snake') key = toSnake(field.id)
            else key = (settings.names[field.id] ?? '').trim() || toSnake(field.id)

            let unique = key
            let counter = 2
            while (used.has(unique)) {
                unique = `${key}_${counter}`
                counter += 1
            }
            used.add(unique)
            return { id: field.id, label: field.label, key: unique, type: field.type }
        })
}

// ---- the records ----

// Faker's building numbers can be things like "67c" or "s/n." Keep the number, drop the rest.
const leadingNumber = (text, fallback) => {
    const match = /\d+/.exec(String(text))
    return match ? Number(match[0]) : fallback
}

// Faker has product categories ("Music", "Baby") but no company departments, so this short list is ours.
const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Finance', 'Human Resources', 'Legal', 'Operations', 'Customer Support', 'Research', 'IT', 'Procurement', 'Quality Assurance', 'Administration']

const PRIVATE_IP_PREFIXES = ['192.0.2', '198.51.100', '203.0.113'] // ranges kept for documentation

export async function generate(settings) {
    const columns = buildColumns(settings)
    const issues = []
    const locale = getLocale(settings.locale)
    const { faker, random } = await loadFaker(locale.faker)
    const seedBase = `${settings.seed}|${locale.id}`
    // Restart Faker's random source for one value, then the caller draws it straight away.
    const stream = (index, key) => random.seed(hashText(`${seedBase}|${index}|${key}`))

    // A tiny helper object so the postal-code builders in locales.js do not need to know about Faker.
    const picker = {
        digits: (count) => (count > 0 ? faker.string.numeric({ length: count, allowLeadingZeros: true }) : ''),
        int: (min, max) => faker.number.int({ min, max }),
        pick: (items) => faker.helpers.arrayElement(items),
    }

    const ids = new Set(columns.map((column) => column.id))
    const optionOf = (fieldId, key) => {
        const option = getField(fieldId).options.find((item) => item.key === key)
        return getOption(settings, fieldId, option)
    }

    const range = {}
    for (const id of ['integer', 'decimal']) {
        if (!ids.has(id)) continue
        const min = toNumber(optionOf(id, 'min'))
        const max = toNumber(optionOf(id, 'max'))
        if (!Number.isFinite(min) || !Number.isFinite(max)) {
            issues.push(`${getField(id).label}: the minimum and maximum must be numbers. The defaults were used.`)
            range[id] = [0, 1000]
        } else {
            if (min > max) issues.push(`${getField(id).label}: the minimum was larger than the maximum, so they were swapped.`)
            range[id] = ordered(id === 'integer' ? clampInt(min, 0) : min, id === 'integer' ? clampInt(max, 1000) : max)
        }
    }

    const dayRange = {}
    for (const id of ['date', 'timestamp']) {
        if (!ids.has(id)) continue
        const from = parseDay(optionOf(id, 'from'))
        const to = parseDay(optionOf(id, 'to'))
        if (from === null || to === null) {
            issues.push(`${getField(id).label}: use dates like 2024-01-31. The default range was used.`)
            dayRange[id] = [parseDay('2020-01-01'), parseDay('2026-12-31')]
        } else {
            if (from > to) issues.push(`${getField(id).label}: the start date was after the end date, so they were swapped.`)
            dayRange[id] = ordered(from, to)
        }
    }

    let emailDomain = 'example.com'
    if (ids.has('email')) {
        const typed = String(optionOf('email', 'domain')).trim().toLowerCase()
        if (DOMAIN_PATTERN.test(typed)) emailDomain = typed
        else issues.push('Email domain: that does not look like a domain, so example.com was used.')
    }

    let asOfDay = parseDay(settings.asOf)
    let ageRange = [18, 80]
    if (ids.has('age') || ids.has('dateOfBirth')) {
        if (asOfDay === null) {
            issues.push('Ages counted as of: use a date like 2026-03-05. Today was used.')
            asOfDay = Math.floor(Date.now() / DAY_MS)
        }
        if ([settings.ageMin, settings.ageMax].some((raw) => !Number.isFinite(toNumber(raw)))) {
            issues.push('Age range: an empty or invalid box was replaced by its default (18 for youngest, 80 for oldest).')
        }
        const minAge = clampInt(settings.ageMin, 18)
        const maxAge = clampInt(settings.ageMax, 80)
        if (minAge < 0 || maxAge > 120) issues.push('Age range: ages from 0 to 120 are supported. The range was adjusted.')
        if (minAge > maxAge) issues.push('Age range: the minimum was larger than the maximum, so they were swapped.')
        ageRange = ordered(Math.min(120, Math.max(0, minAge)), Math.min(120, Math.max(0, maxAge)))
    }

    const nullChance = Math.min(100, Math.max(0, Number(settings.nullPercent) || 0)) / 100
    const takenUsernames = new Set()
    const takenEmails = new Set()
    const country = countryName(locale.countryCode)

    // ---- the parts of a record that several fields share ----
    const makeIdentity = (index) => {
        stream(index, 'identity')
        const gender = faker.helpers.weightedArrayElement([
            { weight: 48, value: 'Male' },
            { weight: 48, value: 'Female' },
            { weight: 4, value: 'Non-binary' },
        ])
        const sex = gender === 'Male' ? 'male' : gender === 'Female' ? 'female' : undefined
        return { gender, first: faker.person.firstName(sex), last: faker.person.lastName(sex) }
    }

    const makeLocation = (index) => {
        stream(index, 'location')
        const street = faker.location.street()
        let number = leadingNumber(faker.location.buildingNumber(), faker.number.int({ min: 1, max: 200 }))
        if (number > 9999) number = (number % 999) + 1 // some locales give 5-digit numbers, which look wrong
        if (locale.cities) {
            const city = faker.helpers.arrayElement(locale.cities)
            // Stay close to the city, and always inside the valid range.
            const latitude = round(Math.min(90, Math.max(-90, city.lat + faker.number.float({ min: -0.04, max: 0.04 }))), 6)
            const longitude = round(Math.min(180, Math.max(-180, city.lon + faker.number.float({ min: -0.04, max: 0.04 }))), 6)
            return { city: city.name, region: city.region, street, number, postal: locale.makePostal(picker, city), latitude, longitude, area: city.area }
        }
        return {
            city: faker.location.city(),
            region: faker.location.state(),
            street,
            number,
            postal: faker.location.zipCode(),
            latitude: round(faker.location.latitude({ min: locale.box[0], max: locale.box[1] }), 6),
            longitude: round(faker.location.longitude({ min: locale.box[2], max: locale.box[3] }), 6),
            area: '',
        }
    }

    const makeCompany = (index) => {
        stream(index, 'company')
        const name = faker.company.name()
        return { name, slug: fold(name.replace(/&/g, ' ')) || 'company' }
    }

    const makeBirthDay = (index) => {
        stream(index, 'birth')
        const latest = yearsBefore(asOfDay, ageRange[0])
        const earliest = yearsBefore(asOfDay, ageRange[1] + 1) + 1
        return faker.number.int({ min: earliest, max: latest })
    }

    const uniqueValue = (taken, value, withNumber) => {
        if (!settings.unique) return value
        let candidate = value
        let counter = 2
        while (taken.has(candidate)) {
            candidate = withNumber(counter)
            counter += 1
        }
        taken.add(candidate)
        return candidate
    }

    const makeUsername = (index, identity) => {
        stream(index, 'username')
        const base = fold(faker.internet.username({ firstName: identity.first, lastName: identity.last })) || 'user'
        const withDigits = faker.datatype.boolean(0.6) ? `${base}${faker.number.int({ min: 1, max: 99 })}` : base
        return uniqueValue(takenUsernames, withDigits, (n) => `${withDigits}${n}`)
    }

    const makeEmail = (index, identity) => {
        stream(index, 'email')
        const first = fold(identity.first)
        const last = fold(identity.last)
        const style = faker.number.int({ min: 0, max: 3 })
        const base = [`${first}.${last}`, `${first[0] ?? ''}${last}`, `${first}${last[0] ?? ''}`, `${first}_${last}`][style] || 'user'
        const local = faker.datatype.boolean(0.3) ? `${base}${faker.number.int({ min: 1, max: 99 })}` : base
        return uniqueValue(takenEmails, `${local}@${emailDomain}`, (n) => `${local}${n}@${emailDomain}`)
    }

    const makePhone = (index, location) => {
        stream(index, 'phone')
        if (locale.id === 'en-US') {
            // 555-0100 to 555-0199 is the range kept for fiction, so these never reach a real person.
            const area = location.area || faker.string.numeric({ length: 3, allowLeadingZeros: false })
            const line = `555-01${faker.string.numeric({ length: 2, allowLeadingZeros: true })}`
            return settings.phoneFormat === 'national' ? `(${area}) ${line}` : `+1 ${area} ${line.replace('-', ' ')}`
        }
        return faker.phone.number({ style: settings.phoneFormat === 'national' ? 'national' : 'international' })
    }

    // ---- one value ----
    const valueFor = (id, index, parts) => {
        const identity = () => (parts.identity ??= makeIdentity(index))
        const place = () => (parts.place ??= makeLocation(index))
        const company = () => (parts.company ??= makeCompany(index))
        const birthDay = () => (parts.birthDay ??= makeBirthDay(index))

        switch (id) {
            case 'firstName':
                return identity().first
            case 'lastName':
                return identity().last
            case 'fullName':
                return `${identity().first} ${identity().last}`
            case 'username':
                return makeUsername(index, identity())
            case 'gender':
                return identity().gender
            case 'dateOfBirth':
                return formatDay(birthDay(), settings.dateFormat)
            case 'age':
                return ageOn(birthDay(), asOfDay)

            case 'streetAddress':
                return locale.formatAddress(place().number, place().street)
            case 'streetName':
                return place().street
            case 'buildingNumber':
                return place().number
            case 'city':
                return place().city
            case 'state':
                return place().region
            case 'postalCode':
                return place().postal
            case 'country':
                return country
            case 'countryCode':
                return locale.countryCode
            case 'latitude':
                return place().latitude
            case 'longitude':
                return place().longitude

            case 'phone':
                return makePhone(index, place())
            case 'email':
                return makeEmail(index, identity())
            case 'website':
                return `https://${company().slug}.example.com`

            case 'company':
                return company().name
            case 'jobTitle':
                stream(index, 'jobTitle')
                return faker.person.jobTitle()
            case 'department':
                stream(index, 'department')
                return faker.helpers.arrayElement(DEPARTMENTS)

            case 'id':
                return index + 1
            case 'uuid':
                stream(index, 'uuid')
                return faker.string.uuid()
            case 'boolean':
                stream(index, 'boolean')
                return faker.datatype.boolean()
            case 'integer':
                stream(index, 'integer')
                return faker.number.int({ min: range.integer[0], max: range.integer[1] })
            case 'decimal': {
                stream(index, 'decimal')
                const [min, max] = range.decimal
                return min === max ? min : round(faker.number.float({ min, max }), 2)
            }
            case 'date':
                stream(index, 'date')
                return formatDay(faker.number.int({ min: dayRange.date[0], max: dayRange.date[1] }), settings.dateFormat)
            case 'timestamp': {
                stream(index, 'timestamp')
                const [from, to] = dayRange.timestamp
                const seconds = faker.number.int({ min: from * 86400, max: (to + 1) * 86400 - 1 })
                return new Date(seconds * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z')
            }
            case 'ipAddress': {
                stream(index, 'ipAddress')
                const kind = faker.number.int({ min: 0, max: 3 })
                const host = faker.number.int({ min: 1, max: 254 })
                const byte = () => faker.number.int({ min: 0, max: 255 })
                if (kind === 0) return `10.${byte()}.${byte()}.${host}`
                if (kind === 1) return `172.${faker.number.int({ min: 16, max: 31 })}.${byte()}.${host}`
                if (kind === 2) return `192.168.${byte()}.${host}`
                return `${faker.helpers.arrayElement(PRIVATE_IP_PREFIXES)}.${host}`
            }
            case 'colorHex':
                stream(index, 'colorHex')
                return `#${faker.number.int({ min: 0, max: 0xffffff }).toString(16).padStart(6, '0')}`
            default:
                return null
        }
    }

    const rows = []
    for (let index = 0; index < settings.count; index += 1) {
        const parts = {}
        rows.push(
            columns.map((column) => {
                const value = valueFor(column.id, index, parts)
                const canBeEmpty = nullChance > 0 && !KEY_FIELDS.includes(column.id)
                if (canBeEmpty) {
                    stream(index, `empty:${column.id}`)
                    if (faker.datatype.boolean(nullChance)) return null
                }
                return value
            }),
        )
    }

    return { columns, rows, issues }
}