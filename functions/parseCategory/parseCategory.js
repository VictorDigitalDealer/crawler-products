import * as cheerio from 'cheerio';

export function parseCategory(html) {
  const $ = cheerio.load(html);
  const products = [];

  $("li.ajax_block_product").each((_, el) => {
    const name =
      $(el).find(".product-name").first().text().trim() ||
      $(el).find(".product-name.visible-xs.eurogrowdata").text().trim();

    const url = $(el).find("a.product_img_link").attr("href");
    const priceText = $(el).find(".price.product-price").first().text().trim();

    if (!name || !url) return;

    products.push({
      nombre: name,
      precio: priceText,
      url,
    });
  });

  return products;
}
