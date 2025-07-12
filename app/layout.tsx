import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "GameSyncSphere - Revolutionary AI Gaming Analytics Platform",
  description:
    "The world's first AIaaS for gaming data analytics. Empower players with compensated insights, wellness monitoring, and community tools while enabling B2B marketplaces in a privacy-first ecosystem.",
  keywords:
    "gaming analytics, AI surveys, Claude AI, gaming data, player insights, B2B gaming, gaming wellness, esports analytics",
  authors: [{ name: "GameSyncSphere Team" }],
  creator: "GameSyncSphere",
  publisher: "GameSyncSphere",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gamesyncsphere-analytics.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GameSyncSphere - Revolutionary AI Gaming Analytics Platform",
    description:
      "The world's first AIaaS for gaming data analytics. Empower players with compensated insights and B2B marketplaces.",
    url: "https://gamesyncsphere-analytics.vercel.app",
    siteName: "GameSyncSphere",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200",
        width: 1200,
        height: 630,
        alt: "GameSyncSphere - AI Gaming Analytics Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameSyncSphere - Revolutionary AI Gaming Analytics Platform",
    description: "The world's first AIaaS for gaming data analytics. Empower players with compensated insights.",
    images: ["/placeholder.svg?height=630&width=1200"],
    creator: "@gamesyncsphere",
  },
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
  verification: {
    google: "your-google-verification-code",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
