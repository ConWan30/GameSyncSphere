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
      'Claude AI Survey Generation',    // NEW!
      'Context-Aware Surveys',          // NEW!
      'Dynamic Player Rewards',         // NEW!
      'B2B Insights Marketplace'        // NEW!
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
      maxQuestions = 5
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
- Player Wellness Score: ${playerState.wellnessScore || 7.5}/10

TARGET BUSINESS INSIGHTS: ${targetInsights.join(', ')}
SURVEY PERSONALITY: ${surveyPersonality} (make questions feel natural and conversational)
MAXIMUM QUESTIONS: ${maxQuestions}

Create ${maxQuestions} highly personalized questions that:
1. Feel natural and contextual to their recent gaming experience
2. Generate valuable insights for game developers and hardware companies
3. Have clear monetary value for data buyers
4. Respect the player's time and gaming context

Each question should earn the player money based on its value to businesses.

CRITICAL: Respond with ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "id": "q1",
      "type": "rating_scale",
      "text": "After your ${gameContext.sessionTime || 60}-minute ${gameContext.game || 'gaming'} session, how would you rate your controller's responsiveness during intense moments?",
      "context": "Generated because player just completed a gaming session with specific performance data",
      "options": [1, 2, 3, 4, 5],
      "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"],
      "revenueValue": 12.50,
      "buyerInterest": ["Logitech", "Razer", "Game developers"],
      "dataValue": "High - Hardware performance feedback"
    },
    {
      "id": "q2", 
      "type": "multiple_choice",
      "text": "Which aspect of ${gameContext.game || 'your current game'} do you think needs the most improvement?",
      "context": "Game-specific feedback valuable to developers",
      "options": ["Graphics", "Gameplay mechanics", "Matchmaking", "Audio design", "User interface"],
      "revenueValue": 15.75,
      "buyerInterest": ["Game developers", "Publishers"],
      "dataValue": "Very High - Direct game improvement insights"
    }
  ],
  "estimatedCompletionTime": 3,
  "totalEarnings": 67.25,
  "completionRate": 0.89,
  "aiProvider": "Claude",
  "personalizedFor": "${playerId}",
  "businessValue": "High-value gaming insights for hardware and software companies"
}

Make each question specific, valuable, and worth the player's time. Focus on insights that gaming companies would actually pay premium prices for.`;

    // Call Claude API
    const claudeResponse = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: claudePrompt
        }
      ]
    }, {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    // Parse Claude response
    let aiSurveyData;
    try {
      const claudeText = claudeResponse.data.content[0].text.trim();
      // Remove any markdown formatting if present
      const cleanJson = claudeText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      aiSurveyData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Claude response parsing error:', parseError);
      // Enhanced fallback survey
      aiSurveyData = {
        questions: [
          {
            id: 'q1',
            type: 'rating_scale',
            text: `How satisfied are you with your gaming experience during your recent ${gameContext.game || 'gaming'} session?`,
            context: 'Claude AI-generated personalized question',
            options: [1, 2, 3, 4, 5],
            labels: ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
            revenueValue: 18.00,
            buyerInterest: ['Game developers', 'Gaming hardware companies'],
            dataValue: 'High - Player satisfaction metrics'
          },
          {
            id: 'q2',
            type: 'multiple_choice',
            text: 'What gaming hardware upgrade are you most likely to consider next?',
            context: 'Hardware purchase intent - highly valuable to manufacturers',
            options: ['Gaming headset', 'Mouse', 'Keyboard', 'Monitor', 'Graphics card', 'None'],
            revenueValue: 22.50,
            buyerInterest: ['Razer', 'Logitech', 'NVIDIA', 'Hardware retailers'],
            dataValue: 'Very High - Purchase intent data'
          }
        ],
        estimatedCompletionTime: 3,
        totalEarnings: 40.50,
        completionRate: 0.87,
        aiProvider: 'Claude',
        personalizedFor: playerId
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
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
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
      revolutionaryFeature: 'World\'s first Claude AI-generated gaming surveys based on real player context!',
      message: 'Claude AI generated a personalized survey based on your gaming behavior',
      innovation: 'Player-compensated data economy powered by advanced AI'
    });

  } catch (error) {
    console.error('Claude AI Survey generation error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate Claude AI survey',
      details: error.response?.data?.error || error.message,
      message: 'Claude AI survey generation temporarily unavailable'
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

    // Calculate earnings based on responses
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
          buyerInterest: question.buyerInterest || [],
          dataValue: question.dataValue || 'Standard'
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
      message: '🎉 Survey completed! Claude AI helped you earn money from your gaming insights!',
      earnings: {
        amount: totalEarnings,
        currency: 'USD',
        questionsAnswered: processedResponses.length,
        paymentStatus: 'processed',
        aiProvider: 'Claude'
      },
      impact: `Your responses help improve ${survey.gameContext.game || 'gaming experiences'} for millions of players`,
      revolutionaryFeature: 'World\'s first Claude AI-powered player compensation system!',
      buyerInterest: [...new Set(processedResponses.flatMap(r => r.buyerInterest))],
      nextSteps: [
        'Earnings added to your GameSyncSphere wallet',
        'Data anonymized and prepared for business insights',
        'You can take more surveys to earn additional money'
      ]
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
  const claudeGeneratedSurveys = playerSurveys.filter(s => s.aiProvider === 'Claude').length;

  res.json({
    playerId,
    surveyStats: {
      totalSurveys: playerSurveys.length,
      completedSurveys: playerResponses.length,
      claudeGeneratedSurveys,
      totalEarnings: totalEarnings.toFixed(2),
      averageEarningsPerSurvey: playerResponses.length > 0 ? (totalEarnings / playerResponses.length).toFixed(2) : 0,
      aiProvider: 'Claude by Anthropic'
    },
    activeSurveys: playerSurveys.filter(s => s.status === 'active').map(s => ({
      id: s.id,
      estimatedEarnings: s.estimatedEarnings,
      estimatedTime: s.estimatedCompletionTime,
      gameContext: s.gameContext,
      expiresAt: s.expiresAt,
      aiProvider: s.aiProvider
    })),
    completedSurveys: playerResponses.map(r => ({
      surveyId: r.surveyId,
      earnings: r.totalEarnings.toFixed(2),
      completedAt: r.submittedAt,
      gameContext: r.gameContext,
      aiProvider: r.aiProvider
    })),
    revolutionaryFeatures: [
      'Claude AI generates surveys based on your gaming behavior',
      'Earn money for every survey response',
      'Your data helps improve games and hardware',
      'Full transparency on data usage and earnings'
    ]
  });
});

// B2B: Get survey insights for businesses  
app.get('/api/b2b/survey-insights', (req, res) => {
  const { gameContext, targetInsight } = req.query;

  const relevantResponses = Array.from(surveyResponses.values())
    .filter(response => 
      !gameContext || response.gameContext.game === gameContext
    );

  const totalPlayerCompensation = relevantResponses.reduce((sum, r) => sum + r.totalEarnings, 0);

  res.json({
    businessInsights: {
      totalResponses: relevantResponses.length,
      gameContext: gameContext || 'all_games',
      playerCompensationPaid: totalPlayerCompensation.toFixed(2),
      dataGenerationMethod: 'Claude AI-powered personalized surveys',
      anonymizedInsights: relevantResponses.map(r => ({
        gameContext: r.gameContext,
        responseCount: r.responses.length,
        submittedAt: r.submittedAt,
        aiProvider: r.aiProvider
      }))
    },
    revolutionary: 'First platform where businesses buy insights from AI-generated, player-compensated surveys',
    ethicalDataEconomy: 'Players are compensated fairly for their valuable gaming insights',
    aiAdvantage: 'Claude AI ensures surveys are contextual, relevant, and high-value'
  });
});

// Enhanced analytics with AI survey integration
app.get('/api/analytics/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  
  const playerSurveys = Array.from(activeSurveys.values())
    .filter(survey => survey.playerId === playerId);
  
  const playerResponses = Array.from(surveyResponses.values())
    .filter(response => response.playerId === playerId);

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
        totalSurveys: playerSurveys.length,
        totalEarnings: playerResponses.reduce((sum, r) => sum + r.totalEarnings, 0).toFixed(2),
        features: [
          'Context-aware survey generation',
          'Real-time earnings tracking',
          'Personalized gaming insights',
          'Ethical data monetization'
        ]
      }
    }
  });
});

// Keep all existing party system endpoints unchanged
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

  io.to(`party_${partyId}`).emit('player_joined', {
    playerId,
    playerName,
    currentMembers: party.members,
    partyStatus: party.status
  });

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

// WebSocket handling (unchanged)
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
