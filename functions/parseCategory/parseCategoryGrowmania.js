// functions/parseCategory/parseCategoryGrowmania.js
import * as cheerio from 'cheerio';

export function parseCategoryGrowmania(html) {
  if (!html || typeof html !== 'string') return [];

  const $ = cheerio.load(html);
  const products = [];

  $('article.product-miniature').each((_, el) => {
    const $article = $(el);

    const name = $article.find('.product-title a').text().trim();
    const url = $article.find('.product-title a').attr('href');

    const priceText = $article
      .find('.product-price-and-shipping .product-price')
      .first()
      .text()
      .trim();

    const regularPriceText = $article
      .find('.product-price-and-shipping .regular-price')
      .first()
      .text()
      .trim();

    const categoryName = $article.find('.product-category-name').text().trim();
    const brand = $article.find('.product-brand a').text().trim();
    const reference = $article.find('.product-reference a').text().trim();

    if (!name || !url) return;

    products.push({
      nombre: name,
      url,
      precio: priceText,          // ej. "Desde 81,60 €"
      precio_original: regularPriceText || null,
      categoria_producto: categoryName || null,
      marca: brand || null,
      referencia: reference || null,
    });
  });

  return products;
}
