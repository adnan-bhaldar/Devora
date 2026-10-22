import { flag, readChoice, readFlag, readInteger, toQuery } from '../../utils/shareLink.js'
import { FIELD_IDS } from './fields.js'
import { LOCALE_OPTIONS } from './locales.js'
import { COUNT, DATE_FORMATS, DEFAULT_SETTINGS, DIALECTS, FORMATS, KEY_STYLES, PHONE_FORMATS, isKnownField } from './settings.js'

const values = (options) => options.map((option) => option.value)

/*
 * Only harmless choices go in a link: which fields, how many records, the locale, the format, and
 * the on/off options. The seed, the table and element names, column names and field limits are
 * typed text, so they are not shared (the link stays short and never carries text you typed).
 * Example: ?fields=id,fullName,email&count=50&format=csv
 */
export function readSharedSettings(params) {
    const listed = (params.get('fields') ?? '').split(',').filter((id, position, all) => isKnownField(id) && all.indexOf(id) === position)
    return {
        ...DEFAULT_SETTINGS,
        fields: listed.length > 0 ? listed : DEFAULT_SETTINGS.fields,
        count: readInteger(params, 'count', COUNT, DEFAULT_SETTINGS.count),
        locale: readChoice(params, 'locale', values(LOCALE_OPTIONS), DEFAULT_SETTINGS.locale),
        unique: readFlag(params, 'unique', DEFAULT_SETTINGS.unique),
        nullPercent: readInteger(params, 'empty', { min: 0, max: 100 }, DEFAULT_SETTINGS.nullPercent),
        dateFormat: readChoice(params, 'date', values(DATE_FORMATS), DEFAULT_SETTINGS.dateFormat),
        phoneFormat: readChoice(params, 'phone', values(PHONE_FORMATS), DEFAULT_SETTINGS.phoneFormat),
        keyStyle: readChoice(params, 'keys', values(KEY_STYLES), DEFAULT_SETTINGS.keyStyle),
        format: readChoice(params, 'format', values(FORMATS), DEFAULT_SETTINGS.format),
        jsonPretty: readFlag(params, 'pretty', DEFAULT_SETTINGS.jsonPretty),
        jsonLines: readFlag(params, 'lines', DEFAULT_SETTINGS.jsonLines),
        dialect: readChoice(params, 'sql', values(DIALECTS), DEFAULT_SETTINGS.dialect),
    }
}

export function toShareQuery(settings) {
    return toQuery([
        ['fields', settings.fields.filter((id) => FIELD_IDS.includes(id)).join(',')],
        ['count', settings.count],
        ['locale', settings.locale],
        ['unique', flag(settings.unique)],
        ['empty', settings.nullPercent],
        ['date', settings.dateFormat],
        ['phone', settings.phoneFormat],
        ['keys', settings.keyStyle],
        ['format', settings.format],
        ['pretty', flag(settings.jsonPretty)],
        ['lines', flag(settings.jsonLines)],
        ['sql', settings.dialect],
    ])
}