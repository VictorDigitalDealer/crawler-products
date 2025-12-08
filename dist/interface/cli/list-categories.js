import { getCategoriesByShop } from "../../infrastructure/db/getCategoriesByShop.js";
import { getErrorMessage } from "../../utils/error.js";
async function listCategories(shopName) {
    try {
        const categories = await getCategoriesByShop(shopName);
        if (categories.length === 0) {
            console.log(`No se encontraron categorías para la tienda ${shopName}.`);
            return;
        }
        console.log(`Categorías de la tienda ${shopName}:`);
        categories.forEach((category, index) => {
            console.log(`${index + 1}. ${category}`);
        });
    }
    catch (error) {
        console.error("Error al listar las categorías:", getErrorMessage(error));
    }
}
const shopName = process.argv[2];
if (!shopName) {
    console.log("Por favor, proporciona un nombre de tienda válido.");
    process.exit(1);
}
listCategories(shopName);
