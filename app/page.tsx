"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Code, Gamepad2, Users, BarChart, Twitter, Github, Bot } from "lucide-react"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://gamesyncsphere-production.up.railway.app"}/api/newsletter`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      )

      if (response.ok) {
        setMessage("Success! You've been added to the waitlist.")
        setEmail("")
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "An error occurred. Please try again.")
      }
    } catch (error) {
      console.error("Waitlist submission error:", error)
      setMessage("Could not connect to the server. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const featureCards = [
    {
      icon: Users,
      title: "AI-Powered Matchmaking",
      description: "Our Claude-powered AI finds you the perfect teammates based on skill, playstyle, and personality.",
      color: "text-accent-blue",
    },
    {
      icon: BarChart,
      title: "Unified Game Stats",
      description: "Sync all your gaming accounts and see your progress across all titles in one unified dashboard.",
      color: "text-neon-green",
    },
    {
      icon: Bot,
      title: "Personalized Surveys",
      description: "Engage with our AI to provide feedback on games and get rewarded for your insights.",
      color: "text-electric-purple",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary-dark text-metallic-silver overflow-x-hidden">
      <div className="holographic-bg">
        <div className="holo-grid"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-accent-blue/20 bg-primary-dark/50 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-accent-blue" />
            <h1 className="text-2xl font-bold font-orbitron gradient-text">GameSyncSphere</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
            <a href="#community" className="nav-link">
              Community
            </a>
          </nav>
          <Button className="holo-button-primary px-6">Join Waitlist</Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-24 md:py-32 text-center">
          <Badge className="holo-badge mb-4">The Future of Gaming is Here</Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-orbitron holographic-text mb-6">
            Unify Your Gaming World
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-metallic-silver/80 mb-8">
            The ultimate platform for gamers to connect, compete, and conquer. Sync your progress, find teammates, and
            get rewarded for your passion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="holo-button-primary px-8 py-6 text-lg">
              Get Early Access
            </Button>
            <Button size="lg" variant="outline" className="holo-button-secondary px-8 py-6 text-lg bg-transparent">
              Explore Features
            </Button>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-center mb-12 gradient-text">
              Platform Features
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
            >
              {featureCards.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="holo-card h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <feature.icon className={feature.color} />
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{feature.description}</CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 md:py-28 bg-gunmetal-gray/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron text-center mb-12 gradient-text">
              How It Works
            </h2>
            <div className="holo-interface">
              <div className="floating-schema">
                <div className="schema-node user-node">
                  <Users size={24} />
                  <span>User Profile</span>
                  <div className="schema-tooltip">Your gaming identity</div>
                </div>
                <div className="schema-node survey-node">
                  <Bot size={24} />
                  <span>AI Surveys</span>
                  <div className="schema-tooltip">Provide feedback</div>
                </div>
                <div className="schema-node company-node">
                  <Gamepad2 size={24} />
                  <span>Game Data</span>
                  <div className="schema-tooltip">Sync your stats</div>
                </div>
                <div className="schema-node earnings-node">
                  <Code size={24} />
                  <span>API</span>
                  <div className="schema-tooltip">Connects everything</div>
                </div>
                <div className="connection-line line-1"></div>
                <div className="connection-line line-2"></div>
                <div className="connection-line line-3"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="community" className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4 gradient-text">Join the Revolution</h2>
            <p className="max-w-2xl mx-auto text-lg text-metallic-silver/80 mb-8">
              Be the first to experience the next generation of gaming. Sign up for our waitlist and get exclusive
              updates.
            </p>
            <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto flex flex-col gap-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="holo-input flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="holo-button-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>
              {message && <p className="text-sm text-neon-green">{message}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-gunmetal-gray/30 border-t border-accent-blue/20">
        <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-metallic-silver/70">&copy; 2025 GameSyncSphere. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="holo-social">
              <Twitter size={20} />
            </a>
            <a href="#" className="holo-social">
              <Github size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
