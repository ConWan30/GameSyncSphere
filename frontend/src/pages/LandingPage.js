"use client"

// Convert the Next.js landing page to React component
import { useState, useEffect } from "react"

// Animated counter component
function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span className="holographic-text">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function LandingPage() {
  // Landing page component code here
  // (Adapted from the Next.js version)

  return <div className="min-h-screen bg-charcoal text-white">{/* Landing page content */}</div>
}
