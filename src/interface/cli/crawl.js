// crawler.js
import { fetchHtml } from "../../infrastructure/http/AxiosHttpClient.js";
import { exportToExcel } from "../../infrastructure/excel/ExcelExporter.js";
import { SITES } from "../../../config/sites.js";
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

async function runForSite(siteId, siteConfig) {
  console.log("\n====================================");
  console.log(`Procesando sitio: ${siteConfig.name} (${siteId})`);
  console.log("Home URL:", siteConfig.homeUrl);
  console.log("====================================\n");

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
    for (const [siteId, siteConfig] of Object.entries(SITES)) {
      await runForSite(siteId, siteConfig);
    }
  } else if (SITES[target]) {
    await runForSite(target, SITES[target]);
  } else {
    console.log("Sitio no reconocido. Usa uno de:");
    console.log(Object.keys(SITES).join(", ") + ", all");
  }
}

main().catch((e) => {
  console.error("Fallo en el crawler:", e.message);
});
