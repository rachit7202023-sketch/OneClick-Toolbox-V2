import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Tool } from "@/data/tools";
import { categories } from "@/data/categories";

interface ToolCardProps {
  tool: Tool;
  popular?: boolean;
}

// Per-category gradient pairs (from → to) matching the category color palette
const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  text:        ["#6366f1", "#8b5cf6"],
  developer:   ["#10b981", "#06b6d4"],
  generators:  ["#f59e0b", "#ef4444"],
  calculators: ["#6366f1", "#3b82f6"],
  color:       ["#ec4899", "#f43f5e"],
  image:       ["#f43f5e", "#fb923c"],
  utilities:   ["#64748b", "#6366f1"],
  ai:          ["#8b5cf6", "#6366f1"],
  default:     ["#7c3aed", "#a78bfa"],
};

export function ToolCard({ tool, popular = false }: ToolCardProps) {
  const category = categories.find(c => c.id === tool.category);
  const Icon     = tool.icon;
  const [from, to] = CATEGORY_GRADIENTS[tool.category] ?? CATEGORY_GRADIENTS.default;

  return (
    <Link href={`/tools/${tool.slug}`}>
      <motion.div
        whileHover={{ y: -5, transition: { duration: 0.22, ease: "easeOut" } }}
        className="group relative flex flex-col rounded-[22px] bg-card border border-border cursor-pointer overflow-hidden"
        style={{
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            `0 8px 32px rgba(124,58,237,0.14), 0 2px 8px rgba(0,0,0,0.08)`;
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(139,92,246,0.40)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 2px 12px rgba(0,0,0,0.06)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "";
        }}
      >
        {/* Popular badge */}
        {popular && (
          <div
            className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.10))",
              border: "1px solid rgba(139,92,246,0.30)",
              color: "rgb(167,139,250)",
            }}
          >
            ✦ Popular
          </div>
        )}

        <div className="p-6 flex flex-col h-full">
          {/* Icon container */}
          <div className="mb-5 flex items-start">
            <motion.div
              whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: 52,
                height: 52,
                background: `linear-gradient(135deg, ${from}, ${to})`,
                boxShadow: `0 4px 14px ${from}40`,
                flexShrink: 0,
              }}
            >
              <Icon className="h-6 w-6 text-white" />
            </motion.div>
          </div>

          {/* Title + description */}
          <h3 className="text-base font-bold mb-1.5 leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-1">
            {tool.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-grow line-clamp-2 mb-4">
            {tool.description}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/60">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${from}18, ${to}12)`,
                border: `1px solid ${from}30`,
                color: from,
              }}
            >
              {category?.name ?? "Tool"}
            </span>

            <span className="flex items-center gap-1 text-xs font-semibold text-primary">
              Open Tool
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
