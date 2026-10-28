// A category shows this many tools on the home page. When it has more, a "Show all" card takes
// the next place and opens the category page, so the home page stays short however many tools exist.
export const PREVIEW_COUNT = 5

// Finished tools come first, so unfinished ones never push them out of the first places.
export function sortLiveFirst(tools) {
    return [...tools].sort((a, b) => Number(b.status === 'live') - Number(a.status === 'live'))
}

// The home page shows this many categories, in the order they are listed in tools.js, followed by a
// "Show all categories" card. If every category fits in the same number of places (the five plus the card),
// they are all shown and the card is left out, so a short list never looks cut off.
export const CATEGORY_PREVIEW_COUNT = 5

export function previewCategories(categories) {
    const hasMore = categories.length > CATEGORY_PREVIEW_COUNT + 1
    return { shown: hasMore ? categories.slice(0, CATEGORY_PREVIEW_COUNT) : categories, hasMore }
}