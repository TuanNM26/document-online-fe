"use client";

import { Document } from "@/types/document";
import ClientDocumentViewer from "./ClientDocumentViewer";

interface ClientDocumentSectionProps {
  document: Document;
  pages: {
    _id?: string;
    pageNumber: number;
    filePath: string;
    [key: string]: any;
  }[];
}

export default function ClientDocumentSection({
  document,
  pages,
}: ClientDocumentSectionProps) {
  return (
    <div>
      <ClientDocumentViewer document={document} pages={pages} />
    </div>
  );
}
