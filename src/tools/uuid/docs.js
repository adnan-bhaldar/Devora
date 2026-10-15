const docs = {
    about:
        'Generate random UUIDs (universally unique identifiers), the 36-character IDs such as 3b241101-e2bb-4255-8caf-4136c566a962 that developers use as database keys, file names, and request IDs.',
    howItWorks: [
        'A UUID is a 128-bit number written as 32 hexadecimal digits in five groups separated by hyphens (8-4-4-4-12).',
        'Devora makes version 4 UUIDs, where 122 of the 128 bits are random. The remaining six bits are fixed: they mark the version (the first digit of the third group is always 4) and the layout (the first digit of the fourth group is 8, 9, a, or b).',
        'The browser’s crypto.randomUUID() creates them. On pages that are not served over HTTPS, where that function is not available, Devora builds the same kind of UUID from crypto.getRandomValues.',
        'The uppercase and no-hyphen options only change how a UUID is written. It is still the same UUID.',
    ],
    notes: [
        'A UUID is an identifier, not a secret. Do not rely on one being hard to guess to protect access to something. Use a proper secret token or a password for that.',
        'Two random version 4 UUIDs colliding is astronomically unlikely, but it is not mathematically impossible.',
        'Only version 4 (random) UUIDs are supported. Time-based versions such as 1 and 7 are not.',
        'Changing the count keeps the UUIDs you already have and adds or removes them at the end. Press Regenerate for a completely new set.',
        'You can generate up to 100 UUIDs at a time.',
    ],
    privacy:
        'UUIDs are generated in your browser. They are not sent to a server and Devora does not save them. They disappear when you clear them or leave the page.',
}

export default docs