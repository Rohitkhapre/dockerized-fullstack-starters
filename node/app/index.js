const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

const posts = [
  { id: 1, title: 'Getting Started with Docker', content: 'Docker is a containerization platform...', userId: 1 },
  { id: 2, title: 'Node.js Best Practices', content: 'Here are some best practices for Node.js...', userId: 2 },
  { id: 3, title: 'Express.js Security', content: 'Security is crucial in web applications...', userId: 1 }
];

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'express-docker-app',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express Docker App!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      posts: '/api/posts',
      docs: '/api/docs'
    },
    timestamp: new Date().toISOString()
  });
});

// API Documentation
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Express Docker App API',
    version: '1.0.0',
    description: 'A sample Express.js API running in Docker',
    endpoints: [
      {
        path: '/',
        method: 'GET',
        description: 'Root endpoint with app information'
      },
      {
        path: '/health',
        method: 'GET',
        description: 'Health check endpoint'
      },
      {
        path: '/api/users',
        method: 'GET',
        description: 'Get all users'
      },
      {
        path: '/api/users/:id',
        method: 'GET',
        description: 'Get user by ID'
      },
      {
        path: '/api/posts',
        method: 'GET',
        description: 'Get all posts'
      },
      {
        path: '/api/posts/:id',
        method: 'GET',
        description: 'Get post by ID'
      }
    ]
  });
});

// Users API
app.get('/api/users', (req, res) => {
  const { role, limit } = req.query;
  let filteredUsers = users;

  if (role) {
    filteredUsers = users.filter(user => user.role === role);
  }

  if (limit) {
    filteredUsers = filteredUsers.slice(0, parseInt(limit));
  }

  res.json({
    success: true,
    count: filteredUsers.length,
    data: filteredUsers
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// Posts API
app.get('/api/posts', (req, res) => {
  const { userId, limit } = req.query;
  let filteredPosts = posts;

  if (userId) {
    filteredPosts = posts.filter(post => post.userId === parseInt(userId));
  }

  if (limit) {
    filteredPosts = filteredPosts.slice(0, parseInt(limit));
  }

  // Include user information
  const postsWithUsers = filteredPosts.map(post => ({
    ...post,
    author: users.find(user => user.id === post.userId)
  }));

  res.json({
    success: true,
    count: postsWithUsers.length,
    data: postsWithUsers
  });
});

app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === parseInt(id));

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  const postWithUser = {
    ...post,
    author: users.find(user => user.id === post.userId)
  };

  res.json({
    success: true,
    data: postWithUser
  });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: users.length,
      totalPosts: posts.length,
      usersByRole: {
        admin: users.filter(u => u.role === 'admin').length,
        user: users.filter(u => u.role === 'user').length
      },
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: ['/', '/health', '/api/users', '/api/posts', '/api/docs', '/api/stats']
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app; 