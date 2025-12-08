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
exports.parseMenuCategoriesGrowbarato = parseMenuCategoriesGrowbarato;
const cheerio = __importStar(require("cheerio"));
function parseMenuCategoriesGrowbarato(html) {
    if (!html || typeof html !== "string")
        return [];
    const $ = cheerio.load(html);
    const categories = [];
    const seenUrls = new Set();
    const addCategory = ({ name, url }) => {
        if (!url || !name)
            return;
        const cleanName = name.replace(/\s+/g, " ").trim();
        if (!cleanName)
            return;
        const cleanUrl = url.trim();
        if (!cleanUrl)
            return;
        if (seenUrls.has(cleanUrl))
            return;
        seenUrls.add(cleanUrl);
        categories.push({
            name: cleanName,
            url: cleanUrl,
            shopId: "growbarato",
            id: "",
        });
    };
    $("#soymenu_main_ul > li.soymenu_category a.dropdown-item[href]").each((_, el) => {
        const $a = $(el);
        const name = $a.text().replace(/\s+/g, " ").trim();
        const url = $a.attr("href") || "";
        addCategory({ name, url, shopId: "growbarato", id: "" });
    });
    $("li.soymm_category a.dropdown-submenu[href]").each((_, el) => {
        const $a = $(el);
        const name = $a.text().replace(/\s+/g, " ").trim();
        const url = $a.attr("href") || "";
        addCategory({ name, url, shopId: "growbarato", id: "" });
    });
    $("li.soymm_category span.dropdown-submenu").each((_, el) => {
        const $span = $(el);
        const name = $span.text().replace(/\s+/g, " ").trim();
        const onclick = $span.attr("onclick") || "";
        let url = "";
        const match = onclick.match(/window\.location\.href='([^']+)'/);
        if (match && match[1]) {
            url = match[1];
        }
        addCategory({ name, url, shopId: "growbarato", id: "" });
    });
    return categories;
}
