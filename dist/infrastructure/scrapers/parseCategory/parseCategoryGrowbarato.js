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
exports.parseCategoryGrowbarato = parseCategoryGrowbarato;
// functions/parseCategory/parseCategoryGrowbarato.js
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("./utils");
function parseCategoryGrowbarato({ html, category, }) {
    const $ = cheerio.load(html);
    const products = [];
    $("li.product-miniature.js-product-miniature, article.product-miniature.js-product-miniature").each((_, el) => {
        const $el = $(el);
        const $link = $el.find("a.thumbnail.product-thumbnail").first();
        const url = $link.attr("href") || "";
        const name = $el.find("h3.product-title").first().text().trim();
        const $img = $el.find("img").first();
        const imageUrl = $img.attr("data-full-size-image-url") || $img.attr("src") || "";
        const $priceContainer = $el
            .find(".product-price-and-shipping .price")
            .first();
        const priceText = $priceContainer.text().replace(/\s+/g, " ").trim();
        const price = (0, utils_1.textToNumber)(priceText) || 0;
        if (!name && !url)
            return;
        products.push({
            id: 1,
            name,
            url,
            imageUrl,
            price,
            category: category.name,
            shop: "growbarato",
            scrapedAt: new Date(),
            updatedAt: new Date(),
        });
    });
    const $pagination = $("nav.pagination, .pagination").first();
    let currentPage = 1;
    let totalPages = null;
    let nextPageUrl = null;
    const pageUrl = category.url;
    if ($pagination.length) {
        const $currentLi = $pagination.find("ul.page-list li.current").first();
        if ($currentLi.length) {
            const currentText = $currentLi.find("span").first().text().trim();
            const cur = parseInt(currentText, 10);
            if (!Number.isNaN(cur))
                currentPage = cur;
        }
        const pageNumbers = [];
        $pagination.find("ul.page-list li span").each((_, span) => {
            const txt = $(span).text().trim();
            const n = parseInt(txt, 10);
            if (!Number.isNaN(n))
                pageNumbers.push(n);
        });
        if (pageNumbers.length) {
            totalPages = Math.max(...pageNumbers);
        }
        const nextPageNum = currentPage + 1;
        if (totalPages && nextPageNum <= totalPages) {
            const $nextSpan = $pagination
                .find("ul.page-list li span")
                .filter((_, span) => {
                const txt = $(span).text().trim();
                const n = parseInt(txt, 10);
                return !Number.isNaN(n) && n === nextPageNum;
            })
                .first();
            if ($nextSpan.length) {
                const onclick = $nextSpan.attr("onclick") || "";
                const m = onclick.match(/window\.atob\('([^']+)'/);
                if (m && m[1]) {
                    try {
                        nextPageUrl = Buffer.from(m[1], "base64").toString("utf8");
                    }
                    catch (e) {
                        nextPageUrl = null;
                        console.log(e);
                    }
                }
            }
        }
    }
    return {
        products,
        pagination: {
            currentPage,
            totalPages,
            nextPageUrl,
        },
        pageUrl,
    };
}
