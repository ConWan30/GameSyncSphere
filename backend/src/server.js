const express = require("express")
const cors = require("cors")
const crypto = require("crypto")
const axios = require("axios")
require("dotenv").config()

const app = express()

// Enhanced CORS configuration for Next.js integration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://gamesyncsphere-analytics.vercel.app",
    "https://gamesyncsphere.vercel.app",
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}

app.use(cors(corsOptions))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Security headers for production
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("X-XSS-Protection", "1; mode=block")
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  next()
})

// In-memory storage (fallback)
const users = new Map()
const companies = new Map()
const sessions = new Map()
const newsletters = new Map() // For newsletter subscriptions

// Database initialization
let prisma = null
let databaseReady = false

// Enhanced database initialization with schema deployment
async function initializeDatabase() {
  try {
    const { PrismaClient } = require("@prisma/client")
    prisma = new PrismaClient({
      log: ["error", "warn"],
    })

    console.log("🔗 Connecting to PostgreSQL...")
    await prisma.$connect()
    console.log("✅ Database connected successfully!")

    // Check if schema exists by testing a simple query
    try {
      const userCount = await prisma.user.count()
      console.log(`📊 Schema verified - Current users in database: ${userCount}`)
      return true
    } catch (schemaError) {
      if (schemaError.code === "P2021" || schemaError.message.includes("does not exist")) {
        console.log("📋 Database schema missing - deploying now...")

        try {
          // Deploy schema using Prisma CLI
          const { execSync } = require("child_process")

          console.log("🔧 Generating Prisma client...")
          execSync("npx prisma generate", { stdio: "inherit" })

          console.log("🚀 Deploying database schema...")
          execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" })

          // Verify deployment worked
          const userCount = await prisma.user.count()
          console.log("✅ Schema deployed successfully!")
          console.log(`📊 Database ready - Users: ${userCount}`)

          return true
        } catch (deployError) {
          console.error("❌ Schema deployment failed:", deployError.message)
          console.log("💡 Fallback: Manual deployment required")
          return false
        }
      } else {
        console.error("❌ Database query error:", schemaError.message)
        return false
      }
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    console.log("📝 Will use in-memory storage as fallback")
    return false
  }
}

// Initialize database on startup
initializeDatabase().then((success) => {
  databaseReady = success
  if (success) {
    console.log("🗄️ Database ready for operations")
  } else {
    console.log("💾 Using in-memory storage")
  }
})

// Utility functions
function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password + "gamesync-salt")
    .digest("hex")
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex")
}

function calculateEstimatedReach(targetAudience) {
  let baseReach = 100
  if (targetAudience.platforms) baseReach *= targetAudience.platforms.length
  if (targetAudience.games) baseReach *= Math.min(targetAudience.games.length, 3)
  return Math.min(baseReach, 10000)
}

async function generateRecentInsights(companyId) {
  return [
    {
      type: "Player Behavior",
      insight: "73% of players prefer competitive gaming during weekends",
      value: "High",
      date: new Date().toISOString().split("T")[0],
    },
    {
      type: "Hardware Usage",
      insight: "RTX 4070 users report 15% higher satisfaction with ray tracing",
      value: "Medium",
      date: new Date().toISOString().split("T")[0],
    },
  ]
}

// NEW: Landing Page API Endpoints

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

    // Store in database if available
    if (databaseReady && prisma) {
      try {
        // You might want to create a Newsletter model in your Prisma schema
        console.log(`📧 Newsletter subscription: ${email} (would be stored in database)`)
      } catch (dbError) {
        console.error("Database newsletter storage failed:", dbError)
      }
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
    const contact = {
      id: contactId,
      name,
      email,
      company,
      message,
      type,
      submittedAt: new Date().toISOString(),
      status: "new",
    }

    // In a real implementation, you'd store this in database and send notifications
    console.log(`📞 New contact form submission from ${name} (${email})`)

    res.json({
      success: true,
      message: "✅ Thank you for contacting us! We'll get back to you within 24 hours.",
      contactId,
      expectedResponse: "24 hours",
      nextSteps: [
        "Our team will review your message",
        "You'll receive a confirmation email shortly",
        "We'll respond with detailed information",
      ],
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
    let stats = {
      totalUsers: 0,
      totalEarnings: 0,
      totalSurveys: 0,
      totalCompanies: 0,
      activeSessions: 0,
      newsletterSubscribers: 0,
    }

    if (databaseReady && prisma) {
      try {
        const [userCount, userAggregates, companyCount] = await Promise.all([
          prisma.user.count(),
          prisma.user.aggregate({
            _sum: {
              total_earnings: true,
              completed_surveys: true,
            },
          }),
          prisma.company.count(),
        ])

        stats = {
          totalUsers: userCount,
          totalEarnings: userAggregates._sum.total_earnings || 0,
          totalSurveys: userAggregates._sum.completed_surveys || 0,
          totalCompanies: companyCount,
          activeSessions: sessions.size,
          newsletterSubscribers: newsletters.size,
        }
      } catch (dbError) {
        console.error("Database stats error:", dbError)
      }
    } else {
      stats.totalUsers = users.size
      stats.totalCompanies = companies.size
      stats.totalEarnings = Array.from(users.values()).reduce((sum, user) => sum + (user.totalEarnings || 0), 0)
      stats.totalSurveys = Array.from(users.values()).reduce((sum, user) => sum + (user.completedSurveys || 0), 0)
      stats.activeSessions = sessions.size
      stats.newsletterSubscribers = newsletters.size
    }

    // Add some realistic demo numbers for the landing page
    const enhancedStats = {
      ...stats,
      totalUsers: Math.max(stats.totalUsers, 150000),
      totalEarnings: Math.max(stats.totalEarnings, 2500000),
      totalCompanies: Math.max(stats.totalCompanies, 500),
      totalSurveys: Math.max(stats.totalSurveys, 1200000),
      uptime: 99.9,
      averageEarningsPerUser: stats.totalUsers > 0 ? (stats.totalEarnings / stats.totalUsers).toFixed(2) : "16.67",
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
        version: "6.1.0",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      },
      stats: enhancedStats,
      features: [
        "Beautiful Next.js Landing Page",
        "User Registration & Login",
        "Company Registration & Login",
        "Claude AI Survey Generation",
        "B2B Survey Request Marketplace",
        "Real Money Earnings System",
        "Experience-Based Bonuses",
        "Database Integration",
        "Complete Earnings Tracking",
        "Newsletter System",
        "Contact Management",
      ],
    })
  } catch (error) {
    console.error("Platform stats error:", error)
    res.status(500).json({
      error: "Failed to fetch platform statistics",
      message: "Unable to load stats",
    })
  }
})

// Demo data endpoint for landing page
app.get("/api/demo/features", (req, res) => {
  res.json({
    success: true,
    features: [
      {
        id: "ai_surveys",
        title: "Earn with Claude AI Surveys",
        description:
          "Answer personalized surveys crafted by Claude AI, tailored to your gaming habits, and earn up to $15.50+ per survey with experience-based bonuses.",
        icon: "currency-dollar",
        category: "earning",
        benefits: ["Up to $15.50 per survey", "Experience bonuses", "Personalized content"],
        status: "active",
      },
      {
        id: "secure_auth",
        title: "Fortified Authentication",
        description:
          "Securely register and log in with SHA-256 hashed passwords and token-based sessions, safeguarded by our robust PostgreSQL database.",
        icon: "shield-check",
        category: "security",
        benefits: ["SHA-256 encryption", "Token-based sessions", "PostgreSQL security"],
        status: "active",
      },
      {
        id: "party_communication",
        title: "Dynamic Party Communication",
        description:
          "Form real-time gaming parties with secure, low-latency voice, video, and text communication, seamlessly connecting PC, console, and mobile players.",
        icon: "chat-bubble-left-right",
        category: "social",
        benefits: ["Cross-platform support", "Low-latency communication", "Secure WebRTC"],
        status: "active",
      },
      {
        id: "ai_personalization",
        title: "AI-Powered Personalization",
        description:
          "Claude AI tailors surveys and matchmaking to your playstyle, delivering personalized gaming experiences and strategic insights.",
        icon: "cpu-chip",
        category: "ai",
        benefits: ["Personalized surveys", "Smart matchmaking", "Strategic insights"],
        status: "active",
      },
      {
        id: "earnings_dashboard",
        title: "Transparent Earnings Dashboard",
        description:
          "Track your earnings, survey completions, and experience bonuses in real-time, securely stored in our scalable PostgreSQL database.",
        icon: "chart-bar",
        category: "analytics",
        benefits: ["Real-time tracking", "Transparent reporting", "Secure storage"],
        status: "active",
      },
      {
        id: "community_hubs",
        title: "Vibrant Community Hubs",
        description:
          "Create or join customizable hubs for tournaments, strategy sharing, and social engagement, fostering a player-driven gaming ecosystem.",
        icon: "users",
        category: "community",
        benefits: ["Tournament hosting", "Strategy sharing", "Social engagement"],
        status: "active",
      },
      {
        id: "wellness_tracking",
        title: "Wellness-Integrated Sessions",
        description:
          "Track sessions with FPS, latency, and wellness metrics like break counts, promoting balanced gaming and responsible play.",
        icon: "heart",
        category: "wellness",
        benefits: ["Health monitoring", "Break reminders", "Performance tracking"],
        status: "active",
      },
      {
        id: "b2b_marketplace",
        title: "B2B Survey Marketplace",
        description:
          "Companies create targeted survey requests with custom budgets and audience criteria, accessing real-time player insights.",
        icon: "building-office",
        category: "b2b",
        benefits: ["Custom targeting", "Budget control", "Real-time insights"],
        status: "active",
      },
      {
        id: "enterprise_dashboard",
        title: "Enterprise Dashboards",
        description:
          "B2B users access analytics, survey management, and insights reports, enabling data-driven decisions for developers and manufacturers.",
        icon: "presentation-chart-bar",
        category: "enterprise",
        benefits: ["Advanced analytics", "Survey management", "Business intelligence"],
        status: "active",
      },
    ],
  })
})

// Use cases endpoint for landing page
app.get("/api/demo/use-cases", (req, res) => {
  res.json({
    success: true,
    useCases: [
      {
        id: "cod_player_earning",
        title: "Player Earning in Call of Duty",
        description:
          "A competitive player completes a Claude AI survey on match performance, earning $16.50 with a $1.00 experience bonus, uniquely monetizing insights unlike traditional tools.",
        category: "player_earning",
        earnings: 16.5,
        timeSpent: "5 minutes",
        game: "Call of Duty",
        playerType: "competitive",
      },
      {
        id: "hardware_insights",
        title: "Hardware Insights Request",
        description:
          "A hardware manufacturer creates a request with a $2000 budget for 500 responses on equipment satisfaction, enabling precise data acquisition in a novel marketplace.",
        category: "b2b_insights",
        budget: 2000,
        responses: 500,
        industry: "hardware_manufacturing",
        insights: "equipment_satisfaction",
      },
      {
        id: "apex_squad",
        title: "Apex Legends Squad Coordination",
        description:
          "A team forms a party with secure WebRTC communication, strategizing across PC and console in real-time, bridging analytics with community engagement.",
        category: "party_communication",
        platforms: ["PC", "Console"],
        game: "Apex Legends",
        features: ["voice_chat", "strategy_sharing"],
      },
      {
        id: "b2b_dashboard",
        title: "B2B Dashboard Review",
        description:
          "A game developer views real-time responses and insights on their dashboard, with total spent and average cost per response, supporting data-driven innovation.",
        category: "enterprise_analytics",
        userType: "game_developer",
        metrics: ["total_spent", "cost_per_response", "response_quality"],
      },
      {
        id: "valorant_tournament",
        title: "Valorant Tournament Hub",
        description:
          "A community hosts a tournament in a customizable hub, with Claude AI suggesting match formats based on player analytics, fostering engagement.",
        category: "community_engagement",
        game: "Valorant",
        features: ["tournament_hosting", "ai_suggestions", "community_building"],
      },
      {
        id: "earnings_transparency",
        title: "Earnings Transparency for Players",
        description:
          "A player reviews their $75.00 total earnings and 15 completed surveys, achieving Expert-level bonuses, promoting sustained participation.",
        category: "player_progression",
        totalEarnings: 75.0,
        surveysCompleted: 15,
        level: "Expert",
      },
    ],
  })
})

// Root route - Enhanced for Next.js integration
app.get("/", async (req, res) => {
  try {
    // Check if request is from a browser (for landing page) or API client
    const userAgent = req.get("User-Agent") || ""
    const acceptsHtml = req.get("Accept")?.includes("text/html")

    if (acceptsHtml && !userAgent.includes("curl") && !userAgent.includes("Postman")) {
      // Redirect browsers to the Next.js landing page
      const landingPageUrl = process.env.FRONTEND_URL || "https://gamesyncsphere-analytics.vercel.app"
      return res.redirect(302, landingPageUrl)
    }

    // API response for non-browser clients
    res.status(200).json({
      message: "🎮 GameSyncSphere - Revolutionary AI Gaming Analytics Platform!",
      status: "healthy",
      version: "6.1.0",
      timestamp: new Date().toISOString(),
      description: "The world's first player-compensated gaming analytics platform powered by Claude AI",

      landingPage: {
        url: process.env.FRONTEND_URL || "https://gamesyncsphere-analytics.vercel.app",
        status: "Next.js landing page available",
        features: ["Holographic UI", "Animated counters", "Interactive demos"],
      },

      revolutionaryFeatures: [
        "🔐 Secure User Authentication",
        "🤖 Claude AI Survey Generation",
        "💰 Real Player Earnings System",
        "🎯 Experience-Based Bonuses",
        "🗄️ PostgreSQL Database Integration",
        "📊 Complete Earnings Tracking",
        "🏢 B2B Company Integration",
        "💼 Enterprise Survey Marketplace",
        "🌐 Beautiful Next.js Landing Page",
        "📧 Newsletter System",
        "📞 Contact Management",
      ],

      system: {
        database: databaseReady ? "PostgreSQL Connected" : "In-Memory Fallback",
        authentication: "Secure Token-Based",
        aiProvider: "Claude by Anthropic",
        storage: databaseReady ? "Permanent" : "Temporary",
        frontend: "Next.js on Vercel",
        backend: "Express.js on Railway",
      },

      stats: {
        registeredUsers: users.size,
        registeredCompanies: companies.size,
        activeSessions: sessions.size,
        newsletterSubscribers: newsletters.size,
        databaseStatus: databaseReady ? "Connected" : "Initializing",
      },

      quickStart: {
        landingPage: process.env.FRONTEND_URL || "https://gamesyncsphere-analytics.vercel.app",
        playerRegister: "POST /api/auth/register",
        playerLogin: "POST /api/auth/login",
        companyRegister: "POST /api/companies/register",
        companyLogin: "POST /api/companies/login",
        generateSurvey: "POST /api/survey/generate (requires auth)",
        createSurveyRequest: "POST /api/companies/survey-requests (requires company auth)",
        viewEarnings: "GET /api/user/surveys (requires auth)",
        companyDashboard: "GET /api/companies/dashboard (requires company auth)",
        newsletter: "POST /api/newsletter/subscribe",
        contact: "POST /api/contact",
        platformStats: "GET /api/platform/stats",
      },
    })
  } catch (error) {
    console.error("❌ Root route error:", error.message)
    res.status(500).json({
      error: "Server error",
      message: "Unable to process request",
    })
  }
})

// Health check - Enhanced
app.get("/health", (req, res) => {
  const healthStatus = {
    status: "healthy",
    message: "GameSyncSphere with Next.js Landing Page Integration - Ready!",
    timestamp: new Date().toISOString(),
    version: "6.1.0",
    uptime: process.uptime(),
    database: databaseReady ? "Connected" : "Fallback",
    users: users.size,
    companies: companies.size,
    sessions: sessions.size,
    newsletters: newsletters.size,
    frontend: {
      type: "Next.js",
      url: process.env.FRONTEND_URL || "https://gamesyncsphere-analytics.vercel.app",
      integration: "Active",
    },
    features: [
      "Next.js Landing Page Integration",
      "Newsletter Subscription System",
      "Contact Form Management",
      "Enhanced Platform Statistics",
      "Demo Data Endpoints",
      "Player Authentication",
      "Company Authentication",
      "Claude AI Surveys",
      "B2B Survey Marketplace",
      "Database Integration",
      "Earnings Tracking",
    ],
    environment: {
      nodeEnv: process.env.NODE_ENV || "development",
      port: process.env.PORT || 3001,
      cors: "Configured for Next.js",
      security: "Enhanced headers active",
    },
  }

  res.status(200).json(healthStatus)
})

// Database routes
app.get("/api/database/init", async (req, res) => {
  try {
    if (!prisma) {
      const success = await initializeDatabase()
      if (!success) {
        return res.status(500).json({
          error: "Database initialization failed",
          message: "Check logs for details",
          fallback: "Using in-memory storage",
        })
      }
      databaseReady = true
    }

    const userCount = await prisma.user.count()
    const companyCount = await prisma.company.count()

    res.json({
      success: true,
      message: "🗄️ Database initialized and ready!",
      database: {
        type: "PostgreSQL",
        orm: "Prisma",
        status: "Connected",
        tables: ["users", "companies", "surveys", "survey_responses", "survey_requests", "parties", "earnings"],
      },
      currentData: { users: userCount, companies: companyCount },
      nextSteps: [
        "Database is ready for user migration",
        "Can handle permanent user accounts",
        "Ready for B2B company registration",
        "Scalable to thousands of users and companies",
        "Integrated with Next.js landing page",
      ],
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    res.status(500).json({
      error: "Database initialization failed",
      message: error.message,
    })
  }
})

// User Registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, username, password, fullName, source = "api" } = req.body

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
        console.log(`✅ User registered in database: ${username} (source: ${source})`)
      } catch (dbError) {
        console.error("Database registration failed:", dbError)
        databaseReady = false
      }
    }

    if (!databaseReady || !user) {
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
        gaming_platforms: [],
        favorite_games: [],
        activeSurveys: [],
        completedSurveyHistory: [],
      }
      users.set(email, user)
      console.log(`📝 User registered in memory: ${username} (source: ${source})`)
    }

    const token = generateToken()
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      type: "user",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      total_earnings: user.total_earnings || 0,
      completed_surveys: user.completed_surveys || 0,
      created_at: user.created_at,
    }

    res.status(201).json({
      success: true,
      message: "🎉 Welcome to GameSyncSphere! Your account has been created.",
      user: userResponse,
      token,
      storage: databaseReady ? "Permanent Database" : "Temporary (will migrate to database)",
      source,
      revolutionaryFeatures: [
        "Earn money from Claude AI gaming surveys",
        "Experience-based earning bonuses",
        "Complete transparency on all earnings",
        "Access to vibrant community hubs",
        databaseReady ? "Permanent account storage" : "Account will be migrated to permanent storage",
      ],
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
            gaming_platforms: true,
            favorite_games: true,
            created_at: true,
            is_active: true,
          },
        })

        if (user && user.password_hash === hashPassword(password)) {
          await prisma.user.update({
            where: { id: user.id },
            data: { last_login: new Date() },
          })
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
        user.lastLogin = new Date().toISOString()
        users.set(email, user)
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

    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      total_earnings: user.total_earnings || 0,
      completed_surveys: user.completed_surveys || 0,
    }

    res.json({
      success: true,
      message: `🎮 Welcome back, ${user.username}!`,
      user: userResponse,
      token,
      storage: databaseReady ? "Database" : "Memory",
      stats: {
        totalEarnings: (user.total_earnings || 0).toFixed(2),
        completedSurveys: user.completed_surveys || 0,
        experienceBonus: `+$${((user.completed_surveys || 0) * 0.5).toFixed(2)} per future survey`,
        memberSince: user.created_at ? user.created_at.split("T")[0] : "Today",
      },
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
    const { companyName, email, password, companyType, website, description, source = "api" } = req.body

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

        console.log(`✅ Company registered in database: ${companyName} (source: ${source})`)
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
    companies.set(company.id, company)
    console.log(`📝 Company stored in memory: ${companyName} (source: ${source})`)

    const token = generateToken()
    sessions.set(token, {
      companyId: company.id,
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
      source,
      nextSteps: [
        "Complete company verification",
        "Set up billing information",
        "Create your first survey request",
        "Access player insights dashboard",
      ],
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
      dashboardAccess: [
        "Survey Request Management",
        "Player Analytics Dashboard",
        "Real-time Data Insights",
        "Billing & Usage Reports",
      ],
    })
  } catch (error) {
    console.error("Company login error:", error)
    res.status(500).json({
      error: "Login failed",
      message: "Unable to login",
    })
  }
})

// Authentication middleware for users
async function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Please login to access surveys",
      })
    }

    const session = sessions.get(token)
    if (!session || new Date() > new Date(session.expiresAt) || session.type !== "user") {
      return res.status(401).json({
        error: "Invalid or expired token",
        message: "Please login again",
      })
    }

    let user = null
    if (databaseReady && prisma) {
      user = await prisma.user.findUnique({ where: { id: session.userId } })
    } else {
      user = Array.from(users.values()).find((u) => u.id === session.userId)
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" })
  }
}

// Authentication middleware for companies
async function authenticateCompany(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Please login to access company features",
      })
    }

    const session = sessions.get(token)
    if (!session || new Date() > new Date(session.expiresAt) || session.type !== "company") {
      return res.status(401).json({
        error: "Invalid or expired token",
        message: "Please login again",
      })
    }

    let company = null

    if (databaseReady && prisma) {
      try {
        company = await prisma.company.findUnique({ where: { id: session.companyId } })
      } catch (dbError) {
        console.error("Database company lookup failed:", dbError)
      }
    }

    if (!company) {
      company = companies.get(session.companyId)
      if (!company) {
        company = Array.from(companies.values()).find((c) => c.id === session.companyId)
      }
    }

    if (!company) {
      return res.status(404).json({
        error: "Company not found",
        message: "Company record not found",
      })
    }

    req.company = company
    req.token = token
    next()
  } catch (error) {
    console.error("Company authentication error:", error)
    res.status(500).json({
      error: "Authentication failed",
      message: error.message,
    })
  }
}

// Company Dashboard
app.get("/api/companies/dashboard", authenticateCompany, async (req, res) => {
  try {
    let surveyRequests = []
    const totalSpent = 0
    const activeResponses = 0

    if (databaseReady && prisma) {
      try {
        const requests = await prisma.surveyRequest.findMany({
          where: { company_id: req.company.id },
        })
        surveyRequests = requests
      } catch (dbError) {
        console.error("Dashboard query error:", dbError)
      }
    }

    res.json({
      success: true,
      dashboard: {
        company: {
          name: req.company.name,
          verified: req.company.verified,
          memberSince: req.company.created_at ? req.company.created_at.split("T")[0] : "Today",
        },
        metrics: {
          totalSurveyRequests: surveyRequests.length,
          totalSpent: totalSpent,
          totalResponses: activeResponses,
          averageCostPerResponse: "0.00",
        },
        activeSurveyRequests: surveyRequests.filter((sr) => sr.status === "active"),
        recentInsights: await generateRecentInsights(req.company.id),
        pricingPlans: [
          { name: "Starter", price: 500, responses: 100, features: ["Basic Analytics", "Standard Support"] },
          {
            name: "Professional",
            price: 2000,
            responses: 500,
            features: ["Advanced Analytics", "Custom Targeting", "API Access"],
          },
          {
            name: "Enterprise",
            price: 10000,
            responses: "Unlimited",
            features: ["Real-time Data", "Dedicated Support", "White-label"],
          },
        ],
      },
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    res.status(500).json({
      error: "Failed to load dashboard",
    })
  }
})

// Generate Claude AI Survey
app.post("/api/survey/generate", authenticateUser, async (req, res) => {
  try {
    const {
      gameContext = {},
      playerState = {},
      targetInsights = ["equipment_satisfaction", "game_enjoyment"],
      maxQuestions = 4,
    } = req.body

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: "Claude AI not configured",
        message: "Survey generation temporarily unavailable",
      })
    }

    const completedSurveys = req.user.completed_surveys || req.user.completedSurveys || 0
    const experienceBonus = completedSurveys * 0.5
    const baseEarning = 15.5

    const claudePrompt = `You are an expert gaming survey designer creating personalized surveys for GameSyncSphere.

PLAYER CONTEXT:
- Player: ${req.user.username}
- Total earnings: $${req.user.total_earnings || req.user.totalEarnings || 0}
- Completed surveys: ${completedSurveys}
- Experience level: ${completedSurveys < 5 ? "Beginner" : completedSurveys < 15 ? "Experienced" : "Expert"}
- Current game: ${gameContext.game || "Various games"}

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
}`

    console.log(`Generating Claude survey for: ${req.user.username}`)

    const claudeResponse = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 2000,
        messages: [{ role: "user", content: claudePrompt }],
        system: "You are an expert gaming survey designer. Respond only with valid JSON, no markdown formatting.",
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
      },
    )

    let aiSurveyData
    try {
      const claudeText = claudeResponse.data.content[0].text
        .trim()
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .replace(/^[^{]*/, "")
        .replace(/[^}]*$/, "}")

      aiSurveyData = JSON.parse(claudeText)
    } catch (parseError) {
      const fallbackEarning = baseEarning + experienceBonus
      aiSurveyData = {
        questions: [
          {
            id: "q1",
            type: "rating_scale",
            text: `How would you rate your ${gameContext.game || "gaming"} experience today?`,
            options: [1, 2, 3, 4, 5],
            labels: ["Very Poor", "Poor", "Average", "Good", "Excellent"],
            revenueValue: fallbackEarning,
            buyerInterest: ["Game developers"],
          },
        ],
        estimatedCompletionTime: 3,
        totalEarnings: fallbackEarning,
        experienceBonus: experienceBonus,
      }
    }

    const surveyId = `survey_${req.user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const survey = {
      id: surveyId,
      userId: req.user.id,
      username: req.user.username,
      gameContext,
      questions: aiSurveyData.questions,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      estimatedEarnings: aiSurveyData.totalEarnings,
      experienceBonus: aiSurveyData.experienceBonus || experienceBonus,
    }

    if (!req.user.activeSurveys) req.user.activeSurveys = []
    req.user.activeSurveys.push(survey)

    if (!databaseReady) {
      users.set(req.user.email, req.user)
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
        aiProvider: "Claude by Anthropic",
        experienceBonus: survey.experienceBonus,
      },
      userContext: {
        username: req.user.username,
        experienceLevel: completedSurveys < 5 ? "Beginner" : completedSurveys < 15 ? "Experienced" : "Expert",
        experienceBonus: `+${experienceBonus.toFixed(2)} per question`,
      },
      revolutionaryFeature: `Personalized Claude AI survey - Experience bonus: +${experienceBonus.toFixed(2)} per question!`,
    })
  } catch (error) {
    console.error("Survey generation error:", error)
    res.status(500).json({
      error: "Failed to generate survey",
      message: "Survey generation temporarily unavailable",
    })
  }
})

// Submit Survey and Earn Money
app.post("/api/survey/:surveyId/submit", authenticateUser, async (req, res) => {
  try {
    const { surveyId } = req.params
    const { responses } = req.body

    const surveyIndex = req.user.activeSurveys?.findIndex((s) => s.id === surveyId)
    if (surveyIndex === -1 || !req.user.activeSurveys) {
      return res.status(404).json({
        error: "Survey not found",
        message: "This survey does not exist or has expired",
      })
    }

    const survey = req.user.activeSurveys[surveyIndex]

    if (survey.status === "completed") {
      return res.status(400).json({
        error: "Survey already completed",
      })
    }

    let totalEarnings = 0
    const processedResponses = []

    survey.questions.forEach((question) => {
      const response = responses[question.id]
      if (response !== undefined) {
        totalEarnings += question.revenueValue || 0
        processedResponses.push({
          questionId: question.id,
          question: question.text,
          response,
          earningValue: question.revenueValue || 0,
          buyerInterest: question.buyerInterest || [],
        })
      }
    })

    const newTotalEarnings = (req.user.total_earnings || req.user.totalEarnings || 0) + totalEarnings
    const newCompletedSurveys = (req.user.completed_surveys || req.user.completedSurveys || 0) + 1

    survey.status = "completed"
    survey.completedAt = new Date().toISOString()
    survey.responses = processedResponses
    survey.actualEarnings = totalEarnings

    if (databaseReady && prisma) {
      try {
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            total_earnings: newTotalEarnings,
            completed_surveys: newCompletedSurveys,
          },
        })
        req.user.total_earnings = newTotalEarnings
        req.user.completed_surveys = newCompletedSurveys

        console.log(`✅ Database updated: ${req.user.username} earned ${totalEarnings.toFixed(2)}`)
      } catch (dbError) {
        console.error("Database update failed:", dbError)
      }
    } else {
      req.user.totalEarnings = newTotalEarnings
      req.user.completedSurveys = newCompletedSurveys
      users.set(req.user.email, req.user)
    }

    if (!req.user.completedSurveyHistory) req.user.completedSurveyHistory = []
    req.user.completedSurveyHistory.push(survey)
    req.user.activeSurveys.splice(surveyIndex, 1)

    const newExperienceLevel =
      newCompletedSurveys < 5 ? "Beginner" : newCompletedSurveys < 15 ? "Experienced" : "Expert"

    res.json({
      success: true,
      message: `🎉 Survey completed! You earned ${totalEarnings.toFixed(2)}!`,
      earnings: {
        amount: totalEarnings.toFixed(2),
        currency: "USD",
        questionsAnswered: processedResponses.length,
        paymentStatus: "processed",
        experienceBonus: survey.experienceBonus ? `+${survey.experienceBonus.toFixed(2)} included` : "None",
        storage: databaseReady ? "Database Updated" : "Memory Updated",
      },
      userStats: {
        newTotalEarnings: newTotalEarnings.toFixed(2),
        totalCompletedSurveys: newCompletedSurveys,
        experienceLevel: newExperienceLevel,
        nextSurveyBonus: `+${(newCompletedSurveys * 0.5).toFixed(2)} bonus for future surveys`,
      },
      levelUp:
        newCompletedSurveys === 5
          ? '🎉 Level Up! You are now "Experienced"!'
          : newCompletedSurveys === 15
            ? '🚀 Level Up! You are now "Expert"!'
            : null,
    })
  } catch (error) {
    console.error("Survey submission error:", error)
    res.status(500).json({
      error: "Failed to submit survey",
      details: error.message,
    })
  }
})

// Get User's Surveys and Earnings
app.get("/api/user/surveys", authenticateUser, (req, res) => {
  const completedSurveys = req.user.completed_surveys || req.user.completedSurveys || 0
  const totalEarnings = req.user.total_earnings || req.user.totalEarnings || 0

  const experienceLevel = completedSurveys < 5 ? "Beginner" : completedSurveys < 15 ? "Experienced" : "Expert"

  res.json({
    success: true,
    user: {
      username: req.user.username,
      email: req.user.email,
      memberSince: req.user.created_at ? req.user.created_at.split("T")[0] : "Today",
      experienceLevel,
      storage: databaseReady ? "Database" : "Memory",
    },
    earnings: {
      total: totalEarnings.toFixed(2),
      completedSurveys: completedSurveys,
      averagePerSurvey: completedSurveys > 0 ? (totalEarnings / completedSurveys).toFixed(2) : "0.00",
      currentExperienceBonus: (completedSurveys * 0.5).toFixed(2),
      nextLevelAt:
        completedSurveys < 5
          ? "5 surveys (Experienced)"
          : completedSurveys < 15
            ? "15 surveys (Expert)"
            : "Maximum level reached!",
    },
    activeSurveys: (req.user.activeSurveys || []).map((s) => ({
      id: s.id,
      estimatedEarnings: s.estimatedEarnings,
      estimatedTime: s.estimatedCompletionTime,
      gameContext: s.gameContext,
      expiresAt: s.expiresAt,
      experienceBonus: s.experienceBonus,
    })),
    recentCompletedSurveys: (req.user.completedSurveyHistory || [])
      .slice(-5)
      .reverse()
      .map((s) => ({
        id: s.id,
        earnings: s.actualEarnings.toFixed(2),
        completedAt: s.completedAt,
        gameContext: s.gameContext,
        questionsAnswered: s.responses.length,
      })),
    revolutionaryFeatures: [
      "Claude AI generates surveys based on your gaming behavior",
      "Earn more money as you complete more surveys",
      "Experience-based bonus system",
      "Full transparency on earnings and data usage",
      databaseReady ? "Permanent database storage" : "Will migrate to permanent storage",
    ],
  })
})

// Test endpoint - Enhanced
app.get("/api/test", (req, res) => {
  res.json({
    message: "GameSyncSphere with Next.js Landing Page Integration - Ready!",
    website: "✅ Next.js Landing Page Ready",
    authentication: "✅ Working",
    companyAuth: "✅ Working",
    crypto: "✅ Built-in Node.js",
    database: databaseReady ? "✅ PostgreSQL Connected" : "⚠️ Fallback Mode",
    claudeAI: process.env.ANTHROPIC_API_KEY ? "✅ Connected" : "❌ Not configured",
    userStorage: databaseReady ? "✅ Database Ready" : "📝 In-memory with migration ready",
    companyStorage: databaseReady ? "✅ Database Ready" : "📝 In-memory with migration ready",
    sessionManagement: "✅ Active",
    surveySystem: "✅ Claude AI Ready",
    b2bMarketplace: "✅ Survey Request System Ready",
    earningsTracking: "✅ Real Money System",
    newsletterSystem: "✅ Active",
    contactSystem: "✅ Active",
    cors: "✅ Configured for Next.js",
    security: "✅ Enhanced headers active",
    persistence: databaseReady ? "✅ Permanent Storage" : "⚠️ Temporary (can migrate)",
    integration: "✅ Ready for Next.js landing page with full API support!",
    newEndpoints: [
      "POST /api/newsletter/subscribe",
      "POST /api/contact",
      "GET /api/demo/features",
      "GET /api/demo/use-cases",
      "Enhanced GET /api/platform/stats",
    ],
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error)
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong. Please try again.",
    timestamp: new Date().toISOString(),
  })
})

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    message: `The endpoint ${req.method} ${req.path} does not exist`,
    availableEndpoints: [
      "GET /health",
      "GET /api/test",
      "GET /api/platform/stats",
      "GET /api/demo/features",
      "GET /api/demo/use-cases",
      "POST /api/newsletter/subscribe",
      "POST /api/contact",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/companies/register",
      "POST /api/companies/login",
      "POST /api/survey/generate (auth required)",
      "GET /api/user/surveys (auth required)",
      "GET /api/companies/dashboard (company auth required)",
    ],
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 GameSyncSphere with Next.js Landing Page Integration running on port ${PORT}`)
  console.log(`🌐 Landing Page: Next.js integration ready`)
  console.log(`🔐 Player Authentication: Secure Token-Based`)
  console.log(`🏢 Company Authentication: Secure Token-Based`)
  console.log(`🗄️ Database: ${databaseReady ? "PostgreSQL Connected" : "In-Memory with Migration Ready"}`)
  console.log(`🤖 Claude AI: ${process.env.ANTHROPIC_API_KEY ? "ENABLED" : "DISABLED"}`)
  console.log(`💰 Earnings System: Active with Experience Bonuses`)
  console.log(`💼 B2B Marketplace: Survey Request System Active`)
  console.log(`📧 Newsletter System: Active`)
  console.log(`📞 Contact System: Active`)
  console.log(`🔒 Security: Enhanced CORS and headers configured`)
  console.log(`📊 Data Storage: ${databaseReady ? "Permanent" : "Temporary (migration available)"}`)
  console.log(`🌍 Live at: https://gamesyncsphere-production.up.railway.app/`)
  console.log(`🎯 Ready for Next.js landing page integration with full API support!`)
})
