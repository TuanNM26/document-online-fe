"use client";

import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { updatePageFileService } from "../../../../../../services/pageService";
import { useCurrentUser } from "@/hooks/customHooks";
import { useAdminGuard } from "@/app/component/adminProtect";

export default function EditPageFilePage() {
  useAdminGuard({ redirectTo: "/forbidden" });
  const params = useParams();
  const router = useRouter();
  const { id, pageId } = params;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role?.roleName === "admin";

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setSelectedFile(event.target.files[0]);
        setError(null);
      } else {
        setSelectedFile(null);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedFile) {
        setError("Vui lòng chọn một file để upload.");
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await updatePageFileService(
          id as string,
          pageId as string,
          selectedFile,
          token
        );

        alert("File trang đã được cập nhật thành công!");
        router.push(`/documents/${id}`);
      } catch (err: any) {
        setError(
          `Không thể cập nhật file trang: ${
            err.message || "Lỗi không xác định"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [id, pageId, selectedFile, router]
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-700 mb-6">
            Bạn không có quyền chỉnh sửa trang này.
          </p>
          <Link
            href={`/documents/${id}`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Quay lại chi tiết tài liệu
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Chỉnh sửa file trang
        </h1>

        <div className="mb-4">
          <Link
            href={`/documents/${id}`}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            &larr; Quay lại chi tiết tài liệu
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chọn file mới cho trang:
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {selectedFile && (
            <p className="text-sm text-gray-600">
              Đã chọn file: {selectedFile.name}
            </p>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !selectedFile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang upload..." : "Cập nhật file trang"}
          </button>
        </form>
      </div>
    </div>
  );
}
