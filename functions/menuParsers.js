import { parseMenuCategoriesGeneric } from './parseMenuCategories/parseMenuCategories.js';
import { parseMenuCategoriesGrowmania } from './parseMenuCategories/parseMenuCategoriesGrowmania.js';

import { parseCategory } from './parseCategory/parseCategory.js';
import { parseCategoryGrowmania } from './parseCategory/parseCategoryGrowmania.js';

const MENU_PARSERS = {
  default: parseMenuCategoriesGeneric,
  eurogrow: parseMenuCategoriesGeneric,
  growmania: parseMenuCategoriesGrowmania,
};

const CATEGORY_PARSERS = {
  default: parseCategory,
  eurogrow: parseCategory,
  growmania: parseCategoryGrowmania,
};

export function getMenuParser(siteId) {
  return MENU_PARSERS[siteId] || MENU_PARSERS.default;
}

export function getCategoryParser(siteId) {
  return CATEGORY_PARSERS[siteId] || CATEGORY_PARSERS.default;
}
