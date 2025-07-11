import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GameSyncSphere - World's First AIaaS for Gaming Data Analytics",
  description:
    "Pioneer the future of gaming analytics with AI-powered surveys, player compensation, and B2B marketplace. Powered by Claude AI and PostgreSQL.",
  keywords: "gaming analytics, AI surveys, player compensation, gaming data, Claude AI, PostgreSQL, B2B marketplace",
  authors: [{ name: "GameSyncSphere Team" }],
  openGraph: {
    title: "GameSyncSphere - Revolutionary Gaming Analytics Platform",
    description:
      "The world's first AIaaS for gaming data analytics with direct player compensation and AI-powered insights.",
    type: "website",
    url: "https://gamesyncsphere-analytics.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameSyncSphere - Gaming Analytics Revolution",
    description: "Earn money from AI-powered gaming surveys. Join the revolution in gaming data analytics.",
  },
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
