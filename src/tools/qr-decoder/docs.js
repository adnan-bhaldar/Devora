const docs = {
    about:
        'Read the contents of a QR code from an image. Drop in a screenshot, a photo, or a downloaded QR code and Devora shows the text hidden inside it.',
    howItWorks: [
        'Choose or drop an image that contains a QR code.',
        'Devora draws the image onto a hidden canvas in your browser and looks for the three square corner markers every QR code has.',
        'It reads the pattern of dark and light squares, uses the built-in error-correction data to repair small mistakes, and turns the result into text.',
        'The text is shown with a label for what it looks like (web link, Wi-Fi network, email, and so on). It is shown as plain text, never as a clickable link.',
    ],
    notes: [
        'Decoding a QR code does not check that its content is safe. Codes can point to fake websites or contain misleading text, so check any address carefully before opening it.',
        'Links are deliberately not clickable here. Copy the address and inspect it before you decide whether to visit it.',
        'Only one QR code is read per image. If an image has several, crop it to the one you want.',
        'Very large images are scaled down to 1600 pixels on the long side before scanning, so a tiny code inside a large photo may be missed. Cropping closer to the code helps.',
        'The code needs to be sharp, fully visible, and surrounded by an empty margin. Blurry, damaged, or very small codes may not be read.',
        'Light-on-dark (inverted) codes are tried too. Transparent areas are treated as white.',
        'Images up to 10 MB are accepted. Scanning from a camera is not included.',
    ],
    privacy:
        'The image is opened and scanned in your browser. It is not uploaded to a server, and Devora does not save it or the decoded text.',
}

export default docs