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
exports.parseMenuCategoriesGrowcortesdelsur = parseMenuCategoriesGrowcortesdelsur;
const cheerio = __importStar(require("cheerio"));
function parseMenuCategoriesGrowcortesdelsur(html) {
    const $ = cheerio.load(html);
    const categorias = [];
    $("ul.wpb_category_n_menu_accordion_list > li.cat-item").each((_, li) => {
        const $li = $(li);
        const $a = $li.children("a").first();
        if (!$a.length)
            return;
        const nombreCategoria = $a
            .clone()
            .children(".wpb-submenu-indicator, .wpb-wmca-cat-count")
            .remove()
            .end()
            .text()
            .trim();
        const urlCategoria = $a.attr("href");
        if (!nombreCategoria || !urlCategoria)
            return;
        categorias.push({
            name: nombreCategoria,
            url: urlCategoria,
            shopId: "growcortesdelsur",
            id: "",
        });
        $li.find("> ul.children > li.cat-item > a").each((__, subA) => {
            const $subA = $(subA);
            const nombreSub = $subA
                .clone()
                .children(".wpb-wmca-cat-count")
                .remove()
                .end()
                .text()
                .trim();
            const urlSub = $subA.attr("href");
            if (!nombreSub || !urlSub)
                return;
            categorias.push({
                name: `${nombreCategoria} > ${nombreSub}`,
                url: urlSub,
                shopId: "growcortesdelsur",
                id: "",
            });
        });
    });
    return categorias;
}
