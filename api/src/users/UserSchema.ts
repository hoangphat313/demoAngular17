import mongoose from 'mongoose';
import { IUser } from './UserTypes';
const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model<IUser>('User', UserSchema);
