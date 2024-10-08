import mongoose from 'mongoose';

export interface ICart {
  postId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}
