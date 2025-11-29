import Fuse from "fuse.js";
import { ProductType } from "../infrastructure/types";

const fuseOptions = {
  includeScore: true,
  threshold: 0.6,
  ignoreLocation: true,
  distance: 5,
  keys: ["name", "category"],
};

export function compareNames(product1: ProductType, product2: ProductType) {
  const fuse = new Fuse([product2], fuseOptions);
  const result = fuse.search(product1.name);
  const score = result[0]?.score ?? 1;
  return 1 - score || 0;
}

export function compareCategories(
  product1: ProductType,
  product2: ProductType,
) {
  const fuse = new Fuse([product2], fuseOptions);
  const result = fuse.search(product1.category);
  const score = result[0]?.score ?? 1;
  return 1 - score || 0;
}

const fuseOptions2 = {
  includeScore: true,
  threshold: 0.5,
};

export function compareStrings(string1: string, string2: string) {
  const fuse = new Fuse([string2], fuseOptions2);
  const result = fuse.search(string1);
  const score = result[0]?.score ?? 1;
  return 1 - score || 0;
}

export function comparePrices(price1: number, price2: number) {
  const diff = Math.abs(price1 - price2);
  const maxPrice = Math.max(price1, price2);
  return 1 - diff / maxPrice;
}
