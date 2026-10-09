import { lazy } from 'react'
import ToolDocs from '../components/tools/ToolDocs.jsx'

/*
 * Tool module contract. A tool lives in src/tools/<name>/index.jsx and:
 *   - default-exports its workspace component
 *   - optionally exports `docs` (see ToolDocs for the shape)
 * lazyTool() loads the module on demand and appends its documentation, so every
 * tool page gets the same structure without each tool repeating it.
 *
 * Registering a tool (after adding its entry to src/data/tools.js):
 *   base64: lazyTool(() => import('./base64/index.jsx')),
 */
export function lazyTool(loader) {
    return lazy(async () => {
        const { default: Tool, docs } = await loader()
        return {
            default: function ToolWithDocs() {
                return (
                    <>
                        <Tool />
                        {docs && <ToolDocs docs={docs} />}
                    </>
                )
            },
        }
    })
}

export const toolComponents = {}