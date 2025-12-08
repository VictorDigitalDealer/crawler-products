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
exports.compareProducts = compareProducts;
const client_1 = require("@prisma/client");
const fuzzyMatching_js_1 = require("../../utils/fuzzyMatching.js");
const prisma = new client_1.PrismaClient();
function compareProducts(product1, product2) {
    return __awaiter(this, void 0, void 0, function* () {
        const nameMatch = (0, fuzzyMatching_js_1.compareNames)(product1, product2);
        const categoryMatch = (0, fuzzyMatching_js_1.compareCategories)(product1, product2);
        const priceMatch = (0, fuzzyMatching_js_1.comparePrices)(product1.price, product2.price);
        const totalMatch = nameMatch * 0.4 + categoryMatch * 0.3 + priceMatch * 0.3;
        yield prisma.productComparison.create({
            data: {
                productGrowCortesId: product1.id,
                productExternalId: product2.id,
                nameMatchPercentage: nameMatch * 100,
                categoryMatchPercentage: categoryMatch * 100,
                priceMatchPercentage: priceMatch * 100,
                totalMatchPercentage: totalMatch * 100,
            },
        });
        return {
            productGrowCortesId: product1.id,
            productExternalId: product2.id,
            nameMatchPercentage: nameMatch * 100,
            categoryMatchPercentage: categoryMatch * 100,
            priceMatchPercentage: priceMatch * 100,
            totalMatchPercentage: totalMatch * 100,
        };
    });
}
