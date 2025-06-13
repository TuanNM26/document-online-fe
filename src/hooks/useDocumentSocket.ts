"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export function useDocumentSocket(
  documentId: string,
  onPageChange?: (data: any) => void,
  onDocumentChange?: (doc: any) => void
) {
  useEffect(() => {
    if (!documentId) return;

    socket.emit("join-document", documentId);
    console.log(`Joined socket room ${documentId}`);

    if (onPageChange) {
      socket.on("page-change", onPageChange);
    }
    if (onDocumentChange) {
      socket.on("document-change", onDocumentChange);
    }

    return () => {
      socket.emit("leave-document", documentId);
      if (onPageChange) socket.off("page-change", onPageChange);
      if (onDocumentChange) socket.off("document-change", onDocumentChange);
    };
  }, [documentId, onPageChange, onDocumentChange]);
}
