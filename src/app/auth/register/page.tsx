"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Mail, Lock, Loader } from "lucide-react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { register } from "@/services/authService";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(username, email, password);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/auth/verify");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đăng ký.");
      toast.error("Có lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <FaUserCircle size={60} />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Đăng ký
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên người dùng:
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                id="username"
                className="pl-10 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="email"
                id="email"
                className="pl-10 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu:
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="password"
                id="password"
                className="pl-10 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none flex items-center disabled:opacity-50"
            >
              {loading && <Loader className="animate-spin mr-2" size={16} />}
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
            <Link
              href="/auth/login"
              className="text-sm text-blue-500 hover:underline"
            >
              Đã có tài khoản? Đăng nhập!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
