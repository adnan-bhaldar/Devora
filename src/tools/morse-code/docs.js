const docs = {
    about:
        'Turn text into Morse code and Morse code back into text, then listen to it or download the sound as a .wav file. Morse code writes every letter, number, and common symbol as a pattern of short signals (dots) and long signals (dashes).',
    howItWorks: [
        'Choose “Text to Morse” or “Morse to text”, then type or paste into the box. The result appears as you type.',
        'In Morse, letters are separated by a space and words by a slash, for example .... .. / - .... . .-. . for “HI THERE”. Each line you type is converted on its own.',
        'Press Play to hear the Morse as beeps, or Download .wav to save the sound. When you are decoding, the sound is made from the Morse you typed.',
        'Speed is measured in words per minute (WPM) using the PARIS standard: one “unit” lasts 1.2 divided by the WPM in seconds, a dash is 3 units, and the gaps are 1 unit inside a letter, 3 between letters, and 7 between words.',
        'Pitch sets how high the beep sounds. Turn on the light to see a lamp flash in time with the sound.',
        'Swap moves the result into the input box and flips the direction, so you can check a message by converting it back.',
    ],
    notes: [
        'The tool uses International Morse code: the letters A to Z, the numbers 0 to 9, and these symbols: . , ? \' ! / ( ) & : ; = + - _ " $ @. The chart below the tool lists every code.',
        'Accents are dropped before encoding, so é becomes E. Characters with no Morse code, such as emoji, are skipped and listed under the result.',
        'Morse has no capital letters, so decoded text is always UPPERCASE.',
        'When decoding, dots and dashes can also be typed as · • or – —. A word break can be a slash, a vertical bar, or three spaces. A group of signals that is not a letter shows as ?, and is listed under the result.',
        'Text can be up to 5,000 characters, and the sound up to 5 minutes long. A higher speed makes a long text shorter.',
        'Playing the sound makes a small audio file in your browser, the same one the download gives you. Browsers need you to press Play before they allow sound.',
        'The flashing light is off by default. Fast flashes can bother people who are sensitive to flashing lights.',
        'The chart and timing here describe the standard. Real operators vary the spacing a little, so Morse sent by hand may not decode perfectly.',
    ],
    privacy:
        'Everything happens in your browser. Your text, the sound, and the downloaded file are not sent to a server and Devora does not save them. “Copy link” shares only the direction, speed, and pitch, never your text.',
}

export default docs
