// functions/parseCategory/parseCategory.js
import * as cheerio from "cheerio";

export function parseCategory(html, pageUrl) {
  const $ = cheerio.load(html);
  const products = [];

  // ===============================
  // PRODUCTOS (igual que tenías)
  // ===============================
  $("li.ajax_block_product").each((_, el) => {
    const name =
      $(el).find(".product-name").first().text().trim() ||
      $(el).find(".product-name.visible-xs.eurogrowdata").text().trim();

    const url = $(el).find("a.product_img_link").attr("href");
    const priceText = $(el).find(".price.product-price").first().text().trim();

    if (!name || !url) return;

    products.push({
      nombre: name,
      precio: priceText,
      url,
    });
  });

  // ===============================
  // PAGINACIÓN ESTÁNDAR `?p=2`
  // ===============================
  let currentPage = 1;
  let totalPages = null;
  let nextPageUrl = null;

  // Detectar página actual desde la URL
  if (pageUrl) {
    try {
      const u = new URL(pageUrl);
      const pParam = u.searchParams.get("p");
      if (pParam) currentPage = Number(pParam) || 1;
    } catch {}
  }

  // Buscar el bloque de paginación
  const $pagination = $("nav.pagination, .pagination").first();

  if ($pagination.length) {
    const pageNumbers = [];

    // Buscar números de páginas visibles
    $pagination.find("li").each((_, li) => {
      const txt = $(li).text().trim();
      const match = txt.match(/^\d+$/);
      if (match) {
        pageNumbers.push(Number(match[0]));
      }
    });

    if (pageNumbers.length) {
      totalPages = Math.max(...pageNumbers);
    }
  }

  // Construir nextPageUrl
  if (totalPages && currentPage < totalPages && pageUrl) {
    try {
      const u = new URL(pageUrl);

      // Sobreescribir el parámetro p=#
      u.searchParams.set("p", currentPage + 1);

      nextPageUrl = u.toString();
    } catch {
      // fallback si URL no es válida para URL()
      if (pageUrl.includes("?")) {
        if (pageUrl.includes("p=")) {
          nextPageUrl = pageUrl.replace(/p=\d+/, `p=${currentPage + 1}`);
        } else {
          nextPageUrl = `${pageUrl}&p=${currentPage + 1}`;
        }
      } else {
        nextPageUrl = `${pageUrl}?p=${currentPage + 1}`;
      }
    }
  }

  // ===============================
  // RESULTADO FINAL
  // ===============================

  return {
    products,

    pagination: {
      currentPage,
      totalPages,
      nextPageUrl,
    },

    pageUrl,
  };
}
