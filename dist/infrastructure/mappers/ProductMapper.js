export class ProductMapper {
    static toDb({ p, shop, category }) {
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
    static parseName(p) {
        return p.name ?? "Sin nombre";
    }
    static parseUrl(p) {
        return p.url ?? "Sin url";
    }
    static parsePrice(p) {
        return p.price ?? 0;
    }
}
