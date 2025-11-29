// functions/parseMenuCategories.js
import * as cheerio from "cheerio";
import { CategoryType } from "../../types";

/**
 * ============================================
 *  PARSER GENÉRICO (Eurogrow, estructuras similares)
 * ============================================
 */
export function parseMenuCategoriesGeneric(html: string) {
  const $ = cheerio.load(html);
  const categories: CategoryType[] = [];
  const seenUrls = new Set();

  const addCategory = ({ name, url }: CategoryType) => {
    if (!url || !name) return;
    const cleanName = name.replace(/\s+/g, " ").trim();
    if (!cleanName) return;
    if (seenUrls.has(url)) return;

    seenUrls.add(url);
    categories.push({ name: cleanName, url });
  };

  const $nav = $("#cbp-hrmenu");
  if ($nav.length === 0) {
    console.log("⚠️ No se encontró #cbp-hrmenu (genérico).");
    return categories;
  }

  $nav.find("a").each((_, el) => {
    const url = $(el).attr("href") || "";
    const name = $(el).text().trim();
    addCategory({ name, url });
  });

  return categories;
}
