import { lazy } from 'react'
import ToolDocs from '../components/tools/ToolDocs.jsx'

/*
 * Tool module contract. A tool lives in src/tools/<name>/ and provides:
 *   - index.jsx  default-exports its workspace component
 *   - docs.js    default-exports its documentation object (see ToolDocs for the shape)
 * lazyTool() loads both on demand and renders the docs under the workspace, so every
 * tool page gets the same structure without each tool repeating it.
 *
 * Registering a tool needs nothing here: create the folder, and add its entry to
 * src/data/tools.js (see the note above toolComponents below).
 */
export function lazyTool(loadTool, loadDocs) {
    return lazy(async () => {
        const [toolModule, docsModule] = await Promise.all([loadTool(), loadDocs?.()])
        const Tool = toolModule.default
        const docs = docsModule?.default

        function ToolWithDocs() {
            return (
                <>
                    <Tool />
                    {docs && <ToolDocs docs={docs} />}
                </>
            )
        }

        return { default: ToolWithDocs }
    })
}

// Every folder in src/tools/ that has an index.jsx is registered automatically, under its
// folder name. That name must match the tool's `id` in src/data/tools.js. A registry entry with
// no folder yet simply shows the "coming soon" page.
const toolModules = import.meta.glob('./*/index.jsx')
const docsModules = import.meta.glob('./*/docs.js')

export const toolComponents = Object.fromEntries(
    Object.entries(toolModules).map(([path, loadTool]) => {
        const id = path.split('/')[1]
        return [id, lazyTool(loadTool, docsModules[`./${id}/docs.js`])]
    }),
)