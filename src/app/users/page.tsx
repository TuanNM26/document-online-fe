"use client";

import { deleteUser, fetchUsers } from "@/services/userService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminGuard } from "../component/adminProtect";
import { Pencil, Trash2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  username: string;
  role: {
    id: string;
    roleName: string;
  };
}

export default function UsersPage() {
  useAdminGuard({ redirectTo: "/forbidden" });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const getUsers = async () => {
      if (!token) return;
      try {
        const userList = await fetchUsers(token);
        setUsers(userList);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa user này?");
    if (!confirmed) return;

    const success = await deleteUser(id, token!);
    if (success) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } else {
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  }

  const handleUpdate = (id: string) => {
    router.push(`/users/${id}/edit`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản lý User</h1>
      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border border-gray-300">ID</th>
                <th className="p-3 border border-gray-300">Email</th>
                <th className="p-3 border border-gray-300">Username</th>
                <th className="p-3 border border-gray-300">Role</th>
                <th className="p-3 border border-gray-300 text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    Không có user nào
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="p-3 border border-gray-300 text-sm">
                      {user.id}
                    </td>
                    <td className="p-3 border border-gray-300 text-sm">
                      {user.email}
                    </td>
                    <td className="p-3 border border-gray-300 text-sm">
                      {user.username}
                    </td>
                    <td className="p-3 border border-gray-300 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role.roleName === "admin"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role.roleName}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-300 text-center space-x-2">
                      <button
                        onClick={() => handleUpdate(user.id)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        <Pencil size={16} />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
