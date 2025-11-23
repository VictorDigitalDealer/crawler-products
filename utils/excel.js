// utils/excel.js
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("excels");
// Puedes cambiarlo a "outputs/excels" o lo que prefieras

export function exportToExcel(products, filename) {
  // 1. Asegurar que la carpeta existe
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 2. Ruta final del archivo
  const filePath = path.join(OUTPUT_DIR, filename);

  // 3. Crear Excel
  const worksheet = XLSX.utils.json_to_sheet(products);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

  // 4. Guardar
  XLSX.writeFile(workbook, filePath);

  console.log(`Excel generado: ${filePath}`);
}
