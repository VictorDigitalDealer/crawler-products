// functions/parseCategory/parseCategoryGrowbarato.js
import * as cheerio from "cheerio";

function textToNumber(text) {
  if (!text) return undefined;

  // Ej: "9,00 €" -> 9
  const cleaned = text
    .replace(/[^\d,.\-]/g, "") // dejamos solo números, coma, punto y signo
    .replace(/\./g, "") // quitamos separadores de miles tipo "1.234,56"
    .replace(",", "."); // cambiamos coma decimal por punto

  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? undefined : num;
}

export function parseCategoryGrowbarato(html, pageUrl) {
  const $ = cheerio.load(html);
  const products = [];

  // Soportamos <li.product-miniature> y <article.product-miniature>
  $(
    "li.product-miniature.js-product-miniature, article.product-miniature.js-product-miniature",
  ).each((_, el) => {
    const $el = $(el);

    // URL del producto
    const $link = $el.find("a.thumbnail.product-thumbnail").first();
    const url = $link.attr("href") || null;

    // Nombre / título del producto
    const name = $el.find("h3.product-title").first().text().trim();

    // Imagen (primero full-size, luego normal)
    const $img = $el.find("img").first();
    const imageUrl =
      $img.attr("data-full-size-image-url") || $img.attr("src") || null;

    // Precio (texto crudo)
    const $priceContainer = $el
      .find(".product-price-and-shipping .price")
      .first();
    const priceText = $priceContainer.text().replace(/\s+/g, " ").trim();

    const regularPrice = textToNumber(priceText);

    // Rating (estrellas y nº reseñas)
    const ratingStars = $el.find(".reviews_list_stars .fa-star").length || 0;

    const reviewsText = $el
      .find(".reviews_list_stars span")
      .first()
      .text()
      .trim(); // "(36)"
    const reviewsCount = reviewsText
      ? parseInt(reviewsText.replace(/[^\d]/g, ""), 10) || 0
      : 0;

    if (!name && !url) return;

    products.push({
      name,
      url,
      imageUrl,
      regularPrice,
      priceText,
      ratingStars,
      reviewsCount,
    });
  });

  // ===== Paginación Growbarato =====
  // Estructura:
  // <nav class="pagination">
  //   <ul class="page-list">
  //     <li> ... </li>
  //     <li class="current"><span ...>2</span></li>
  //     ...
  //   </ul>
  // </nav>
  const $pagination = $("nav.pagination, .pagination").first();

  let currentPage = 1;
  let totalPages = null;
  let nextPageUrl = null;

  if ($pagination.length) {
    // Página actual
    const $currentLi = $pagination.find("ul.page-list li.current").first();
    if ($currentLi.length) {
      const currentText = $currentLi.find("span").first().text().trim();
      const cur = parseInt(currentText, 10);
      if (!Number.isNaN(cur)) currentPage = cur;
    }

    // Total de páginas: máximo número presente en los spans
    const pageNumbers = [];
    $pagination.find("ul.page-list li span").each((_, span) => {
      const txt = $(span).text().trim();
      const n = parseInt(txt, 10);
      if (!Number.isNaN(n)) pageNumbers.push(n);
    });
    if (pageNumbers.length) {
      totalPages = Math.max(...pageNumbers);
    }

    // Siguiente página: buscamos el span que tenga el número currentPage + 1
    const nextPageNum = currentPage + 1;

    if (totalPages && nextPageNum <= totalPages) {
      const $nextSpan = $pagination
        .find("ul.page-list li span")
        .filter((_, span) => {
          const txt = $(span).text().trim();
          const n = parseInt(txt, 10);
          return !Number.isNaN(n) && n === nextPageNum;
        })
        .first();

      if ($nextSpan.length) {
        const onclick = $nextSpan.attr("onclick") || "";
        // onclick="window.location.href=unescape(decodeURIComponent(window.atob('BASE64')))"
        const m = onclick.match(/window\.atob\('([^']+)'/);
        if (m && m[1]) {
          try {
            nextPageUrl = Buffer.from(m[1], "base64").toString("utf8");
          } catch (e) {
            nextPageUrl = null;
          }
        }
      }
    }
  }

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
