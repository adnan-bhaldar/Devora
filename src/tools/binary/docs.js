const docs = {
    about:
        'Convert text to binary and binary back to text. Computers store text as numbers, and binary writes those numbers using only the digits 0 and 1.',
    howItWorks: [
        'Text is converted to bytes using UTF-8. Each character becomes one or more bytes: plain English letters take one byte, while many other characters, such as é or an emoji, take two to four.',
        'Each byte is written as eight binary digits (bits). For example, the letter H is the number 72, which is 01001000.',
        'The bytes are shown separated by spaces so they are easier to read. You can turn that off to get one continuous string.',
        'Binary → Text reverses the steps: spaces and line breaks are ignored, the digits are grouped into bytes, and the bytes are read as UTF-8 text.',
    ],
    example: {
        input: 'Hi',
        output: '01001000 01101001',
    },
    notes: [
        'Only the digits 0 and 1 are accepted, with spaces or line breaks between groups. Each group must be a multiple of 8 digits, so a 7-bit value such as 1001000 needs a leading zero (01001000).',
        'This tool reads and writes UTF-8. The same bits can mean different text in other encodings, such as UTF-16 or Latin-1.',
        'If the bytes are not valid UTF-8 text, the tool shows an error instead of unreadable characters.',
        'Binary here is just another way to write the same data. It is not encryption and does not hide anything.',
    ],
    privacy:
        'Conversion happens in your browser using built-in browser functions. The text you enter is not sent to a server, and Devora does not save it.',
}

export default docs