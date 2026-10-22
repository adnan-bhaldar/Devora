import { createRandomizer } from './random.js'

/*
 * One Faker per locale, loaded only when it is needed (each locale is its own downloadable piece).
 * The default Faker is replaced by our own random source so it can be re-seeded quickly.
 */

// Written out in full so the build can find every locale file.
const LOADERS = {
    en_US: () => import('@faker-js/faker/locale/en_US'),
    en_GB: () => import('@faker-js/faker/locale/en_GB'),
    en_IN: () => import('@faker-js/faker/locale/en_IN'),
    de: () => import('@faker-js/faker/locale/de'),
    fr: () => import('@faker-js/faker/locale/fr'),
    es: () => import('@faker-js/faker/locale/es'),
    pt_BR: () => import('@faker-js/faker/locale/pt_BR'),
    en_AU: () => import('@faker-js/faker/locale/en_AU'),
    en_CA: () => import('@faker-js/faker/locale/en_CA'),
    it: () => import('@faker-js/faker/locale/it'),
    nl: () => import('@faker-js/faker/locale/nl'),
    pl: () => import('@faker-js/faker/locale/pl'),
}

const loaded = new Map()

// Returns { faker, random } where random.seed(number) restarts the sequence.
export function loadFaker(fakerLocale) {
    if (!loaded.has(fakerLocale)) {
        const promise = LOADERS[fakerLocale]().then(({ faker: ready }) => {
            const random = createRandomizer()
            const Faker = ready.constructor
            // The ready-made instance already holds this locale plus English fallbacks.
            return { faker: new Faker({ locale: [ready.rawDefinitions], randomizer: random }), random }
        })
        loaded.set(fakerLocale, promise)
        promise.catch(() => loaded.delete(fakerLocale))
    }
    return loaded.get(fakerLocale)
}