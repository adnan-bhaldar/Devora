/*
 * What Faker does not know: which city a postal code or region belongs to. The first seven
 * locales therefore carry a short table of real cities (name, region, postal prefix, rough
 * position), so the city, region, postal code and coordinates of one record agree with each
 * other. The other locales use Faker's own address parts, which are not matched to each other.
 * City coordinates are approximate: good enough for test data, not for maps.
 */

// [name, region, latitude, longitude, postal prefix (or codes), phone area]
const cities = (rows) =>
    rows.map(([name, region, lat, lon, postal, area]) => ({ name, region, lat, lon, postal, area }))

const COMMON_LETTERS = 'ABDEFGHJLNPQRSTUWXYZ' // letters used in the last two characters of a UK postcode

export const LOCALES = [
    {
        id: 'en-US',
        faker: 'en_US',
        label: 'United States (en-US)',
        countryCode: 'US',
        cities: cities([
            ['New York', 'New York', 40.7128, -74.006, '100', '212'],
            ['Los Angeles', 'California', 34.0522, -118.2437, '900', '213'],
            ['Chicago', 'Illinois', 41.8781, -87.6298, '606', '312'],
            ['Houston', 'Texas', 29.7604, -95.3698, '770', '713'],
            ['Phoenix', 'Arizona', 33.4484, -112.074, '850', '602'],
            ['Philadelphia', 'Pennsylvania', 39.9526, -75.1652, '191', '215'],
            ['San Antonio', 'Texas', 29.4241, -98.4936, '782', '210'],
            ['San Diego', 'California', 32.7157, -117.1611, '921', '619'],
            ['Dallas', 'Texas', 32.7767, -96.797, '752', '214'],
            ['Seattle', 'Washington', 47.6062, -122.3321, '981', '206'],
            ['Denver', 'Colorado', 39.7392, -104.9903, '802', '303'],
            ['Boston', 'Massachusetts', 42.3601, -71.0589, '021', '617'],
        ]),
        formatAddress: (number, street) => `${number} ${street}`,
        makePostal: (random, city) => city.postal + random.digits(2),
    },
    {
        id: 'en-GB',
        faker: 'en_GB',
        label: 'United Kingdom (en-GB)',
        countryCode: 'GB',
        cities: cities([
            ['London', 'England', 51.5074, -0.1278, 'EC1A,SW1A,N1,E1,W1D', ''],
            ['Manchester', 'England', 53.4808, -2.2426, 'M1,M2,M3', ''],
            ['Birmingham', 'England', 52.4862, -1.8904, 'B1,B2,B3', ''],
            ['Glasgow', 'Scotland', 55.8642, -4.2518, 'G1,G2,G3', ''],
            ['Edinburgh', 'Scotland', 55.9533, -3.1883, 'EH1,EH2,EH3', ''],
            ['Cardiff', 'Wales', 51.4816, -3.1791, 'CF10,CF11,CF24', ''],
            ['Leeds', 'England', 53.8008, -1.5491, 'LS1,LS2,LS3', ''],
            ['Liverpool', 'England', 53.4084, -2.9916, 'L1,L2,L3', ''],
            ['Bristol', 'England', 51.4545, -2.5879, 'BS1,BS2,BS3', ''],
            ['Belfast', 'Northern Ireland', 54.5973, -5.9301, 'BT1,BT2,BT3', ''],
            ['Newcastle upon Tyne', 'England', 54.9783, -1.6178, 'NE1,NE2,NE3', ''],
            ['Sheffield', 'England', 53.3811, -1.4701, 'S1,S2,S3', ''],
        ]),
        formatAddress: (number, street) => `${number} ${street}`,
        makePostal: (random, city) => {
            const outward = random.pick(city.postal.split(','))
            const letter = () => COMMON_LETTERS[random.int(0, COMMON_LETTERS.length - 1)]
            return `${outward} ${random.int(0, 9)}${letter()}${letter()}`
        },
    },
    {
        id: 'en-IN',
        faker: 'en_IN',
        label: 'India (en-IN)',
        countryCode: 'IN',
        cities: cities([
            ['Mumbai', 'Maharashtra', 19.076, 72.8777, '400', ''],
            ['Delhi', 'Delhi', 28.7041, 77.1025, '110', ''],
            ['Bengaluru', 'Karnataka', 12.9716, 77.5946, '560', ''],
            ['Hyderabad', 'Telangana', 17.385, 78.4867, '500', ''],
            ['Chennai', 'Tamil Nadu', 13.0827, 80.2707, '600', ''],
            ['Kolkata', 'West Bengal', 22.5726, 88.3639, '700', ''],
            ['Pune', 'Maharashtra', 18.5204, 73.8567, '411', ''],
            ['Ahmedabad', 'Gujarat', 23.0225, 72.5714, '380', ''],
            ['Jaipur', 'Rajasthan', 26.9124, 75.7873, '302', ''],
            ['Lucknow', 'Uttar Pradesh', 26.8467, 80.9462, '226', ''],
            ['Kochi', 'Kerala', 9.9312, 76.2673, '682', ''],
            ['Chandigarh', 'Chandigarh', 30.7333, 76.7794, '160', ''],
        ]),
        formatAddress: (number, street) => `${number} ${street}`,
        makePostal: (random, city) => city.postal + random.digits(3),
    },
    {
        id: 'de-DE',
        faker: 'de',
        label: 'Germany (de-DE)',
        countryCode: 'DE',
        cities: cities([
            ['Berlin', 'Berlin', 52.52, 13.405, '10', ''],
            ['Hamburg', 'Hamburg', 53.5511, 9.9937, '20', ''],
            ['München', 'Bayern', 48.1351, 11.582, '80', ''],
            ['Köln', 'Nordrhein-Westfalen', 50.9375, 6.9603, '50', ''],
            ['Frankfurt am Main', 'Hessen', 50.1109, 8.6821, '60', ''],
            ['Stuttgart', 'Baden-Württemberg', 48.7758, 9.1829, '70', ''],
            ['Düsseldorf', 'Nordrhein-Westfalen', 51.2277, 6.7735, '40', ''],
            ['Leipzig', 'Sachsen', 51.3397, 12.3731, '04', ''],
            ['Dresden', 'Sachsen', 51.0504, 13.7373, '01', ''],
            ['Hannover', 'Niedersachsen', 52.3759, 9.732, '30', ''],
            ['Nürnberg', 'Bayern', 49.4521, 11.0767, '90', ''],
            ['Bremen', 'Bremen', 53.0793, 8.8017, '28', ''],
        ]),
        formatAddress: (number, street) => `${street} ${number}`,
        makePostal: (random, city) => city.postal + random.digits(5 - city.postal.length),
    },
    {
        id: 'fr-FR',
        faker: 'fr',
        label: 'France (fr-FR)',
        countryCode: 'FR',
        cities: cities([
            ['Paris', 'Île-de-France', 48.8566, 2.3522, '75', ''],
            ['Marseille', 'Provence-Alpes-Côte d’Azur', 43.2965, 5.3698, '13', ''],
            ['Lyon', 'Auvergne-Rhône-Alpes', 45.764, 4.8357, '69', ''],
            ['Toulouse', 'Occitanie', 43.6047, 1.4442, '31', ''],
            ['Nice', 'Provence-Alpes-Côte d’Azur', 43.7102, 7.262, '06', ''],
            ['Nantes', 'Pays de la Loire', 47.2184, -1.5536, '44', ''],
            ['Strasbourg', 'Grand Est', 48.5734, 7.7521, '67', ''],
            ['Montpellier', 'Occitanie', 43.6108, 3.8767, '34', ''],
            ['Bordeaux', 'Nouvelle-Aquitaine', 44.8378, -0.5792, '33', ''],
            ['Lille', 'Hauts-de-France', 50.6292, 3.0573, '59', ''],
            ['Rennes', 'Bretagne', 48.1173, -1.6778, '35', ''],
            ['Reims', 'Grand Est', 49.2583, 4.0317, '51', ''],
        ]),
        formatAddress: (number, street) => `${number} ${street}`,
        makePostal: (random, city) => city.postal + random.digits(3),
    },
    {
        id: 'es-ES',
        faker: 'es',
        label: 'Spain (es-ES)',
        countryCode: 'ES',
        cities: cities([
            ['Madrid', 'Comunidad de Madrid', 40.4168, -3.7038, '28', ''],
            ['Barcelona', 'Cataluña', 41.3874, 2.1686, '08', ''],
            ['Valencia', 'Comunitat Valenciana', 39.4699, -0.3763, '46', ''],
            ['Sevilla', 'Andalucía', 37.3891, -5.9845, '41', ''],
            ['Zaragoza', 'Aragón', 41.6488, -0.8891, '50', ''],
            ['Málaga', 'Andalucía', 36.7213, -4.4214, '29', ''],
            ['Murcia', 'Región de Murcia', 37.9922, -1.1307, '30', ''],
            ['Bilbao', 'País Vasco', 43.263, -2.935, '48', ''],
            ['Alicante', 'Comunitat Valenciana', 38.3452, -0.481, '03', ''],
            ['Valladolid', 'Castilla y León', 41.6523, -4.7245, '47', ''],
            ['Palma', 'Islas Baleares', 39.5696, 2.6502, '07', ''],
            ['Las Palmas de Gran Canaria', 'Canarias', 28.1235, -15.4363, '35', ''],
        ]),
        formatAddress: (number, street) => `${street}, ${number}`,
        makePostal: (random, city) => city.postal + random.digits(3),
    },
    {
        id: 'pt-BR',
        faker: 'pt_BR',
        label: 'Brazil (pt-BR)',
        countryCode: 'BR',
        cities: cities([
            ['São Paulo', 'São Paulo', -23.5505, -46.6333, '01', '11'],
            ['Rio de Janeiro', 'Rio de Janeiro', -22.9068, -43.1729, '20', '21'],
            ['Brasília', 'Distrito Federal', -15.7939, -47.8828, '70', '61'],
            ['Salvador', 'Bahia', -12.9777, -38.5016, '40', '71'],
            ['Fortaleza', 'Ceará', -3.7319, -38.5267, '60', '85'],
            ['Belo Horizonte', 'Minas Gerais', -19.9167, -43.9345, '30', '31'],
            ['Manaus', 'Amazonas', -3.119, -60.0217, '69', '92'],
            ['Curitiba', 'Paraná', -25.4284, -49.2733, '80', '41'],
            ['Recife', 'Pernambuco', -8.0476, -34.877, '50', '81'],
            ['Porto Alegre', 'Rio Grande do Sul', -30.0346, -51.2177, '90', '51'],
            ['Belém', 'Pará', -1.4558, -48.4902, '66', '91'],
            ['Goiânia', 'Goiás', -16.6869, -49.2648, '74', '62'],
        ]),
        formatAddress: (number, street) => `${street}, ${number}`,
        makePostal: (random, city) => {
            const digits = city.postal + random.digits(8 - city.postal.length)
            return `${digits.slice(0, 5)}-${digits.slice(5)}`
        },
    },
]

// Locales without a city table. Address parts come straight from Faker and are not matched.
// `box` is a rough [south, north, west, east] rectangle around the country, so coordinates at least land in the right country.
const fakerOnly = (id, faker, label, countryCode, box, formatAddress) => ({ id, faker, label, countryCode, cities: null, box, formatAddress })

LOCALES.push(
    fakerOnly('en-AU', 'en_AU', 'Australia (en-AU)', 'AU', [-37, -27, 115, 153], (number, street) => `${number} ${street}`),
    fakerOnly('en-CA', 'en_CA', 'Canada (en-CA)', 'CA', [43, 60, -123, -63], (number, street) => `${number} ${street}`),
    fakerOnly('it-IT', 'it', 'Italy (it-IT)', 'IT', [37, 46, 7, 18], (number, street) => `${street}, ${number}`),
    fakerOnly('nl-NL', 'nl', 'Netherlands (nl-NL)', 'NL', [50.8, 53.4, 3.5, 7.1], (number, street) => `${street} ${number}`),
    fakerOnly('pl-PL', 'pl', 'Poland (pl-PL)', 'PL', [49.2, 54.7, 14.2, 24], (number, street) => `${street} ${number}`),
)

export const DEFAULT_LOCALE = 'en-US'
export const LOCALE_OPTIONS = LOCALES.map((locale) => ({ value: locale.id, label: locale.label }))
export const getLocale = (id) => LOCALES.find((locale) => locale.id === id) ?? LOCALES[0]

// Country name in English, from the browser's own data.
export function countryName(code) {
    try {
        return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
    } catch {
        return code
    }
}