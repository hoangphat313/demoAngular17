import express from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  searchPost,
  updateFeaturedPost,
  updatePost,
} from './PostController';
import { authenticate, checkIsAdmin } from '../middlewares/authenticate';
const PostRoute = express.Router();

//user routes
PostRoute.get('/getPost', authenticate, getPostById);
PostRoute.get('/getAllPosts', authenticate, getAllPosts);
PostRoute.get('/search', authenticate, searchPost);

//admin routes
PostRoute.post('/create', authenticate, checkIsAdmin, createPost);
PostRoute.put('/updatePost', authenticate, checkIsAdmin, updatePost);
PostRoute.delete('/deletePost', authenticate, checkIsAdmin, deletePost);
PostRoute.put('/featured', authenticate, checkIsAdmin, updateFeaturedPost);

export default PostRoute;
