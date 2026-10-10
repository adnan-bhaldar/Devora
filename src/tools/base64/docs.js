const docs = {
    about:
        'Convert text to Base64 and Base64 back to text. Base64 writes any data using only letters, numbers, and a few symbols, which makes it safe to place in formats that only accept plain text, such as JSON, URLs, HTML, or email.',
    howItWorks: [
        'Your text is turned into bytes using UTF-8, so emoji and non-English characters work.',
        'The bytes are split into groups of three, and each group is written as four characters from a 64-character alphabet (A–Z, a–z, 0–9, + and /).',
        'If the last group is short, = characters pad the result to a multiple of four. The URL-safe option swaps + and / for - and _ and leaves out the padding.',
        'Decoding reverses the steps: each character becomes six bits, the bits are regrouped into bytes, and the bytes are read as UTF-8 text.',
    ],
    example: {
        input: 'Hello, Devora!',
        output: 'SGVsbG8sIERldm9yYSE=',
    },
    notes: [
        'Base64 is an encoding, not encryption. Anyone can decode it, so never use it to hide passwords or other secrets.',
        'Encoded output is about one third larger than the original.',
        'The decoder accepts standard and URL-safe Base64, ignores spaces and line breaks, and does not require = padding.',
        'This tool decodes to text. If the Base64 contains other data, such as an image or a file, it shows an error instead of unreadable characters.',
    ],
    privacy:
        'Encoding and decoding happen in your browser using built-in browser functions. The text you enter is not sent to a server, and Devora does not save it.',
}

export default docs