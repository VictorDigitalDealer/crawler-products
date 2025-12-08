"use strict";
// functions/menuParsers.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuParser = getMenuParser;
exports.getCategoryParser = getCategoryParser;
// ==== MENU PARSERS ====
const parseMenuCategories_1 = require("./parseMenuCategories/parseMenuCategories");
const parseMenuCategoriesGrowmania_1 = require("./parseMenuCategories/parseMenuCategoriesGrowmania");
const parseMenuCategoriesGrowbarato_1 = require("./parseMenuCategories/parseMenuCategoriesGrowbarato");
const parseMenuCategoriesBackgarden_1 = require("./parseMenuCategories/parseMenuCategoriesBackgarden");
const parseMenuCategoriesGrowcortesdelsur_1 = require("./parseMenuCategories/parseMenuCategoriesGrowcortesdelsur");
// ==== CATEGORY PARSERS ====
const parseCategoryEurogrow_1 = require("./parseCategory/parseCategoryEurogrow");
const parseCategoryGrowmania_js_1 = require("./parseCategory/parseCategoryGrowmania.js");
const parseCategoryGrowbarato_js_1 = require("./parseCategory/parseCategoryGrowbarato.js");
const parseCategoryBackgarden_js_1 = require("./parseCategory/parseCategoryBackgarden.js");
const parseCategoryGrowcortesdelsur_js_1 = require("./parseCategory/parseCategoryGrowcortesdelsur.js");
const MENU_PARSERS = {
    default: parseMenuCategories_1.parseMenuCategoriesGeneric,
    eurogrow: parseMenuCategories_1.parseMenuCategoriesGeneric,
    growmania: parseMenuCategoriesGrowmania_1.parseMenuCategoriesGrowmania,
    growbarato: parseMenuCategoriesGrowbarato_1.parseMenuCategoriesGrowbarato,
    backgarden: parseMenuCategoriesBackgarden_1.parseMenuCategoriesBackgarden,
    growcortesdelsur: parseMenuCategoriesGrowcortesdelsur_1.parseMenuCategoriesGrowcortesdelsur,
};
const CATEGORY_PARSERS = {
    default: parseCategoryEurogrow_1.parseCategoryEurogrow,
    eurogrow: parseCategoryEurogrow_1.parseCategoryEurogrow,
    growmania: parseCategoryGrowmania_js_1.parseCategoryGrowmania,
    growbarato: parseCategoryGrowbarato_js_1.parseCategoryGrowbarato,
    backgarden: parseCategoryBackgarden_js_1.parseCategoryBackgarden,
    growcortesdelsur: parseCategoryGrowcortesdelsur_js_1.parseCategoryGrowcortesdelsur,
};
function getMenuParser(siteId) {
    return MENU_PARSERS[siteId] || MENU_PARSERS.default;
}
function getCategoryParser(siteId) {
    return CATEGORY_PARSERS[siteId] || CATEGORY_PARSERS.default;
}
