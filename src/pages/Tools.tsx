import { useState, useMemo, useEffect } from "react";
import { useSearch } from "wouter";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/data/tools";
import { categories } from "@/data/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Tools() {
  const [searchStr] = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialQ = params.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    setQuery(initialQ);
  }, [initialQ]);

  const filtered = useMemo(() => {
    let result = tools;

    if (query.trim()) {
      const terms = query.toLowerCase().split(" ").filter(Boolean);
      result = result.filter(tool => {
        const text = [tool.name, tool.description, tool.category, ...tool.keywords].join(" ").toLowerCase();
        return terms.every(t => text.includes(t));
      });
    }

    if (selectedCategory !== "all") {
      result = result.filter(t => t.category === selectedCategory);
    }

    if (sortBy === "alphabetical") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      result = [...result].reverse();
    }

    return result;
  }, [query, selectedCategory, sortBy]);

  const activeCategories = categories.filter(c =>
    tools.some(t => t.category === c.id)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">All Tools</h1>
          <p className="text-muted-foreground">
            {tools.length} free tools — no account required
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools..."
              className="pl-10"
              value={query}
              onChange={e => setQuery(e.target.value)}
              data-testid="input-tools-search"
            />
            {query && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]" data-testid="select-sort">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary text-muted-foreground hover:text-foreground"
            }`}
            data-testid="filter-all"
          >
            All ({tools.length})
          </button>
          {activeCategories.map(cat => {
            const count = tools.filter(t => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-primary text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`filter-${cat.id}`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground mb-6">
              Try a different search term or category.
            </p>
            <Button onClick={() => { setQuery(""); setSelectedCategory("all"); }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> tools
                {query && <> matching "<span className="font-semibold text-foreground">{query}</span>"</>}
              </p>
              {(query || selectedCategory !== "all") && (
                <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setSelectedCategory("all"); }}>
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
