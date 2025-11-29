// functions/menuParsers.js

// ==== MENU PARSERS ====
import { parseMenuCategoriesGeneric } from "./parseMenuCategories/parseMenuCategories.js";
import { parseMenuCategoriesGrowmania } from "./parseMenuCategories/parseMenuCategoriesGrowmania.js";
import { parseMenuCategoriesGrowbarato } from "./parseMenuCategories/parseMenuCategoriesGrowbarato.js";
import { parseMenuCategoriesBackgarden } from "./parseMenuCategories/parseMenuCategoriesBackgarden.js";
import { parseMenuCategoriesGrowcortesdelsur } from "./parseMenuCategories/parseMenuCategoriesGrowcortesdelsur.js";

// ==== CATEGORY PARSERS ====
import { parseCategory } from "./parseCategory/parseCategory.js";
import { parseCategoryGrowmania } from "./parseCategory/parseCategoryGrowmania.js";
import { parseCategoryGrowbarato } from "./parseCategory/parseCategoryGrowbarato.js";
import { parseCategoryBackgarden } from "./parseCategory/parseCategoryBackgarden.js";
import { parseCategoryGrowcortesdelsur } from "./parseCategory/parseCategoryGrowcortesdelsur.js";

const MENU_PARSERS = {
  default: parseMenuCategoriesGeneric,
  eurogrow: parseMenuCategoriesGeneric,
  growmania: parseMenuCategoriesGrowmania,
  growbarato: parseMenuCategoriesGrowbarato,
  backgarden: parseMenuCategoriesBackgarden,
  growcortesdelsur: parseMenuCategoriesGrowcortesdelsur,
};

const CATEGORY_PARSERS = {
  default: parseCategory,
  eurogrow: parseCategory,
  growmania: parseCategoryGrowmania,
  growbarato: parseCategoryGrowbarato,
  backgarden: parseCategoryBackgarden,
  growcortesdelsur: parseCategoryGrowcortesdelsur,
};

export function getMenuParser(siteId) {
  return MENU_PARSERS[siteId] || MENU_PARSERS.default;
}

export function getCategoryParser(siteId) {
  return CATEGORY_PARSERS[siteId] || CATEGORY_PARSERS.default;
}
