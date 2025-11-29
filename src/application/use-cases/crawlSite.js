import {
  getMenuParser,
  getCategoryParser,
} from "../../infrastructure/scrapers/menuParsers.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeParseResult(parseResult) {
  if (Array.isArray(parseResult)) {
    return {
      products: parseResult,
      pagination: null,
    };
  }

  if (parseResult && typeof parseResult === "object") {
    const { products = [], pagination = null } = parseResult;
    return {
      products: Array.isArray(products) ? products : [],
      pagination,
    };
  }

  return {
    products: [],
    pagination: null,
  };
}

export async function crawlSite(
  siteId,
  siteConfig,
  { fetchHtml, excelExporter, productRepository },
) {
  console.log("\n====================================");
  console.log(`Procesando sitio: ${siteConfig.name} (${siteId})`);
  console.log("Home URL:", siteConfig.homeUrl);
  console.log("====================================\n");

  console.log("crawlSite() recibió:");
  console.log("siteId:", siteId);
  console.log("siteConfig:", siteConfig);

  const parseMenuCategories = getMenuParser(siteId);
  const parseCategory = getCategoryParser(siteId);

  const homeHtml = await fetchHtml(siteConfig.homeUrl);
  const categorias = parseMenuCategories(homeHtml);

  console.log(`Categorías encontradas en el menú: ${categorias.length}`);
  console.dir(categorias.slice(0, 20), { depth: null });

  const allProducts = [];

  for (const categoria of categorias) {
    console.log(`\n=== [${siteId}] Categoría: ${categoria.nombre} ===`);
    console.log(`URL base: ${categoria.url}`);

    let pageUrl = categoria.url;
    let page = 1;
    const maxPagesSafeGuard = 50;

    while (pageUrl && page <= maxPagesSafeGuard) {
      console.log(`\n[${siteId}] ${categoria.nombre} → Página ${page}`);
      console.log(`URL página: ${pageUrl}`);

      try {
        const html = await fetchHtml(pageUrl);

        const parseResult = parseCategory(html, pageUrl);
        const { products, pagination } = normalizeParseResult(parseResult);

        console.log(`Productos encontrados en esta página: ${products.length}`);

        for (const p of products) {
          allProducts.push({
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

    await sleep(1000);
  }

  console.log(
    `\nTOTAL productos recogidos para ${siteConfig.name}: ${allProducts.length}`,
  );

  if (allProducts.length === 0) {
    console.log("No hay productos que exportar para este sitio.");
    return;
  }

  console.log("[DEBUG excel]");

  excelExporter.export(allProducts, siteConfig.excelName);

  const productsForDb = allProducts.map((p) => ({
    name: p.name ?? p.nombre,
    shop: p.sitio,
    url: p.url,
    price: p.price ?? p.precio,
    category: p.categoria,
    categoryUrl: p.categoria_url,
    scrapedAt: new Date(),
  }));

  const result = await productRepository.saveMany(productsForDb);
  console.log(
    `Productos guardados/actualizados en BD para ${siteConfig.name}: ${result.count}`,
  );
}
