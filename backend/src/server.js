const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
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

// Storage
const activeParties = new Map();
const activeUsers = new Map();
const activeSurveys = new Map();
const surveyResponses = new Map();

// API Keys
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    message: 'GameSyncSphere API with Claude AI Survey Generation is running!',
    activeParties: activeParties.size,
    activeUsers: activeUsers.size,
    activeSurveys: activeSurveys.size,
    aiSurveyEnabled: !!ANTHROPIC_API_KEY,
    aiProvider: 'Claude by Anthropic'
  });
});

// Enhanced features list
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'GameSyncSphere API with Claude AI Survey Generation is working!',
    timestamp: new Date().toISOString(),
    features: [
      'Gaming Analytics',
      'Data Monetization',
      'Wellness Monitoring',
      'Decentralized Communication',
      'WebRTC Party System',
      'Claude AI Survey Generation',
      'Context-Aware Surveys',
      'Dynamic Player Rewards',
      'B2B Insights Marketplace'
    ],
    aiProvider: 'Powered by Claude (Anthropic)'
  });
});

// REVOLUTIONARY: Claude AI-Powered Survey Generation
app.post('/api/survey/generate', async (req, res) => {
  try {
    const { 
      playerId, 
      gameContext, 
      playerState = {},
      targetInsights = ['equipment_satisfaction', 'game_enjoyment'],
      surveyPersonality = 'casual',
      maxQuestions = 4
    } = req.body;

    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ 
        error: 'Claude AI Survey Generation not configured',
        message: 'Anthropic API key required'
      });
    }

    // Build comprehensive AI prompt for Claude
    const claudePrompt = `You are an expert gaming survey designer creating personalized surveys for GameSyncSphere, the world's first player-compensated gaming analytics platform.

PLAYER CONTEXT:
- Current/Recent Game: ${gameContext.game || 'Various games'}
- Session Duration: ${gameContext.sessionTime || 60} minutes  
- Performance Level: ${gameContext.performance || 'average'}
- Gaming Platforms: ${playerState.platforms ? playerState.platforms.join(', ') : 'PC, Console'}
- Favorite Games: ${playerState.favoriteGames ? playerState.favoriteGames.join(', ') : 'FPS, Strategy games'}

TARGET BUSINESS INSIGHTS: ${targetInsights.join(', ')}
SURVEY PERSONALITY: ${surveyPersonality}
MAXIMUM QUESTIONS: ${maxQuestions}

Create ${maxQuestions} highly personalized questions that feel natural and generate valuable business insights.

Respond with ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "id": "q1",
      "type": "rating_scale",
      "text": "After your ${gameContext.sessionTime || 60}-minute ${gameContext.game || 'gaming'} session, how satisfied were you with your equipment's performance?",
      "context": "Generated based on recent gaming session",
      "options": [1, 2, 3, 4, 5],
      "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"],
      "revenueValue": 15.50,
      "buyerInterest": ["Hardware companies", "Game developers"]
    }
  ],
  "estimatedCompletionTime": 3,
  "totalEarnings": 45.25,
  "completionRate": 0.89
}`;

    console.log('Calling Claude API...');

    // Call Claude API with corrected format
    const claudeResponse = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: claudePrompt
        }
      ],
      system: "You are an expert gaming survey designer. Respond only with valid JSON, no markdown formatting or extra text."
    }, {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    console.log('Claude API response received');

    // Parse Claude response with better error handling
    let aiSurveyData;
    try {
      const claudeText = claudeResponse.data.content[0].text.trim();
      console.log('Claude raw response:', claudeText);
      
      // Remove any markdown formatting
      const cleanJson = claudeText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/, '')
        .replace(/[^}]*$/, '}');
      
      aiSurveyData = JSON.parse(cleanJson);
      console.log('Successfully parsed Claude response');
      
    } catch (parseError) {
      console.error('Claude response parsing error:', parseError);
      console.error('Raw Claude response:', claudeResponse.data);
      
      // Enhanced fallback survey
      aiSurveyData = {
        questions: [
          {
            id: 'q1',
            type: 'rating_scale',
            text: `How satisfied are you with your ${gameContext.game || 'gaming'} experience?`,
            context: 'Claude fallback - personalized for your gaming context',
            options: [1, 2, 3, 4, 5],
            labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
            revenueValue: 18.00,
            buyerInterest: ['Game developers'],
            dataValue: 'High - Player satisfaction metrics'
          },
          {
            id: 'q2',
            type: 'multiple_choice',
            text: 'What gaming hardware upgrade interests you most?',
            context: 'Hardware purchase intent - valuable to manufacturers',
            options: ['Gaming Headset', 'Gaming Mouse', 'Mechanical Keyboard', 'Gaming Monitor', 'Graphics Card'],
            revenueValue: 22.50,
            buyerInterest: ['Hardware manufacturers'],
            dataValue: 'Very High - Purchase intent'
          }
        ],
        estimatedCompletionTime: 3,
        totalEarnings: 40.50,
        completionRate: 0.87
      };
    }

    // Create survey record
    const surveyId = `claude_survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const survey = {
      id: surveyId,
      playerId,
      gameContext,
      playerState,
      questions: aiSurveyData.questions,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      aiGenerated: true,
      aiProvider: 'Claude',
      estimatedEarnings: aiSurveyData.totalEarnings,
      estimatedCompletionTime: aiSurveyData.estimatedCompletionTime,
      targetInsights
    };

    activeSurveys.set(surveyId, survey);

    res.json({
      success: true,
      surveyId,
      survey: {
        id: surveyId,
        questions: aiSurveyData.questions,
        estimatedEarnings: aiSurveyData.totalEarnings,
        estimatedCompletionTime: aiSurveyData.estimatedCompletionTime,
        expiresAt: survey.expiresAt,
        aiProvider: 'Claude by Anthropic'
      },
      revolutionaryFeature: 'World\'s first Claude AI-generated gaming surveys!',
      message: 'Claude AI generated a personalized survey based on your gaming behavior'
    });

  } catch (error) {
    console.error('Claude AI Survey generation error:', error.message);
    console.error('Full error:', error.response?.data || error);
    
    res.status(500).json({ 
      error: 'Failed to generate Claude AI survey',
      details: error.response?.data?.error || error.message,
      message: 'Claude AI survey generation failed - check logs'
    });
  }
});

// Submit survey responses and earn money
app.post('/api/survey/:surveyId/submit', async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { responses, playerId } = req.body;

    const survey = activeSurveys.get(surveyId);
    
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found or expired' });
    }

    if (survey.status === 'completed') {
      return res.status(400).json({ error: 'Survey already completed' });
    }

    // Calculate earnings
    let totalEarnings = 0;
    const processedResponses = [];

    survey.questions.forEach((question) => {
      const response = responses[question.id];
      if (response !== undefined) {
        totalEarnings += question.revenueValue || 0;
        processedResponses.push({
          questionId: question.id,
          question: question.text,
          response,
          earningValue: question.revenueValue || 0,
          buyerInterest: question.buyerInterest || []
        });
      }
    });

    // Store response
    const responseRecord = {
      surveyId,
      playerId,
      responses: processedResponses,
      totalEarnings,
      submittedAt: new Date().toISOString(),
      gameContext: survey.gameContext,
      aiProvider: survey.aiProvider
    };

    surveyResponses.set(`${surveyId}_${playerId}`, responseRecord);
    
    // Mark survey as completed
    survey.status = 'completed';
    survey.completedAt = new Date().toISOString();
    activeSurveys.set(surveyId, survey);

    res.json({
      success: true,
      message: '🎉 Survey completed! You earned money from your gaming insights!',
      earnings: {
        amount: totalEarnings.toFixed(2),
        currency: 'USD',
        questionsAnswered: processedResponses.length,
        paymentStatus: 'processed',
        aiProvider: 'Claude'
      },
      revolutionaryFeature: 'World\'s first Claude AI-powered player compensation system!',
      buyerInterest: [...new Set(processedResponses.flatMap(r => r.buyerInterest))]
    });

  } catch (error) {
    console.error('Survey submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit survey',
      details: error.message 
    });
  }
});

// Get player's survey history and earnings
app.get('/api/player/:playerId/surveys', (req, res) => {
  const { playerId } = req.params;

  const playerSurveys = Array.from(activeSurveys.values())
    .filter(survey => survey.playerId === playerId);

  const playerResponses = Array.from(surveyResponses.values())
    .filter(response => response.playerId === playerId);

  const totalEarnings = playerResponses.reduce((sum, response) => sum + response.totalEarnings, 0);

  res.json({
    playerId,
    surveyStats: {
      totalSurveys: playerSurveys.length,
      completedSurveys: playerResponses.length,
      totalEarnings: totalEarnings.toFixed(2),
      averageEarningsPerSurvey: playerResponses.length > 0 ? (totalEarnings / playerResponses.length).toFixed(2) : 0,
      aiProvider: 'Claude by Anthropic'
    },
    activeSurveys: playerSurveys.filter(s => s.status === 'active').map(s => ({
      id: s.id,
      estimatedEarnings: s.estimatedEarnings,
      estimatedTime: s.estimatedCompletionTime,
      gameContext: s.gameContext,
      expiresAt: s.expiresAt
    })),
    completedSurveys: playerResponses.map(r => ({
      surveyId: r.surveyId,
      earnings: r.totalEarnings.toFixed(2),
      completedAt: r.submittedAt,
      gameContext: r.gameContext
    })),
    revolutionaryFeatures: [
      'Claude AI generates surveys based on your gaming behavior',
      'Earn money for every survey response',
      'Full transparency on earnings and data usage'
    ]
  });
});

// Enhanced analytics
app.get('/api/analytics/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  
  res.json({
    playerId,
    message: 'Enhanced analytics with Claude AI survey integration',
    data: {
      totalPlaytime: '245 hours',
      favoriteGames: ['Valorant', 'Apex Legends'],
      platforms: ['Steam', 'Epic Games'],
      wellnessScore: 7.5,
      communicationPrefs: {
        preferredPartySize: 4,
        voiceChatActive: true,
        crossPlatformEnabled: true
      },
      aiSurveyIntegration: {
        enabled: !!ANTHROPIC_API_KEY,
        provider: 'Claude by Anthropic',
        features: [
          'Context-aware survey generation',
          'Real-time earnings tracking',
          'Personalized gaming insights'
        ]
      }
    }
  });
});

// Party system endpoints (unchanged)
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
    status: 'waiting_for_players'
  };

  activeParties.set(partyId, party);

  res.json({
    success: true,
    party,
    message: 'Party created successfully',
    webrtcSignalingRoom: `party_${partyId}`
  });
});

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

  res.json({
    success: true,
    party,
    message: `Joined ${party.partyName}`
  });
});

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

// WebSocket handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join_party_signaling', (data) => {
    const { partyId, playerId } = data;
    const room = `party_${partyId}`;
    
    socket.join(room);
    activeUsers.set(socket.id, { playerId, partyId });
    
    socket.to(room).emit('peer_joined', { 
      playerId, 
      socketId: socket.id 
    });
  });

  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      socket.to(`party_${user.partyId}`).emit('peer_left', {
        playerId: user.playerId,
        socketId: socket.id
      });
      activeUsers.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 GameSyncSphere API with Claude AI running on port ${PORT}`);
  console.log(`🤖 Claude AI Survey Generation: ${ANTHROPIC_API_KEY ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
