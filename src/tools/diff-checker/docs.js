const docs = {
    about:
        'Paste two versions of a text, or open two files, and see what changed between them. Added lines are green, removed lines are red, and the exact words or characters that changed inside a line are highlighted more strongly.',
    howItWorks: [
        'Put the older text in Original text and the newer text in Changed text. You can type, paste, use Open file, or drop a file onto a box. The comparison updates as you type.',
        'Side by side shows the two texts in two columns, with matching lines next to each other. Unified shows one column with removed lines above added lines, the way Git shows changes. Small screens start in Unified.',
        'Highlight changes inside a line by decides how much of a changed line is marked. Smart marks words, but skips lines that are mostly different. Word and Character always mark inside the line. Line marks whole lines only.',
        'Ignore whitespace treats lines as the same when only spaces or tabs differ. Ignore upper and lower case treats Hello and hello as the same.',
        'Hide unchanged lines folds long stretches of identical lines and keeps three lines around each change. Click “Show unchanged lines” on a fold to open it.',
        'Swap exchanges the two texts. Copy diff and Download .patch give you the changes as a unified diff, which Git and most editors understand.',
    ],
    notes: [
        'The texts never leave your browser. Nothing is uploaded or saved, and the link from Copy link shares only your display choices, never the texts.',
        'The patch is made from the exact texts, so the ignore options do not affect it.',
        'Files can be up to 2 MB and must be text. Comparing more than 20,000 lines is refused, because it would make the page slow.',
        'Lines are compared one at a time, so moving a block of text shows as one removal and one addition.',
        'Very long lines (over 2,000 characters) are shown as whole-line changes without word highlights.',
    ],
    privacy: 'Everything happens in your browser. Your texts and files are not sent to any server.',
}

export default docs