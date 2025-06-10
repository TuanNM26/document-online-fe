"use client";

import { deleteUser } from "@/services/userService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch users", err);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string): Promise<void> {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa user này?");
    if (!confirmed) return;

    const success = await deleteUser(id);
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
      <h1 className="text-3xl font-semibold mb-6">Quản lý User</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-300">ID</th>
              <th className="p-3 border border-gray-300">Email</th>
              <th className="p-3 border border-gray-300">Username</th>
              <th className="p-3 border border-gray-300">Role</th>
              <th className="p-3 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Không có user nào
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300">{user.id}</td>
                  <td className="p-3 border border-gray-300">{user.email}</td>
                  <td className="p-3 border border-gray-300">
                    {user.username}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {user.role.roleName}
                  </td>
                  <td className="p-3 border border-gray-300 space-x-3">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleUpdate(user.id)}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(user.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
