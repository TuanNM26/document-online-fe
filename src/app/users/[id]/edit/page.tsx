"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchUserById, updateUser } from "@/services/userService";
import type { User } from "@/types/user";
import { fetchRoles } from "@/services/roleService";
import { useAdminGuard } from "@/app/component/adminProtect";

export default function EditUserPage() {
  useAdminGuard({ redirectTo: "/forbidden" });
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [roleName, setName] = useState("");
  const [roles, setRoles] = useState<{ id: string; roleName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;
      const data = await fetchUserById(userId, token!);
      if (data) {
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
        setRole(data.role?.id || "");
        setName(data.role.roleName || "");
      }
      try {
        const roleList = await fetchRoles(token!);
        setRoles(roleList);
      } catch (error) {
      }
      setLoading(false);
    };
    loadUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const success = await updateUser(userId, token!, { username, email, role });

    if (success) {
      router.push("/users");
    } else {
      alert("Cập nhật thất bại, vui lòng thử lại.");
    }

    setSaving(false);
  };

  if (loading) return <p>Đang tải dữ liệu người dùng...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Cập nhật người dùng</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Chọn vai trò --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}
