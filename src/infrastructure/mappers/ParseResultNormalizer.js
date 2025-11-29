// src/infrastructure/mappers/parseResultNormalizer.js

/**
 * Normaliza el resultado del parser.
 * Si es un array, lo convierte en productos y le asigna `pagination: null`.
 * Si es un objeto, extrae `products` y `pagination`, asegurando que `products` es un array.
 * Si no es ni un array ni un objeto, devuelve un array vacío y `pagination: null`.
 *
 * @param {any} parseResult - El resultado del parser de categoría.
 * @returns {object} - Objeto con `products` y `pagination`.
 */
export function normalizeParseResult(parseResult) {
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
