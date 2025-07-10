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
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Store active parties and users
const activeParties = new Map();
const activeUsers = new Map();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    message: 'GameSyncSphere API with WebRTC signaling is running!',
    activeParties: activeParties.size,
    activeUsers: activeUsers.size
  });
});

// Existing API endpoints
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'GameSyncSphere API is working!',
    timestamp: new Date().toISOString(),
    features: [
      'Gaming Analytics',
      'AI Survey Generation', 
      'Data Monetization',
      'Wellness Monitoring',
      'Decentralized Communication',  // NEW!
      'WebRTC Party System'           // NEW!
    ]
  });
});

app.get('/api/analytics/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  res.json({
    playerId,
    message: 'Analytics endpoint ready',
    data: {
      totalPlaytime: '245 hours',
      favoriteGames: ['Valorant', 'Apex Legends'],
      platforms: ['Steam', 'Epic Games'],
      wellnessScore: 7.5,
      communicationPrefs: {
        preferredPartySize: 4,
        voiceChatActive: true,
        crossPlatformEnabled: true
      }
    }
  });
});

// NEW: Decentralized Communication Endpoints

// Create a new party
app.post('/api/party/create', (req, res) => {
  const { 
    creatorId, 
    gameContext, 
    maxPlayers = 4, 
    isPrivate = false,
    partyName 
  } = req.body;

  const partyId = `party_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const party = {
    id: partyId,
    creatorId,
    gameContext,
    maxPlayers,
    isPrivate,
    partyName: partyName || `${gameContext.game} Party`,
    members: [creatorId],
    createdAt: new Date().toISOString(),
    status: 'waiting_for_players',
    webrtcOffers: new Map(),
    webrtcAnswers: new Map()
  };

  activeParties.set(partyId, party);

  res.json({
    success: true,
    party,
    message: 'Party created successfully',
    webrtcSignalingRoom: `party_${partyId}`,
    nextSteps: [
      'Share party ID with friends',
      'Wait for WebRTC peer connections',
      'Start voice/video communication'
    ]
  });
});

// Join an existing party
app.post('/api/party/join', (req, res) => {
  const { partyId, playerId, playerName } = req.body;

  const party = activeParties.get(partyId);
  
  if (!party) {
    return res.status(404).json({ error: 'Party not found' });
  }

  if (party.members.length >= party.maxPlayers) {
    return res.status(400).json({ error: 'Party is full' });
  }

  if (party.members.includes(playerId)) {
    return res.status(400).json({ error: 'Already in party' });
  }

  party.members.push(playerId);
  party.status = party.members.length === party.maxPlayers ? 'full' : 'waiting_for_players';

  activeParties.set(partyId, party);

  // Notify other party members
  io.to(`party_${partyId}`).emit('player_joined', {
    playerId,
    playerName,
    currentMembers: party.members,
    partyStatus: party.status
  });

  res.json({
    success: true,
    party,
    message: `Joined ${party.partyName}`,
    webrtcSignalingRoom: `party_${partyId}`
  });
});

// Discover available parties
app.get('/api/party/discover', (req, res) => {
  const { gameContext, playerId } = req.query;

  const availableParties = Array.from(activeParties.values())
    .filter(party => 
      !party.isPrivate && 
      party.members.length < party.maxPlayers &&
      (!gameContext || party.gameContext.game === gameContext) &&
      !party.members.includes(playerId)
    )
    .map(party => ({
      id: party.id,
      partyName: party.partyName,
      gameContext: party.gameContext,
      currentPlayers: party.members.length,
      maxPlayers: party.maxPlayers,
      createdAt: party.createdAt
    }));

  res.json({
    availableParties,
    totalParties: availableParties.length,
    recommendation: availableParties.length > 0 ? 
      'Join a party or create your own!' : 
      'Be the first to create a party for this game!'
  });
});

// Get party status
app.get('/api/party/:partyId/status', (req, res) => {
  const { partyId } = req.params;
  const party = activeParties.get(partyId);

  if (!party) {
    return res.status(404).json({ error: 'Party not found' });
  }

  res.json({
    party,
    isActive: true,
    webrtcConnections: party.members.length > 1 ? 'establishing' : 'waiting_for_members'
  });
});

// WebRTC Signaling support via WebSocket
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join party signaling room
  socket.on('join_party_signaling', (data) => {
    const { partyId, playerId } = data;
    const room = `party_${partyId}`;
    
    socket.join(room);
    activeUsers.set(socket.id, { playerId, partyId });
    
    console.log(`Player ${playerId} joined signaling room: ${room}`);
    
    // Notify others in the party
    socket.to(room).emit('peer_joined', { 
      playerId, 
      socketId: socket.id 
    });
  });

  // WebRTC Offer
  socket.on('webrtc_offer', (data) => {
    const { targetSocketId, offer, from } = data;
    socket.to(targetSocketId).emit('webrtc_offer', {
      offer,
      from,
      fromSocketId: socket.id
    });
  });

  // WebRTC Answer
  socket.on('webrtc_answer', (data) => {
    const { targetSocketId, answer, from } = data;
    socket.to(targetSocketId).emit('webrtc_answer', {
      answer,
      from,
      fromSocketId: socket.id
    });
  });

  // ICE Candidates
  socket.on('ice_candidate', (data) => {
    const { targetSocketId, candidate, from } = data;
    socket.to(targetSocketId).emit('ice_candidate', {
      candidate,
      from,
      fromSocketId: socket.id
    });
  });

  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      // Notify party members
      socket.to(`party_${user.partyId}`).emit('peer_left', {
        playerId: user.playerId,
        socketId: socket.id
      });
      activeUsers.delete(socket.id);
    }
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 GameSyncSphere API with WebRTC signaling running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🎮 Party system: http://localhost:${PORT}/api/party/discover`);
});

module.exports = app;
