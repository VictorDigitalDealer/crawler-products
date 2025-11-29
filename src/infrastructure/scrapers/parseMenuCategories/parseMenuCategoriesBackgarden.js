import * as cheerio from "cheerio";

export function parseMenuCategoriesBackgarden(html) {
  if (!html || typeof html !== "string") return [];

  const $ = cheerio.load(html);
  const categories = [];
  const seen = new Set();

  const addCat = (name, url) => {
    if (!name || !url) return;

    const cleanName = name.replace(/\s+/g, " ").trim();
    const cleanUrl = url.trim();

    if (!cleanName || !cleanUrl) return;
    if (seen.has(cleanUrl)) return;

    seen.add(cleanUrl);
    categories.push({ nombre: cleanName, url: cleanUrl });
  };

  // ===========================
  // 1) Categorías raíz
  // ===========================
  $("a.elementor-item[href]").each((_, el) => {
    const $a = $(el);
    addCat($a.text(), $a.attr("href"));
  });

  // ===========================
  // 2) Subcategorías (1 o más niveles)
  // ===========================
  $("a.elementor-sub-item[href]").each((_, el) => {
    const $a = $(el);
    addCat($a.text(), $a.attr("href"));
  });

  return categories;
}
