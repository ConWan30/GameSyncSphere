const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎮 GameSyncSphere is working!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3001
  });
});

// Health check (Railway looks for this)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test dependencies
app.get('/api/test', (req, res) => {
  const deps = {};
  
  try {
    require('bcryptjs');
    deps.bcryptjs = '✅ Available';
  } catch (e) {
    deps.bcryptjs = '❌ Missing';
  }
  
  try {
    require('jsonwebtoken');
    deps.jwt = '✅ Available';
  } catch (e) {
    deps.jwt = '❌ Missing';
  }
  
  res.json({
    message: 'Dependency test',
    dependencies: deps,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GameSyncSphere running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
