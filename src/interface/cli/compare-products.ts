// src/interface/cli/compare-products.ts

import { getProductById } from "../../infrastructure/db/get/getProductById.js";
import { getProductsByShop } from "../../infrastructure/db/get/getProductsByShop.js";
import { compareProducts } from "../../application/use-cases/compareProducts.js";
import {
  ProductComparisonToSave,
  ProductType,
  ShopId,
} from "../../infrastructure/types.js";
import { getErrorMessage } from "../../utils/error.js";
import { saveProductComparisonsToDb } from "../../infrastructure/db/post/saveProductComparisonsToDb.js";

async function runComparison(productId: number, shopName: ShopId) {
  try {
    const referenceProduct: ProductType | null =
      await getProductById(productId);

    if (!referenceProduct) {
      console.log(`No se encontró ningún producto con id ${productId}.`);
      return;
    }

    console.log(
      `Producto de referencia (id=${referenceProduct.id}): ${referenceProduct.name} [${referenceProduct.shop}]`,
    );

    const productsFromShop: ProductType[] = await getProductsByShop(shopName);

    if (productsFromShop.length === 0) {
      console.log(`No se encontraron productos para la tienda ${shopName}.`);
      return;
    }

    console.log(
      `Productos encontrados en la tienda ${shopName}: ${productsFromShop.length}`,
    );

    const candidates = productsFromShop.filter(
      (p) => p.id !== referenceProduct.id,
    );

    if (candidates.length === 0) {
      console.log(
        "No hay candidatos para comparar (solo está el producto de referencia).",
      );
      return;
    }

    const comparisonResults = await Promise.all(
      candidates.map((candidate) =>
        compareProducts(referenceProduct, candidate),
      ),
    );

    const comparisons: ProductComparisonToSave[] = comparisonResults.filter(
      (c): c is ProductComparisonToSave => c !== null,
    );

    if (!comparisons.length) {
      console.log("No se encontraron coincidencias relevantes.");
      return;
    }

    console.log(
      `Comparaciones generadas: ${comparisons.length}. Guardando en la base de datos...`,
    );

    const result = await saveProductComparisonsToDb({
      comparisons,
    });

    console.log(`Comparaciones guardadas: ${result.count}`);

    comparisons.forEach((c) => {
      console.log(
        `GrowCortesId=${c.productGrowCortesId} vs ExternalId=${c.productExternalId} -> totalMatch=${c.totalMatchPercentage.toFixed(2)}%`,
      );
    });
  } catch (error: unknown) {
    console.error("Error al ejecutar la comparación:", getErrorMessage(error));
  }
}

const productIdArg = process.argv[2];
const shopNameArg = process.argv[3] as ShopId | undefined;

if (!productIdArg || !shopNameArg) {
  console.log("Uso: pnpm run compare-products <productId> <shopId>");
  console.log("Ejemplo: pnpm run compare-products 123 growbarato");
  process.exit(1);
}

const productId = Number(productIdArg);

if (Number.isNaN(productId)) {
  console.log("El productId debe ser un número válido.");
  process.exit(1);
}

runComparison(productId, shopNameArg);
