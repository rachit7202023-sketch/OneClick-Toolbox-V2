import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TextRepeater() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState("\\n");
  const { toast } = useToast();

  // Handle escape sequences in separator (like \n for newline)
  const getActualSeparator = (sep: string) => {
    return sep.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  };

  const actualSeparator = getActualSeparator(separator);
  const result = text ? Array(count).fill(text).join(actualSeparator) : "";

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to clipboard",
      description: "The repeated text has been copied.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6 bg-card border rounded-xl p-6">
        <div>
          <Label htmlFor="text-to-repeat" className="text-base font-semibold mb-2 block">Text to repeat</Label>
          <Textarea
            id="text-to-repeat"
            placeholder="Text to repeat..."
            className="h-[100px] resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="repeat-count" className="text-base font-semibold mb-2 block">Repeat count</Label>
          <Input
            id="repeat-count"
            type="number"
            min={1}
            max={10000}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 0)}
          />
        </div>

        <div>
          <Label htmlFor="separator" className="text-base font-semibold mb-2 block">Separator</Label>
          <Input
            id="separator"
            placeholder="E.g., \n or , or space"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">Use \n for new line, \t for tab.</p>
        </div>
      </div>

      <div className="relative">
        <Label className="text-base font-semibold mb-2 block">Result</Label>
        <Textarea
          readOnly
          className="h-[calc(100%-32px)] min-h-[300px] text-base resize-none bg-muted/30 pb-12 font-mono"
          value={result}
          placeholder="Result will appear here..."
        />
        <div className="absolute bottom-4 right-4">
          <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!result}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Result
          </Button>
        </div>
      </div>
    </div>
  );
}
