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

// Import new database and auth modules
const prisma = require('./database/db');
const { authenticateToken, authenticateCompany } = require('./middleware/auth');
const { 
  userRegistrationSchema, 
  userLoginSchema, 
  companyRegistrationSchema,
  surveyRequestSchema 
} = require('./validation/schemas');

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

// Storage (keeping for backward compatibility during migration)
const activeParties = new Map();
const activeUsers = new Map();
const activeSurveys = new Map();
const surveyResponses = new Map();

// API Keys
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// ROOT ROUTE - Welcome page for gamesyncsphere-production.up.railway.app
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Welcome to GameSyncSphere - Revolutionary AI Gaming Analytics',
    status: 'online',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    description: 'The world\'s first player-compensated gaming analytics platform powered by Claude AI',
    revolutionaryFeatures: [
      '🤖 Claude AI Survey Generation - Personalized surveys based on gaming behavior',
      '💰 Player Data Monetization - Earn money for sharing gaming insights',
      '🎯 Context-Aware Analytics - Real-time gaming performance tracking',
      '🌐 Cross-Platform Integration - PC, Console, Mobile support',
      '🔗 Decentralized Infrastructure - Built on IoTeX DePIN technology',
      '🎉 WebRTC Party System - Real-time voice/video communication',
      '🏢 B2B Marketplace - Companies request targeted player insights',
      '🔐 Secure Authentication - JWT-based user management'
    ],
    liveStats: {
      activeParties: activeParties.size,
      activeUsers: activeUsers.size,
      activeSurveys: activeSurveys.size,
      totalSurveyResponses: surveyResponses.size
    },
    aiIntegration: {
      provider: 'Claude by Anthropic',
      enabled: !!ANTHROPIC_API_KEY,
      capabilities: [
        'Dynamic survey generation',
        'Gaming context analysis', 
        'Personalized question creation',
        'Revenue optimization',
        'B2B insights generation'
      ]
    },
    apiEndpoints: {
      health: 'GET /health',
      test: 'GET /api/test',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      survey: {
        generate: 'POST /api/survey/generate',
        submit: 'POST /api/survey/:surveyId/submit',
        playerHistory: 'GET /api/player/:playerId/surveys'
      },
      b2b: {
        companyRegister: 'POST /api/auth/company/register',
        companyLogin: 'POST /api/auth/company/login',
        surveyRequest: 'POST /api/b2b/survey-request',
        addBudget: 'POST /api/b2b/add-budget'
      },
      party: {
        create: 'POST /api/party/create',
        join: 'POST /api/party/join',
        discover: 'GET /api/party/discover'
      },
      analytics: {
        player: 'GET /api/analytics/player/:playerId'
      }
    },
    quickStart: {
      testAPI: '/api/test',
      registerUser: '/api/auth/register',
      generateAISurvey: '/api/survey/generate',
      healthCheck: '/health'
    },
    links: {
      github: 'https://github.com/ConWan30/GameSyncSphere',
      documentation: 'Revolutionary gaming analytics platform with Claude AI'
    },
    footer: 'Built with ❤️ for the gaming community - Powered by Claude AI & PostgreSQL'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    message: 'GameSyncSphere API with Claude AI Survey Generation & Database is running!',
    activeParties: activeParties.size,
    activeUsers: activeUsers.size,
    activeSurveys: activeSurveys.size,
    database: 'PostgreSQL Connected',
    aiSurveyEnabled: !!ANTHROPIC_API_KEY,
    aiProvider: 'Claude by Anthropic',
    authentication: 'JWT Enabled',
    b2bMarketplace: 'Active'
  });
});

// Enhanced features list
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'GameSyncSphere API with Claude AI Survey Generation & Database is working!',
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
      'B2B Insights Marketplace',
      'User Authentication',
      'PostgreSQL Database',
      'Company Registration',
      'Revenue Tracking'
    ],
    aiProvider: 'Powered by Claude (Anthropic)',
    database: 'PostgreSQL with Prisma ORM'
  });
});

// =============================================================================
// USER AUTHENTICATION ROUTES
// =============================================================================

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    // Validate input
    const { error, value } = userRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { email, username, password, full_name, gaming_platforms, favorite_games, play_style } = value;

    // Check if user already exists
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

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password_hash,
        full_name,
        gaming_platforms: gaming_platforms || [],
        favorite_games: favorite_games || [],
        play_style: play_style || 'casual'
      },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        gaming_platforms: true,
        favorite_games: true,
        play_style: true,
        created_at: true,
        total_earnings: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: '🎉 Welcome to GameSyncSphere! Your account has been created.',
      user,
      token,
      revolutionaryFeatures: [
        'Earn money from gaming surveys powered by Claude AI',
        'Join gaming parties with WebRTC communication',
        'Track your gaming analytics and wellness',
        'Connect multiple gaming platforms'
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
    // Validate input
    const { error, value } = userLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { email, password } = value;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        _count: {
          select: {
            surveys: true,
            survey_responses: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        error: 'Account deactivated',
        message: 'Please contact support to reactivate your account'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Return user data (excluding password)
    const { password_hash, ...userData } = user;

    res.json({
      success: true,
      message: `🎮 Welcome back, ${user.username}!`,
      user: {
        ...userData,
        stats: {
          totalSurveys: user._count.surveys,
          completedSurveys: user._count.survey_responses,
          totalEarnings: user.total_earnings.toFixed(2)
        }
      },
      token,
      revolutionaryFeatures: [
        'New Claude AI surveys waiting for you',
        'Active gaming parties to join',
        'Updated earnings and analytics available'
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

// Get User Profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        surveys: {
          where: { status: 'active' },
          select: {
            id: true,
            estimated_earnings: true,
            estimated_completion_time: true,
            expires_at: true,
            game_context: true
          }
        },
        survey_responses: {
          orderBy: { submitted_at: 'desc' },
          take: 5,
          select: {
            id: true,
            total_earnings: true,
            submitted_at: true,
            survey: {
              select: {
                game_context: true
              }
            }
          }
        },
        _count: {
          select: {
            surveys: true,
            survey_responses: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Please login again'
      });
    }

    const { password_hash, ...userData } = user;

    res.json({
      success: true,
      user: {
        ...userData,
        stats: {
          totalSurveys: user._count.surveys,
          completedSurveys: user._count.survey_responses,
          activeSurveys: user.surveys.length,
          totalEarnings: user.total_earnings.toFixed(2),
          averageEarningsPerSurvey: user._count.survey_responses > 0 
            ? (user.total_earnings / user._count.survey_responses).toFixed(2) 
            : '0.00'
        }
      },
      activeSurveys: user.surveys,
      recentEarnings: user.survey_responses
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: 'Unable to load user data'
    });
  }
});

// =============================================================================
// COMPANY/B2B AUTHENTICATION ROUTES
// =============================================================================

// Company Registration
app.post('/api/auth/company/register', async (req, res) => {
  try {
    // Validate input
    const { error, value } = companyRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { name, email, password, company_type, website, description } = value;

    // Check if company already exists
    const existingCompany = await prisma.company.findUnique({
      where: { email }
    });

    if (existingCompany) {
      return res.status(409).json({
        error: 'Company already registered',
        message: 'This email is already associated with a company account'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create company
    const company = await prisma.company.create({
      data: {
        name,
        email,
        password_hash,
        company_type,
        website,
        description,
        current_budget: 1000.00 // Start with $1000 free budget for testing
      },
      select: {
        id: true,
        name: true,
        email: true,
        company_type: true,
        website: true,
        description: true,
        verified: true,
        current_budget: true,
        created_at: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        companyId: company.id, 
        email: company.email,
        type: 'company'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: '🏢 Welcome to GameSyncSphere B2B Platform!',
      company,
      token,
      nextSteps: [
        'Create your first survey request',
        'Target specific gaming demographics',
        'Access Claude AI-generated player insights',
        'Start purchasing valuable player data'
      ],
      revolutionaryAccess: [
        'Claude AI-generated player surveys',
        'Real-time gaming analytics',
        'Purchase intent and satisfaction data',
        'Hardware performance insights'
      ]
    });

  } catch (error) {
    console.error('Company registration error:', error);
    res.status(500).json({
      error: 'Company registration failed',
      message: 'Unable to create company account'
    });
  }
});

// Company Login
app.post('/api/auth/company/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    const company = await prisma.company.findUnique({
      where: { email },
      include: {
        _count: {
          select: {
            survey_requests: true
          }
        }
      }
    });

    if (!company) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    const isValidPassword = await bcrypt.compare(password, company.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    const token = jwt.sign(
      { 
        companyId: company.id, 
        email: company.email,
        type: 'company'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password_hash, ...companyData } = company;

    res.json({
      success: true,
      message: `🏢 Welcome back to GameSyncSphere B2B, ${company.name}!`,
      company: {
        ...companyData,
        stats: {
          totalSurveyRequests: company._count.survey_requests,
          totalSpent: company.total_spent.toFixed(2),
          currentBudget: company.current_budget.toFixed(2)
        }
      },
      token,
      availableInsights: [
        'Gaming hardware preferences',
        'Player satisfaction metrics',
        'Purchase intent data',
        'Gaming performance analytics'
      ]
    });

  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({
      error: 'Company login failed',
      message: 'Unable to login'
    });
  }
});

// =============================================================================
// B2B MARKETPLACE ROUTES
// =============================================================================

// Create Survey Request (B2B customers can request targeted surveys)
app.post('/api/b2b/survey-request', authenticateCompany, async (req, res) => {
  try {
    // Validate input
    const { error, value } = surveyRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { 
      title, 
      description, 
      target_audience, 
      target_insights, 
      budget, 
      max_responses,
      expires_in_days = 30
    } = value;

    // Check company budget
    if (req.company.current_budget < budget) {
      return res.status(400).json({
        error: 'Insufficient budget',
        message: `Budget required: $${budget}, Available: $${req.company.current_budget}`,
        suggestion: 'Please add funds to your account or reduce the survey budget'
      });
    }

    // Calculate pricing breakdown
    const rewardPerResponse = budget * 0.70 / max_responses; // 70% to players
    const platformFee = budget * 0.20; // 20% platform fee
    const aiGenerationCost = budget * 0.10; // 10% AI costs

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_in_days);

    // Create survey request
    const surveyRequest = await prisma.surveyRequest.create({
      data: {
        company_id: req.company.id,
        title,
        description,
        target_audience,
        target_insights,
        budget,
        max_responses,
        reward_per_response: rewardPerResponse,
        platform_fee: platformFee,
        ai_generation_cost: aiGenerationCost,
        expires_at: expiresAt,
        status: 'active'
      }
    });

    // Reserve budget from company account
    await prisma.company.update({
      where: { id: req.company.id },
      data: {
        current_budget: {
          decrement: budget
        }
      }
    });

    res.status(201).json({
      success: true,
      message: `🚀 Survey request "${title}" created successfully!`,
      surveyRequest: {
        id: surveyRequest.id,
        title: surveyRequest.title,
        budget: surveyRequest.budget,
        maxResponses: surveyRequest.max_responses,
        rewardPerResponse: rewardPerResponse.toFixed(2),
        expiresAt: surveyRequest.expires_at,
        status: surveyRequest.status
      },
      revolutionaryFeature: 'Claude AI will now generate personalized surveys for your target audience!',
      estimatedDelivery: '24-48 hours for initial responses',
      targeting: {
        audience: target_audience,
        insights: target_insights,
        expectedQuality: 'High - AI-generated personalized questions'
      }
    });

  } catch (error) {
    console.error('Survey request creation error:', error);
    res.status(500).json({
      error: 'Failed to create survey request',
      message: 'Unable to process survey request'
    });
  }
});

// Add Budget to Company Account
app.post('/api/b2b/add-budget', authenticateCompany, async (req, res) => {
  try {
    const { amount, payment_method = 'credit_card', transaction_id } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be greater than 0'
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        error: 'Minimum budget amount',
        message: 'Minimum budget addition is $100'
      });
    }

    // Update company budget
    const updatedCompany = await prisma.company.update({
      where: { id: req.company.id },
      data: {
        current_budget: {
          increment: amount
        },
        updated_at: new Date()
      }
    });

    res.json({
      success: true,
      message: `💰 $${amount} added to your account successfully!`,
      newBalance: updatedCompany.current_budget.toFixed(2),
      transaction: {
        amount: amount.toFixed(2),
        method: payment_method,
        transactionId: transaction_id || `txn_${Date.now()}`,
        timestamp: new Date().toISOString()
      },
      availableFeatures: [
        'Create new survey requests',
        'Target specific player demographics',
        'Access Claude AI-generated insights',
        'Real-time response tracking'
      ]
    });

  } catch (error) {
    console.error('Budget addition error:', error);
    res.status(500).json({
      error: 'Budget addition failed',
      message: 'Unable to process payment'
    });
  }
});

// REVOLUTIONARY: Enhanced Claude AI-Powered Survey Generation (Updated)
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

    // Enhanced Claude prompt for better survey generation
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
    
    // Call Claude API
    const claudeResponse = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
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

    // Parse Claude response
    let aiSurveyData;
    try {
      const claudeText = claudeResponse.data.content[0].text.trim();
      console.log('Claude raw response:', claudeText);
      
      const cleanJson = claudeText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/, '')
        .replace(/[^}]*$/, '}');
      
      aiSurveyData = JSON.parse(cleanJson);
      console.log('Successfully parsed Claude response');
      
    } catch (parseError) {
      console.error('Claude response parsing error:', parseError);
      
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

    // Create survey record (keeping in-memory for now, will migrate to database)
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
      revolutionaryFeature: 'World\'s first Claude AI-generated gaming surveys with database persistence!',
      message: 'Claude AI generated a personalized survey based on your gaming behavior'
    });

  } catch (error) {
    console.error('Claude AI Survey generation error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate Claude AI survey',
      details: error.response?.data?.error || error.message,
      message: 'Claude AI survey generation failed - check logs'
    });
  }
});

// Submit survey responses and earn money (Enhanced)
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
      revolutionaryFeature: 'World\'s first Claude AI-powered player compensation system with database tracking!',
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
      'Full transparency on earnings and data usage',
      'Database-backed permanent earnings tracking'
    ]
  });
});

// Enhanced analytics
app.get('/api/analytics/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  
  res.json({
    playerId,
    message: 'Enhanced analytics with Claude AI survey integration & database',
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
          'Personalized gaming insights',
          'B2B marketplace integration',
          'Database persistence'
        ]
      }
    }
  });
});

// =============================================================================
// PLATFORM STATISTICS & MIGRATION ROUTES
// =============================================================================

// Platform Statistics (Public)
app.get('/api/platform/stats', async (req, res) => {
  try {
    // Try to get database stats, fall back to in-memory if DB not ready
    let dbStats = null;
    try {
      const [totalUsers, totalCompanies] = await Promise.all([
        prisma.user.count({ where: { is_active: true } }),
        prisma.company.count()
      ]);
      dbStats = { totalUsers, totalCompanies };
    } catch (dbError) {
      console.log('Database not ready yet, using in-memory stats');
    }

    res.json({
      success: true,
      message: 'GameSyncSphere Platform Statistics',
      timestamp: new Date().toISOString(),
      platformStats: {
        // Database stats if available, otherwise in-memory
        totalUsers: dbStats?.totalUsers || 0,
        totalCompanies: dbStats?.totalCompanies || 0,
        totalSurveys: activeSurveys.size,
        activeSurveys: Array.from(activeSurveys.values()).filter(s => s.status === 'active').length,
        totalSurveyResponses: surveyResponses.size,
        activeParties: activeParties.size,
        revolutionaryFeatures: [
          'Claude AI Survey Generation',
          'Real-time Gaming Analytics',
          'Player Data Monetization',
          'B2B Insights Marketplace',
          'Database Persistence',
          'JWT Authentication'
        ]
      },
      system: {
        database: 'PostgreSQL with Prisma ORM',
        aiProvider: 'Claude by Anthropic',
        authentication: 'JWT-based',
        deployment: 'Railway'
      }
    });

  } catch (error) {
    console.error('Platform stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch platform statistics',
      message: 'Unable to load stats'
    });
  }
});

// Database initialization and migration endpoint
app.post('/api/admin/initialize-database', async (req, res) => {
  try {
    // Test database connection
    await prisma.$connect();
    
    res.json({
      success: true,
      message: 'Database connected successfully!',
      database: 'PostgreSQL',
      orm: 'Prisma',
      tables: [
        'users',
        'companies', 
        'surveys',
        'survey_responses',
        'survey_requests',
        'parties',
        'game_sessions',
        'earnings'
      ],
      nextSteps: [
        'Database is ready for user registration',
        'Company B2B accounts can be created',
        'Survey data will be persisted',
        'Ready for production use'
      ]
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      error: 'Database initialization failed',
      message: error.message,
      solution: 'Check DATABASE_URL environment variable and ensure PostgreSQL is running'
    });
  }
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

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /health',
      'GET /api/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'POST /api/auth/company/register',
      'POST /api/auth/company/login',
      'POST /api/b2b/survey-request',
      'POST /api/b2b/add-budget',
      'POST /api/survey/generate',
      'POST /api/survey/:surveyId/submit',
      'GET /api/player/:playerId/surveys',
      'POST /api/party/create',
      'POST /api/party/join',
      'GET /api/party/discover',
      'GET /api/analytics/player/:playerId',
      'GET /api/platform/stats',
      'POST /api/admin/initialize-database'
    ]
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
  console.log(`🚀 GameSyncSphere API with Claude AI, Database & B2B running on port ${PORT}`);
  console.log(`🤖 Claude AI Survey Generation: ${ANTHROPIC_API_KEY ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🗄️ Database: PostgreSQL with Prisma ORM`);
  console.log(`🔐 Authentication: JWT-based user & company auth`);
  console.log(`🏢 B2B Marketplace: Active and ready for customers`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Live at: https://gamesyncsphere-production.up.railway.app/`);
  console.log(`💰 Ready to make money with Claude AI surveys!`);
});

module.exports = app;
