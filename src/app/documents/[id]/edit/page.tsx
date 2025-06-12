"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchDocumentById, updateDocument } from "@/services/documentService";
import { useAdminGuard } from "@/app/component/adminProtect";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [field, setField] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | undefined>();
  const [currentFileType, setCurrentFileType] = useState<string | undefined>();

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
        setDescription(data.description || "");
        setField(data.field || "");
        setCurrentFilePath(data.filePath);
        setCurrentFileType(data.fileType);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getDocument();
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("field", field);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (!token) throw new Error("Không tìm thấy token xác thực.");

      await updateDocument(id, formData, token);
      router.push(`/documents/${id}`);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi cập nhật tài liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Đang tải tài liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            href="/documents"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Quay lại danh sách tài liệu
          </Link>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy tài liệu
          </h2>
          <p className="text-gray-700 mb-6">
            Tài liệu với ID "{id}" không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href="/documents"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Quay lại danh sách tài liệu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/documents/${id}`}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            &larr; Quay lại chi tiết tài liệu
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Chỉnh sửa Tài liệu
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Tiêu đề:
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="field"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Lĩnh vực:
            </label>
            <input
              type="text"
              id="field"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="fileUpload"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Thay thế File (PDF/DOCX, v.v.):
            </label>
            <input
              type="file"
              id="fileUpload"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                File đã chọn: {selectedFile.name}
              </p>
            )}
            {currentFilePath && (
              <p className="mt-2 text-sm text-gray-600">
                File hiện tại:{" "}
                <a
                  href={currentFilePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {currentFilePath.split("/").pop()} ({currentFileType})
                </a>
              </p>
            )}
            {!currentFilePath && (
              <p className="mt-2 text-sm text-gray-600">
                Tài liệu này hiện chưa có file.
              </p>
            )}
          </div>
          {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}

          <div className="flex items-center justify-end gap-4">
            <Link
              href={`/documents/${id}`}
              className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu Thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
