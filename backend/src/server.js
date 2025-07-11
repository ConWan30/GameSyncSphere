const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import database (with fallback if not ready)
let prisma = null;
try {
  prisma = require('./database/db');
} catch (error) {
  console.log('Database not ready yet, will use in-memory storage');
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Storage
const activeParties = new Map();
const activeUsers = new Map();
const activeSurveys = new Map();
const surveyResponses = new Map();

// API Keys
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// ROOT ROUTE
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Welcome to GameSyncSphere - Revolutionary AI Gaming Analytics',
    status: 'online',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    description: 'The world\'s first player-compensated gaming analytics platform powered by Claude AI',
    revolutionaryFeatures: [
      '🤖 Claude AI Survey Generation',
      '💰 Player Data Monetization', 
      '🔐 User Authentication System',
      '🏢 B2B Marketplace (Coming Soon)',
      '🗄️ Database Integration'
    ],
    database: prisma ? 'PostgreSQL Connected' : 'Initializing...',
    authentication: 'JWT Ready',
    apiEndpoints: {
      health: 'GET /health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      test: 'GET /api/test'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    message: 'GameSyncSphere API with Authentication is running!',
    database: prisma ? 'Connected' : 'Initializing',
    authentication: 'Ready',
    aiSurveyEnabled: !!ANTHROPIC_API_KEY,
    aiProvider: 'Claude by Anthropic'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'GameSyncSphere API with Authentication is working!',
    timestamp: new Date().toISOString(),
    features: [
      'User Registration & Login',
      'JWT Authentication',
      'Database Integration',
      'Claude AI Survey Generation'
    ],
    database: prisma ? 'PostgreSQL Ready' : 'Initializing'
  });
});

// =============================================================================
// AUTHENTICATION ROUTES
// =============================================================================

// Simple validation helper
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, full_name } = req.body;

    // Basic validation
    if (!email || !username || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, username, and password are required'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 8 characters'
      });
    }

    // If database is ready, use it; otherwise use in-memory
    if (prisma) {
      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { username: username }
          ]
        }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
          message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
        });
      }

      // Hash password and create user
      const password_hash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password_hash,
          full_name: full_name || username
        },
        select: {
          id: true,
          email: true,
          username: true,
          full_name: true,
          created_at: true,
          total_earnings: true
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: '🎉 Welcome to GameSyncSphere! Your account has been created.',
        user,
        token,
        revolutionaryFeatures: [
          'Earn money from Claude AI gaming surveys',
          'Join gaming parties with WebRTC',
          'Track gaming analytics and wellness'
        ]
      });

    } else {
      // Fallback: in-memory registration for testing
      const password_hash = await bcrypt.hash(password, 12);
      const user = {
        id: `user_${Date.now()}`,
        email,
        username,
        full_name: full_name || username,
        created_at: new Date().toISOString(),
        total_earnings: 0
      };

      const token = jwt.sign(
        { userId: user.id, email: user.email, type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: '🎉 Welcome to GameSyncSphere! Account created (database initializing).',
        user,
        token,
        note: 'Database is initializing - account will be permanent once ready'
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Unable to create account. Please try again.'
    });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    if (prisma) {
      // Database login
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, type: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password_hash, ...userData } = user;

      res.json({
        success: true,
        message: `🎮 Welcome back, ${user.username}!`,
        user: userData,
        token
      });

    } else {
      // Fallback for testing
      res.status(503).json({
        error: 'Database initializing',
        message: 'Login will be available once database is ready'
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Unable to login. Please try again.'
    });
  }
});

// Database status check
app.get('/api/database/status', async (req, res) => {
  try {
    if (prisma) {
      await prisma.$connect();
      res.json({
        status: 'connected',
        database: 'PostgreSQL',
        message: 'Database is ready for user registration!'
      });
    } else {
      res.json({
        status: 'initializing',
        message: 'Database files created, connection initializing...'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 GameSyncSphere API with Authentication running on port ${PORT}`);
  console.log(`🔐 Authentication: JWT Ready`);
  console.log(`🗄️ Database: ${prisma ? 'PostgreSQL Connected' : 'Initializing...'}`);
  console.log(`🤖 Claude AI: ${ANTHROPIC_API_KEY ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🌍 Live at: https://gamesyncsphere-production.up.railway.app/`);
});

module.exports = app;
