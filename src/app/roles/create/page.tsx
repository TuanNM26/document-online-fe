"use client";

import { useState } from "react";
import { createRole } from "@/services/roleService";
import { useRouter } from "next/navigation";
import { useAdminGuard } from "@/app/component/adminProtect";
import { FaUserShield, FaAlignLeft, FaSave } from "react-icons/fa";

export default function CreateRolePage() {
  useAdminGuard({ redirectTo: "/forbidden" });
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await createRole({ roleName, description }, token!);

    setLoading(false);
    if (success) {
      alert("Tạo role thành công!");
      router.push("/roles");
    } else {
      alert("Tạo role thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2 text-blue-700">
        <FaUserShield /> Tạo Role mới
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1 text-gray-700 flex items-center gap-2">
            <FaUserShield /> Tên Role
          </label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-700 flex items-center gap-2">
            <FaAlignLeft /> Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
        >
          {loading ? (
            "Đang tạo..."
          ) : (
            <>
              <FaSave /> Tạo Role
            </>
          )}
        </button>
      </form>
    </div>
  );
}
