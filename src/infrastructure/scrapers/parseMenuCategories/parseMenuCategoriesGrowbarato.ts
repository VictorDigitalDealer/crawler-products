import * as cheerio from "cheerio";

export function parseMenuCategoriesGrowbarato(html: string): CategoryType[] {
  if (!html || typeof html !== "string") return [];

  const $ = cheerio.load(html);
  const categories: CategoryType[] = [];
  const seenUrls = new Set();

  const addCategory = ({name, url}: CategoryType) => {
    if (!url || !name) return;

    const cleanName = name.replace(/\s+/g, " ").trim();
    if (!cleanName) return;

    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    if (seenUrls.has(cleanUrl)) return;

    seenUrls.add(cleanUrl);
    categories.push({ nombre: cleanName, url: cleanUrl });
  };

  $("#soymenu_main_ul > li.soymenu_category a.dropdown-item[href]").each(
    (_, el) => {
      const $a = $(el);
      const name = $a.text().replace(/\s+/g, " ").trim();
      const url = $a.attr("href");
      addCategory(name, url);
    },
  );

  $("li.soymm_category a.dropdown-submenu[href]").each((_, el) => {
    const $a = $(el);
    const name = $a.text().replace(/\s+/g, " ").trim();
    const url = $a.attr("href");
    addCategory(name, url);
  });

  $("li.soymm_category span.dropdown-submenu").each((_, el) => {
    const $span = $(el);
    const name = $span.text().replace(/\s+/g, " ").trim();
    const onclick = $span.attr("onclick") || "";

    let url = null;
    const match = onclick.match(/window\.location\.href='([^']+)'/);
    if (match && match[1]) {
      url = match[1];
    }

    addCategory(name, url);
  });

  return categories;
}
