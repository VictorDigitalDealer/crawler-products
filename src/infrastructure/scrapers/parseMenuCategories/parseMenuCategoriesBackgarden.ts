import * as cheerio from "cheerio";
import { CategoryType } from "../../types.js";

export function parseMenuCategoriesBackgarden(html: string): CategoryType[] {
  if (!html || typeof html !== "string") return [];

  const $ = cheerio.load(html);
  const categories: CategoryType[] = [];
  const seen = new Set();

  const addCat = ({ name, url }: CategoryType) => {
    if (!name || !url) return;

    const cleanName = name.replace(/\s+/g, " ").trim();
    const cleanUrl = url.trim();

    if (!cleanName || !cleanUrl) return;
    if (seen.has(cleanUrl)) return;

    seen.add(cleanUrl);
    categories.push({
      name: cleanName,
      url: cleanUrl,
      shopId: "backgarden",
      id: "",
    });
  };

  $("a.elementor-item[href]").each((_, el) => {
    const $a = $(el);
    const url = $a.attr("href") ?? "";
    const name = $a.text() ?? "";
    addCat({ name, url, shopId: "backgarden", id: "" });
  });

  $("a.elementor-sub-item[href]").each((_, el) => {
    const $a = $(el);
    const url = $a.attr("href") ?? "";
    const name = $a.text() ?? "";
    addCat({ name, url, shopId: "backgarden", id: "" });
  });

  return categories;
}
