"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2, ArrowLeft, Eye, EyeOff, User, Building, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("user")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // User registration form
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  })

  // Company registration form
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    email: "",
    contactPerson: "",
    password: "",
    confirmPassword: "",
    industry: "",
  })

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (userForm.password !== userForm.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (userForm.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "user",
          username: userForm.username,
          email: userForm.email,
          full_name: userForm.fullName,
          password: userForm.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to dashboard...")
        // Store user data and token
        localStorage.setItem("gamesyncsphere_token", data.token)
        localStorage.setItem("gamesyncsphere_user", JSON.stringify(data.user))

        setTimeout(() => {
          router.push("/user/dashboard")
        }, 2000)
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (companyForm.password !== companyForm.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (companyForm.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/companies/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyForm.companyName,
          email: companyForm.email,
          contact_person: companyForm.contactPerson,
          password: companyForm.password,
          industry: companyForm.industry,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Company registration successful! Please check your email for verification.")
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
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
          <h1 className="text-3xl font-bold text-white mb-2">Join the Revolution</h1>
          <p className="text-white/70">Create your account and start earning from gaming insights</p>
        </div>

        <Card className="gaming-card border-white/20 holographic-glow">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white">Create Account</CardTitle>
            <CardDescription className="text-white/70">Choose your account type to get started</CardDescription>
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

              {/* User Registration */}
              <TabsContent value="user">
                <div className="space-y-4 mb-6">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    🎮 For Gamers - Earn money from surveys
                  </Badge>
                </div>

                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={userForm.username}
                      onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={userForm.fullName}
                      onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={userForm.confirmPassword}
                        onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                        <User className="mr-2 h-4 w-4" />
                        Create Player Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Company Registration */}
              <TabsContent value="company">
                <div className="space-y-4 mb-6">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    🏢 For Companies - Access gaming insights
                  </Badge>
                </div>

                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Enter company name"
                      value={companyForm.companyName}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="text-white">
                      Contact Person
                    </Label>
                    <Input
                      id="contactPerson"
                      type="text"
                      placeholder="Enter contact person name"
                      value={companyForm.contactPerson}
                      onChange={(e) => setCompanyForm({ ...companyForm, contactPerson: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

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
                    <Label htmlFor="industry" className="text-white">
                      Industry
                    </Label>
                    <Input
                      id="industry"
                      type="text"
                      placeholder="e.g., Gaming, Technology, Marketing"
                      value={companyForm.industry}
                      onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
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
                        placeholder="Create a password"
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

                  <div className="space-y-2">
                    <Label htmlFor="companyConfirmPassword" className="text-white">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="companyConfirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={companyForm.confirmPassword}
                        onChange={(e) => setCompanyForm({ ...companyForm, confirmPassword: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                        <Building className="mr-2 h-4 w-4" />
                        Create Company Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
