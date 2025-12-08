import {
  getMenuParser,
  getCategoryParser,
} from "../../infrastructure/scrapers/menuParsers.js";
import { ProductMapper } from "../../infrastructure/mappers/ProductMapper.js";
import { CategoryType, ShopId, ShopType } from "../../infrastructure/types.js";
import { fetchHtml } from "../../infrastructure/http/AxiosHttpClient.js";
import { normalizeParseResult } from "../../infrastructure/mappers/ParseResultNormalizer.js";
import { PrismaProductRepository } from "../../infrastructure/db/PrismaProductRepository.js";

export async function crawlOnePage(siteId: ShopId, siteConfig: ShopType) {
  console.log("\n====================================");
  console.log(`crawlOnePage → ${siteConfig.name} (${siteId})`);
  console.log("Home URL:", siteConfig.homeUrl);
  console.log("====================================\n");

  const parseMenuCategories = getMenuParser(siteId);
  const parseCategory = getCategoryParser(siteId);

  // 1) Home → categorías
  const homeHtml = await fetchHtml(siteConfig.homeUrl);
  const categorias = (parseMenuCategories(homeHtml) as CategoryType[]) || [];

  console.log(`Categorías encontradas en el menú: ${categorias.length}`);
  console.dir(categorias.slice(0, 10), { depth: null });

  if (categorias.length === 0) {
    console.warn(`[${siteId}] No se encontraron categorías en el menú.`);
    return;
  }

  const category: CategoryType = categorias[0];
  console.log(`\nUsando SOLO la primera categoría: ${category.name}`);
  console.log(`URL categoría: ${category.url}`);

  const pageUrl = category.url;

  const html = await fetchHtml(pageUrl);
  const parseResult = parseCategory({ html, category });
  const { products } = normalizeParseResult(parseResult.products);

  console.log(`Productos encontrados en esta página: ${products.length}`);
  console.dir(products.slice(0, 10), { depth: null });

  if (products.length === 0) {
    console.log(
      `[${siteId}] No hay productos en la primera página de ${category.name}.`,
    );
    return;
  }

  const productsForDb = products.map((p) =>
    ProductMapper.toDb({ ...p, shop: category.shopId, category: category.id }),
  );

  console.log(
    `\nGuardando en BD ${productsForDb.length} productos de ${siteConfig.name}...`,
  );

  const productRepository = new PrismaProductRepository();

  const result = await productRepository.saveMany(productsForDb);

  console.log(
    `Guardados/actualizados en BD para ${siteConfig.name}: ${result.count}`,
  );
}
