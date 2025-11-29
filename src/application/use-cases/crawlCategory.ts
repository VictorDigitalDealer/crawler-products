import { normalizeParseResult } from "../../infrastructure/mappers/ParseResultNormalizer.js";
import { getCategoryParser } from "../../infrastructure/scrapers/menuParsers.js";
import { categoryType, siteConfigType } from "../../infrastructure/types.js";
import { sleep } from "../../utils/sleep.js";

export type crawlCategoryProps = {
  siteId: number;
  siteConfig: siteConfigType;
  categoria: categoryType;
  fetchHtml: string;
};

export async function crawlCategory({
  siteId,
  siteConfig,
  categoria,
  fetchHtml,
}: crawlCategoryProps) {
  console.log(`\n=== [${siteId}] Categoría: ${categoria.nombre} ===`);
  console.log(`URL base: ${categoria.url}`);

  const parseCategory = getCategoryParser(siteId);

  let pageUrl = categoria.url;
  let page = 1;
  const maxPagesSafeGuard = 50;

  const categoryProducts = [];

  while (pageUrl && page <= maxPagesSafeGuard) {
    console.log(`\n[${siteId}] ${categoria.nombre} → Página ${page}`);
    console.log(`URL página: ${pageUrl}`);

    try {
      const html = await fetchHtml(pageUrl);

      const parseResult = parseCategory(html, pageUrl);
      const { products, pagination } = normalizeParseResult(parseResult);

      console.log(`Productos encontrados en esta página: ${products.length}`);

      // Agregar productos de la página a la lista de la categoría
      for (const p of products) {
        categoryProducts.push({
          sitio: siteConfig.name,
          sitio_id: siteId,
          categoria: categoria.nombre,
          categoria_url: categoria.url,
          pagina_categoria: pageUrl,
          ...p,
        });
      }

      const nextPageUrl = pagination?.nextPageUrl || null;

      if (!nextPageUrl || nextPageUrl === pageUrl) {
        break;
      }

      pageUrl = nextPageUrl;
      page += 1;
      await sleep(1000);
    } catch (err) {
      console.error(
        `Error al procesar la categoría ${categoria.nombre} (${siteId}) en página ${page}:`,
        err.message,
      );
      break;
    }
  }

  if (page > maxPagesSafeGuard) {
    console.warn(
      `[${siteId}] Se alcanzó el límite de páginas (${maxPagesSafeGuard}) para la categoría ${categoria.nombre}. Revisa la paginación.`,
    );
  }

  return categoryProducts;
}
