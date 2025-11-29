import { ProductMapper } from "../mappers/ProductMapper.js";

/**
 * Mapea los productos scrapeados y los guarda en la base de datos.
 *
 * @param {Array} allProducts - Array de productos scrapeados
 * @param {Object} siteConfig - Configuración del sitio (contiene el nombre y otras propiedades)
 * @param {Object} productRepository - Repositorio que se encargará de guardar los productos
 * @returns {Promise<Object>} El resultado del guardado en la base de datos
 */
export async function saveProductsToDb(
  allProducts,
  siteConfig,
  productRepository,
) {
  const productsForDb = allProducts.map((p) =>
    ProductMapper.toDb(p, {
      siteName: siteConfig.name,
      categoryName: p.categoria,
      categoryUrl: p.categoria_url,
    }),
  );

  console.log(
    `Guardando ${productsForDb.length} productos en la base de datos...`,
  );

  const result = await productRepository.saveMany(productsForDb);

  console.log(
    `Productos guardados/actualizados en BD para ${siteConfig.name}: ${result.count}`,
  );

  return result;
}
