import { ProductType } from "../types";

export class ProductMapper {
  static toDb(p: ProductType, { siteName, categoryName, categoryUrl }) {
    return {
      name: this.parseName(p),
      shop: siteName,
      url: this.parseUrl(p),
      price: this.parsePrice(p),
      category: categoryName,
      categoryUrl: categoryUrl,
      scrapedAt: new Date(),
    };
  }

  static parseName(p) {
    return p.name ?? p.nombre ?? "Sin nombre";
  }

  static parseUrl(p) {
    return p.url ?? p.enlace ?? "";
  }

  static parsePrice(p) {
    const raw = p.price ?? p.price ?? "";

    if (typeof raw === "number") return raw;

    if (typeof raw === "string") {
      const clean = raw
        .replace(/€/g, "")
        .replace(/\s+/g, "")
        .replace(/,/g, ".")
        .trim();

      const num = parseFloat(clean);

      return isNaN(num) ? 0 : num;
    }

    return 0;
  }
}
