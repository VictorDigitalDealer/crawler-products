import { getProductsByShop } from "../../infrastructure/db/get/getProductsByShop.js";
import { compareProducts } from "../../application/use-cases/compareProducts.js";
import {
  ProductComparisonToSave,
  ProductType,
  ShopId,
} from "../../infrastructure/types.js";
import { getErrorMessage } from "../../utils/error.js";
import { saveProductComparisonsToDb } from "../../infrastructure/db/post/saveProductComparisonsToDb.js";

async function runShopToShopComparison(sourceShop: ShopId, targetShop: ShopId) {
  try {
    console.log(
      `Iniciando comparación de productos entre tiendas: ${sourceShop} -> ${targetShop}`,
    );

    // 1️⃣ Traer productos de ambas tiendas
    const sourceProducts: ProductType[] = await getProductsByShop(sourceShop);
    const targetProducts: ProductType[] = await getProductsByShop(targetShop);

    if (sourceProducts.length === 0) {
      console.log(`No se encontraron productos para la tienda ${sourceShop}.`);
      return;
    }

    if (targetProducts.length === 0) {
      console.log(`No se encontraron productos para la tienda ${targetShop}.`);
      return;
    }

    console.log(
      `Productos en ${sourceShop}: ${sourceProducts.length}. Productos en ${targetShop}: ${targetProducts.length}.`,
    );

    const allComparisons: ProductComparisonToSave[] = [];

    // 2️⃣ Para cada producto de la tienda origen, lo comparamos con todos los de la tienda destino
    for (const referenceProduct of sourceProducts) {
      console.log(
        `Comparando producto referencia (id=${referenceProduct.id}) ${referenceProduct.name}`,
      );

      const comparisonResults = await Promise.all(
        targetProducts.map((candidate) =>
          compareProducts(referenceProduct, candidate),
        ),
      );

      const validComparisons: ProductComparisonToSave[] =
        comparisonResults.filter(
          (c): c is ProductComparisonToSave => c !== null,
        );

      if (validComparisons.length > 0) {
        console.log(
          `  → Coincidencias encontradas para ${referenceProduct.id}: ${validComparisons.length}`,
        );
        allComparisons.push(...validComparisons);
      } else {
        console.log(
          `  → Sin coincidencias relevantes para el producto ${referenceProduct.id}.`,
        );
      }
    }

    if (!allComparisons.length) {
      console.log(
        "No se encontraron coincidencias relevantes entre ambas tiendas.",
      );
      return;
    }

    console.log(
      `Total de comparaciones generadas entre ${sourceShop} y ${targetShop}: ${allComparisons.length}. Guardando en la base de datos...`,
    );

    const result = await saveProductComparisonsToDb({
      comparisons: allComparisons,
    });

    console.log(`Comparaciones guardadas: ${result.count}`);

    // Pequeño resumen de las primeras
    allComparisons.slice(0, 20).forEach((c) => {
      console.log(
        `GrowCortesId=${c.productGrowCortesId} vs ExternalId=${c.productExternalId} -> totalMatch=${c.totalMatchPercentage.toFixed(2)}%`,
      );
    });
  } catch (error: unknown) {
    console.error(
      "Error al ejecutar la comparación entre tiendas:",
      getErrorMessage(error),
    );
  }
}

// 🧵 Args CLI
const sourceShopArg = process.argv[2] as ShopId | undefined;
const targetShopArg = process.argv[3] as ShopId | undefined;

if (!sourceShopArg || !targetShopArg) {
  console.log("Uso: pnpm run compare:shops <sourceShopId> <targetShopId>");
  console.log("Ejemplo: pnpm run compare:shops growcortesdelsur growbarato");
  process.exit(1);
}

if (sourceShopArg === targetShopArg) {
  console.log("Las tiendas de origen y destino no pueden ser la misma.");
  process.exit(1);
}

runShopToShopComparison(sourceShopArg, targetShopArg);
