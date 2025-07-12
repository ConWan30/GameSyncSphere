"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  Gamepad2,
  ArrowLeft,
  Plus,
  BarChart3,
  Star,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  username: string
  full_name: string
  total_earnings: number
  completed_surveys: number
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("gamesyncsphere_token")
    const userData = localStorage.getItem("gamesyncsphere_user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchUserData(token)
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/auth/login")
    }
  }, [router])

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch("/api/user/surveys", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser((prev) => (prev ? { ...prev, ...data.user } : null))
      } else if (response.status === 401) {
        // Token expired
        localStorage.removeItem("gamesyncsphere_token")
        localStorage.removeItem("gamesyncsphere_user")
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError("Failed to load user data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("gamesyncsphere_token")
    localStorage.removeItem("gamesyncsphere_user")
    router.push("/")
  }

  const getExperienceLevel = (surveys: number) => {
    if (surveys < 5) return { level: "Beginner", color: "text-blue-400", bgColor: "bg-blue-500/20" }
    if (surveys < 15) return { level: "Experienced", color: "text-green-400", bgColor: "bg-green-500/20" }
    return { level: "Expert", color: "text-purple-400", bgColor: "bg-purple-500/20" }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="gaming-card border-red-500/30 max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Error Loading Dashboard</CardTitle>
            <CardDescription className="text-white/70">
              Unable to load your dashboard. Please try logging in again.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/auth/login")} className="neon-button">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const experienceInfo = getExperienceLevel(user.completed_surveys)
  const nextLevelSurveys = user.completed_surveys < 5 ? 5 : user.completed_surveys < 15 ? 15 : null
  const progressToNext = nextLevelSurveys ? (user.completed_surveys / nextLevelSurveys) * 100 : 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold holographic-text">GameSyncSphere</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.username}! 🎮</h1>
          <p className="text-white/70">Ready to earn more from your gaming insights?</p>
          <div className="flex items-center space-x-4 mt-4">
            <Badge className={`${experienceInfo.bgColor} ${experienceInfo.color} border-current`}>
              <Star className="mr-1 h-3 w-3" />
              {experienceInfo.level} Player
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              💰 ${user.total_earnings.toFixed(2)} Earned
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gaming-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${user.total_earnings.toFixed(2)}</div>
              <p className="text-xs text-white/60 mt-1">
                Avg: ${user.completed_surveys > 0 ? (user.total_earnings / user.completed_surveys).toFixed(2) : "0.00"}{" "}
                per survey
              </p>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Surveys Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{user.completed_surveys}</div>
              <p className="text-xs text-white/60 mt-1">
                Experience bonus: +${(user.completed_surveys * 0.5).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Experience Level</CardTitle>
              <Award className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${experienceInfo.color}`}>{experienceInfo.level}</div>
              {nextLevelSurveys && (
                <div className="mt-2">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    {nextLevelSurveys - user.completed_surveys} surveys to next level
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Next Survey Bonus</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+${(user.completed_surveys * 0.5).toFixed(2)}</div>
              <p className="text-xs text-white/60 mt-1">Added to base survey earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="gaming-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Plus className="mr-2 h-5 w-5 text-blue-400" />
                Generate New Survey
              </CardTitle>
              <CardDescription className="text-white/70">
                Create a personalized Claude AI survey and start earning immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Estimated Earnings:</span>
                  <span className="text-green-400 font-semibold">
                    ${(15.5 + user.completed_surveys * 0.5).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Estimated Time:</span>
                  <span className="text-white">3-5 minutes</span>
                </div>
                <Button className="w-full neon-button">
                  <Target className="mr-2 h-4 w-4" />
                  Generate Survey
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-400" />
                Earnings History
              </CardTitle>
              <CardDescription className="text-white/70">
                View your complete earnings history and survey analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">This Month:</span>
                  <span className="text-green-400 font-semibold">${user.total_earnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Average per Survey:</span>
                  <span className="text-white">
                    ${user.completed_surveys > 0 ? (user.total_earnings / user.completed_surveys).toFixed(2) : "0.00"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="gaming-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-white/70">Your latest surveys and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            {user.completed_surveys === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Ready to Start Earning?</h3>
                <p className="text-white/60 mb-4">
                  Complete your first survey to begin earning money from your gaming insights.
                </p>
                <Button className="neon-button">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Your First Survey
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <h4 className="text-white font-medium">Survey Completed</h4>
                    <p className="text-white/60 text-sm">Gaming preferences survey</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">+$16.00</div>
                    <div className="text-white/60 text-xs">2 hours ago</div>
                  </div>
                </div>
                <div className="text-center">
                  <Button variant="ghost" className="text-white/60 hover:text-white">
                    View All Activity
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
