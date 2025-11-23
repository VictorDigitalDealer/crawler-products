// functions/parseCategory/parseCategoryGrowmania.js
import * as cheerio from "cheerio";

function textToNumber(text) {
  if (!text) return undefined;

  const cleaned = text
    .replace(/[^\d,.\-]/g, "") // solo números, coma, punto y signo
    .replace(/\./g, "") // quitamos separadores de miles tipo "1.234,56"
    .replace(",", "."); // convertimos coma decimal en punto

  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? undefined : num;
}

export function parseCategoryGrowmania(html, pageUrl) {
  const $ = cheerio.load(html);

  const products = [];

  // Productos (soporta <article> y <li>, por si cambian plantilla)
  $(
    "article.product-miniature.js-product-miniature, li.product-miniature.js-product-miniature",
  ).each((_, el) => {
    const $el = $(el);

    const $link =
      $el.find("a.thumbnail.product-thumbnail").first() ||
      $el.find("a.product-thumbnail").first();

    const url = $link.attr("href") || null;

    const name =
      $el
        .find("h3.product-title, h2.product-title, .product-title a")
        .first()
        .text()
        .trim() || null;

    const $img = $el.find("img").first();
    const imageUrl =
      $img.attr("data-full-size-image-url") ||
      $img.attr("data-src") ||
      $img.attr("src") ||
      null;

    // Precio
    let priceText = $el
      .find(".product-price-and-shipping .price, .price")
      .first()
      .text();

    priceText = priceText ? priceText.replace(/\s+/g, " ").trim() : "";

    let price = undefined;
    const match = priceText.match(/([\d\.,]+)/); // pilla "4,75" o "1.234,56"
    if (match) {
      const normalized = match[1].replace(/\./g, "").replace(",", ".");
      const parsed = parseFloat(normalized);
      if (!Number.isNaN(parsed)) {
        price = parsed;
      }
    }

    // Rating (si existe)
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
      priceText,
      price,
      ratingStars,
      reviewsCount,
    });
  });

  // =========================
  //   PAGINACIÓN (genérica)
  // =========================
  let currentPage = 1;
  let totalPages = null;
  let nextPageUrl = null;

  const $pagination = $("nav.pagination, .pagination").first();

  if ($pagination.length) {
    // Página actual
    const $currentLi = $pagination.find("li.current").first();
    if ($currentLi.length) {
      const currentText = $currentLi.text().trim();
      const n = parseInt(currentText.replace(/[^\d]/g, ""), 10);
      if (!Number.isNaN(n)) currentPage = n;
    }

    // Total de páginas (máximo número que aparezca)
    const pageNumbers = [];
    $pagination.find("li").each((_, li) => {
      const txt = $(li).text().trim();
      const num = parseInt(txt.replace(/[^\d]/g, ""), 10);
      if (!Number.isNaN(num)) pageNumbers.push(num);
    });
    if (pageNumbers.length) {
      totalPages = Math.max(...pageNumbers);
    }

    // Siguiente página: siguiente <li> después del current
    const $nextLi = $currentLi.next("li");
    if ($nextLi.length) {
      // 1) Si hay <a href="...">
      const href =
        $nextLi.find("a").first().attr("href") ||
        $nextLi.find("span[onclick]").first().attr("href");

      if (href) {
        nextPageUrl = href;
      } else {
        // 2) Growmania/Growbarato usan span con onclick + atob(...)
        const onclick = $nextLi.find("[onclick]").first().attr("onclick") || "";
        const match = onclick.match(/atob\('([^']+)'/);
        if (match && match[1]) {
          try {
            const decoded = Buffer.from(match[1], "base64").toString("utf8");
            nextPageUrl = decoded || null;
          } catch {
            nextPageUrl = null;
          }
        }
      }
    }
  }

  return {
    products,
    nextPageUrl,
    pagination: {
      currentPage,
      totalPages,
      nextPageUrl,
    },
    pageUrl,
  };
}
