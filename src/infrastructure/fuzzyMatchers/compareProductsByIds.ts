import { PrismaClient } from "@prisma/client";
import { compareProducts } from "../../application/use-cases/compareProducts";

const prisma = new PrismaClient();

export async function compareProductsByIds(
  productId1: number,
  productId2: number,
) {
  const product1 = await prisma.product.findUnique({
    where: { id: productId1 },
  });

  const product2 = await prisma.product.findUnique({
    where: { id: productId2 },
  });

  console.log(product1.name);
  console.log(product2.name);
  console.log(product1.category);
  console.log(product2.category);

  if (!product1 || !product2) {
    throw new Error("Uno o ambos productos no fueron encontrados.");
  }

  return compareProducts(product1, product2);
}
