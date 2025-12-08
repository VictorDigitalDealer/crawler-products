// domain/repositories/ProductRepository.ts
import { ProductType } from "../../infrastructure/types";

export type SaveManyResult = {
  count: number;
};

export abstract class ProductRepository {
  abstract saveMany(products: ProductType[]): Promise<SaveManyResult>;

  abstract findAll(): Promise<ProductType[]>;
}
