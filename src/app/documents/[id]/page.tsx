import Link from "next/link";
import {
  getDocumentDetail,
  getDocumentPages,
} from "../../../services/documentService";
import { Document } from "@/types/document";
import DocumentActions from "@/app/component/documentAction";
import ClientDocumentSection from "@/app/component/ClientDocumentSection";

interface DocumentDetailPageProps {
  params: {
    id: string;
  };
}

export default async function DocumentDetailPage({
  params,
}: DocumentDetailPageProps) {
  let document: Document | null = null;
  let error: string | null = null;
  const { id } = params;
  let pages: {
    _id?: string;
    pageNumber: number;
    filePath: string;
    [key: string]: any;
  }[] = [];

  try {
    document = await getDocumentDetail(id);
    if (["pdf", "txt", "xlsx"].includes(document?.fileType || "")) {
      pages = await getDocumentPages(id);
    }
  } catch (err: any) {
    error = err.message || `Không thể tải dữ liệu tài liệu ${params.id}.`;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            href="/documents"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Quay lại danh sách tài liệu
          </Link>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy tài liệu
          </h2>
          <p className="text-gray-700 mb-6">
            Tài liệu với ID "{params.id}" không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href="/documents"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Quay lại danh sách tài liệu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/documents"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            &larr; Quay lại danh sách
          </Link>
          {document && <DocumentActions documentId={document._id} />}
        </div>
        <ClientDocumentSection document={document} pages={pages} />
      </div>
    </div>
  );
}
