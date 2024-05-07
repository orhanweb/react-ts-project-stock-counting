// src/utils/excelUtils.ts
import * as XLSX from "xlsx";

interface ColumnHeader<T> {
  header: string;
  key: keyof T;
  formatter?: (value: any) => string; // This function will be used to format the column value
}

interface ExportToExcelParams<T> {
  data: T[];
  fileName: string;
  headers?: ColumnHeader<T>[];
}

export function exportToExcel<T>(params: ExportToExcelParams<T>): void {
  const { data, fileName, headers } = params;
  let worksheet: XLSX.WorkSheet;

  if (headers) {
    const formattedData = data.map((item) =>
      headers.reduce((obj, header) => {
        const rawValue = item[header.key];
        const formattedValue = header.formatter
          ? header.formatter(rawValue)
          : rawValue;
        return {
          ...obj,
          [header.header]: formattedValue,
        };
      }, {})
    );
    worksheet = XLSX.utils.json_to_sheet(formattedData);
  } else {
    worksheet = XLSX.utils.json_to_sheet(data);
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
