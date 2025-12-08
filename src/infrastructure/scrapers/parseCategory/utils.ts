import { CheerioAPI, Cheerio } from "cheerio";
import type { Element } from "domhandler";

export function textToNumber(text: string): number {
  if (!text) return 0;

  const cleaned = text
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

export function extractImageUrl($: CheerioAPI, $wrapper: Cheerio<Element>) {
  const $img = $wrapper.find("img").first();

  const large = $img.attr("data-large_image");
  if (large) return large;

  const link = $wrapper.find("a[href]").attr("href");
  if (link && link.endsWith(".jpg")) return link;

  const srcset = $img.attr("srcset");
  if (srcset) {
    const candidates = srcset.split(",").map((s) => s.trim().split(" ")[0]);
    const biggest = candidates[candidates.length - 1];
    if (biggest) return biggest;
  }

  const dataSrc = $img.attr("data-src") || $img.attr("data-lazy-src");
  if (dataSrc) return dataSrc;

  return $img.attr("src") || null;
}
