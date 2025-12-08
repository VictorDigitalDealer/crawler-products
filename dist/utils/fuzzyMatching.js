"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareNames = compareNames;
exports.compareCategories = compareCategories;
exports.compareStrings = compareStrings;
exports.comparePrices = comparePrices;
const fuse_js_1 = __importDefault(require("fuse.js"));
const fuseOptions = {
    includeScore: true,
    threshold: 0.6,
    ignoreLocation: true,
    distance: 5,
    keys: ["name", "category"],
};
function compareNames(product1, product2) {
    var _a, _b;
    const fuse = new fuse_js_1.default([product2], fuseOptions);
    const result = fuse.search(product1.name);
    const score = (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 1;
    return 1 - score || 0;
}
function compareCategories(product1, product2) {
    var _a, _b;
    const fuse = new fuse_js_1.default([product2], fuseOptions);
    const result = fuse.search(product1.category);
    const score = (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 1;
    return 1 - score || 0;
}
const fuseOptions2 = {
    includeScore: true,
    threshold: 0.5,
};
function compareStrings(string1, string2) {
    var _a, _b;
    const fuse = new fuse_js_1.default([string2], fuseOptions2);
    const result = fuse.search(string1);
    const score = (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 1;
    return 1 - score || 0;
}
function comparePrices(price1, price2) {
    const diff = Math.abs(price1 - price2);
    const maxPrice = Math.max(price1, price2);
    return 1 - diff / maxPrice;
}
