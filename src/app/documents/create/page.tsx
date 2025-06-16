"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createDocument } from "@/services/documentService";
import {
  FaFileAlt,
  FaTags,
  FaUpload,
  FaSpinner,
  FaPlusCircle,
} from "react-icons/fa";
import { toast } from "sonner";

export default function CreateDocumentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [field, setField] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!title || !field || !file) {
        setError("Vui lòng điền đầy đủ thông tin và chọn file.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("field", field);
      formData.append("file", file);

      await createDocument(formData, token as string);
      toast.success("✅ Thành công!");
      router.push("/documents");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo tài liệu.");
      toast.error(`❌Vui lòng thử lại.\n${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaPlusCircle className="text-blue-600" /> Tạo tài liệu mới
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaFileAlt className="text-blue-500" />
              Tiêu đề
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 text-gray-900 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaTags className="text-green-500" />
              Lĩnh vực
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 text-gray-900 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={field}
              onChange={(e) => setField(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaUpload className="text-purple-500" />
              Tệp tài liệu
            </label>
            <input
              type="file"
              className="w-full text-gray-800"
              accept=".pdf,.doc,.docx,.txt,.md"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Đang tạo...
                </>
              ) : (
                <>
                  <FaPlusCircle /> Tạo tài liệu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
