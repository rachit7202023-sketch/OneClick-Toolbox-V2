import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CaseConverter() {
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

  const convert = (type: string) => {
    let result = text;
    switch (type) {
      case "uppercase":
        result = text.toUpperCase();
        break;
      case "lowercase":
        result = text.toLowerCase();
        break;
      case "title":
        result = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case "sentence":
        result = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case "camel":
        result = text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
          if (+match === 0) return ""; 
          return index === 0 ? match.toLowerCase() : match.toUpperCase();
        }).replace(/\s+/g, '');
        break;
      case "pascal":
        result = text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => {
          if (+match === 0) return ""; 
          return match.toUpperCase();
        }).replace(/\s+/g, '');
        break;
      case "snake":
        result = text.replace(/\W+/g, " ").trim().split(" ").join("_").toLowerCase();
        break;
      case "kebab":
        result = text.replace(/\W+/g, " ").trim().split(" ").join("-").toLowerCase();
        break;
    }
    setText(result);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => convert("uppercase")}>UPPERCASE</Button>
        <Button variant="outline" onClick={() => convert("lowercase")}>lowercase</Button>
        <Button variant="outline" onClick={() => convert("title")}>Title Case</Button>
        <Button variant="outline" onClick={() => convert("sentence")}>Sentence case</Button>
        <Button variant="outline" onClick={() => convert("camel")}>camelCase</Button>
        <Button variant="outline" onClick={() => convert("pascal")}>PascalCase</Button>
        <Button variant="outline" onClick={() => convert("snake")}>snake_case</Button>
        <Button variant="outline" onClick={() => convert("kebab")}>kebab-case</Button>
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
