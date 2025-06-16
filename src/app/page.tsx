
import Link from 'next/link'; 

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900">
          Chào mừng đến với{' '}
          <Link href="/" className="text-blue-600 hover:underline">
            Hệ thống Tài liệu Online
          </Link>
        </h1>

        <p className="mt-6 text-xl text-gray-700">
          Nơi bạn có thể quản lý, xem và bookmark các tài liệu quan trọng của mình nhé mọi người.
        </p>

        <div className="flex flex-wrap items-center justify-around mt-8 sm:w-full">
          <Link href="/auth/login" className="p-6 mt-6 text-left border rounded-xl hover:text-blue-600 focus:text-blue-600 transition duration-150 ease-in-out hover:border-blue-600 w-96">
            <h3 className="text-2xl font-bold">Đăng nhập &rarr;</h3>
            <p className="mt-4 text-xl">
              Truy cập vào tài khoản của bạn để xem và quản lý tài liệu.
            </p>
          </Link>
          <Link href="/auth/register" className="p-6 mt-6 text-left border rounded-xl hover:text-blue-600 focus:text-blue-600 transition duration-150 ease-in-out hover:border-blue-600 w-96">
            <h3 className="text-2xl font-bold">Đăng ký &rarr;</h3>
            <p className="mt-4 text-xl">
              Chưa có tài khoản? Tạo một tài khoản mới ngay bây giờ!
            </p>
          </Link>

          <Link href="/documents" className="p-6 mt-6 text-left border rounded-xl hover:text-blue-600 focus:text-blue-600 transition duration-150 ease-in-out hover:border-blue-600 w-96">
            <h3 className="text-2xl font-bold">Xem Tài liệu &rarr;</h3>
            <p className="mt-4 text-xl">
              Duyệt qua các tài liệu có sẵn trong hệ thống.
            </p>
          </Link>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t mt-12">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} Hệ thống Tài liệu Online.
        </p>
      </footer>
    </div>
  );
}