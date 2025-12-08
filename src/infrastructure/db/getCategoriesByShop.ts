import { PrismaClient } from "@prisma/client";
import { ShopId } from "../types";

const prisma = new PrismaClient();

export async function getCategoriesByShop(shopName: ShopId) {
  try {
    const categories = await prisma.product.findMany({
      where: { shop: shopName },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    return categories.map((product) => product.category);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : JSON.stringify(error);
    console.error("Error al obtener las categorías:", message);
    throw new Error("Error al obtener las categorías.");
  }
}
