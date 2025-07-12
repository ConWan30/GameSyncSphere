"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  BrainCircuit,
  ShieldCheck,
  Headset,
  Sparkles,
  BarChart,
  Users,
  HeartPulse,
  Store,
  LayoutDashboard,
  Twitter,
  Github,
  Mail,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  return (
    <motion.div ref={ref} style={{ scale, opacity }}>
      <Card className="h-full bg-gunmetal-gray/50 holographic-border holographic-border-pulse hover:scale-105 transition-transform duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-metallic-silver">
            <Icon className="w-8 h-8 text-glowing-blue" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-metallic-silver/80">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const AnimatedCounter = ({ value, label }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const start = 0
    const end = value
    if (start === end) return

    let startTime = null

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [value])

  return (
    <div className="text-center p-4 holographic-border bg-gunmetal-gray/50 rounded-lg">
      <p className="text-4xl font-orbitron font-bold text-glowing-blue">{count.toLocaleString()}+</p>
      <p className="text-metallic-silver/80 mt-2">{label}</p>
    </div>
  )
}

export default function LandingPage() {
  const features = [
    {
      icon: BrainCircuit,
      title: "Earn with Claude AI Surveys",
      description:
        "Answer personalized surveys crafted by Claude AI, tailored to your gaming habits, and earn up to $15.50+ per survey with experience-based bonuses, uniquely compensating players for insights that shape industry trends.",
    },
    {
      icon: ShieldCheck,
      title: "Fortified Authentication",
      description:
        "Securely register and log in with SHA-256 hashed passwords and token-based sessions, safeguarded by our robust PostgreSQL database, ensuring ethical data handling.",
    },
    {
      icon: Headset,
      title: "Dynamic Party Communication",
      description:
        "Form real-time gaming parties with secure, low-latency voice, video, and text communication, seamlessly connecting PC, console, and mobile players.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Personalization",
      description:
        "Claude AI tailors surveys and matchmaking to your playstyle, delivering personalized gaming experiences and strategic insights.",
    },
    {
      icon: BarChart,
      title: "Transparent Earnings Dashboard",
      description:
        "Track your earnings, survey completions, and experience bonuses in real-time, securely stored in our scalable PostgreSQL database.",
    },
    {
      icon: Users,
      title: "Vibrant Community Hubs",
      description:
        "Create or join customizable hubs for tournaments, strategy sharing, and social engagement, fostering a player-driven gaming ecosystem.",
    },
    {
      icon: HeartPulse,
      title: "Wellness-Integrated Sessions",
      description:
        "Track sessions with FPS, latency, and wellness metrics like break counts, promoting balanced gaming and responsible play in a first-of-its-kind integration.",
    },
    {
      icon: Store,
      title: "B2B Survey Marketplace",
      description:
        "Companies create targeted survey requests with custom budgets and audience criteria, accessing real-time player insights.",
    },
    {
      icon: LayoutDashboard,
      title: "Enterprise Dashboards",
      description:
        "B2B users access analytics, survey management, and insights reports, enabling data-driven decisions for developers and manufacturers.",
    },
  ]

  return (
    <div className="min-h-screen bg-charcoal-black text-metallic-silver">
      <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal-black/50 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="font-orbitron text-xl font-bold">GameSyncSphere</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#features" className="hover:text-glowing-blue transition-colors">
              Features
            </a>
            <a href="#stats" className="hover:text-glowing-blue transition-colors">
              Stats
            </a>
            <Button className="cta-secondary" size="sm">
              Explore
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center text-center p-4">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
          <div className="relative z-10">
            <h1
              className="font-orbitron text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter animate-float"
              style={{ textShadow: "0 0 15px var(--glowing-blue), 0 0 30px var(--glowing-blue)" }}
            >
              GameSyncSphere
            </h1>
            <h2 className="font-orbitron text-xl md:text-2xl mt-4 text-metallic-silver/80">
              Pioneer the Future of Gaming Analytics
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-metallic-silver/70">
              As the world's first AIaaS for gaming data analytics, empower players with compensated insights, wellness
              monitoring, and community tools, while enabling B2B marketplaces for developers and manufacturers in a
              privacy-first ecosystem.
            </p>
            <div className="mt-8 flex gap-4 justify-center">
              <Button size="lg" className="cta-primary">
                Start Earning Today
              </Button>
              <Button size="lg" variant="outline" className="cta-secondary bg-transparent">
                Explore the Innovation
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gunmetal-gray/20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-orbitron font-bold text-center mb-12">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-orbitron font-bold text-center mb-12">GameSyncSphere in Action</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatedCounter value={150247} label="Active Players" />
              <AnimatedCounter value={532} label="Partner Companies" />
              <AnimatedCounter value={1250000} label="Surveys Completed" />
              <AnimatedCounter value={2500000} label="Total Player Earnings ($)" />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gunmetal-gray/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-orbitron font-bold mb-4">Experience the Power of Claude AI and PostgreSQL</h2>
            <p className="max-w-3xl mx-auto text-metallic-silver/80 mb-12">
              A streamlined overview of our platform’s core functionality, including B2B flows and research-supported
              innovation.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="p-4 text-center holographic-border bg-gunmetal-gray/50 rounded-lg">
                <Users className="mx-auto w-10 h-10 mb-2 text-glowing-blue" />
                <h3 className="font-orbitron">Players</h3>
              </div>
              <div className="p-4 text-center holographic-border bg-gunmetal-gray/50 rounded-lg">
                <Store className="mx-auto w-10 h-10 mb-2 text-glowing-blue" />
                <h3 className="font-orbitron">Companies</h3>
              </div>
              <div className="p-4 text-center holographic-border bg-gunmetal-gray/50 rounded-lg">
                <BrainCircuit className="mx-auto w-10 h-10 mb-2 text-glowing-blue" />
                <h3 className="font-orbitron">Claude AI</h3>
              </div>
              <div className="p-4 text-center holographic-border bg-gunmetal-gray/50 rounded-lg">
                <Database className="mx-auto w-10 h-10 mb-2 text-glowing-blue" />
                <h3 className="font-orbitron">PostgreSQL</h3>
              </div>
            </div>
            <Button size="lg" className="cta-primary mt-8">
              Join the Revolution
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gunmetal-gray/30 border-t border-glowing-blue/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-orbitron text-lg mb-4">GameSyncSphere</p>
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-metallic-silver/80 hover:text-glowing-blue transition-colors">
              <Twitter />
            </a>
            <a href="#" className="text-metallic-silver/80 hover:text-glowing-blue transition-colors">
              <Github />
            </a>
            <a href="#" className="text-metallic-silver/80 hover:text-glowing-blue transition-colors">
              <Mail />
            </a>
          </div>
          <p className="text-sm text-metallic-silver/60">
            Powered by Claude AI and PostgreSQL. &copy; 2025 GameSyncSphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
