"use client";

import { fetchRoles, deleteRole } from "@/services/roleService";
import { Role } from "@/types/role";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminGuard } from "../component/adminProtect";
import { Trash2, Pencil, Plus } from "lucide-react";

export default function RolesPage() {
  useAdminGuard({ redirectTo: "/forbidden" });

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const loadRoles = async () => {
      const data = await fetchRoles(token!);
      setRoles(data);
      setLoading(false);
    };
    loadRoles();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa role này?");
    if (!confirmed) return;

    const success = await deleteRole(id, token!);
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
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Role</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Tạo Role mới
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border border-gray-300 text-left">ID</th>
                <th className="p-3 border border-gray-300 text-left">
                  Tên Role
                </th>
                <th className="p-3 border border-gray-300 text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    Không có role nào
                  </td>
                </tr>
              ) : (
                roles.map((role, index) => (
                  <tr
                    key={role.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="p-3 border border-gray-300 text-sm">
                      {role.id}
                    </td>
                    <td className="p-3 border border-gray-300 text-sm">
                      {role.roleName}
                    </td>
                    <td className="p-3 border border-gray-300 text-center space-x-2">
                      <button
                        onClick={() => router.push(`/roles/${role.id}/edit`)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        <Pencil size={16} />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
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
