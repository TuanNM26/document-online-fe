"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/customHooks";
import {
  createBookmarkService,
  deletePageService,
} from "../../services/pageService";
import { useRouter } from "next/navigation";

interface PageActionsProps {
  pageId: string;
  documentId: string;
  onPageDeleted?: (pageId: string) => void;
}

export default function PageActions({
  pageId,
  documentId,
  onPageDeleted,
}: PageActionsProps) {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role?.roleName === "admin";
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingBookmark, setIsCreatingBookmark] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const router = useRouter();

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
      alert("Đã xóa trang thành công!");
      onPageDeleted?.(pageId);
    } catch (error: any) {
      alert(`Không thể xóa trang: ${error?.message || "Lỗi không xác định"}`);
    } finally {
      setIsDeleting(false);
    }
  }, [pageId, router]);

  const handleCreateBookmarkClick = useCallback(async () => {
    if (!bookmarkNote.trim()) {
      alert("Vui lòng nhập ghi chú cho bookmark.");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    }
    setIsCreatingBookmark(true);
    try {
      await createBookmarkService(
        { documentId, pageId, note: bookmarkNote },
        token
      );
      setBookmarkNote("");
      router.push("/bookmarks");
    } catch (error: any) {
      alert(
        `Không thể tạo bookmark: ${error?.message || "Lỗi không xác định"}`
      );
    } finally {
      setIsCreatingBookmark(false);
    }
  }, [documentId, pageId, bookmarkNote, router]);
  if (!currentUser) {
    return null;
  }
  return (
    <div className="mt-4 flex justify-end items-center gap-2">
      {" "}
      <input
        type="text"
        value={bookmarkNote}
        onChange={(e) => setBookmarkNote(e.target.value)}
        placeholder="Ghi chú bookmark"
        className="border rounded-md px-2 py-1 text-sm w-1/3"
        disabled={isCreatingBookmark}
      />
      <button
        onClick={handleCreateBookmarkClick}
        disabled={isCreatingBookmark || !bookmarkNote.trim()}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed" // Điều chỉnh style
      >
        {isCreatingBookmark ? "Đang tạo..." : "Tạo Bookmark"}
      </button>
      {isAdmin && (
        <>
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
        </>
      )}
    </div>
  );
}
