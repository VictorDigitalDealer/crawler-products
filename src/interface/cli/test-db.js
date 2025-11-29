import { PrismaProductRepository } from "../../infrastructure/db/PrismaProductRepository.js";

async function main() {
  const productRepo = new PrismaProductRepository();

  console.log("Insertando productos de prueba en la BD...\n");

  const result = await productRepo.saveMany([
    {
      name: "Producto test 1",
      shop: "TestShop",
      url: "https://example.com/product-1",
      price: 9.99,
      category: "Test Category",
      categoryUrl: "https://example.com/category-test",
    },
    {
      name: "Producto test 2",
      shop: "TestShop",
      url: "https://example.com/product-2",
      price: 19.99,
      category: "Test Category",
      categoryUrl: "https://example.com/category-test",
    },
  ]);

  console.log("Resultado de saveMany:", result);

  console.log("\nLeyendo productos desde la BD...\n");
  const products = await productRepo.findAll();

  console.log(`Total productos en BD: ${products.length}`);
  console.dir(products, { depth: null });
}

main()
  .catch((err) => {
    console.error("Error en test-db:", err);
  })
  .finally(() => {
    // Prisma se desconecta en el process.on('beforeExit') del PrismaClient
    process.exit(0);
  });
