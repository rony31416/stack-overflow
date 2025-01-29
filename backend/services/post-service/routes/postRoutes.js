const express = require('express');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const minioClient = require('../config/minioClient');
const crypto = require('crypto');
const router = express.Router();

const languageExtensions = {
  JavaScript: 'js',
  Python: 'py',
  Java: 'java',
  Cpp: 'cpp',
  Ruby: 'rb',
};

// Check if the 'posts' bucket exists and create it if not
const ensureBucketExists = async () => {
  try {
    const exists = await minioClient.bucketExists('posts');
    if (!exists) {
      await minioClient.makeBucket('posts', 'us-east-1'); // Change the region if necessary
      console.log("Bucket 'posts' created successfully");
    }
  } catch (err) {
    console.error('Error checking or creating bucket:', err);
    throw new Error('Error creating or verifying bucket');
  }
};

const authenticate = (req, res, next) => {
  // const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header
  const token = req.cookies?.token;
  console.log(token)
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' }); // Return error if token is invalid
  }
};

router.post('/', authenticate, async (req, res) => {
  const { content, codeSnippet, language } = req.body;
  const userId = req.user.id;

  try {
    // Store in MinIO
    await ensureBucketExists();
    
    const extension = languageExtensions[language] || 'txt';
    const snippetName = `code_snippet_${crypto.randomUUID()}.${extension}`;

    await minioClient.putObject('posts', snippetName, codeSnippet);

    // Create new post
    const newPost = new Post({
      content,
      user: userId,
      snippetLink: snippetName,
      language,
    });

    console.log(newPost)

    await newPost.save();

    
    // const creator = await User.findById(userId);
    // const creatorUsername = creator ? creator.username : 'Someone';

    // console.log("Hello", creator)

    
    // const users = await User.find({ _id: { $ne: userId } });

    // console.log("Hi", users)

    // // Create notifications for each user except the creator
    // const notifications = users.map(user => ({
    //   userId: user._id,
    //   postId: newPost._id,
    //   message: `${creatorUsername}'s new post about ${content}`,
    //   isRead: false,
    // }));

    // // Insert all notifications at once
    // await Notification.insertMany(notifications);

    // console.log('New post and notifications created successfully');

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
});


//fetching all posts
router.get('/', async (req, res) => {
  console.log("GET /posts called");
  try {
    const posts = await Post.find(); // Fetch all posts from the database

  
    const detailedPosts = await Promise.all(posts.map(async (post) => {
    const snippetStream = await minioClient.getObject('posts', post.snippetLink);
      let codeSnippet = '';

      snippetStream.on('data', (chunk) => {
        codeSnippet += chunk.toString();
      });

      return new Promise((resolve, reject) => {
        snippetStream.on('end', () => {
          resolve({
            content: post.content,
            codeSnippet,
            createdAt: post.createdAt,
            language : post.language,
            user: post.user,
            _id: post._id,
          });
        });

        snippetStream.on('error', (err) => {
          reject(err); 
        });
      });
    }));

    res.json(detailedPosts); // Return all posts with their snippets
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving posts', error: err.message });
  }
});

// Route for fetching a specific post by ID
router.get('/:id', async (req, res) => {
  console.log("GET /posts/:id called");
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Retrieve the code snippet from MinIO using the snippetLink
    const snippetStream = await minioClient.getObject('posts', post.snippetLink);
    let codeSnippet = '';

    // Collect the snippet data from the stream
    snippetStream.on('data', (chunk) => {
      codeSnippet += chunk.toString();
    });

    snippetStream.on('end', () => {
      res.json({
        content: post.content,
        codeSnippet,
        createdAt: post.createdAt,
        language: post.language,
        user: post.user,
        _id: post._id,
      });
    });

    snippetStream.on('error', (err) => {
      res.status(500).json({ message: 'Error retrieving code snippet', error: err.message });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving post', error: err.message });
  }
});

module.exports = router;
