"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface ExcelViewerClientProps {
  fileUrl: string;
}

const ExcelViewerClient: React.FC<ExcelViewerClientProps> = ({ fileUrl }) => {
  const [data, setData] = useState<any[][]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndParseExcel = async () => {
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as any[][];
        setData(jsonData);
      } catch (err) {
        setError("Không thể đọc file Excel.");
      }
    };

    fetchAndParseExcel();
  }, [fileUrl]);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (data.length === 0) {
    return <p>Đang tải dữ liệu Excel...</p>;
  }

  return (
    <div className="overflow-auto max-h-[600px] border mt-6">
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
  );
};

export default ExcelViewerClient;
