import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCategoriesByShop(shopName) {
  try {
    const categories = await prisma.product.findMany({
      where: { shop: shopName },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    return categories.map((product) => product.category);
  } catch (error) {
    console.error("Error al obtener las categorías:", error.message);
    throw new Error("Error al obtener las categorías.");
  }
}
