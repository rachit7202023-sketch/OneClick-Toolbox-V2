import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({ original: 0, removed: 0, remaining: 0 });
  const { toast } = useToast();

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  const removeDuplicates = () => {
    if (!text) return;
    
    const lines = text.split('\n');
    const originalCount = lines.length;
    
    const uniqueLines = [...new Set(lines)];
    const remainingCount = uniqueLines.length;
    const removedCount = originalCount - remainingCount;
    
    setText(uniqueLines.join('\n'));
    setStats({
      original: originalCount,
      removed: removedCount,
      remaining: remainingCount
    });
    
    toast({
      title: "Duplicates removed",
      description: `Removed ${removedCount} duplicate line(s).`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <Button onClick={removeDuplicates} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Remove Duplicates
        </Button>
        
        {stats.original > 0 && (
          <div className="text-sm text-muted-foreground flex gap-4 bg-muted px-4 py-2 rounded-lg">
            <span>Original: <strong>{stats.original}</strong></span>
            <span className="text-destructive">Removed: <strong>{stats.removed}</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400">Remaining: <strong>{stats.remaining}</strong></span>
          </div>
        )}
      </div>

      <div className="relative">
        <Textarea
          placeholder="Paste your list here (one item per line)..."
          className="min-h-[400px] text-base resize-y pb-12 font-mono"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value === "") {
              setStats({ original: 0, removed: 0, remaining: 0 });
            }
          }}
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!text}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
}
