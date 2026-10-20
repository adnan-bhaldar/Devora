const docs = {
    about:
        'Build a .gitignore file for your project by ticking the languages, frameworks, editors, and operating systems you use. The rules are combined into one file that you can copy or download.',
    howItWorks: [
        'Start from a quick-start combination such as “Next.js app”, or tick the boxes yourself. Use the search box to find a template quickly.',
        'The .gitignore on the right updates as you tick boxes. Each template becomes its own section, always in the same order.',
        'Add your own rules in the box under “Your own rules”. They are put at the end of the file.',
        'Copy the text, or download it, and save it as a file named .gitignore in the root folder of your repository. Some browsers remove the dot from the start of a downloaded file’s name (you get “gitignore”), so rename it if that happens.',
    ],
    notes: [
        'A .gitignore only affects files that Git is not tracking yet. If a file was already committed, ignoring it later does nothing until you stop tracking it with “git rm --cached <file>”.',
        'Each line is a pattern. A * matches any characters inside a name, ** matches folders at any depth, a / at the end matches only folders, a / at the start anchors the pattern to the root, and a ! at the start brings a file back.',
        'Order matters: a later rule can override an earlier one, so keep any “!” exceptions after the rule they undo.',
        '“Remove duplicate rules” keeps only the first copy of a rule that appears in more than one template (for example .DS_Store). If you turn it off, every template is shown in full.',
        'Never rely on .gitignore to protect secrets that were already committed. A secret that has been pushed once should be treated as leaked and replaced.',
        'Most templates come from the open-source github/gitignore project (CC0 license) and are trimmed: comments and blank lines are removed. The React, Vue, Svelte, Vite, Nuxt, SvelteKit, Django, and .env templates are short lists written for Devora. Always check the result against your own project.',
        'Commit the .gitignore file itself so everyone who clones the project gets the same rules.',
    ],
    privacy:
        'The file is built in your browser. Your choices and your own rules are not sent to a server and are not saved by Devora. “Copy link” shares only which templates are ticked and two checkboxes, never your own rules.',
}

export default docs