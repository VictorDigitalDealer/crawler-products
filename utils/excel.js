import * as XLSX from "xlsx";

export function exportToExcel(products, filename) {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
  
    XLSX.writeFile(workbook, filename);
    console.log(`Excel generado: ${filename}`);
  }
