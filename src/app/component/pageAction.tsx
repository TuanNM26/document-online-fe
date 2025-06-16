"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/customHooks";
import {
  createBookmarkService,
  deletePageService,
} from "../../services/pageService";
import { useRouter } from "next/navigation";
import {
  FaBookmark,
  FaTrash,
  FaPen,
  FaSpinner,
  FaRegStickyNote,
} from "react-icons/fa";
import { toast } from "sonner";

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
      toast.error("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    }

    try {
      setIsDeleting(true);
      await deletePageService(pageId, token);
      toast.success("✅ Đã xóa trang thành công!");
      onPageDeleted?.(pageId);
    } catch (error: any) {
      toast.error(
        `❌ Không thể xóa trang: ${error?.message || "Lỗi không xác định"}`
      );
    } finally {
      setIsDeleting(false);
    }
  }, [pageId, router]);

  const handleCreateBookmarkClick = useCallback(async () => {
    if (!bookmarkNote.trim()) {
      toast.error("Vui lòng nhập ghi chú cho bookmark.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Bạn cần đăng nhập để thực hiện hành động này.");
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
      toast.error(
        `❌ Không thể tạo bookmark: ${error?.message || "Lỗi không xác định"}`
      );
    } finally {
      setIsCreatingBookmark(false);
    }
  }, [documentId, pageId, bookmarkNote, router]);

  if (!currentUser) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 justify-end">
      <div className="relative">
        <input
          type="text"
          value={bookmarkNote}
          onChange={(e) => setBookmarkNote(e.target.value)}
          placeholder="Ghi chú bookmark"
          className="border rounded-md px-2 py-1 text-sm w-56 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-400"
          disabled={isCreatingBookmark}
        />
        <FaRegStickyNote className="absolute right-2 top-2 text-gray-400 text-sm" />
      </div>

      <button
        onClick={handleCreateBookmarkClick}
        disabled={isCreatingBookmark || !bookmarkNote.trim()}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition
          ${
            isCreatingBookmark || !bookmarkNote.trim()
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
      >
        {isCreatingBookmark ? (
          <>
            <FaSpinner className="animate-spin" /> Đang tạo...
          </>
        ) : (
          <>
            <FaBookmark /> Tạo Bookmark
          </>
        )}
      </button>

      {isAdmin && (
        <>
          <Link
            href={`/documents/${documentId}/pages/${pageId}/edit`}
            className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
          >
            <FaPen /> Chỉnh sửa
          </Link>

          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <FaSpinner className="animate-spin" /> Đang xóa...
              </>
            ) : (
              <>
                <FaTrash /> Xóa trang
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
