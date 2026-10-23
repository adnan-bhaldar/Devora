export const MODES = [
    { value: 'text', label: 'Text to ASCII art' },
    { value: 'image', label: 'Image to ASCII art' },
]

// How big the result is drawn. Pictures use smaller characters than text, because they have many more per line.
export const SIZES = [
    { value: 's', label: 'Small', text: 0.75, image: 0.5 },
    { value: 'm', label: 'Medium', text: 1, image: 0.625 },
    { value: 'l', label: 'Large', text: 1.5, image: 0.875 },
    { value: 'xl', label: 'Extra large', text: 2, image: 1.25 },
]

export const DEFAULT_SETTINGS = {
    mode: 'text',
    font: 'standard',
    layout: 'default',
    fill: 'font',
    columns: 80,
    contrast: 100,
    brightness: 100,
    charset: 'classic',
    invert: false,
    size: 'm',
}

export const isDefaultSettings = (settings) => Object.keys(DEFAULT_SETTINGS).every((key) => settings[key] === DEFAULT_SETTINGS[key])