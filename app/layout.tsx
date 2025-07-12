import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
})

export const metadata: Metadata = {
  title: "GameSyncSphere - Pioneer the Future of Gaming Analytics",
  description:
    "The world's first AIaaS for gaming data analytics. Empower players with compensated insights, wellness monitoring, and community tools powered by Claude AI and PostgreSQL in a privacy-first ecosystem.",
  keywords: [
    "gaming earning platform",
    "Claude AI gaming surveys",
    "secure gaming analytics",
    "B2B gaming insights",
    "world's first AIaaS for gaming",
    "GameSyncSphere",
    "player compensation",
    "gaming data analytics",
    "PostgreSQL gaming platform",
    "AI-powered gaming surveys",
    "holographic gaming interface",
    "futuristic gaming platform",
    "gaming wellness tracking",
    "enterprise gaming dashboards",
    "B2B survey marketplace",
  ],
  authors: [{ name: "GameSyncSphere Team" }],
  creator: "GameSyncSphere",
  publisher: "GameSyncSphere",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamesyncsphere.vercel.app",
    title: "GameSyncSphere - Pioneer the Future of Gaming Analytics",
    description:
      "The world's first AIaaS for gaming data analytics with direct player compensation and holographic interfaces.",
    siteName: "GameSyncSphere",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GameSyncSphere - Revolutionary Gaming Analytics Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GameSyncSphere - Pioneer the Future of Gaming Analytics",
    description:
      "The world's first AIaaS for gaming data analytics with direct player compensation and holographic interfaces.",
    images: ["/og-image.jpg"],
    creator: "@gamesyncsphere",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="msapplication-TileColor" content="#0A0A0A" />
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
