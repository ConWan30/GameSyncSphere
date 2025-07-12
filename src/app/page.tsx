import { Button } from "@/components/ui/button"
import { DiscIcon as Discord, GamepadIcon, Twitch, Twitter, Youtube } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="holographic-bg">
        <div className="holo-grid" />
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 backdrop-blur-md bg-background/30">
        <a className="flex items-center justify-center" href="#">
          <GamepadIcon className="h-6 w-6 text-accent-blue" />
          <span className="sr-only">GameSyncSphere</span>
        </a>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <a className="text-sm font-medium nav-link" href="#features">
            Features
          </a>
          <a className="text-sm font-medium nav-link" href="#community">
            Community
          </a>
          <a className="text-sm font-medium nav-link" href="#rewards">
            Rewards
          </a>
          <Button className="holo-button-secondary">Login</Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center">
          <div className="container px-4 md:px-6">
            <h1 className="font-orbitron text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl holographic-text">
              GameSyncSphere
            </h1>
            <p className="mx-auto max-w-[700px] text-metallic-silver md:text-xl mt-4">
              The ultimate platform for gamers to connect, compete, and conquer. Sync your progress, find teammates, and
              get rewarded for your passion.
            </p>
            <div className="mt-6">
              <Button size="lg" className="holo-button-primary px-8 py-6 text-lg">
                Join the Beta
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-accent-blue/10">
        <p className="text-xs text-metallic-silver/60">© 2025 GameSyncSphere. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a href="#" className="holo-social">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="holo-social">
            <Twitch className="w-5 h-5" />
          </a>
          <a href="#" className="holo-social">
            <Youtube className="w-5 h-5" />
          </a>
          <a href="#" className="holo-social">
            <Discord className="w-5 h-5" />
          </a>
        </nav>
      </footer>
    </div>
  )
}
