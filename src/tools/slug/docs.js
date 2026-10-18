const docs = {
    about:
        'Turn a title or any text into a slug: the short, URL-friendly part of an address, such as “10-tips-for-writing-better-code” in https://example.com/blog/10-tips-for-writing-better-code.',
    howItWorks: [
        'Type or paste text. Every line becomes its own slug, and the result updates as you type.',
        'Accents on Latin letters are removed (café becomes cafe), and letters such as ß and ø are spelled out (ss, o).',
        'Apostrophes are removed, so “don’t” becomes “dont”. Every other run of spaces, punctuation, and symbols becomes one separator.',
        'Separators are never doubled and never placed at the start or end.',
        'Choose a hyphen, underscore, or dot as the separator. Hyphens are the usual choice for web addresses.',
    ],
    example: {
        input: 'Don’t Repeat Yourself (DRY): A Beginner’s Guide',
        output: 'dont-repeat-yourself-dry-a-beginners-guide',
    },
    notes: [
        'Letters from other alphabets (Greek, Cyrillic, Chinese, Japanese, and so on) are dropped unless you turn on “Keep non-Latin letters”. A line that has nothing left is shown empty, with a message.',
        'Browsers show addresses with non-Latin letters correctly, but they are sent as percent-encoded text such as %E6%97%A5. Many sites prefer Latin-only slugs for that reason.',
        '“Remove small words” drops common words such as “the” and “of”. If a line is made only of such words, they are kept so the slug is not empty.',
        'With a length limit, the slug stops at the last whole word that fits. A first word that is longer than the limit on its own is cut.',
        'A slug should stay stable once published. Changing it later breaks existing links unless you set up a redirect.',
        'Text can be up to 50,000 characters.',
    ],
    privacy:
        'Your text is converted in your browser. It is not sent to a server and Devora does not save it. “Copy link” shares only the options, never your text.',
}

export default docs