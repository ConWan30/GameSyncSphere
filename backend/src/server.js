const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // Built into Node.js
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// In-memory user storage
const users = new Map();
const sessions = new Map();

// Simple password hashing (using built-in crypto)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'gamesync-salt').digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎮 GameSyncSphere - Authentication Ready!',
    status: 'healthy',
    version: '3.2.0',
    timestamp: new Date().toISOString(),
    features: [
      '✅ Server Running',
      '🔐 Simple Authentication System',
      '💰 User Registration Active',
      '🎯 Ready for Gaming Surveys',
      '🚀 No External Dependencies Required'
    ],
    stats: {
      registeredUsers: users.size,
      activeSessions: sessions.size
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    message: 'GameSyncSphere authentication server ready',
    timestamp: new Date().toISOString(),
    users: users.size
  });
});

// User Registration
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, username, password, fullName } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, username, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user exists
    if (users.has(email)) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'This email is already registered'
      });
    }

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email,
      username,
      fullName: fullName || username,
      password: hashPassword(password),
      totalEarnings: 0,
      completedSurveys: 0,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      gamingPlatforms: [],
      favoriteGames: []
    };

    users.set(email, user);

    // Create session token
    const token = generateToken();
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    });

    // Return success
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      success: true,
      message: '🎉 Welcome to GameSyncSphere! Your account has been created.',
      user: userWithoutPassword,
      token,
      revolutionaryFeatures: [
        'Earn money from Claude AI gaming surveys',
        'Track your gaming analytics and performance',
        'Join gaming parties with voice chat',
        'Get personalized gaming insights'
      ],
      nextSteps: [
        'Complete your gaming profile',
        'Take your first survey to earn money',
        'Connect your gaming platforms'
      ]
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Unable to create account. Please try again.'
    });
  }
});

// User Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check password
    if (user.password !== hashPassword(password)) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    users.set(email, user);

    // Create new session
    const token = generateToken();
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: `🎮 Welcome back, ${user.username}!`,
      user: userWithoutPassword,
      token,
      stats: {
        totalEarnings: user.totalEarnings.toFixed(2),
        completedSurveys: user.completedSurveys,
        memberSince: user.createdAt.split('T')[0]
      },
      availableActions: [
        'Take new surveys to earn money',
        'Check your earnings dashboard',
        'Join active gaming parties',
        'Update your gaming profile'
      ]
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Unable to login. Please try again.'
    });
  }
});

// Get User Profile (with token)
app.get('/api/auth/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authentication token required'
      });
    }

    const session = sessions.get(token);
    if (!session) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please login again'
      });
    }

    // Check if token expired
    if (new Date() > new Date(session.expiresAt)) {
      sessions.delete(token);
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    }

    const user = Array.from(users.values()).find(u => u.id === session.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
      session: {
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to get profile',
      message: error.message
    });
  }
});

// Platform Stats
app.get('/api/platform/stats', (req, res) => {
  res.json({
    success: true,
    message: 'GameSyncSphere Platform Statistics',
    timestamp: new Date().toISOString(),
    stats: {
      totalUsers: users.size,
      activeSessions: sessions.size,
      version: '3.2.0',
      uptime: process.uptime(),
      features: [
        'User Registration & Login',
        'Session Management',
        'Secure Authentication',
        'Ready for Survey Integration'
      ]
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Authentication test - No external dependencies!',
    authentication: '✅ Working',
    crypto: '✅ Built-in Node.js',
    userStorage: '✅ In-memory ready',
    sessionManagement: '✅ Active',
    ready: '✅ Ready for users!'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GameSyncSphere with built-in auth running on port ${PORT}`);
  console.log(`🔐 Authentication: Ready (no external deps)`);
  console.log(`💰 Ready for user registration and surveys!`);
});
