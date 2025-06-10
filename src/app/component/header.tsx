"use client";

import React from "react";
import { useCurrentUser } from "@/hooks/customHooks";

export default function Header() {
  const currentUser = useCurrentUser();

  if (currentUser === undefined || currentUser === null) {
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
        <nav>
          <ul className="flex gap-4 text-sm">
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
