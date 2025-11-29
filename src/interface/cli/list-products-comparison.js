import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listProductComparisons(productId) {
  try {
    const comparisons = await prisma.productComparison.findMany({
      where: {
        OR: [
          { productGrowCortesId: productId },
          { productExternalId: productId },
        ],
      },
      orderBy: {
        totalMatchPercentage: "desc", // Ordenar de mayor a menor
      },
    });

    if (comparisons.length === 0) {
      console.log("No se encontraron comparaciones para este producto.");
      return;
    }

    console.log(`Comparaciones para el producto con ID: ${productId}`);
    comparisons.forEach((comparison, index) => {
      console.log(
        `${index + 1}. Producto Grow Cortes ID: ${comparison.productGrowCortesId}, Producto Externo ID: ${comparison.productExternalId}`,
      );
      console.log(
        `  Coincidencia total: ${comparison.totalMatchPercentage.toFixed(2)}%`,
      );
      console.log(
        `  Coincidencia de nombre: ${comparison.nameMatchPercentage.toFixed(2)}%`,
      );
      console.log(
        `  Coincidencia de categoría: ${comparison.categoryMatchPercentage.toFixed(2)}%`,
      );
      console.log(
        `  Coincidencia de precio: ${comparison.priceMatchPercentage.toFixed(2)}%`,
      );
      console.log("----------------------------------");
    });
  } catch (error) {
    console.error("Error al listar las comparaciones:", error.message);
  }
}

const productId = parseInt(process.argv[2]); // El ID del producto se pasa como argumento

if (!productId) {
  console.log("Por favor, proporciona un ID de producto válido.");
  process.exit(1);
}

listProductComparisons(productId);
