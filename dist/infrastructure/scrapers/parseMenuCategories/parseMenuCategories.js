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
exports.parseMenuCategoriesGeneric = parseMenuCategoriesGeneric;
const cheerio = __importStar(require("cheerio"));
function parseMenuCategoriesGeneric(html) {
    const $ = cheerio.load(html);
    const categories = [];
    const seenUrls = new Set();
    const addCategory = ({ name, url }) => {
        if (!url || !name)
            return;
        const cleanName = name.replace(/\s+/g, " ").trim();
        if (!cleanName)
            return;
        if (seenUrls.has(url))
            return;
        seenUrls.add(url);
        categories.push({ name: cleanName, url, shopId: "eurogrow", id: "" });
    };
    const $nav = $("#cbp-hrmenu");
    if ($nav.length === 0) {
        console.log("⚠️ No se encontró #cbp-hrmenu (genérico).");
        return categories;
    }
    $nav.find("a").each((_, el) => {
        const url = $(el).attr("href") || "";
        const name = $(el).text().trim();
        addCategory({ name, url, shopId: "eurogrow", id: "" });
    });
    return categories;
}
