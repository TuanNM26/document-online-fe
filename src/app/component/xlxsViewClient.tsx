"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface ExcelViewerClientProps {
  fileUrl: string;
}

const ExcelViewerClient: React.FC<ExcelViewerClientProps> = ({ fileUrl }) => {
  const [sheets, setSheets] = useState<string[]>([]);
  const [data, setData] = useState<any[][]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndParseExcel = async () => {
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: "array" });

        setWorkbook(wb);
        setSheets(wb.SheetNames);
        setSelectedSheet(wb.SheetNames[0]);
      } catch (err) {
        setError("Không thể đọc file Excel.");
      }
    };

    fetchAndParseExcel();
  }, [fileUrl]);

  useEffect(() => {
    if (workbook && selectedSheet) {
      const worksheet = workbook.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      }) as any[][];
      setData(jsonData);
    }
  }, [selectedSheet, workbook]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!selectedSheet || data.length === 0)
    return <p>Đang tải dữ liệu Excel...</p>;

  return (
    <div className="mt-6">
      <div className="mb-4">
        <label className="mr-2 font-medium">Chọn Sheet:</label>
        <select
          value={selectedSheet}
          onChange={(e) => setSelectedSheet(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {sheets.map((sheetName) => (
            <option key={sheetName} value={sheetName}>
              {sheetName}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-auto max-h-[600px] border">
        <table className="min-w-full table-auto border-collapse">
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="border px-4 py-2 text-sm text-gray-800"
                  >
                    {cell ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExcelViewerClient;
