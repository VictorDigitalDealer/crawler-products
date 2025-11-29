import {
  getMenuParser,
  getCategoryParser,
} from "../../infrastructure/scrapers/menuParsers.js";
import { ProductMapper } from "../../infrastructure/mappers/ProductMapper.js";

function normalizeParseResult(parseResult) {
  if (Array.isArray(parseResult)) {
    return { products: parseResult, pagination: null };
  }

  if (parseResult && typeof parseResult === "object") {
    const { products = [], pagination = null } = parseResult;
    return {
      products: Array.isArray(products) ? products : [],
      pagination,
    };
  }

  return { products: [], pagination: null };
}

export async function crawlOnePage(
  siteId,
  siteConfig,
  { fetchHtml, productRepository },
) {
  console.log("\n====================================");
  console.log(`crawlOnePage → ${siteConfig.name} (${siteId})`);
  console.log("Home URL:", siteConfig.homeUrl);
  console.log("====================================\n");

  const parseMenuCategories = getMenuParser(siteId);
  const parseCategory = getCategoryParser(siteId);

  // 1) Home → categorías
  const homeHtml = await fetchHtml(siteConfig.homeUrl);
  const categorias = parseMenuCategories(homeHtml) || [];

  console.log(`Categorías encontradas en el menú: ${categorias.length}`);
  console.dir(categorias.slice(0, 10), { depth: null });

  if (categorias.length === 0) {
    console.warn(`[${siteId}] No se encontraron categorías en el menú.`);
    return;
  }

  // Usamos SOLO la primera categoría para depurar
  const categoria = categorias[0];
  console.log(`\nUsando SOLO la primera categoría: ${categoria.nombre}`);
  console.log(`URL categoría: ${categoria.url}`);

  const pageUrl = categoria.url;

  // 2) Leer SOLO la primera página de esa categoría
  const html = await fetchHtml(pageUrl);
  const parseResult = parseCategory(html, pageUrl);
  const { products } = normalizeParseResult(parseResult);

  console.log(`Productos encontrados en esta página: ${products.length}`);
  console.dir(products.slice(0, 10), { depth: null });

  if (products.length === 0) {
    console.log(
      `[${siteId}] No hay productos en la primera página de ${categoria.nombre}.`,
    );
    return;
  }

  const productsForDb = products.map((p) =>
    ProductMapper.toDb(p, {
      siteName: siteConfig.name,
      categoryName: categoria.nombre,
      categoryUrl: categoria.url,
    }),
  );

  console.log(
    `\nGuardando en BD ${productsForDb.length} productos de ${siteConfig.name}...`,
  );

  const result = await productRepository.saveMany(productsForDb);

  console.log(
    `Guardados/actualizados en BD para ${siteConfig.name}: ${result.count}`,
  );
}
