export interface Bookmark {
  _id: string;
  note: string;
  pageId?: string;
  document: {
    _id: string;
    title: string;
    field: string;
    filePath: string;
    fileType: string;
    totalPages?: number;
  };
  user: {
    _id: string;
    username: string;
  };
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: string;
  pageSize: string;
}

export interface GetBookmarksResponse {
  data: Bookmark[];
  pagination: Pagination;
}

export interface CreateBookmarkPayload {
  documentId: string;
  pageId: string;
  note: string;
}
