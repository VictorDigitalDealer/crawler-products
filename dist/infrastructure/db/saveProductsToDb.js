"use strict";
// infrastructure/usecases/saveProductsToDb.ts (o donde estés)
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
exports.saveProductsToDb = saveProductsToDb;
const ProductMapper_js_1 = require("../mappers/ProductMapper.js");
const PrismaProductRepository_js_1 = require("./PrismaProductRepository.js");
const productRepository = new PrismaProductRepository_js_1.PrismaProductRepository();
function saveProductsToDb(_a) {
    return __awaiter(this, arguments, void 0, function* ({ allProducts, shop, }) {
        const productsForDb = allProducts.map((p) => ProductMapper_js_1.ProductMapper.toDb({ p, shop: shop.nameId, category: p.category }));
        console.log(`Guardando ${productsForDb.length} productos en la base de datos...`);
        const result = yield productRepository.saveMany(productsForDb);
        console.log(`Productos guardados/actualizados en BD para ${shop.name}: ${result.count}`);
        return result;
    });
}
