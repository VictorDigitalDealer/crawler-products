"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMenuCategoriesBackgarden = parseMenuCategoriesBackgarden;
const cheerio = __importStar(require("cheerio"));
function parseMenuCategoriesBackgarden(html) {
    if (!html || typeof html !== "string")
        return [];
    const $ = cheerio.load(html);
    const categories = [];
    const seen = new Set();
    const addCat = ({ name, url }) => {
        if (!name || !url)
            return;
        const cleanName = name.replace(/\s+/g, " ").trim();
        const cleanUrl = url.trim();
        if (!cleanName || !cleanUrl)
            return;
        if (seen.has(cleanUrl))
            return;
        seen.add(cleanUrl);
        categories.push({
            name: cleanName,
            url: cleanUrl,
            shopId: "backgarden",
            id: "",
        });
    };
    $("a.elementor-item[href]").each((_, el) => {
        var _a, _b;
        const $a = $(el);
        const url = (_a = $a.attr("href")) !== null && _a !== void 0 ? _a : "";
        const name = (_b = $a.text()) !== null && _b !== void 0 ? _b : "";
        addCat({ name, url, shopId: "backgarden", id: "" });
    });
    $("a.elementor-sub-item[href]").each((_, el) => {
        var _a, _b;
        const $a = $(el);
        const url = (_a = $a.attr("href")) !== null && _a !== void 0 ? _a : "";
        const name = (_b = $a.text()) !== null && _b !== void 0 ? _b : "";
        addCat({ name, url, shopId: "backgarden", id: "" });
    });
    return categories;
}
