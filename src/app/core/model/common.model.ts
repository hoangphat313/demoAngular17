export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  phoneNumber: string;
  avatarUrl: string;
  favourites: string[];
  cartData: ICart[];
}
export interface ICart {
  postId: Post;
  quantity: number;
}
export interface IOrderData {
  userId: string;
  items: IOrderItem[];
  amount: number;
  address: IOrderAddress;
  paymentMethod: string;
}
export interface IOrderItem {
  postId: Post;
  quantity: number;
}
export interface IOrderAddress {
  houseNumber: string;
  street: string;
  city: string;
}
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt?: Date;
  images: string[];
  featured: boolean;
  price: number;
}
export interface IFeedback {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: Date;
  status: string;
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
export interface IOrder {
  _id: string;
  userId: string;
  items: Array<Object>;
  amount: number;
  address: {};
  status: string;
  date: Date;
  paymentMethod: string;
}
