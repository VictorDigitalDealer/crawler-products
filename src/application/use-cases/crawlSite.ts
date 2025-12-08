import { getMenuParser } from "../../infrastructure/scrapers/menuParsers.js";
import { saveProductsToDb } from "../../infrastructure/db/post/saveProductsToDb.js";
import { crawlCategory } from "./crawlCategory.js";
import { sleep } from "../../utils/sleep.js";
import {
  CategoryType,
  ProductType,
  ShopType,
} from "../../infrastructure/types.js";
import { fetchHtml } from "../../infrastructure/http/AxiosHttpClient.js";
import { getErrorMessage } from "../../utils/error.js";
import { ExportToExcel } from "../../infrastructure/excel/ExcelExporter.js";

export async function crawlSite(shop: ShopType) {
  console.log("\n====================================");
  console.log(`Procesando sitio: ${shop.name} (${shop.nameId})`);
  console.log("Home URL:", shop.homeUrl);
  console.log("====================================\n");

  const parseMenuCategories = getMenuParser(shop.nameId);

  const homeHtml = await fetchHtml(shop.homeUrl);
  const categories: CategoryType[] = parseMenuCategories(
    homeHtml,
  ) as CategoryType[];

  console.log(`Categorías encontradas en el menú: ${categories.length}`);
  console.dir(categories.slice(0, 20), { depth: null });

  const allProducts = [];

  for (const category of categories) {
    const categoryProducts: ProductType[] = await crawlCategory(category);

    allProducts.push(...categoryProducts);

    if (categoryProducts.length > 0) {
      console.log(
        `Guardando en BD ${categoryProducts.length} productos para la categoría ${category.name}...`,
      );
      try {
        if (categoryProducts.length > 0) {
          console.log(
            `Guardando en BD ${categoryProducts.length} productos para la categoría ${category.name}...`,
          );
          await saveProductsToDb({ shop, allProducts: categoryProducts });
        }
      } catch (err: unknown) {
        console.error(
          `Error al guardar productos de la categoría ${category.name}: ${getErrorMessage(err)}`,
        );
      }
    }

    await sleep(1000);
  }

  console.log(
    `\nTOTAL productos recogidos para ${shop.name}: ${allProducts.length}`,
  );

  if (allProducts.length === 0) {
    console.log("No hay productos que exportar para este sitio.");
    return;
  }

  ExportToExcel.export(allProducts, shop.excelName);
}
