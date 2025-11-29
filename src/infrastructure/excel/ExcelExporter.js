import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("excels");

export class ExportToExcel {
  export(products, filename) {
    // nos aseguramos de que la carpeta existe
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const filePath = path.join(OUTPUT_DIR, filename);

    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    XLSX.writeFile(workbook, filePath);

    console.log(`Excel generado: ${filePath}`);
  }
}
