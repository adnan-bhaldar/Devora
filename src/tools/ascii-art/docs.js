const docs = {
    about:
        'Turn text into large banner lettering, or turn a picture into a drawing made of characters. Copy the result into a README, a terminal welcome message, a code comment, or a plain text file, or download it as a .txt file.',
    howItWorks: [
        'Text mode: type a word or a short line, then choose a font. The art updates as you type. Each line you type is drawn on its own.',
        'Letter spacing sets how close the letters sit: the font’s own spacing, full spacing, fitted (letters touch), or smushed (letters overlap where they can). Fill swaps every character of the art for one of your choice, such as # or a solid block.',
        'Image mode: drop in a picture. Each small block of the picture becomes one character, darker areas get heavier characters, and lighter areas get lighter ones. Width is the number of characters per line.',
        'Contrast makes the dark and light areas more different, and brightness makes the whole picture lighter or darker (100 leaves it unchanged). Invert swaps dark and light, which looks better when you paste the art on a dark background.',
        'Character set picks the characters used, from the short “Simple” list to the long “Detailed” one, or solid blocks.',
        'Text size under the result makes the art larger or smaller on screen. It does not change what you copy or download.',
        'Copy puts the art on your clipboard exactly as shown, and Download saves it as ascii-art.txt.',
    ],
    notes: [
        'ASCII art only looks right in a monospaced (fixed-width) font, where every character is the same width. In a normal font the lines drift out of line. In a README, put the art inside a code block (three backticks).',
        'Text mode uses the figlet fonts. They cover letters, numbers, spaces, and common punctuation. Characters a font does not have, such as emoji, are left out or shown as spaces.',
        'Text can be up to 200 characters. Each font is downloaded the first time you choose it.',
        'Image mode works best with high-contrast pictures such as logos, silhouettes, and portraits. A character is about twice as tall as it is wide, so the picture is squeezed to keep its proportions.',
        'Transparent parts of a picture count as white. Pictures can be up to 10 MB.',
        'Text art is never wrapped, so a long line makes wide art that you scroll sideways. Use shorter lines (press Enter to start a new line) to keep it narrow. For pictures, lower the width.',
        'The Blocks and Fill options use characters outside plain ASCII (such as █), so a file that uses them needs UTF-8 encoding. Almost every editor handles that.',
        '“Copy link” shares your choices (mode, font, and settings), never your text or picture.',
    ],
    privacy:
        'Everything happens in your browser. Your text and pictures are not uploaded or saved, and the fonts are downloaded from Devora’s own site.',
}

export default docs