import { SITES } from "../../config/sites.js";
import { fetchHtml } from "../../infrastructure/http/AxiosHttpClient.js"; // usa el mismo fetchHtml que en tu crawl normal
import { PrismaProductRepository } from "../../infrastructure/db/PrismaProductRepository.js";
import { crawlOnePage } from "../../application/use-cases/crawlOnePage.js";

async function main() {
  const target = process.argv[2] || "eurogrow";
  console.log("Target recibido para ONE PAGE:", target);

  const productRepository = new PrismaProductRepository();

  const deps = {
    fetchHtml,
    productRepository,
  };

  if (target === "all") {
    for (const [siteId, siteConfig] of Object.entries(SITES)) {
      await crawlOnePage(siteId, siteConfig, deps);
    }
  } else if (SITES[target]) {
    await crawlOnePage(target, SITES[target], deps);
  } else {
    console.log("Sitio no reconocido. Usa uno de:");
    console.log(Object.keys(SITES).join(", ") + ", all");
  }
}

main().catch((e) => {
  console.error("Fallo en crawl-one-page:");
  console.error(e);
});
