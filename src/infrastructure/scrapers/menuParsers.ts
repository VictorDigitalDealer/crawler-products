// functions/menuParsers.js

// ==== MENU PARSERS ====
import { parseMenuCategoriesGeneric } from "./parseMenuCategories/parseMenuCategories.js";
import { parseMenuCategoriesGrowmania } from "./parseMenuCategories/parseMenuCategoriesGrowmania.js";
import { parseMenuCategoriesGrowbarato } from "./parseMenuCategories/parseMenuCategoriesGrowbarato.js";
import { parseMenuCategoriesBackgarden } from "./parseMenuCategories/parseMenuCategoriesBackgarden.js";
import { parseMenuCategoriesGrowcortesdelsur } from "./parseMenuCategories/parseMenuCategoriesGrowcortesdelsur.js";

// ==== CATEGORY PARSERS ====
import { parseCategoryEurogrow } from "./parseCategory/parseCategoryEurogrow.js";
import { parseCategoryGrowmania } from "./parseCategory/parseCategoryGrowmania.js";
import { parseCategoryGrowbarato } from "./parseCategory/parseCategoryGrowbarato.js";
import { parseCategoryBackgarden } from "./parseCategory/parseCategoryBackgarden.js";
import { parseCategoryGrowcortesdelsur } from "./parseCategory/parseCategoryGrowcortesdelsur.js";
import { CategoryParser, ShopId } from "../types.js";

const MENU_PARSERS = {
  default: parseMenuCategoriesGeneric,
  eurogrow: parseMenuCategoriesGeneric,
  growmania: parseMenuCategoriesGrowmania,
  growbarato: parseMenuCategoriesGrowbarato,
  backgarden: parseMenuCategoriesBackgarden,
  growcortesdelsur: parseMenuCategoriesGrowcortesdelsur,
};

const CATEGORY_PARSERS: Record<ShopId, CategoryParser> = {
  default: parseCategoryEurogrow,
  eurogrow: parseCategoryEurogrow,
  growmania: parseCategoryGrowmania,
  growbarato: parseCategoryGrowbarato,
  backgarden: parseCategoryBackgarden,
  growcortesdelsur: parseCategoryGrowcortesdelsur,
};

export function getMenuParser(siteId: ShopId) {
  return MENU_PARSERS[siteId] || MENU_PARSERS.default;
}

export function getCategoryParser(siteId: ShopId): CategoryParser {
  return CATEGORY_PARSERS[siteId] || CATEGORY_PARSERS.default;
}
