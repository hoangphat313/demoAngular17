import express from 'express';
import {
  deleteUser,
  getAllUsers,
  login,
  getUserDetail,
  register,
  searchUser,
  updateIsAdmin,
  updateUserDetail,
} from './UserController';
import { authenticate, checkIsAdmin } from '../middlewares/authenticate';

const UserRoute = express.Router();
//user routes
UserRoute.post('/register', register);
UserRoute.post('/login', login);
UserRoute.get('/getUserDetail', authenticate, getUserDetail);
UserRoute.put('/updateUserDetail', authenticate, updateUserDetail);
//admin routes
UserRoute.get('/getAllUsers', authenticate, checkIsAdmin, getAllUsers);
UserRoute.put('/updateIsAdmin', authenticate, checkIsAdmin, updateIsAdmin);
UserRoute.delete('/deleteUser',authenticate, checkIsAdmin, deleteUser)
UserRoute.get('/searchUser', authenticate, checkIsAdmin, searchUser);
export default UserRoute;
