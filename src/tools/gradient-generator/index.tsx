import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GradientGenerator() {
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#ec4899");
  const [angle, setAngle] = useState([90]);
  const [cssString, setCssString] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const css = `linear-gradient(${angle[0]}deg, ${color1}, ${color2})`;
    setCssString(css);
  }, [color1, color2, angle]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`background: ${cssString};`);
    toast({ title: "CSS copied to clipboard" });
  };

  const randomize = () => {
    const rColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColor1(rColor());
    setColor2(rColor());
    setAngle([Math.floor(Math.random() * 360)]);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div 
        className="rounded-2xl border shadow-lg min-h-[300px] md:min-h-full transition-all duration-300"
        style={{ background: cssString }}
      />
      
      <div className="bg-card border rounded-xl p-6 sm:p-8 space-y-8 shadow-sm">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Colors</h2>
            <Button variant="outline" size="sm" onClick={randomize}>Randomize</Button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>Color 1</Label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={color1} 
                  onChange={(e) => setColor1(e.target.value)}
                  className="h-12 w-12 rounded cursor-pointer border-0 p-0"
                />
                <div className="flex-1 bg-muted rounded-md flex items-center justify-center font-mono text-sm font-medium uppercase border">
                  {color1}
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Color 2</Label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={color2} 
                  onChange={(e) => setColor2(e.target.value)}
                  className="h-12 w-12 rounded cursor-pointer border-0 p-0"
                />
                <div className="flex-1 bg-muted rounded-md flex items-center justify-center font-mono text-sm font-medium uppercase border">
                  {color2}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">Direction Angle</Label>
            <span className="font-mono text-primary font-bold">{angle[0]}°</span>
          </div>
          <Slider
            value={angle}
            onValueChange={setAngle}
            min={0}
            max={360}
            step={1}
            className="py-2"
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <Label className="text-base font-semibold">CSS Output</Label>
          <div className="relative">
            <div className="bg-muted p-4 rounded-lg font-mono text-sm text-foreground overflow-x-auto whitespace-nowrap border">
              background: {cssString};
            </div>
          </div>
          <Button size="lg" className="w-full h-14 text-lg mt-4 gap-2" onClick={handleCopy}>
            <Copy className="h-5 w-5" /> Copy CSS
          </Button>
        </div>
      </div>
    </div>
  );
}
