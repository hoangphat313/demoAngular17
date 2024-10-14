import mongoose, { model } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: Array<{
    postId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }>;
  amount: number;
  address: {
    houseNumber: String;
    street: String;
    city: String;
  };
  status: String;
  date: Date;
  paymentMethod: String;
}
const OrderSchema = new mongoose.Schema<IOrder>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  items: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: {
    houseNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
  },
  status: { type: String, default: 'Đang chờ xử lý' },
  date: { type: Date, default: Date.now() },
  paymentMethod: { type: String, default: 'Tiền mặt' },
});
export const Order = model<IOrder>('Order', OrderSchema);
