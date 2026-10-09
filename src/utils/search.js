import { categories, tools } from '../data/tools.js'

const categoryNames = new Map(categories.map((category) => [category.id, category.name.toLowerCase()]))

// Higher score = better match. A token that matches nothing returns 0.
function scoreToken(tool, token) {
    const name = tool.name.toLowerCase()
    if (name.startsWith(token)) return 100
    if (name.split(/\s+/).some((word) => word.startsWith(token))) return 80
    if (name.includes(token)) return 60
    if (tool.keywords.some((keyword) => keyword.toLowerCase() === token)) return 50
    if (tool.keywords.some((keyword) => keyword.toLowerCase().includes(token))) return 30
    if (tool.categories.some((id) => categoryNames.get(id)?.includes(token))) return 20
    if (tool.description.toLowerCase().includes(token)) return 10
    return 0
}

// Every word in the query must match; results are ranked by total score.
export function searchTools(query, pool = tools) {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return pool

    return pool
        .map((tool) => {
            let total = 0
            for (const token of tokens) {
                const score = scoreToken(tool, token)
                if (score === 0) return null
                total += score
            }
            return { tool, score: total }
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .map((result) => result.tool)
}