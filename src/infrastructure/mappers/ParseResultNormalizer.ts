import { PaginationType, ProductType } from "../types";

export function normalizeParseResult(parseResult: ProductType[]): {
  products: ProductType[];
  pagination: PaginationType | null;
} {
  if (Array.isArray(parseResult)) {
    return {
      products: parseResult,
      pagination: null,
    };
  }

  if (parseResult && typeof parseResult === "object") {
    const { products = [], pagination = null } = parseResult;
    return {
      products: Array.isArray(products) ? products : [],
      pagination,
    };
  }

  return {
    products: [],
    pagination: null,
  };
}
