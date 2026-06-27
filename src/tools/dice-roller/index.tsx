import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";

export default function DiceRoller() {
  const [diceType, setDiceType] = useState(6);
  const [diceCount, setDiceCount] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [results, setResults] = useState<number[]>([6]); // Initial default view

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Simulate rolling animation
    let rollInterval = setInterval(() => {
      setResults(Array.from({ length: diceCount }, () => Math.floor(Math.random() * diceType) + 1));
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      setResults(Array.from({ length: diceCount }, () => Math.floor(Math.random() * diceType) + 1));
      setIsRolling(false);
    }, 1000);
  };

  const total = results.reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-card border rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <Label className="text-base font-semibold">Dice Type</Label>
          <Select value={diceType.toString()} onValueChange={(v) => setDiceType(parseInt(v))}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Select dice type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">d4 (4-sided)</SelectItem>
              <SelectItem value="6">d6 (6-sided)</SelectItem>
              <SelectItem value="8">d8 (8-sided)</SelectItem>
              <SelectItem value="10">d10 (10-sided)</SelectItem>
              <SelectItem value="12">d12 (12-sided)</SelectItem>
              <SelectItem value="20">d20 (20-sided)</SelectItem>
              <SelectItem value="100">d100 (100-sided)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-32 space-y-4">
          <Label className="text-base font-semibold">Number of Dice</Label>
          <Input 
            type="number" 
            min={1} 
            max={10} 
            value={diceCount}
            onChange={(e) => {
              const val = Math.min(Math.max(1, parseInt(e.target.value) || 1), 10);
              setDiceCount(val);
              // Update results array size to match preview
              setResults(prev => {
                if (prev.length === val) return prev;
                if (prev.length < val) return [...prev, ...Array(val - prev.length).fill(diceType)];
                return prev.slice(0, val);
              });
            }}
            className="h-12 text-lg"
          />
        </div>

        <div className="w-full sm:w-auto flex items-end">
          <Button 
            size="lg" 
            className="w-full h-12 px-8 text-lg"
            onClick={rollDice}
            disabled={isRolling}
          >
            <Dices className="h-5 w-5 mr-2" />
            {isRolling ? "Rolling..." : "Roll"}
          </Button>
        </div>
      </div>

      <div className="bg-muted/30 border rounded-2xl p-10 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="flex flex-wrap gap-4 justify-center items-center z-10">
          <AnimatePresence>
            {results.map((result, i) => (
              <motion.div
                key={`${i}-${isRolling ? 'rolling' : 'done'}`} // Force re-render on state change for animation
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`
                  w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-lg
                  text-3xl sm:text-4xl font-bold tabular-nums
                  ${isRolling ? 'bg-primary/20 text-primary animate-pulse border-2 border-primary' : 'bg-background border-2 border-border text-foreground'}
                `}
              >
                {result}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!isRolling && results.length > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center z-10"
          >
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Sum</div>
            <div className="text-5xl font-black text-primary">{total}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
