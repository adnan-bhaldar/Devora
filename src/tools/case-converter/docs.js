const docs = {
    about:
        'Change the case of any text in one step: UPPERCASE, lowercase, Title Case, and Sentence case for writing, and camelCase, PascalCase, snake_case, kebab-case, and more for variable names, file names, and web addresses.',
    howItWorks: [
        'Type or paste text. Every case is shown at once and updates as you type.',
        'The “For writing” cases keep your spaces, punctuation, and line breaks and only change the letters.',
        'The “For code” cases split the text into words and join them again in the new style. Words are found at spaces, symbols, underscores, hyphens, and where a lower-case letter meets a capital (userId becomes user and id).',
        'Each line is converted on its own, so you can paste a list of names and get a list of identifiers.',
        'Use the copy button next to the style you need.',
    ],
    example: {
        input: 'XMLHttpRequest and user_id',
        output: 'snake_case: xml_http_request_and_user_id    camelCase: xmlHttpRequestAndUserId',
    },
    notes: [
        'Capital letters in a row are treated as one word until the last one, so “XMLHttpRequest” is split into XML, Http, and Request.',
        'Apostrophes are removed in the code cases (“don’t” becomes dont). Digits stay with the word they touch, so “version2” stays one word.',
        'Header-Case is also called Train-Case. COBOL-CASE is the same as Header-Case but all capitals.',
        'Title Case capitalizes every word by default. Turn on the option to keep small words such as “the” and “of” in lower case (not at the start or end of a line). Style guides differ, so check the result against the guide you follow.',
        'Sentence case puts a capital letter at the start of each line and after a full stop, question mark, or exclamation mark. Names, the word “I”, and acronyms are lowered too, so fix those by hand.',
        'Letters with accents and letters from other alphabets are supported. Characters that are not letters or digits, such as emoji, are dropped from the code cases.',
        'Text can be up to 100,000 characters.',
    ],
    privacy:
        'Your text is converted in your browser. It is not sent to a server and Devora does not save it. “Copy link” shares only the options, never your text.',
}

export default docs