import { SITES } from "../../config/sites.js";
import { crawlSite } from "../../application/use-cases/crawlSite.js";
import { ArgumentType, ShopId } from "../../infrastructure/types.js";

function isShopId(value: string): value is ShopId {
  return value in SITES;
}

async function main() {
  const arg: string = process.argv[2] || "eurogrow";

  const target: ArgumentType = isShopId(arg) ? arg : "eurogrow";
  const all: ArgumentType = "all";
  console.log("Target recibido:", target);

  console.log(SITES);
  if ((target as ArgumentType) === all) {
    for (const siteConfig of Object.values(SITES)) {
      await crawlSite(siteConfig);
    }
  } else if (SITES[target]) {
    console.log("Llamando crawlSite");
    await crawlSite(SITES[target]);
  } else {
    console.log("Sitio no reconocido. Usa uno de:");
    console.log(Object.keys(SITES).join(", ") + ", all");
  }
}

main().catch((e) => {
  console.error("Fallo en el crawler:");
  console.error(e);
});
