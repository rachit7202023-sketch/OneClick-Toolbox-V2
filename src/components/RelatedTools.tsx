import { tools, Tool } from "@/data/tools";
import { ToolCard } from "./ToolCard";

interface RelatedToolsProps {
  currentTool: Tool;
}

export function RelatedTools({ currentTool }: RelatedToolsProps) {
  const related = tools
    .filter(t => t.category === currentTool.category && t.id !== currentTool.id)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t">
      <h2 className="text-2xl font-bold mb-8">Related Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
