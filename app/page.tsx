"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, OrbitControls, Box, Html } from "@react-three/drei"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function Rig() {
  return useFrame((state, delta) => {
    state.camera.position.x = (state.mouse.x * state.viewport.width) / 20
    state.camera.position.y = (state.mouse.y * state.viewport.height) / 20
    state.camera.lookAt(0, 0, 0)
  })
}

// IMPORTANT: 3D Text has been temporarily replaced with a placeholder
// because the required font files are missing from `/public/fonts/`.
function Hero3DPlaceholder() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Box args={[4, 1, 1]}>
        <meshStandardMaterial color="#50C878" wireframe />
      </Box>
    </Float>
  )
}

const FeatureCard = ({ icon: Icon, title, description }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  return (
    <motion.div ref={ref} style={{ scale, opacity }}>
      <Card className="h-full bg-deep-navy/50 holographic-border hover:scale-105 transition-transform duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gold">
            <Icon className="w-8 h-8 text-emerald-green" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-gray">{description}</p>
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
    <div className="text-center p-4 holographic-border bg-deep-navy/50 rounded-lg">
      <p className="text-4xl font-heading font-bold text-gold">{count.toLocaleString()}+</p>
      <p className="text-slate-gray mt-2">{label}</p>
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
        "Securely register and log in with SHA-256 hashed passwords and token-based sessions, safeguarded by our robust PostgreSQL database, ensuring ethical data handling absent in traditional analytics tools.",
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
        "Claude AI tailors surveys and matchmaking to your playstyle, delivering personalized gaming experiences and strategic insights, a novel extension of AI in gaming.",
    },
    {
      icon: BarChart,
      title: "Transparent Earnings Dashboard",
      description:
        "Track your earnings, survey completions, and experience bonuses in real-time, securely stored in our scalable PostgreSQL database for player empowerment.",
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
        "Track sessions with FPS, latency, and wellness metrics like break counts, promoting balanced gaming and addressing industry concerns for responsible play.",
    },
    {
      icon: Store,
      title: "B2B Survey Marketplace",
      description:
        "Companies create targeted survey requests with custom budgets and audience criteria, accessing real-time player insights in a bidirectional value exchange.",
    },
    {
      icon: LayoutDashboard,
      title: "Enterprise Dashboards",
      description:
        "B2B users access analytics, survey management, and insights reports, enabling data-driven decisions for developers and manufacturers.",
    },
  ]

  return (
    <div className="min-h-screen bg-deep-navy text-slate-gray">
      <header className="fixed top-0 left-0 right-0 z-50 bg-deep-navy/50 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="font-heading text-xl font-bold text-gold">GameSyncSphere</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#features" className="hover:text-emerald-green transition-colors">
              Features
            </a>
            <a href="#stats" className="hover:text-emerald-green transition-colors">
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
        <section className="relative h-screen w-full flex flex-col items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#50C878" />
                <Hero3DPlaceholder />
                <Rig />
              </Suspense>
            </Canvas>
          </div>
          <div className="relative z-10 text-center p-4">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-gold drop-shadow-[0_2px_10px_#FFD700]">
              GameSyncSphere
            </h1>
            <h2 className="font-heading text-xl md:text-2xl mt-4 text-slate-gray">
              Pioneer the Future of Gaming Analytics
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-slate-gray/80">
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
        <section id="features" className="py-24 bg-deep-navy/80">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-heading font-bold text-center mb-12">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-heading font-bold mb-4">Experience the Power of Claude AI and PostgreSQL</h2>
            <p className="max-w-3xl mx-auto text-slate-gray/80 mb-12">
              A streamlined overview of our platform’s core functionality, including B2B flows and research-supported
              innovation.
            </p>
            <div className="relative h-[400px] w-full">
              <Canvas>
                <ambientLight intensity={0.2} />
                <pointLight position={[0, 5, 5]} />
                <Suspense fallback={null}>
                  <group>
                    <SchemaNode position={[-3, 1, 0]} text="Players" />
                    <SchemaNode position={[3, 1, 0]} text="Companies" />
                    <SchemaNode position={[0, -2, 0]} text="PostgreSQL DB" />
                    <SchemaNode position={[0, 3, -1]} text="Claude AI" />
                  </group>
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
              </Canvas>
            </div>
            <Button size="lg" className="cta-primary mt-8">
              Join the Revolution
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-24 bg-deep-navy/80">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-heading font-bold text-center mb-12">GameSyncSphere in Action</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatedCounter value={150247} label="Active Players" />
              <AnimatedCounter value={532} label="Partner Companies" />
              <AnimatedCounter value={1250000} label="Surveys Completed" />
              <AnimatedCounter value={2500000} label="Total Player Earnings ($)" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-deep-navy/90 border-t border-emerald-green/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-heading text-lg mb-4 text-gold">GameSyncSphere</p>
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-slate-gray hover:text-emerald-green transition-colors">
              <Twitter />
            </a>
            <a href="#" className="text-slate-gray hover:text-emerald-green transition-colors">
              <Github />
            </a>
            <a href="#" className="text-slate-gray hover:text-emerald-green transition-colors">
              <Mail />
            </a>
          </div>
          <p className="text-sm text-slate-gray/60">
            Powered by Claude AI and PostgreSQL. &copy; 2025 GameSyncSphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function SchemaNode({ position, text }) {
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  useFrame(() => (ref.current.rotation.y += 0.01))
  return (
    <group position={position}>
      <mesh ref={ref} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={hovered ? "#50C878" : "#708090"} wireframe />
      </mesh>
      <Html position={[0, 0, 0.8]}>
        <div className="text-center bg-deep-navy/50 p-1 rounded text-xs w-24 text-gold">{text}</div>
      </Html>
    </group>
  )
}
