const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    message: 'GameSyncSphere API is running!'
  });
});

// Basic API routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'GameSyncSphere API is working!',
    timestamp: new Date().toISOString(),
    features: [
      'Gaming Analytics',
      'AI Survey Generation', 
      'Data Monetization',
      'Wellness Monitoring'
    ]
  });
});

// Gaming analytics endpoint (placeholder)
app.get('/api/analytics/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  res.json({
    playerId,
    message: 'Analytics endpoint ready',
    data: {
      totalPlaytime: '245 hours',
      favoriteGames: ['Valorant', 'Apex Legends'],
      platforms: ['Steam', 'Epic Games'],
      wellnessScore: 7.5
    }
  });
});

// Survey endpoint (placeholder)
app.post('/api/survey/generate', (req, res) => {
  res.json({
    surveyId: 'survey_' + Date.now(),
    message: 'AI survey generation ready',
    estimatedEarnings: 25.50,
    questions: [
      {
        id: 'q1',
        text: 'How satisfied are you with your current gaming setup?',
        type: 'rating',
        earningValue: 8.50
      }
    ]
  });
});

// WebSocket for real-time features
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 GameSyncSphere API running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 API test: http://localhost:${PORT}/api/test`);
});

module.exports = app;
