import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TextReverser() {
  const [text, setText] = useState("");
  const { toast } = useToast();

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  const reverseCharacters = () => {
    setText(text.split("").reverse().join(""));
  };

  const reverseWords = () => {
    setText(text.split(" ").reverse().join(" "));
  };

  const reverseLines = () => {
    setText(text.split("\n").reverse().join("\n"));
  };

  const reverseWordsInLines = () => {
    setText(text.split("\n").map(line => line.split(" ").reverse().join(" ")).join("\n"));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={reverseCharacters}>Reverse Characters</Button>
        <Button variant="outline" onClick={reverseWords}>Reverse Words</Button>
        <Button variant="outline" onClick={reverseLines}>Reverse Lines</Button>
        <Button variant="outline" onClick={reverseWordsInLines}>Reverse Words in Lines</Button>
      </div>

      <div className="relative">
        <Textarea
          placeholder="Type or paste your text here..."
          className="min-h-[300px] text-base resize-y pb-12"
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
