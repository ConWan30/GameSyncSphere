"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2, ArrowLeft, Eye, EyeOff, User, Building, CheckCircle, AlertCircle, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("user")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // User login form
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
  })

  // Company login form
  const [companyForm, setCompanyForm] = useState({
    email: "",
    password: "",
  })

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "user",
          email: userForm.email,
          password: userForm.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Login successful! Redirecting...")
        // Store user data and token
        localStorage.setItem("gamesyncsphere_token", data.token)
        localStorage.setItem("gamesyncsphere_user", JSON.stringify(data.user))

        setTimeout(() => {
          router.push("/user/dashboard")
        }, 1500)
      } else {
        setError(data.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "company",
          email: companyForm.email,
          password: companyForm.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Login successful! Redirecting...")
        // Store company data and token
        localStorage.setItem("gamesyncsphere_token", data.token)
        localStorage.setItem("gamesyncsphere_company", JSON.stringify(data.company))

        setTimeout(() => {
          router.push("/company/dashboard")
        }, 1500)
      } else {
        setError(data.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
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

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gamepad2 className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold holographic-text">GameSyncSphere</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/70">Sign in to your account to continue earning</p>
        </div>

        <Card className="gaming-card border-white/20 holographic-glow">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-white/70">
              Access your account to start earning or managing surveys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Player
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  Company
                </TabsTrigger>
              </TabsList>

              {/* User Login */}
              <TabsContent value="user">
                <div className="space-y-4 mb-6">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    🎮 Player Login - Access your earnings dashboard
                  </Badge>
                </div>

                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userPassword" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="userPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center text-red-400 text-sm">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center text-green-400 text-sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {success}
                    </div>
                  )}

                  <Button type="submit" disabled={isLoading} className="w-full neon-button">
                    {isLoading ? (
                      <div className="loading-spinner w-4 h-4" />
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In as Player
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Company Login */}
              <TabsContent value="company">
                <div className="space-y-4 mb-6">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    🏢 Company Login - Manage your surveys and analytics
                  </Badge>
                </div>

                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail" className="text-white">
                      Company Email
                    </Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      placeholder="Enter company email"
                      value={companyForm.email}
                      onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyPassword" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="companyPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={companyForm.password}
                        onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center text-red-400 text-sm">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center text-green-400 text-sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {success}
                    </div>
                  )}

                  <Button type="submit" disabled={isLoading} className="w-full neon-button">
                    {isLoading ? (
                      <div className="loading-spinner w-4 h-4" />
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In as Company
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Create one here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
