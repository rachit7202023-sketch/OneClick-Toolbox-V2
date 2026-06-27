import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ColorPicker() {
  const [color, setColor] = useState("#6366f1");
  const [rgb, setRgb] = useState("rgb(99, 102, 241)");
  const [hsl, setHsl] = useState("hsl(239, 84%, 67%)");
  const { toast } = useToast();

  const hexToRgb = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    };
  };

  useEffect(() => {
    try {
      const { r, g, b } = hexToRgb(color);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        setRgb(`rgb(${r}, ${g}, ${b})`);
        const { h, s, l } = rgbToHsl(r, g, b);
        setHsl(`hsl(${h}, ${s}%, ${l}%)`);
      }
    } catch (e) {
      // Ignore invalid colors during typing
    }
  }, [color]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `Copied ${label} to clipboard` });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
        {/* Color Display & Picker */}
        <div 
          className="flex-1 min-h-[300px] flex items-center justify-center relative transition-colors duration-200"
          style={{ backgroundColor: color }}
        >
          <div className="bg-background/80 backdrop-blur px-6 py-4 rounded-xl shadow-lg font-mono text-xl font-bold border border-border/50">
            {color.toUpperCase()}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-crosshair"
          />
        </div>

        {/* Values */}
        <div className="flex-1 p-8 space-y-8 bg-card">
          <h2 className="text-2xl font-bold tracking-tight">Color Values</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">HEX</Label>
              <div className="flex gap-2">
                <Input 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="font-mono text-base h-12 uppercase" 
                />
                <Button variant="secondary" size="icon" className="h-12 w-12 shrink-0" onClick={() => handleCopy(color, "HEX")}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">RGB</Label>
              <div className="flex gap-2">
                <Input 
                  readOnly
                  value={rgb} 
                  className="font-mono text-base h-12 bg-muted/50" 
                />
                <Button variant="secondary" size="icon" className="h-12 w-12 shrink-0" onClick={() => handleCopy(rgb, "RGB")}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">HSL</Label>
              <div className="flex gap-2">
                <Input 
                  readOnly
                  value={hsl} 
                  className="font-mono text-base h-12 bg-muted/50" 
                />
                <Button variant="secondary" size="icon" className="h-12 w-12 shrink-0" onClick={() => handleCopy(hsl, "HSL")}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
