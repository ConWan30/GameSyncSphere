"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Gamepad2,
  DollarSign,
  TrendingUp,
  Users,
  Brain,
  Star,
  Clock,
  Award,
  ArrowRight,
  LogOut,
  Settings,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserStats {
  totalEarnings: number
  surveysCompleted: number
  currentLevel: number
  experiencePoints: number
  nextLevelXP: number
  averageRating: number
  joinDate: string
  lastSurvey: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))

    // Fetch user stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/user/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        } else {
          // Fallback demo stats
          setStats({
            totalEarnings: 247.5,
            surveysCompleted: 16,
            currentLevel: 3,
            experiencePoints: 1250,
            nextLevelXP: 2000,
            averageRating: 4.8,
            joinDate: "2024-12-15",
            lastSurvey: "2025-01-11",
          })
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        // Fallback demo stats
        setStats({
          totalEarnings: 247.5,
          surveysCompleted: 16,
          currentLevel: 3,
          experiencePoints: 1250,
          nextLevelXP: 2000,
          averageRating: 4.8,
          joinDate: "2024-12-15",
          lastSurvey: "2025-01-11",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleStartSurvey = () => {
    router.push("/surveys/new")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particles-container">
          {[...Array(30)].map((_, i) => (
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
            <Link href="/" className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold holographic-text">GameSyncSphere</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white/80 hover:text-white">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" className="text-white/80 hover:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.username || "Gamer"}! 🎮</h1>
          <p className="text-white/70 text-lg">Ready to earn from your gaming insights?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gaming-card border-white/20 holographic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-400">${stats?.totalEarnings.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/20 holographic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Surveys Completed</p>
                  <p className="text-2xl font-bold text-blue-400">{stats?.surveysCompleted}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/20 holographic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Current Level</p>
                  <p className="text-2xl font-bold text-purple-400">{stats?.currentLevel}</p>
                </div>
                <Award className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/20 holographic-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Average Rating</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats?.averageRating}/5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Surveys */}
            <Card className="gaming-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-blue-400" />
                  Available Surveys
                </CardTitle>
                <CardDescription className="text-white/70">Complete AI-powered surveys and earn money</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "FPS Gaming Preferences",
                    description: "Share your insights about first-person shooter games",
                    reward: "$12.50",
                    time: "8 min",
                    difficulty: "Easy",
                  },
                  {
                    title: "Mobile Gaming Habits",
                    description: "Tell us about your mobile gaming experience",
                    reward: "$15.75",
                    time: "12 min",
                    difficulty: "Medium",
                  },
                  {
                    title: "RPG Character Development",
                    description: "Advanced survey about role-playing game mechanics",
                    reward: "$18.25",
                    time: "15 min",
                    difficulty: "Hard",
                  },
                ].map((survey, index) => (
                  <div
                    key={index}
                    className="border border-white/10 rounded-lg p-4 hover:border-white/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{survey.title}</h3>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{survey.reward}</Badge>
                    </div>
                    <p className="text-white/60 text-sm mb-3">{survey.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-white/50 text-xs">
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {survey.time}
                        </span>
                        <Badge variant="outline" className="border-white/20 text-white/60">
                          {survey.difficulty}
                        </Badge>
                      </div>
                      <Button onClick={handleStartSurvey} size="sm" className="neon-button">
                        Start Survey
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="gaming-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-orange-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      action: "Completed survey",
                      title: "Battle Royale Preferences",
                      reward: "+$14.25",
                      time: "2 hours ago",
                    },
                    { action: "Level up", title: "Reached Level 3", reward: "+50 XP", time: "1 day ago" },
                    {
                      action: "Completed survey",
                      title: "Gaming Hardware Survey",
                      reward: "+$11.75",
                      time: "3 days ago",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0"
                    >
                      <div>
                        <p className="text-white text-sm">
                          {activity.action}: {activity.title}
                        </p>
                        <p className="text-white/50 text-xs">{activity.time}</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{activity.reward}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <Card className="gaming-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-purple-400" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-purple-400 mb-1">Level {stats?.currentLevel}</div>
                  <div className="text-white/60 text-sm">
                    {stats?.experiencePoints} / {stats?.nextLevelXP} XP
                  </div>
                </div>
                <Progress value={((stats?.experiencePoints || 0) / (stats?.nextLevelXP || 1)) * 100} className="mb-4" />
                <div className="text-center">
                  <p className="text-white/60 text-xs">
                    {(stats?.nextLevelXP || 0) - (stats?.experiencePoints || 0)} XP to next level
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="gaming-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleStartSurvey} className="w-full neon-button">
                  <Brain className="mr-2 h-4 w-4" />
                  Take Survey
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Join Community
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Withdraw Earnings
                </Button>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="gaming-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="mr-2 h-5 w-5 text-yellow-400" />
                  Latest Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-white font-medium mb-1">Survey Master</h3>
                  <p className="text-white/60 text-sm">Completed 15+ surveys</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
