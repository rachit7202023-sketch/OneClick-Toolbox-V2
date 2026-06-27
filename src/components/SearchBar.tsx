import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const { query, setQuery, results } = useSearch("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      setLocation(`/tools?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for tools... (e.g. Word Counter, JSON, Password)"
          className="w-full pl-12 pr-4 h-14 text-lg rounded-2xl border-border bg-background shadow-sm hover:border-primary/50 focus-visible:border-primary focus-visible:ring-primary/20 transition-all"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          data-testid="input-global-search"
        />
        {query && (
          <button 
            className="absolute right-4 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => {
              setLocation(`/tools?q=${encodeURIComponent(query)}`);
              setIsOpen(false);
            }}
          >
            Search
          </button>
        )}
      </div>

      {isOpen && query && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-[400px] overflow-y-auto">
          <div className="p-2">
            {results.slice(0, 5).map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} href={`/tools/${tool.slug}`}>
                  <div 
                    className="flex items-center gap-4 p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="bg-muted p-2 rounded-md">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{tool.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{tool.description}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {results.length > 5 && (
            <div 
              className="p-3 bg-muted/50 border-t border-border text-center text-sm font-medium text-primary hover:bg-muted cursor-pointer transition-colors flex items-center justify-center gap-1"
              onClick={() => {
                setLocation(`/tools?q=${encodeURIComponent(query)}`);
                setIsOpen(false);
              }}
            >
              View all {results.length} results
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 p-6 text-center text-muted-foreground">
          No tools found for "{query}". Try another search term.
        </div>
      )}
    </div>
  );
}
