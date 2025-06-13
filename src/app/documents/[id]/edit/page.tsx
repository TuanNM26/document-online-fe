"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchDocumentById, updateDocument } from "@/services/documentService";
import { useAdminGuard } from "@/app/component/adminProtect";
import {
  FaFileAlt,
  FaTags,
  FaUpload,
  FaSave,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { toast } from "sonner";

interface Document {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  field?: string;
  filePath?: string;
  fileType?: string;
}

export default function EditDocumentPage() {
  useAdminGuard({ redirectTo: "/forbidden" });

  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState("");
  const [field, setField] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | undefined>();
  const [currentFileType, setCurrentFileType] = useState<string | undefined>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
  }, []);

  useEffect(() => {
    const getDocument = async () => {
      try {
        const data = await fetchDocumentById(id);
        setDocument(data);
        setTitle(data.title);
        setField(data.field || "");
        setCurrentFilePath(data.filePath);
        setCurrentFileType(data.fileType);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) getDocument();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("field", field);
      if (selectedFile) formData.append("file", selectedFile);
      if (!token) throw new Error("Không tìm thấy token xác thực.");

      await updateDocument(id, formData, token);
      toast.success("✅ Thành công!");
      router.push(`/documents/${id}`);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi cập nhật tài liệu.");
      toast.error(`❌ Vui lòng thử lại.\n${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600 animate-pulse">
          Đang tải tài liệu...
        </p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-3">Lỗi</h2>
          <p className="text-gray-700 mb-4">
            {error || `Tài liệu với ID "${id}" không tồn tại.`}
          </p>
          <Link
            href="/documents"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/documents/${id}`}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaArrowLeft className="mr-2" /> Quay lại chi tiết
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Chỉnh sửa Tài liệu
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
              <FaFileAlt className="text-blue-500" /> Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
              <FaTags className="text-green-500" /> Lĩnh vực
            </label>
            <input
              type="text"
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
              <FaUpload className="text-purple-500" /> Thay file
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={(e) =>
                e.target.files?.[0] && setSelectedFile(e.target.files[0])
              }
              className="block w-full text-sm border border-gray-300 rounded bg-gray-50 px-3 py-2"
            />
            {selectedFile && (
              <p className="text-sm mt-1 text-gray-600">
                📎 File mới: {selectedFile.name}
              </p>
            )}
            {currentFilePath && (
              <p className="text-sm mt-1 text-gray-600">
                📂 Hiện tại:{" "}
                <a
                  href={currentFilePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {currentFilePath.split("/").pop()} ({currentFileType})
                </a>
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-3">
            <Link
              href={`/documents/${id}`}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <FaSave /> Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
