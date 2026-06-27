import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", 
  "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", 
  "aute", "irure", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", 
  "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", 
  "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [text, setText] = useState("");
  const { toast } = useToast();

  const generateWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  
  const generateSentence = () => {
    const wordCount = Math.floor(Math.random() * 10) + 5;
    const words = Array.from({ length: wordCount }, () => generateWord());
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ") + ".";
  };

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 5) + 3;
    return Array.from({ length: sentenceCount }, () => generateSentence()).join(" ");
  };

  const generateText = () => {
    let result = "";
    
    // Always start with "Lorem ipsum dolor sit amet" for the first paragraph/sentence
    const startStr = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
    
    if (type === "words") {
      const words = Array.from({ length: count }, () => generateWord());
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      result = words.join(" ");
    } else if (type === "sentences") {
      result = Array.from({ length: count }, (_, i) => 
        i === 0 ? startStr + generateSentence() : generateSentence()
      ).join(" ");
    } else {
      result = Array.from({ length: count }, (_, i) => 
        i === 0 ? startStr + generateParagraph() : generateParagraph()
      ).join("\n\n");
    }
    
    setText(result);
  };

  useEffect(() => {
    generateText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-end bg-card border rounded-xl p-6">
        <div className="w-full sm:w-32">
          <Label htmlFor="count" className="mb-2 block">Count</Label>
          <Input 
            id="count" 
            type="number" 
            min={1} 
            max={100} 
            value={count} 
            onChange={(e) => setCount(parseInt(e.target.value) || 1)} 
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Label htmlFor="type" className="mb-2 block">Type</Label>
          <Select value={type} onValueChange={(val: any) => setType(val)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraphs">Paragraphs</SelectItem>
              <SelectItem value="sentences">Sentences</SelectItem>
              <SelectItem value="words">Words</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={generateText} className="w-full sm:w-auto gap-2">
          <RefreshCw className="h-4 w-4" />
          Generate
        </Button>
      </div>

      <div className="relative">
        <Textarea
          readOnly
          className="min-h-[400px] text-base resize-y pb-12 leading-relaxed"
          value={text}
        />
        <div className="absolute bottom-4 right-4">
          <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!text}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
}
