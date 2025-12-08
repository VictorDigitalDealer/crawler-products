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
exports.parseCategoryEurogrow = parseCategoryEurogrow;
const cheerio = __importStar(require("cheerio"));
function parseCategoryEurogrow({ html, category, }) {
    const $ = cheerio.load(html);
    const products = [];
    $("li.ajax_block_product").each((_, el) => {
        const name = $(el).find(".product-name").first().text().trim() ||
            $(el).find(".product-name.visible-xs.eurogrowdata").text().trim();
        const url = $(el).find("a.product_img_link").attr("href");
        const priceText = $(el).find(".price.product-price").first().text().trim();
        if (!name || !url)
            return;
        products.push({
            id: 1,
            category: category.name,
            name: name,
            price: Number(priceText),
            url: " ",
            imageUrl: "",
            scrapedAt: new Date(),
            updatedAt: new Date(),
            shop: "eurogrow",
        });
    });
    let currentPage = 1;
    let totalPages = null;
    let nextPageUrl = null;
    if (category.url) {
        try {
            const u = new URL(category.url);
            const pParam = u.searchParams.get("p");
            if (pParam)
                currentPage = Number(pParam) || 1;
        }
        catch (_a) {
            console.log("");
        }
    }
    const $pagination = $("nav.pagination, .pagination").first();
    if ($pagination.length) {
        const pageNumbers = [];
        $pagination.find("li").each((_, li) => {
            const txt = $(li).text().trim();
            const match = txt.match(/^\d+$/);
            if (match) {
                pageNumbers.push(Number(match[0]));
            }
        });
        if (pageNumbers.length) {
            totalPages = Math.max(...pageNumbers);
        }
    }
    if (totalPages && currentPage < totalPages && category.url) {
        try {
            const u = new URL(category.url);
            u.searchParams.set("p", String(currentPage + 1));
            nextPageUrl = u.toString();
        }
        catch (_b) {
            if (category.url.includes("?")) {
                if (category.url.includes("p=")) {
                    nextPageUrl = category.url.replace(/p=\d+/, `p=${currentPage + 1}`);
                }
                else {
                    nextPageUrl = `${category.url}&p=${currentPage + 1}`;
                }
            }
            else {
                nextPageUrl = `${category.url}?p=${currentPage + 1}`;
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
        pageUrl: category.url,
    };
}
