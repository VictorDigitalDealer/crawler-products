import { ProductRepository } from "../../domain/repositories/ProductRepository.js";
import { ProductType } from "../types.js";
import { prisma } from "./PrismaClient.js";

export class PrismaProductRepository extends ProductRepository {
  async saveMany(products: ProductType[]) {
    if (!products || products.length === 0) {
      return { count: 0 };
    }

    let count = 0;

    for (const p of products) {
      await prisma.product.upsert({
        where: { url: p.url },
        update: {
          name: p.name,
          shop: p.shop,
          price: p.price,
          category: p.category,
          scrapedAt: p.scrapedAt ?? new Date(),
          updatedAt: p.updatedAt ?? new Date(),
        },
        create: {
          name: p.name,
          shop: p.shop,
          url: p.url,
          price: p.price,
          category: p.category,
          scrapedAt: p.scrapedAt ?? new Date(),
          updatedAt: p.updatedAt ?? new Date(),
        },
      });

      count++;
    }

    return { count };
  }

  async findAll() {
    return prisma.product.findMany({
      orderBy: { id: "asc" },
    });
  }
}
