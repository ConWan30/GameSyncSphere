"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Database,
  Users,
  Building,
  Mail,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Gamepad2,
} from "lucide-react"
import Link from "next/link"

interface SystemStatus {
  status: string
  message: string
  timestamp: string
  version: string
  uptime: number
  database: string
  users: number
  companies: number
  sessions: number
  newsletters: number
}

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await fetch("/health")
        if (response.ok) {
          const data = await response.json()
          setSystemStatus(data)
        }
      } catch (error) {
        console.error("Failed to fetch system status:", error)
      } finally {
        setIsLoading(false)
        setLastUpdated(new Date())
      }
    }

    fetchSystemStatus()
    const interval = setInterval(fetchSystemStatus, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "connected":
      case "enabled":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "fallback":
      case "disabled":
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Gamepad2 className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold holographic-text">GameSyncSphere Dashboard</span>
              </div>
            </div>
            <Badge variant="outline" className="border-green-500/30 text-green-400">
              {systemStatus?.status || "Unknown"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* System Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">System Dashboard</h1>
          <p className="text-white/70">Real-time monitoring of GameSyncSphere platform status and analytics</p>
          <p className="text-sm text-white/50 mt-2">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>

        {systemStatus && (
          <>
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="gaming-card border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">System Status</CardTitle>
                  <Activity className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(systemStatus.status)}
                    <div className="text-2xl font-bold text-white">{systemStatus.status}</div>
                  </div>
                  <p className="text-xs text-white/60 mt-1">Uptime: {formatUptime(systemStatus.uptime)}</p>
                </CardContent>
              </Card>

              <Card className="gaming-card border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">Database</CardTitle>
                  <Database className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(systemStatus.database)}
                    <div className="text-2xl font-bold text-white">
                      {systemStatus.database === "Connected" ? "Online" : "Fallback"}
                    </div>
                  </div>
                  <p className="text-xs text-white/60 mt-1">{systemStatus.database}</p>
                </CardContent>
              </Card>

              <Card className="gaming-card border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{systemStatus.users}</div>
                  <p className="text-xs text-white/60 mt-1">{systemStatus.sessions} active sessions</p>
                </CardContent>
              </Card>

              <Card className="gaming-card border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">Companies</CardTitle>
                  <Building className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{systemStatus.companies}</div>
                  <p className="text-xs text-white/60 mt-1">Registered partners</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="gaming-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Version</span>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                      {systemStatus.version}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Environment</span>
                    <span className="text-white">Production</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Last Restart</span>
                    <span className="text-white">{formatUptime(systemStatus.uptime)} ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Newsletter Subscribers</span>
                    <span className="text-white">{systemStatus.newsletters}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="gaming-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                    Features Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">User Authentication</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Company Registration</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Newsletter System</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Claude AI Surveys</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400">Ready</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Endpoints */}
            <Card className="gaming-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-purple-400" />
                  Available API Endpoints
                </CardTitle>
                <CardDescription className="text-white/70">Core API endpoints for platform integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { method: "GET", endpoint: "/health", description: "System health check" },
                    { method: "GET", endpoint: "/api/platform/stats", description: "Platform statistics" },
                    { method: "POST", endpoint: "/api/newsletter/subscribe", description: "Newsletter subscription" },
                    { method: "POST", endpoint: "/api/contact", description: "Contact form submission" },
                    { method: "POST", endpoint: "/api/auth/register", description: "User registration" },
                    { method: "POST", endpoint: "/api/auth/login", description: "User authentication" },
                    { method: "POST", endpoint: "/api/companies/register", description: "Company registration" },
                    { method: "POST", endpoint: "/api/survey/generate", description: "Generate AI survey" },
                  ].map((endpoint, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              endpoint.method === "GET"
                                ? "border-green-500/30 text-green-400"
                                : "border-blue-500/30 text-blue-400"
                            }`}
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm text-white font-mono">{endpoint.endpoint}</code>
                        </div>
                        <p className="text-xs text-white/60 mt-1">{endpoint.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="neon-button">
                <Link href="/api/platform/stats">View API Stats</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <Link href="/health">Health Check</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <Link href="/">Back to Landing</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
