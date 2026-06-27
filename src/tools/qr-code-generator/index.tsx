import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import QRCode from "qrcode";
import { useTheme } from "@/components/theme-provider";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://oneclick.io");
  const [size, setSize] = useState([256]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    generateQR();
  }, [text, size, theme]);

  const generateQR = async () => {
    if (!canvasRef.current || !text) return;
    
    try {
      const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size[0],
        margin: 2,
        color: {
          dark: isDark ? "#FFFFFF" : "#09090B",
          light: isDark ? "#09090B" : "#FFFFFF"
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8 bg-card border rounded-xl p-6 sm:p-8">
          <div>
            <Label htmlFor="text" className="text-base font-semibold mb-2 block">Content (Text or URL)</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Image Size</Label>
              <span className="font-mono text-primary">{size[0]}x{size[0]} px</span>
            </div>
            <Slider
              value={size}
              onValueChange={setSize}
              min={128}
              max={1024}
              step={16}
            />
          </div>

          <Button className="w-full h-12 text-base" onClick={handleDownload} disabled={!text}>
            <Download className="h-5 w-5 mr-2" />
            Download PNG
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center bg-muted/30 border rounded-xl p-8 min-h-[400px]">
          {text ? (
            <div className="bg-white dark:bg-black p-4 rounded-xl shadow-lg transition-all hover:scale-105">
              <canvas ref={canvasRef} className="max-w-full h-auto rounded-md" />
            </div>
          ) : (
            <div className="text-muted-foreground text-center">
              <div className="w-48 h-48 border-2 border-dashed border-muted-foreground/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-sm">Enter text to generate</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
