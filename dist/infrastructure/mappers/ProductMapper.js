"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMapper = void 0;
class ProductMapper {
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
        var _a;
        return (_a = p.name) !== null && _a !== void 0 ? _a : "Sin nombre";
    }
    static parseUrl(p) {
        var _a;
        return (_a = p.url) !== null && _a !== void 0 ? _a : "Sin url";
    }
    static parsePrice(p) {
        var _a;
        return (_a = p.price) !== null && _a !== void 0 ? _a : 0;
    }
}
exports.ProductMapper = ProductMapper;
