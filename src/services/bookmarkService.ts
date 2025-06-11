import {Bookmark, CreateBookmarkPayload, GetBookmarksResponse} from "../types/bookmark"

export async function createBookmarkService(
  payload: CreateBookmarkPayload,
  token: string
): Promise<any> {
  const response = await fetch("http://localhost:3000/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export async function getBookmarksService(
  token: string,
  page: number = 1,
  limit: number = 10
): Promise<GetBookmarksResponse> {
  const response = await fetch(
    `http://localhost:3000/bookmarks/myBookmark?limit=${limit}&page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

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

  const data: GetBookmarksResponse = await response.json();
  return data;
}

export async function deleteBookmarkService(
  bookmarkId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `http://localhost:3000/bookmarks/${bookmarkId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

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
}
