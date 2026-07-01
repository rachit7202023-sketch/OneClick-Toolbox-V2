import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Activity, Flame, Info, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { addDays, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface WeightGoalSimulatorProps {
  currentWeightKg: number;
  heightCm: number;
  bmi: number;
  gender: "male" | "female";
  tdee: number;
  isWeightMetric: boolean;
  idealRange: { min: number; max: number };
}

export function WeightGoalSimulator({ 
  currentWeightKg, 
  heightCm, 
  bmi, 
  gender, 
  tdee, 
  isWeightMetric, 
  idealRange 
}: WeightGoalSimulatorProps) {
  const [calorieChange, setCalorieChange] = useState(-500);

  // Math logic
  // 1 kg = 7700 kcal
  const dailyKcalPerKg = 7700;
  const weeklyChangeKg = (calorieChange * 7) / dailyKcalPerKg;
  const isHealthyBMI = bmi >= 18.5 && bmi <= 24.9;

  // Determine Target Weight based on healthy status and calorie change direction
  let targetWeightKg = currentWeightKg;
  let targetDesc = "";

  if (isHealthyBMI) {
    if (calorieChange < 0) {
      targetWeightKg = idealRange.min;
      targetDesc = "Lower Healthy Bound";
    } else if (calorieChange > 0) {
      targetWeightKg = idealRange.max;
      targetDesc = "Upper Healthy Bound";
    }
  } else if (bmi > 24.9) {
    targetWeightKg = idealRange.max;
    targetDesc = "Upper Healthy Bound";
  } else {
    targetWeightKg = idealRange.min;
    targetDesc = "Lower Healthy Bound";
  }

  const weightDiffKg = targetWeightKg - currentWeightKg;
  
  // Calculate time required
  let daysRequired = 0;
  if (Math.abs(calorieChange) > 0 && Math.sign(weightDiffKg) === Math.sign(calorieChange)) {
    daysRequired = Math.abs((weightDiffKg * dailyKcalPerKg) / calorieChange);
  }

  const monthsRequired = daysRequired / 30.4368;
  const completionDate = addDays(new Date(), daysRequired);
  
  const recommendedIntake = tdee + calorieChange;

  // Safety Intelligence
  const minSafeCalories = gender === "male" ? 1500 : 1200;
  const isTooLow = recommendedIntake < minSafeCalories;

  const determineSafety = () => {
    // Check direction
    if (bmi > 24.9 && calorieChange > 0) {
      return { status: "unsafe", title: "Warning", msg: "This calorie surplus will move you further away from a healthy BMI range.", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" };
    }
    if (bmi < 18.5 && calorieChange < 0) {
      return { status: "unsafe", title: "Warning", msg: "This calorie deficit will move you further away from a healthy BMI range.", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" };
    }
    
    // Check minimums
    if (isTooLow) {
      return { status: "unsafe", title: "Dangerously Low Intake", msg: `Your calculated intake falls below commonly recommended minimum daily energy intake guidance (${minSafeCalories} kcal for ${gender}s). Consider choosing a smaller calorie deficit or consult a healthcare professional.`, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" };
    }
    
    // Check magnitude
    if (calorieChange < -1000) {
      return { status: "unsafe", title: "Unsafe Deficit", msg: "A deficit larger than 1000 kcal/day can lead to muscle loss and nutritional deficiencies.", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" };
    }
    if (calorieChange > 500) {
      return { status: "aggressive", title: "Aggressive Surplus", msg: "A surplus larger than 500 kcal/day may lead to excessive fat gain.", icon: Info, color: "text-yellow-500", bg: "bg-yellow-500/10" };
    }
    if (calorieChange <= -500 && calorieChange >= -1000) {
      return { status: "aggressive", title: "Aggressive Deficit", msg: "This calorie deficit is more aggressive and may be difficult to maintain. Monitor your energy levels.", icon: Info, color: "text-yellow-500", bg: "bg-yellow-500/10" };
    }
    if (calorieChange === 0) {
      return { status: "safe", title: "Maintenance", msg: "You will maintain your current weight.", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    }
    
    return { status: "safe", title: "Safe & Sustainable", msg: "This calorie change is considered sustainable for long-term weight management.", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" };
  };

  const safety = determineSafety();
  const SafetyIcon = safety.icon;

  const displayW = (kg: number) => isWeightMetric ? `${kg.toFixed(1)} kg` : `${(kg * 2.20462).toFixed(1)} lbs`;

  // Animated Number component
  const AnimatedNumber = ({ value, suffix = "" }: { value: number | string, suffix?: string }) => (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="inline-block"
    >
      {value}{suffix}
    </motion.div>
  );

  return (
    <div className="bg-card border rounded-2xl shadow-sm overflow-hidden mt-6">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-xl tracking-tight">Weight Goal Simulator</h3>
            <p className="text-muted-foreground text-sm">Interactive projection of your weight journey</p>
          </div>
        </div>

        {isHealthyBMI && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm border border-emerald-500/20">
            <span className="font-bold">You are already within the healthy BMI range.</span> The simulator below lets you understand how different calorie deficits or surpluses may affect your weight over time while remaining within or moving outside the healthy range.
          </div>
        )}
      </div>

      <div className="p-6 space-y-8">
        {/* Simulator Controls */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <div className="font-bold mb-1">Daily Calorie Change</div>
              <div className="text-sm text-muted-foreground">Adjust your deficit or surplus</div>
            </div>
            <div className={`text-2xl font-black tabular-nums tracking-tighter ${calorieChange < 0 ? 'text-orange-500' : calorieChange > 0 ? 'text-blue-500' : 'text-emerald-500'}`}>
              <AnimatedNumber value={calorieChange > 0 ? `+${calorieChange}` : calorieChange} suffix=" kcal/day" />
            </div>
          </div>

          <div className="relative pt-6 pb-2 px-2">
            <div className="absolute top-0 left-[20%] -translate-x-1/2 flex flex-col items-center">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Recommended</div>
              <div className="w-px h-3 bg-muted-foreground/30" />
            </div>
            <Slider
              value={[calorieChange]}
              min={-1000}
              max={500}
              step={50}
              onValueChange={(v) => setCalorieChange(v[0])}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-2">
              <span>Weight Loss</span>
              <span>Maintenance</span>
              <span>Weight Gain</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Intake Info */}
          <div className="p-5 rounded-2xl bg-muted/30 border space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground text-sm font-semibold">Maintenance Calories</span>
              <span className="font-bold tabular-nums">{Math.round(tdee)} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">Recommended Daily Intake</span>
              <span className="text-xl font-black tabular-nums text-primary"><AnimatedNumber value={Math.round(recommendedIntake)} suffix=" kcal" /></span>
            </div>
          </div>

          {/* Safety Status */}
          <div className={`p-5 rounded-2xl border ${safety.bg} ${safety.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <SafetyIcon className="h-5 w-5" />
              <span className="font-bold tracking-tight">{safety.title}</span>
            </div>
            <p className="text-sm font-medium opacity-90 leading-relaxed">
              {safety.msg}
            </p>
          </div>
        </div>

        {/* Projections */}
        {(daysRequired > 0 && Math.sign(weightDiffKg) === Math.sign(calorieChange)) ? (
          <div className="pt-6 border-t space-y-6">
            <h4 className="font-bold tracking-tight">Live Goal Projection</h4>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Current</div>
                <div className="font-black text-lg">{displayW(currentWeightKg)}</div>
              </div>
              <div className="hidden lg:flex items-center justify-center text-muted-foreground/30">
                <ArrowRight className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Target</div>
                <div className="font-black text-lg text-emerald-500">{displayW(targetWeightKg)}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{targetDesc}</div>
              </div>
              <div className="hidden lg:flex items-center justify-center text-muted-foreground/30">
                <ArrowRight className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Difference</div>
                <div className="font-black text-lg">{displayW(Math.abs(weightDiffKg))}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border bg-muted/10 text-center">
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Weekly Change</div>
                <div className="font-black text-lg"><AnimatedNumber value={displayW(Math.abs(weeklyChangeKg))} /></div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">≈ <AnimatedNumber value={displayW(Math.abs(weeklyChangeKg * 4.345))} /> / month</div>
              </div>
              
              <div className="p-4 rounded-xl border bg-muted/10 text-center">
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Estimated Time</div>
                <div className="font-black text-lg"><AnimatedNumber value={`~${Math.max(1, Math.round(monthsRequired))}`} suffix=" months" /></div>
              </div>
              
              <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 text-center">
                <div className="text-xs font-bold text-primary uppercase mb-1">Goal Date</div>
                <div className="font-black text-xl text-primary"><AnimatedNumber value={format(completionDate, "MMMM yyyy")} /></div>
              </div>
            </div>
          </div>
        ) : (
          daysRequired === 0 && Math.abs(calorieChange) > 0 ? (
            <div className="pt-6 border-t text-center text-muted-foreground">
              You will remain at your current weight.
            </div>
          ) : (
            Math.abs(calorieChange) > 0 && (
              <div className="pt-6 border-t p-4 bg-muted rounded-xl text-center text-muted-foreground text-sm">
                Your selected calorie direction moves you away from the healthy weight target.
              </div>
            )
          )
        )}

      </div>
    </div>
  );
}
