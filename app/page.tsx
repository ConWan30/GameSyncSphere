"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Shield,
  Headphones,
  Cpu,
  BarChart3,
  Users,
  Heart,
  Building2,
  TrendingUp,
  DollarSign,
  Zap,
  Code,
  Github,
  Mail,
  Twitter,
  MessageSquare,
  ArrowRight,
  Play,
  Sparkles,
  Database,
  Target,
  Award,
  Activity,
  Gamepad2,
  CheckCircle,
  PresentationIcon as PresentationChart,
} from "lucide-react"

interface PlatformStats {
  totalUsers: number
  totalEarnings: number
  totalCompanies: number
  totalSurveys: number
  avgEarningsPerUser: number
  completionRate: number
}

export default function GameSyncSphereLanding() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 247891,
    totalEarnings: 3847291,
    totalCompanies: 1247,
    totalSurveys: 2847391,
    avgEarningsPerUser: 15.67,
    completionRate: 94.2,
  })

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorIcon, setCursorIcon] = useState("default")
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setEmail("")
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(0) + "K"
    return num.toString()
  }

  const features = [
    {
      icon: Brain,
      title: "Earn with Claude AI Surveys",
      description:
        "Answer personalized surveys crafted by Claude AI, tailored to your gaming habits, and earn up to $15.50+ per survey with experience-based bonuses, uniquely compensating players for insights that shape industry trends.",
      category: "AI-Powered",
      color: "from-blue-500/20 to-blue-600/10",
    },
    {
      icon: Shield,
      title: "Fortified Authentication",
      description:
        "Securely register and log in with SHA-256 hashed passwords and token-based sessions, safeguarded by our robust PostgreSQL database, ensuring ethical data handling absent in traditional analytics tools.",
      category: "Security",
      color: "from-green-500/20 to-green-600/10",
    },
    {
      icon: Headphones,
      title: "Dynamic Party Communication",
      description:
        "Form real-time gaming parties with secure, low-latency voice, video, and text communication, seamlessly connecting PC, console, and mobile players, fostering player engagement beyond standard platforms.",
      category: "Communication",
      color: "from-purple-500/20 to-purple-600/10",
    },
    {
      icon: Cpu,
      title: "AI-Powered Personalization",
      description:
        "Claude AI tailors surveys and matchmaking to your playstyle, delivering personalized gaming experiences and strategic insights, a novel extension of AI in gaming not found in competitors.",
      category: "Personalization",
      color: "from-orange-500/20 to-orange-600/10",
    },
    {
      icon: BarChart3,
      title: "Transparent Earnings Dashboard",
      description:
        "Track your earnings, survey completions, and experience bonuses in real-time, securely stored in our scalable PostgreSQL database, providing unprecedented transparency for player empowerment.",
      category: "Analytics",
      color: "from-cyan-500/20 to-cyan-600/10",
    },
    {
      icon: Users,
      title: "Vibrant Community Hubs",
      description:
        "Create or join customizable hubs for tournaments, strategy sharing, and social engagement, fostering a player-driven gaming ecosystem, uniquely bridging analytics with community.",
      category: "Community",
      color: "from-pink-500/20 to-pink-600/10",
    },
    {
      icon: Heart,
      title: "Wellness-Integrated Sessions",
      description:
        "Track sessions with FPS, latency, and wellness metrics like break counts, promoting balanced gaming, addressing industry concerns for responsible play in a first-of-its-kind integration.",
      category: "Wellness",
      color: "from-red-500/20 to-red-600/10",
    },
    {
      icon: Building2,
      title: "B2B Survey Marketplace",
      description:
        "Companies create targeted survey requests with custom budgets and audience criteria, accessing real-time player insights, establishing a bidirectional value exchange unmatched in the market.",
      category: "B2B",
      color: "from-indigo-500/20 to-indigo-600/10",
    },
    {
      icon: PresentationChart,
      title: "Enterprise Dashboards",
      description:
        "B2B users access analytics, survey management, and insights reports, enabling data-driven decisions for developers and manufacturers.",
      category: "Enterprise",
      color: "from-yellow-500/20 to-yellow-600/10",
    },
  ]

  const useCases = [
    {
      title: "Player Earning in Call of Duty",
      description:
        "A competitive player completes a Claude AI survey on match performance, earning $16.50 with a $1.00 experience bonus, tracked in PostgreSQL, uniquely monetizing insights unlike traditional tools.",
      earnings: "$16.50",
      time: "5 minutes",
      game: "Call of Duty",
      icon: Target,
    },
    {
      title: "Company Survey Request for Hardware Insights",
      description:
        "A hardware manufacturer creates a request with a $2000 budget for 500 responses on equipment satisfaction, enabling precise data acquisition in a novel marketplace.",
      budget: "$2,000",
      responses: "500",
      industry: "Hardware",
      icon: Building2,
    },
    {
      title: "Apex Legends Squad Coordination",
      description:
        "A team forms a party with secure WebRTC communication, strategizing across PC and console in real-time, bridging analytics with community.",
      platforms: "PC & Console",
      game: "Apex Legends",
      feature: "Real-time Communication",
      icon: Users,
    },
    {
      title: "B2B Dashboard Review",
      description:
        "A game developer views real-time responses and insights on their dashboard, with total spent and average cost per response, supporting data-driven innovation.",
      insights: "Real-time",
      type: "Analytics",
      user: "Game Developer",
      icon: BarChart3,
    },
    {
      title: "Valorant Tournament Hub",
      description:
        "A community hosts a tournament in a customizable hub, with Claude AI suggesting match formats based on player analytics, fostering engagement.",
      participants: "64 Players",
      game: "Valorant",
      feature: "AI Suggestions",
      icon: Award,
    },
    {
      title: "Earnings Transparency for Players",
      description:
        "A player reviews their $75.00 total earnings and 15 completed surveys, achieving Expert-level bonuses, promoting sustained participation.",
      earnings: "$75.00",
      surveys: "15",
      level: "Expert",
      icon: DollarSign,
    },
  ]

  const howItWorksSteps = [
    {
      step: "01",
      title: "Secure Registration",
      description:
        "Sign up as a player or company, protected by SHA-256 hashing and stored in PostgreSQL, ensuring secure access unique to this compensated model.",
      icon: Shield,
    },
    {
      step: "02",
      title: "Engage with AI Surveys",
      description:
        "Players complete Claude AI-generated surveys; companies request targeted ones, filling a gap in ethical data procurement.",
      icon: Brain,
    },
    {
      step: "03",
      title: "Track Earnings and Insights",
      description:
        "Monitor player earnings or company spent budgets via real-time dashboards, providing analytical precision absent in non-compensated tools.",
      icon: BarChart3,
    },
    {
      step: "04",
      title: "Connect Seamlessly",
      description:
        "Join parties for cross-platform communication tied to real-time gaming activity, enhancing social features with analytics.",
      icon: Headphones,
    },
    {
      step: "05",
      title: "Build Communities and Partnerships",
      description:
        "Participate in hubs or B2B integrations for tournaments and data-driven collaborations, pioneering a holistic ecosystem.",
      icon: Users,
    },
  ]

  const platformStats = [
    {
      value: formatNumber(stats.totalUsers),
      label: "Active Players",
      icon: Users,
      suffix: "+",
      color: "text-blue-400",
    },
    {
      value: `$${formatNumber(stats.totalEarnings)}`,
      label: "Player Earnings",
      icon: DollarSign,
      suffix: "+",
      color: "text-green-400",
    },
    {
      value: formatNumber(stats.totalCompanies),
      label: "Partner Companies",
      icon: Building2,
      suffix: "+",
      color: "text-purple-400",
    },
    {
      value: formatNumber(stats.totalSurveys),
      label: "Surveys Completed",
      icon: BarChart3,
      suffix: "+",
      color: "text-cyan-400",
    },
    {
      value: `$${stats.avgEarningsPerUser}`,
      label: "Avg. Earnings per User",
      icon: TrendingUp,
      suffix: "",
      color: "text-orange-400",
    },
    {
      value: `${stats.completionRate}%`,
      label: "Completion Rate",
      icon: Activity,
      suffix: "",
      color: "text-pink-400",
    },
  ]

  return (
    <div className="min-h-screen bg-primary-dark overflow-x-hidden relative">
      {/* Custom Dynamic Cursor */}
      <div
        className="custom-cursor"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
        data-cursor={cursorIcon}
      />

      {/* Holographic Background */}
      <div className="holographic-bg">
        <div className="holo-grid" />
        <div className="floating-particles">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-accent-blue/20 bg-primary-dark/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="holo-logo">
                <Gamepad2 className="h-8 w-8 text-accent-blue" />
              </div>
              <span className="text-2xl font-bold holographic-text font-orbitron">GameSyncSphere</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="nav-link"
                onMouseEnter={() => setCursorIcon("features")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="nav-link"
                onMouseEnter={() => setCursorIcon("process")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("developers")}
                className="nav-link"
                onMouseEnter={() => setCursorIcon("code")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                Developers
              </button>
              <button
                onClick={() => scrollToSection("stats")}
                className="nav-link"
                onMouseEnter={() => setCursorIcon("stats")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                Stats
              </button>
              <Button
                className="holo-button-primary"
                onMouseEnter={() => setCursorIcon("earn")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                Start Earning Today
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-6xl mx-auto">
            <Badge className="mb-8 holo-badge animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              World's First AIaaS for Gaming Data Analytics
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 holographic-text leading-tight font-orbitron">
              GameSyncSphere: Pioneer the Future of
              <br />
              <span className="gradient-text">Gaming Analytics</span>
            </h1>

            <p className="text-xl md:text-2xl text-metallic-silver mb-12 max-w-4xl mx-auto leading-relaxed">
              As the world's first AIaaS for gaming data analytics, empower players with compensated insights, wellness
              monitoring, and community tools, while enabling B2B marketplaces for developers and manufacturers in a
              privacy-first ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                className="holo-button-primary text-lg px-8 py-4"
                onMouseEnter={() => setCursorIcon("earn")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                <Play className="mr-2 h-6 w-6" />
                Start Earning Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="holo-button-secondary text-lg px-8 py-4 bg-transparent"
                onClick={() => scrollToSection("features")}
                onMouseEnter={() => setCursorIcon("explore")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                Explore the Innovation
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>

            {/* Hero Visual - Interactive Schema Visualizer */}
            <div className="relative">
              <div className="holo-interface">
                <div className="floating-schema">
                  <div className="schema-node user-node group cursor-pointer">
                    <Database className="w-6 h-6" />
                    <span>User Model</span>
                    <div className="schema-tooltip">
                      <div className="text-xs">
                        <div>• password_hash: String</div>
                        <div>• total_earnings: Float</div>
                        <div>• play_style: String</div>
                        <div>• completed_surveys: Int</div>
                      </div>
                    </div>
                  </div>
                  <div className="schema-node survey-node group cursor-pointer">
                    <Brain className="w-6 h-6" />
                    <span>Claude AI</span>
                    <div className="schema-tooltip">
                      <div className="text-xs">
                        <div>• ai_provider: Claude</div>
                        <div>• questions: JSON[]</div>
                        <div>• estimated_earnings: Float</div>
                        <div>• difficulty: String</div>
                      </div>
                    </div>
                  </div>
                  <div className="schema-node company-node group cursor-pointer">
                    <Building2 className="w-6 h-6" />
                    <span>Company</span>
                    <div className="schema-tooltip">
                      <div className="text-xs">
                        <div>• company_type: String</div>
                        <div>• total_spent: Float</div>
                        <div>• survey_requests: Int</div>
                        <div>• target_insights: String</div>
                      </div>
                    </div>
                  </div>
                  <div className="schema-node earnings-node group cursor-pointer">
                    <DollarSign className="w-6 h-6" />
                    <span>Earnings</span>
                    <div className="schema-tooltip">
                      <div className="text-xs">
                        <div>• amount: Float</div>
                        <div>• survey_id: String</div>
                        <div>• bonus_applied: Boolean</div>
                        <div>• created_at: DateTime</div>
                      </div>
                    </div>
                  </div>
                  <div className="connection-line line-1" />
                  <div className="connection-line line-2" />
                  <div className="connection-line line-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 holographic-text font-orbitron">
              Revolutionary Features
            </h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              Experience the convergence of AI, blockchain transparency, and community-driven gaming with advanced
              holographic interfaces
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="holo-card group cursor-pointer"
                onMouseEnter={() => setCursorIcon("feature")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 holo-icon-container`}
                  >
                    <feature.icon className="h-8 w-8 text-accent-blue" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white mb-4 font-orbitron">{feature.title}</CardTitle>
                  <Badge className="holo-badge-small mb-4">{feature.category}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-metallic-silver/80 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-gunmetal-gray/30 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 holographic-text font-orbitron">
              Experience the Power of Claude AI and PostgreSQL
            </h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              A streamlined overview of our platform's core functionality, including B2B flows and research-supported
              innovation
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="space-y-16">
              {howItWorksSteps.map((item, index) => (
                <div key={index} className="flex items-start space-x-8 group">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 flex items-center justify-center border border-accent-blue/30 group-hover:scale-110 transition-transform duration-300 holo-step">
                      <item.icon className="w-10 h-10 text-accent-blue" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-7xl font-bold text-accent-blue/30 font-orbitron">{item.step}</span>
                      <h3 className="text-3xl font-bold text-white font-orbitron">{item.title}</h3>
                    </div>
                    <p className="text-metallic-silver/80 text-lg leading-relaxed max-w-2xl">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Button
              className="holo-button-primary text-lg px-8 py-4"
              onMouseEnter={() => setCursorIcon("revolution")}
              onMouseLeave={() => setCursorIcon("default")}
            >
              Join the Revolution
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 holographic-text font-orbitron">Real-World Impact</h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              Discover practical scenarios with parallax scrolling timelines and research-backed uniqueness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="holo-card group cursor-pointer parallax-card"
                onMouseEnter={() => setCursorIcon("usecase")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <useCase.icon className="w-8 h-8 text-accent-blue" />
                    <div className="flex flex-wrap gap-2">
                      {useCase.earnings && (
                        <Badge className="holo-badge-small bg-green-500/20 text-green-400 border-green-500/30">
                          {useCase.earnings}
                        </Badge>
                      )}
                      {useCase.budget && (
                        <Badge className="holo-badge-small bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {useCase.budget}
                        </Badge>
                      )}
                      {useCase.game && (
                        <Badge className="holo-badge-small bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {useCase.game}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-white mb-3 font-orbitron">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-metallic-silver/80 leading-relaxed">
                    {useCase.description}
                  </CardDescription>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {useCase.time && (
                      <Badge className="holo-badge-small bg-orange-500/20 text-orange-400 border-orange-500/30">
                        {useCase.time}
                      </Badge>
                    )}
                    {useCase.platforms && (
                      <Badge className="holo-badge-small bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        {useCase.platforms}
                      </Badge>
                    )}
                    {useCase.participants && (
                      <Badge className="holo-badge-small bg-pink-500/20 text-pink-400 border-pink-500/30">
                        {useCase.participants}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Developer & B2B Section */}
      <section id="developers" className="py-32 bg-gunmetal-gray/30 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 holographic-text font-orbitron">
              Innovate with GameSyncSphere
            </h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              Leverage our APIs and B2B platform to build the future of gaming analytics with expanded B2B endpoints and
              research-supported differentiation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-bold text-white mb-8 font-orbitron flex items-center">
                <Code className="mr-3 h-8 w-8 text-accent-blue" />
                For Developers
              </h3>
              <div className="holo-code-editor mb-8">
                <div className="bg-primary-dark/90 rounded-lg p-6 font-mono text-sm border border-accent-blue/30">
                  <div className="text-accent-blue mb-2">// Survey Generation API</div>
                  <div className="text-white">
                    <span className="text-metallic-silver">const</span> response ={" "}
                    <span className="text-metallic-silver">await</span> fetch(
                    <span className="text-green-400">'/api/survey/generate'</span>, {"{"}
                  </div>
                  <div className="text-white ml-4">
                    method: <span className="text-green-400">'POST'</span>,
                  </div>
                  <div className="text-white ml-4">
                    headers: {"{"}
                    <span className="text-green-400">'Authorization'</span>:{" "}
                    <span className="text-green-400">'Bearer '</span> + token,
                  </div>
                  <div className="text-white ml-8">
                    <span className="text-green-400">'Content-Type'</span>:{" "}
                    <span className="text-green-400">'application/json'</span>
                  </div>
                  <div className="text-white ml-4">{"}"},</div>
                  <div className="text-white ml-4">body: JSON.stringify({"{"}</div>
                  <div className="text-white ml-8">
                    userId: <span className="text-green-400">'user_123'</span>,
                  </div>
                  <div className="text-white ml-8">
                    gameContext: <span className="text-green-400">'Call of Duty'</span>,
                  </div>
                  <div className="text-white ml-8">
                    difficulty: <span className="text-green-400">'competitive'</span>
                  </div>
                  <div className="text-white ml-4">{"}"}</div>
                  <div className="text-white">{"}"}</div>
                  <div className="text-accent-blue mt-4">// Claude AI Response</div>
                  <div className="text-white">
                    <span className="text-metallic-silver">const</span> survey ={" "}
                    <span className="text-metallic-silver">await</span> response.json()
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Zap className="w-6 h-6 text-accent-blue mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2 font-orbitron">Survey Generation API</h4>
                    <p className="text-metallic-silver/80">
                      Leverage Claude AI to generate personalized surveys for your applications, standing out in a
                      market lacking compensated models
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Database className="w-6 h-6 text-accent-blue mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2 font-orbitron">User Analytics API</h4>
                    <p className="text-metallic-silver/80">
                      Access comprehensive user gaming analytics and insights with PostgreSQL-backed reliability
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Github className="w-6 h-6 text-accent-blue mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2 font-orbitron">GitHub Integration</h4>
                    <p className="text-metallic-silver/80">
                      Host repositories and CI/CD pipelines for seamless development workflows
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white mb-8 font-orbitron flex items-center">
                <Building2 className="mr-3 h-8 w-8 text-accent-blue" />
                For Companies
              </h3>
              <div className="space-y-6">
                <Card className="holo-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Building2 className="w-8 h-8 text-accent-blue" />
                      <h4 className="text-xl font-semibold text-white font-orbitron">Company Registration</h4>
                    </div>
                    <p className="text-metallic-silver/80 mb-4">
                      Register your company and access B2B survey marketplace with custom budgets and audience criteria
                    </p>
                    <Badge className="holo-badge-small">API: /api/companies/register</Badge>
                  </CardContent>
                </Card>
                <Card className="holo-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Target className="w-8 h-8 text-accent-blue" />
                      <h4 className="text-xl font-semibold text-white font-orbitron">Survey Requests</h4>
                    </div>
                    <p className="text-metallic-silver/80 mb-4">
                      Create targeted survey requests with custom budgets and criteria, accessing real-time player
                      insights
                    </p>
                    <Badge className="holo-badge-small">API: /api/companies/survey-requests</Badge>
                  </CardContent>
                </Card>
                <Card className="holo-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <BarChart3 className="w-8 h-8 text-accent-blue" />
                      <h4 className="text-xl font-semibold text-white font-orbitron">Enterprise Dashboards</h4>
                    </div>
                    <p className="text-metallic-silver/80 mb-4">
                      Access comprehensive analytics and insights reports with pricing plans and budgeting tools
                    </p>
                    <Badge className="holo-badge-small">API: /api/companies/dashboard</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button
              className="holo-button-primary text-lg px-8 py-4"
              onMouseEnter={() => setCursorIcon("docs")}
              onMouseLeave={() => setCursorIcon("default")}
            >
              Access Developer Docs
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Stats Section */}
      <section id="stats" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 holographic-text font-orbitron">
              GameSyncSphere in Action
            </h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              Real-time statistics showcasing our platform's unprecedented scale and impact, including B2B metrics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformStats.map((stat, index) => (
              <Card
                key={index}
                className="holo-card text-center group cursor-pointer"
                onMouseEnter={() => setCursorIcon("stats")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 holo-stat">
                    <stat.icon className="w-8 h-8 text-accent-blue" />
                  </div>
                  <div className={`text-4xl md:text-5xl font-bold mb-4 counter-animation font-orbitron ${stat.color}`}>
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-metallic-silver/80 text-lg">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="holo-button-secondary bg-transparent"
              onMouseEnter={() => setCursorIcon("platform")}
              onMouseLeave={() => setCursorIcon("default")}
            >
              View Platform Stats
              <BarChart3 className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gunmetal-gray/30 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-orbitron">Stay Ahead of the Game</h2>
            <p className="text-xl text-metallic-silver mb-8">
              Join thousands of gamers and developers getting early access to new features and earning opportunities
            </p>

            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="holo-input flex-1"
                required
                onMouseEnter={() => setCursorIcon("email")}
                onMouseLeave={() => setCursorIcon("default")}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="holo-button-primary"
                onMouseEnter={() => setCursorIcon("subscribe")}
                onMouseLeave={() => setCursorIcon("default")}
              >
                {isSubmitting ? <Zap className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Subscribe
              </Button>
            </form>

            <p className="text-sm text-metallic-silver/60 mt-4">
              Get exclusive updates, earning tips, and developer insights delivered to your inbox
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-accent-blue/20 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Gamepad2 className="h-8 w-8 text-accent-blue" />
                <span className="text-2xl font-bold holographic-text font-orbitron">GameSyncSphere</span>
              </div>
              <p className="text-metallic-silver/80 mb-8 max-w-md">
                The world's first AIaaS for gaming data analytics, empowering players with compensated insights and
                enabling B2B marketplaces in a privacy-first ecosystem.
              </p>

              <div className="flex space-x-4 mb-8">
                <div className="holo-social cursor-pointer">
                  <Twitter className="w-5 h-5 text-accent-blue" />
                </div>
                <div className="holo-social cursor-pointer">
                  <MessageSquare className="w-5 h-5 text-accent-blue" />
                </div>
                <div className="holo-social cursor-pointer">
                  <Github className="w-5 h-5 text-accent-blue" />
                </div>
              </div>

              <div className="holo-branding">
                <p className="text-sm text-metallic-silver/60 mb-2">Powered by</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-accent-blue" />
                    <span className="text-sm text-metallic-silver/80">Claude AI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-accent-blue" />
                    <span className="text-sm text-metallic-silver/80">PostgreSQL</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6 font-orbitron">Platform</h4>
              <div className="space-y-4">
                <a href="#" className="block text-metallic-silver/80 hover:text-white transition-colors">
                  About GameSyncSphere
                </a>
                <a href="#" className="block text-metallic-silver/80 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-metallic-silver/80 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="block text-metallic-silver/80 hover:text-white transition-colors">
                  Developer Docs
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6 font-orbitron">Contact</h4>
              <div className="space-y-4">
                <a
                  href="mailto:support@gamesyncsphere.com"
                  className="block text-metallic-silver/80 hover:text-white transition-colors"
                >
                  support@gamesyncsphere.com
                </a>
                <div className="holo-contact-form">
                  <Input
                    placeholder="Quick message..."
                    className="holo-input mb-2"
                    onMouseEnter={() => setCursorIcon("message")}
                    onMouseLeave={() => setCursorIcon("default")}
                  />
                  <Button size="sm" className="holo-button-primary w-full">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-accent-blue/20 mt-16 pt-8 text-center">
            <p className="text-metallic-silver/60">
              &copy; 2025 GameSyncSphere. Revolutionary AI Gaming Analytics Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
