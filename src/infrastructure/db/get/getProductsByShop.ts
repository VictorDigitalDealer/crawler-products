import { PrismaClient } from "@prisma/client";
import { ProductType, ShopId } from "../../types.js";
import { SITES } from "../../../config/sites.js";

const prisma = new PrismaClient();

export async function getProductsByShop(
  shopId: ShopId,
): Promise<ProductType[]> {
  const siteConfig = SITES[shopId];

  if (!siteConfig) {
    throw new Error(`No existe configuración para la tienda '${shopId}'.`);
  }

  const shopName = siteConfig.name;

  try {
    const rows = await prisma.product.findMany({
      where: { shop: shopName },
      orderBy: { id: "asc" },
    });

    return rows.map(
      (product): ProductType => ({
        id: product.id,
        shop: product.shop as ShopId,
        name: product.name,
        url: product.url,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        scrapedAt: product.scrapedAt,
        updatedAt: product.updatedAt,
      }),
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : JSON.stringify(error);
    console.error("Error al obtener los productos:", message);
    throw new Error("Error al obtener los productos.");
  }
}
