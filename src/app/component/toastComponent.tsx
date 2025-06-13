"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // nếu bạn đang dùng tailwind helpers

interface ToastMessageProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number; // in ms
}

export default function ToastMessage({
  message,
  type = "info",
  duration = 3000,
}: ToastMessageProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    }, duration);
    return () => clearTimeout(timeout);
  }, [duration]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-md text-white transition-all",
        type === "success" && "bg-green-600",
        type === "error" && "bg-red-600",
        type === "info" && "bg-blue-500"
      )}
    >
      {message}
    </div>
  );
}
