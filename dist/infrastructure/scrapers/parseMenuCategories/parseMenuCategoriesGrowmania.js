import * as cheerio from "cheerio";
export function parseMenuCategoriesGrowmania(html) {
    if (!html || typeof html !== "string")
        return [];
    const $ = cheerio.load(html);
    const categories = [];
    const seenUrls = new Set();
    const addCategory = ({ name, url }) => {
        if (!url || !name)
            return;
        const cleanName = name.replace(/\s+/g, " ").trim();
        if (!cleanName)
            return;
        if (seenUrls.has(url))
            return;
        seenUrls.add(url);
        categories.push({ name: cleanName, url, shopId: "growmania", id: "" });
    };
    const mainCats = $("a.cbp-column-title.nav-link.cbp-category-title");
    mainCats.each((_, el) => {
        const $a = $(el);
        addCategory({
            name: $a.text().trim(),
            url: $a.attr("href"),
            shopId: "growmania",
            id: "",
        });
    });
    const subCats = $(".cbp-links.cbp-category-tree a");
    subCats.each((_, el) => {
        const $a = $(el);
        addCategory({
            name: $a.text().trim(),
            url: $a.attr("href"),
            shopId: "growmania",
            id: "",
        });
    });
    const valinks = $(".cbp-links.cbp-valinks a");
    valinks.each((_, el) => {
        const $a = $(el);
        addCategory({
            name: $a.text().trim(),
            url: $a.attr("href"),
            shopId: "growmania",
            id: "",
        });
    });
    return categories;
}
