"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Database,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle,
  DollarSign,
  BarChart3,
  Gamepad2,
  Target,
  Award,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react"

export default function GameSyncSphereLanding() {
  const [email, setEmail] = useState("")
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [cursorType, setCursorType] = useState("")
  const [stats, setStats] = useState({
    users: 0,
    surveys: 0,
    earnings: 0,
    companies: 0,
  })

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animated counters
  useEffect(() => {
    const animateCounters = () => {
      const targetStats = { users: 15420, surveys: 89340, earnings: 2847, companies: 156 }
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setStats({
          users: Math.floor(targetStats.users * progress),
          surveys: Math.floor(targetStats.surveys * progress),
          earnings: Math.floor(targetStats.earnings * progress),
          companies: Math.floor(targetStats.companies * progress),
        })

        if (currentStep >= steps) {
          clearInterval(interval)
          setStats(targetStats)
        }
      }, stepDuration)
    }

    const timer = setTimeout(animateCounters, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Floating particles
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.animationDuration = Math.random() * 3 + 2 + "s"
      particle.style.animationDelay = Math.random() * 2 + "s"

      const container = document.querySelector(".floating-particles")
      if (container) {
        container.appendChild(particle)
        setTimeout(() => {
          if (container.contains(particle)) {
            container.removeChild(particle)
          }
        }, 5000)
      }
    }

    const interval = setInterval(createParticle, 300)
    return () => clearInterval(interval)
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://gamesyncsphere-production.up.railway.app"}/api/newsletter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      )

      if (response.ok) {
        alert("Successfully subscribed to newsletter!")
        setEmail("")
      } else {
        alert("Subscription failed. Please try again.")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      alert("Subscription failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-primary-dark text-white relative overflow-hidden">
      {/* Custom Cursor */}
      <div
        className="custom-cursor"
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
        data-cursor={cursorType}
      />

      {/* Holographic Background */}
      <div className="holographic-bg">
        <div className="holo-grid" />
        <div className="floating-particles" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="holo-logo w-10 h-10 bg-gradient-to-r from-accent-blue to-electric-purple rounded-full flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-orbitron text-xl font-bold gradient-text">GameSyncSphere</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
            <a href="#developers" className="nav-link">
              Developers
            </a>
            <a href="#stats" className="nav-link">
              Stats
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="holo-button-secondary bg-transparent">
              Sign In
            </Button>
            <Button className="holo-button-primary">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="holo-badge mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              World's First AIaaS for Gaming Analytics
            </Badge>
          </div>

          <h1 className="text-6xl md:text-8xl font-orbitron font-bold mb-8 holographic-text">
            GameSync
            <br />
            Sphere
          </h1>

          <p className="text-xl md:text-2xl text-metallic-silver mb-12 max-w-4xl mx-auto leading-relaxed">
            Revolutionary AI-powered gaming analytics platform that compensates players for insights while enabling B2B
            marketplaces in a privacy-first ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button
              size="lg"
              className="holo-button-primary px-8 py-4 text-lg"
              onMouseEnter={() => setCursorType("explore")}
              onMouseLeave={() => setCursorType("")}
            >
              Start Earning <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="holo-button-secondary px-8 py-4 text-lg bg-transparent">
              Watch Demo
            </Button>
          </div>

          {/* Interactive Schema */}
          <div className="holo-interface">
            <div className="floating-schema">
              <div className="schema-node user-node">
                <Users className="w-6 h-6 text-accent-blue" />
                <span>Players</span>
                <div className="schema-tooltip">
                  <p>Gamers earn rewards for sharing insights</p>
                </div>
              </div>

              <div className="schema-node survey-node">
                <Brain className="w-6 h-6 text-electric-purple" />
                <span>Claude AI</span>
                <div className="schema-tooltip">
                  <p>Advanced AI generates personalized surveys</p>
                </div>
              </div>

              <div className="schema-node company-node">
                <Globe className="w-6 h-6 text-neon-green" />
                <span>Companies</span>
                <div className="schema-tooltip">
                  <p>B2B marketplace for gaming insights</p>
                </div>
              </div>

              <div className="schema-node earnings-node">
                <DollarSign className="w-6 h-6 text-cyber-orange" />
                <span>Earnings</span>
                <div className="schema-tooltip">
                  <p>Transparent compensation system</p>
                </div>
              </div>

              <div className="connection-line line-1" />
              <div className="connection-line line-2" />
              <div className="connection-line line-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 gradient-text">Revolutionary Features</h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              Cutting-edge technology meets gaming analytics in our comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Claude AI Surveys",
                description: "Advanced AI generates personalized surveys based on your gaming patterns and preferences",
                color: "text-electric-purple",
              },
              {
                icon: DollarSign,
                title: "Compensated Insights",
                description: "Earn real money for sharing your gaming data and completing AI-generated surveys",
                color: "text-neon-green",
              },
              {
                icon: Database,
                title: "PostgreSQL Analytics",
                description: "Robust database infrastructure for storing and analyzing gaming data at scale",
                color: "text-accent-blue",
              },
              {
                icon: Globe,
                title: "B2B Marketplace",
                description: "Companies access aggregated, anonymized gaming insights through our secure marketplace",
                color: "text-cyber-orange",
              },
              {
                icon: Shield,
                title: "Privacy-First",
                description: "Your data remains secure with advanced encryption and privacy protection protocols",
                color: "text-metallic-silver",
              },
              {
                icon: TrendingUp,
                title: "Real-time Analytics",
                description: "Live dashboards and insights help you understand your gaming patterns and trends",
                color: "text-accent-blue",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="holo-card p-6 parallax-card"
                onMouseEnter={() => setCursorType("feature")}
                onMouseLeave={() => setCursorType("")}
              >
                <CardContent className="p-0">
                  <div
                    className={`holo-icon-container w-12 h-12 rounded-lg bg-gunmetal-gray/50 flex items-center justify-center mb-4 ${feature.color}`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-metallic-silver leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 gradient-text">How It Works</h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              Simple steps to start earning from your gaming insights
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Connect Gaming Accounts",
                description: "Link your gaming platforms securely to our analytics engine",
                icon: Gamepad2,
              },
              {
                step: "02",
                title: "AI Generates Surveys",
                description: "Claude AI creates personalized surveys based on your gaming data",
                icon: Brain,
              },
              {
                step: "03",
                title: "Complete & Earn",
                description: "Answer surveys and earn compensation for your valuable insights",
                icon: Target,
              },
              {
                step: "04",
                title: "Companies Benefit",
                description: "Businesses access aggregated insights through our B2B marketplace",
                icon: Award,
              },
            ].map((step, index) => (
              <div key={index} className="holo-step text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-accent-blue to-electric-purple rounded-full flex items-center justify-center mb-4">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-green rounded-full flex items-center justify-center text-primary-dark font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-metallic-silver">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 gradient-text">Use Cases</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="holo-card p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <Users className="w-8 h-8 text-accent-blue mr-4" />
                  <h3 className="text-2xl font-bold text-white">For Gamers</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Earn money from your gaming data",
                    "Get personalized gaming insights",
                    "Improve your gaming performance",
                    "Connect with gaming community",
                    "Track wellness and screen time",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-metallic-silver">
                      <CheckCircle className="w-5 h-5 text-neon-green mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="holo-card p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <Globe className="w-8 h-8 text-electric-purple mr-4" />
                  <h3 className="text-2xl font-bold text-white">For Companies</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Access aggregated gaming insights",
                    "Understand player behavior patterns",
                    "Improve game development decisions",
                    "Target marketing campaigns effectively",
                    "Conduct market research at scale",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-metallic-silver">
                      <CheckCircle className="w-5 h-5 text-neon-green mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Developer & B2B Section */}
      <section id="developers" className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 gradient-text">Developer & B2B</h2>
            <p className="text-xl text-metallic-silver max-w-3xl mx-auto">
              Powerful APIs and tools for developers and businesses
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white">Robust API Infrastructure</h3>
              <p className="text-lg text-metallic-silver mb-8">
                Built on modern technologies including Claude AI, PostgreSQL, and scalable cloud infrastructure to
                handle enterprise-level demands.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "RESTful API with comprehensive documentation",
                  "Real-time WebSocket connections",
                  "GraphQL endpoint for flexible queries",
                  "SDK support for multiple languages",
                  "Enterprise-grade security and compliance",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Zap className="w-5 h-5 text-accent-blue mr-3" />
                    <span className="text-metallic-silver">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="holo-button-primary">
                View API Docs <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="holo-code-editor bg-gunmetal-gray/30 rounded-xl p-6 border border-accent-blue/20">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <span className="ml-4 text-metallic-silver text-sm">API Example</span>
              </div>
              <pre className="text-accent-blue text-sm overflow-x-auto">
                {`// Get gaming insights
const response = await fetch('/api/insights', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'user123',
    gameId: 'valorant',
    timeRange: '30d'
  })
});

const insights = await response.json();
console.log(insights.playerBehavior);`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section id="stats" className="relative z-40 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 gradient-text">Platform Statistics</h2>
            <p className="text-xl text-metallic-silver">Real-time metrics from our growing ecosystem</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                label: "Active Users",
                value: stats.users.toLocaleString(),
                color: "text-accent-blue",
              },
              {
                icon: BarChart3,
                label: "Surveys Completed",
                value: stats.surveys.toLocaleString(),
                color: "text-electric-purple",
              },
              {
                icon: DollarSign,
                label: "Total Earnings ($)",
                value: `$${stats.earnings.toLocaleString()}`,
                color: "text-neon-green",
              },
              {
                icon: Globe,
                label: "Partner Companies",
                value: stats.companies.toLocaleString(),
                color: "text-cyber-orange",
              },
            ].map((stat, index) => (
              <Card key={index} className="holo-card p-6 text-center holo-stat">
                <CardContent className="p-0">
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <div className={`text-4xl font-bold mb-2 counter-animation ${stat.color}`}>{stat.value}</div>
                  <p className="text-metallic-silver">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative z-40 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="holo-card p-12">
            <CardContent className="p-0">
              <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-6 gradient-text">Join the Revolution</h2>
              <p className="text-xl text-metallic-silver mb-8">
                Be the first to know about new features, earning opportunities, and platform updates.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="holo-input flex-1"
                  required
                />
                <Button
                  type="submit"
                  className="holo-button-primary"
                  onMouseEnter={() => setCursorType("earn")}
                  onMouseLeave={() => setCursorType("")}
                >
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-40 px-6 py-12 border-t border-accent-blue/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="holo-logo w-8 h-8 bg-gradient-to-r from-accent-blue to-electric-purple rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-orbitron text-lg font-bold gradient-text">GameSyncSphere</span>
              </div>
              <p className="text-metallic-silver text-sm">
                Revolutionary AI-powered gaming analytics platform that compensates players for insights.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-metallic-silver">
                <li>
                  <a href="#" className="hover:text-accent-blue transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-blue transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-blue transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-blue transition-colors">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-metallic-silver">
                <li>
                  <a href="#" className="hover:text-accent-blue transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-blue transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-blue transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent-blue transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="holo-social">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="holo-social">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="holo-social">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="holo-social">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-accent-blue/20 pt-8 text-center">
            <p className="text-metallic-silver text-sm">
              © 2024 GameSyncSphere. All rights reserved. Built with Claude AI, PostgreSQL, and cutting-edge technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
