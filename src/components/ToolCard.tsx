import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Tool } from "@/data/tools";
import { categories } from "@/data/categories";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const category = categories.find(c => c.id === tool.category);
  const Icon = tool.icon;

  return (
    <Link href={`/tools/${tool.slug}`}>
      <div className="group relative bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg bg-muted ${category?.color || "text-primary"}`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
            {category?.name || "Tool"}
          </span>
        </div>
        
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {tool.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-6 flex-grow line-clamp-2">
          {tool.description}
        </p>
        
        <div className="flex items-center text-sm font-medium text-primary mt-auto">
          Open Tool
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
