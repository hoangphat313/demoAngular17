import { NextFunction, Request, Response } from 'express';
import { IOrder, Order } from './OrderSchema';
import { ApiResponse } from '../post/PostTypes';
import { sendEmailConfirmOrder } from '../email/MailController';

const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, items, amount, address, paymentMethod } = req.body;
  try {
    const newOrder = new Order({
      userId,
      items,
      amount,
      address,
      paymentMethod,
    });
    await newOrder.save();
    res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error, success: false });
  }
};

const getAllOrdersForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.query;
  try {
    const orders = await Order.find({ userId });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};
const updateDetailOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, address } = req.body;
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid order ID' });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (address && address.street) {
      order.address.street = address.street;
    }
    if (address && address.city) {
      order.address.city = address.city;
    }
    if (address && address.houseNumber) {
      order.address.houseNumber = address.houseNumber;
    }
    const updatedOrder = await order.save();
    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

const getAllOrdersForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};
const updateStatusOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId, status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const response: ApiResponse<IOrder> = {
      success: true,
      data: updatedOrder,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

const hideOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.query.orderId;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { isDeleted: true },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const response = {
      success: true,
      message: 'Order masked as deleted',
      data: order,
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

const searchOrder = async (req: Request, res: Response, next: NextFunction) => {
  const searchTerm = req.query.name;
  if (!searchTerm) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide search term' });
  }
  try {
    const filterOrder = await Order.find({
      $or: [
        { paymentMethod: { $regex: searchTerm, $options: 'i' } },
        { 'address.houseNumber': { $regex: searchTerm, $options: 'i' } },
        { 'address.city': { $regex: searchTerm, $options: 'i' } },
        { 'address.street': { $regex: searchTerm, $options: 'i' } },
      ],
    });
    return res.status(200).json({ success: true, data: filterOrder });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};
export {
  placeOrder,
  getAllOrdersForUser,
  updateStatusOrder,
  getAllOrdersForAdmin,
  updateDetailOrder,
  hideOrder,
  searchOrder,
};
