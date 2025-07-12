import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "GameSyncSphere: Pioneer the Future of Gaming Analytics",
  description:
    "The world's first AIaaS for gaming data analytics. Empowering players with compensated insights, wellness monitoring, and a B2B marketplace for developers.",
  keywords: [
    "gaming earning platform",
    "Claude AI gaming surveys",
    "secure gaming analytics",
    "B2B gaming insights",
    "world's first AIaaS for gaming",
    "GameSyncSphere",
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn("bg-charcoal-black font-sans antialiased", orbitron.variable, inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
