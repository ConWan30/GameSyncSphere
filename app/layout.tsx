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
    "gaming analytics, AI surveys, Claude AI, gaming data, B2B marketplace, player insights, gaming wellness, esports analytics",
  authors: [{ name: "GameSyncSphere Team" }],
  creator: "GameSyncSphere",
  publisher: "GameSyncSphere",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamesyncsphere.com",
    title: "GameSyncSphere - Revolutionary AI Gaming Analytics Platform",
    description:
      "The world's first AIaaS for gaming data analytics. Empower players with compensated insights and B2B marketplaces.",
    siteName: "GameSyncSphere",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameSyncSphere - Revolutionary AI Gaming Analytics Platform",
    description:
      "The world's first AIaaS for gaming data analytics. Empower players with compensated insights and B2B marketplaces.",
    creator: "@gamesyncsphere",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0ea5e9",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
