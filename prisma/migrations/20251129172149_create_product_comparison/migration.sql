-- CreateTable
CREATE TABLE "ProductComparison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productGrowCortesId" INTEGER NOT NULL,
    "productExternalId" INTEGER NOT NULL,
    "nameMatchPercentage" REAL NOT NULL,
    "categoryMatchPercentage" REAL NOT NULL,
    "priceMatchPercentage" REAL NOT NULL,
    "totalMatchPercentage" REAL NOT NULL,
    "comparisonDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductComparison_productGrowCortesId_fkey" FOREIGN KEY ("productGrowCortesId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductComparison_productExternalId_fkey" FOREIGN KEY ("productExternalId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categoryUrl" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "externalUrl" TEXT,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Product" ("category", "categoryUrl", "id", "name", "price", "scrapedAt", "shop", "url") SELECT "category", "categoryUrl", "id", "name", "price", "scrapedAt", "shop", "url" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_url_key" ON "Product"("url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
