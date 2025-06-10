"use client";

import React, { useState, useCallback, useEffect } from "react";
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
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [documentToDeleteId, setDocumentToDeleteId] = useState<string | null>(
    null
  );

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
  }, []);

  React.useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  const handleShowConfirm = useCallback((id: string) => {
    setDocumentToDeleteId(id);
    setShowConfirmModal(true);
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setShowConfirmModal(false);
    setDocumentToDeleteId(null);
  }, []);

  const handleDeleteConfirmed = useCallback(async () => {
    if (!documentToDeleteId) return;

    setLoadingId(documentToDeleteId);
    setError(null);
    setShowConfirmModal(false);

    try {
      await deleteDocument(documentToDeleteId, token as string);
      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== documentToDeleteId)
      );
    } catch (err: any) {
      setError(err.message || "Lỗi khi xóa tài liệu.");
    } finally {
      setLoadingId(null);
      setDocumentToDeleteId(null);
    }
  }, [documentToDeleteId]);

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
        <p className="text-center text-gray-600">Không có tài liệu nào.</p>
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
                    Tiêu đề: {doc.title}
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
                  onClick={() => handleShowConfirm(doc._id)}
                  disabled={loadingId === doc._id}
                  className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingId === doc._id ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa tài liệu này không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseConfirm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
