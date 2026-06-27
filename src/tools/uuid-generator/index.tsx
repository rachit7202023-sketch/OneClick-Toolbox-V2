import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const { toast } = useToast();

  const generateUuid = () => {
    // Generate v4 UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleGenerate = () => {
    const validCount = Math.min(Math.max(1, count), 100);
    const newUuids = Array.from({ length: validCount }, () => generateUuid());
    setUuids(newUuids);
  };

  // Generate on first load
  useState(() => {
    handleGenerate();
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleCopyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    toast({ title: "Copied all UUIDs to clipboard" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end bg-card border rounded-xl p-6">
        <div className="w-full sm:w-48">
          <Label htmlFor="count" className="mb-2 block">How many to generate?</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          />
        </div>
        <Button onClick={handleGenerate} className="w-full sm:w-auto gap-2 flex-1">
          <RefreshCw className="h-4 w-4" />
          Generate UUIDs
        </Button>
        <Button variant="secondary" onClick={handleCopyAll} disabled={uuids.length === 0} className="w-full sm:w-auto">
          <Copy className="h-4 w-4 mr-2" />
          Copy All
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="bg-muted px-4 py-2 border-b text-sm font-semibold text-muted-foreground">
          Generated UUIDs (v4)
        </div>
        <ul className="divide-y">
          {uuids.map((uuid, index) => (
            <li key={index} className="px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors group">
              <span className="font-mono text-base">{uuid}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8"
                onClick={() => handleCopy(uuid)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
