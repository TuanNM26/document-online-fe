interface UploadPageResponse {
  message: string;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export async function uploadPage(
  documentId: string,
  file: File
): Promise<UploadPageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_URL}/pages/${documentId}/pages`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: "Lỗi không xác định từ server." }));
      throw new Error(errorData.message || "Upload thất bại");
    }
    const data: UploadPageResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi upload trang:", error);
    throw error;
  }
}
