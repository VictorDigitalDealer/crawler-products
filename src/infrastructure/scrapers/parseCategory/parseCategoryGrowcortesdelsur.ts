import * as cheerio from "cheerio";
import { textToNumber } from "./utils.js";
import {
  ParseCategoryReturnType,
  ParseCategoryType,
  ProductType,
} from "../../types.js";

export function parseCategoryGrowcortesdelsur({
  html,
  category,
}: ParseCategoryType): ParseCategoryReturnType {
  const $ = cheerio.load(html);
  const pageUrl = category.url;

  const products: ProductType[] = [];

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
      null;

    const $priceContainer = $li.find("span.price").first();
    const $del = $priceContainer.find("del .woocommerce-Price-amount").first();
    const $ins = $priceContainer.find("ins .woocommerce-Price-amount").first();
    const $amount = $priceContainer.find(".woocommerce-Price-amount").first();

    let price = 0;

    if ($ins.length) {
      price = textToNumber($del.text() || $amount.text());
    } else if ($amount.length) {
      price = textToNumber($amount.text());
    }

    products.push({
      name,
      url,
      imageUrl,
      price,
      category: category.id,
      id: 0,
      shop: category.shopId,
      scrapedAt: new Date(),
      updatedAt: new Date(),
    });
  });

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
