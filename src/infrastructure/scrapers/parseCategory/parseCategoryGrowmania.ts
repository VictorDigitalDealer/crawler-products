import * as cheerio from "cheerio";
import {
  ParseCategoryReturnType,
  ParseCategoryType,
  ProductType,
} from "../../types.js";

export function parseCategoryGrowmania({
  html,
  category,
}: ParseCategoryType): ParseCategoryReturnType {
  const $ = cheerio.load(html);

  const products: ProductType[] = [];
  const pageUrl = category.url;

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

    let priceText = $el
      .find(".product-price-and-shipping .price, .price")
      .first()
      .text();

    priceText = priceText ? priceText.replace(/\s+/g, " ").trim() : "";

    let price = 0;
    const match = priceText.match(/([\d.,]+)/);
    if (match) {
      const normalized = match[1].replace(/\./g, "").replace(",", ".");
      const parsed = parseFloat(normalized);
      if (!Number.isNaN(parsed)) {
        price = parsed;
      }
    }

    if (!name && !url) return;

    products.push({
      id: 0,
      category: category.id,
      shop: category.shopId,
      scrapedAt: new Date(),
      updatedAt: new Date(),
      name: " ",
      url: " ",
      imageUrl,
      price,
    });
  });

  let currentPage = 1;
  let totalPages = null;
  let nextPageUrl = null;

  const $pagination = $("nav.pagination, .pagination").first();

  if ($pagination.length) {
    const $currentLi = $pagination.find("li.current").first();
    if ($currentLi.length) {
      const currentText = $currentLi.text().trim();
      const n = parseInt(currentText.replace(/[^\d]/g, ""), 10);
      if (!Number.isNaN(n)) currentPage = n;
    }

    const pageNumbers: number[] = [];
    $pagination.find("li").each((_, li) => {
      const txt = $(li).text().trim();
      const num = parseInt(txt.replace(/[^\d]/g, ""), 10);
      if (!Number.isNaN(num)) pageNumbers.push(num);
    });
    if (pageNumbers.length) {
      totalPages = Math.max(...pageNumbers);
    }

    const $nextLi = $currentLi.next("li");
    if ($nextLi.length) {
      const href =
        $nextLi.find("a").first().attr("href") ||
        $nextLi.find("span[onclick]").first().attr("href");

      if (href) {
        nextPageUrl = href;
      } else {
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
    pagination: {
      currentPage,
      totalPages,
      nextPageUrl,
    },
    pageUrl,
  };
}
