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
  Twitter,
  Github,
  Mail,
  Trophy,
  Database,
  Cpu,
  Share2,
  BoxIcon,
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
//
// TO FIX:
// 1. Generate `.json` font files from a `.ttf` or `.otf` file.
//    (Search for 'convert ttf to typeface.json').
// 2. Place the generated files (e.g., `Geist_Bold.json`) in the `/public/fonts/` directory.
// 3. Replace the `<Hero3DPlaceholder />` component below with the original `<Hero3DText />` component.
function Hero3DPlaceholder() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Box args={[4, 1, 1]}>
        <meshStandardMaterial color="#1e3a8a" wireframe />
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
      icon: Trophy,
      title: "Data Bounty Challenges",
      description:
        "A legal, skill-based alternative to wagering. Developers post bounties for specific data, and our DePIN-AI fusion ensures fair, verifiable, and transparent monetization of your insights.",
    },
    {
      icon: BrainCircuit,
      title: "Earn with Claude AI Surveys",
      description:
        "Answer personalized surveys crafted by Claude AI, tailored to your gaming habits, and earn up to $15.50+ per survey with experience-based bonuses.",
    },
    {
      icon: ShieldCheck,
      title: "Fortified Authentication & IoID",
      description:
        "Securely register with SHA-256 hashing and verify your identity for bounty participation with IoTeX's decentralized ID, ensuring a trustworthy data economy.",
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
        "Quicksilver AI agents, powered by Realms knowledge bases, tailor surveys and match you to bounties based on your unique playstyle and hardware.",
    },
    {
      icon: BarChart,
      title: "Transparent Earnings Dashboard",
      description:
        "Track your earnings from surveys and bounties in real-time. All payouts for bounties are managed transparently on the blockchain.",
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
        "Track sessions with FPS, latency, and wellness metrics like break counts, promoting balanced gaming in a first-of-its-kind integration.",
    },
    {
      icon: Store,
      title: "B2B Survey & Bounty Marketplace",
      description:
        "Companies create targeted survey requests or data bounties with custom budgets, accessing real-time player insights in a bidirectional marketplace.",
    },
  ]

  const techStack = [
    { name: "Claude AI", icon: Cpu },
    { name: "IoTeX", icon: Share2 },
    { name: "PostgreSQL", icon: Database },
    { name: "Next.js", icon: BoxIcon },
    { name: "Vercel", icon: BoxIcon },
    { name: "Railway", icon: BoxIcon },
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
            <a href="#tech" className="hover:text-glowing-blue transition-colors">
              Technology
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
        <section className="relative h-screen w-full flex flex-col items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Hero3DPlaceholder />
                <Rig />
              </Suspense>
            </Canvas>
          </div>
          <div className="relative z-10 text-center p-4">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-white">GameSyncSphere</h1>
            <h2 className="font-orbitron text-xl md:text-2xl mt-4 text-metallic-silver/80">
              Pioneer the Future of Gaming Analytics
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-metallic-silver/70">
              The world's first AIaaS platform fusing DePIN with player-compensated insights. Earn from AI-powered
              surveys and skill-based Data Bounty Challenges in a transparent, ethical data economy.
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
            <h2 className="text-4xl font-orbitron font-bold text-center mb-12">A New Era of Gaming</h2>
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
            <h2 className="text-4xl font-orbitron font-bold mb-4">The DePIN-AI Fusion</h2>
            <p className="max-w-3xl mx-auto text-metallic-silver/80 mb-12">
              Our ecosystem connects players, developers, and AI through a seamless, blockchain-verified flow, turning
              your gaming hardware into a compensated node in the new data economy.
            </p>
            <div className="relative h-[400px] w-full">
              <Canvas>
                <ambientLight intensity={0.2} />
                <pointLight position={[0, 5, 5]} />
                <Suspense fallback={null}>
                  <group>
                    <SchemaNode position={[-3.5, 1, 0]} text="Players" />
                    <SchemaNode position={[3.5, 1, 0]} text="Companies" />
                    <SchemaNode position={[0, -2.5, 0]} text="PostgreSQL DB" />
                    <SchemaNode position={[-2, 3, -1]} text="Claude AI" />
                    <SchemaNode position={[2, 3, -1]} text="IoTeX" />
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

        {/* Tech Stack Section */}
        <section id="tech" className="py-24 bg-gunmetal-gray/20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-orbitron font-bold text-center mb-12">Powered by Cutting-Edge Technology</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {techStack.map(({ name, icon: Icon }) => (
                <div key={name} className="flex flex-col items-center gap-2 text-metallic-silver/80">
                  <Icon className="w-12 h-12" />
                  <span>{name}</span>
                </div>
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
            Powered by Claude AI, IoTeX, and PostgreSQL. &copy; 2025 GameSyncSphere. All rights reserved.
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
        <meshStandardMaterial color={hovered ? "#1E3A8A" : "#2A2A2A"} wireframe />
      </mesh>
      <Html position={[0, 0, 0.8]}>
        <div className="text-center bg-charcoal-black/50 p-1 rounded text-xs w-24">{text}</div>
      </Html>
    </group>
  )
}
