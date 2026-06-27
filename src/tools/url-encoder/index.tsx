import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UrlEncoder() {
  const [encodeInput, setEncodeInput] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const getEncoded = () => {
    if (!encodeInput) return "";
    try {
      return encodeURIComponent(encodeInput);
    } catch (e) {
      return "";
    }
  };

  const getDecoded = () => {
    if (!decodeInput) return "";
    try {
      setError(null);
      return decodeURIComponent(decodeInput);
    } catch (e) {
      setError("Malformed URI sequence");
      return "";
    }
  };

  const encoded = getEncoded();
  const decoded = getDecoded();

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-14">
          <TabsTrigger value="encode" className="text-base h-11">Encode</TabsTrigger>
          <TabsTrigger value="decode" className="text-base h-11">Decode</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encode" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">URL (Input)</label>
              <Textarea
                placeholder="https://example.com/search?q=hello world"
                className="flex-1 resize-none font-mono"
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-2">Encoded URL (Output)</label>
              <Textarea
                readOnly
                className="flex-1 resize-none bg-muted/50 font-mono pb-12 break-all"
                value={encoded}
                placeholder="https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
              />
              <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm" onClick={() => handleCopy(encoded)} disabled={!encoded}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="decode" className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Encoded URL (Input)</label>
              <Textarea
                placeholder="https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
                className={`flex-1 resize-none font-mono ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-2">Decoded URL (Output)</label>
              <Textarea
                readOnly
                className="flex-1 resize-none bg-muted/50 font-mono pb-12 break-all"
                value={decoded}
                placeholder="https://example.com/search?q=hello world"
              />
              <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm" onClick={() => handleCopy(decoded)} disabled={!decoded || !!error}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
