import { TEMPLATES } from './templates.js'

export const MAX_CUSTOM_CHARS = 20000

export const DEFAULT_SETTINGS = { titles: true, dedupe: true }

export function isDefaultSettings(settings) {
    return Object.keys(DEFAULT_SETTINGS).every((key) => settings[key] === DEFAULT_SETTINGS[key])
}

// Ready-made combinations. Choosing one replaces the current selection, and every box can still be changed.
export const PRESETS = [
    { id: 'nextjs', name: 'Next.js app', templates: ['node', 'nextjs', 'dotenv', 'vscode', 'macos', 'windows'] },
    { id: 'react', name: 'React app', templates: ['node', 'react', 'dotenv', 'vscode', 'macos', 'windows'] },
    { id: 'vue', name: 'Vue app', templates: ['node', 'vue', 'dotenv', 'vscode', 'macos', 'windows'] },
    { id: 'svelte', name: 'Svelte app', templates: ['node', 'svelte', 'dotenv', 'vscode', 'macos', 'windows'] },
    { id: 'vite', name: 'React / Vite app', templates: ['node', 'vite', 'dotenv', 'vscode', 'macos', 'windows'] },
    { id: 'node-api', name: 'Node.js API', templates: ['node', 'dotenv', 'vscode', 'macos', 'windows', 'linux'] },
    { id: 'django', name: 'Python / Django', templates: ['python', 'django', 'virtualenv', 'dotenv', 'vscode', 'macos', 'windows'] },
    { id: 'java', name: 'Java (Gradle)', templates: ['java', 'gradle', 'jetbrains', 'macos', 'windows'] },
    { id: 'go', name: 'Go service', templates: ['go', 'dotenv', 'vscode', 'macos', 'windows', 'linux'] },
    { id: 'rust', name: 'Rust', templates: ['rust', 'vscode', 'macos', 'windows', 'linux'] },
    { id: 'laravel', name: 'Laravel', templates: ['laravel', 'php', 'dotenv', 'jetbrains', 'macos', 'windows'] },
    { id: 'rails', name: 'Ruby on Rails', templates: ['ruby', 'rails', 'dotenv', 'vscode', 'macos', 'linux'] },
    { id: 'flutter', name: 'Flutter', templates: ['flutter', 'android', 'xcode', 'vscode', 'macos', 'windows'] },
    { id: 'dotnet', name: '.NET', templates: ['dotnet', 'visualstudio', 'vscode', 'windows'] },
    { id: 'unity', name: 'Unity game', templates: ['unity', 'visualstudio', 'jetbrains', 'macos', 'windows'] },
]

export const TEMPLATE_IDS = TEMPLATES.map((template) => template.id)

// Lowercase text the search box matches against: the name and the id (so "js" and "next" both work).
function searchText(template) {
    return `${template.name} ${template.id}`.toLowerCase()
}

export function filterTemplates(query) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (words.length === 0) return TEMPLATES
    return TEMPLATES.filter((template) => {
        const text = searchText(template)
        return words.every((word) => text.includes(word))
    })
}

/*
 * Joins the chosen templates (always in the order they are listed, so the result is the same
 * however the boxes were ticked) plus the person's own rules into one .gitignore text.
 * Returns { text, ruleCount, sectionCount }.
 *
 * With "dedupe" on, a rule that an earlier section already has is left out of the later one. Only the
 * first copy is kept, and a section with nothing left is skipped.
 */
export function buildGitignore(selectedIds, { titles, dedupe }, customText = '') {
    const chosen = new Set(selectedIds)
    const sections = TEMPLATES.filter((template) => chosen.has(template.id)).map((template) => ({
        title: template.name,
        lines: template.rules.split('\n'),
    }))

    const custom = customText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.trim() !== '')
    if (custom.length > 0) sections.push({ title: 'Your own rules', lines: custom })

    const seen = new Set()
    const blocks = []
    let ruleCount = 0

    for (const section of sections) {
        const lines = section.lines.filter((line) => {
            // Comment lines in the person's own rules are kept and never counted as rules or duplicates.
            if (line.startsWith('#')) return true
            if (dedupe && seen.has(line)) return false
            seen.add(line)
            return true
        })
        const rules = lines.filter((line) => !line.startsWith('#'))
        if (rules.length === 0) continue

        ruleCount += rules.length
        blocks.push([...(titles ? [`# ${section.title}`] : []), ...lines].join('\n'))
    }

    return { text: blocks.length > 0 ? `${blocks.join('\n\n')}\n` : '', ruleCount, sectionCount: blocks.length }
}