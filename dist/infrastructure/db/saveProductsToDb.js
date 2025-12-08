// infrastructure/usecases/saveProductsToDb.ts (o donde estés)
import { ProductMapper } from "../mappers/ProductMapper.js";
import { PrismaProductRepository } from "./PrismaProductRepository.js";
const productRepository = new PrismaProductRepository();
export async function saveProductsToDb({ allProducts, shop, }) {
    const productsForDb = allProducts.map((p) => ProductMapper.toDb({ p, shop: shop.nameId, category: p.category }));
    console.log(`Guardando ${productsForDb.length} productos en la base de datos...`);
    const result = await productRepository.saveMany(productsForDb);
    console.log(`Productos guardados/actualizados en BD para ${shop.name}: ${result.count}`);
    return result;
}
