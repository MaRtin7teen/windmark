import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Zap, Globe, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col items-center justify-center p-6 text-center space-y-12 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 blur-[120px] opacity-20 dark:opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500 rounded-full animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500 rounded-full animate-blob animation-delay-4000" />
      </div>

      <div className="space-y-4 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase border border-primary/20">
          <Zap className="h-3.5 w-3.5" />
          The Future of Careers
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
          Elevate Your Career with Windmark
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The next-generation job portal for professionals who value speed,
          clarity, and premium design. Find your dream role in seconds.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        <Link href="/jobs">
          <Button
            size="lg"
            className="rounded-full h-14 px-8 text-lg font-semibold gap-2 premium-gradient hover:opacity-90 transition-opacity"
          >
            Browse Opportunities
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full h-14 px-8 text-lg font-semibold glass border-white/10"
        >
          Join Windmark
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 pt-12">
        <div className="space-y-3 p-6 glass rounded-3xl border-white/5">
          <Globe className="h-8 w-8 text-primary" />
          <h3 className="font-bold">Global Reach</h3>
          <p className="text-sm text-muted-foreground">
            Access opportunities from top companies worldwide.
          </p>
        </div>
        <div className="space-y-3 p-6 glass rounded-3xl border-white/5">
          <Briefcase className="h-8 w-8 text-primary" />
          <h3 className="font-bold">Diverse Roles</h3>
          <p className="text-sm text-muted-foreground">
            From startups to giants, find your perfect match.
          </p>
        </div>
        <div className="space-y-3 p-6 glass rounded-3xl border-white/5">
          <Shield className="h-8 w-8 text-primary" />
          <h3 className="font-bold">Premium UI</h3>
          <p className="text-sm text-muted-foreground">
            Experience a seamless, fast, and secure portal.
          </p>
        </div>
      </div>
    </div>
  );
}
