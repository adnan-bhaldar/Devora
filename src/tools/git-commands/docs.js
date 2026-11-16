const docs = {
    about:
        'A searchable reference of ready-to-use Git commands. It starts with the jobs people do most (setting up, committing, branching, syncing with a remote, reading history, undoing mistakes, stashing, merging, rebasing, and tagging) and also has a card for every other command in Git’s own command list, from maintenance and patches by email to the low-level plumbing commands. Each command comes with a plain explanation of what its options do.',
    howItWorks: [
        'Search for a job or a word, or pick a group, to narrow the list. Every word you type must appear in the command, its title, or its explanation.',
        'Press the copy button to copy a command, then paste it into a terminal inside your repository.',
        'Replace the placeholder names (feature/login, path/to/file.txt, <commit>, and so on) with your own before you run it.',
        'Open “What the options mean” on a card to learn what each part of the command does.',
    ],
    notes: [
        'Git is a free command-line program. Devora does not run it for you: these are commands to copy into your own terminal.',
        'Commands that rewrite history (amend, reset, rebase, force push) are safe on commits that only you have, but can cause trouble for commits you have already pushed and shared.',
        'Commands marked as dangerous, such as git reset --hard and git clean -fd, delete work that Git cannot bring back. Check with git status, or a dry run, first.',
        'Committed work is hard to lose for good. git reflog lists where your branches have been, so a commit removed by a reset can usually be found again for a few weeks.',
        '“git switch” and “git restore” need Git 2.23 or newer. On older versions, use “git checkout” instead.',
        'Quote paths that contain spaces, for example git add "my notes.txt".',
        'The cards were checked against Git 2.43. Commands marked as needing a newer version (for example git merge-tree --write-tree) may not exist on older installs, and a few very old commands, such as git whatchanged and git pack-redundant, may ask for --i-still-use-this on recent versions.',
        'Commands with more than one line are meant to be run one after the other. Paste them all, or run each line separately.',
        'Commands are written for macOS and Linux shells. On Windows PowerShell or Command Prompt, quoting rules can differ, and a few examples (such as the password cache helper) may need changes.',
    ],
    privacy:
        'This is a reference. Nothing you type is sent to a server or saved by Devora, and nothing is added to the page address.',
}

export default docs
