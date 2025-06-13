"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getBookmarksService,
  deleteBookmarkService,
} from "../../services/bookmarkService";
import { Bookmark } from "../../types/bookmark";
import { useCurrentUser } from "@/hooks/customHooks";
import {
  FaEye,
  FaTrash,
  FaStickyNote,
  FaBook,
  FaExclamationCircle,
  FaSignInAlt,
} from "react-icons/fa";
import { toast } from "sonner";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingBookmarkId, setDeletingBookmarkId] = useState<string | null>(
    null
  );

  const currentUser = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser && !isLoading) {
      toast.error("Bạn cần đăng nhập để xem bookmark.");
    }
  }, [currentUser, isLoading]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Không tìm thấy token xác thực.");
        setIsLoading(false);
        return;
      }

      try {
        const userBookmarksResponse = await getBookmarksService(token);
        setBookmarks(userBookmarksResponse.data);
      } catch (err: any) {
        setError(
          `Không thể tải bookmark: ${err.message || "Lỗi không xác định"}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [currentUser]);

  const handleDeleteBookmark = useCallback(async (bookmarkId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bookmark này không?")) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      setDeletingBookmarkId(bookmarkId);

      try {
        await deleteBookmarkService(bookmarkId, token);
        setBookmarks((prev) =>
          prev.filter((bookmark) => bookmark._id !== bookmarkId)
        );
      } catch (err: any) {
        toast.error(`Không thể xóa bookmark: ${err.message || "Lỗi không xác định"}`);
      } finally {
        setDeletingBookmarkId(null);
      }
    }
  }, []);

  const handleAccessBookmark = useCallback(
    (bookmark: Bookmark) => {
      router.push(
        `/documents/${bookmark.document._id}?pageId=${bookmark.pageId}`
      );
    },
    [router]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-8">
        <p className="text-gray-600 text-lg font-medium">
          Đang tải bookmark...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-white p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center border border-yellow-300">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4 flex items-center justify-center gap-2">
            <FaSignInAlt /> Cần đăng nhập
          </h2>
          <p className="text-gray-700 mb-6">
            Bạn cần đăng nhập để xem danh sách bookmark.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-white p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center border border-red-300">
          <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center justify-center gap-2">
            <FaExclamationCircle /> Lỗi
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          📌 Danh sách Bookmark của tôi
        </h1>

        {bookmarks.length === 0 ? (
          <p className="text-gray-500 text-center">Bạn chưa có bookmark nào.</p>
        ) : (
          <ul className="space-y-4">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark._id}
                className="bg-blue-50 hover:bg-blue-100 transition-colors duration-200 p-4 rounded-md shadow-sm flex justify-between items-center border border-blue-200"
              >
                <div>
                  <p className="text-blue-800 font-semibold flex items-center gap-2">
                    <FaStickyNote className="text-yellow-500" />
                    {bookmark.note}
                  </p>
                  {bookmark.document && (
                    <p className="text-sm mt-1 flex items-center gap-2 text-gray-700">
                      <FaBook className="text-green-600" />
                      <span>
                        <strong>Tài liệu:</strong> {bookmark.document.title} |{" "}
                        <strong>Trang:</strong> {bookmark.pageId}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccessBookmark(bookmark)}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-150"
                  >
                    <FaEye /> Truy cập
                  </button>
                  <button
                    onClick={() => handleDeleteBookmark(bookmark._id)}
                    disabled={deletingBookmarkId === bookmark._id}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                  >
                    <FaTrash />
                    {deletingBookmarkId === bookmark._id
                      ? "Đang xóa..."
                      : "Xóa"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
