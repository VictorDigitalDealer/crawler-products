import * as cheerio from 'cheerio';

export function parseMenuCategoriesGrowmania(html) {
  if (!html || typeof html !== 'string') return [];

  const $ = cheerio.load(html);
  const categories = [];
  const seenUrls = new Set();

  const addCategory = (name, url) => {
    if (!url || !name) return;
    const cleanName = name.replace(/\s+/g, ' ').trim();
    if (!cleanName) return;
    if (seenUrls.has(url)) return;

    seenUrls.add(url);
    categories.push({ nombre: cleanName, url });
  };

  // 1) Categorías principales
  const mainCats = $('a.cbp-column-title.nav-link.cbp-category-title');
  mainCats.each((_, el) => {
    const $a = $(el);
    addCategory($a.text().trim(), $a.attr('href'));
  });

  // 2) Subcategorías dentro de los bloques
  const subCats = $('.cbp-links.cbp-category-tree a');
  subCats.each((_, el) => {
    const $a = $(el);
    addCategory($a.text().trim(), $a.attr('href'));
  });

  // 3) Listas verticales (marcas, fertilizantes, etc.)
  const valinks = $('.cbp-links.cbp-valinks a');
  valinks.each((_, el) => {
    const $a = $(el);
    addCategory($a.text().trim(), $a.attr('href'));
  });

  return categories;
}
