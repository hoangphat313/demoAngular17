import { NextFunction, Request, Response } from 'express';
import UserSchema from './UserSchema';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import config from '../config/config';
import { AuthRequest } from '../middlewares/authenticate';

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }
  const user = await UserSchema.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserSchema({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });
    await newUser.save();
    res.status(200).json({
      status: true,
      message: 'User created',
      data: { _id: newUser._id, name: newUser.name },
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
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const me = async (req: Request, res: Response, next: NextFunction) => {
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
      },
    });
  }
  return res.status(500).json({ message: 'Something went wrong' });
};
export { register, login, me };
