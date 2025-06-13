"use client";

import { useCallback, useState } from "react";
import { Document } from "@/types/document";
import { useDocumentSocket } from "@/hooks/useDocumentSocket";
import ClientDocumentViewer from "./ClientDocumentViewer";

interface Page {
  _id?: string;
  pageNumber: number;
  filePath: string;
  [key: string]: any;
}

interface ClientDocumentSectionProps {
  document: Document;
  pages: Page[];
}

export default function ClientDocumentSection({
  document: initialDocument,
  pages,
}: ClientDocumentSectionProps) {
  const [document, setDocument] = useState<Document>(initialDocument);

  const handleDocumentChange = useCallback((updated: Document) => {
    setDocument(updated);
  }, []);

  // Chỉ cần lắng nghe document-change ở đây
  useDocumentSocket(document._id, undefined, handleDocumentChange);

  return (
    <div className="mt-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {document.title}
      </h1>

      {document.description && (
        <p className="text-gray-700 text-lg mb-4">{document.description}</p>
      )}

      <p className="text-sm text-gray-600 mb-1">ID: {document._id}</p>
      <p className="text-sm text-gray-600 mb-1">
        Người đăng: {document.username}
      </p>
      <p className="text-sm text-gray-600 mb-1">Lĩnh vực: {document.field}</p>
      <p className="text-sm text-gray-600 mb-1">
        Loại file: {document.fileType}
      </p>

      {document.filePath && (
        <p className="text-sm text-gray-600 break-all">
          Đường dẫn file:{" "}
          <a
            href={document.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {document.filePath}
          </a>
        </p>
      )}

      {/* Truyền document đã cập nhật cho viewer */}
      <ClientDocumentViewer document={document} pages={pages} />
    </div>
  );
}
