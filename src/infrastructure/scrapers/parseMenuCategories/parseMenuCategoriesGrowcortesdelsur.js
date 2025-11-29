// functions/parseMenuCategories/parseMenuCategoriesGrowcortesdelsur.js
import * as cheerio from "cheerio";

export function parseMenuCategoriesGrowcortesdelsur(html) {
  const $ = cheerio.load(html);
  const categorias = [];

  // Menú lateral: <ul class="wpb_category_n_menu_accordion_list"> ... </ul>
  $("ul.wpb_category_n_menu_accordion_list > li.cat-item").each((_, li) => {
    const $li = $(li);

    // Enlace principal de la categoría
    const $a = $li.children("a").first();
    if (!$a.length) return;

    // Quitamos el "+" y el contador (<span class="wpb-wmca-cat-count">)
    const nombreCategoria = $a
      .clone()
      .children(".wpb-submenu-indicator, .wpb-wmca-cat-count")
      .remove()
      .end()
      .text()
      .trim();

    const urlCategoria = $a.attr("href");

    if (!nombreCategoria || !urlCategoria) return;

    // Añadimos la categoría padre
    categorias.push({
      nombre: nombreCategoria,
      url: urlCategoria,
    });

    // Subcategorías directas de este li
    $li.find("> ul.children > li.cat-item > a").each((__, subA) => {
      const $subA = $(subA);

      const nombreSub = $subA
        .clone()
        .children(".wpb-wmca-cat-count")
        .remove()
        .end()
        .text()
        .trim();

      const urlSub = $subA.attr("href");

      if (!nombreSub || !urlSub) return;

      categorias.push({
        nombre: `${nombreCategoria} > ${nombreSub}`,
        url: urlSub,
      });
    });
  });

  return categorias;
}
