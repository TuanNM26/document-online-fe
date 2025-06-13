"use client";

import React from "react";
import Link from "next/link";
import { FaEdit, FaPlus } from "react-icons/fa"; // Import biểu tượng

import { useCurrentUser } from "@/hooks/customHooks";

interface DocumentActionsProps {
  documentId: string;
  onDocumentUpdated?: (updatedDoc: Document) => void;
}

export default function DocumentActions({ documentId }: DocumentActionsProps) {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role?.roleName === "admin";

  if (!isAdmin) return null;

  return (
    <div className="flex gap-2 mt-2">
      <Link
        href={`/documents/${documentId}/edit`}
        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm transition"
      >
        <FaEdit /> Chỉnh sửa
      </Link>
      <Link
        href={`/documents/${documentId}/addPage`}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm transition"
      >
        <FaPlus /> Thêm trang
      </Link>
    </div>
  );
}
