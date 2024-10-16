import express from 'express';
import config from './config/config';
import UserRoute from './users/UserRoute';
import db from './config/db';
import cors from 'cors';
import PostRoute from './post/PostRoute';
import FeedbackRoute from './feedback/FeedbackRoute';
import CartRoute from './cart/CartRoute';
import OrderRouter from './order/OrderRoute';
import MailRouter from './email/MailRoute';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
db();

app.use('/api/users', UserRoute);
app.use('/api/posts', PostRoute);
app.use('/api/feedbacks', FeedbackRoute);
app.use('/api/carts', CartRoute);
app.use('/api/orders', OrderRouter);
app.use('/api/email', MailRouter);
app.listen(config.port, () => {
  console.log(`Server running on port : ${config.port}`);
});
