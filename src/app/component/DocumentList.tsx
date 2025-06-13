"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";

import { deleteDocument } from "@/services/documentService";
import { useCurrentUser } from "@/hooks/customHooks";
import { Document } from "@/types/document";
import { FaEdit, FaTrash, FaBook, FaTags, FaUser } from "react-icons/fa";

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

  const currentUser = useCurrentUser();

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
  }, [documentToDeleteId, token]);

  const isAdmin = currentUser?.role?.roleName === "admin";

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
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
            >
              <div className="p-6">
                <Link href={`/documents/${doc._id}`} className="block">
                  <h2 className="text-xl font-bold text-blue-700 group-hover:text-blue-900 transition-colors mb-2 line-clamp-1 flex items-center gap-2">
                    <FaBook className="text-blue-500" />
                    {doc.title}
                  </h2>
                </Link>

                <p className="flex items-center gap-2 text-sm text-purple-700 mb-1">
                  <FaTags className="text-purple-500" />
                  <span>
                    <span className="font-semibold text-purple-900">
                      Chuyên mục:
                    </span>{" "}
                    {doc.field || "Không rõ"}
                  </span>
                </p>

                <p className="flex items-center gap-2 text-sm text-green-700">
                  <FaUser className="text-green-500" />
                  <span>
                    <span className="font-semibold text-green-900">
                      Người tạo:
                    </span>{" "}
                    {doc.username || "Không rõ"}
                  </span>
                </p>
              </div>

              {isAdmin && (
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                  <Link
                    href={`/documents/${doc._id}/edit`}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    <FaEdit />
                    Chỉnh sửa
                  </Link>
                  <button
                    onClick={() => handleShowConfirm(doc._id)}
                    disabled={loadingId === doc._id}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTrash />
                    {loadingId === doc._id ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không
              thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseConfirm}
                className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
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
