import Link from "next/link";
import {
  getDocumentDetail,
  getDocumentPages,
} from "../../../services/documentService";
import { Document } from "@/types/document";
import PDFViewerClient from "@/app/component/pdfViewerClient";
import TextViewerClient from "@/app/component/textViewerClient";
import { useCurrentUser } from "@/hooks/customHooks";
import DocumentActions from "@/app/component/documentAction";
import PageActions from "@/app/component/pageAction";
import ScrollToPage from "@/app/component/scrollPage";
import ExcelViewerClient from "@/app/component/xlxsViewClient";

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

  const renderDocumentContent = () => {
    if (document.fileType === "pdf" && pages.length > 0) {
      return (
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold mb-2">Xem từng trang:</h3>
          {pages
            .sort((a, b) => a.pageNumber - b.pageNumber)
            .map((page, index) => (
              <div
                id={`page-${page._id}`}
                key={page._id || index}
                className="border rounded overflow-hidden shadow-sm p-4"
              >
                <PDFViewerClient filePath={page.filePath} />
                {page._id && document && (
                  <PageActions pageId={page._id} documentId={document._id} />
                )}
              </div>
            ))}
        </div>
      );
    } else if (document.fileType === "txt" && pages.length > 0) {
      return (
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold mb-2">Xem từng trang:</h3>
          {pages
            .sort((a, b) => a.pageNumber - b.pageNumber)
            .map((page, index) => (
              <div
                id={`page-${page._id}`}
                key={index}
                className="border rounded overflow-hidden shadow-sm"
              >
                <TextViewerClient
                  filePath={page.filePath}
                  pageNumber={page.pageNumber}
                  charsPerPage={2000}
                />
                {page._id && document && (
                  <PageActions pageId={page._id} documentId={document._id} />
                )}
              </div>
            ))}
        </div>
      );
    } else if (document.fileType === "xlsx" && pages.length > 0) {
      return (
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold mb-2">Xem từng trang Excel:</h3>
          {pages
            .sort((a, b) => a.pageNumber - b.pageNumber)
            .map((page, index) => (
              <div
                id={`page-${page._id}`}
                key={page._id || index}
                className="border rounded overflow-hidden shadow-sm p-4"
              >
                <ExcelViewerClient fileUrl={page.filePath} />
                {page._id && document && (
                  <PageActions pageId={page._id} documentId={document._id} />
                )}
              </div>
            ))}
        </div>
      );
    } else if (document.content) {
      return (
        <div className="mt-8 prose max-w-none">
          <h3 className="text-xl font-semibold mb-2">Nội dung:</h3>
          <div dangerouslySetInnerHTML={{ __html: document.content }} />
        </div>
      );
    } else {
      return (
        <p className="mt-8 text-gray-600">
          Không có nội dung hoặc file để hiển thị cho tài liệu này.
        </p>
      );
    }
  };

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

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {document.title}
        </h1>
        {document.description && (
          <p className="text-gray-700 text-lg mb-6">{document.description}</p>
        )}

        <p className="text-gray-600 text-sm mb-2">
          ID: {document._id} | Người đăng: {document.username} | Lĩnh vực:{" "}
          {document.field}
        </p>
        {document.fileType && (
          <p className="text-gray-600 text-sm mb-2">
            Loại file: {document.fileType}{" "}
            {document.totalPages && `(${document.totalPages} trang)`}
          </p>
        )}
        {document.filePath && (
          <p className="text-gray-600 text-sm">
            Đường dẫn file:{" "}
            <a
              href={document.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {document.filePath}
            </a>
          </p>
        )}

        {renderDocumentContent()}
        <ScrollToPage />
      </div>
    </div>
  );
}
