"use client";

import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/customHooks";
import { useRouter } from "next/navigation";

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
    <header className="w-full px-4 py-4 bg-gray-900 text-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a className="text-xl font-semibold">My Next App</a>
        {isLoggedIn && (
          <nav>
            <ul className="flex gap-4 text-sm items-center">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/documents" className="hover:underline">
                  Documents
                </a>
              </li>
              <li>
                <a href="/bookmarks" className="hover:underline">
                  Bookmarks
                </a>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <a href="/users" className="hover:underline">
                      Quản lý User
                    </a>
                  </li>
                  <li>
                    <a href="/roles" className="hover:underline">
                      Quản lý Role
                    </a>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
