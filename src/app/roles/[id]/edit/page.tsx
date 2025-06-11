"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Role } from "@/types/role";
import { fetchRoleById, updateRole } from "@/services/roleService";
import { useAdminGuard } from "@/app/component/adminProtect";

export default function EditRolePage() {
  useAdminGuard({ redirectTo: "/forbidden" });
  const { id } = useParams();
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      if (typeof id !== "string") return;

      const data = await fetchRoleById(id);
      if (data) {
        setRole(data);
        setRoleName(data.roleName);
        setDescription(data.description || "");
      }
      setLoading(false);
    };
    loadRole();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName) {
      alert("Tên role là bắt buộc");
      return;
    }

    const success = await updateRole(id as string, { roleName, description });

    if (success) {
      alert("Cập nhật thành công!");
      router.push("/roles");
    } else {
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

  if (!role) return <p className="p-6 text-red-500">Không tìm thấy role.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cập nhật Role</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tên Role</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium">Mô tả</label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}
