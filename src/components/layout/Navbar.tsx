import { Link } from "wouter";
import { Search, Moon, Sun, Menu, X, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <Hammer size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight">OneClick</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">The Internet's Toolbox</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">All Tools</Link>
            <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">Categories</Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} aria-label="Search" data-testid="button-search">
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu" data-testid="button-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">Home</Link>
                <Link href="/tools" className="text-lg font-medium hover:text-primary transition-colors">All Tools</Link>
                <Link href="/categories" className="text-lg font-medium hover:text-primary transition-colors">Categories</Link>
                <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors">About</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
