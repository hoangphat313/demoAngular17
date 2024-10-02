export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  phoneNumber: string;
  avatarUrl: string;
}
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt?: Date;
  images: string[];
  featured: boolean;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}
export interface ApiResponse<T> {
  status?: boolean;
  message?: string;
  error?: string;
  token?: string;
  data: T;
}
