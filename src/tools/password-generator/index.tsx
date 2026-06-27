import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = "";
    if (options.uppercase) charset += CHARS.uppercase;
    if (options.lowercase) charset += CHARS.lowercase;
    if (options.numbers) charset += CHARS.numbers;
    if (options.symbols) charset += CHARS.symbols;

    // Fallback if all unchecked
    if (!charset) {
      setOptions({ ...options, lowercase: true });
      charset = CHARS.lowercase;
    }

    let newPassword = "";
    const randomValues = new Uint32Array(length[0]);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length[0]; i++) {
      newPassword += charset[randomValues[i] % charset.length];
    }

    setPassword(newPassword);
  };

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, options]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    toast({ title: "Password copied to clipboard" });
  };

  // Calculate strength (0-4)
  const getStrength = () => {
    let score = 0;
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;
    if (options.uppercase && options.lowercase) score += 1;
    if (options.numbers && options.symbols) score += 1;
    return Math.min(4, score);
  };

  const strength = getStrength();
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-600"];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Display Area */}
      <div className="relative group">
        <div className="w-full bg-muted/50 border-2 border-muted rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[160px]">
          <div className="text-3xl sm:text-4xl md:text-5xl font-mono text-center font-bold tracking-tight break-all">
            {password}
          </div>
          
          <div className="mt-6 flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((index) => (
                <div 
                  key={index} 
                  className={`h-1.5 w-8 sm:w-12 rounded-full transition-colors ${
                    index < strength ? strengthColors[strength] : 'bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-2">
              {strengthLabels[strength]}
            </span>
          </div>
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="outline" size="icon" onClick={generatePassword} title="Regenerate">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={handleCopy} title="Copy">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border rounded-xl p-6 sm:p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">Password Length</Label>
            <span className="text-xl font-bold text-primary">{length[0]}</span>
          </div>
          <Slider
            value={length}
            onValueChange={setLength}
            min={8}
            max={128}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Characters used</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox 
                id="uppercase" 
                checked={options.uppercase}
                onCheckedChange={(c) => setOptions({ ...options, uppercase: c as boolean })}
              />
              <Label htmlFor="uppercase" className="flex-1 cursor-pointer font-medium">Uppercase (A-Z)</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox 
                id="lowercase" 
                checked={options.lowercase}
                onCheckedChange={(c) => setOptions({ ...options, lowercase: c as boolean })}
              />
              <Label htmlFor="lowercase" className="flex-1 cursor-pointer font-medium">Lowercase (a-z)</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox 
                id="numbers" 
                checked={options.numbers}
                onCheckedChange={(c) => setOptions({ ...options, numbers: c as boolean })}
              />
              <Label htmlFor="numbers" className="flex-1 cursor-pointer font-medium">Numbers (0-9)</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox 
                id="symbols" 
                checked={options.symbols}
                onCheckedChange={(c) => setOptions({ ...options, symbols: c as boolean })}
              />
              <Label htmlFor="symbols" className="flex-1 cursor-pointer font-medium">Symbols (!@#$)</Label>
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full text-lg h-14" onClick={handleCopy}>
          <Copy className="h-5 w-5 mr-2" />
          Copy Password
        </Button>
      </div>
    </div>
  );
}
