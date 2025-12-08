// functions/parseCategory/parseCategoryGrowbarato.js
import * as cheerio from "cheerio";
import { textToNumber } from "./utils";
import {
  ParseCategoryReturnType,
  ParseCategoryType,
  ProductType,
} from "../../types";

export function parseCategoryGrowbarato({
  html,
  category,
}: ParseCategoryType): ParseCategoryReturnType {
  const $ = cheerio.load(html);
  const products: ProductType[] = [];

  $(
    "li.product-miniature.js-product-miniature, article.product-miniature.js-product-miniature",
  ).each((_, el) => {
    const $el = $(el);

    const $link = $el.find("a.thumbnail.product-thumbnail").first();
    const url = $link.attr("href") || "";

    const name = $el.find("h3.product-title").first().text().trim();

    const $img = $el.find("img").first();
    const imageUrl =
      $img.attr("data-full-size-image-url") || $img.attr("src") || "";

    const $priceContainer = $el
      .find(".product-price-and-shipping .price")
      .first();
    const priceText = $priceContainer.text().replace(/\s+/g, " ").trim();

    const price = textToNumber(priceText) || 0;

    if (!name && !url) return;

    products.push({
      id: 1,
      name,
      url,
      imageUrl,
      price,
      category: category.name,
      shop: " ",
      scrapedAt: new Date(),
      updatedAt: new Date(),
    });
  });

  const $pagination = $("nav.pagination, .pagination").first();

  let currentPage = 1;
  let totalPages = null;
  let nextPageUrl = null;
  const pageUrl = category.url;

  if ($pagination.length) {
    const $currentLi = $pagination.find("ul.page-list li.current").first();
    if ($currentLi.length) {
      const currentText = $currentLi.find("span").first().text().trim();
      const cur = parseInt(currentText, 10);
      if (!Number.isNaN(cur)) currentPage = cur;
    }

    const pageNumbers: number[] = [];
    $pagination.find("ul.page-list li span").each((_, span) => {
      const txt = $(span).text().trim();
      const n = parseInt(txt, 10);
      if (!Number.isNaN(n)) pageNumbers.push(n);
    });
    if (pageNumbers.length) {
      totalPages = Math.max(...pageNumbers);
    }

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
        const m = onclick.match(/window\.atob\('([^']+)'/);
        if (m && m[1]) {
          try {
            nextPageUrl = Buffer.from(m[1], "base64").toString("utf8");
          } catch (e) {
            nextPageUrl = null;
            console.log(e);
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
