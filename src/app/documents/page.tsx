import Link from 'next/link';
interface Document {
  _id: string;
  title: string;
  field: string;
}

interface ApiResponse {
  data: Document[];
  total: number;
  totalPages: number;
  currentPage: number;
}

async function getDocuments(): Promise<Document[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/documents`, {
    cache: 'no-store' // Đảm bảo luôn lấy dữ liệu mới nhất
  });

  if (!res.ok) {
    const errorText = await res.text(); 
    console.error(`API Error: ${res.status} - ${errorText}`);
    throw new Error(`Failed to fetch documents: ${errorText || res.statusText}`);
  }

  const responseData: ApiResponse = await res.json(); 
  if (responseData && Array.isArray(responseData.data)) {
    return responseData.data;
  } else {
    console.error('Unexpected API response format:', responseData);
    throw new Error('Dữ liệu tài liệu không ở định dạng mong đợi (thuộc tính "data" không phải mảng).');
  }
}

export default async function DocumentsPage() {
  let documents: Document[] = [];
  let error: string | null = null;

  try {
    documents = await getDocuments();
  } catch (err: any) {
    error = err.message || 'Không thể tải tài liệu.';
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">Danh Sách Tài liệu</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {documents.length === 0 && !error ? (
        <div className="text-center text-gray-600">
          <p className="text-lg">Hiện chưa có tài liệu nào.</p>
          <Link href="/documents/create" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Tạo tài liệu mới
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              <div className="p-6">
                <Link href={`/documents/${doc._id}`} className="block">
                  <h2 className="text-2xl font-semibold text-blue-600 hover:underline mb-2 line-clamp-1">
                    {doc.title}
                  </h2>
                </Link>
                <p className="text-gray-700 line-clamp-3">
                  {doc.field || 'Chưa có mô tả cho tài liệu này.'}
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                <Link href={`/documents/${doc._id}/edit`} className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                  Chỉnh sửa
                </Link>
                <button className="text-red-500 hover:text-red-700 text-sm font-medium">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!error && (
        <div className="text-center mt-10">
          <Link href="/documents/create" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-200">
            + Thêm Tài liệu Mới
          </Link>
        </div>
      )}
    </div>
  );
}