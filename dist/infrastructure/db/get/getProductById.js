import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function getProductById(id) {
    try {
        const p = await prisma.product.findUnique({
            where: { id },
        });
        if (!p) {
            return null;
        }
        const product = {
            id: p.id,
            shop: p.shop,
            name: p.name,
            url: p.url,
            price: p.price,
            category: p.category,
            imageUrl: p.imageUrl,
            scrapedAt: p.scrapedAt,
            updatedAt: p.updatedAt,
        };
        return product;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.error("Error al obtener el producto:", message);
        throw new Error("Error al obtener el producto.");
    }
}
