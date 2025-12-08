import { prisma } from "../../infrastructure/db/PrismaClient.js";
import { getErrorMessage } from "../../utils/error.js";

async function listTopComparisons(limit = 20) {
  try {
    const comparisons = await prisma.productComparison.findMany({
      orderBy: { totalMatchPercentage: "desc" },
      take: limit,
      include: {
        productGrowCortes: true,
        productExternal: true,
      },
    });

    if (comparisons.length === 0) {
      console.log("No se encontraron comparaciones en la base de datos.");
      return;
    }

    console.log(`Top ${comparisons.length} mejores comparaciones:\n`);

    comparisons.forEach((comp, index) => {
      const gc = comp.productGrowCortes;
      const ext = comp.productExternal;

      console.log(
        `${index + 1}) ${comp.totalMatchPercentage.toFixed(2)}%  ` +
          `(nombre: ${comp.nameMatchPercentage.toFixed(
            2,
          )}%, categoría: ${comp.categoryMatchPercentage.toFixed(
            2,
          )}%, precio: ${comp.priceMatchPercentage.toFixed(2)}%)`,
      );

      console.log(
        `   GCDS [id=${gc.id}, shop=${gc.shop}]  ` +
          `${gc.name}  |  ${gc.price.toFixed(2)}€`,
      );
      console.log(`   URL GCDS: ${gc.url}`);

      console.log(
        `   EXT  [id=${ext.id}, shop=${ext.shop}]  ` +
          `${ext.name}  |  ${ext.price.toFixed(2)}€`,
      );
      console.log(`   URL EXT : ${ext.url}`);

      console.log("--------------------------------------------------");
    });
  } catch (error: unknown) {
    console.error(
      "Error al listar las mejores comparaciones:",
      getErrorMessage(error),
    );
  } finally {
    await prisma.$disconnect();
  }
}

const limitArg = process.argv[2];
const limit = limitArg ? Number(limitArg) : 20;

if (Number.isNaN(limit) || limit <= 0) {
  console.log(
    "Uso: pnpm run list:top-comparisons [limit]\n" +
      "Ejemplo: pnpm run list:top-comparisons 20",
  );
  process.exit(1);
}

listTopComparisons(limit);
