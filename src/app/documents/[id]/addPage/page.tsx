"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPage } from "@/services/pageService";
import { useAdminGuard } from "@/app/component/adminProtect";
import {
  FaFileUpload,
  FaCheckCircle,
  FaTimes,
  FaFileAlt,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "sonner";

export default function AddPage({ params }: { params: { id: string } }) {
  useAdminGuard({ redirectTo: "/forbidden" });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      await uploadPage(params.id, selectedFile);
      toast.success("✅ Tải lên thành công!");
      router.push(`/documents/${params.id}`);
    } catch (err) {
      toast.error(`❌ Không thể upload file. Vui lòng thử lại.\n${err}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaFileUpload className="text-blue-600" />
          Thêm Trang Tài Liệu
        </h1>

        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <span className="flex items-center gap-1">
              <FaFileAlt className="text-gray-600" />
              Chọn tệp tin:
            </span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.txt"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2.5
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {selectedFile && (
            <p className="text-sm mt-2 text-gray-600 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>
                Đã chọn: <strong>{selectedFile.name}</strong>
              </span>
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push(`/documents/${params.id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white
                       hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 flex items-center gap-2"
          >
            <FaTimes /> Hủy
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white flex items-center gap-2
                       ${
                         selectedFile && !isUploading
                           ? "bg-blue-600 hover:bg-blue-700"
                           : "bg-blue-400 cursor-not-allowed"
                       }
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isUploading ? (
              <>
                <FaSpinner className="animate-spin" /> Đang tải...
              </>
            ) : (
              <>
                <FaFileUpload /> Tải lên
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
