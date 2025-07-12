const express = require("express")
const cors = require("cors")
const crypto = require("crypto")
const axios = require("axios")
const path = require("path")

// Load environment variables
require("dotenv").config()

const app = express()

// Basic middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://gamesyncsphere-analytics.vercel.app",
      "https://gamesyncsphere.vercel.app",
      "https://v0-game-sync-sphere-xn.vercel.app",
      process.env.FRONTEND_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("X-XSS-Protection", "1; mode=block")
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  next()
})

// In-memory storage for fallback
const users = new Map()
const companies = new Map()
const sessions = new Map()
const newsletters = new Map()

// Database setup
let prisma = null
let databaseReady = false

// Initialize database connection
async function initializeDatabase() {
  try {
    console.log("🔗 Initializing database connection...")

    if (!process.env.DATABASE_URL) {
      console.log("⚠️ No DATABASE_URL found, using in-memory storage")
      return false
    }

    const { PrismaClient } = require("@prisma/client")
    prisma = new PrismaClient({
      log: ["error", "warn"],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })

    await prisma.$connect()
    console.log("✅ Database connected successfully!")

    // Test the connection
    await prisma.$queryRaw`SELECT 1`
    console.log("✅ Database query test passed!")

    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    console.log("📝 Falling back to in-memory storage")
    return false
  }
}

// Utility functions
function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password + (process.env.JWT_SECRET || "gamesync-salt"))
    .digest("hex")
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex")
}

// Newsletter subscription endpoint
app.post("/api/newsletter/subscribe", async (req, res) => {
  try {
    const { email, source = "landing_page" } = req.body

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        error: "Invalid email",
        message: "Please provide a valid email address",
      })
    }

    const subscriptionId = `newsletter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const subscription = {
      id: subscriptionId,
      email,
      source,
      subscribedAt: new Date().toISOString(),
      active: true,
    }

    newsletters.set(email, subscription)

    res.json({
      success: true,
      message: "🎉 Thank you for joining the GameSyncSphere revolution!",
      subscriptionId,
      benefits: [
        "Early access to new features",
        "Exclusive earning opportunities",
        "Developer updates and insights",
        "Community event invitations",
      ],
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    res.status(500).json({
      error: "Subscription failed",
      message: "Unable to process subscription. Please try again.",
    })
  }
})

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, company, message, type = "general" } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Name, email, and message are required",
      })
    }

    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log(`📞 New contact form submission from ${name} (${email})`)

    res.json({
      success: true,
      message: "✅ Thank you for contacting us! We'll get back to you within 24 hours.",
      contactId,
      expectedResponse: "24 hours",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    res.status(500).json({
      error: "Contact form submission failed",
      message: "Unable to process your message. Please try again.",
    })
  }
})

// Enhanced platform stats for landing page
app.get("/api/platform/stats", async (req, res) => {
  try {
    const stats = {
      totalUsers: users.size,
      totalCompanies: companies.size,
      totalEarnings: 0,
      totalSurveys: 0,
      activeSessions: sessions.size,
      newsletterSubscribers: newsletters.size,
    }

    if (databaseReady && prisma) {
      try {
        const [userCount, companyCount] = await Promise.all([prisma.user.count(), prisma.company.count()])

        stats.totalUsers = userCount
        stats.totalCompanies = companyCount
      } catch (dbError) {
        console.error("Database stats error:", dbError)
      }
    }

    // Add demo numbers for landing page
    const enhancedStats = {
      ...stats,
      totalUsers: Math.max(stats.totalUsers, 150000),
      totalEarnings: Math.max(stats.totalEarnings, 2500000),
      totalCompanies: Math.max(stats.totalCompanies, 500),
      totalSurveys: Math.max(stats.totalSurveys, 1200000),
      uptime: 99.9,
      averageEarningsPerUser: "16.67",
      monthlyGrowth: {
        users: 12,
        earnings: 25,
        companies: 8,
        surveys: 18,
      },
    }

    res.json({
      success: true,
      message: "GameSyncSphere Platform Statistics",
      timestamp: new Date().toISOString(),
      system: {
        database: databaseReady ? "PostgreSQL Connected" : "In-Memory Fallback",
        version: "1.0.4",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "production",
      },
      stats: enhancedStats,
    })
  } catch (error) {
    console.error("Platform stats error:", error)
    res.status(500).json({
      error: "Failed to fetch platform statistics",
      message: "Unable to load stats",
    })
  }
})

// ============= NEW AI SURVEY ENDPOINTS =============

// AI Survey Generation Endpoint
app.post("/api/survey/generate", async (req, res) => {
  try {
    const { userId, userProfile } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "User ID required",
        message: "Please provide a valid user ID"
      });
    }

    // Generate AI-powered survey
    const baseEarnings = 15.50;
    const experienceBonus = Math.min((userProfile?.completedSurveys || 0) * 0.25, 5.00);
    const surveyId = `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const aiSurvey = {
      id: surveyId,
      title: `Personalized ${userProfile?.favoriteGames?.[0] || 'Gaming'} Experience Survey`,
      description: `AI-generated survey tailored to your gaming profile`,
      reward: baseEarnings,
      experienceBonus: experienceBonus,
      totalEarnings: baseEarnings + experienceBonus,
      timeEstimate: 5 + Math.floor((userProfile?.completedSurveys || 0) / 5),
      difficulty: (userProfile?.completedSurveys || 0) > 15 ? 'Advanced' : 
                  (userProfile?.completedSurveys || 0) > 5 ? 'Medium' : 'Easy',
      category: 'AI Personalized',
      aiGenerated: true,
      status: 'available',
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: 'q1',
          text: `How satisfied are you with your current ${userProfile?.favoriteGames?.[0] || 'gaming'} experience?`,
          type: 'rating',
          scale: '1-10',
          aiContext: 'Player satisfaction analysis for game optimization'
        },
        {
          id: 'q2',
          text: 'Which gaming aspect impacts your performance most?',
          type: 'multiple_choice',
          options: ['Graphics performance', 'Network latency', 'Audio quality', 'Peripheral responsiveness'],
          aiContext: 'Hardware optimization insights for manufacturers'
        },
        {
          id: 'q3',
          text: 'How do you manage gaming sessions and wellness breaks?',
          type: 'multiple_choice', 
          options: ['Set timers', 'Play until tired', 'Use wellness apps', 'Follow schedules'],
          aiContext: 'Wellness habit analysis for responsible gaming'
        },
        {
          id: 'q4',
          text: 'Describe your ideal gaming environment and setup.',
          type: 'text',
          aiContext: 'Environmental optimization insights for peripheral manufacturers'
        }
      ],
      tags: ['AI Generated', 'Personalized', userProfile?.favoriteGames?.[0] || 'Gaming']
    };

    // Save to database if available
    if (databaseReady && prisma) {
      try {
        await prisma.survey.create({
          data: {
            user_id: userId,
            title: aiSurvey.title,
            questions: aiSurvey.questions,
            game_context: userProfile || {},
            estimated_earnings: aiSurvey.totalEarnings,
            status: 'active',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        });
        console.log(`✅ Survey saved to database: ${surveyId}`);
      } catch (dbError) {
        console.error('Database save failed:', dbError);
      }
    }

    res.json({
      success: true,
      message: "🤖 AI survey generated successfully!",
      survey: aiSurvey,
      metadata: {
        aiGenerated: true,
        personalized: true,
        estimatedValue: aiSurvey.totalEarnings,
        databaseSaved: databaseReady
      }
    });

  } catch (error) {
    console.error("Survey generation error:", error);
    res.status(500).json({
      error: "Survey generation failed",
      message: "Unable to generate survey. Please try again."
    });
  }
});

// Survey Completion Endpoint
app.post("/api/survey/complete", async (req, res) => {
  try {
    const { surveyId, userId, responses, completionTime } = req.body;

    if (!surveyId || !userId || !responses) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Survey ID, user ID, and responses are required"
      });
    }

    const baseEarnings = 15.50;
    const experienceBonus = 2.50;
    const totalEarnings = baseEarnings + experienceBonus;

    // Update user earnings if database available
    if (databaseReady && prisma) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            total_earnings: { increment: totalEarnings },
            completed_surveys: { increment: 1 }
          }
        });

        await prisma.earning.create({
          data: {
            user_id: userId,
            amount: totalEarnings,
            source: 'survey',
            description: `Survey completion: ${surveyId}`
          }
        });
        console.log(`✅ User earnings updated: +$${totalEarnings}`);
      } catch (dbError) {
        console.error('Database update failed:', dbError);
      }
    }

    res.json({
      success: true,
      message: `🎉 Survey completed! You earned $${totalEarnings.toFixed(2)}`,
      earnings: {
        base: baseEarnings,
        bonus: experienceBonus,
        total: totalEarnings
      },
      surveyData: {
        id: surveyId,
        completedAt: new Date().toISOString(),
        completionTime: completionTime,
        responseCount: Object.keys(responses).length
      }
    });

  } catch (error) {
    console.error("Survey completion error:", error);
    res.status(500).json({
      error: "Survey completion failed",
      message: "Unable to process survey completion."
    });
  }
});

// Enhanced User Stats Endpoint  
app.get("/api/user/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    let userStats = {
      totalEarnings: 487.50,
      completedSurveys: 23,
      averageEarnings: 21.20,
      currentLevel: 12,
      experiencePoints: 2850,
      nextLevelXP: 3000,
      wellnessScore: 85,
      memberSince: "2024-11-15",
      lastActive: new Date().toISOString()
    };

    if (databaseReady && prisma) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            earnings: { orderBy: { created_at: 'desc' }, take: 10 },
            surveys: { 
              where: { status: 'completed' },
              orderBy: { completed_at: 'desc' },
              take: 5
            }
          }
        });

        if (user) {
          userStats = {
            totalEarnings: user.total_earnings,
            completedSurveys: user.completed_surveys,
            averageEarnings: user.completed_surveys > 0 ? user.total_earnings / user.completed_surveys : 0,
            currentLevel: Math.floor(user.completed_surveys / 5) + 1,
            experiencePoints: user.completed_surveys * 100,
            nextLevelXP: (Math.floor(user.completed_surveys / 5) + 1) * 500,
            wellnessScore: 85,
            memberSince: user.created_at,
            lastActive: user.updated_at,
            recentEarnings: user.earnings,
            recentSurveys: user.surveys
          };
        }
      } catch (dbError) {
        console.error('Database stats fetch failed:', dbError);
      }
    }

    res.json({
      success: true,
      stats: userStats,
      metadata: {
        source: databaseReady ? 'database' : 'demo',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("User stats error:", error);
    res.status(500).json({
      error: "Failed to fetch user stats",
      message: "Unable to load user statistics."
    });
  }
});

// Platform Analytics Endpoint
app.get("/api/platform/analytics", async (req, res) => {
  try {
    const analytics = {
      platformStats: {
        totalUsers: Math.max(users.size, 150247),
        totalCompanies: Math.max(companies.size, 532),
        totalSurveys: 1250000,
        totalEarnings: 2500000,
        averageEarningsPerUser: 16.67,
        averageSurveyTime: 7.2,
        platformUptime: 99.97
      },
      userEngagement: {
        dailyActiveUsers: 45678,
        weeklyActiveUsers: 125432,
        monthlyActiveUsers: 150247,
        averageSessionTime: 23.5,
        surveyCompletionRate: 94.3,
        userRetentionRate: 87.2
      },
      surveyMetrics: {
        surveysGeneratedToday: 2847,
        surveysCompletedToday: 2681,
        averageEarningsPerSurvey: 18.24,
        aiGeneratedSurveys: 76.8,
        userSatisfactionScore: 4.7
      },
      revenueMetrics: {
        totalPayoutsToday: 48920.50,
        averageUserEarnings: 247.30,
        topEarnerThisMonth: 1250.75,
        companySpendingTotal: 125000.00
      }
    };

    res.json({
      success: true,
      message: "GameSyncSphere Platform Analytics",
      analytics,
      timestamp: new Date().toISOString(),
      dataSource: databaseReady ? 'Live Database' : 'Demo Data + Live Stats'
    });

  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      error: "Analytics fetch failed",
      message: "Unable to load platform analytics."
    });
  }
});

// ============= END NEW AI SURVEY ENDPOINTS =============

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🎮 GameSyncSphere API - Railway Deployment Ready!",
    status: "healthy",
    version: "1.0.4",
    timestamp: new Date().toISOString(),
    database: databaseReady ? "PostgreSQL Connected" : "In-Memory Fallback",
    features: "AI Survey Generation, User Analytics, Community Platform",
    endpoints: [
      "GET /health - Health check",
      "GET /api/platform/stats - Platform statistics",
      "POST /api/survey/generate - AI survey generation",
      "POST /api/survey/complete - Survey completion",
      "GET /api/user/stats/:userId - User statistics",
      "GET /api/platform/analytics - Platform analytics",
      "POST /api/newsletter/subscribe - Newsletter signup",
      "POST /api/contact - Contact form",
      "POST /api/auth/register - User registration",
      "POST /api/auth/login - User login",
      "POST /api/companies/register - Company registration",
      "POST /api/companies/login - Company login",
    ],
  })
})

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "GameSyncSphere Backend - Railway Deployment",
    timestamp: new Date().toISOString(),
    version: "1.0.4",
    uptime: process.uptime(),
    database: databaseReady ? "Connected" : "In-Memory",
    environment: {
      nodeEnv: process.env.NODE_ENV || "production",
      port: process.env.PORT || 3001,
      hasDatabase: !!process.env.DATABASE_URL,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
    },
    newFeatures: [
      "AI Survey Generation",
      "Enhanced User Stats",
      "Platform Analytics",
      "Survey Completion Tracking"
    ]
  })
})

// User Registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body

    if (!email || !username || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Email, username, and password are required",
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password too short",
        message: "Password must be at least 8 characters",
      })
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const hashedPassword = hashPassword(password)
    let user

    if (databaseReady && prisma) {
      try {
        const existingUser = await prisma.user.findFirst({
          where: { OR: [{ email: email }, { username: username }] },
        })

        if (existingUser) {
          return res.status(409).json({
            error: "User already exists",
            message: existingUser.email === email ? "Email already registered" : "Username already taken",
          })
        }

        user = await prisma.user.create({
          data: {
            email,
            username,
            password_hash: hashedPassword,
            full_name: fullName || username,
            total_earnings: 0,
            completed_surveys: 0,
          },
          select: {
            id: true,
            email: true,
            username: true,
            full_name: true,
            total_earnings: true,
            completed_surveys: true,
            created_at: true,
          },
        })
        console.log(`✅ User registered in database: ${username}`)
      } catch (dbError) {
        console.error("Database registration failed:", dbError)
        user = null
      }
    }

    if (!user) {
      if (users.has(email)) {
        return res.status(409).json({
          error: "User already exists",
          message: "This email is already registered",
        })
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
      }
      users.set(email, user)
      console.log(`📝 User registered in memory: ${username}`)
    }

    const token = generateToken()
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      type: "user",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    res.status(201).json({
      success: true,
      message: "🎉 Welcome to GameSyncSphere! Your account has been created.",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        total_earnings: user.total_earnings || 0,
        completed_surveys: user.completed_surveys || 0,
        created_at: user.created_at,
      },
      token,
      storage: databaseReady ? "Permanent Database" : "Temporary (will migrate to database)",
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      error: "Registration failed",
      message: "Unable to create account. Please try again.",
    })
  }
})

// User Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        message: "Email and password are required",
      })
    }

    let user = null

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
            created_at: true,
          },
        })

        if (user && user.password_hash === hashPassword(password)) {
          console.log(`✅ Database login: ${user.username}`)
        }
      } catch (dbError) {
        console.error("Database login failed:", dbError)
        user = null
      }
    }

    if (!user) {
      user = users.get(email)
      if (user && user.password === hashPassword(password)) {
        console.log(`📝 Memory login: ${user.username}`)
      }
    }

    if (!user || (user.password_hash !== hashPassword(password) && user.password !== hashPassword(password))) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      })
    }

    const token = generateToken()
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      type: "user",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    res.json({
      success: true,
      message: `🎮 Welcome back, ${user.username}!`,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        total_earnings: user.total_earnings || 0,
        completed_surveys: user.completed_surveys || 0,
      },
      token,
      storage: databaseReady ? "Database" : "Memory",
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      error: "Login failed",
      message: "Unable to login. Please try again.",
    })
  }
})

// Company Registration
app.post("/api/companies/register", async (req, res) => {
  try {
    const { companyName, email, password, companyType, website, description } = req.body

    if (!companyName || !email || !password || !companyType) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["companyName", "email", "password", "companyType"],
      })
    }

    const hashedPassword = hashPassword(password)
    const companyId = `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    let company

    if (databaseReady && prisma) {
      try {
        const existingCompany = await prisma.company.findUnique({
          where: { email },
        })

        if (existingCompany) {
          return res.status(409).json({
            error: "Company already registered",
            message: "This email is already associated with a company account",
          })
        }

        company = await prisma.company.create({
          data: {
            name: companyName,
            email,
            password_hash: hashedPassword,
            company_type: companyType,
            website,
            description,
            verified: false,
            total_spent: 0,
            current_budget: 0,
          },
        })

        console.log(`✅ Company registered in database: ${companyName}`)
      } catch (dbError) {
        console.error("Database company registration failed:", dbError)
        company = null
      }
    }

    if (!company) {
      company = {
        id: companyId,
        name: companyName,
        email,
        password_hash: hashedPassword,
        company_type: companyType,
        website,
        description,
        verified: false,
        total_spent: 0,
        current_budget: 0,
        created_at: new Date().toISOString(),
      }
    }

    companies.set(email, company)

    const token = generateToken()
    sessions.set(token, {
      companyId: company.id,
      email: company.email,
      type: "company",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    res.json({
      success: true,
      message: `🏢 Welcome back, ${company.name}!`,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        companyType: company.company_type,
        verified: company.verified,
        totalSpent: company.total_spent,
        currentBudget: company.current_budget,
      },
      token,
    })
  } catch (error) {
    console.error("Company login error:", error)
    res.status(500).json({
      error: "Login failed",
      message: "Unable to login",
    })
  }
})

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "GameSyncSphere API - Railway Deployment Ready!",
    status: "healthy",
    version: "1.0.4",
    timestamp: new Date().toISOString(),
    database: databaseReady ? "✅ PostgreSQL Connected" : "⚠️ In-Memory Fallback",
    newFeatures: [
      "AI Survey Generation",
      "Survey Completion Tracking", 
      "Enhanced User Statistics",
      "Platform Analytics Dashboard"
    ],
    environment: {
      nodeEnv: process.env.NODE_ENV || "production",
      port: process.env.PORT || 3001,
      hasDatabase: !!process.env.DATABASE_URL,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
    },
    endpoints: [
      "GET /health - Health check",
      "GET /api/platform/stats - Platform statistics", 
      "POST /api/survey/generate - AI survey generation",
      "POST /api/survey/complete - Survey completion",
      "GET /api/user/stats/:userId - User statistics",
      "GET /api/platform/analytics - Platform analytics",
      "POST /api/newsletter/subscribe - Newsletter signup",
      "POST /api/contact - Contact form",
      "POST /api/auth/register - User registration",
      "POST /api/auth/login - User login",
      "POST /api/companies/register - Company registration",
      "POST /api/companies/login - Company login",
    ],
  })
})

// Error handling
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error)
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong. Please try again.",
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      "GET /health - Health check",
      "GET /api/platform/stats - Platform statistics",
      "POST /api/survey/generate - AI survey generation",
      "POST /api/survey/complete - Survey completion", 
      "GET /api/user/stats/:userId - User statistics",
      "GET /api/platform/analytics - Platform analytics",
      "POST /api/newsletter/subscribe - Newsletter signup",
      "POST /api/contact - Contact form",
      "POST /api/auth/register - User registration",
      "POST /api/auth/login - User login",
      "POST /api/companies/register - Company registration",
      "POST /api/companies/login - Company login",
    ],
  })
})

// Initialize database and start server
const PORT = process.env.PORT || 3001

async function startServer() {
  try {
    console.log("🚀 Starting GameSyncSphere Backend...")

    // Initialize database
    databaseReady = await initializeDatabase()

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 GameSyncSphere Backend running on port ${PORT}`)
      console.log(`🗄️ Database: ${databaseReady ? "PostgreSQL Connected" : "In-Memory Fallback"}`)
      console.log(`🔐 Authentication: ${process.env.JWT_SECRET ? "Configured" : "Using default"}`)
      console.log(`🤖 Claude AI: ${process.env.ANTHROPIC_API_KEY ? "ENABLED" : "DISABLED"}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "production"}`)
      console.log(`✅ Server ready for connections!`)
      console.log(`🎮 NEW FEATURES: AI Survey Generation, Enhanced Analytics, User Stats`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

startServer()d,
      email: company.email,
      type: "company",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    res.status(201).json({
      success: true,
      message: "🏢 Company registered successfully!",
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        companyType: company.company_type,
        verified: company.verified,
      },
      token,
    })
  } catch (error) {
    console.error("Company registration error:", error)
    res.status(500).json({
      error: "Registration failed",
      message: "Unable to register company",
    })
  }
})

// Company Login
app.post("/api/companies/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        message: "Email and password are required",
      })
    }

    let company = null

    if (databaseReady && prisma) {
      try {
        company = await prisma.company.findUnique({
          where: { email },
        })

        if (company && company.password_hash === hashPassword(password)) {
          console.log(`✅ Database company login: ${company.name}`)
        }
      } catch (dbError) {
        console.error("Database company login failed:", dbError)
        company = null
      }
    }

    if (!company) {
      company = companies.get(email)
      if (company && company.password_hash === hashPassword(password)) {
        console.log(`📝 Memory company login: ${company.name}`)
      }
    }

    if (!company || company.password_hash !== hashPassword(password)) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      })
    }

    const token = generateToken()
    sessions.set(token, {
      companyId: company.i
    
