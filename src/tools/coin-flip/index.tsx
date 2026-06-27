import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function CoinFlip() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"Heads" | "Tails" | null>(null);
  const [history, setHistory] = useState<("Heads" | "Tails")[]>([]);
  
  // Stats
  const headsCount = history.filter(r => r === "Heads").length;
  const tailsCount = history.filter(r => r === "Tails").length;

  const flipCoin = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setResult(null);
    
    // Play flip animation for 1.5s
    setTimeout(() => {
      const newResult = Math.random() > 0.5 ? "Heads" : "Tails";
      setResult(newResult);
      setHistory(prev => [newResult, ...prev].slice(0, 10)); // Keep last 10
      setIsFlipping(false);
    }, 1500);
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="flex flex-col items-center justify-center bg-card border rounded-2xl p-10 min-h-[400px]">
        <div className="relative w-48 h-48 mb-8 perspective-1000">
          <motion.div
            className="w-full h-full rounded-full shadow-2xl relative transform-style-3d border-8 border-yellow-500 bg-yellow-400 flex items-center justify-center"
            animate={
              isFlipping
                ? { rotateY: [0, 1800], scale: [1, 1.2, 1] }
                : result === "Tails" 
                  ? { rotateY: 180, scale: 1 } 
                  : { rotateY: 0, scale: 1 }
            }
            transition={
              isFlipping 
                ? { duration: 1.5, ease: "easeInOut" }
                : { duration: 0.3 }
            }
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Heads face */}
            <div 
              className="absolute inset-0 w-full h-full rounded-full flex flex-col items-center justify-center backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="text-6xl font-bold text-yellow-700/80 uppercase">H</div>
              <div className="text-yellow-700/60 font-semibold mt-1">HEADS</div>
            </div>
            
            {/* Tails face */}
            <div 
              className="absolute inset-0 w-full h-full rounded-full flex flex-col items-center justify-center backface-hidden"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="text-6xl font-bold text-yellow-700/80 uppercase">T</div>
              <div className="text-yellow-700/60 font-semibold mt-1">TAILS</div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!isFlipping && result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-3xl font-bold text-foreground mb-8"
            >
              It's {result}!
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          size="lg" 
          className="w-full max-w-xs text-lg h-14 rounded-xl"
          onClick={flipCoin}
          disabled={isFlipping}
        >
          {isFlipping ? "Flipping..." : "Flip Coin"}
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden flex flex-col">
        <div className="bg-muted px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">History</h3>
          <Button variant="ghost" size="sm" onClick={clearHistory} disabled={history.length === 0}>
            Clear
          </Button>
        </div>
        
        <div className="p-6 border-b flex justify-around text-center bg-background">
          <div>
            <div className="text-3xl font-bold text-primary">{headsCount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Heads</div>
          </div>
          <div className="w-px bg-border"></div>
          <div>
            <div className="text-3xl font-bold text-primary">{tailsCount}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tails</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-0">
          {history.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground p-8">
              No flips yet. Flip the coin to see history.
            </div>
          ) : (
            <ul className="divide-y">
              {history.map((r, i) => (
                <motion.li 
                  key={history.length - i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <span className="text-muted-foreground font-mono text-sm">Flip #{history.length - i}</span>
                  <span className={`font-bold ${r === 'Heads' ? 'text-blue-500' : 'text-emerald-500'}`}>{r}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
