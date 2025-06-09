export interface Document {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  filePath?: string;
  fileType?: string;
  userId: string;
  field: string;
  totalPages?: number;
  username?: string;
}
