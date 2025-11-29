// parseCategory/parseCategoryGrowCortesDelSur.js
import * as cheerio from "cheerio";

function textToNumber(text) {
  if (!text) return undefined;
  // Ej: "5,60 €" -> 5.6
  const cleaned = text
    .replace(/[^\d,.\-]/g, "") // dejamos solo números, coma, punto y signo
    .replace(/\./g, "") // quitamos separadores de miles tipo "1.234,56"
    .replace(",", "."); // cambiamos coma decimal por punto

  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? undefined : num;
}

export function parseCategoryGrowcortesdelsur(html, pageUrl) {
  const $ = cheerio.load(html);

  const products = [];

  $("li.product").each((_, el) => {
    const $li = $(el);

    const $productLink = $li.find("a.woocommerce-LoopProduct-link").first();
    const url = $productLink.attr("href");

    if (!url) return;

    const name = $li
      .find(".woocommerce-loop-product__title")
      .first()
      .text()
      .trim();

    // Imagen (prioriza data-src si existiera)
    const $img = $li.find("img").first();
    const imageUrl =
      $img.attr("data-src") ||
      $img.attr("data-lazy-src") ||
      $img.attr("src") ||
      undefined;

    // Precios
    const $priceContainer = $li.find("span.price").first();
    const $del = $priceContainer.find("del .woocommerce-Price-amount").first();
    const $ins = $priceContainer.find("ins .woocommerce-Price-amount").first();
    const $amount = $priceContainer.find(".woocommerce-Price-amount").first();

    let regularPrice;
    let salePrice;
    let isOnSale = false;

    if ($ins.length) {
      // Producto en oferta
      isOnSale = true;
      salePrice = textToNumber($ins.text());
      regularPrice = textToNumber($del.text() || $amount.text());
    } else if ($amount.length) {
      // Precio normal
      regularPrice = textToNumber($amount.text());
      isOnSale = false;
    }

    const currency =
      $priceContainer
        .find(".woocommerce-Price-currencySymbol")
        .first()
        .text()
        .trim() || undefined;

    // Categorías desde las clases del <li>
    // ej: class="product ... product_cat-poleas ..."
    const classAttr = $li.attr("class") || "";
    const categories = classAttr
      .split(/\s+/)
      .filter((cls) => cls.startsWith("product_cat-"))
      .map((cls) => cls.replace("product_cat-", "").trim())
      .filter(Boolean);

    products.push({
      name,
      url,
      imageUrl,
      regularPrice,
      salePrice,
      currency,
      isOnSale,
      categories,
    });
  });

  // Paginación (WooCommerce estándar)
  const $pagination = $(
    ".woocommerce-pagination, nav.woocommerce-pagination",
  ).first();
  let currentPage = 1;
  let totalPages = null;
  let nextPageUrl = null;

  if ($pagination.length) {
    const $current = $pagination.find(".page-numbers .current").first();
    if ($current.length) {
      const n = parseInt($current.text().trim(), 10);
      if (!Number.isNaN(n)) currentPage = n;
    }

    const $pages = $pagination
      .find(".page-numbers li .page-numbers")
      .not(".next")
      .not(".prev");
    if ($pages.length) {
      const lastText = $pages.last().text().trim();
      const total = parseInt(lastText, 10);
      if (!Number.isNaN(total)) totalPages = total;
    }

    const $next = $pagination.find(".page-numbers .next").first();
    if ($next.length) {
      nextPageUrl = $next.attr("href") || null;
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
