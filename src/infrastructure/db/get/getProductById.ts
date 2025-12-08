import { PrismaClient } from "@prisma/client";
import { ProductType, ShopId } from "../../types.js";

const prisma = new PrismaClient();

export async function getProductById(id: number): Promise<ProductType | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { id },
    });

    if (!p) {
      return null;
    }

    const product: ProductType = {
      id: p.id,
      shop: p.shop as ShopId,
      name: p.name,
      url: p.url,
      price: p.price,
      category: p.category,
      imageUrl: p.imageUrl,
      scrapedAt: p.scrapedAt,
      updatedAt: p.updatedAt,
    };

    return product;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : JSON.stringify(error);
    console.error("Error al obtener el producto:", message);
    throw new Error("Error al obtener el producto.");
  }
}
