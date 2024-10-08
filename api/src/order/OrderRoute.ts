import express, { Router } from 'express';
import { authenticate, checkIsAdmin } from '../middlewares/authenticate';
import {
  deleteOrder,
  getAllOrdersForAdmin,
  getAllOrdersForUser,
  placeOrder,
  searchOrder,
  updateDetailOrder,
  updateStatusOrder,
} from './OrderController';

const OrderRouter = express.Router();

//user routes
OrderRouter.post('/place', authenticate, placeOrder);
OrderRouter.get('/getAllOrdersForUser', authenticate, getAllOrdersForUser);
OrderRouter.put('/update', authenticate, updateDetailOrder);
//admin && user
OrderRouter.delete('/delete', authenticate, deleteOrder);
//admin routes
OrderRouter.get(
  '/getAllOrdersForAdmin',
  authenticate,
  checkIsAdmin,
  getAllOrdersForAdmin
);
OrderRouter.put('/updateStatus', authenticate, checkIsAdmin, updateStatusOrder);
OrderRouter.get('/search', authenticate, checkIsAdmin, searchOrder);

export default OrderRouter;
