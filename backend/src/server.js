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
        version: "1.0.3",
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

// Root route
app.get("/", (req, res) => {
  const userAgent = req.get("User-Agent") || ""
  const acceptsHtml = req.get("Accept")?.includes("text/html")

  if (acceptsHtml && !userAgent.includes("curl") && !userAgent.includes("Postman")) {
    const landingPageUrl = process.env.FRONTEND_URL || "https://gamesyncsphere-analytics.vercel.app"
    return res.redirect(302, landingPageUrl)
  }

  res.status(200).json({
    message: "🎮 GameSyncSphere API - Railway Deployment Ready!",
    status: "healthy",
    version: "1.0.3",
    timestamp: new Date().toISOString(),
    database: databaseReady ? "PostgreSQL Connected" : "In-Memory Fallback",
    endpoints: [
      "GET /health - Health check",
      "GET /api/platform/stats - Platform statistics",
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
    version: "1.0.3",
    uptime: process.uptime(),
    database: databaseReady ? "Connected" : "In-Memory",
    environment: {
      nodeEnv: process.env.NODE_ENV || "production",
      port: process.env.PORT || 3001,
      hasDatabase: !!process.env.DATABASE_URL,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
    },
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
    version: "1.0.3",
    timestamp: new Date().toISOString(),
    database: databaseReady ? "✅ PostgreSQL Connected" : "⚠️ In-Memory Fallback",
    environment: {
      nodeEnv: process.env.NODE_ENV || "production",
      port: process.env.PORT || 3001,
      hasDatabase: !!process.env.DATABASE_URL,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
    },
    endpoints: [
      "GET /health",
      "GET /api/platform/stats",
      "POST /api/newsletter/subscribe",
      "POST /api/contact",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/companies/register",
      "POST /api/companies/login",
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
      "GET /health",
      "GET /api/platform/stats",
      "POST /api/newsletter/subscribe",
      "POST /api/contact",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/companies/register",
      "POST /api/companies/login",
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
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
