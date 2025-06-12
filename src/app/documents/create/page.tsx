"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createDocument } from "@/services/documentService";

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
      router.push("/documents");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo tài liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Tạo tài liệu mới
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tiêu đề
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 text-gray-900 rounded px-4 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Lĩnh vực
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 text-gray-900 rounded px-4 py-2"
              value={field}
              onChange={(e) => setField(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tệp tài liệu
            </label>
            <input
              type="file"
              className="w-full text-gray-900"
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              {loading ? "Đang tạo..." : "Tạo tài liệu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
