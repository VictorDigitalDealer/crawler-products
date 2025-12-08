import Fuse from "fuse.js";
const fuseOptions = {
    includeScore: true,
    threshold: 0.6,
    ignoreLocation: true,
    distance: 5,
    keys: ["name", "category"],
};
export function compareNames(product1, product2) {
    const fuse = new Fuse([product2], fuseOptions);
    const result = fuse.search(product1.name);
    const score = result[0]?.score ?? 1;
    return 1 - score || 0;
}
export function compareCategories(product1, product2) {
    const fuse = new Fuse([product2], fuseOptions);
    const result = fuse.search(product1.category);
    const score = result[0]?.score ?? 1;
    return 1 - score || 0;
}
const fuseOptions2 = {
    includeScore: true,
    threshold: 0.5,
};
export function compareStrings(string1, string2) {
    const fuse = new Fuse([string2], fuseOptions2);
    const result = fuse.search(string1);
    const score = result[0]?.score ?? 1;
    return 1 - score || 0;
}
export function comparePrices(price1, price2) {
    const maxPrice = Math.max(price1, price2);
    if (maxPrice === 0) {
        return 1;
    }
    const diff = Math.abs(price1 - price2);
    const ratio = diff / maxPrice;
    const score = 1 - ratio;
    if (!Number.isFinite(score) || score < 0) {
        return 0;
    }
    return score;
}
