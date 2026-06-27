import { Link } from "wouter";
import { Zap, Shield, Globe, Heart, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { tools } from "@/data/tools";
import { categories } from "@/data/categories";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-16 max-w-4xl flex-1">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            About OneClick
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We believe useful tools should be available to everyone — free, fast, and without friction.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-10 mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            OneClick is The Internet's Toolbox. We set out to build a place where anyone — students, developers, 
            designers, business owners, or curious people — can instantly access powerful, everyday web utilities 
            without creating an account, paying a subscription, or giving up their data.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { value: `${tools.length}+`, label: "Free Tools" },
            { value: `${categories.length}`, label: "Categories" },
            { value: "100%", label: "Browser-Based" },
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Globe,
                title: "Free for Everyone",
                desc: "Every tool on OneClick is and will always be free. No premium tiers, no ads disguised as features, no paywalls."
              },
              {
                icon: Shield,
                title: "Privacy by Design",
                desc: "All tools run entirely in your browser. We don't store, transmit, or analyze your data. Period."
              },
              {
                icon: Zap,
                title: "Built for Speed",
                desc: "No server round-trips means instant results. Tools respond as you type, keeping you in the flow."
              },
              {
                icon: Heart,
                title: "Made with Care",
                desc: "We obsess over details — clean interfaces, thoughtful interactions, and tools that just work."
              }
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-card border border-border rounded-xl">
                <div className="bg-primary/10 text-primary p-2.5 rounded-lg h-fit flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-muted/40 border border-border rounded-2xl p-10">
          <h2 className="text-2xl font-bold mb-3">Start Using OneClick</h2>
          <p className="text-muted-foreground mb-6">
            Explore our collection of {tools.length} free tools — no account needed.
          </p>
          <Link href="/tools">
            <Button size="lg" className="gap-2">
              Browse All Tools <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
