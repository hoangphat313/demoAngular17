import express from 'express';
import { authenticate } from '../middlewares/authenticate';
import {
  addToCart,
  clearCart,
  deleteItemInCart,
  getCart,
  removeFromCart,
  updateCart,
} from './CartController';

const CartRoute = express.Router();

CartRoute.post('/add', authenticate, addToCart);
CartRoute.delete('/remove', authenticate, removeFromCart);
CartRoute.get('/get', authenticate, getCart);
CartRoute.put('/update', authenticate, updateCart);
CartRoute.delete('/delete', authenticate, deleteItemInCart);
CartRoute.delete('/clear', authenticate, clearCart);
export default CartRoute;
