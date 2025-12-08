export type ShopId =
  | "default"
  | "eurogrow"
  | "growmania"
  | "growbarato"
  | "backgarden"
  | "growcortesdelsur";

export type ProductType = {
  id: number;
  name: string;
  category: string;
  shop: ShopId;
  price: number;
  url: string;
  imageUrl: string | null;
  scrapedAt: Date;
  updatedAt: Date;
};

export type ArgumentType = ShopId | "all";

export type ShopType = {
  nameId: ShopId;
  name: string;
  homeUrl: string;
  excelName: string;
};

export type CategoryType = {
  id: string;
  shopId: ShopId;
  name: string;
  url: string;
};

export type ParseCategoryType = {
  html: string;
  category: CategoryType;
};

export type ParseCategoryReturnType = {
  products: ProductType[];
  pagination: PaginationType;
  pageUrl: string;
};

export type CategoryParser = (
  args: ParseCategoryType,
) => ParseCategoryReturnType;

export type PaginationType = {
  currentPage: number;
  totalPages: number | null;
  nextPageUrl: string | null;
};

export type ProductComparisonToSave = {
  productGrowCortesId: number;
  productExternalId: number;
  nameMatchPercentage: number;
  categoryMatchPercentage: number;
  priceMatchPercentage: number;
  totalMatchPercentage: number;
  comparisonDate?: Date;
};
