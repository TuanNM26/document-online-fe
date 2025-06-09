import Link from "next/link";
import DocumentsList from "./DocumentList";

async function getDocuments() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/documents`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Không tải được dữ liệu tài liệu");
  }

  const data = await res.json();
  return data.data || [];
}

export default async function DocumentsPage() {
  let documents = [];
  let error = null;

  try {
    documents = await getDocuments();
  } catch (err: any) {
    error = err.message || "Không thể tải tài liệu.";
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">
        Danh Sách Tài liệu
      </h1>
      <DocumentsList initialDocuments={documents} />
      <div className="text-center mt-10">
        <Link
          href="/documents/create"
          className="bg-green-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          + Thêm Tài liệu Mới
        </Link>
      </div>
    </div>
  );
}
