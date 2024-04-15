import { Router } from "express";
import { check, validationResult } from 'express-validator';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
import User from '../../models/Users.js';
import Profile from '../../models/Profile.js';
import Post from '../../models/Post.js';
import authr from '../../middleware/authr.js';
const posts = Router();

//@route Post  api/post
//@desc Creat a post
//@access private
posts.post(
    '/',
    authr,
    check('text', 'Text is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const user = await User.findById(req.user.id).select('-password');
  
        const newPost = new Post({
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id
        });
  
        const post = await newPost.save();
  
        res.json(post);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  
// @route    GET api/posts
// @desc     Get all posts
// @access   Private
posts.get('/', authr, async (req, res) => {
    try {
      const posts = await Post.find().sort({ date: -1 });
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
posts.get('/:id', authr,  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
  
      res.json(post);
    } catch (err) {
      console.error(err.message);
      if (err.Kind ==='ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
  
      res.status(500).send('Server Error');
    }
  });

  // @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
posts.delete('/:id', authr, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
  
      // Check user
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      await post.deleteOne();
  
      res.json({ msg: 'Post removed' });
    } catch (err) {
      console.error(err.message);
  
      res.status(500).send('Server Error');
    }
  });
  // @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
posts.put('/like/:id', authr,  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length>0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
  
 // @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
posts.put('/unlike/:id', authr,  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length===0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    // Get remove index
    const removIndex =post.likes.map(like =>like.user.toString()).indexOf(req.user.id)
    post.likes.splice(removIndex,1);

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}); 

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
posts.post(
  '/comment/:id',
  authr,
  check('text', 'Text is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
posts.delete('/comment/:id/:comment_id', authr, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const removIndex =post.comments.map(comment =>comment.user.toString())
    .indexOf(req.user.id)
    post.comments.splice(removIndex,1);

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

export default posts;