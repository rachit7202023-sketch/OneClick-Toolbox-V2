import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2, Printer, Activity } from "lucide-react";
import { BMIGauge } from "./components/BMIGauge";
import { WeightGoalSimulator } from "./components/WeightGoalSimulator";
import { HealthInsights } from "./components/HealthInsights";
import { SEOContent } from "./components/SEOContent";
import { 
  calculateBMI, getBMICategory, getIdealWeightRange, calculateBMR, calculateTDEE, 
  kgToLbs, lbsToKg, cmToFeetInches, feetInchesToCm 
} from "./utils";
import { useToast } from "@/hooks/use-toast";

export default function BmiCalculator() {
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<string>("30");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  
  // Local state for inputs to allow empty fields
  const [cm, setCm] = useState("175");
  const [kg, setKg] = useState("70");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");
  const [lbs, setLbs] = useState("154");

  const [bmi, setBmi] = useState<number>(0);
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  // Handlers for Unit Switches
  const toggleHeightUnit = () => {
    if (heightUnit === "cm") {
      setHeightUnit("ft");
      if (cm) {
        const { feet: f, inches: i } = cmToFeetInches(parseFloat(cm));
        setFeet(f.toString());
        setInches(i.toString());
      }
    } else {
      setHeightUnit("cm");
      const totalInches = (parseFloat(feet || "0") * 12) + parseFloat(inches || "0");
      if (totalInches > 0) {
        setCm((totalInches * 2.54).toFixed(1));
      }
    }
  };

  const toggleWeightUnit = () => {
    if (weightUnit === "kg") {
      setWeightUnit("lbs");
      if (kg) {
        setLbs(kgToLbs(parseFloat(kg)).toFixed(1));
      }
    } else {
      setWeightUnit("kg");
      if (lbs) {
        setKg(lbsToKg(parseFloat(lbs)).toFixed(1));
      }
    }
  };

  useEffect(() => {
    let weightKg = 0;
    let heightCm = 0;
    
    if (weightUnit === "kg") {
      weightKg = parseFloat(kg || "0");
    } else {
      weightKg = lbsToKg(parseFloat(lbs || "0"));
    }

    if (heightUnit === "cm") {
      heightCm = parseFloat(cm || "0");
    } else {
      heightCm = feetInchesToCm(parseFloat(feet || "0"), parseFloat(inches || "0"));
    }

    if (weightKg > 0 && heightCm > 0) {
      setBmi(calculateBMI(weightKg, heightCm));
    } else {
      setBmi(0);
    }
  }, [heightUnit, weightUnit, cm, kg, feet, inches, lbs]);

  const heightCm = heightUnit === "cm" ? parseFloat(cm || "0") : feetInchesToCm(parseFloat(feet || "0"), parseFloat(inches || "0"));
  const weightKg = weightUnit === "kg" ? parseFloat(kg || "0") : lbsToKg(parseFloat(lbs || "0"));
  
  const categoryData = bmi > 0 ? getBMICategory(bmi) : null;
  const idealRange = heightCm > 0 ? getIdealWeightRange(heightCm) : null;
  
  const bmr = heightCm > 0 && weightKg > 0 && parseFloat(age) > 0 ? calculateBMR(weightKg, heightCm, parseFloat(age), gender) : 0;
  const tdee = bmr > 0 ? calculateTDEE(bmr, activityLevel as any) : 0;

  // Comparison logic
  const targetWeightKg = idealRange ? (weightKg > idealRange.max ? idealRange.max : weightKg < idealRange.min ? idealRange.min : weightKg) : weightKg;
  const diffKg = weightKg - targetWeightKg;

  const displayWeight = (wKg: number) => weightUnit === "kg" ? `${wKg.toFixed(1)} kg` : `${kgToLbs(wKg).toFixed(1)} lbs`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard" });
  };

  return (
    <div className="max-w-6xl mx-auto print:max-w-none print:m-0 print:bg-white print:text-black" ref={printRef}>
      
      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        
        {/* Left Column: Inputs & Gauge */}
        <div className="space-y-6">
          <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm print:shadow-none print:border-none print:p-0">
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4 print:hidden">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="h-12" min="15" max="120" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Height</Label>
                  <button onClick={toggleHeightUnit} className="text-xs font-semibold text-primary hover:underline print:hidden">
                    Use {heightUnit === "cm" ? "ft/in" : "cm"}
                  </button>
                </div>
                {heightUnit === "cm" ? (
                  <div className="relative">
                    <Input type="number" value={cm} onChange={(e) => setCm(e.target.value)} className="h-14 text-lg pl-4 pr-12 font-medium" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">cm</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} className="h-14 text-lg pl-4 pr-12 font-medium" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">ft</div>
                    </div>
                    <div className="relative">
                      <Input type="number" value={inches} onChange={(e) => setInches(e.target.value)} className="h-14 text-lg pl-4 pr-12 font-medium" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">in</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Weight</Label>
                  <button onClick={toggleWeightUnit} className="text-xs font-semibold text-primary hover:underline print:hidden">
                    Use {weightUnit === "kg" ? "lbs" : "kg"}
                  </button>
                </div>
                {weightUnit === "kg" ? (
                  <div className="relative">
                    <Input type="number" value={kg} onChange={(e) => setKg(e.target.value)} className="h-14 text-lg pl-4 pr-12 font-medium" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">kg</div>
                  </div>
                ) : (
                  <div className="relative">
                    <Input type="number" value={lbs} onChange={(e) => setLbs(e.target.value)} className="h-14 text-lg pl-4 pr-12 font-medium" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">lbs</div>
                  </div>
                )}
              </div>

              <div className="space-y-2 print:hidden">
                <Label>Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                    <SelectItem value="light">Lightly Active (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                    <SelectItem value="veryActive">Very Active (Physical job/training)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-center items-center overflow-hidden print:border-none print:shadow-none print:p-0">
            {bmi > 0 && categoryData ? (
              <>
                <BMIGauge bmi={bmi} />
                {idealRange && (
                  <div className="w-full mt-10 pt-6 border-t border-muted/50 text-center text-sm text-muted-foreground">
                    <div>Healthy weight range for your height:</div>
                    <div className="font-bold text-foreground text-base mt-1">
                      {displayWeight(idealRange.min)} - {displayWeight(idealRange.max)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center text-muted-foreground flex flex-col items-center">
                <Activity className="h-12 w-12 opacity-20 mb-4" />
                Enter your details to see your BMI dashboard
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Insights & Planners */}
        {bmi > 0 && categoryData && idealRange && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex gap-2 justify-end print:hidden">
              <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-xl shadow-sm">
                <Printer className="h-4 w-4 mr-2" /> Print Report
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyLink} className="rounded-xl shadow-sm">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Current</div>
                <div className="text-xl font-black">{displayWeight(weightKg)}</div>
              </div>
              <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Target</div>
                <div className="text-xl font-black text-emerald-500">{displayWeight(targetWeightKg)}</div>
              </div>
              <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Difference</div>
                <div className={`text-xl font-black ${Math.abs(diffKg) < 0.5 ? 'text-emerald-500' : diffKg > 0 ? 'text-orange-500' : 'text-blue-500'}`}>
                  {Math.abs(diffKg) < 0.5 ? "Perfect" : `${diffKg > 0 ? '+' : '-'}${displayWeight(Math.abs(diffKg))}`}
                </div>
              </div>
              <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">TDEE</div>
                <div className="text-xl font-black">{Math.round(tdee)} <span className="text-xs">kcal</span></div>
              </div>
            </div>

            <HealthInsights category={categoryData.category} />

            <WeightGoalSimulator 
              currentWeightKg={weightKg}
              heightCm={heightCm}
              bmi={bmi}
              gender={gender}
              tdee={tdee}
              isWeightMetric={weightUnit === "kg"}
              idealRange={idealRange}
            />

          </div>
        )}
      </div>

      <SEOContent />

    </div>
  );
}
