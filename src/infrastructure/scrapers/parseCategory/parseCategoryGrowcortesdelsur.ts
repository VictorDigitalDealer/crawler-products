import * as cheerio from "cheerio";
import { textToNumber, extractImageUrl } from "./utils.js";
import {
  PaginationInfo,
  ParseCategoryReturnType,
  ParseCategoryType,
  ProductType,
} from "../../types.js";

// 👇 Función reutilizable que extrae la paginación de WooCommerce
function parsePagination($: cheerio.CheerioAPI): PaginationInfo {
  const $pagination = $(
    ".woocommerce-pagination, nav.woocommerce-pagination",
  ).first();

  let currentPage = 1;
  let totalPages: number | null = null;
  let nextPageUrl: string | null = null;

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
    currentPage,
    totalPages,
    nextPageUrl,
  };
}

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

    const imageUrl = extractImageUrl($, $li);

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

  const pagination = parsePagination($);

  return {
    products,
    pagination,
    pageUrl,
  };
}
