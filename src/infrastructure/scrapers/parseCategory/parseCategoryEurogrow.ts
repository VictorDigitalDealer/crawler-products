import * as cheerio from "cheerio";
import {
  ParseCategoryReturnType,
  ParseCategoryType,
  ProductType,
} from "../../types";

export function parseCategoryEurogrow({
  html,
  category,
}: ParseCategoryType): ParseCategoryReturnType {
  const $ = cheerio.load(html);
  const products: ProductType[] = [];

  $("li.ajax_block_product").each((_, el) => {
    const name =
      $(el).find(".product-name").first().text().trim() ||
      $(el).find(".product-name.visible-xs.eurogrowdata").text().trim();

    const url = $(el).find("a.product_img_link").attr("href");
    const priceText = $(el).find(".price.product-price").first().text().trim();

    if (!name || !url) return;

    products.push({
      id: 1,
      category: category.name,
      name: name,
      price: Number(priceText),
      url: " ",
      imageUrl: "",
      scrapedAt: new Date(),
      updatedAt: new Date(),
      shop: "1",
    });
  });

  let currentPage = 1;
  let totalPages = null;
  let nextPageUrl = null;

  if (category.url) {
    try {
      const u = new URL(category.url);
      const pParam = u.searchParams.get("p");
      if (pParam) currentPage = Number(pParam) || 1;
    } catch {
      console.log("");
    }
  }

  const $pagination = $("nav.pagination, .pagination").first();

  if ($pagination.length) {
    const pageNumbers: number[] = [];

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

  if (totalPages && currentPage < totalPages && category.url) {
    try {
      const u = new URL(category.url);

      u.searchParams.set("p", String(currentPage + 1));

      nextPageUrl = u.toString();
    } catch {
      if (category.url.includes("?")) {
        if (category.url.includes("p=")) {
          nextPageUrl = category.url.replace(/p=\d+/, `p=${currentPage + 1}`);
        } else {
          nextPageUrl = `${category.url}&p=${currentPage + 1}`;
        }
      } else {
        nextPageUrl = `${category.url}?p=${currentPage + 1}`;
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
    pageUrl: category.url,
  };
}
