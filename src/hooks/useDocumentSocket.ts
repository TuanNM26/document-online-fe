"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export function useDocumentSocket(
  documentId: string,
  onPageChange: (data: any) => void
) {
  useEffect(() => {
    if (!documentId) return;

    socket.emit("join-document", documentId);
    socket.on("page-change", onPageChange);

    return () => {
      socket.emit("leave-document", documentId);
      socket.off("page-change", onPageChange);
    };
  }, [documentId, onPageChange]);
}
