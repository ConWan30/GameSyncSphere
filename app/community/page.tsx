"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Users, MessageCircle, Trophy, ArrowLeft, Star, Clock } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-white/80 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <div className="flex items-center space-x-2">
                <Gamepad2 className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold holographic-text">Community Hub</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gaming Community</h1>
          <p className="text-white/80">Connect with fellow gamers and share insights</p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="gaming-card border-white/10 text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">150K+</div>
              <p className="text-white/60">Active Members</p>
            </CardContent>
          </Card>
          <Card className="gaming-card border-white/10 text-center">
            <CardContent className="pt-6">
              <MessageCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2.3M+</div>
              <p className="text-white/60">Messages Shared</p>
            </CardContent>
          </Card>
          <Card className="gaming-card border-white/10 text-center">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">500+</div>
              <p className="text-white/60">Tournaments</p>
            </CardContent>
          </Card>
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="gaming-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Popular Discussions</CardTitle>
              <CardDescription className="text-white/70">Join the conversation with fellow gamers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Best FPS Settings for Competitive Play",
                  author: "ProGamer2024",
                  replies: 127,
                  time: "2 hours ago",
                },
                {
                  title: "MMORPG Guild Recruitment Thread",
                  author: "GuildMaster",
                  replies: 89,
                  time: "4 hours ago",
                },
                {
                  title: "Mobile Gaming: The Future of Esports?",
                  author: "TechAnalyst",
                  replies: 203,
                  time: "6 hours ago",
                },
              ].map((discussion, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{discussion.title}</h4>
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>by {discussion.author}</span>
                    <div className="flex items-center space-x-4">
                      <span>{discussion.replies} replies</span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {discussion.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="gaming-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Top Contributors</CardTitle>
              <CardDescription className="text-white/70">Community members making a difference</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: "EliteGamer",
                  level: "Expert",
                  contributions: 1250,
                  badge: "🏆",
                },
                {
                  name: "StrategyMaster",
                  level: "Pro",
                  contributions: 987,
                  badge: "⭐",
                },
                {
                  name: "CasualPlayer",
                  level: "Advanced",
                  contributions: 756,
                  badge: "🎮",
                },
              ].map((contributor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{contributor.badge}</div>
                    <div>
                      <h4 className="text-white font-medium">{contributor.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {contributor.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{contributor.contributions}</div>
                    <p className="text-white/60 text-xs">contributions</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Join Community CTA */}
        <div className="mt-8 text-center">
          <Card className="gaming-card border-white/20 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Join Our Community</h3>
              <p className="text-white/80 mb-6">
                Connect with gamers worldwide, share strategies, and participate in exclusive events
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="neon-button">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Join Discord
                </Button>
                <Button variant="outline" className="border-white/20 text-white bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  Browse Forums
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
