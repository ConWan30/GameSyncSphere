"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Gamepad2, Users, MessageCircle, Trophy, Star, ArrowLeft, Send, Heart, Share, Calendar } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("")

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle post submission
    console.log("New post:", newPost)
    setNewPost("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particles-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold holographic-text">GameSyncSphere</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 holographic-text">Gaming Community</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Connect with fellow gamers, share strategies, and participate in tournaments
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card className="gaming-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Share with the Community</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind? Share your gaming thoughts..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">#gaming</Badge>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">#community</Badge>
                    </div>
                    <Button type="submit" className="neon-button">
                      <Send className="mr-2 h-4 w-4" />
                      Post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Community Posts */}
            <div className="space-y-6">
              {[
                {
                  user: "ProGamer2024",
                  avatar: "🎮",
                  time: "2 hours ago",
                  content:
                    "Just completed the new FPS survey! The AI questions were incredibly detailed about my playstyle. Earned $14.50 for 10 minutes of my time. This platform is amazing!",
                  likes: 24,
                  comments: 8,
                  tags: ["#survey", "#fps", "#earnings"],
                },
                {
                  user: "RPGMaster",
                  avatar: "⚔️",
                  time: "4 hours ago",
                  content:
                    "Looking for teammates for the upcoming RPG tournament! I specialize in tank roles and have been playing for 5+ years. Let's dominate together! 🏆",
                  likes: 18,
                  comments: 12,
                  tags: ["#tournament", "#rpg", "#teamup"],
                },
                {
                  user: "MobileGamer",
                  avatar: "📱",
                  time: "6 hours ago",
                  content:
                    "The mobile gaming survey was so insightful! They asked about my daily habits, favorite genres, and even battery usage patterns. Claude AI really knows how to ask the right questions.",
                  likes: 31,
                  comments: 15,
                  tags: ["#mobile", "#survey", "#ai"],
                },
              ].map((post, index) => (
                <Card key={index} className="gaming-card border-white/10 hover:border-white/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{post.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white font-medium">{post.user}</span>
                          <span className="text-white/50 text-sm">{post.time}</span>
                        </div>
                        <p className="text-white/80 mb-3">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="border-white/20 text-white/60 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-6 text-white/60">
                          <button className="flex items-center space-x-1 hover:text-red-400 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                            <Share className="h-4 w-4" />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="gaming-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-400" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/60">Active Members</span>
                  <span className="text-white font-medium">150,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Posts Today</span>
                  <span className="text-white font-medium">1,284</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Online Now</span>
                  <span className="text-green-400 font-medium">12,456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Tournaments Active</span>
                  <span className="text-purple-400 font-medium">8</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="gaming-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { tag: "#survey-tips", posts: "2.4k posts" },
                  { tag: "#fps-tournament", posts: "1.8k posts" },
                  { tag: "#mobile-gaming", posts: "1.2k posts" },
                  { tag: "#ai-surveys", posts: "956 posts" },
                  { tag: "#earnings-report", posts: "743 posts" },
                ].map((topic, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0"
                  >
                    <span className="text-blue-400 hover:text-blue-300 cursor-pointer">{topic.tag}</span>
                    <span className="text-white/50 text-sm">{topic.posts}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="gaming-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-orange-400" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "FPS Championship",
                    date: "Jan 15, 2025",
                    prize: "$5,000",
                    participants: "2,456",
                  },
                  {
                    title: "Mobile Gaming Summit",
                    date: "Jan 20, 2025",
                    prize: "$2,500",
                    participants: "1,234",
                  },
                  {
                    title: "RPG Strategy Workshop",
                    date: "Jan 25, 2025",
                    prize: "Free",
                    participants: "567",
                  },
                ].map((event, index) => (
                  <div key={index} className="border border-white/10 rounded-lg p-3">
                    <h3 className="text-white font-medium mb-1">{event.title}</h3>
                    <div className="text-white/60 text-sm space-y-1">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {event.date}
                      </div>
                      <div className="flex justify-between">
                        <span>Prize: {event.prize}</span>
                        <span>{event.participants} joined</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card className="gaming-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "GameMaster", avatar: "👑", points: "15,420" },
                  { name: "SurveyKing", avatar: "🎯", points: "12,890" },
                  { name: "ProAnalyst", avatar: "📊", points: "11,567" },
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{contributor.avatar}</span>
                      <span className="text-white">{contributor.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-white/60 text-sm">{contributor.points}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
