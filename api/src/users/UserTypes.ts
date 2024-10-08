import mongoose from 'mongoose';
import { ICart } from '../cart/CartTypes';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  phoneNumber: string;
  avatarUrl: string;
  favourites: mongoose.Schema.Types.ObjectId[];
  cartData: ICart[];
}
