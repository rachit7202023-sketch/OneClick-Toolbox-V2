import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info, Activity, AlertTriangle } from "lucide-react";

interface BMIGaugeProps {
  bmi: number;
}

export function BMIGauge({ bmi }: BMIGaugeProps) {
  const [animatedBmi, setAnimatedBmi] = useState(0);

  useEffect(() => {
    // Basic counter effect for the number display
    let start = animatedBmi;
    const duration = 800; // ms
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out quart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setAnimatedBmi(start + (bmi - start) * easeProgress);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedBmi(bmi);
      }
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bmi]);

  // BMI Gauge Scale: 10 to 40 (span = 30)
  const minBmi = 10;
  const maxBmi = 40;
  const span = maxBmi - minBmi;
  
  // Calculate angle (0 to 180 degrees)
  let angle = ((bmi - minBmi) / span) * 180;
  if (angle < 0) angle = 0;
  if (angle > 180) angle = 180;

  // Categories for ticks and colors (linearly mapped)
  const categories = [
    { name: "Under", min: 10, max: 18.5, color: "#3b82f6", icon: Info }, // blue
    { name: "Healthy", min: 18.5, max: 25, color: "#10b981", icon: CheckCircle2 }, // emerald
    { name: "Over", min: 25, max: 30, color: "#eab308", icon: Activity }, // yellow
    { name: "Obese I", min: 30, max: 35, color: "#f97316", icon: AlertTriangle }, // orange
    { name: "Obese II+", min: 35, max: 40, color: "#ef4444", icon: AlertCircle }, // red
  ];

  const currentCategory = categories.find(c => bmi >= c.min && bmi < c.max) || (bmi >= 40 ? categories[4] : categories[0]);
  const Icon = currentCategory.icon;

  const createArc = (min: number, max: number, radius: number, strokeWidth: number) => {
    // Clamp visual arcs to min/max
    const clampedMin = Math.max(minBmi, min);
    const clampedMax = Math.min(maxBmi, max);
    
    const startAngle = ((clampedMin - minBmi) / span) * 180;
    const endAngle = ((clampedMax - minBmi) / span) * 180;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = 150 - radius * Math.cos(startRad);
    const y1 = 150 - radius * Math.sin(startRad);
    const x2 = 150 - radius * Math.cos(endRad);
    const y2 = 150 - radius * Math.sin(endRad);
    
    // We add a tiny gap or just use standard arc. Since it's < 180 deg, large-arc flag is 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  };

  return (
    <div className="relative w-full max-w-[400px] mx-auto flex flex-col items-center">
      {/* Glow effect behind gauge */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: currentCategory.color }}
      />
      
      <svg viewBox="0 0 300 170" className="w-full h-auto drop-shadow-xl overflow-visible">
        {/* Background track */}
        <path d="M 30 150 A 120 120 0 0 1 270 150" fill="none" stroke="currentColor" strokeWidth="20" className="text-muted/20" strokeLinecap="round" />
        
        {/* Colored Segments */}
        {categories.map((cat, i) => (
          <path 
            key={i}
            d={createArc(cat.min, cat.max, 120, 20)} 
            fill="none" 
            stroke={cat.color} 
            strokeWidth="20" 
            opacity="0.8"
          />
        ))}

        {/* Ticks & Labels */}
        {[15, 18.5, 25, 30, 35, 40].map((tickBmi, i) => {
          const tickAngle = ((tickBmi - minBmi) / span) * 180;
          const tickRad = (tickAngle * Math.PI) / 180;
          const x1 = 150 - 105 * Math.cos(tickRad);
          const y1 = 150 - 105 * Math.sin(tickRad);
          const x2 = 150 - 135 * Math.cos(tickRad);
          const y2 = 150 - 135 * Math.sin(tickRad);
          
          const labelX = 150 - 148 * Math.cos(tickRad);
          const labelY = 150 - 148 * Math.sin(tickRad);
          
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30" />
              <text x={labelX} y={labelY} fill="currentColor" fontSize="10" fontWeight="600" textAnchor="middle" dominantBaseline="middle" className="text-muted-foreground">
                {tickBmi}
              </text>
            </g>
          );
        })}

        {/* Needle Group */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 60, damping: 15, mass: 1 }}
          style={{ originX: "150px", originY: "150px" }}
        >
          {/* Needle shadow */}
          <polygon points="146,150 154,150 150,40" fill="rgba(0,0,0,0.2)" transform="translate(2, 4)" />
          {/* Needle body */}
          <polygon points="147,150 153,150 150,30" fill="currentColor" className="text-foreground" />
          {/* Center pivot */}
          <circle cx="150" cy="150" r="8" fill="currentColor" className="text-foreground" />
          <circle cx="150" cy="150" r="3" fill="var(--background)" />
        </motion.g>
      </svg>
      
      <div className="text-center mt-[-10px] relative z-10 flex flex-col items-center">
        <div className="text-6xl font-black tabular-nums tracking-tighter drop-shadow-sm" style={{ color: currentCategory.color }}>
          {animatedBmi.toFixed(1)}
        </div>
        <div className="flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full bg-background/50 border backdrop-blur-sm shadow-sm">
          <Icon className="h-4 w-4" style={{ color: currentCategory.color }} />
          <span className="font-bold text-sm uppercase tracking-wider" style={{ color: currentCategory.color }}>
            {currentCategory.name}
          </span>
        </div>
      </div>
    </div>
  );
}
