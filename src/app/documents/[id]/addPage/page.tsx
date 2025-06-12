"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPage } from "@/services/pageService";
import { useAdminGuard } from "@/app/component/adminProtect";

export default function AddPage({ params }: { params: { id: string } }) {
  useAdminGuard({ redirectTo: "/forbidden" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await uploadPage(params.id, selectedFile);

      alert("Tải lên thành công!");
      router.push(`/documents/${params.id}`);
    } catch (err) {
      alert(`Không thể upload file. Vui lòng thử lại.${err}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Thêm Trang Tài Liệu
        </h1>
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Chọn tệp tin:
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
            <p className="text-sm mt-2 text-gray-600">
              Đã chọn: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push(`/documents/${params.id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white
                       hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                       ${
                         selectedFile
                           ? "bg-blue-600 hover:bg-blue-700"
                           : "bg-blue-400 cursor-not-allowed"
                       }
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            Tải lên
          </button>
        </div>
      </div>
    </div>
  );
}
