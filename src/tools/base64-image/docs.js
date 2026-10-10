const docs = {
    about:
        'Convert an image into a Base64 string you can embed directly in HTML, CSS, or JSON, or turn a Base64 string back into an image you can preview and download.',
    howItWorks: [
        'Choose a mode: Image → Base64 or Base64 → Image.',
        'Image → Base64: drop an image on the box or click to choose one. Its bytes are read in your browser and written as Base64. A data URI adds a prefix such as data:image/png;base64, so the result can be used directly as an image source.',
        'Base64 → Image: paste a data URI or raw Base64. Devora decodes the bytes, works out the real image type from the first bytes of the data, and shows a preview you can download.',
    ],
    example: {
        input: 'A small image file, such as logo.png',
        output: 'data:image/png;base64,iVBORw0KGgo…',
    },
    notes: [
        'Supported types are PNG, JPEG, GIF, WebP, SVG, BMP, and AVIF, up to 5 MB.',
        'Base64 is about one third larger than the image file. For large images, a normal image file is usually a better choice than a data URI.',
        'Long results show only the first 20,000 characters on screen. The copy button copies the full text.',
        'The image type is detected from the data itself. The type written in front of a data URI is ignored if it is different.',
        'Decoding only checks that the data is a recognizable image. It does not check that the image is safe or trustworthy.',
        'SVG files can contain scripts. Devora shows them as images, where scripts do not run, but be careful about opening a downloaded SVG file directly in a browser tab.',
    ],
    privacy:
        'Images are read and converted in your browser. They are not uploaded to a server, and Devora does not save them.',
}

export default docs