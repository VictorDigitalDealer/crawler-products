import { compareProductsByIds } from "../../infrastructure/fuzzyMatchers/compareProductsByIds.js";

async function testComparison() {
  try {
    const result = await compareProductsByIds(1, 2); // Usar IDs de productos que tengas en la base de datos
    console.log("Resultado de la comparación (IGUALES):", result);
    const result2 = await compareProductsByIds(1, 3); // Usar IDs de productos que tengas en la base de datos
    console.log("Resultado de la comparación (DIFERENTES):", result2);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testComparison();
