import mongoose from 'mongoose';

export interface IFeedback extends Document {
  name: string;
  email: string;
  message: string;
  createdAt?: Date;
  status: string;
}
const feedbackSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    default: 'Đang chờ',
  },
});
export const Feedback = mongoose.model<IFeedback>('feedback', feedbackSchema);
