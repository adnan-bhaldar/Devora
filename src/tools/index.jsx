import { lazy } from 'react'
import ToolDocs from '../components/tools/ToolDocs.jsx'

/*
 * Tool module contract. A tool lives in src/tools/<name>/ and provides:
 *   - index.jsx  default-exports its workspace component
 *   - docs.js    default-exports its documentation object (see ToolDocs for the shape)
 * lazyTool() loads both on demand and renders the docs under the workspace, so every
 * tool page gets the same structure without each tool repeating it.
 *
 * Registering a tool (after adding its entry to src/data/tools.js):
 *   uuid: lazyTool(() => import('./uuid/index.jsx'), () => import('./uuid/docs.js')),
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

export const toolComponents = {
    gradient: lazyTool(() => import('./gradient/index.jsx'), () => import('./gradient/docs.js')),
    base64: lazyTool(() => import('./base64/index.jsx'), () => import('./base64/docs.js')),
    'base64-image': lazyTool(
        () => import('./base64-image/index.jsx'),
        () => import('./base64-image/docs.js'),
    ),
    binary: lazyTool(() => import('./binary/index.jsx'), () => import('./binary/docs.js')),
    jwt: lazyTool(() => import('./jwt/index.jsx'), () => import('./jwt/docs.js')),
}