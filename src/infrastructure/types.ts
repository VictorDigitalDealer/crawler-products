export type ProductType = {
  id: number;
  name: string;
  category: string;
  shop: string;
  price: number;
  externalUrl?: string;
  categoryUrl: string;
  scrapedAt: Date;
  updatedAt: Date;
};

export type siteConfigType = {
  id: number;
  name: string;
  homeUrl: string;
  excelName: string;
};

export type CategoryType = {
  name: string;
  url: string;
};
