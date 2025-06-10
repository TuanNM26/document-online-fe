import { headers } from "next/headers";
import { getDocument } from "@/services/documentService";
import DocumentsList from "../component/documentList";
import Pagination from "../component/pagination";
import Link from "next/link";
import { getNumberParam } from "@/utils/getNumberParam";

export const dynamic = "force-dynamic";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    query?: string;
  };
}) {
  const page = getNumberParam(searchParams.page, 1);
  const limit = getNumberParam(searchParams.limit, 10);
  const query = searchParams.query || "";

  let documents = [];
  let error = null;
  let currentPage = 1;
  let totalPages = 1;

  try {
    const response = await getDocument(page, limit, query);
    documents = response.data;
    currentPage = response.currentPage;
    totalPages = response.totalPages;
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
      <form
        method="GET"
        className="flex items-center gap-4 mb-6 w-full max-w-3xl mx-auto"
      >
        <input
          type="text"
          name="query"
          placeholder="Tìm kiếm tài liệu..."
          defaultValue={searchParams.query || ""}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg"
        >
          Tìm
        </button>
      </form>
      <DocumentsList initialDocuments={documents} />

      <div className="text-center mt-10">
        <Link
          href="/documents/create"
          className="bg-green-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          + Thêm Tài liệu Mới
        </Link>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/documents"
        queryParams={{
          limit: limit.toString(),
          query: query,
        }}
      />
    </div>
  );
}
