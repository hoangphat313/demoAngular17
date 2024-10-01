import express from 'express';
import {
  getAllUsers,
  login,
  me,
  register,
  updateIsAdmin,
} from './UserController';
import { authenticate, checkIsAdmin } from '../middlewares/authenticate';

const UserRoute = express.Router();

UserRoute.post('/register', register);
UserRoute.post('/login', login);
UserRoute.get('/me', authenticate, me);
//admin routes
UserRoute.get('/getAllUsers', authenticate, checkIsAdmin, getAllUsers);
UserRoute.put('/updateIsAdmin', authenticate, checkIsAdmin, updateIsAdmin);

export default UserRoute;
