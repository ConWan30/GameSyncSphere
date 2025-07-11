"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  UserGroupIcon,
  HeartIcon,
  BuildingOfficeIcon,
  ChartPieIcon,
  CodeBracketIcon,
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ChatBubbleLeftRightIcon,
  PresentationChartBarIcon,
  UsersIcon,
  TrophyIcon,
  DocumentTextIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"

// Animated counter component
function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
}: {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span className="holographic-text">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// Holographic card component
function HolographicCard({
  icon: Icon,
  title,
  description,
  className = "",
}: {
  icon: any
  title: string
  description: string
  className?: string
}) {
  return (
    <Card className={`holographic-card group cursor-pointer transition-all duration-500 hover:scale-105 ${className}`}>
      <CardHeader className="pb-4">
        <div className="holographic-icon-container mb-4">
          <Icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
        </div>
        <CardTitle className="text-white group-hover:text-blue-300 transition-colors duration-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

export default function GameSyncSphereLanding() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setEmail("")
    alert("Thank you for joining the revolution!")
  }

  return (
    <div className="min-h-screen bg-charcoal text-white overflow-x-hidden">
      {/* Custom CSS for holographic effects */}
      <style jsx global>{`
        :root {
          --charcoal: #0A0A0A;
          --gunmetal: #2A2A2A;
          --silver: #A9A9A9;
          --glow-blue: #1E3A8A;
          --bright-blue: #3B82F6;
        }

        .bg-charcoal {
          background-color: var(--charcoal);
        }

        .holographic-card {
          background: linear-gradient(135deg, rgba(42, 42, 42, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .holographic-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
          transition: left 0.5s;
        }

        .holographic-card:hover::before {
          left: 100%;
        }

        .holographic-icon-container {
          position: relative;
          width: fit-content;
        }

        .holographic-icon-container::after {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .holographic-card:hover .holographic-icon-container::after {
          opacity: 1;
        }

        .holographic-text {
          background: linear-gradient(45deg, #3B82F6, #60A5FA, #93C5FD);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }

        .floating-element {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .glow-effect {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          transition: box-shadow 0.3s ease;
        }

        .glow-effect:hover {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
        }

        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        .holographic-button {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(30, 58, 138, 0.8) 100%);
          border: 1px solid rgba(59, 130, 246, 0.5);
          position: relative;
          overflow: hidden;
        }

        .holographic-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .holographic-button:hover::before {
          left: 100%;
        }

        .schema-node {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .schema-node:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
        }

        .holographic-input {
          background: rgba(42, 42, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          backdrop-filter: blur(10px);
        }

        .holographic-input:focus {
          border-color: rgba(59, 130, 246, 0.8);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-charcoal/80 backdrop-blur-md border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center glow-effect">
                <CpuChipIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold holographic-text">GameSyncSphere</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors">
                How It Works
              </Link>
              <Link href="#developers" className="text-gray-300 hover:text-blue-400 transition-colors">
                Developers
              </Link>
              <Link href="#stats" className="text-gray-300 hover:text-blue-400 transition-colors">
                Stats
              </Link>
              <Button className="holographic-button text-white">Start Earning Today</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          <div
            className="floating-element absolute top-40 right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="floating-element absolute bottom-20 left-1/4 w-24 h-24 bg-blue-600/10 rounded-full blur-lg"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2 text-sm">
            <SparklesIcon className="w-4 h-4 mr-2" />
            World's First AIaaS for Gaming Data Analytics
          </Badge>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="holographic-text">GameSyncSphere:</span>
            <br />
            <span className="text-white">Pioneer the Future of</span>
            <br />
            <span className="holographic-text">Gaming Analytics</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            As the world's first AIaaS for gaming data analytics, empower players with compensated insights, wellness
            monitoring, and community tools, while enabling B2B marketplaces for developers and manufacturers in a
            privacy-first ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="holographic-button text-white px-8 py-4 text-lg">
              <PlayIcon className="w-6 h-6 mr-2" />
              Start Earning Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-8 py-4 text-lg bg-transparent"
            >
              Explore the Innovation
              <ArrowRightIcon className="w-6 h-6 ml-2" />
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <AnimatedCounter end={150000} suffix="+" />
              </div>
              <div className="text-gray-400">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <AnimatedCounter end={2500000} prefix="$" />
              </div>
              <div className="text-gray-400">Player Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="text-gray-400">B2B Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <AnimatedCounter end={99} suffix=".9%" />
              </div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="holographic-text">Revolutionary</span> Gaming Ecosystem
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Bridging players, developers, and manufacturers through AI-powered analytics and transparent compensation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HolographicCard
              icon={CurrencyDollarIcon}
              title="Earn with Claude AI Surveys"
              description="Answer personalized surveys crafted by Claude AI, tailored to your gaming habits, and earn up to $15.50+ per survey with experience-based bonuses, uniquely compensating players for insights that shape industry trends."
            />

            <HolographicCard
              icon={ShieldCheckIcon}
              title="Fortified Authentication"
              description="Securely register and log in with SHA-256 hashed passwords and token-based sessions, safeguarded by our robust PostgreSQL database, ensuring ethical data handling absent in traditional analytics tools."
            />

            <HolographicCard
              icon={ChatBubbleLeftRightIcon}
              title="Dynamic Party Communication"
              description="Form real-time gaming parties with secure, low-latency voice, video, and text communication, seamlessly connecting PC, console, and mobile players, fostering engagement beyond standard platforms."
            />

            <HolographicCard
              icon={CpuChipIcon}
              title="AI-Powered Personalization"
              description="Claude AI tailors surveys and matchmaking to your playstyle, delivering personalized gaming experiences and strategic insights, a novel extension of AI in gaming not found in competitors."
            />

            <HolographicCard
              icon={ChartBarIcon}
              title="Transparent Earnings Dashboard"
              description="Track your earnings, survey completions, and experience bonuses in real-time, securely stored in our scalable PostgreSQL database, providing unprecedented transparency for player empowerment."
            />

            <HolographicCard
              icon={UsersIcon}
              title="Vibrant Community Hubs"
              description="Create or join customizable hubs for tournaments, strategy sharing, and social engagement, fostering a player-driven gaming ecosystem, uniquely bridging analytics with community."
            />

            <HolographicCard
              icon={HeartIcon}
              title="Wellness-Integrated Sessions"
              description="Track sessions with FPS, latency, and wellness metrics like break counts, promoting balanced gaming, addressing industry concerns for responsible play in a first-of-its-kind integration."
            />

            <HolographicCard
              icon={BuildingOfficeIcon}
              title="B2B Survey Marketplace"
              description="Companies create targeted survey requests with custom budgets and audience criteria, accessing real-time player insights, establishing a bidirectional value exchange unmatched in the market."
            />

            <HolographicCard
              icon={PresentationChartBarIcon}
              title="Enterprise Dashboards"
              description="B2B users access analytics, survey management, and insights reports, enabling data-driven decisions for developers and manufacturers with comprehensive business intelligence."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gunmetal/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Experience the Power of <span className="holographic-text">Claude AI</span> and PostgreSQL
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A streamlined overview of our revolutionary platform's core functionality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="holographic-icon-container mx-auto mb-4">
                <LockClosedIcon className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Secure Registration</h3>
              <p className="text-gray-300 text-sm">
                Sign up as a player or company, protected by SHA-256 hashing and stored in PostgreSQL
              </p>
            </div>

            <div className="text-center">
              <div className="holographic-icon-container mx-auto mb-4">
                <SparklesIcon className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Engage with AI Surveys</h3>
              <p className="text-gray-300 text-sm">
                Players complete Claude AI-generated surveys; companies request targeted ones
              </p>
            </div>

            <div className="text-center">
              <div className="holographic-icon-container mx-auto mb-4">
                <ChartPieIcon className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Track Earnings</h3>
              <p className="text-gray-300 text-sm">
                Monitor player earnings or company budgets via real-time dashboards
              </p>
            </div>

            <div className="text-center">
              <div className="holographic-icon-container mx-auto mb-4">
                <UserGroupIcon className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Connect Seamlessly</h3>
              <p className="text-gray-300 text-sm">
                Join parties for cross-platform communication tied to real-time gaming activity
              </p>
            </div>

            <div className="text-center">
              <div className="holographic-icon-container mx-auto mb-4">
                <TrophyIcon className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Build Communities</h3>
              <p className="text-gray-300 text-sm">
                Participate in hubs or B2B integrations for tournaments and collaborations
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="holographic-button text-white px-8 py-3">Join the Revolution</Button>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="holographic-text">Real-World</span> Impact Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how GameSyncSphere transforms gaming experiences across the ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CurrencyDollarIcon className="w-6 h-6 mr-2 text-green-400" />
                  Player Earning in Call of Duty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  A competitive player completes a Claude AI survey on match performance, earning $16.50 with a $1.00
                  experience bonus, uniquely monetizing insights unlike traditional tools.
                </p>
              </CardContent>
            </Card>

            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BuildingOfficeIcon className="w-6 h-6 mr-2 text-blue-400" />
                  Hardware Insights Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  A hardware manufacturer creates a request with a $2000 budget for 500 responses on equipment
                  satisfaction, enabling precise data acquisition in a novel marketplace.
                </p>
              </CardContent>
            </Card>

            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <UserGroupIcon className="w-6 h-6 mr-2 text-purple-400" />
                  Apex Legends Squad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  A team forms a party with secure WebRTC communication, strategizing across PC and console in
                  real-time, bridging analytics with community engagement.
                </p>
              </CardContent>
            </Card>

            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ChartBarIcon className="w-6 h-6 mr-2 text-orange-400" />
                  B2B Dashboard Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  A game developer views real-time responses and insights on their dashboard, with total spent and
                  average cost per response, supporting data-driven innovation.
                </p>
              </CardContent>
            </Card>

            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrophyIcon className="w-6 h-6 mr-2 text-yellow-400" />
                  Valorant Tournament Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  A community hosts a tournament in a customizable hub, with Claude AI suggesting match formats based on
                  player analytics, fostering engagement.
                </p>
              </CardContent>
            </Card>

            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ChartPieIcon className="w-6 h-6 mr-2 text-green-400" />
                  Earnings Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  A player reviews their $75.00 total earnings and 15 completed surveys, achieving Expert-level bonuses,
                  promoting sustained participation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Developer and B2B Section */}
      <section id="developers" className="py-20 bg-gunmetal/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="holographic-text">Innovate</span> with GameSyncSphere
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leverage our APIs and B2B platform to build the future of gaming analytics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white flex items-center">
                <CodeBracketIcon className="w-8 h-8 mr-3 text-blue-400" />
                For Developers
              </h3>
              <p className="text-gray-300 mb-6">
                Leverage APIs for survey generation and user analytics to build custom integrations, standing out in a
                market lacking compensated models.
              </p>
              <div className="holographic-card p-6 mb-6">
                <pre className="text-sm text-green-400 overflow-x-auto">
                  {`// Generate AI Survey
const response = await fetch('/api/survey/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    gameContext: { game: 'valorant' },
    targetInsights: ['equipment_satisfaction']
  })
});

const survey = await response.json();
console.log('Estimated earnings:', survey.estimatedEarnings);`}
                </pre>
              </div>
              <Button className="holographic-button text-white">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Access Developer Docs
              </Button>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-6 text-white flex items-center">
                <BuildingOfficeIcon className="w-8 h-8 mr-3 text-blue-400" />
                For Companies
              </h3>
              <p className="text-gray-300 mb-6">
                Register, create survey requests, and access dashboards for insights, with pricing plans and budgeting
                tools enabling ethical data exchange.
              </p>
              <div className="space-y-4 mb-6">
                <div className="holographic-card p-4">
                  <h4 className="font-bold text-white mb-2">Starter Plan</h4>
                  <p className="text-gray-300 text-sm">$500 • 100 responses • Basic Analytics</p>
                </div>
                <div className="holographic-card p-4">
                  <h4 className="font-bold text-white mb-2">Professional Plan</h4>
                  <p className="text-gray-300 text-sm">$2,000 • 500 responses • Advanced Analytics + API</p>
                </div>
                <div className="holographic-card p-4">
                  <h4 className="font-bold text-white mb-2">Enterprise Plan</h4>
                  <p className="text-gray-300 text-sm">$10,000 • Unlimited • Real-time Data + Support</p>
                </div>
              </div>
              <Button className="holographic-button text-white">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                Start B2B Partnership
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats Section */}
      <section id="stats" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="holographic-text">GameSyncSphere</span> in Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time statistics showcasing our revolutionary platform's impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="holographic-card text-center p-8">
              <div className="text-4xl md:text-5xl font-bold mb-4">
                <AnimatedCounter end={150000} suffix="+" />
              </div>
              <div className="text-gray-400 text-lg">Active Players</div>
              <div className="text-blue-400 text-sm mt-2">+12% this month</div>
            </div>

            <div className="holographic-card text-center p-8">
              <div className="text-4xl md:text-5xl font-bold mb-4">
                <AnimatedCounter end={2500000} prefix="$" />
              </div>
              <div className="text-gray-400 text-lg">Total Earnings Paid</div>
              <div className="text-green-400 text-sm mt-2">+25% this month</div>
            </div>

            <div className="holographic-card text-center p-8">
              <div className="text-4xl md:text-5xl font-bold mb-4">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="text-gray-400 text-lg">B2B Partners</div>
              <div className="text-purple-400 text-sm mt-2">+8% this month</div>
            </div>

            <div className="holographic-card text-center p-8">
              <div className="text-4xl md:text-5xl font-bold mb-4">
                <AnimatedCounter end={1200000} suffix="+" />
              </div>
              <div className="text-gray-400 text-lg">Surveys Completed</div>
              <div className="text-blue-400 text-sm mt-2">+18% this month</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="holographic-button text-white px-8 py-3">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              View Live Platform Stats
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gunmetal/30 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="holographic-text">Transform Gaming</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of players and developers who are already part of the GameSyncSphere revolution.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="holographic-input text-white placeholder-gray-400"
                required
              />
              <Button type="submit" disabled={isSubmitting} className="holographic-button text-white px-6">
                {isSubmitting ? "Joining..." : "Join Now"}
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="holographic-button text-white px-8 py-3">
              <PlayIcon className="w-5 h-5 mr-2" />
              Start Earning Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-8 py-3 bg-transparent"
            >
              Schedule Demo
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center glow-effect">
                  <CpuChipIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold holographic-text">GameSyncSphere</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Revolutionizing gaming through AI-powered analytics, transparent player compensation, and innovative B2B
                partnerships.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Powered by Claude AI</span>
                <Separator orientation="vertical" className="h-4 bg-gray-600" />
                <span>PostgreSQL Database</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    For Players
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    For Developers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    B2B Solutions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    About GameSyncSphere
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-blue-500/20" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 GameSyncSphere. All rights reserved. Built with Claude AI.
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="mailto:support@gamesyncsphere.com"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <EnvelopeIcon className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <GlobeAltIcon className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <CodeBracketIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
