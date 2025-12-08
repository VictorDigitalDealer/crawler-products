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
exports.crawlSite = crawlSite;
const menuParsers_js_1 = require("../../infrastructure/scrapers/menuParsers.js");
const saveProductsToDb_js_1 = require("../../infrastructure/db/saveProductsToDb.js");
const crawlCategory_js_1 = require("./crawlCategory.js");
const sleep_js_1 = require("../../utils/sleep.js");
const AxiosHttpClient_js_1 = require("../../infrastructure/http/AxiosHttpClient.js");
const error_js_1 = require("../../utils/error.js");
const ExcelExporter_js_1 = require("../../infrastructure/excel/ExcelExporter.js");
function crawlSite(shop) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\n====================================");
        console.log(`Procesando sitio: ${shop.name} (${shop.nameId})`);
        console.log("Home URL:", shop.homeUrl);
        console.log("====================================\n");
        const parseMenuCategories = (0, menuParsers_js_1.getMenuParser)(shop.nameId);
        const homeHtml = yield (0, AxiosHttpClient_js_1.fetchHtml)(shop.homeUrl);
        const categories = parseMenuCategories(homeHtml);
        console.log(`Categorías encontradas en el menú: ${categories.length}`);
        console.dir(categories.slice(0, 20), { depth: null });
        const allProducts = [];
        for (const category of categories) {
            const categoryProducts = yield (0, crawlCategory_js_1.crawlCategory)(category);
            allProducts.push(...categoryProducts);
            if (categoryProducts.length > 0) {
                console.log(`Guardando en BD ${categoryProducts.length} productos para la categoría ${category.name}...`);
                try {
                    if (categoryProducts.length > 0) {
                        console.log(`Guardando en BD ${categoryProducts.length} productos para la categoría ${category.name}...`);
                        yield (0, saveProductsToDb_js_1.saveProductsToDb)({ shop, allProducts: categoryProducts });
                    }
                }
                catch (err) {
                    console.error(`Error al guardar productos de la categoría ${category.name}: ${(0, error_js_1.getErrorMessage)(err)}`);
                }
            }
            yield (0, sleep_js_1.sleep)(1000);
        }
        console.log(`\nTOTAL productos recogidos para ${shop.name}: ${allProducts.length}`);
        if (allProducts.length === 0) {
            console.log("No hay productos que exportar para este sitio.");
            return;
        }
        ExcelExporter_js_1.ExportToExcel.export(allProducts, shop.excelName);
    });
}
