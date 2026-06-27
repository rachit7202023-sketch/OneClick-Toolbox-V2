import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([42]); // Initial display
  const { toast } = useToast();

  const generate = () => {
    // Validation
    const safeMin = Math.ceil(min);
    const safeMax = Math.floor(max);
    let safeCount = Math.max(1, count);

    if (safeMin > safeMax) {
      toast({ title: "Error", description: "Min must be less than Max", variant: "destructive" });
      return;
    }

    if (unique) {
      const possibleCount = safeMax - safeMin + 1;
      if (safeCount > possibleCount) {
        toast({ title: "Error", description: "Count cannot exceed range when Unique is on", variant: "destructive" });
        return;
      }
    }

    const newResults: number[] = [];
    
    if (unique) {
      // Create array of all possible values, shuffle, take count
      const pool = Array.from({ length: safeMax - safeMin + 1 }, (_, i) => safeMin + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      newResults.push(...pool.slice(0, safeCount));
    } else {
      for (let i = 0; i < safeCount; i++) {
        newResults.push(Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin);
      }
    }

    setResults(newResults);
  };

  const handleCopy = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join(", "));
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-card border rounded-xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min" className="mb-2 block">Minimum</Label>
            <Input
              id="min"
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="max" className="mb-2 block">Maximum</Label>
            <Input
              id="max"
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="count" className="mb-2 block">How many numbers?</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
          <div>
            <Label htmlFor="unique" className="text-base font-medium">Unique Numbers</Label>
            <p className="text-xs text-muted-foreground">Don't repeat the same number</p>
          </div>
          <Switch
            id="unique"
            checked={unique}
            onCheckedChange={setUnique}
          />
        </div>

        <Button size="lg" className="w-full text-lg h-14" onClick={generate}>
          <RefreshCw className="h-5 w-5 mr-2" />
          Generate
        </Button>
      </div>

      <div className="relative flex flex-col bg-muted/20 border rounded-xl overflow-hidden min-h-[300px]">
        <div className="bg-muted px-4 py-3 border-b flex justify-between items-center">
          <span className="font-semibold">Results</span>
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={results.length === 0}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </div>
        
        <div className="flex-1 p-6 flex items-center justify-center overflow-auto">
          {results.length === 1 ? (
            <span className="text-8xl md:text-9xl font-bold text-primary font-mono tabular-nums tracking-tighter">
              {results[0]}
            </span>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              {results.map((num, i) => (
                <div key={i} className="bg-background border shadow-sm px-4 py-2 rounded-lg text-2xl font-mono font-bold text-primary">
                  {num}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
