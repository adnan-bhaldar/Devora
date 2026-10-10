const docs = {
    about:
        'Turn text or a web address into a QR code you can download as an image (PNG) or as a scalable vector file (SVG). Scan it with a phone camera to open a link, read a message, or copy text.',
    howItWorks: [
        'Enter text or a URL. Spaces and line breaks at the start and end are removed.',
        'Devora encodes the text as a pattern of dark and light squares, called modules, and adds error-correction data so the code can still be read if part of it is dirty or damaged.',
        'Choose how much error correction to add, how wide the empty margin around the code is, the colors, and the size for downloads.',
        'Download the code as PNG or SVG, or copy the SVG code.',
    ],
    example: {
        input: 'https://example.com',
        output: 'A square QR code that opens https://example.com when scanned.',
    },
    notes: [
        'Higher error-correction levels let a code survive more damage but make it denser, which holds less text and can be harder to scan from a distance. Medium is a good default.',
        'At the Medium level a QR code holds roughly 2,300 characters of ordinary text. Emoji and non-English text use more space. Shorter text gives a simpler code that is easier to scan.',
        'Keep a clear margin around the code (4 modules is the standard) and use dark modules on a light background. Light-on-dark codes and low-contrast colors do not scan on some devices.',
        'The PNG size is a minimum. Every module is made a whole number of pixels wide so the edges stay sharp, so the file can be a little larger than the size you pick.',
        'A QR code is not encrypted. Anyone who scans it can read what is inside, so never put passwords or other secrets in one.',
        'Test every code with a real scanner before you print or share it.',
    ],
    privacy:
        'The QR code is generated in your browser. The text you enter is not sent to a server, not saved by Devora, and not placed in the page address.',
}

export default docs