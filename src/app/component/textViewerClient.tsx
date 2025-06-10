"use client";

import React, { useEffect, useState } from "react";

interface TextViewerClientProps {
  filePath: string;
  pageNumber: number;
  charsPerPage?: number;
}

export default function TextViewerClient({
  filePath,
  pageNumber,
  charsPerPage = 2000,
}: TextViewerClientProps) {
  const [pageContent, setPageContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullText, setFullText] = useState<string | null>(null);
  const textCache: { [key: string]: string } = {};

  useEffect(() => {
    const fetchAndPaginateText = async () => {
      try {
        setLoading(true);
        let currentFullText: string;
        if (textCache[filePath]) {
          currentFullText = textCache[filePath];
        } else {
          const response = await fetch(filePath);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch text file: ${response.statusText}`
            );
          }
          currentFullText = await response.text();
          textCache[filePath] = currentFullText;
        }

        setFullText(currentFullText);
        const startIndex = (pageNumber - 1) * charsPerPage;
        const endIndex = startIndex + charsPerPage;
        const contentForThisPage = currentFullText.substring(
          startIndex,
          endIndex
        );
        setPageContent(contentForThisPage);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải nội dung file TXT.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndPaginateText();
  }, [filePath, pageNumber, charsPerPage]);

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Đang tải trang {pageNumber}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Lỗi trang {pageNumber}: {error}
      </div>
    );
  }

  if (!pageContent) {
    return (
      <div className="text-center py-4 text-gray-600">
        Không có nội dung để hiển thị cho trang {pageNumber}.
      </div>
    );
  }

  return (
    <div className="border p-6 rounded-lg bg-gray-50 shadow-sm">
      <h4 className="text-md font-semibold mb-3 text-gray-700">
        Trang {pageNumber}
      </h4>
      <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
        {pageContent}
      </pre>
    </div>
  );
}
