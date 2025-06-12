"use client";

import React, { useEffect, useState, useRef } from "react";

interface TextViewerClientProps {
  filePath: string;
  pageNumber: number;
}

export default function TextViewerClient({
  filePath,
  pageNumber,
}: TextViewerClientProps) {
  const [pageContent, setPageContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const textCacheRef = useRef<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTextContent = async () => {
      try {
        setLoading(true);

        if (textCacheRef.current[filePath]) {
          setPageContent(textCacheRef.current[filePath]);
        } else {
          const response = await fetch(filePath);
          if (!response.ok) {
            throw new Error(`Lỗi tải file: ${response.statusText}`);
          }
          const content = await response.text();
          textCacheRef.current[filePath] = content;
          setPageContent(content);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải nội dung trang.");
      } finally {
        setLoading(false);
      }
    };

    fetchTextContent();
  }, [filePath]);

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

  if (!pageContent.trim()) {
    return (
      <div className="text-center py-4 text-gray-600">
        Trang {pageNumber} không có nội dung.
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
