import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const orbitronFont = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", weight: ["400", "700", "900"] })

export const metadata: Metadata = {
  title: "GameSyncSphere - Unify Your Gaming World",
  description:
    "The ultimate platform for gamers to connect, compete, and conquer. Sync your progress, find teammates, and get rewarded for your passion.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen font-sans antialiased", inter.variable, orbitronFont.variable)}>
        {children}
      </body>
    </html>
  )
}
