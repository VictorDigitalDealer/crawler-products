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
exports.crawlCategory = crawlCategory;
const ParseResultNormalizer_js_1 = require("../../infrastructure/mappers/ParseResultNormalizer.js");
const menuParsers_js_1 = require("../../infrastructure/scrapers/menuParsers.js");
const sleep_js_1 = require("../../utils/sleep.js");
const AxiosHttpClient_js_1 = require("../../infrastructure/http/AxiosHttpClient.js");
const error_js_1 = require("../../utils/error.js");
function crawlCategory(category) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`\n=== [${category.shopId}] Categoría: ${category.name} ===`);
        console.log(`URL base: ${category.url}`);
        const parseCategory = (0, menuParsers_js_1.getCategoryParser)(category.shopId);
        let pageUrl = category.url;
        let page = 1;
        const maxPagesSafeGuard = 50;
        const categoryProducts = [];
        while (pageUrl && page <= maxPagesSafeGuard) {
            console.log(`\n[${category.shopId}] ${category.name} → Página ${page}`);
            console.log(`URL página: ${pageUrl}`);
            try {
                const html = yield (0, AxiosHttpClient_js_1.fetchHtml)(pageUrl);
                const parseResult = parseCategory({ html, category });
                const { products, pagination } = (0, ParseResultNormalizer_js_1.normalizeParseResult)(parseResult.products);
                console.log(`Productos encontrados en esta página: ${products.length}`);
                for (const p of products) {
                    categoryProducts.push(Object.assign(Object.assign({}, p), { shop: category.shopId }));
                }
                const nextPageUrl = (pagination === null || pagination === void 0 ? void 0 : pagination.nextPageUrl) || null;
                if (!nextPageUrl || nextPageUrl === pageUrl) {
                    break;
                }
                pageUrl = nextPageUrl;
                page += 1;
                yield (0, sleep_js_1.sleep)(1000);
            }
            catch (err) {
                console.error(`Error al procesar la categoría ${category.name} (${category.shopId}) en página ${page}:`, (0, error_js_1.getErrorMessage)(err));
                break;
            }
        }
        if (page > maxPagesSafeGuard) {
            console.warn(`[${category.shopId}] Se alcanzó el límite de páginas (${maxPagesSafeGuard}) para la categoría ${category.name}. Revisa la paginación.`);
        }
        return categoryProducts;
    });
}
