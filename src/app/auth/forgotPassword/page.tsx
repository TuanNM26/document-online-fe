"use client";

import { useState } from "react";
import { forgotPassword } from "../../../services/authService";
import { FiMail, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const handleSendCode = async () => {
    try {
      await forgotPassword(email);
      setMessage("Mã xác nhận đã được gửi qua email.");
      setIsError(false);
      toast.success("Đã gửi mã xác nhận tới email");
      router.push("/auth/resetPassword");
    } catch (err) {
      setMessage((err as Error).message);
      toast.error("Đã có lỗi khi gửi mã xác nhận tới email");
      setIsError(true);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6 mt-10">
      <h1 className="text-2xl font-bold text-center text-blue-600">
        Quên mật khẩu
      </h1>

      <div className="relative">
        <FiMail className="absolute top-3 left-3 text-blue-400 text-lg" />
        <input
          type="email"
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhập email của bạn"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        onClick={handleSendCode}
      >
        Gửi mã xác nhận
      </button>

      {message && (
        <div
          className={`flex items-center gap-2 text-sm mt-2 ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {isError ? <FiXCircle /> : <FiCheckCircle />}
          {message}
        </div>
      )}
    </div>
  );
}
