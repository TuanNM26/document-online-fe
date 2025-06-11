"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/customHooks";
import { deletePageService } from "../../services/documentService";

interface PageActionsProps {
  pageId: string;
  documentId: string;
}

export default function PageActions({ pageId, documentId }: PageActionsProps) {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role?.roleName === "admin";
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback(async () => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa trang này không?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    }

    try {
      setIsDeleting(true);
      await deletePageService(pageId, token);
    } catch (error: any) {
      console.error("Lỗi khi xóa trang:", error);
      alert(`Không thể xóa trang: ${error?.message || "Lỗi không xác định"}`);
    } finally {
      setIsDeleting(false);
    }
  }, [pageId]);

  if (!isAdmin) return null;

  return (
    <div className="mt-4 flex justify-end gap-2">
      <Link
        href={`/documents/${documentId}/pages/${pageId}/edit`}
        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
      >
        Chỉnh sửa trang
      </Link>

      <button
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? "Đang xóa..." : "Xóa trang"}
      </button>
    </div>
  );
}
