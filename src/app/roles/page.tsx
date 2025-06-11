"use client";

import { fetchRoles, deleteRole } from "@/services/roleService";
import { Role } from "@/types/role";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminGuard } from "../component/adminProtect";

export default function RolesPage() {
  useAdminGuard({ redirectTo: "/forbidden" });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadRoles = async () => {
      const data = await fetchRoles();
      setRoles(data);
      setLoading(false);
    };
    loadRoles();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa role này?");
    if (!confirmed) return;

    const success = await deleteRole(id);
    if (success) {
      setRoles((prev) => prev.filter((role) => role.id !== id));
    } else {
      alert("Xóa thất bại, vui lòng thử lại.");
    }
  };

  const handleCreate = () => {
    router.push("/roles/create");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Quản lý Role</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tạo Role mới
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-300">ID</th>
              <th className="p-3 border border-gray-300">Role Name</th>
              <th className="p-3 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  Không có role nào
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300">{role.id}</td>
                  <td className="p-3 border border-gray-300">
                    {role.roleName}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <button
                      className="text-red-600 hover:underline text-center"
                      onClick={() => handleDelete(role.id)}
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => router.push(`/roles/${role.id}/edit`)}
                      className="text-blue-600 hover:underline mr-4 ml-4 text-center"
                    >
                      Sửa
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
