import Fuse from "fuse.js";

const fuseOptions = {
  includeScore: true,
  threshold: 0.6, // Hacemos la comparación más estricta
  ignoreLocation: true, // No consideramos la ubicación de la palabra en la cadena
  distance: 5, // Permite una mayor tolerancia en las diferencias
  keys: ["name", "category"],
};

export function compareNames(product1, product2) {
  const fuse = new Fuse([product1, product2], fuseOptions);
  const result = fuse.search(product1.name);
  return 1 - result[0]?.score || 0;
}

export function compareCategories(product1, product2) {
  const fuse = new Fuse([product2], fuseOptions);
  const result = fuse.search(product1.category);
  return 1 - result[0]?.score || 0;
}

const fuseOptions2 = {
  includeScore: true,
  threshold: 0.5,
};

export function compareStrings(string1, string2) {
  const fuse = new Fuse([string2], fuseOptions2);
  const result = fuse.search(string1);
  return 1 - result[0]?.score || 0;
}

export function comparePrices(price1, price2) {
  const diff = Math.abs(price1 - price2);
  const maxPrice = Math.max(price1, price2);
  return 1 - diff / maxPrice;
}
