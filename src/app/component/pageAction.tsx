// app/component/PageActions.tsx
"use client"; // Đảm bảo đây là Client Component

import React, { useCallback } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/customHooks"; // Import hook useCurrentUser
// Import service xóa trang nếu bạn muốn xử lý xóa ở đây
// import { deletePageService } from "../../../services/documentService";

interface PageActionsProps {
  pageId: string;
  documentId: string; // Cần documentId để xây dựng URL chỉnh sửa
  // Bạn có thể thêm callbacks cho các hành động nếu muốn xử lý ở component cha
  // onDelete: (pageId: string) => void;
  // onEdit: (pageId: string) => void;
}

export default function PageActions({ pageId, documentId }: PageActionsProps) {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role?.roleName === "admin";

  // Nếu không phải admin, không hiển thị gì cả
  if (!isAdmin) {
    return null;
  }

  // Các hàm xử lý sự kiện (ví dụ: gọi API xóa, chuyển hướng chỉnh sửa)
  // Nếu bạn muốn xử lý xóa trực tiếp trong component này:
  // const handleDeleteClick = useCallback(async () => {
  //     if (window.confirm("Bạn có chắc chắn muốn xóa trang này không?")) {
  //         try {
  //             const token = localStorage.getItem("authToken"); // Lấy token client-side
  //             await deletePageService(pageId, token); // Gọi service xóa
  //             alert("Đã xóa trang thành công!");
  //             // Nếu bạn có callback onDelete, gọi nó để component cha cập nhật UI
  //             // onDelete(pageId);
  //         } catch (error: any) {
  //             console.error("Lỗi khi xóa trang:", error);
  //             alert(`Không thể xóa trang: ${error.message || 'Lỗi không xác định'}`);
  //         }
  //     }
  // }, [pageId]); // Thêm onDelete vào dependency array nếu sử dụng

  // Nếu bạn muốn sử dụng Link để chuyển hướng đến trang chỉnh sửa:

  return (
    <div className="mt-4 flex justify-end gap-2">
      {/* Nút Chỉnh sửa */}
       <Link
           href={`/documents/${documentId}/pages/${pageId}/edit`} // Thay thế bằng URL chỉnh sửa trang thực tế của bạn
           className="text-blue-500 hover:text-blue-700 text-sm font-medium"
       >
           Chỉnh sửa trang
       </Link>

      {/* Nút Xóa (sử dụng button và hàm xử lý sự kiện nếu muốn xử lý ở đây) */}
       {/* Nếu muốn xử lý xóa ở component cha, bạn sẽ truyền hàm đó qua props */}
      <button
         // onClick={() => onDelete(pageId)} // Nếu truyền callback từ cha
         // onClick={handleDeleteClick} // Nếu xử lý xóa trực tiếp ở đây
          className="text-red-500 hover:text-red-700 text-sm font-medium"
      >
        Xóa trang
      </button>
    </div>
  );
}