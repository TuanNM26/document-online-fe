"use client";

import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/customHooks";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaFileAlt,
  FaBookmark,
  FaUsers,
  FaUserShield,
  FaSignOutAlt,
  FaBook,
} from "react-icons/fa";

export default function Header() {
  const currentUser = useCurrentUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  if (currentUser === undefined) {
    return (
      <header className="w-full px-4 py-4 bg-gray-900 text-white shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="animate-pulse w-32 h-6 bg-gray-700 rounded"></div>
        </div>
      </header>
    );
  }

  const isAdmin = currentUser?.role?.roleName === "admin";

  return (
    <header className="w-full px-4 py-4 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a
          href="/"
          className="text-2xl font-bold flex items-center gap-2 hover:text-blue-400 transition-colors"
        >
          <FaBook className="text-blue-400" />
          Tài liệu online 
        </a>

        {isLoggedIn && (
          <nav>
            <ul className="flex gap-5 text-sm items-center">
              <li>
                <a
                  href="/"
                  className="flex items-center gap-1 hover:text-blue-300 transition-colors"
                >
                  <FaHome /> Trang chính
                </a>
              </li>
              <li>
                <a
                  href="/documents"
                  className="flex items-center gap-1 hover:text-blue-300 transition-colors"
                >
                  <FaFileAlt /> Tài liệu
                </a>
              </li>
              <li>
                <a
                  href="/bookmarks"
                  className="flex items-center gap-1 hover:text-blue-300 transition-colors"
                >
                  <FaBookmark /> Dấu trang
                </a>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <a
                      href="/users"
                      className="flex items-center gap-1 hover:text-blue-300 transition-colors"
                    >
                      <FaUsers /> Quản lý User
                    </a>
                  </li>
                  <li>
                    <a
                      href="/roles"
                      className="flex items-center gap-1 hover:text-blue-300 transition-colors"
                    >
                      <FaUserShield /> Quản lý Role
                    </a>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white flex items-center gap-2 transition-colors"
                >
                  <FaSignOutAlt /> Đăng xuất
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
