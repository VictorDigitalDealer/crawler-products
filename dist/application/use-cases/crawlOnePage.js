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
exports.crawlOnePage = crawlOnePage;
const menuParsers_js_1 = require("../../infrastructure/scrapers/menuParsers.js");
const ProductMapper_js_1 = require("../../infrastructure/mappers/ProductMapper.js");
const AxiosHttpClient_js_1 = require("../../infrastructure/http/AxiosHttpClient.js");
const ParseResultNormalizer_js_1 = require("../../infrastructure/mappers/ParseResultNormalizer.js");
const PrismaProductRepository_js_1 = require("../../infrastructure/db/PrismaProductRepository.js");
function crawlOnePage(siteId, siteConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\n====================================");
        console.log(`crawlOnePage → ${siteConfig.name} (${siteId})`);
        console.log("Home URL:", siteConfig.homeUrl);
        console.log("====================================\n");
        const parseMenuCategories = (0, menuParsers_js_1.getMenuParser)(siteId);
        const parseCategory = (0, menuParsers_js_1.getCategoryParser)(siteId);
        // 1) Home → categorías
        const homeHtml = yield (0, AxiosHttpClient_js_1.fetchHtml)(siteConfig.homeUrl);
        const categorias = parseMenuCategories(homeHtml) || [];
        console.log(`Categorías encontradas en el menú: ${categorias.length}`);
        console.dir(categorias.slice(0, 10), { depth: null });
        if (categorias.length === 0) {
            console.warn(`[${siteId}] No se encontraron categorías en el menú.`);
            return;
        }
        const category = categorias[0];
        console.log(`\nUsando SOLO la primera categoría: ${category.name}`);
        console.log(`URL categoría: ${category.url}`);
        const pageUrl = category.url;
        const html = yield (0, AxiosHttpClient_js_1.fetchHtml)(pageUrl);
        const parseResult = parseCategory({ html, category });
        const { products } = (0, ParseResultNormalizer_js_1.normalizeParseResult)(parseResult.products);
        console.log(`Productos encontrados en esta página: ${products.length}`);
        console.dir(products.slice(0, 10), { depth: null });
        if (products.length === 0) {
            console.log(`[${siteId}] No hay productos en la primera página de ${category.name}.`);
            return;
        }
        const productsForDb = products.map((p) => ProductMapper_js_1.ProductMapper.toDb({ p, shop: category.shopId, category: category.url }));
        console.log(`\nGuardando en BD ${productsForDb.length} productos de ${siteConfig.name}...`);
        const productRepository = new PrismaProductRepository_js_1.PrismaProductRepository();
        const result = yield productRepository.saveMany(productsForDb);
        console.log(`Guardados/actualizados en BD para ${siteConfig.name}: ${result.count}`);
    });
}
