"use client";

import React from "react";
import Link from "next/link";

import { useCurrentUser } from "@/hooks/customHooks";

interface DocumentActionsProps {
  documentId: string;
}

export default function DocumentActions({ documentId }: DocumentActionsProps) {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role?.roleName === "admin";

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/documents/${documentId}/edit`}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm"
      >
        Chỉnh sửa
      </Link>
      <Link
        href={`/documents/${documentId}/addPage`}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm"
      >
        Thêm trang
      </Link>
    </div>
  );
}
