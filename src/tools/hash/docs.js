const docs = {
    about:
        'Generate a SHA-256, SHA-384, or SHA-512 hash of any text. A hash is a short, fixed-length fingerprint of data: the same input always gives the same hash, and any change to the input gives a completely different one.',
    howItWorks: [
        'Your text is converted to bytes using UTF-8.',
        'The bytes are passed to your browser’s built-in Web Crypto API, which calculates the SHA-2 hash you chose.',
        'The result is shown as hexadecimal (the usual way to write hashes), uppercase hexadecimal, or Base64.',
    ],
    notes: [
        'Hashing is one-way. It is not encryption, and the original text cannot be recovered from a hash. Short or common inputs can still be guessed by trying many candidates and comparing hashes.',
        'Every character counts, including spaces and line breaks. A trailing newline gives a different hash, which is a common reason two hashes do not match.',
        'Do not use a plain SHA hash to store passwords. Password storage needs a deliberately slow, salted algorithm such as Argon2, scrypt, or bcrypt.',
        'MD5 and SHA-1 are not offered. They are broken for security uses, and MD5 is not available in the browser’s Web Crypto API.',
        'Text is hashed as UTF-8. The same text in another encoding gives a different hash. Hashing files is not supported.',
        'Hashing needs a secure connection (HTTPS or localhost), because browsers only provide the Web Crypto API there.',
    ],
    privacy:
        'Hashes are calculated in your browser using the built-in Web Crypto API. The text you enter is not sent to a server, not saved by Devora, and not placed in the page address.',
}

export default docs