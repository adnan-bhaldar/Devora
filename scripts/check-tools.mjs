/*
 * Checks the tool registry (src/data/tools.js) against the rest of the project, so mistakes
 * made while adding a tool are caught immediately instead of showing up as a broken page.
 * Run it with: npm run check:tools
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { categories, tools } from '../src/data/tools.js'

// fileURLToPath (rather than URL.pathname) gives a correct path on Windows too.
const root = fileURLToPath(new URL('..', import.meta.url))
const problems = []
const problem = (message) => problems.push(message)

const RESERVED_ROUTES = ['/', '/about', '/whats-new', '/_playground', '/categories']
const STATUSES = ['live', 'coming-soon']
const categoryIds = new Set(categories.map((category) => category.id))

// ---- Every category ----
const css = readFileSync(join(root, 'src/index.css'), 'utf8')
for (const category of categories) {
    if (!css.includes(`[data-tone='${category.id}']`)) {
        problem(`Category "${category.id}" has no colour: add a [data-tone='${category.id}'] block in src/index.css.`)
    }
}

// ---- Every tool ----
const seenIds = new Set()
const seenRoutes = new Set()

for (const tool of tools) {
    const label = `Tool "${tool.id ?? tool.name ?? '?'}"`

    if (!tool.id || !/^[a-z0-9-]+$/.test(tool.id)) problem(`${label}: id must be lowercase letters, numbers and hyphens.`)
    if (seenIds.has(tool.id)) problem(`${label}: id is used twice.`)
    seenIds.add(tool.id)

    if (!tool.route?.startsWith('/')) problem(`${label}: route must start with "/".`)
    if (RESERVED_ROUTES.includes(tool.route) || tool.route?.startsWith('/categories/')) {
        problem(`${label}: route ${tool.route} is reserved.`)
    }
    if (seenRoutes.has(tool.route)) problem(`${label}: route ${tool.route} is used twice.`)
    seenRoutes.add(tool.route)

    for (const field of ['name', 'description']) {
        if (typeof tool[field] !== 'string' || tool[field].trim() === '') problem(`${label}: ${field} is missing.`)
    }
    if (!tool.icon) problem(`${label}: icon is missing.`)
    if (!Array.isArray(tool.keywords) || tool.keywords.length === 0) problem(`${label}: keywords are missing.`)
    if (!STATUSES.includes(tool.status)) problem(`${label}: status must be one of ${STATUSES.join(', ')}.`)
    if (!tool.seo?.title || !tool.seo?.description) problem(`${label}: seo.title and seo.description are required.`)

    if (!Array.isArray(tool.categories) || tool.categories.length === 0) {
        problem(`${label}: needs at least one category.`)
    } else {
        for (const id of tool.categories) {
            if (!categoryIds.has(id)) problem(`${label}: unknown category "${id}".`)
        }
    }

    const folder = join(root, 'src/tools', tool.id ?? '')
    if (tool.status === 'live') {
        if (!existsSync(join(folder, 'index.jsx'))) problem(`${label} is "live" but src/tools/${tool.id}/index.jsx does not exist.`)
        if (!existsSync(join(folder, 'docs.js'))) problem(`${label} is "live" but src/tools/${tool.id}/docs.js does not exist.`)
    }
}

// ---- Folders with no registry entry ----
const toolsDirectory = join(root, 'src/tools')
for (const entry of readdirSync(toolsDirectory, { withFileTypes: true })) {
    if (entry.isDirectory() && !seenIds.has(entry.name)) {
        problem(`Folder src/tools/${entry.name}/ has no entry in src/data/tools.js (the folder name must equal the tool's id).`)
    }
}

if (problems.length > 0) {
    console.error(`Tool registry: ${problems.length} problem${problems.length === 1 ? '' : 's'} found\n`)
    for (const message of problems) console.error(`  ✗ ${message}`)
    process.exitCode = 1
} else {
    const live = tools.filter((tool) => tool.status === 'live').length
    console.log(`Tool registry OK: ${tools.length} tools (${live} live), ${categories.length} categories.`)
}