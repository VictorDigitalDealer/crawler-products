import { PrismaProductRepository } from "../../infrastructure/db/PrismaProductRepository.js";

async function main() {
  const productRepo = new PrismaProductRepository();
  const shopFilter = process.argv[2]; // opcional: filtrar por tienda

  const products = await productRepo.findAll();

  const filtered = shopFilter
    ? products.filter((p) => p.shop === shopFilter)
    : products;

  console.log(
    `Total productos en BD${shopFilter ? ` para ${shopFilter}` : ""}: ${filtered.length}`,
  );
  console.dir(filtered.slice(0, 50), { depth: null });
}

main()
  .catch((err) => {
    console.error("Error en list-products:", err);
  })
  .finally(() => {
    process.exit(0);
  });
