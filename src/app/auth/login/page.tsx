// app/(auth)/login/page.tsx

'use client'; // Đánh dấu đây là Client Component vì nó sẽ có tương tác form

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Sử dụng useRouter từ next/navigation cho App Router

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Đây là nơi bạn sẽ gọi API đăng nhập của backend
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại.');
      }

      // Xử lý khi đăng nhập thành công
      const data = await res.json();
      // Lưu token hoặc thông tin người dùng vào Local Storage, Context, hoặc HttpOnly Cookie
      // (Lưu ý: Lưu token vào HttpOnly cookie là an toàn nhất, cần backend hỗ trợ)
      // Ví dụ đơn giản cho Local Storage (không khuyến nghị cho production):
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Lưu thông tin user nếu backend trả về

      alert('Đăng nhập thành công!'); // Hoặc dùng toast notification
      router.push('/documents'); // Chuyển hướng đến trang tài liệu sau khi đăng nhập
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <Link href="/register" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Chưa có tài khoản? Đăng ký!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}