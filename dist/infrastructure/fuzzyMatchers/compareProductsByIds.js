"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareProductsByIds = compareProductsByIds;
const client_1 = require("@prisma/client");
const compareProducts_1 = require("../../application/use-cases/compareProducts");
const prisma = new client_1.PrismaClient();
function compareProductsByIds(productId1, productId2) {
    return __awaiter(this, void 0, void 0, function* () {
        const product1 = yield prisma.product.findUnique({
            where: { id: productId1 },
        });
        const product2 = yield prisma.product.findUnique({
            where: { id: productId2 },
        });
        if (!product1 || !product2) {
            throw new Error("Uno o ambos productos no fueron encontrados.");
        }
        return (0, compareProducts_1.compareProducts)(product1, product2);
    });
}
