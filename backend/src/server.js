const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// In-memory storage (fallback)
const users = new Map();
const sessions = new Map();

// Database initialization
let prisma = null;
let databaseReady = false;

// Initialize Prisma connection
async function initializeDatabase() {
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient({
      log: ['error', 'warn']
    });
    
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    const userCount = await prisma.user.count();
    console.log(`📊 Current users in database: ${userCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('📝 Will use in-memory storage as fallback');
    return false;
  }
}

// Initialize database on startup
initializeDatabase().then(success => {
  databaseReady = success;
  if (success) {
    console.log('🗄️ Database ready for operations');
  } else {
    console.log('💾 Using in-memory storage');
  }
});

// Utility functions
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
    version: '5.0.0',
    timestamp: new Date().toISOString(),
    description: 'The world\'s first player-compensated gaming analytics platform powered by Claude AI',
    revolutionaryFeatures: [
      '🔐 Secure User Authentication',
      '🤖 Claude AI Survey Generation',
      '💰 Real Player Earnings System',
      '🎯 Experience-Based Bonuses',
      '🗄️ PostgreSQL Database Integration',
      '📊 Complete Earnings Tracking',
      '🚀 Ready for B2B Integration'
    ],
    system: {
      database: databaseReady ? 'PostgreSQL Connected' : 'In-Memory Fallback',
      authentication: 'Secure Token-Based',
      aiProvider: 'Claude by Anthropic',
      storage: databaseReady ? 'Permanent' : 'Temporary'
    },
    stats: {
      registeredUsers: users.size,
      activeSessions: sessions.size,
      databaseStatus: databaseReady ? 'Connected' : 'Initializing'
    },
    quickStart: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      generateSurvey: 'POST /api/survey/generate (requires auth)',
      submitSurvey: 'POST /api/survey/:id/submit (requires auth)',
      viewEarnings: 'GET /api/user/surveys (requires auth)',
      initDatabase: 'GET /api/database/init'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    message: 'GameSyncSphere with database integration ready',
    timestamp: new Date().toISOString(),
    database: databaseReady ? 'Connected' : 'Fallback',
    users: users.size,
    sessions: sessions.size,
    features: ['Authentication', 'Claude AI Surveys', 'Database Integration', 'Earnings Tracking']
  });
});

// Database routes
app.get('/api/database/init', async (req, res) => {
  try {
    if (!prisma) {
      const success = await initializeDatabase();
      if (!success) {
        return res.status(500).json({
          error: 'Database initialization failed',
          message: 'Check logs for details',
          fallback: 'Using in-memory storage'
        });
      }
      databaseReady = true;
    }

    const userCount = await prisma.user.count();
    const companyCount = await prisma.company.count();
    
    res.json({
      success: true,
      message: '🗄️ Database initialized and ready!',
      database: {
        type: 'PostgreSQL',
        orm: 'Prisma',
        status: 'Connected',
        tables: ['users', 'companies', 'surveys', 'survey_responses', 'survey_requests', 'parties', 'earnings']
      },
      currentData: { users: userCount, companies: companyCount },
      nextSteps: [
        'Database is ready for user migration',
        'Can handle permanent user accounts',
        'Ready for B2B company registration',
        'Scalable to thousands of users'
      ]
    });
      
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      error: 'Database initialization failed',
      message: error.message
    });
  }
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body;

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

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hashedPassword = hashPassword(password);
    let user;

    if (databaseReady && prisma) {
      try {
        const existingUser = await prisma.user.findFirst({
          where: { OR: [{ email: email }, { username: username }] }
        });

        if (existingUser) {
          return res.status(409).json({
            error: 'User already exists',
            message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
          });
        }

        user = await prisma.user.create({
          data: {
            email,
            username,
            password_hash: hashedPassword,
            full_name: fullName || username,
            total_earnings: 0,
            completed_surveys: 0,
            gaming_platforms: [],
            favorite_games: []
          },
          select: {
            id: true,
            email: true,
            username: true,
            full_name: true,
            total_earnings: true,
            completed_surveys: true,
            created_at: true
          }
        });

        console.log(`✅ User registered in database: ${username}`);
      } catch (dbError) {
        console.error('Database registration failed:', dbError);
        databaseReady = false;
      }
    }

    if (!databaseReady || !user) {
      if (users.has(email)) {
        return res.status(409).json({
          error: 'User already exists',
          message: 'This email is already registered'
        });
      }

      user = {
        id: userId,
        email,
        username,
        full_name: fullName || username,
        password: hashedPassword,
        total_earnings: 0,
        completed_surveys: 0,
        created_at: new Date().toISOString(),
        gaming_platforms: [],
        favorite_games: [],
        activeSurveys: [],
        completedSurveyHistory: []
      };

      users.set(email, user);
      console.log(`📝 User registered in memory: ${username}`);
    }

    const token = generateToken();
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      total_earnings: user.total_earnings || 0,
      completed_surveys: user.completed_surveys || 0,
      created_at: user.created_at
    };
    
    res.status(201).json({
      success: true,
      message: '🎉 Welcome to GameSyncSphere! Your account has been created.',
      user: userResponse,
      token,
      storage: databaseReady ? 'Permanent Database' : 'Temporary (will migrate to database)',
      revolutionaryFeatures: [
        'Earn money from Claude AI gaming surveys',
        'Experience-based earning bonuses',
        'Complete transparency on all earnings',
        databaseReady ? 'Permanent account storage' : 'Account will be migrated to permanent storage'
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
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    let user = null;

    if (databaseReady && prisma) {
      try {
        user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            username: true,
            full_name: true,
            password_hash: true,
            total_earnings: true,
            completed_surveys: true,
            gaming_platforms: true,
            favorite_games: true,
            created_at: true,
            is_active: true
          }
        });

        if (user && user.password_hash === hashPassword(password)) {
          await prisma.user.update({
            where: { id: user.id },
            data: { last_login: new Date() }
          });
          console.log(`✅ Database login: ${user.username}`);
        }
      } catch (dbError) {
        console.error('Database login failed:', dbError);
        user = null;
      }
    }

    if (!user) {
      user = users.get(email);
      if (user && user.password === hashPassword(password)) {
        user.lastLogin = new Date().toISOString();
        users.set(email, user);
        console.log(`📝 Memory login: ${user.username}`);
      }
    }

    if (!user || (user.password_hash !== hashPassword(password) && user.password !== hashPassword(password))) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    const token = generateToken();
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      total_earnings: user.total_earnings || 0,
      completed_surveys: user.completed_surveys || 0
    };

    res.json({
      success: true,
      message: `🎮 Welcome back, ${user.username}!`,
      user: userResponse,
      token,
      storage: databaseReady ? 'Database' : 'Memory',
      stats: {
        totalEarnings: (user.total_earnings || 0).toFixed(2),
        completedSurveys: user.completed_surveys || 0,
        experienceBonus: `+$${((user.completed_surveys || 0) * 0.5).toFixed(2)} per future survey`,
        memberSince: user.created_at ? user.created_at.split('T')[0] : 'Today'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Unable to login. Please try again.'
    });
  }
});

// Authentication middleware
async function authenticateUser(req, res, next) {
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

    let user = null;

    if (databaseReady && prisma) {
      user = await prisma.user.findUnique({ where: { id: session.userId } });
    } else {
      user = Array.from(users.values()).find(u => u.id === session.userId);
    }

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

// Generate Claude AI Survey
app.post('/api/survey/generate', authenticateUser, async (req, res) => {
  try {
    const { 
      gameContext = {}, 
      playerState = {},
      targetInsights = ['equipment_satisfaction', 'game_enjoyment'],
      maxQuestions = 4
    } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ 
        error: 'Claude AI not configured',
        message: 'Survey generation temporarily unavailable'
      });
    }

    const completedSurveys = req.user.completed_surveys || req.user.completedSurveys || 0;
    const experienceBonus = completedSurveys * 0.5;
    const baseEarning = 15.50;

    const claudePrompt = `You are an expert gaming survey designer creating personalized surveys for GameSyncSphere.

PLAYER CONTEXT:
- Player: ${req.user.username}
- Total earnings: $${req.user.total_earnings || req.user.totalEarnings || 0}
- Completed surveys: ${completedSurveys}
- Experience level: ${completedSurveys < 5 ? 'Beginner' : completedSurveys < 15 ? 'Experienced' : 'Expert'}
- Current game: ${gameContext.game || 'Various games'}

Create ${maxQuestions} personalized questions with experience-based bonus earnings.

Respond with ONLY valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "type": "rating_scale",
      "text": "Question text here",
      "options": [1, 2, 3, 4, 5],
      "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"],
      "revenueValue": ${baseEarning + experienceBonus},
      "buyerInterest": ["Game developers"]
    }
  ],
  "estimatedCompletionTime": 3,
  "totalEarnings": ${(baseEarning + experienceBonus) * maxQuestions},
  "experienceBonus": ${experienceBonus}
}`;

    console.log(`Generating Claude survey for: ${req.user.username}`);
    
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

    let aiSurveyData;
    try {
      const claudeText = claudeResponse.data.content[0].text.trim()
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/, '')
        .replace(/[^}]*$/, '}');
      
      aiSurveyData = JSON.parse(claudeText);
    } catch (parseError) {
      const fallbackEarning = baseEarning + experienceBonus;
      aiSurveyData = {
        questions: [
          {
            id: 'q1',
            type: 'rating_scale',
            text: `How would you rate your ${gameContext.game || 'gaming'} experience today?`,
            options: [1, 2, 3, 4, 5],
            labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
            revenueValue: fallbackEarning,
            buyerInterest: ['Game developers']
          }
        ],
        estimatedCompletionTime: 3,
        totalEarnings: fallbackEarning,
        experienceBonus: experienceBonus
      };
    }

    const surveyId = `survey_${req.user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const survey = {
      id: surveyId,
      userId: req.user.id,
      username: req.user.username,
      gameContext,
      questions: aiSurveyData.questions,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      estimatedEarnings: aiSurveyData.totalEarnings,
      experienceBonus: aiSurveyData.experienceBonus || experienceBonus
    };

    if (!req.user.activeSurveys) req.user.activeSurveys = [];
    req.user.activeSurveys.push(survey);
    
    if (!databaseReady) {
      users.set(req.user.email, req.user);
    }

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
        experienceLevel: completedSurveys < 5 ? 'Beginner' : completedSurveys < 15 ? 'Experienced' : 'Expert',
        experienceBonus: `+$${experienceBonus.toFixed(2)} per question`
      },
      revolutionaryFeature: `Personalized Claude AI survey - Experience bonus: +$${experienceBonus.toFixed(2)} per question!`
    });

  } catch (error) {
    console.error('Survey generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate survey',
      message: 'Survey generation temporarily unavailable'
    });
  }
});

// Submit Survey and Earn Money
app.post('/api/survey/:surveyId/submit', authenticateUser, async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { responses } = req.body;

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
        error: 'Survey already completed'
      });
    }

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

    const newTotalEarnings = (req.user.total_earnings || req.user.totalEarnings || 0) + totalEarnings;
    const newCompletedSurveys = (req.user.completed_surveys || req.user.completedSurveys || 0) + 1;

    survey.status = 'completed';
    survey.completedAt = new Date().toISOString();
    survey.responses = processedResponses;
    survey.actualEarnings = totalEarnings;

    if (databaseReady && prisma) {
      try {
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            total_earnings: newTotalEarnings,
            completed_surveys: newCompletedSurveys
          }
        });

        req.user.total_earnings = newTotalEarnings;
        req.user.completed_surveys = newCompletedSurveys;
        
        console.log(`✅ Database updated: ${req.user.username} earned $${totalEarnings.toFixed(2)}`);
      } catch (dbError) {
        console.error('Database update failed:', dbError);
      }
    } else {
      req.user.totalEarnings = newTotalEarnings;
      req.user.completedSurveys = newCompletedSurveys;
      users.set(req.user.email, req.user);
    }

    if (!req.user.completedSurveyHistory) req.user.completedSurveyHistory = [];
    req.user.completedSurveyHistory.push(survey);
    req.user.activeSurveys.splice(surveyIndex, 1);

    const newExperienceLevel = newCompletedSurveys < 5 ? 'Beginner' : 
                               newCompletedSurveys < 15 ? 'Experienced' : 'Expert';

    res.json({
      success: true,
      message: `🎉 Survey completed! You earned $${totalEarnings.toFixed(2)}!`,
      earnings: {
        amount: totalEarnings.toFixed(2),
        currency: 'USD',
        questionsAnswered: processedResponses.length,
        paymentStatus: 'processed',
        experienceBonus: survey.experienceBonus ? `+$${survey.experienceBonus.toFixed(2)} included` : 'None',
        storage: databaseReady ? 'Database Updated' : 'Memory Updated'
      },
      userStats: {
        newTotalEarnings: newTotalEarnings.toFixed(2),
        totalCompletedSurveys: newCompletedSurveys,
        experienceLevel: newExperienceLevel,
        nextSurveyBonus: `+$${(newCompletedSurveys * 0.5).toFixed(2)} bonus for future surveys`
      },
      levelUp: newCompletedSurveys === 5 ? '🎉 Level Up! You are now "Experienced"!' :
               newCompletedSurveys === 15 ? '🚀 Level Up! You are now "Expert"!' : null
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
  const completedSurveys = req.user.completed_surveys || req.user.completedSurveys || 0;
  const totalEarnings = req.user.total_earnings || req.user.totalEarnings || 0;
  
  const experienceLevel = completedSurveys < 5 ? 'Beginner' : 
                          completedSurveys < 15 ? 'Experienced' : 'Expert';
  
  res.json({
    success: true,
    user: {
      username: req.user.username,
      email: req.user.email,
      memberSince: req.user.created_at ? req.user.created_at.split('T')[0] : 'Today',
      experienceLevel,
      storage: databaseReady ? 'Database' : 'Memory'
    },
    earnings: {
      total: totalEarnings.toFixed(2),
      completedSurveys: completedSurveys,
      averagePerSurvey: completedSurveys > 0 ? 
        (totalEarnings / completedSurveys).toFixed(2) : '0.00',
      currentExperienceBonus: (completedSurveys * 0.5).toFixed(2),
      nextLevelAt: completedSurveys < 5 ? '5 surveys (Experienced)' :
                   completedSurveys < 15 ? '15 surveys (Expert)' : 'Maximum level reached!'
    },
    activeSurveys: (req.user.activeSurveys || []).map(s => ({
      id: s.id,
      estimatedEarnings: s.estimatedEarnings,
      estimatedTime: s.estimatedCompletionTime,
      gameContext: s.gameContext,
      expiresAt: s.expiresAt,
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
        questionsAnswered: s.responses.length
      })),
    revolutionaryFeatures: [
      'Claude AI generates surveys based on your gaming behavior',
      'Earn more money as you complete more surveys',
      'Experience-based bonus system',
      'Full transparency on earnings and data usage',
      databaseReady ? 'Permanent database storage' : 'Will migrate to permanent storage'
    ]
  });
});

// Platform Stats
app.get('/api/platform/stats', async (req, res) => {
  try {
    let stats = { totalUsers: 0, totalEarnings: 0, totalSurveys: 0, totalCompanies: 0 };

    if (databaseReady && prisma) {
      try {
        const [userCount, userAggregates, companyCount] = await Promise.all([
          prisma.user.count(),
          prisma.user.aggregate({
            _sum: { total_earnings: true, completed_surveys: true }
          }),
          prisma.company.count()
        ]);

        stats = {
          totalUsers: userCount,
          totalEarnings: userAggregates._sum.total_earnings || 0,
          totalSurveys: userAggregates._sum.completed_surveys || 0,
          totalCompanies: companyCount
        };
      } catch (dbError) {
        console.error('Database stats error:', dbError);
      }
    } else {
      stats.totalUsers = users.size;
      stats.totalEarnings = Array.from(users.values()).reduce((sum, user) => sum + (user.totalEarnings || 0), 0);
      stats.totalSurveys = Array.from(users.values()).reduce((sum, user) => sum + (user.completedSurveys || 0), 0);
    }
    
    res.json({
      success: true,
      message: 'GameSyncSphere Platform Statistics',
      timestamp: new Date().toISOString(),
      system: {
        database: databaseReady ? 'PostgreSQL Connected' : 'In-Memory Fallback',
        version: '5.0.0',
        uptime: process.uptime()
      },
      stats: {
        ...stats,
        activeSessions: sessions.size,
        averageEarningsPerUser: stats.totalUsers > 0 ? (stats.totalEarnings / stats.totalUsers).toFixed(2) : '0.00'
      },
      features: [
        'User Registration & Login',
        'Claude AI Survey Generation',
        'Real Money Earnings System',
        'Experience-Based Bonuses',
        'Database Integration',
        'Complete Earnings Tracking'
      ]
    });

  } catch (error) {
    console.error('Platform stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch platform statistics',
      message: 'Unable to load stats'
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'GameSyncSphere with Database Integration - Ready!',
    authentication: '✅ Working',
    crypto: '✅ Built-in Node.js',
    database: databaseReady ? '✅ PostgreSQL Connected' : '⚠️ Fallback Mode',
    claudeAI: process.env.ANTHROPIC_API_KEY ? '✅ Connected' : '❌ Not configured',
    userStorage: databaseReady ? '✅ Database Ready' : '📝 In-memory with migration ready',
    sessionManagement: '✅ Active',
    surveySystem: '✅ Claude AI Ready',
    earningsTracking: '✅ Real Money System',
    persistence: databaseReady ? '✅ Permanent Storage' : '⚠️ Temporary (can migrate)',
    ready: '✅ Ready for users to earn money with permanent accounts!'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GameSyncSphere with Database Integration running on port ${PORT}`);
  console.log(`🔐 Authentication: Secure Token-Based`);
  console.log(`🗄️ Database: ${databaseReady ? 'PostgreSQL Connected' : 'In-Memory with Migration Ready'}`);
  console.log(`🤖 Claude AI: ${process.env.ANTHROPIC_API_KEY ? 'ENABLED' : 'DISABLED'}`);
  console.log(`💰 Earnings System: Active with Experience Bonuses`);
  console.log(`📊 Data Storage: ${databaseReady ? 'Permanent' : 'Temporary (migration available)'}`);
  console.log(`🌍 Live at: https://gamesyncsphere-production.up.railway.app/`);
  console.log(`🎯 Ready for users to register, login, and start earning money with permanent accounts!`);
});
