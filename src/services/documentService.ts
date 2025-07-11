import { Document, DocumentPage } from "../types/document";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
interface DocumentApiResponse {
  data: any[];
  currentPage: number;
  totalPages: number;
  totalItems?: number;
}
export async function fetchDocumentById(id: string): Promise<Document> {
  const res = await fetch(`${API_URL}/documents/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Không thể tải tài liệu.");
  }

  return res.json();
}

export async function updateDocument(
  id: string,
  formData: FormData,
  token: string
): Promise<void> {
  const res = await fetch(`${API_URL}/documents/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Cập nhật tài liệu thất bại.");
  }
}

export async function deleteDocument(
  id: string,
  token?: string
): Promise<void> {
  const res = await fetch(`${API_URL}/documents/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Xóa tài liệu thất bại.");
  }
}

export async function getDocumentDetail(id: string): Promise<Document> {
  const res = await fetch(`${API_URL}/documents/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch document ${id}: ${errorText || res.statusText}`
    );
  }

  const documentData: Document = await res.json();
  return documentData;
}

export async function getDocument(
  page: number = 1,
  limit: number = 10,
  query: string = ""
): Promise<DocumentApiResponse> {
  try {
    const response = await fetch(
      `${API_URL}/documents?q=${query}&page=${page}&limit=${limit}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể tải tài liệu từ API.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getDocumentPages(id: string): Promise<
  {
    _id: string;
    pageNumber: number;
    filePath: string;
    [key: string]: any;
  }[]
> {
  const res = await fetch(`${API_URL}/pages/document/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Không thể tải các trang tài liệu");

  const json = await res.json();
  return json.data || [];
}

export async function createDocument(
  formData: FormData,
  token: string
): Promise<void> {
  const res = await fetch(`${API_URL}/documents`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Không thể tạo tài liệu: ${errorText || res.statusText}`);
  }
}
