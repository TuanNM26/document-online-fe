import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-gray-700 text-sm border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="font-semibold text-lg mb-2">My Next App</h2>
          <p className="text-gray-600">
            Nền tảng quản lý tài liệu hiện đại, giúp bạn dễ dàng lưu trữ, tìm
            kiếm và chia sẻ thông tin.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Liên kết</h2>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="hover:underline">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline">
                Điều khoản dịch vụ
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">
                Chính sách bảo mật
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2">Kết nối với chúng tôi</h2>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-800"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} My Next App. All rights reserved.
      </div>
    </footer>
  );
}
