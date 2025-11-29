import {
  compareStrings,
  compareCategories,
  comparePrices,
} from "../../utils/fuzzyMatching.js";

export function compareProducts(product1, product2) {
  // const nameMatch = compareNames(product1, product2);
  const nameMatch = compareStrings(product1.name, product2.name);

  const categoryMatch = compareCategories(product1, product2);
  const priceMatch = comparePrices(product1.price, product2.price);

  const totalMatch = nameMatch * 0.4 + categoryMatch * 0.3 + priceMatch * 0.3;

  return {
    productGrowCortesId: product1.id,
    productExternalId: product2.id,
    nameMatchPercentage: nameMatch * 100,
    categoryMatchPercentage: categoryMatch * 100,
    priceMatchPercentage: priceMatch * 100,
    totalMatchPercentage: totalMatch * 100,
  };
}
