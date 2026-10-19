/*
 * Country calling codes. Each entry is [ISO country code, calling code, keepZero].
 * The country names come from the browser (Intl.DisplayNames), so they are spelled and
 * translated correctly without a hand-written list of names.
 *
 * keepZero marks the few countries where the 0 at the start of a local number is part of
 * the number even when dialled from abroad (Italy, San Marino, Vatican City). Everywhere else
 * that 0 is only for calls inside the country, so it is dropped (07700 900123 -> 7700 900123).
 */
const CODES = [
    ['AF', '93'], ['AL', '355'], ['DZ', '213'], ['AD', '376'], ['AO', '244'], ['AR', '54'],
    ['AM', '374'], ['AU', '61'], ['AT', '43'], ['AZ', '994'], ['BH', '973'], ['BD', '880'],
    ['BY', '375'], ['BE', '32'], ['BZ', '501'], ['BJ', '229'], ['BT', '975'], ['BO', '591'],
    ['BA', '387'], ['BW', '267'], ['BR', '55'], ['BN', '673'], ['BG', '359'], ['BF', '226'],
    ['BI', '257'], ['KH', '855'], ['CM', '237'], ['CA', '1'], ['CV', '238'], ['CF', '236'],
    ['TD', '235'], ['CL', '56'], ['CN', '86'], ['CO', '57'], ['KM', '269'], ['CG', '242'],
    ['CD', '243'], ['CR', '506'], ['CI', '225'], ['HR', '385'], ['CU', '53'], ['CY', '357'],
    ['CZ', '420'], ['DK', '45'], ['DJ', '253'], ['EC', '593'], ['EG', '20'], ['SV', '503'],
    ['GQ', '240'], ['ER', '291'], ['EE', '372'], ['SZ', '268'], ['ET', '251'], ['FJ', '679'],
    ['FI', '358'], ['FR', '33'], ['GA', '241'], ['GM', '220'], ['GE', '995'], ['DE', '49'],
    ['GH', '233'], ['GI', '350'], ['GR', '30'], ['GT', '502'], ['GN', '224'], ['GW', '245'],
    ['GY', '592'], ['HT', '509'], ['HN', '504'], ['HK', '852'], ['HU', '36'], ['IS', '354'],
    ['IN', '91'], ['ID', '62'], ['IR', '98'], ['IQ', '964'], ['IE', '353'], ['IL', '972'],
    ['IT', '39', true], ['JP', '81'], ['JO', '962'], ['KZ', '7'], ['KE', '254'], ['KW', '965'],
    ['KG', '996'], ['LA', '856'], ['LV', '371'], ['LB', '961'], ['LS', '266'], ['LR', '231'],
    ['LY', '218'], ['LI', '423'], ['LT', '370'], ['LU', '352'], ['MO', '853'], ['MG', '261'],
    ['MW', '265'], ['MY', '60'], ['MV', '960'], ['ML', '223'], ['MT', '356'], ['MR', '222'],
    ['MU', '230'], ['MX', '52'], ['MD', '373'], ['MC', '377'], ['MN', '976'], ['ME', '382'],
    ['MA', '212'], ['MZ', '258'], ['MM', '95'], ['NA', '264'], ['NP', '977'], ['NL', '31'],
    ['NZ', '64'], ['NI', '505'], ['NE', '227'], ['NG', '234'], ['MK', '389'], ['NO', '47'],
    ['OM', '968'], ['PK', '92'], ['PS', '970'], ['PA', '507'], ['PG', '675'], ['PY', '595'],
    ['PE', '51'], ['PH', '63'], ['PL', '48'], ['PT', '351'], ['QA', '974'], ['RO', '40'],
    ['RU', '7'], ['RW', '250'], ['SM', '378', true], ['SA', '966'], ['SN', '221'], ['RS', '381'],
    ['SC', '248'], ['SL', '232'], ['SG', '65'], ['SK', '421'], ['SI', '386'], ['SO', '252'],
    ['ZA', '27'], ['KR', '82'], ['SS', '211'], ['ES', '34'], ['LK', '94'], ['SD', '249'],
    ['SR', '597'], ['SE', '46'], ['CH', '41'], ['SY', '963'], ['TW', '886'], ['TJ', '992'],
    ['TZ', '255'], ['TH', '66'], ['TL', '670'], ['TG', '228'], ['TN', '216'], ['TR', '90'],
    ['TM', '993'], ['UG', '256'], ['UA', '380'], ['AE', '971'], ['GB', '44'], ['US', '1'],
    ['UY', '598'], ['UZ', '998'], ['VA', '39', true], ['VE', '58'], ['VN', '84'], ['YE', '967'],
    ['ZM', '260'], ['ZW', '263'],
]

// The value used when the person wants to type the whole international number themselves.
export const OTHER_COUNTRY = 'OTHER'

function regionName(code) {
    try {
        return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
    } catch {
        return code
    }
}

const entries = CODES.map(([code, dial, keepZero = false]) => ({ code, dial, keepZero, name: regionName(code) }))
entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))

// "searchText" is what the search box matches against: the name, the calling code with and without
// the plus sign ("+91" and "91" both find India), and the two-letter code ("in").
export const COUNTRY_OPTIONS = [
    ...entries.map((entry) => ({
        value: entry.code,
        label: `${entry.name} (+${entry.dial})`,
        searchText: `${entry.name} +${entry.dial} ${entry.dial} ${entry.code}`,
    })),
    { value: OTHER_COUNTRY, label: 'Other: type the full number', searchText: 'other full number international' },
]

const byCode = new Map(entries.map((entry) => [entry.code, entry]))

// Returns { dial, keepZero } for a country code, or null for "Other" and anything unknown.
export const getCountry = (code) => byCode.get(code) ?? null

// The country that is selected when the tool opens.
export const DEFAULT_COUNTRY = 'IN'