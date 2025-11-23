// crawler.js
import { fetchHtml } from "./services/services.js";
import { exportToExcel } from "./utils/excel.js";
import { SITES } from "./config/sites.js";
import { getMenuParser, getCategoryParser } from "./functions/menuParsers.js";

// Pequeño helper para esperar entre peticiones
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normaliza el resultado de un parseCategory:
 *  - Si devuelve un array -> lo interpretamos como lista de productos
 *  - Si devuelve un objeto -> intentamos leer result.products y result.pagination
 */
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

// Lógica para procesar UNA web concreta
async function runForSite(siteId, siteConfig) {
  console.log("\n====================================");
  console.log(`Procesando sitio: ${siteConfig.name} (${siteId})`);
  console.log("Home URL:", siteConfig.homeUrl);
  console.log("====================================\n");

  // Parsers según la web
  const parseMenuCategories = getMenuParser(siteId);
  const parseCategory = getCategoryParser(siteId);

  // 1) Obtener HTML de la home y parsear menú
  const homeHtml = await fetchHtml(siteConfig.homeUrl);
  const categorias = parseMenuCategories(homeHtml);

  console.log(`Categorías encontradas en el menú: ${categorias.length}`);
  console.dir(categorias.slice(0, 20), { depth: null });

  const allProducts = [];

  // 2) Recorrer categorías
  for (const categoria of categorias) {
    console.log(`\n=== [${siteId}] Categoría: ${categoria.nombre} ===`);
    console.log(`URL base: ${categoria.url}`);

    let pageUrl = categoria.url;
    let page = 1;
    const maxPagesSafeGuard = 50; // por si hay algún bucle raro

    while (pageUrl && page <= maxPagesSafeGuard) {
      console.log(`\n[${siteId}] ${categoria.nombre} → Página ${page}`);
      console.log(`URL página: ${pageUrl}`);

      try {
        const html = await fetchHtml(pageUrl);

        // Importante: pasamos TAMBIÉN la pageUrl por si el parser la usa
        const parseResult = parseCategory(html, pageUrl);
        const { products, pagination } = normalizeParseResult(parseResult);

        console.log(`Productos encontrados en esta página: ${products.length}`);

        // Guardar productos
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

        // Paginación: el parser decide si hay siguiente página
        const nextPageUrl = pagination?.nextPageUrl || null;

        if (!nextPageUrl || nextPageUrl === pageUrl) {
          // No hay más páginas
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
        // Si hay error en una página, salimos del bucle de esa categoría
        break;
      }
    }

    if (page > maxPagesSafeGuard) {
      console.warn(
        `[${siteId}] Se alcanzó el límite de páginas (${maxPagesSafeGuard}) para la categoría ${categoria.nombre}. Revisa la paginación.`,
      );
    }

    // Pausa entre categorías
    await sleep(1000);
  }

  console.log(
    `\nTOTAL productos recogidos para ${siteConfig.name}: ${allProducts.length}`,
  );

  if (allProducts.length > 0) {
    exportToExcel(allProducts, siteConfig.excelName);
  } else {
    console.log("No hay productos que exportar para este sitio.");
  }
}

async function main() {
  const target = process.argv[2] || "eurogrow";
  console.log("Target recibido:", target);

  if (target === "all") {
    // Ejecutar para todos los sitios definidos en SITES
    for (const [siteId, siteConfig] of Object.entries(SITES)) {
      await runForSite(siteId, siteConfig);
    }
  } else if (SITES[target]) {
    // Ejecutar solo para un sitio concreto
    await runForSite(target, SITES[target]);
  } else {
    console.log("Sitio no reconocido. Usa uno de:");
    console.log(Object.keys(SITES).join(", ") + ", all");
  }
}

main().catch((e) => {
  console.error("Fallo en el crawler:", e.message);
});
