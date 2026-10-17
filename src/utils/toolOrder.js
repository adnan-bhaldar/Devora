// A category shows this many tools on the home page. When it has more, a "Show all" card takes
// the next place and opens the category page, so the home page stays short however many tools exist.
export const PREVIEW_COUNT = 5

// Finished tools come first, so unfinished ones never push them out of the first places.
export function sortLiveFirst(tools) {
    return [...tools].sort((a, b) => Number(b.status === 'live') - Number(a.status === 'live'))
}