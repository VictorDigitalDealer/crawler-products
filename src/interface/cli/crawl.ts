import { SITES } from "../../config/sites.js";
import { fetchHtml } from "../../infrastructure/http/AxiosHttpClient.js";

import { PrismaProductRepository } from "../../infrastructure/db/PrismaProductRepository.js";
import { crawlSite } from "../../application/use-cases/crawlSite.js";
import { ArgumentType, ShopId } from "../../infrastructure/types.js";
import { ExportToExcel } from "../../infrastructure/excel/ExcelExporter.js";

function isShopId(value: string): value is ShopId {
  return value in SITES;
}

async function main() {
  const arg = process.argv[2] || "eurogrow";

  const target: ArgumentType = isShopId(arg) ? arg : "eurogrow";
  console.log("Target recibido:", target);

  const excelExporter = new ExportToExcel();
  const productRepository = new PrismaProductRepository();
  console.log(SITES);
  if (target === "all") {
    for (const [siteId, siteConfig] of Object.entries(SITES)) {
      await crawlSite(siteId, siteConfig, {
        fetchHtml,
        excelExporter,
        productRepository,
      });
    }
  } else if (SITES[target]) {
    console.log("Llamando crawlSite");
    await crawlSite(target, SITES[target], {
      fetchHtml,
      excelExporter,
      productRepository,
    });
  } else {
    console.log("Sitio no reconocido. Usa uno de:");
    console.log(Object.keys(SITES).join(", ") + ", all");
  }
}

main().catch((e) => {
  console.error("Fallo en el crawler:");
  console.error(e);
});
