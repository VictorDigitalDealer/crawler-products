import { prisma } from "../PrismaClient.js";
export async function saveProductComparisonsToDb({ comparisons, }) {
    if (!comparisons || comparisons.length === 0) {
        console.log("No hay comparaciones para guardar.");
        return { count: 0 };
    }
    // 1️⃣ Normalizamos y filtramos NaN
    const cleaned = comparisons
        .map((c) => ({
        ...c,
        priceMatchPercentage: Number.isFinite(c.priceMatchPercentage)
            ? c.priceMatchPercentage
            : 0,
        totalMatchPercentage: Number.isFinite(c.totalMatchPercentage)
            ? c.totalMatchPercentage
            : 0,
    }))
        .filter((c) => Number.isFinite(c.totalMatchPercentage));
    if (cleaned.length === 0) {
        console.log("No hay comparaciones válidas (todas eran NaN).");
        return { count: 0 };
    }
    const data = cleaned.map((c) => ({
        productGrowCortesId: c.productGrowCortesId,
        productExternalId: c.productExternalId,
        nameMatchPercentage: c.nameMatchPercentage,
        categoryMatchPercentage: c.categoryMatchPercentage,
        priceMatchPercentage: c.priceMatchPercentage,
        totalMatchPercentage: c.totalMatchPercentage,
        comparisonDate: c.comparisonDate ?? new Date(),
    }));
    try {
        console.log(`Guardando ${data.length} comparaciones en la base de datos...`);
        const result = await prisma.productComparison.createMany({
            data,
        });
        console.log(`Comparaciones guardadas en BD: ${result.count}`);
        return result; // { count: number }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.error("Error al guardar las comparaciones:", message);
        throw new Error("Error al guardar las comparaciones.");
    }
}
