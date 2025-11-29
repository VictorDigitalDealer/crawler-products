import * as cheerio from "cheerio";

export function parseMenuCategoriesGrowbarato(html) {
  if (!html || typeof html !== "string") return [];

  const $ = cheerio.load(html);
  const categories = [];
  const seenUrls = new Set();

  const addCategory = (name, url) => {
    if (!url || !name) return;

    const cleanName = name.replace(/\s+/g, " ").trim();
    if (!cleanName) return;

    // Normalizamos la URL por si viene con espacios
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    if (seenUrls.has(cleanUrl)) return;

    seenUrls.add(cleanUrl);
    categories.push({ nombre: cleanName, url: cleanUrl });
  };

  // 1) Categorías raíz del menú superior (Semillas de marihuana, Cultivo, Fertilizantes, etc.)
  $("#soymenu_main_ul > li.soymenu_category a.dropdown-item[href]").each(
    (_, el) => {
      const $a = $(el);
      const name = $a.text().replace(/\s+/g, " ").trim();
      const url = $a.attr("href");
      addCategory(name, url);
    },
  );

  // 2) Enlaces de subcategorías <a class="dropdown-submenu" href="...">
  $("li.soymm_category a.dropdown-submenu[href]").each((_, el) => {
    const $a = $(el);
    const name = $a.text().replace(/\s+/g, " ").trim();
    const url = $a.attr("href");
    addCategory(name, url);
  });

  // 3) Subcategorías que usan <span class="dropdown-submenu plasticorefl" onclick="window.location.href='...'">
  $("li.soymm_category span.dropdown-submenu").each((_, el) => {
    const $span = $(el);
    const name = $span.text().replace(/\s+/g, " ").trim();
    const onclick = $span.attr("onclick") || "";

    // Extraer la URL del onclick, por ejemplo:
    // onclick="window.location.href='https://www.growbarato.net/624-geneticas-de-marihuana'"
    let url = null;
    const match = onclick.match(/window\.location\.href='([^']+)'/);
    if (match && match[1]) {
      url = match[1];
    }

    addCategory(name, url);
  });

  return categories;
}
