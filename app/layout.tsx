import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Rajdhani } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-rajdhani",
})

export const metadata: Metadata = {
  title: "GameSyncSphere: Pioneer the Future of Gaming Analytics",
  description:
    "The world's first AIaaS for gaming data analytics, empowering players with compensated insights, wellness monitoring, and community tools.",
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen font-sans antialiased", montserrat.variable, rajdhani.variable)}>
        {children}
      </body>
    </html>
  )
}
