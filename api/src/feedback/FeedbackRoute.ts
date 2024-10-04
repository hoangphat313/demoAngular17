import express from 'express';
import {
  addFeedback,
  deleteFeedback,
  getFeedback,
  searchFeedback,
  updateFeedbackStatus,
} from './FeedbackController';
import { authenticate, checkIsAdmin } from '../middlewares/authenticate';

const FeedbackRoute = express.Router();

//user routes
FeedbackRoute.post('/add', authenticate, addFeedback);
//admin routes
FeedbackRoute.get('/get', authenticate, checkIsAdmin, getFeedback);
FeedbackRoute.put('/update', authenticate, checkIsAdmin, updateFeedbackStatus);
FeedbackRoute.delete('/delete', authenticate, checkIsAdmin, deleteFeedback);
FeedbackRoute.get('/search', authenticate, checkIsAdmin, searchFeedback);

export default FeedbackRoute;
