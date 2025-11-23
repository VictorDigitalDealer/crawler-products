// functions/parseCategory/parseCategoryBackgarden.js
import * as cheerio from "cheerio";

function textToNumber(text) {
  if (!text) return undefined;

  const cleaned = text
    .replace(/[^\d,.\-]/g, "") // solo números, coma, punto y signo
    .replace(/\./g, "") // fuera separador de miles tipo 1.234,56
    .replace(",", "."); // coma decimal -> punto

  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? undefined : num;
}

export function parseCategoryBackgarden(html, pageUrl) {
  const $ = cheerio.load(html);
  const products = [];

  // ==========================
  // PRODUCTOS
  // ==========================
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

    const $img = $li.find("img").first();
    const imageUrl =
      $img.attr("data-src") ||
      $img.attr("data-lazy-src") ||
      $img.attr("src") ||
      undefined;

    const $priceContainer = $li.find("span.price").first();
    const $del = $priceContainer.find("del .woocommerce-Price-amount").first();
    const $ins = $priceContainer.find("ins .woocommerce-Price-amount").first();
    const $amount = $priceContainer.find(".woocommerce-Price-amount").first();

    let regularPrice;
    let salePrice;
    let isOnSale = false;

    if ($ins.length) {
      isOnSale = true;
      salePrice = textToNumber($ins.text());
      regularPrice = textToNumber($del.text() || $amount.text());
    } else if ($amount.length) {
      regularPrice = textToNumber($amount.text());
      isOnSale = false;
    }

    const currency =
      $priceContainer
        .find(".woocommerce-Price-currencySymbol")
        .first()
        .text()
        .trim() || undefined;

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

  // ==========================
  // PAGINACIÓN /page/2/
  // ==========================
  let currentPage = 1;
  let totalPages = null;
  let nextPageUrl = null;

  const $pagination = $(
    ".woocommerce-pagination, nav.woocommerce-pagination",
  ).first();

  if ($pagination.length) {
    // página actual (span.current o a.page-numbers.current)
    const $current = $pagination.find(".page-numbers .current").first();
    if ($current.length) {
      const n = parseInt($current.text().trim(), 10);
      if (!Number.isNaN(n)) currentPage = n;
    }

    // total de páginas (miramos todos los numeritos)
    const pageNumbers = [];
    $pagination
      .find(".page-numbers li .page-numbers")
      .not(".next")
      .not(".prev")
      .each((_, el) => {
        const txt = $(el).text().trim();
        const num = parseInt(txt, 10);
        if (!Number.isNaN(num)) pageNumbers.push(num);
      });

    if (pageNumbers.length) {
      totalPages = Math.max(...pageNumbers);
    }

    // enlace "next"
    const $next = $pagination.find(".page-numbers .next").first();
    if ($next.length) {
      const href = $next.attr("href");
      if (href) {
        try {
          nextPageUrl = new URL(
            href,
            pageUrl || "https://backgarden.es",
          ).toString();
        } catch {
          nextPageUrl = href;
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
