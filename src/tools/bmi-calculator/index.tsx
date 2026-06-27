import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function BmiCalculator() {
  const [isMetric, setIsMetric] = useState(true);
  
  // Metric
  const [cm, setCm] = useState("");
  const [kg, setKg] = useState("");
  
  // Imperial
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [lbs, setLbs] = useState("");

  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    if (isMetric) {
      const h = parseFloat(cm) / 100;
      const w = parseFloat(kg);
      if (h > 0 && w > 0) {
        setBmi(+(w / (h * h)).toFixed(1));
      } else {
        setBmi(null);
      }
    } else {
      const h = (parseFloat(feet || "0") * 12) + parseFloat(inches || "0");
      const w = parseFloat(lbs);
      if (h > 0 && w > 0) {
        setBmi(+((w / (h * h)) * 703).toFixed(1));
      } else {
        setBmi(null);
      }
    }
  }, [isMetric, cm, kg, feet, inches, lbs]);

  const getCategory = (val: number) => {
    if (val < 18.5) return { name: "Underweight", color: "text-blue-500", bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/30" };
    if (val >= 18.5 && val < 25) return { name: "Normal weight", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30" };
    if (val >= 25 && val < 30) return { name: "Overweight", color: "text-orange-500", bg: "bg-orange-50 border-orange-200 dark:bg-orange-950/30" };
    return { name: "Obese", color: "text-red-500", bg: "bg-red-50 border-red-200 dark:bg-red-950/30" };
  };

  const category = bmi ? getCategory(bmi) : null;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
        
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border">
          <Label className="font-semibold cursor-pointer" onClick={() => setIsMetric(true)}>Metric (cm/kg)</Label>
          <Switch 
            checked={!isMetric} 
            onCheckedChange={(v) => setIsMetric(!v)} 
          />
          <Label className="font-semibold cursor-pointer" onClick={() => setIsMetric(false)}>Imperial (ft/lbs)</Label>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-sm">Height</h3>
            {isMetric ? (
              <div>
                <Input 
                  type="number" 
                  placeholder="Height in cm" 
                  className="h-14 text-lg" 
                  value={cm} 
                  onChange={(e) => setCm(e.target.value)} 
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  type="number" 
                  placeholder="Feet" 
                  className="h-14 text-lg" 
                  value={feet} 
                  onChange={(e) => setFeet(e.target.value)} 
                />
                <Input 
                  type="number" 
                  placeholder="Inches" 
                  className="h-14 text-lg" 
                  value={inches} 
                  onChange={(e) => setInches(e.target.value)} 
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-sm">Weight</h3>
            {isMetric ? (
              <Input 
                type="number" 
                placeholder="Weight in kg" 
                className="h-14 text-lg" 
                value={kg} 
                onChange={(e) => setKg(e.target.value)} 
              />
            ) : (
              <Input 
                type="number" 
                placeholder="Weight in lbs" 
                className="h-14 text-lg" 
                value={lbs} 
                onChange={(e) => setLbs(e.target.value)} 
              />
            )}
          </div>
        </div>

        {bmi !== null && category ? (
          <div className={`mt-8 p-6 rounded-xl border-2 text-center animate-in zoom-in-95 duration-300 ${category.bg}`}>
            <div className="text-sm font-semibold text-muted-foreground mb-2">Your BMI is</div>
            <div className={`text-6xl font-black mb-2 ${category.color}`}>{bmi}</div>
            <div className={`text-xl font-bold ${category.color}`}>{category.name}</div>
          </div>
        ) : (
          <div className="mt-8 p-6 rounded-xl border-2 border-dashed text-center text-muted-foreground">
            Enter your height and weight to see your BMI
          </div>
        )}

      </div>
    </div>
  );
}
