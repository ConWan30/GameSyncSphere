"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, TrendingUp, Users, DollarSign, Brain, Star, ArrowLeft, Play, Clock, Award } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [userStats, setUserStats] = useState({
    totalEarnings: 0,
    surveysCompleted: 0,
    currentLevel: 1,
    nextLevelProgress: 0,
    availableSurveys: 0,
  })

  useEffect(() => {
    // Simulate fetching user stats
    setUserStats({
      totalEarnings: 127.5,
      surveysCompleted: 23,
      currentLevel: 3,
      nextLevelProgress: 65,
      availableSurveys: 8,
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-white/80 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <div className="flex items-center space-x-2">
                <Gamepad2 className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold holographic-text">GameSyncSphere Dashboard</span>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Level {userStats.currentLevel}</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Gamer!</h1>
          <p className="text-white/80">Ready to earn from your gaming insights?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gaming-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${userStats.totalEarnings}</div>
              <p className="text-xs text-white/60">+$23.50 this week</p>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Surveys Completed</CardTitle>
              <Brain className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{userStats.surveysCompleted}</div>
              <p className="text-xs text-white/60">+5 this week</p>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Current Level</CardTitle>
              <Award className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{userStats.currentLevel}</div>
              <p className="text-xs text-white/60">{userStats.nextLevelProgress}% to next level</p>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Available Surveys</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{userStats.availableSurveys}</div>
              <p className="text-xs text-white/60">New surveys daily</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Surveys */}
          <Card className="gaming-card border-white/10">
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
                  reward: "$12.50",
                  time: "8 min",
                  difficulty: "Easy",
                },
                {
                  title: "MMORPG Player Behavior",
                  reward: "$18.75",
                  time: "12 min",
                  difficulty: "Medium",
                },
                {
                  title: "Mobile Gaming Trends",
                  reward: "$9.25",
                  time: "6 min",
                  difficulty: "Easy",
                },
              ].map((survey, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{survey.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-white/60 mt-1">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {survey.time}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {survey.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{survey.reward}</div>
                    <Button size="sm" className="mt-2 neon-button">
                      <Play className="mr-1 h-3 w-3" />
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="gaming-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-white/70">Your latest earnings and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  action: "Completed Survey",
                  title: "Battle Royale Preferences",
                  reward: "+$15.50",
                  time: "2 hours ago",
                },
                {
                  action: "Level Up",
                  title: "Reached Level 3",
                  reward: "+Bonus Multiplier",
                  time: "1 day ago",
                },
                {
                  action: "Completed Survey",
                  title: "Gaming Hardware Usage",
                  reward: "+$11.25",
                  time: "2 days ago",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{activity.action}</h4>
                    <p className="text-white/60 text-sm">{activity.title}</p>
                    <p className="text-white/40 text-xs">{activity.time}</p>
                  </div>
                  <div className="text-green-400 font-bold">{activity.reward}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="gaming-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-white/70">Common tasks and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="neon-button h-20 flex-col">
                  <Brain className="h-6 w-6 mb-2" />
                  Take Survey
                </Button>
                <Button variant="outline" className="h-20 flex-col border-white/20 text-white bg-transparent">
                  <Users className="h-6 w-6 mb-2" />
                  Community
                </Button>
                <Button variant="outline" className="h-20 flex-col border-white/20 text-white bg-transparent">
                  <Star className="h-6 w-6 mb-2" />
                  Achievements
                </Button>
                <Button variant="outline" className="h-20 flex-col border-white/20 text-white bg-transparent">
                  <DollarSign className="h-6 w-6 mb-2" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
