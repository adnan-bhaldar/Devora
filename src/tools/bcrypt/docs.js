const docs = {
    about:
        'bcrypt is a way to store passwords safely. It turns a password into a hash on purpose slowly, so an attacker who steals the hashes cannot try billions of guesses per second. Make a bcrypt hash here, or check whether a password matches a hash you already have.',
    howItWorks: [
        'Choose “Generate a hash”, type a password, pick a cost, and press Generate. The hash appears with its version and the time it took.',
        'The cost is a number of rounds that is used as a power of two: cost 10 means 1,024 rounds and cost 11 means twice the work. Higher is safer but slower. Choose the highest cost that still feels fast on your server (about 10 to 12 is common today).',
        'Choose “Check a password”, type the password and paste the hash, then press Check. You see whether they match.',
        'Every hash contains its own random salt, so the same password gives a different hash each time. That is normal. It is why you check a password with the check mode, not by comparing two hashes.',
    ],
    notes: [
        'A bcrypt hash is 60 characters: the version ($2b$), the cost (10), a 22-character salt, and a 31-character hash.',
        'Versions: $2b$ is the current one. $2a$ is older and still common. $2y$ is the PHP name for the same fixed algorithm (PHP’s password_hash makes $2y$ hashes). They all give the same result for the same password and salt, so any of them can be checked here.',
        'bcrypt only reads the first 72 bytes of a password. Longer passwords are cut off, and some letters take more than one byte. If you must accept long passwords, many sites hash them with SHA-256 first, but check what your library does.',
        'Costs go from 4 to 14 when generating, and hashes up to cost 15 can be checked. Higher costs would keep your browser busy for minutes.',
        'This is a pure JavaScript version of bcrypt, so it is slower than a server library. A cost that feels slow here is faster on a real server, so do not choose your production cost from the timing shown.',
        'For real accounts, hash passwords on your server with a tested library, never in the browser, and use a unique salt for each user (bcrypt does this for you). Use this page for learning, testing, and checking a hash by hand.',
        'Argon2id and scrypt are newer password hashes that are also considered good choices. bcrypt is still widely used and is fine when the cost is high enough.',
    ],
    privacy:
        'Hashing and checking happen in your browser. Your password and hash are not sent to a server, not saved by Devora, and not placed in the page address. “Copy link” shares only the mode, cost, and version.',
}

export default docs