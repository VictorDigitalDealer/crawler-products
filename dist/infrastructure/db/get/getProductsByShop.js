import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function getProductsByShop(shopName) {
    try {
        const rows = await prisma.product.findMany({
            where: { shop: shopName },
            orderBy: { id: "asc" },
        });
        return rows.map((product) => ({
            id: product.id,
            shop: product.shop,
            name: product.name,
            url: product.url,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl,
            scrapedAt: product.scrapedAt,
            updatedAt: product.updatedAt,
        }));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.error("Error al obtener los productos:", message);
        throw new Error("Error al obtener los productos.");
    }
}
