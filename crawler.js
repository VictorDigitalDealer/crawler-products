// crawler.js
import { fetchHtml } from './services/services.js';
import { exportToExcel } from './utils/excel.js';
import { SITES } from './config/sites.js';
import { getMenuParser, getCategoryParser } from './functions/menuParsers.js';

// Pequeño helper para esperar entre peticiones
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Lógica para procesar UNA web concreta
async function runForSite(siteId, siteConfig) {
  console.log('\n====================================');
  console.log(`Procesando sitio: ${siteConfig.name} (${siteId})`);
  console.log('Home URL:', siteConfig.homeUrl);
  console.log('====================================\n');

  // Parsers según la web (eurogrow → genéricos, growmania → específicos, etc.)
  const parseMenuCategories = getMenuParser(siteId);
  const parseCategory = getCategoryParser(siteId);

  const homeHtml = await fetchHtml(siteConfig.homeUrl);
  const categorias = parseMenuCategories(homeHtml);

  console.log(`Categorías encontradas en el menú: ${categorias.length}`);
  console.dir(categorias.slice(0, 20), { depth: null });

  const allProducts = [];

  for (const categoria of categorias) {
    console.log(`\n=== [${siteId}] Categoría: ${categoria.nombre} ===`);
    console.log(`URL: ${categoria.url}`);

    try {
      const html = await fetchHtml(categoria.url);
      const products = parseCategory(html);

      console.log(`Productos encontrados: ${products.length}`);

      for (const p of products) {
        allProducts.push({
          sitio: siteConfig.name,
          sitio_id: siteId,
          categoria: categoria.nombre,
          categoria_url: categoria.url,
          ...p,
        });
      }
    } catch (err) {
      console.error(
        `Error al procesar la categoría ${categoria.nombre} (${siteId}):`,
        err.message,
      );
    }

    await sleep(1000);
  }

  console.log(`\nTOTAL productos recogidos para ${siteConfig.name}: ${allProducts.length}`);

  if (allProducts.length > 0) {
    exportToExcel(allProducts, siteConfig.excelName);
  } else {
    console.log('No hay productos que exportar para este sitio.');
  }
}

async function main() {
  const target = process.argv[2] || 'eurogrow';
  console.log('Target recibido:', target);

  if (target === 'all') {
    // Ejecutar para todos los sitios definidos en SITES
    for (const [siteId, siteConfig] of Object.entries(SITES)) {
      await runForSite(siteId, siteConfig);
    }
  } else if (SITES[target]) {
    // Ejecutar solo para un sitio concreto
    await runForSite(target, SITES[target]);
  } else {
    console.log('Sitio no reconocido. Usa uno de:');
    console.log(Object.keys(SITES).join(', ') + ', all');
  }
}

main().catch((e) => {
  console.error('Fallo en el crawler:', e.message);
});
