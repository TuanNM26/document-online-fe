"use client";

import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Không có quyền truy cập
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
        viên nếu bạn nghĩ đây là nhầm lẫn.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
}
