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
  Users,
  Gamepad2,
  TrendingUp,
  DollarSign,
  Zap,
  Building2,
  BarChart3,
  Heart,
  Code,
  Github,
  Mail,
  Twitter,
  MessageSquare,
  ArrowRight,
  Play,
  Sparkles,
  Database,
  Cpu,
  Globe,
  Target,
  Award,
  Activity,
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
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  return (
    <div className="min-h-screen bg-primary-dark overflow-x-hidden">
      {/* Custom Cursor */}
      <div
        className="custom-cursor"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* Holographic Background */}
      <div className="holographic-bg">
        <div className="holo-grid" />
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
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
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-accent-blue/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="holo-logo">
                <Gamepad2 className="h-8 w-8 text-accent-blue" />
              </div>
              <span className="text-2xl font-bold holographic-text">GameSyncSphere</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection("features")} className="nav-link">
                Features
              </button>
              <button onClick={() => scrollToSection("how-it-works")} className="nav-link">
                How It Works
              </button>
              <button onClick={() => scrollToSection("developers")} className="nav-link">
                Developers
              </button>
              <button onClick={() => scrollToSection("stats")} className="nav-link">
                Stats
              </button>
              <Button className="holo-button-primary">Start Earning Today</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-6xl mx-auto">
            <Badge className="mb-8 holo-badge">
              <Sparkles className="w-4 h-4 mr-2" />
              World's First AIaaS for Gaming Data Analytics
            </Badge>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 holographic-text leading-tight">
              Pioneer the Future of
              <br />
              <span className="gradient-text">Gaming Analytics</span>
            </h1>

            <p className="text-xl md:text-2xl text-metallic-silver mb-12 max-w-4xl mx-auto leading-relaxed">
              Empower players with compensated insights, wellness monitoring, and community tools, while enabling B2B
              marketplaces for developers and manufacturers in a privacy-first ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="holo-button-primary text-lg px-8 py-4">
                <Play className="mr-2 h-6 w-6" />
                Start Earning Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="holo-button-secondary text-lg px-8 py-4 bg-transparent"
                onClick={() => scrollToSection("features")}
              >
                Explore the Innovation
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="holo-interface">
                <div className="floating-schema">
                  <div className="schema-node user-node">
                    <Database className="w-6 h-6" />
                    <span>User Model</span>
                  </div>
                  <div className="schema-node survey-node">
                    <Brain className="w-6 h-6" />
                    <span>Claude AI</span>
                  </div>
                  <div className="schema-node earnings-node">
                    <DollarSign className="w-6 h-6" />
                    <span>Earnings</span>
                  </div>
                  <div className="connection-line line-1" />
                  <div className="connection-line line-2" />
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
            <h2 className="text-5xl md:text-6xl font-bold mb-8 holographic-text">Revolutionary Features</h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              Experience the convergence of AI, blockchain transparency, and community-driven gaming
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Earn with Claude AI Surveys",
                description:
                  "Answer personalized surveys crafted by Claude AI, tailored to your gaming habits, and earn up to $15.50+ per survey with experience-based bonuses.",
                color: "text-accent-blue",
                bgGradient: "from-accent-blue/20 to-accent-blue/5",
              },
              {
                icon: Shield,
                title: "Fortified Authentication",
                description:
                  "Securely register and log in with SHA-256 hashed passwords and token-based sessions, safeguarded by our robust PostgreSQL database.",
                color: "text-metallic-silver",
                bgGradient: "from-metallic-silver/20 to-metallic-silver/5",
              },
              {
                icon: Users,
                title: "Dynamic Party Communication",
                description:
                  "Form real-time gaming parties with secure, low-latency voice, video, and text communication, seamlessly connecting all platforms.",
                color: "text-accent-blue",
                bgGradient: "from-accent-blue/20 to-accent-blue/5",
              },
              {
                icon: Cpu,
                title: "AI-Powered Personalization",
                description:
                  "Claude AI tailors surveys and matchmaking to your playstyle, delivering personalized gaming experiences and strategic insights.",
                color: "text-metallic-silver",
                bgGradient: "from-metallic-silver/20 to-metallic-silver/5",
              },
              {
                icon: BarChart3,
                title: "Transparent Earnings Dashboard",
                description:
                  "Track your earnings, survey completions, and experience bonuses in real-time, securely stored in our scalable PostgreSQL database.",
                color: "text-accent-blue",
                bgGradient: "from-accent-blue/20 to-accent-blue/5",
              },
              {
                icon: Globe,
                title: "Vibrant Community Hubs",
                description:
                  "Create or join customizable hubs for tournaments, strategy sharing, and social engagement, fostering a player-driven gaming ecosystem.",
                color: "text-metallic-silver",
                bgGradient: "from-metallic-silver/20 to-metallic-silver/5",
              },
              {
                icon: Heart,
                title: "Wellness-Integrated Sessions",
                description:
                  "Track sessions with FPS, latency, and wellness metrics like break counts, promoting balanced gaming in a first-of-its-kind integration.",
                color: "text-accent-blue",
                bgGradient: "from-accent-blue/20 to-accent-blue/5",
              },
              {
                icon: Building2,
                title: "B2B Survey Marketplace",
                description:
                  "Companies create targeted survey requests with custom budgets and audience criteria, accessing real-time player insights.",
                color: "text-metallic-silver",
                bgGradient: "from-metallic-silver/20 to-metallic-silver/5",
              },
              {
                icon: TrendingUp,
                title: "Enterprise Dashboards",
                description:
                  "B2B users access analytics, survey management, and insights reports, enabling data-driven decisions for developers and manufacturers.",
                color: "text-accent-blue",
                bgGradient: "from-accent-blue/20 to-accent-blue/5",
              },
            ].map((feature, index) => (
              <Card key={index} className="holo-card group">
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-white mb-4">{feature.title}</CardTitle>
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
      <section id="how-it-works" className="py-32 bg-gunmetal-gray/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 holographic-text">
              Experience the Power of Claude AI and PostgreSQL
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {[
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
                  icon: Users,
                },
                {
                  step: "05",
                  title: "Build Communities and Partnerships",
                  description:
                    "Participate in hubs or B2B integrations for tournaments and data-driven collaborations, pioneering a holistic ecosystem.",
                  icon: Globe,
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-8 group">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 flex items-center justify-center border border-accent-blue/30 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-8 h-8 text-accent-blue" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-6xl font-bold text-accent-blue/30">{item.step}</span>
                      <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-metallic-silver/80 text-lg leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Button className="holo-button-primary text-lg px-8 py-4">
              Join the Revolution
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 holographic-text">Real-World Impact</h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              See how GameSyncSphere transforms gaming experiences across the ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Player Earning in Call of Duty",
                description:
                  "A competitive player completes a Claude AI survey on match performance, earning $16.50 with a $1.00 experience bonus, uniquely monetizing insights.",
                earnings: "$16.50",
                icon: Target,
              },
              {
                title: "Hardware Insights Survey",
                description:
                  "A hardware manufacturer creates a request with a $2000 budget for 500 responses on equipment satisfaction, enabling precise data acquisition.",
                earnings: "$2,000",
                icon: Building2,
              },
              {
                title: "Apex Legends Squad Coordination",
                description:
                  "A team forms a party with secure WebRTC communication, strategizing across PC and console in real-time, bridging analytics with community.",
                earnings: "Real-time",
                icon: Users,
              },
              {
                title: "B2B Dashboard Analytics",
                description:
                  "A game developer views real-time responses and insights on their dashboard, with total spent and average cost per response supporting innovation.",
                earnings: "Analytics",
                icon: BarChart3,
              },
              {
                title: "Valorant Tournament Hub",
                description:
                  "A community hosts a tournament in a customizable hub, with Claude AI suggesting match formats based on player analytics.",
                earnings: "Community",
                icon: Award,
              },
              {
                title: "Earnings Transparency",
                description:
                  "A player reviews their $75.00 total earnings and 15 completed surveys, achieving Expert-level bonuses promoting sustained participation.",
                earnings: "$75.00",
                icon: DollarSign,
              },
            ].map((useCase, index) => (
              <Card key={index} className="holo-card group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <useCase.icon className="w-8 h-8 text-accent-blue" />
                    <Badge className="holo-badge-small">{useCase.earnings}</Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-white mb-3">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-metallic-silver/80 leading-relaxed">
                    {useCase.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Developer & B2B Section */}
      <section id="developers" className="py-32 bg-gunmetal-gray/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 holographic-text">Innovate with GameSyncSphere</h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              Leverage our APIs and B2B platform to build the future of gaming analytics
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-bold text-white mb-8">For Developers</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Code className="w-6 h-6 text-accent-blue mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Survey Generation API</h4>
                    <p className="text-metallic-silver/80">
                      Leverage Claude AI to generate personalized surveys for your applications
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Database className="w-6 h-6 text-accent-blue mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">User Analytics API</h4>
                    <p className="text-metallic-silver/80">Access comprehensive user gaming analytics and insights</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Github className="w-6 h-6 text-accent-blue mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">GitHub Integration</h4>
                    <p className="text-metallic-silver/80">
                      Host repositories and CI/CD pipelines for seamless development
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white mb-8">For Companies</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Building2 className="w-6 h-6 text-accent-blue mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Company Registration</h4>
                    <p className="text-metallic-silver/80">Register your company and access B2B survey marketplace</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Target className="w-6 h-6 text-accent-blue mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Survey Requests</h4>
                    <p className="text-metallic-silver/80">
                      Create targeted survey requests with custom budgets and criteria
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <BarChart3 className="w-6 h-6 text-accent-blue mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Enterprise Dashboards</h4>
                    <p className="text-metallic-silver/80">Access comprehensive analytics and insights reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <Card className="holo-card">
              <CardContent className="p-8">
                <div className="bg-primary-dark/50 rounded-lg p-6 font-mono text-sm">
                  <div className="text-accent-blue mb-2">// Create a survey request</div>
                  <div className="text-white">
                    <span className="text-metallic-silver">const</span> surveyRequest ={" "}
                    <span className="text-metallic-silver">await</span> fetch(
                    <span className="text-green-400">'/api/companies/survey-requests'</span>, {"{"}
                  </div>
                  <div className="text-white ml-4">
                    method: <span className="text-green-400">'POST'</span>,
                  </div>
                  <div className="text-white ml-4">body: JSON.stringify({"{"}</div>
                  <div className="text-white ml-8">
                    budget: <span className="text-yellow-400">2000</span>,
                  </div>
                  <div className="text-white ml-8">
                    targetAudience: <span className="text-green-400">'competitive_players'</span>,
                  </div>
                  <div className="text-white ml-8">
                    targetInsights: <span className="text-green-400">'hardware_satisfaction'</span>
                  </div>
                  <div className="text-white ml-4">{"}"}</div>
                  <div className="text-white">{"}"}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button className="holo-button-primary text-lg px-8 py-4">
              Access Developer Docs
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Stats Section */}
      <section id="stats" className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 holographic-text">GameSyncSphere in Action</h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              Real-time statistics showcasing our revolutionary impact on gaming analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                value: formatNumber(stats.totalUsers),
                label: "Active Players",
                icon: Users,
                suffix: "+",
              },
              {
                value: `$${formatNumber(stats.totalEarnings)}`,
                label: "Player Earnings",
                icon: DollarSign,
                suffix: "+",
              },
              {
                value: formatNumber(stats.totalCompanies),
                label: "Partner Companies",
                icon: Building2,
                suffix: "+",
              },
              {
                value: formatNumber(stats.totalSurveys),
                label: "Surveys Completed",
                icon: BarChart3,
                suffix: "+",
              },
              {
                value: `$${stats.avgEarningsPerUser}`,
                label: "Avg. Earnings per User",
                icon: TrendingUp,
                suffix: "",
              },
              {
                value: `${stats.completionRate}%`,
                label: "Completion Rate",
                icon: Activity,
                suffix: "",
              },
            ].map((stat, index) => (
              <Card key={index} className="holo-card text-center">
                <CardContent className="p-8">
                  <stat.icon className="w-12 h-12 text-accent-blue mx-auto mb-6" />
                  <div className="text-4xl md:text-5xl font-bold text-white mb-4 counter-animation">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-metallic-silver/80 text-lg">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="holo-button-secondary bg-transparent">
              View Platform Stats
              <BarChart3 className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-accent-blue/20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Gamepad2 className="h-8 w-8 text-accent-blue" />
                <span className="text-2xl font-bold holographic-text">GameSyncSphere</span>
              </div>
              <p className="text-metallic-silver/80 mb-8 max-w-md">
                The world's first AIaaS for gaming data analytics, empowering players with compensated insights and
                enabling B2B marketplaces in a privacy-first ecosystem.
              </p>

              <form onSubmit={handleEmailSubmit} className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="holo-input flex-1"
                  required
                />
                <Button type="submit" disabled={isSubmitting} className="holo-button-primary">
                  {isSubmitting ? <Zap className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                </Button>
              </form>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Platform</h4>
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
              <h4 className="text-lg font-semibold text-white mb-6">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center hover:bg-accent-blue/30 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-accent-blue" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center hover:bg-accent-blue/30 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-accent-blue" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center hover:bg-accent-blue/30 transition-colors"
                >
                  <Github className="w-5 h-5 text-accent-blue" />
                </a>
              </div>

              <div className="mt-8">
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
