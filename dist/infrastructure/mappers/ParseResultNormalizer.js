export function normalizeParseResult(parseResult) {
    if (Array.isArray(parseResult)) {
        return {
            products: parseResult,
            pagination: null,
        };
    }
    if (parseResult && typeof parseResult === "object") {
        const { products = [], pagination = null } = parseResult;
        return {
            products: Array.isArray(products) ? products : [],
            pagination,
        };
    }
    return {
        products: [],
        pagination: null,
    };
}
