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
    <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        {document.title}
      </h1>

      {document.description && (
        <p className="text-gray-700 text-lg mb-4 italic border-l-4 border-blue-300 pl-4">
          {document.description}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <span className="font-semibold text-gray-900">🆔 ID:</span>{" "}
          <span className="text-gray-600">{document._id}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-900">👤 Người đăng:</span>{" "}
          <span className="text-gray-600">{document.username}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-900">🏷️ Lĩnh vực:</span>{" "}
          <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-md">
            {document.field}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-900">📄 Loại file:</span>{" "}
          <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md">
            {document.fileType}
          </span>
        </div>
        {document.filePath && (
          <div className="col-span-1 sm:col-span-2 break-words">
            <span className="font-semibold text-gray-900">
              🔗 Đường dẫn file:
            </span>{" "}
            <a
              href={document.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {document.filePath}
            </a>
          </div>
        )}
      </div>

      {/* Viewer */}
      <div className="mt-6">
        <ClientDocumentViewer document={document} pages={pages} />
      </div>
    </div>
  );
}
