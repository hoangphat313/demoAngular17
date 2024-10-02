import { NextFunction, Request, Response } from 'express';
import UserSchema from './UserSchema';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import config from '../config/config';
import { AuthRequest } from '../middlewares/authenticate';
import { ApiResponse } from '../post/PostTypes';
import { IUser } from './UserTypes';


const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, phoneNumber } = req.body;

  if (!name || !email || !password || phoneNumber === undefined) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }
  const phoneNumberStr = phoneNumber.toString();
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phoneNumberStr)) {
    return res
      .status(400)
      .json({ message: 'Phone number must be exactly 10 digits' });
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  const user = await UserSchema.findOne({
    $or: [{ email }, { phoneNumber: phoneNumberStr }],
  });
  if (user) {
    return res
      .status(400)
      .json({ message: 'Email or phone number already exists' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserSchema({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      phoneNumber: phoneNumberStr,
      avatarUrl: '',
    });
    await newUser.save();
    res.status(200).json({
      status: true,
      message: 'User created',
      data: {
        _id: newUser._id,
        name: newUser.name,
        phonNumber: newUser.phoneNumber,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide email and password' });
  }
  const user = await UserSchema.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Incorrect credentials' });
  }
  try {
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: '1d',
    });
    return res.status(200).json({
      status: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getUserDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _request = req as AuthRequest;
  const user = await UserSchema.findById(_request.userId);
  if (user) {
    return res.status(200).json({
      status: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
      },
    });
  }
  return res.status(500).json({ message: 'Something went wrong' });
};
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserSchema.find();
    const response: ApiResponse<IUser[]> = { success: true, data: users };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
const updateUserDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.query.userId;
    const { name, email, avatarUrl,phoneNumber } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const updateUser = await UserSchema.findByIdAndUpdate(
      userId,
      { name, email, avatarUrl,phoneNumber },
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      message: 'User updated successfully',
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateIsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, isAdmin } = req.body;
  if (!userId || typeof isAdmin !== 'boolean') {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const user = await UserSchema.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return res.status(500).json('Server error: ' + error);
  }
};
const searchUser = async (req: Request, res: Response, next: NextFunction) => {
  const searchTerm = req.query.name;
  if (!searchTerm) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide search term' });
  }
  try {
    const filterUser = await UserSchema.find({
      $or: [{ name: { $regex: searchTerm, $options: 'i' } }],
    });
    return res.status(200).json({ success: true, data: filterUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserSchema.findByIdAndDelete(req.query.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    const response = {
      success: true,
      message: 'User deleted successfully',
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};
export {
  register,
  login,
  getUserDetail,
  getAllUsers,
  updateIsAdmin,
  searchUser,
  updateUserDetail,
  deleteUser,
};
