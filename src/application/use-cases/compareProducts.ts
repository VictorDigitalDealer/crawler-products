import { PrismaClient } from "@prisma/client";
import {
  compareNames,
  compareCategories,
  comparePrices,
} from "../../utils/fuzzyMatching.js";
import { ProductType } from "../../infrastructure/types.js";

const prisma = new PrismaClient();

export async function compareProducts(
  product1: ProductType,
  product2: ProductType,
) {
  const nameMatch = compareNames(product1, product2);
  const categoryMatch = compareCategories(product1, product2);
  const priceMatch = comparePrices(product1.price, product2.price);

  const totalMatch = nameMatch * 0.4 + categoryMatch * 0.3 + priceMatch * 0.3;

  await prisma.productComparison.create({
    data: {
      productGrowCortesId: product1.id,
      productExternalId: product2.id,
      nameMatchPercentage: nameMatch * 100,
      categoryMatchPercentage: categoryMatch * 100,
      priceMatchPercentage: priceMatch * 100,
      totalMatchPercentage: totalMatch * 100,
    },
  });

  return {
    productGrowCortesId: product1.id,
    productExternalId: product2.id,
    nameMatchPercentage: nameMatch * 100,
    categoryMatchPercentage: categoryMatch * 100,
    priceMatchPercentage: priceMatch * 100,
    totalMatchPercentage: totalMatch * 100,
  };
}
