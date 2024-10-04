import express from 'express';
import config from './config/config';
import UserRoute from './users/UserRoute';
import db from './config/db';
import cors from 'cors';
import PostRoute from './post/PostRoute';
import FeedbackRoute from './feedback/FeedbackRoute';
const app = express();
app.use(express.json());
app.use(cors());
db();
app.use('/api/users', UserRoute);
app.use('/api/posts', PostRoute);
app.use('/api/feedbacks', FeedbackRoute);
app.listen(config.port, () => {
  console.log(`Server running on port : ${config.port}`);
});
