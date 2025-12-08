import * as cheerio from "cheerio";
import { textToNumber } from "./utils.js";
import {
  ParseCategoryReturnType,
  ParseCategoryType,
  ProductType,
} from "../../types.js";

export function parseCategoryBackgarden({
  html,
  category,
}: ParseCategoryType): ParseCategoryReturnType {
  const $ = cheerio.load(html);
  const products: ProductType[] = [];
  const pageUrl = category.url;

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
      "";

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
      price,
      category: categories[0],
      id: 0,
      shop: category.shopId,
      scrapedAt: new Date(),
      updatedAt: new Date(),
    });
  });

  let currentPage = 1;
  let totalPages = null;
  let nextPageUrl = null;

  const $pagination = $(
    ".woocommerce-pagination, nav.woocommerce-pagination",
  ).first();

  if ($pagination.length) {
    const $current = $pagination.find(".page-numbers .current").first();
    if ($current.length) {
      const n = parseInt($current.text().trim(), 10);
      if (!Number.isNaN(n)) currentPage = n;
    }

    const pageNumbers: number[] = [];
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
