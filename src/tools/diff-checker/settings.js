// Side by side needs room, so narrow screens start with the unified (single column) view.
export const defaultView = () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 'unified' : 'split')

export const DEFAULT_SETTINGS = {
    view: 'split',
    precision: 'smart',
    ignoreWhitespace: false,
    ignoreCase: true,
    hideUnchanged: true,
    wrap: true,
}

// Whether the options are still the starting ones. The view does not count, because its start depends on the screen.
export const isDefaultSettings = (settings) =>
    Object.keys(DEFAULT_SETTINGS).every((key) => key === 'view' || settings[key] === DEFAULT_SETTINGS[key])