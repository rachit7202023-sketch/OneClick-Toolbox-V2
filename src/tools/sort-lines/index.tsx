import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SortLines() {
  const [text, setText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
    });
  };

  const getLines = () => text.split('\n');

  const sortAZ = () => {
    const lines = getLines();
    lines.sort((a, b) => {
      if (caseSensitive) return a.localeCompare(b);
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    setText(lines.join('\n'));
  };

  const sortZA = () => {
    const lines = getLines();
    lines.sort((a, b) => {
      if (caseSensitive) return b.localeCompare(a);
      return b.toLowerCase().localeCompare(a.toLowerCase());
    });
    setText(lines.join('\n'));
  };

  const sortByLengthAsc = () => {
    const lines = getLines();
    lines.sort((a, b) => a.length - b.length);
    setText(lines.join('\n'));
  };

  const sortByLengthDesc = () => {
    const lines = getLines();
    lines.sort((a, b) => b.length - a.length);
    setText(lines.join('\n'));
  };

  const randomize = () => {
    const lines = getLines();
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    setText(lines.join('\n'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-card border rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={sortAZ}>A-Z</Button>
          <Button variant="outline" size="sm" onClick={sortZA}>Z-A</Button>
          <Button variant="outline" size="sm" onClick={sortByLengthAsc}>Shortest First</Button>
          <Button variant="outline" size="sm" onClick={sortByLengthDesc}>Longest First</Button>
          <Button variant="outline" size="sm" onClick={randomize}>Randomize</Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="case-sensitive"
            checked={caseSensitive}
            onCheckedChange={setCaseSensitive}
          />
          <Label htmlFor="case-sensitive">Case Sensitive</Label>
        </div>
      </div>

      <div className="relative">
        <Textarea
          placeholder="Paste your list here (one item per line)..."
          className="min-h-[400px] text-base resize-y pb-12 font-mono"
          value={text}
          onChange={(e) => setText(e.target.value)}
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
