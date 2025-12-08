"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProductRepository = void 0;
const ProductRepository_js_1 = require("../../domain/repositories/ProductRepository.js");
const PrismaClient_js_1 = require("./PrismaClient.js");
class PrismaProductRepository extends ProductRepository_js_1.ProductRepository {
    saveMany(products) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (!products || products.length === 0) {
                return { count: 0 };
            }
            let count = 0;
            for (const p of products) {
                yield PrismaClient_js_1.prisma.product.upsert({
                    where: { url: p.url },
                    update: {
                        name: p.name,
                        shop: p.shop,
                        price: p.price,
                        category: p.category,
                        scrapedAt: (_a = p.scrapedAt) !== null && _a !== void 0 ? _a : new Date(),
                        updatedAt: (_b = p.updatedAt) !== null && _b !== void 0 ? _b : new Date(),
                    },
                    create: {
                        name: p.name,
                        shop: p.shop,
                        url: p.url,
                        price: p.price,
                        category: p.category,
                        scrapedAt: (_c = p.scrapedAt) !== null && _c !== void 0 ? _c : new Date(),
                        updatedAt: (_d = p.updatedAt) !== null && _d !== void 0 ? _d : new Date(),
                    },
                });
                count++;
            }
            return { count };
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield PrismaClient_js_1.prisma.product.findMany({
                orderBy: { id: "asc" },
            });
            return rows.map((p) => ({
                id: p.id,
                name: p.name,
                url: p.url,
                price: p.price,
                category: p.category,
                imageUrl: p.imageUrl,
                scrapedAt: p.scrapedAt,
                updatedAt: p.updatedAt,
                shop: p.shop,
            }));
        });
    }
}
exports.PrismaProductRepository = PrismaProductRepository;
