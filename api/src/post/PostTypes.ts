export interface PostType {
  title: string;
  content: string;
  author: string;
  images: string[];
}
export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  error?: string;
}
