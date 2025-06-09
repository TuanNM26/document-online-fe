"use client"; // Đánh dấu component này là client

import React, { useState } from "react";
import Link from "next/link";
import { deleteDocument } from "@/services/documentService";

interface Document {
  _id: string;
  title: string;
  field: string;
  username: string;
}

interface Props {
  initialDocuments: Document[];
}

export default function DocumentsList({ initialDocuments }: Props) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tài liệu này?")) return;

    setLoadingId(id);
    setError(null);

    try {
      await deleteDocument(id /*, token nếu cần */);

      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err: any) {
      setError(err.message || "Lỗi khi xóa tài liệu.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {documents.length === 0 ? (
        <p>Không có tài liệu nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <Link href={`/documents/${doc._id}`} className="block">
                  <h2 className="text-2xl font-semibold text-blue-600 hover:underline mb-2 line-clamp-1">
                   Tiêu đề:  {doc.title}
                  </h2>
                </Link>
                <p className="text-gray-700 line-clamp-3">
                  Thể loại: {doc.field || "Chưa có mô tả cho tài liệu này."}
                </p>
                <p className="text-gray-700 line-clamp-3">
                  Người tạo :{" "}
                  {doc.username || "Chưa có mô tả cho tài liệu này."}
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                <Link
                  href={`/documents/${doc._id}/edit`}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Chỉnh sửa
                </Link>
                <button
                  onClick={() => handleDelete(doc._id)}
                  disabled={loadingId === doc._id}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  {loadingId === doc._id ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
