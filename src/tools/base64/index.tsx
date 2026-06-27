import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Base64() {
  const [encodeInput, setEncodeInput] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const getEncoded = () => {
    if (!encodeInput) return "";
    try {
      return btoa(encodeURIComponent(encodeInput).replace(/%([0-9A-F]{2})/g,
        (match, p1) => String.fromCharCode(Number('0x' + p1))
      ));
    } catch (e) {
      return "Error: Invalid characters";
    }
  };

  const getDecoded = () => {
    if (!decodeInput) return "";
    try {
      return decodeURIComponent(atob(decodeInput).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      return "Error: Invalid Base64 string";
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
              <label className="text-sm font-medium mb-2">Text (Input)</label>
              <Textarea
                placeholder="Type text to encode..."
                className="flex-1 resize-none font-mono"
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-2">Base64 (Output)</label>
              <Textarea
                readOnly
                className="flex-1 resize-none bg-muted/50 font-mono pb-12"
                value={encoded}
                placeholder="Encoded Base64 will appear here..."
              />
              <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm" onClick={() => handleCopy(encoded)} disabled={!encoded || encoded.startsWith('Error')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="decode" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Base64 (Input)</label>
              <Textarea
                placeholder="Paste Base64 to decode..."
                className="flex-1 resize-none font-mono"
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
              />
            </div>
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-2">Text (Output)</label>
              <Textarea
                readOnly
                className="flex-1 resize-none bg-muted/50 font-mono pb-12"
                value={decoded}
                placeholder="Decoded text will appear here..."
              />
              <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm" onClick={() => handleCopy(decoded)} disabled={!decoded || decoded.startsWith('Error')}>
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
