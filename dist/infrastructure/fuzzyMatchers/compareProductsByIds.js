import { PrismaClient } from "@prisma/client";
import { compareProducts } from "../../application/use-cases/compareProducts.js";
const prisma = new PrismaClient();
export async function compareProductsByIds(productId1, productId2) {
    const product1 = await prisma.product.findUnique({
        where: { id: productId1 },
    });
    const product2 = await prisma.product.findUnique({
        where: { id: productId2 },
    });
    if (!product1 || !product2) {
        throw new Error("Uno o ambos productos no fueron encontrados.");
    }
    return compareProducts(product1, product2);
}
