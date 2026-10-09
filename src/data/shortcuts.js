export const modKeyLabel =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'

// Documented on the About page and hinted in the command palette.
export const shortcuts = [
    { id: 'palette', keys: [modKeyLabel, 'K'], description: 'Open the command palette' },
    { id: 'search', keys: ['/'], description: 'Focus the tool search on the home page' },
    { id: 'close', keys: ['Esc'], description: 'Close dialogs and menus' },
]