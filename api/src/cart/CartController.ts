import { NextFunction, Request, Response } from 'express';
import UserSchema from '../users/UserSchema';
import { ICart } from './CartTypes';

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, postId, quantity } = req.body;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const existingItem = user.cartData.find(
      (item: ICart) => item.postId.toString() === postId
    );
    if (existingItem) {
      existingItem.quantity = Number(existingItem.quantity) + quantity;
    } else {
      user.cartData.push({
        postId,
        quantity,
      });
    }
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Post added to cart successfully',
      cartData: user.cartData,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const deleteItemInCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, postId } = req.body;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const cartItemIndex = user.cartData.findIndex(
      (item: ICart) => item.postId.toString() === postId
    );
    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    user.cartData.splice(cartItemIndex, 1);
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Cart item deleted successfully',
      cartData: user.cartData,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, postId } = req.body;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const cartItem = user.cartData.find(
      (item: ICart) => item.postId.toString() === postId
    );
    if (!cartItem) {
      return res.status(404).json({ message: 'Post not found in cart' });
    }
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    } else {
      user.cartData = user.cartData.filter(
        (item: ICart) => item.postId.toString() !== postId
      );
    }
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Post removed from cart successfully',
      cartData: user.cartData,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.query;
  try {
    const user = await UserSchema.findById(userId).populate('cartData.postId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Cart data fetched successfully',
      cartData: user.cartData,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const updateCart = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, postId, quantity } = req.body;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const cartItem = user.cartData.find(
      (item: ICart) => item.postId.toString() === postId
    );
    if (!cartItem) {
      return res.status(404).json({ message: 'Post not found in cart' });
    }
    cartItem.quantity = Number(quantity);
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cartData: user.cartData,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.cartData = [];
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cartData: user.cartData,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
export {
  addToCart,
  removeFromCart,
  getCart,
  updateCart,
  deleteItemInCart,
  clearCart,
};
