import { ShopId, ShopType } from "../infrastructure/types.js";

export const SITES: Record<ShopId, ShopType> = {
  default: {
    nameId: "eurogrow",
    name: "Eurogrow",
    homeUrl: "https://eurogrow.es",
    excelName: "eurogrow-todas-las-categorias-menu.xlsx",
  },
  eurogrow: {
    nameId: "eurogrow",
    name: "Eurogrow",
    homeUrl: "https://eurogrow.es",
    excelName: "eurogrow-todas-las-categorias-menu.xlsx",
  },
  growmania: {
    nameId: "growmania",
    name: "Growmania",
    homeUrl: "https://www.growmania.es",
    excelName: "growmania-todas-las-categorias-menu.xlsx",
  },
  growbarato: {
    nameId: "growbarato",
    name: "Growbarato",
    homeUrl: "https://www.growbarato.net",
    excelName: "growbarato-todas-las-categorias-menu.xlsx",
  },
  backgarden: {
    nameId: "backgarden",
    name: "Back Garden",
    homeUrl: "https://backgarden.es",
    excelName: "backgarden-todas-las-categorias-menu.xlsx",
  },
  growcortesdelsur: {
    nameId: "growcortesdelsur",
    name: "Grow Cortes del Sur",
    homeUrl: "https://growcortesdelsur.com/tienda/",
    excelName: "growcortesdelsur-todas-las-categorias-menu.xlsx",
  },
};
