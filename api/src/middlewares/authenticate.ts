import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../config/config';

export interface AuthRequest extends Request {
  userId: string;
}
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
export default authenticate;
