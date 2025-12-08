import { getErrorMessage } from "../../../utils/error.js";
import { fetchHtml } from "../../http/AxiosHttpClient.js";
import { CategoryType, ShopId } from "../../types.js";
import { getCategoryParser } from "../menuParsers.js";

type FetchCategoryEurogrowWithPaginationType = {
  siteId: ShopId;
  category: CategoryType;
};

export async function fetchCategoryEurogrowWithPagination({
  siteId,
  category,
}: FetchCategoryEurogrowWithPaginationType) {
  console.log("\n🔍 [EUROGROW] Iniciando paginación especial…");
  console.log("➡️ Categoría:", category.name);
  console.log("➡️ URL base:", category.url);

  const parseCategory = getCategoryParser(siteId);
  const allProducts = [];

  // ======== Página 1 ========
  console.log("\n📄 [EUROGROW] Página 1 (HTML normal)...");
  const firstHtml = await fetchHtml(category.url);

  console.log("📏 Tamaño HTML 1:", firstHtml.length);

  const firstResult = parseCategory({ html: firstHtml, category });
  const firstPageProducts = Array.isArray(firstResult)
    ? firstResult
    : firstResult.products || [];

  console.log("🟢 Productos página 1:", firstPageProducts.length);
  allProducts.push(...firstPageProducts);

  // ======== Paginación Ajax ========

  let page = 2;
  const hasMore = true;

  console.log("\n🔧 current_id de la categoría:", category.id);
  if (!category.id) {
    console.warn("⚠️ NO hay current_id — no puedo paginar Eurogrow");
    return allProducts;
  }

  while (hasMore) {
    const ajaxUrl = `https://eurogrow.es/module/infinitescroll/ajax?p=${page}&current_id=${category.id}&scroll_type=category&orderby=position&orderway=asc`;

    console.log(`\n📡 [EUROGROW] Pidiendo AJAX página ${page}`);
    console.log("➡️ URL:", ajaxUrl);

    let ajaxHtml = "";
    try {
      ajaxHtml = await fetchHtml(ajaxUrl);
    } catch (err) {
      console.error("❌ Error descargando AJAX:", getErrorMessage(err));
      break;
    }

    console.log("📏 Tamaño HTML AJAX:", ajaxHtml.length);

    if (!ajaxHtml.trim()) {
      console.log("⛔ Respuesta vacía → fin de paginación");
      break;
    }

    const ajaxCategory = { ...category, url: ajaxUrl };

    const ajaxResult = parseCategory({
      html: ajaxHtml,
      category: ajaxCategory,
    });
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
