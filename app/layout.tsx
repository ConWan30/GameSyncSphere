import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GameSyncSphere - Revolutionary AI Gaming Analytics",
  description:
    "The world's first player-compensated gaming analytics platform powered by Claude AI. Earn money from gaming surveys, connect with players, and access revolutionary insights.",
  keywords: "gaming, analytics, AI, Claude, surveys, earnings, esports, gaming platform",
  authors: [{ name: "GameSyncSphere Team" }],
  openGraph: {
    title: "GameSyncSphere - Revolutionary AI Gaming Analytics",
    description: "Earn money from Claude AI gaming surveys. Join 150K+ players earning real money.",
    type: "website",
    url: "https://gamesyncsphere-production.up.railway.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameSyncSphere - Revolutionary AI Gaming Analytics",
    description: "Earn money from Claude AI gaming surveys. Join 150K+ players earning real money.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
