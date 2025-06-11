"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ScrollToPage() {
  const searchParams = useSearchParams();
  const pageId = searchParams.get("pageId");

  useEffect(() => {
    if (!pageId) return;
    const timeout = setTimeout(() => {
      const element = document.getElementById(`page-${pageId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [pageId]);

  return null;
}
