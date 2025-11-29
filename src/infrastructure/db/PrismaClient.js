import pkg from "@prisma/client";
const { PrismaClient } = pkg;

export const prisma = new PrismaClient();

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
