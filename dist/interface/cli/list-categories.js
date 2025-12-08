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
const getCategoriesByShop_js_1 = require("../../infrastructure/db/getCategoriesByShop.js");
const error_js_1 = require("../../utils/error.js");
function listCategories(shopName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield (0, getCategoriesByShop_js_1.getCategoriesByShop)(shopName);
            if (categories.length === 0) {
                console.log(`No se encontraron categorías para la tienda ${shopName}.`);
                return;
            }
            console.log(`Categorías de la tienda ${shopName}:`);
            categories.forEach((category, index) => {
                console.log(`${index + 1}. ${category}`);
            });
        }
        catch (error) {
            console.error("Error al listar las categorías:", (0, error_js_1.getErrorMessage)(error));
        }
    });
}
const shopName = process.argv[2];
if (!shopName) {
    console.log("Por favor, proporciona un nombre de tienda válido.");
    process.exit(1);
}
listCategories(shopName);
