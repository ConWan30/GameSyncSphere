"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gamepad2, LogIn, ArrowLeft, AlertCircle, Eye, EyeOff, Building } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginType, setLoginType] = useState<"user" | "company">("user")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const endpoint = loginType === "user" ? "/api/auth/login" : "/api/companies/login"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user/company data
        localStorage.setItem("gamesyncsphere_token", data.token)

        if (loginType === "user") {
          localStorage.setItem("gamesyncsphere_user", JSON.stringify(data.user))
          router.push("/user/dashboard")
        } else {
          localStorage.setItem("gamesyncsphere_company", JSON.stringify(data.company))
          router.push("/company/dashboard")
        }
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
            <Link href="/auth/register" className="text-white/80 hover:text-white transition-colors">
              Need an account?
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="gaming-card border-white/20 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {loginType === "user" ? (
                <LogIn className="h-8 w-8 text-blue-400" />
              ) : (
                <Building className="h-8 w-8 text-purple-400" />
              )}
            </div>
            <CardTitle className="text-white text-2xl">
              {loginType === "user" ? "Welcome Back, Gamer!" : "Company Login"}
            </CardTitle>
            <CardDescription className="text-white/70">
              {loginType === "user"
                ? "Sign in to continue earning from your gaming insights"
                : "Access your company dashboard and analytics"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Login Type Toggle */}
            <div className="flex space-x-2 mb-6">
              <Button
                type="button"
                variant={loginType === "user" ? "default" : "outline"}
                onClick={() => setLoginType("user")}
                className={`flex-1 ${
                  loginType === "user" ? "neon-button" : "border-white/30 text-white hover:bg-white/10 bg-transparent"
                }`}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Player
              </Button>
              <Button
                type="button"
                variant={loginType === "company" ? "default" : "outline"}
                onClick={() => setLoginType("company")}
                className={`flex-1 ${
                  loginType === "company"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-white/30 text-white hover:bg-white/10 bg-transparent"
                }`}
              >
                <Building className="mr-2 h-4 w-4" />
                Company
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full neon-button">
                {isLoading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <Link
                  href={loginType === "user" ? "/auth/register" : "/auth/company-register"}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {loginType === "user" ? "Create one here" : "Register your company"}
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4 text-xs text-white/50">
                <div>🔒 Secure Login</div>
                <div>⚡ Instant Access</div>
                <div>📊 Real-time Data</div>
                <div>💰 Track Earnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
