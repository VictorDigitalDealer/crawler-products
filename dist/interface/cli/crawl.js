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
const sites_js_1 = require("../../config/sites.js");
const crawlSite_js_1 = require("../../application/use-cases/crawlSite.js");
function isShopId(value) {
    return value in sites_js_1.SITES;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const arg = process.argv[2] || "eurogrow";
        const target = isShopId(arg) ? arg : "eurogrow";
        const all = "all";
        console.log("Target recibido:", target);
        console.log(sites_js_1.SITES);
        if (target === all) {
            for (const siteConfig of Object.values(sites_js_1.SITES)) {
                yield (0, crawlSite_js_1.crawlSite)(siteConfig);
            }
        }
        else if (sites_js_1.SITES[target]) {
            console.log("Llamando crawlSite");
            yield (0, crawlSite_js_1.crawlSite)(sites_js_1.SITES[target]);
        }
        else {
            console.log("Sitio no reconocido. Usa uno de:");
            console.log(Object.keys(sites_js_1.SITES).join(", ") + ", all");
        }
    });
}
main().catch((e) => {
    console.error("Fallo en el crawler:");
    console.error(e);
});
