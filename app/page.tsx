"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Gamepad2,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Shield,
  Brain,
  Star,
  ArrowRight,
  CheckCircle,
  Mail,
  Play,
} from "lucide-react"
import Link from "next/link"

interface PlatformStats {
  totalUsers: number
  totalEarnings: number
  totalCompanies: number
  totalSurveys: number
  uptime: number
  averageEarningsPerUser: string
  monthlyGrowth: {
    users: number
    earnings: number
    companies: number
    surveys: number
  }
}

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch platform stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/platform/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        // Fallback stats
        setStats({
          totalUsers: 150000,
          totalEarnings: 2500000,
          totalCompanies: 500,
          totalSurveys: 1200000,
          uptime: 99.9,
          averageEarningsPerUser: "16.67",
          monthlyGrowth: {
            users: 12,
            earnings: 25,
            companies: 8,
            surveys: 18,
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source: "landing_page" }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscriptionStatus("success")
        setEmail("")
      } else {
        setSubscriptionStatus("error")
      }
    } catch (error) {
      console.error("Newsletter subscription failed:", error)
      setSubscriptionStatus("error")
    } finally {
      setIsSubscribing(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particles-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold holographic-text">GameSyncSphere</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-white/80 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#stats" className="text-white/80 hover:text-white transition-colors">
                Stats
              </Link>
              <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Button className="neon-button">Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
              🚀 Revolutionary AI Gaming Platform
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 holographic-text">
              Earn Money from
              <br />
              Gaming Insights
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
              The world's first player-compensated gaming analytics platform powered by Claude AI.
              <br />
              Complete surveys, earn real money, and shape the future of gaming.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="neon-button text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Start Earning Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/dashboard" className="flex items-center">
                  View Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Live Stats */}
            {!isLoading && stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" id="stats">
                <div className="gaming-card p-6 text-center holographic-glow">
                  <div className="text-3xl font-bold text-blue-400 counter-animation">
                    {formatNumber(stats.totalUsers)}+
                  </div>
                  <div className="text-white/60 text-sm">Active Players</div>
                </div>
                <div className="gaming-card p-6 text-center holographic-glow">
                  <div className="text-3xl font-bold text-green-400 counter-animation">
                    ${formatNumber(stats.totalEarnings)}+
                  </div>
                  <div className="text-white/60 text-sm">Player Earnings</div>
                </div>
                <div className="gaming-card p-6 text-center holographic-glow">
                  <div className="text-3xl font-bold text-purple-400 counter-animation">
                    {formatNumber(stats.totalCompanies)}+
                  </div>
                  <div className="text-white/60 text-sm">Partner Companies</div>
                </div>
                <div className="gaming-card p-6 text-center holographic-glow">
                  <div className="text-3xl font-bold text-orange-400 counter-animation">
                    {formatNumber(stats.totalSurveys)}+
                  </div>
                  <div className="text-white/60 text-sm">Surveys Completed</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4" id="features">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 holographic-text">Revolutionary Features</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Experience the future of gaming analytics with AI-powered surveys, real earnings, and community-driven
              insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Claude AI Surveys",
                description:
                  "Personalized surveys powered by Claude AI that adapt to your gaming style and preferences.",
                color: "text-blue-400",
                bgColor: "bg-blue-500/20",
              },
              {
                icon: DollarSign,
                title: "Real Money Earnings",
                description:
                  "Earn up to $15.50+ per survey with experience-based bonuses. Your insights have real value.",
                color: "text-green-400",
                bgColor: "bg-green-500/20",
              },
              {
                icon: Shield,
                title: "Secure & Transparent",
                description: "SHA-256 encryption, token-based sessions, and complete transparency on all earnings.",
                color: "text-purple-400",
                bgColor: "bg-purple-500/20",
              },
              {
                icon: Users,
                title: "Community Hubs",
                description: "Join vibrant gaming communities, participate in tournaments, and share strategies.",
                color: "text-orange-400",
                bgColor: "bg-orange-500/20",
              },
              {
                icon: TrendingUp,
                title: "Experience Bonuses",
                description: "Earn more as you complete surveys. Expert players can earn significant bonuses.",
                color: "text-pink-400",
                bgColor: "bg-pink-500/20",
              },
              {
                icon: Zap,
                title: "Real-Time Analytics",
                description: "Track your earnings, survey completions, and gaming insights in real-time.",
                color: "text-cyan-400",
                bgColor: "bg-cyan-500/20",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="gaming-card border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <Card className="gaming-card border-white/20 max-w-2xl mx-auto holographic-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white mb-4">Join the Revolution</CardTitle>
              <CardDescription className="text-lg text-white/80">
                Get early access to new features, exclusive earning opportunities, and developer updates straight to
                your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                  <Button type="submit" disabled={isSubscribing} className="neon-button">
                    {isSubscribing ? (
                      <div className="loading-spinner w-4 h-4" />
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </div>

                {subscriptionStatus === "success" && (
                  <div className="flex items-center text-green-400 text-sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Successfully subscribed! Welcome to GameSyncSphere.
                  </div>
                )}

                {subscriptionStatus === "error" && (
                  <div className="text-red-400 text-sm">Subscription failed. Please try again.</div>
                )}
              </form>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/60">
                <div className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-yellow-400" />
                  Early access features
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-green-400" />
                  Exclusive earning opportunities
                </div>
                <div className="flex items-center">
                  <Brain className="mr-2 h-4 w-4 text-blue-400" />
                  Developer insights
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-purple-400" />
                  Community events
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Gamepad2 className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">GameSyncSphere</span>
            </div>

            <div className="flex items-center space-x-6 text-white/60">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/api/platform/stats" className="hover:text-white transition-colors">
                API
              </Link>
              <Link href="/health" className="hover:text-white transition-colors">
                Status
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/60">
            <p>&copy; 2025 GameSyncSphere. Revolutionary AI Gaming Analytics Platform.</p>
            <p className="mt-2 text-sm">Powered by Claude AI • Secure PostgreSQL Database • Real Money Earnings</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
