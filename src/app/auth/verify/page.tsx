"use client";

import { useState } from "react";
import { verifyEmail } from "../../../services/authService";
import { toast } from "sonner";
import { CheckCircle, XCircle, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyCodePage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const router = useRouter();
  const handleVerify = async () => {
    try {
      await verifyEmail(code);
      toast.success("✅ Xác minh thành công!");
      setSuccess(true);
      setMessage("Xác minh thành công!");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      setSuccess(false);
      setMessage((err as Error).message || "Xác minh thất bại!");
      toast.error("❌ Xác minh thất bại!");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl mt-10 border border-gray-200">
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Mã xác nhận</label>
        <input
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mã xác nhận"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>

      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-semibold"
        onClick={handleVerify}
      >
        Xác minh
      </button>

      {message && (
        <div
          className={`mt-4 flex items-center space-x-2 text-sm p-3 rounded-lg ${
            success === true
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {success === true ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
