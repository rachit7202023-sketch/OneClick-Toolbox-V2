import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { marked } from "marked";

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState("# Hello Markdown\n\nWrite your **markdown** here and see it rendered live on the right.\n\n## Features\n- Live preview\n- GitHub flavored markdown\n- Code blocks\n\n```javascript\nconsole.log('Hello world!');\n```\n\n> Blockquotes are also supported.\n\nEnjoy!");
  const [html, setHtml] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Configure marked to use gfm (GitHub Flavored Markdown)
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    
    // Parse markdown to HTML
    try {
      const parsed = marked.parse(markdown);
      setHtml(parsed as string);
    } catch (e) {
      console.error("Markdown parsing error", e);
    }
  }, [markdown]);

  const handleCopyHtml = () => {
    if (!html) return;
    navigator.clipboard.writeText(html);
    toast({
      title: "Copied HTML to clipboard",
    });
  };
  
  const handleDownload = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!markdown}>
          <Download className="h-4 w-4 mr-2" />
          Download .md
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopyHtml} disabled={!html}>
          <Copy className="h-4 w-4 mr-2" />
          Copy HTML
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
        {/* Editor Pane */}
        <div className="flex flex-col border rounded-xl overflow-hidden bg-card">
          <div className="bg-muted px-4 py-2 border-b text-sm font-semibold text-muted-foreground flex justify-between items-center">
            <span>Markdown</span>
          </div>
          <Textarea
            className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 text-base font-mono p-4"
            placeholder="Type your markdown here..."
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>

        {/* Preview Pane */}
        <div className="flex flex-col border rounded-xl overflow-hidden bg-card">
          <div className="bg-muted px-4 py-2 border-b text-sm font-semibold text-muted-foreground">
            Preview
          </div>
          <div 
            className="flex-1 p-6 overflow-auto prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
