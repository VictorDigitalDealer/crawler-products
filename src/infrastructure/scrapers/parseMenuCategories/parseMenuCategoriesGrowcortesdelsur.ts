import * as cheerio from "cheerio";
import { CategoryType } from "../../types";

export function parseMenuCategoriesGrowcortesdelsur(
  html: string,
): CategoryType[] {
  const $ = cheerio.load(html);
  const categorias: CategoryType[] = [];

  $("ul.wpb_category_n_menu_accordion_list > li.cat-item").each((_, li) => {
    const $li = $(li);

    const $a = $li.children("a").first();
    if (!$a.length) return;

    const nombreCategoria = $a
      .clone()
      .children(".wpb-submenu-indicator, .wpb-wmca-cat-count")
      .remove()
      .end()
      .text()
      .trim();

    const urlCategoria = $a.attr("href");

    if (!nombreCategoria || !urlCategoria) return;

    categorias.push({
      name: nombreCategoria,
      url: urlCategoria,
    });

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
        name: `${nombreCategoria} > ${nombreSub}`,
        url: urlSub,
      });
    });
  });

  return categorias;
}
