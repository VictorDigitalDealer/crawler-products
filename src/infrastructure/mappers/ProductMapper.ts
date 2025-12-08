import { ProductType, ShopId } from "../types";

type ProductMapperType = {
  p: ProductType;
  shop: ShopId;
  category: string;
};

export class ProductMapper {
  static toDb({ p, shop, category }: ProductMapperType) {
    return {
      id: 0,
      name: this.parseName(p),
      shop: shop,
      url: this.parseUrl(p),
      price: this.parsePrice(p),
      category: category,
      scrapedAt: new Date(),
      createdAt: new Date(),
      imageUrl: "",
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
