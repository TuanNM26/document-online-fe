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

export async function updatePageFileService(
  documentId: string,
  pageId: string,
  file: File,
  token: string
): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_URL}/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to update page file: ${response.statusText}`
    );
  }
  return response.json();
}

export async function deletePageService(
  pageId: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/pages/${pageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Lỗi khi xóa trang.");
  }
}

// services/bookmarkService.ts (hoặc file tương ứng)

interface CreateBookmarkPayload {
  documentId: string;
  pageId: string;
  note: string;
}

export async function createBookmarkService(
  payload: CreateBookmarkPayload,
  token: string
): Promise<any> {
  const response = await fetch(`${API_URL}/bookmarks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse error response as JSON:", jsonError);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    throw new Error(
      errorData.message ||
        `API error: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}
