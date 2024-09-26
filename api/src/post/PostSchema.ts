import mongoose, { Document, model } from 'mongoose';

export interface IPost extends Document {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt?: Date;
  images: string[];
}
const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const Post = model<IPost>('Post', PostSchema);
