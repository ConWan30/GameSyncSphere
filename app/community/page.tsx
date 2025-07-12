"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Trophy, MessageCircle, Calendar, Gamepad2, ArrowLeft, Star, Zap, Target, Crown } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold holographic-text">GameSyncSphere Community</span>
            </div>
            <Link href="/auth/login" className="text-white/80 hover:text-white transition-colors">
              Join Community
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 holographic-text">Gaming Community Hubs</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Connect with fellow gamers, participate in tournaments, share strategies, and build lasting friendships in
            our vibrant community ecosystem.
          </p>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-4 py-2">
            🎮 Coming Soon - Join the Waitlist!
          </Badge>
        </div>

        {/* Community Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="gaming-card border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
              <CardTitle className="text-white">Tournament Hosting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70 mb-4">
                Create and participate in competitive tournaments across multiple games with real prizes and
                recognition.
              </CardDescription>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center">
                  <Crown className="mr-2 h-3 w-3 text-yellow-400" />
                  Prize pools up to $10,000
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-3 w-3 text-blue-400" />
                  Support for 100+ players
                </div>
                <div className="flex items-center">
                  <Zap className="mr-2 h-3 w-3 text-green-400" />
                  Real-time brackets
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-white">Strategy Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70 mb-4">
                Share your gaming strategies, learn from pros, and collaborate on tactics with the community.
              </CardDescription>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center">
                  <Star className="mr-2 h-3 w-3 text-yellow-400" />
                  Expert-verified guides
                </div>
                <div className="flex items-center">
                  <Target className="mr-2 h-3 w-3 text-red-400" />
                  Game-specific tactics
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-3 w-3 text-purple-400" />
                  Community discussions
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/10 hover:border-green-500/30 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle className="text-white">Community Events</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/70 mb-4">
                Join regular community events, game nights, and special celebrations with exclusive rewards.
              </CardDescription>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-3 w-3 text-green-400" />
                  Weekly events
                </div>
                <div className="flex items-center">
                  <Star className="mr-2 h-3 w-3 text-yellow-400" />
                  Exclusive rewards
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-3 w-3 text-blue-400" />
                  Global participation
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Games */}
        <Card className="gaming-card border-white/10 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Popular Games in Community</CardTitle>
            <CardDescription className="text-white/70">Join communities for your favorite games</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "Valorant", players: "15.2K", color: "bg-red-500/20 text-red-400" },
                { name: "Call of Duty", players: "23.1K", color: "bg-orange-500/20 text-orange-400" },
                { name: "Apex Legends", players: "18.7K", color: "bg-blue-500/20 text-blue-400" },
                { name: "Fortnite", players: "31.5K", color: "bg-purple-500/20 text-purple-400" },
                { name: "League of Legends", players: "27.3K", color: "bg-yellow-500/20 text-yellow-400" },
                { name: "Overwatch 2", players: "12.8K", color: "bg-cyan-500/20 text-cyan-400" },
              ].map((game, index) => (
                <Card
                  key={index}
                  className="gaming-card border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-lg ${game.color} flex items-center justify-center mx-auto mb-2`}>
                      <Gamepad2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-white font-semibold text-sm">{game.name}</h3>
                    <p className="text-white/60 text-xs">{game.players} players</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Join Community CTA */}
        <Card className="gaming-card border-purple-500/30 holographic-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-3xl mb-4">Ready to Join the Community?</CardTitle>
            <CardDescription className="text-white/80 text-lg">
              Connect with thousands of gamers, participate in tournaments, and earn rewards while having fun!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button size="lg" className="neon-button" asChild>
                <Link href="/auth/register">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/auth/login">Already a member? Sign In</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/60">
              <div className="flex items-center justify-center">
                <Trophy className="mr-2 h-4 w-4 text-yellow-400" />
                Competitive tournaments
              </div>
              <div className="flex items-center justify-center">
                <MessageCircle className="mr-2 h-4 w-4 text-blue-400" />
                Strategy discussions
              </div>
              <div className="flex items-center justify-center">
                <Star className="mr-2 h-4 w-4 text-purple-400" />
                Exclusive rewards
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
