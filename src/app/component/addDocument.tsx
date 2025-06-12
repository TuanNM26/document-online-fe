"use client";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/customHooks";

export default function AddDocumentButton() {
  const currentUser = useCurrentUser();

  if (currentUser?.role?.roleName !== "admin") return null;

  return (
    <Link
      href="/documents/create"
      className="bg-green-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-200"
    >
      + Thêm Tài liệu Mới
    </Link>
  );
}
