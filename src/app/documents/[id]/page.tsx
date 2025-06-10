import Link from "next/link";
import {
  getDocumentDetail,
  getDocumentPages,
} from "../../../services/documentService";
import { Document } from "@/types/document";
import PDFViewerClient from "@/app/component/pdfViewerClient";
import TextViewerClient from "@/app/component/textViewerClient"; 

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

  // pages sẽ chứa thông tin cho từng "trang" từ API
  let pages: {
    pageNumber: number;
    filePath: string; // Đối với TXT, đây sẽ là đường dẫn đến toàn bộ file TXT
    [key: string]: any;
  }[] = [];

  try {
    document = await getDocumentDetail(id);
    if (document?.fileType === "pdf" || document?.fileType === "txt") {
      // Gọi API getDocumentPages cho cả PDF và TXT
      // Giả định API này trả về một mảng các đối tượng,
      // mỗi đối tượng có pageNumber và filePath trỏ đến tài nguyên của trang đó.
      // Với TXT, mỗi object trong mảng sẽ có cùng filePath (đường dẫn đến file TXT gốc).
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
                key={index}
                className="border rounded overflow-hidden shadow-sm"
              >
                <PDFViewerClient filePath={page.filePath} />
              </div>
            ))}
        </div>
      );
    } else if (document.fileType === "txt" && pages.length > 0) {
      // Với file TXT, API cũng trả về một mảng 'pages'.
      // Mỗi 'page' trong mảng này có cùng 'filePath' trỏ đến toàn bộ file TXT.
      // Chúng ta sẽ lặp qua các 'page' và truyền 'filePath' và 'pageNumber' vào TextViewerClient.
      return (
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold mb-2">Xem từng trang:</h3>
          {pages
            .sort((a, b) => a.pageNumber - b.pageNumber)
            .map((page, index) => (
              <div
                key={index}
                className="border rounded overflow-hidden shadow-sm"
              >
                {/* Truyền filePath của toàn bộ file TXT và pageNumber vào TextViewerClient */}
                <TextViewerClient
                  filePath={page.filePath} // Đây là đường dẫn đến toàn bộ file TXT
                  pageNumber={page.pageNumber} // Đây là số trang được API trả về
                  charsPerPage={2000} // Có thể điều chỉnh số ký tự mỗi trang ở đây
                />
              </div>
            ))}
        </div>
      );
    } else if (document.content) {
      // Trường hợp hiển thị nội dung trực tiếp (không phải file)
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
          <div className="flex gap-2">
            <Link
              href={`/documents/${document._id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm"
            >
              Chỉnh sửa
            </Link>
          </div>
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
      </div>
    </div>
  );
}
