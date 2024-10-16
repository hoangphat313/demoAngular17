import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../config/config';
import UserSchema from '../users/UserSchema';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId: string;
}
const jwtSecret = config.jwtSecret;
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const parsedText = token.split(' ')[1]; // lay phan sau 'bearer __'
    const decoded = verify(parsedText, config.jwtSecret as string);
    const _request = req as AuthRequest;
    _request.userId = decoded.sub as string;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
const checkIsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _req = req as AuthRequest;
  try {
    const user = await UserSchema.findById(_req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export { authenticate, checkIsAdmin };
