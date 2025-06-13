"use client";

import { useCallback, useEffect, useState } from "react";
import { useDocumentSocket } from "@/hooks/useDocumentSocket";
import PDFViewerClient from "./pdfViewerClient";
import TextViewerClient from "./textViewerClient";
import ExcelViewerClient from "./xlxsViewClient";
import PageActions from "./pageAction";
import ScrollToPage from "./scrollPage";
import { Document } from "@/types/document";

interface Page {
  _id?: string;
  pageNumber: number;
  filePath: string;
  [key: string]: any;
}

interface ClientDocumentViewerProps {
  document: Document;
  pages: Page[];
}

export default function ClientDocumentViewer({
  document,
  pages: initialPages,
}: ClientDocumentViewerProps) {
  const [pages, setPages] = useState<Page[]>(initialPages);

  useEffect(() => {
    if (document.filePath) {
      console.log("FilePath changed, refetching pages");
      fetchPages();
    }
  }, [document.filePath]);
  const fetchPages = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/pages/document/${document._id}`
      );
      const data = await res.json();
      console.log("Fetched pages response:", data);

      const pages = data.pages || data.data;
      if (Array.isArray(pages)) {
        setPages(pages);
        console.log("Đã setPages");
      } else {
        console.warn("Không tìm thấy danh sách trang trong response", data);
      }
    } catch (err) {
      console.error("Lỗi khi fetch pages:", err);
    }
  };

  const handlePageChange = useCallback(() => {
    console.log("page changed");
    fetchPages();
  }, []);

  const handlePageDeleted = (deletedPageId: string) => {
    setPages((prevPages) => {
      const updatedPages = prevPages.filter((p) => p._id !== deletedPageId);
      return updatedPages;
    });
  };

  useDocumentSocket(document._id, handlePageChange);

  if (!document || !pages) return null;

  const renderContent = () => {
    return pages.map((page) => (
      <div
        key={page._id ?? `${page.pageNumber}-${page.filePath}`}
        id={`page-${page._id}`}
        className="p-4 border rounded mb-4"
      >
        {document.fileType === "pdf" && page.filePath && (
          <PDFViewerClient filePath={`${page.filePath}`} />
        )}
        {document.fileType === "txt" && (
          <TextViewerClient
            filePath={page.filePath}
            pageNumber={page.pageNumber}
          />
        )}
        {document.fileType === "xlsx" && (
          <ExcelViewerClient fileUrl={page.filePath} />
        )}
        <PageActions
          pageId={page._id!}
          documentId={document._id}
          onPageDeleted={handlePageDeleted}
        />
      </div>
    ));
  };

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-xl font-semibold mb-2">
        Xem từng trang ({pages.length} trang):
      </h3>
      {renderContent()}
      <ScrollToPage />
    </div>
  );
}
