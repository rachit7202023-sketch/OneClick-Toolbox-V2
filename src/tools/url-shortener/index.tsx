import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShorten = () => {
    if (!url || !url.includes(".")) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const randomString = Math.random().toString(36).substring(2, 8);
      setShortUrl(`oneclick.io/${randomString}`);
      setIsLoading(false);
    }, 800);
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-4">
          <LinkIcon className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Paste a long URL to shorten</h2>
        <p className="text-muted-foreground">Create a clean, compact link instantly.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <Input
          placeholder="https://very-long-url-example.com/path/to/something/deep"
          className="h-16 text-lg rounded-xl shadow-sm px-6"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setShortUrl(null);
          }}
        />
        <Button 
          className="h-16 px-8 text-lg rounded-xl shadow-sm" 
          onClick={handleShorten}
          disabled={!url || isLoading}
        >
          {isLoading ? "Shortening..." : "Shorten URL"}
        </Button>
      </div>

      {shortUrl && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto mt-8">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 w-full text-center md:text-left">
              <p className="text-sm font-medium text-muted-foreground truncate max-w-[250px] md:max-w-xs">{url}</p>
              <div className="text-2xl font-bold text-primary flex items-center justify-center md:justify-start gap-2">
                {shortUrl}
                <ExternalLink className="h-5 w-5 opacity-50" />
              </div>
            </div>
            <Button size="lg" className="shrink-0 w-full md:w-auto h-14" onClick={handleCopy}>
              <Copy className="h-5 w-5 mr-2" />
              Copy Link
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4 italic">
            Note: This is a frontend demo. The shortened URL does not actually redirect.
          </p>
        </div>
      )}
    </div>
  );
}
