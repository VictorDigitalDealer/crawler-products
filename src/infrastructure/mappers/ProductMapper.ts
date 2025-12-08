import { ProductType } from "../types.js";
export class ProductMapper {
  static toDb(p: ProductType) {
    return {
      id: 0,
      name: this.parseName(p),
      shop: p.shop,
      url: this.parseUrl(p),
      price: this.parsePrice(p),
      category: p.category,
      scrapedAt: new Date(),
      createdAt: new Date(),
      imageUrl: p.imageUrl,
      updatedAt: new Date(),
    };
  }

  static parseName(p: ProductType) {
    return p.name ?? "Sin nombre";
  }

  static parseUrl(p: ProductType) {
    return p.url ?? "Sin url";
  }

  static parsePrice(p: ProductType) {
    return p.price ?? 0;
  }
}
