import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HexRgbConverter() {
  const [hex, setHex] = useState("6366f1");
  const [rgb, setRgb] = useState("99, 102, 241");
  const [hsl, setHsl] = useState("239, 84%, 67%");
  const [color, setColor] = useState("#6366f1");
  const [activeInput, setActiveInput] = useState<"hex" | "rgb" | "hsl">("hex");
  const { toast } = useToast();

  const handleCopy = (text: string, format: string) => {
    const formattedText = format === "hex" && !text.startsWith("#") ? `#${text}` :
                         format === "rgb" && !text.startsWith("rgb") ? `rgb(${text})` :
                         format === "hsl" && !text.startsWith("hsl") ? `hsl(${text})` : text;
    navigator.clipboard.writeText(formattedText);
    toast({ title: `Copied ${format.toUpperCase()} to clipboard` });
  };

  const parseRgb = (str: string) => {
    const m = str.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i) || 
              str.match(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (m) return { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]) };
    return null;
  };

  const parseHsl = (str: string) => {
    const m = str.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i) || 
              str.match(/^(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
    if (m) return { h: parseInt(m[1]), s: parseInt(m[2]), l: parseInt(m[3]) };
    return null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4)),
    };
  };

  const rgbToHslObj = (r: number, g: number, b: number) => {
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
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  // Sync logic
  useEffect(() => {
    if (activeInput !== "hex") return;
    const cleanHex = hex.replace("#", "");
    if (/^[0-9A-F]{6}$/i.test(cleanHex)) {
      setColor(`#${cleanHex}`);
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      setRgb(`${r}, ${g}, ${b}`);
      const { h, s, l } = rgbToHslObj(r, g, b);
      setHsl(`${h}, ${s}%, ${l}%`);
    } else if (/^[0-9A-F]{3}$/i.test(cleanHex)) {
      const r = parseInt(cleanHex[0] + cleanHex[0], 16);
      const g = parseInt(cleanHex[1] + cleanHex[1], 16);
      const b = parseInt(cleanHex[2] + cleanHex[2], 16);
      setColor(`#${cleanHex[0]}${cleanHex[0]}${cleanHex[1]}${cleanHex[1]}${cleanHex[2]}${cleanHex[2]}`);
      setRgb(`${r}, ${g}, ${b}`);
      const { h, s, l } = rgbToHslObj(r, g, b);
      setHsl(`${h}, ${s}%, ${l}%`);
    }
  }, [hex, activeInput]);

  useEffect(() => {
    if (activeInput !== "rgb") return;
    const parsed = parseRgb(rgb);
    if (parsed && parsed.r <= 255 && parsed.g <= 255 && parsed.b <= 255) {
      const { r, g, b } = parsed;
      const hx = rgbToHex(r, g, b);
      setHex(hx);
      setColor(`#${hx}`);
      const { h, s, l } = rgbToHslObj(r, g, b);
      setHsl(`${h}, ${s}%, ${l}%`);
    }
  }, [rgb, activeInput]);

  useEffect(() => {
    if (activeInput !== "hsl") return;
    const parsed = parseHsl(hsl);
    if (parsed && parsed.h <= 360 && parsed.s <= 100 && parsed.l <= 100) {
      const { h, s, l } = parsed;
      const { r, g, b } = hslToRgb(h, s, l);
      const hx = rgbToHex(r, g, b);
      setHex(hx);
      setColor(`#${hx}`);
      setRgb(`${r}, ${g}, ${b}`);
    }
  }, [hsl, activeInput]);

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8">
      <div className="bg-card border rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Convert Colors</h2>
        
        <div className="space-y-4">
          <Label className="text-sm font-semibold">HEX</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">#</span>
              <Input 
                value={hex} 
                onChange={(e) => { setActiveInput("hex"); setHex(e.target.value); }}
                className="pl-8 font-mono text-lg h-14 uppercase" 
              />
            </div>
            <Button variant="outline" size="icon" className="h-14 w-14 shrink-0" onClick={() => handleCopy(hex, "hex")}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center my-2">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold">RGB</Label>
          <div className="flex gap-2">
            <Input 
              value={rgb} 
              onChange={(e) => { setActiveInput("rgb"); setRgb(e.target.value); }}
              placeholder="e.g. 255, 255, 255"
              className="font-mono text-lg h-14" 
            />
            <Button variant="outline" size="icon" className="h-14 w-14 shrink-0" onClick={() => handleCopy(rgb, "rgb")}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center my-2">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold">HSL</Label>
          <div className="flex gap-2">
            <Input 
              value={hsl} 
              onChange={(e) => { setActiveInput("hsl"); setHsl(e.target.value); }}
              placeholder="e.g. 0, 100%, 50%"
              className="font-mono text-lg h-14" 
            />
            <Button variant="outline" size="icon" className="h-14 w-14 shrink-0" onClick={() => handleCopy(hsl, "hsl")}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-4 flex flex-col items-center">
        <div className="text-sm font-semibold mb-4 text-center">Preview</div>
        <div 
          className="w-full aspect-square rounded-xl border shadow-inner transition-colors duration-300" 
          style={{ backgroundColor: color }}
        />
        <div className="mt-6 w-full text-center space-y-1">
          <div className="font-mono font-bold text-lg uppercase">{color}</div>
          <div className="font-mono text-xs text-muted-foreground">rgb({rgb})</div>
        </div>
      </div>
    </div>
  );
}
