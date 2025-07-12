import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "GameSyncSphere - Pioneer the Future of Gaming Analytics",
  description:
    "The world's first AIaaS for gaming data analytics. Empower players with compensated insights, wellness monitoring, and community tools in a privacy-first ecosystem.",
  keywords: [
    "gaming earning platform",
    "Claude AI gaming surveys",
    "secure gaming analytics",
    "B2B gaming insights",
    "world's first AIaaS for gaming",
    "GameSyncSphere",
    "player compensation",
    "gaming data analytics",
    "AI gaming platform",
  ],
  authors: [{ name: "GameSyncSphere" }],
  creator: "GameSyncSphere",
  publisher: "GameSyncSphere",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamesyncsphere.vercel.app",
    title: "GameSyncSphere - Pioneer the Future of Gaming Analytics",
    description: "The world's first AIaaS for gaming data analytics with direct player compensation.",
    siteName: "GameSyncSphere",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameSyncSphere - Pioneer the Future of Gaming Analytics",
    description: "The world's first AIaaS for gaming data analytics with direct player compensation.",
    creator: "@gamesyncsphere",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1E3A8A",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
