import { useEffect } from "react";
import { socket } from "@/lib/socket";

export function useHomeDocumentSocket(
  onDocumentListChange: (data: { eventType: string; document: any }) => void
) {
  useEffect(() => {
    socket.on("home-document-change", onDocumentListChange);

    return () => {
      socket.off("home-document-change", onDocumentListChange);
    };
  }, [onDocumentListChange]);
}
