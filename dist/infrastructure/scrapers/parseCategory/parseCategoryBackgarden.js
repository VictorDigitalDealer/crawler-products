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
exports.parseCategoryBackgarden = parseCategoryBackgarden;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("./utils");
function parseCategoryBackgarden({ html, category, }) {
    const $ = cheerio.load(html);
    const products = [];
    const pageUrl = category.url;
    $("li.product").each((_, el) => {
        const $li = $(el);
        const $productLink = $li.find("a.woocommerce-LoopProduct-link").first();
        const url = $productLink.attr("href");
        if (!url)
            return;
        const name = $li
            .find(".woocommerce-loop-product__title")
            .first()
            .text()
            .trim();
        const $img = $li.find("img").first();
        const imageUrl = $img.attr("data-src") ||
            $img.attr("data-lazy-src") ||
            $img.attr("src") ||
            "";
        const $priceContainer = $li.find("span.price").first();
        const $del = $priceContainer.find("del .woocommerce-Price-amount").first();
        const $ins = $priceContainer.find("ins .woocommerce-Price-amount").first();
        const $amount = $priceContainer.find(".woocommerce-Price-amount").first();
        let price = 0;
        if ($ins.length) {
            price = (0, utils_1.textToNumber)($del.text() || $amount.text());
        }
        else if ($amount.length) {
            price = (0, utils_1.textToNumber)($amount.text());
        }
        const classAttr = $li.attr("class") || "";
        const categories = classAttr
            .split(/\s+/)
            .filter((cls) => cls.startsWith("product_cat-"))
            .map((cls) => cls.replace("product_cat-", "").trim())
            .filter(Boolean);
        products.push({
            name,
            url,
            imageUrl,
            price,
            category: categories[0],
            id: 0,
            shop: category.shopId,
            scrapedAt: new Date(),
            updatedAt: new Date(),
        });
    });
    let currentPage = 1;
    let totalPages = null;
    let nextPageUrl = null;
    const $pagination = $(".woocommerce-pagination, nav.woocommerce-pagination").first();
    if ($pagination.length) {
        const $current = $pagination.find(".page-numbers .current").first();
        if ($current.length) {
            const n = parseInt($current.text().trim(), 10);
            if (!Number.isNaN(n))
                currentPage = n;
        }
        const pageNumbers = [];
        $pagination
            .find(".page-numbers li .page-numbers")
            .not(".next")
            .not(".prev")
            .each((_, el) => {
            const txt = $(el).text().trim();
            const num = parseInt(txt, 10);
            if (!Number.isNaN(num))
                pageNumbers.push(num);
        });
        if (pageNumbers.length) {
            totalPages = Math.max(...pageNumbers);
        }
        // enlace "next"
        const $next = $pagination.find(".page-numbers .next").first();
        if ($next.length) {
            const href = $next.attr("href");
            if (href) {
                try {
                    nextPageUrl = new URL(href, pageUrl || "https://backgarden.es").toString();
                }
                catch (_a) {
                    nextPageUrl = href;
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
