import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import Social from '../models/social.js';
import User from '../models/auth.js';

export const getSocialPosts = async (req, res) => {
  try {
    const posts = [];
    const allPosts = await Social.find().sort({ postedOn: -1 })
    allPosts.forEach(post => {
      posts.push(post)
    })
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const upload = multer({ storage: multer.memoryStorage() }).array('media');

export const createSocialPost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: "Upload Error" });
    try {
      const { name, content } = req.body;
      const userId = req.userId;
      if (!userId || !name) {
        return res.status(400).json({ message: 'Missing User Details' });
      }
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User Not Found" });
      const friendCount = user.friends.length;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const postCount = await Social.countDocuments({
        userId,
        postedOn: { $gte: today },
      });
      console.log(postCount);
      console.log(friendCount);
      if (friendCount === 0) {
        return res.status(403).json({ message: "You need friends to post." });
      } else if (friendCount < 2 && postCount >= 1) {
        return res.status(403).json({ message: "Limit: Only 1 Post/Day." });
      } else if (friendCount < 10 && postCount >= 2) {
        return res.status(403).json({ message: "Limit: Only 2 Posts/Day." });
      }

      // Save files after check
      const media = [];
      for (const file of req.files) {
        const filename = Date.now() + '-' + file.originalname;
        const filepath = path.join('uploads', filename);
        await fs.writeFile(filepath, file.buffer);
        media.push({
          url: `/uploads/${filename}`,
          type: file.mimetype.startsWith('video') ? 'video' : 'image',
        });
      }
      const newPost = await Social.create({
        userId,
        name,
        content,
        media,
      });
      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

export const likePost = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.userId;
  try {
    const post = await Social.findById(postId);
    if (!post) return res.status(404).json({ message: "Post Not Found" });
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sharePost = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.userId;
  try {
    const post = await Social.findById(postId);
    if (!post) return res.status(404).json({ message: "Post Not Found" });
    if(!post.sharedBy.includes(userId)) post.sharedBy.push(userId);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const addComment = async (req, res) => {
  const { id: postId } = req.params;
  const { content, name } = req.body;
  const userId = req.userId;
  try {
    const post = await Social.findById(postId);
    if (!post) return res.status(404).json({ message: "Post Not Found" });
    post.comments.push({
      userId,
      name,
      content
    });
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const deletePost = async (req, res) => {
  const { id: postId } = req.params;
  try {
    const post = await Social.findByIdAndDelete(postId);
    if (!post) return res.status(404).json({ message: "Post Not Found" });
    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
