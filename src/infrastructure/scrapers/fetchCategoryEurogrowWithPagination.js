// functions/fetchCategoryEurogrowWithPagination.js
import { fetchHtml } from "../services/services.js";
import { getCategoryParser } from "./menuParsers.js";

export async function fetchCategoryEurogrowWithPagination({
  siteId,
  siteConfig,
  categoria,
}) {
  console.log("\n🔍 [EUROGROW] Iniciando paginación especial…");
  console.log("➡️ Categoría:", categoria.nombre);
  console.log("➡️ URL base:", categoria.url);

  const parseCategory = getCategoryParser(siteId);
  const allProducts = [];

  // ======== Página 1 ========
  console.log("\n📄 [EUROGROW] Página 1 (HTML normal)...");
  const firstHtml = await fetchHtml(categoria.url);

  console.log("📏 Tamaño HTML 1:", firstHtml.length);

  const firstResult = parseCategory(firstHtml, categoria.url);
  const firstPageProducts = Array.isArray(firstResult)
    ? firstResult
    : firstResult.products || [];

  console.log("🟢 Productos página 1:", firstPageProducts.length);
  allProducts.push(...firstPageProducts);

  // ======== Paginación Ajax ========

  let page = 2;
  let hasMore = true;

  // Debemos tener categoria.currentId
  console.log("\n🔧 current_id de la categoría:", categoria.currentId);
  if (!categoria.currentId) {
    console.warn("⚠️ NO hay current_id — no puedo paginar Eurogrow");
    return allProducts;
  }

  while (hasMore) {
    const ajaxUrl = `https://eurogrow.es/module/infinitescroll/ajax?p=${page}&current_id=${categoria.currentId}&scroll_type=category&orderby=position&orderway=asc`;

    console.log(`\n📡 [EUROGROW] Pidiendo AJAX página ${page}`);
    console.log("➡️ URL:", ajaxUrl);

    let ajaxHtml = "";
    try {
      ajaxHtml = await fetchHtml(ajaxUrl);
    } catch (err) {
      console.error("❌ Error descargando AJAX:", err.message);
      break;
    }

    console.log("📏 Tamaño HTML AJAX:", ajaxHtml.length);

    // Si la respuesta está vacía → final
    if (!ajaxHtml.trim()) {
      console.log("⛔ Respuesta vacía → fin de paginación");
      break;
    }

    const ajaxResult = parseCategory(ajaxHtml, ajaxUrl);
    const pageProducts = Array.isArray(ajaxResult)
      ? ajaxResult
      : ajaxResult.products || [];

    console.log(`🟢 Productos en página ${page}:`, pageProducts.length);

    if (!pageProducts.length) {
      console.log("⛔ No hay productos → fin de paginación");
      break;
    }

    allProducts.push(...pageProducts);

    page++;
    if (page > 20) {
      console.log("⚠️ Seguridad: se han alcanzado 20 páginas, cortamos");
      break;
    }
  }

  console.log(
    "\n✅ Paginación finalizada. Total productos Eurogrow:",
    allProducts.length,
  );
  return allProducts;
}
