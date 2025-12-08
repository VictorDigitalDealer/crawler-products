import { getCategoryParser } from "../../infrastructure/scrapers/menuParsers.js";
import { CategoryType, ProductType } from "../../infrastructure/types.js";
import { sleep } from "../../utils/sleep.js";
import { fetchHtml } from "../../infrastructure/http/AxiosHttpClient.js";
import { getErrorMessage } from "../../utils/error.js";

export async function crawlCategory(category: CategoryType) {
  console.log(`\n=== [${category.shopId}] Categoría: ${category.name} ===`);
  console.log(`URL base: ${category.url}`);

  const parseCategory = getCategoryParser(category.shopId);

  let pageUrl = category.url;
  let page = 1;
  const maxPagesSafeGuard = 50;

  const categoryProducts: ProductType[] = [];

  while (pageUrl && page <= maxPagesSafeGuard) {
    console.log(`\n[${category.shopId}] ${category.name} → Página ${page}`);
    console.log(`URL página: ${pageUrl}`);

    try {
      const html = await fetchHtml(pageUrl);

      const parseResult = parseCategory({ html, category });
      const { products, pagination } = parseResult;

      console.log(`Productos encontrados en esta página: ${products.length}`);

      for (const p of products) {
        categoryProducts.push({
          ...p,
          shop: category.shopId,
        });
      }

      const nextPageUrl = pagination?.nextPageUrl ?? null;

      if (!nextPageUrl || nextPageUrl === pageUrl) {
        break;
      }

      pageUrl = nextPageUrl;
      page += 1;
      await sleep(1000);
    } catch (err: unknown) {
      console.error(
        `Error al procesar la categoría ${category.name} (${category.shopId}) en página ${page}:`,
        getErrorMessage(err),
      );
      break;
    }
  }

  if (page > maxPagesSafeGuard) {
    console.warn(
      `[${category.shopId}] Se alcanzó el límite de páginas (${maxPagesSafeGuard}) para la categoría ${category.name}. Revisa la paginación.`,
    );
  }

  return categoryProducts;
}
