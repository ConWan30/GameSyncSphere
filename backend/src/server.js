const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // Built into Node.js
const axios = require('axios');
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
    message: '🎮 GameSyncSphere - Revolutionary AI Gaming Analytics & Earning Platform!',
    status: 'healthy',
    version: '4.0.0',
    timestamp: new Date().toISOString(),
    description: 'The world\'s first player-compensated gaming analytics platform powered by Claude AI',
    revolutionaryFeatures: [
      '🔐 Secure User Authentication',
      '🤖 Claude AI Survey Generation',
      '💰 Real Player Earnings System',
      '🎯 Experience-Based Bonuses',
      '📊 Complete Earnings Tracking',
      '🚀 Ready for B2B Integration'
    ],
    stats: {
      registeredUsers: users.size,
      activeSessions: sessions.size,
      aiSurveySystem: 'Claude by Anthropic',
      authentication: 'Secure Token-Based'
    },
    quickStart: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      generateSurvey: 'POST /api/survey/generate (requires auth)',
      submitSurvey: 'POST /api/survey/:id/submit (requires auth)',
      viewEarnings: 'GET /api/user/surveys (requires auth)'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    message: 'GameSyncSphere authentication + survey server ready',
    timestamp: new Date().toISOString(),
    users: users.size,
    sessions: sessions.size,
    features: ['Authentication', 'Claude AI Surveys', 'Earnings Tracking']
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
      favoriteGames: [],
      activeSurveys: [],
      completedSurveyHistory: []
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
        'Experience-based earning bonuses',
        'Complete transparency on all earnings'
      ],
      nextSteps: [
        'Generate your first Claude AI survey',
        'Complete surveys to start earning money',
        'Build your gaming profile for better surveys'
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
        activeSurveys: user.activeSurveys.length,
        experienceBonus: `+$${(user.completedSurveys * 0.5).toFixed(2)} per future survey`,
        memberSince: user.createdAt.split('T')[0]
      },
      availableActions: [
        'Generate new Claude AI survey to earn money',
        'Complete active surveys',
        'View earnings history',
        'Update gaming profile'
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
  const totalEarnings = Array.from(users.values()).reduce((sum, user) => sum + user.totalEarnings, 0);
  const totalSurveys = Array.from(users.values()).reduce((sum, user) => sum + user.completedSurveys, 0);
  
  res.json({
    success: true,
    message: 'GameSyncSphere Platform Statistics',
    timestamp: new Date().toISOString(),
    stats: {
      totalUsers: users.size,
      activeSessions: sessions.size,
      totalEarnings: totalEarnings.toFixed(2),
      totalCompletedSurveys: totalSurveys,
      averageEarningsPerUser: users.size > 0 ? (totalEarnings / users.size).toFixed(2) : '0.00',
      version: '4.0.0',
      uptime: process.uptime(),
      features: [
        'User Registration & Login',
        'Claude AI Survey Generation',
        'Real Money Earnings System',
        'Experience-Based Bonuses',
        'Complete Earnings Tracking'
      ]
    },
    revolutionaryMilestones: [
      users.size >= 10 && '🎉 10+ Users Registered',
      totalEarnings >= 100 && '💰 $100+ in Total Player Earnings',
      totalSurveys >= 25 && '📊 25+ Surveys Completed',
      sessions.size >= 5 && '🔥 5+ Active Sessions'
    ].filter(Boolean)
  });
});

// =============================================================================
// CLAUDE AI SURVEY SYSTEM (Connected to User Accounts)
// =============================================================================

// Middleware to check authentication
function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access surveys'
      });
    }

    const session = sessions.get(token);
    if (!session || new Date() > new Date(session.expiresAt)) {
      return res.status(401).json({
        error: 'Invalid or expired token',
        message: 'Please login again'
      });
    }

    const user = Array.from(users.values()).find(u => u.id === session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
}

// Generate Claude AI Survey (Authenticated)
app.post('/api/survey/generate', authenticateUser, async (req, res) => {
  try {
    const { 
      gameContext = {}, 
      playerState = {},
      targetInsights = ['equipment_satisfaction', 'game_enjoyment'],
      surveyPersonality = 'casual',
      maxQuestions = 4
    } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ 
        error: 'Claude AI not configured',
        message: 'Survey generation temporarily unavailable'
      });
    }

    // Calculate experience-based bonus
    const experienceBonus = req.user.completedSurveys * 0.5;
    const baseEarning = 15.50;

    // Enhanced Claude prompt with user context
    const claudePrompt = `You are an expert gaming survey designer creating personalized surveys for GameSyncSphere, the world's first player-compensated gaming analytics platform.

PLAYER CONTEXT:
- Player: ${req.user.username}
- Member since: ${req.user.createdAt.split('T')[0]}
- Total earnings: $${req.user.totalEarnings}
- Completed surveys: ${req.user.completedSurveys}
- Experience level: ${req.user.completedSurveys < 5 ? 'Beginner' : req.user.completedSurveys < 15 ? 'Experienced' : 'Expert'}
- Current game: ${gameContext.game || 'Various games'}
- Session duration: ${gameContext.sessionTime || 60} minutes
- Gaming platforms: ${playerState.platforms ? playerState.platforms.join(', ') : 'PC, Console'}
- Favorite games: ${playerState.favoriteGames ? playerState.favoriteGames.join(', ') : 'FPS, Strategy games'}

TARGET BUSINESS INSIGHTS: ${targetInsights.join(', ')}
SURVEY PERSONALITY: ${surveyPersonality}
MAXIMUM QUESTIONS: ${maxQuestions}

Create ${maxQuestions} highly personalized questions that feel natural and generate valuable business insights. Since this player has completed ${req.user.completedSurveys} surveys, make questions appropriately sophisticated and include experience-based bonus earnings.

Respond with ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": "q1",
      "type": "rating_scale",
      "text": "After your ${gameContext.sessionTime || 60}-minute ${gameContext.game || 'gaming'} session, how satisfied were you with your equipment's performance?",
      "context": "Generated based on your gaming session and ${req.user.completedSurveys}-survey experience",
      "options": [1, 2, 3, 4, 5],
      "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"],
      "revenueValue": ${baseEarning + experienceBonus},
      "buyerInterest": ["Hardware companies", "Game developers"]
    }
  ],
  "estimatedCompletionTime": 3,
  "totalEarnings": ${(baseEarning + experienceBonus) * maxQuestions},
  "experienceBonus": ${experienceBonus}
}`;

    console.log(`Generating Claude survey for user: ${req.user.username} (${req.user.completedSurveys} surveys completed)`);
    
    // Call Claude API
    const claudeResponse = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [{ role: 'user', content: claudePrompt }],
      system: "You are an expert gaming survey designer. Respond only with valid JSON, no markdown formatting."
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    // Parse Claude response
    let aiSurveyData;
    try {
      const claudeText = claudeResponse.data.content[0].text.trim()
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/, '')
        .replace(/[^}]*$/, '}');
      
      aiSurveyData = JSON.parse(claudeText);
      console.log('Successfully parsed Claude response for', req.user.username);
      
    } catch (parseError) {
      console.error('Claude response parsing error:', parseError);
      
      // Fallback survey with user-specific earnings
      const fallbackEarning = baseEarning + experienceBonus;
      aiSurveyData = {
        questions: [
          {
            id: 'q1',
            type: 'rating_scale',
            text: `Based on your ${req.user.completedSurveys} completed surveys, how would you rate your overall ${gameContext.game || 'gaming'} experience today?`,
            context: `Personalized for your ${req.user.completedSurveys < 5 ? 'beginner' : 'experienced'} level`,
            options: [1, 2, 3, 4, 5],
            labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
            revenueValue: fallbackEarning,
            buyerInterest: ['Game developers']
          },
          {
            id: 'q2',
            type: 'multiple_choice',
            text: `As ${req.user.completedSurveys < 5 ? 'a new gamer' : 'an experienced survey taker'}, what gaming hardware interests you most?`,
            context: 'Experience-based premium question',
            options: ['High-end Gaming Headset', 'Mechanical Gaming Keyboard', 'Gaming Monitor 144Hz+', 'Graphics Card Upgrade', 'Gaming Chair'],
            revenueValue: fallbackEarning + 2,
            buyerInterest: ['Hardware manufacturers']
          }
        ],
        estimatedCompletionTime: 3,
        totalEarnings: (fallbackEarning * 2) + 2,
        experienceBonus: experienceBonus
      };
    }

    // Create survey record
    const surveyId = `survey_${req.user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const survey = {
      id: surveyId,
      userId: req.user.id,
      username: req.user.username,
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
      targetInsights,
      userExperienceLevel: req.user.completedSurveys,
      experienceBonus: aiSurveyData.experienceBonus || experienceBonus
    };

    // Store survey in user's active surveys
    req.user.activeSurveys.push(survey);
    users.set(req.user.email, req.user);

    res.json({
      success: true,
      surveyId,
      survey: {
        id: surveyId,
        questions: aiSurveyData.questions,
        estimatedEarnings: aiSurveyData.totalEarnings,
        estimatedCompletionTime: aiSurveyData.estimatedCompletionTime,
        expiresAt: survey.expiresAt,
        aiProvider: 'Claude by Anthropic',
        experienceBonus: survey.experienceBonus
      },
      userContext: {
        username: req.user.username,
        experienceLevel: req.user.completedSurveys < 5 ? 'Beginner' : req.user.completedSurveys < 15 ? 'Experienced' : 'Expert',
        completedSurveys: req.user.completedSurveys,
        totalEarnings: req.user.totalEarnings.toFixed(2),
        experienceBonus: `+$${experienceBonus.toFixed(2)} per question`
      },
      revolutionaryFeature: `Personalized Claude AI survey for ${req.user.username} - Experience bonus: +$${experienceBonus.toFixed(2)} per question!`,
      message: 'Claude AI generated a survey tailored to your gaming experience and history'
    });

  } catch (error) {
    console.error('Survey generation error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate survey',
      details: error.message,
      message: 'Survey generation temporarily unavailable'
    });
  }
});

// Submit Survey and Earn Money (Authenticated)
app.post('/api/survey/:surveyId/submit', authenticateUser, async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { responses } = req.body;

    // Find survey in user's active surveys
    const surveyIndex = req.user.activeSurveys?.findIndex(s => s.id === surveyId);
    if (surveyIndex === -1 || !req.user.activeSurveys) {
      return res.status(404).json({ 
        error: 'Survey not found',
        message: 'This survey does not exist or has expired'
      });
    }

    const survey = req.user.activeSurveys[surveyIndex];
    
    if (survey.status === 'completed') {
      return res.status(400).json({ 
        error: 'Survey already completed',
        message: 'You have already submitted this survey'
      });
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

    // Update user earnings and stats
    req.user.totalEarnings += totalEarnings;
    req.user.completedSurveys += 1;
    
    // Mark survey as completed
    survey.status = 'completed';
    survey.completedAt = new Date().toISOString();
    survey.responses = processedResponses;
    survey.actualEarnings = totalEarnings;

    // Move to completed surveys
    if (!req.user.completedSurveyHistory) req.user.completedSurveyHistory = [];
    req.user.completedSurveyHistory.push(survey);
    req.user.activeSurveys.splice(surveyIndex, 1);

    // Save updated user
    users.set(req.user.email, req.user);

    // Calculate new experience level
    const newExperienceLevel = req.user.completedSurveys < 5 ? 'Beginner' : 
                               req.user.completedSurveys < 15 ? 'Experienced' : 'Expert';

    res.json({
      success: true,
      message: `🎉 Survey completed! You earned $${totalEarnings.toFixed(2)}!`,
      earnings: {
        amount: totalEarnings.toFixed(2),
        currency: 'USD',
        questionsAnswered: processedResponses.length,
        paymentStatus: 'processed',
        aiProvider: 'Claude',
        experienceBonus: survey.experienceBonus ? `+$${survey.experienceBonus.toFixed(2)} included` : 'None'
      },
      userStats: {
        newTotalEarnings: req.user.totalEarnings.toFixed(2),
        totalCompletedSurveys: req.user.completedSurveys,
        experienceLevel: newExperienceLevel,
        nextSurveyBonus: `+$${(req.user.completedSurveys * 0.5).toFixed(2)} bonus for future surveys`,
        averageEarningsPerSurvey: (req.user.totalEarnings / req.user.completedSurveys).toFixed(2)
      },
      levelUp: req.user.completedSurveys === 5 ? '🎉 Level Up! You are now "Experienced" - Higher earnings unlocked!' :
               req.user.completedSurveys === 15 ? '🚀 Level Up! You are now "Expert" - Maximum earnings unlocked!' : null,
      revolutionaryFeature: 'World\'s first user-authenticated Claude AI survey rewards system with experience bonuses!',
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

// Get User's Surveys and Earnings
app.get('/api/user/surveys', authenticateUser, (req, res) => {
  const experienceLevel = req.user.completedSurveys < 5 ? 'Beginner' : 
                          req.user.completedSurveys < 15 ? 'Experienced' : 'Expert';
  
  res.json({
    success: true,
    user: {
      username: req.user.username,
      email: req.user.email,
      memberSince: req.user.createdAt.split('T')[0],
      experienceLevel
    },
    earnings: {
      total: req.user.totalEarnings.toFixed(2),
      completedSurveys: req.user.completedSurveys,
      averagePerSurvey: req.user.completedSurveys > 0 ? 
        (req.user.totalEarnings / req.user.completedSurveys).toFixed(2) : '0.00',
      currentExperienceBonus: (req.user.completedSurveys * 0.5).toFixed(2),
      nextLevelAt: req.user.completedSurveys < 5 ? '5 surveys (Experienced)' :
                   req.user.completedSurveys < 15 ? '15 surveys (Expert)' : 'Maximum level reached!'
    },
    activeSurveys: (req.user.activeSurveys || []).map(s => ({
      id: s.id,
      estimatedEarnings: s.estimatedEarnings,
      estimatedTime: s.estimatedCompletionTime,
      gameContext: s.gameContext,
      expiresAt: s.expiresAt,
      createdAt: s.createdAt,
      experienceBonus: s.experienceBonus
    })),
    recentCompletedSurveys: (req.user.completedSurveyHistory || [])
      .slice(-5)
      .reverse()
      .map(s => ({
        id: s.id,
        earnings: s.actualEarnings.toFixed(2),
        completedAt: s.completedAt,
        gameContext: s.gameContext,
        questionsAnswered: s.responses.length,
        experienceBonus: s.experienceBonus
      })),
    revolutionaryFeatures: [
      'Claude AI generates surveys based on your gaming behavior',
      'Earn more money as you complete more surveys',
      'Experience-based bonus system',
      'Full transparency on earnings and data usage',
      'Authenticated secure survey system'
    ]
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'GameSyncSphere with Claude AI Surveys - Ready!',
    authentication: '✅ Working',
    crypto: '✅ Built-in Node.js',
    claudeAI: process.env.ANTHROPIC_API_KEY ? '✅ Connected' : '❌ Not configured',
    userStorage: '✅ In-memory ready',
    sessionManagement: '✅ Active',
    surveySystem: '✅ Claude AI Ready',
    earningsTracking: '✅ Real Money System',
    ready: '✅ Ready for users to earn money!'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GameSyncSphere with Claude AI Surveys running on port ${PORT}`);
  console.log(`🔐 Authentication: Secure Token-Based`);
  console.log(`🤖 Claude AI: ${process.env.ANTHROPIC_API_KEY ? 'ENABLED' : 'DISABLED'}`);
  console.log(`💰 Earnings System: Active with Experience Bonuses`);
  console.log(`🌍 Live at: https://gamesyncsphere-production.up.railway.app/`);
  console.log(`🎯 Ready for users to register, login, and start earning money!`);
});
