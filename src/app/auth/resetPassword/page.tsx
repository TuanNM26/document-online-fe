"use client";

import { useState } from "react";
import { resetPassword } from "../../../services/authService";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // ✅ đúng hook
import {
  MailIcon,
  LockIcon,
  ShieldCheckIcon,
  KeyRoundIcon,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    try {
      await resetPassword(email, code, newPassword);
      toast.success("✅ Mật khẩu đã được cập nhật!");
      setMessage("🔐 Mật khẩu đã được đặt lại thành công!");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      toast.error("❌ Lỗi: " + (err as Error).message);
      setMessage((err as Error).message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 flex items-center gap-2">
        <KeyRoundIcon className="w-6 h-6" /> Đặt lại mật khẩu
      </h1>

      <div className="space-y-4">
        <div className="relative">
          <MailIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <ShieldCheckIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Mã xác nhận"
            value={code}
            required
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="relative">
          <LockIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="password"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Mật khẩu mới"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
        >
          🔄 Đặt lại mật khẩu
        </button>

        {message && (
          <p className="mt-2 text-sm text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}
