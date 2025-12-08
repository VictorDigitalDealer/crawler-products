// infrastructure/usecases/saveProductsToDb.ts (o donde estés)

import { ProductMapper } from "../../mappers/ProductMapper.js";
import { ProductType, ShopType } from "../../types.js";
import { PrismaProductRepository } from "../PrismaProductRepository.js";

type SaveProductsToDbArgs = {
  allProducts: ProductType[];
  shop: ShopType;
};

const productRepository = new PrismaProductRepository();

export async function saveProductsToDb({
  allProducts,
  shop,
}: SaveProductsToDbArgs) {
  const productsForDb: ProductType[] = allProducts.map((p) =>
    ProductMapper.toDb({ ...p, shop: shop.nameId }),
  );

  console.log(
    `Guardando ${productsForDb.length} productos en la base de datos...`,
  );

  const result = await productRepository.saveMany(productsForDb);

  console.log(
    `Productos guardados/actualizados en BD para ${shop.name}: ${result.count}`,
  );

  return result;
}
