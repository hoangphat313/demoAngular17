import { NextFunction, Request, Response } from 'express';
import { IPost, Post } from './PostSchema';
import { ApiResponse } from './PostTypes';

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post: IPost = new Post(req.body);
    await post.save();
    const response: ApiResponse<IPost> = { success: true, data: post };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find();
    const response: ApiResponse<IPost[]> = { success: true, data: posts };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.query.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }
    const response: ApiResponse<IPost> = { success: true, data: post };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return res.status(404).json({ success: true, message: 'Post not found' });
    }
    const response: ApiResponse<IPost> = { success: true, data: post };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findByIdAndDelete(req.query.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }
    const response = {
      success: true,
      message: 'Delete post successfully',
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
};
const searchPost = async (req: Request, res: Response, next: NextFunction) => {
  const searchTerm = req.query.name;
  if (!searchTerm) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide search term' });
  }
  try {
    const filterPost = await Post.find({
      $or: [{ title: { $regex: searchTerm, $options: 'i' } }],
    });
    return res.status(200).json({ success: true, data: filterPost });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: 'Something went wrong' });
  }
};
const updateFeaturedPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId, featured } = req.body;
  if (!postId || typeof featured !== 'boolean') {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { featured },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Featured post updated successfully',
      data: {
        _id: postId,
        title: post.title,
        content: post.content,
        author: post.author,
        createdAt: post.createdAt,
        images: post.images,
        featured: post.featured,
      },
    });
  } catch (error) {
    return res.status(500).json('Server error: ' + error);
  }
};
export {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  searchPost,
  updateFeaturedPost,
};
