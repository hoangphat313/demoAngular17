import { NextFunction, Request, Response } from 'express';
import { Feedback, IFeedback } from './FeedbackSchema';
import { ApiResponse } from '../post/PostTypes';

const addFeedback = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, message } = req.body;
  try {
    const feedback = new Feedback({
      email: email,
      name: name,
      message: message,
    });
    await feedback.save();
    return res
      .status(201)
      .json({ message: 'Feedback added successfully', feedback });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const getFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedbackList = await Feedback.find();
    const response: ApiResponse<IFeedback[]> = {
      success: true,
      data: feedbackList,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const updateFeedbackStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { feedbackId } = req.query;
  const { status } = req.body;
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true }
    );
    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    const response: ApiResponse<IFeedback> = {
      success: true,
      data: updatedFeedback,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const deleteFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.query.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    const response = {
      success: true,
      message: 'Feedback deleted successfully',
    };
    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const searchFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const searchTerm = req.query.name;
  if (!searchTerm) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide search term' });
  }
  try {
    const filterFb = await Feedback.find({
      $or: [{ name: { $regex: searchTerm, $options: 'i' } }],
    });
    return res.status(200).json({ success: true, data: filterFb });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
export {
  deleteFeedback,
  searchFeedback,
  addFeedback,
  getFeedback,
  updateFeedbackStatus,
};
