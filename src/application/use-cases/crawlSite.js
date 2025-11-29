import { getMenuParser } from "../../infrastructure/scrapers/menuParsers.js";
import { saveProductsToDb } from "../../infrastructure/db/saveProductsToDb.js";
import { crawlCategory } from "../../application/use-cases/crawlCategory.js";
import { sleep } from "../../utils/sleep.js";

export async function crawlSite(
  siteId,
  siteConfig,
  { fetchHtml, excelExporter, productRepository },
) {
  console.log("\n====================================");
  console.log(`Procesando sitio: ${siteConfig.name} (${siteId})`);
  console.log("Home URL:", siteConfig.homeUrl);
  console.log("====================================\n");

  const parseMenuCategories = getMenuParser(siteId);

  const homeHtml = await fetchHtml(siteConfig.homeUrl);
  const categorias = parseMenuCategories(homeHtml);

  console.log(`Categorías encontradas en el menú: ${categorias.length}`);
  console.dir(categorias.slice(0, 20), { depth: null });

  const allProducts = [];

  for (const categoria of categorias) {
    const categoryProducts = await crawlCategory(
      siteId,
      siteConfig,
      categoria,
      { fetchHtml },
    );

    allProducts.push(...categoryProducts);

    if (categoryProducts.length > 0) {
      console.log(
        `Guardando en BD ${categoryProducts.length} productos para la categoría ${categoria.nombre}...`,
      );
      try {
        if (categoryProducts.length > 0) {
          console.log(
            `Guardando en BD ${categoryProducts.length} productos para la categoría ${categoria.nombre}...`,
          );
          await saveProductsToDb(
            categoryProducts,
            siteConfig,
            productRepository,
          );
        }
      } catch (err) {
        console.error(
          `Error al guardar productos de la categoría ${categoria.nombre}: ${err.message}`,
        );
      }
    }

    await sleep(1000);
  }

  console.log(
    `\nTOTAL productos recogidos para ${siteConfig.name}: ${allProducts.length}`,
  );

  if (allProducts.length === 0) {
    console.log("No hay productos que exportar para este sitio.");
    return;
  }

  excelExporter.export(allProducts, siteConfig.excelName);
}
