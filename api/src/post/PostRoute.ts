import express from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from './PostController';
const PostRoute = express.Router();

PostRoute.post('/create', createPost);
PostRoute.get('/getAllPosts', getAllPosts);
PostRoute.get('/getPost', getPostById);
PostRoute.put('/updatePost', updatePost);
PostRoute.delete('/deletePost', deletePost);
export default PostRoute;
