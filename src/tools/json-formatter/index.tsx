import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Download, Braces } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormat = (space = 2) => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, space));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleMinify = () => {
    handleFormat(0);
  };

  const handleCopy = () => {
    if (!input || error) return;
    navigator.clipboard.writeText(input);
    toast({
      title: "Copied to clipboard",
    });
  };

  const handleDownload = () => {
    if (!input || error) return;
    const blob = new Blob([input], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center bg-card border rounded-xl p-4">
        <div className="flex gap-2">
          <Button onClick={() => handleFormat(2)} className="gap-2">
            <Braces className="h-4 w-4" />
            Format
          </Button>
          <Button variant="outline" onClick={handleMinify}>Minify</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload} title="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="font-mono text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <Textarea
        placeholder='{"paste": "your JSON here"}'
        className={`min-h-[500px] text-base resize-y font-mono p-4 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          if (error) setError(null);
        }}
        spellCheck={false}
      />
    </div>
  );
}
