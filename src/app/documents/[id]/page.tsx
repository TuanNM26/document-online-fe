import Link from 'next/link';

interface Document {
  _id: string;
  title: string;
  description?: string; // Có thể có hoặc không
  content?: string;     // Nếu tài liệu là văn bản (Markdown/HTML)
  filePath?: string;    // Nếu tài liệu là file (ví dụ: PDF)
  fileType?: string;    // Loại file (pdf, docx, etc.)
  // Thêm các trường khác tùy theo backend của bạn
  userId: string;
  field: string;
  totalPages?: number;
}

// Định nghĩa props mà page component này sẽ nhận
interface DocumentDetailPageProps {
  params: {
    id: string; // ID tài liệu từ URL
  };
}

async function getDocumentDetail(id: string): Promise<Document> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/documents/${id}`, {
    cache: 'no-store' 
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API Error for document ${id}: ${res.status} - ${errorText}`);
    throw new Error(`Failed to fetch document ${id}: ${errorText || res.statusText}`);
  }

  const documentData: Document = await res.json();
  
  return documentData;
}

export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  let document: Document | null = null;
  let error: string | null = null;
  const { id } = await params;
  try {
    document = await getDocumentDetail(id);
  } catch (err: any) {
    error = err.message || `Không thể tải chi tiết tài liệu ${params.id}.`;
    console.error(err);
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link href="/documents" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Quay lại danh sách tài liệu
          </Link>
        </div>
      </div>
    );
  }

  if (!document) {
    // Trường hợp này có thể xảy ra nếu getDocumentDetail không throw lỗi nhưng trả về null/undefined
    // hoặc bạn không xử lý notFound()
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy tài liệu</h2>
          <p className="text-gray-700 mb-6">Tài liệu với ID "{params.id}" không tồn tại hoặc đã bị xóa.</p>
          <Link href="/documents" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Quay lại danh sách tài liệu
          </Link>
        </div>
      </div>
    );
  }

  // LƯU Ý: Đây là một ví dụ đơn giản.
  // Trong thực tế, bạn sẽ cần các component cụ thể để hiển thị các loại file khác nhau (PDF, DOCX, ảnh).
  const renderDocumentContent = () => {
    if (document.filePath && document.fileType === 'pdf') {
      // Giả định bạn có một component PDFViewer hoặc iframe để nhúng PDF
      // Ví dụ: return <PDFViewer src={document.filePath} />;
      return (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Xem File:</h3>
          <iframe
            src={document.filePath}
            className="w-full"
            style={{ height: '80vh', border: 'none' }}
            title={document.title}
          >
            Trình duyệt của bạn không hỗ trợ hiển thị PDF.
            <a href={document.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Tải file về.
            </a>
          </iframe>
        </div>
      );
    } else if (document.content) {
      // Nếu nội dung là text/Markdown/HTML
      // Nếu là Markdown, bạn sẽ cần thư viện như react-markdown để render
      // Ví dụ: <ReactMarkdown>{document.content}</ReactMarkdown>
      return (
        <div className="mt-8 prose max-w-none"> {/* 'prose' cho typography đẹp hơn nếu dùng Tailwind */}
          <h3 className="text-xl font-semibold mb-2">Nội dung:</h3>
          {/* Dùng dangerouslySetInnerHTML nếu nội dung là HTML đã được render từ backend
              CẨN THẬN: Chỉ dùng khi bạn tin tưởng nguồn dữ liệu để tránh XSS attacks */}
          <div dangerouslySetInnerHTML={{ __html: document.content }} />
        </div>
      );
    } else {
      return <p className="mt-8 text-gray-600">Không có nội dung hoặc file để hiển thị cho tài liệu này.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/documents" className="text-blue-500 hover:text-blue-700 flex items-center">
            &larr; Quay lại danh sách
          </Link>
          <div className="flex gap-2">
            {/* Nút Chỉnh sửa */}
            <Link href={`/documents/${document._id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm">
              Chỉnh sửa
            </Link>
            {/* Nút Xóa (thường là Client Component với modal xác nhận) */}
            {/* <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm">
              Xóa
            </button> */}
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{document.title}</h1>
        {document.description && (
          <p className="text-gray-700 text-lg mb-6">{document.description}</p>
        )}

        <p className="text-gray-600 text-sm mb-2">
          **ID:** {document._id} | **Người đăng:** {document.userId} | **Lĩnh vực:** {document.field}
        </p>
        {document.fileType && (
          <p className="text-gray-600 text-sm mb-2">
            **Loại file:** {document.fileType} {document.totalPages && `(${document.totalPages} trang)`}
          </p>
        )}
        {document.filePath && (
          <p className="text-gray-600 text-sm">
            **Đường dẫn file:** <a href={document.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{document.filePath}</a>
          </p>
        )}

        {renderDocumentContent()}
      </div>
    </div>
  );
}