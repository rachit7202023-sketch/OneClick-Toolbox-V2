import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function PercentageCalculator() {
  // Mode 1: What is X% of Y
  const [m1x, setM1x] = useState("");
  const [m1y, setM1y] = useState("");
  const res1 = (parseFloat(m1x) && parseFloat(m1y)) ? (parseFloat(m1x) / 100) * parseFloat(m1y) : null;

  // Mode 2: X is what % of Y
  const [m2x, setM2x] = useState("");
  const [m2y, setM2y] = useState("");
  const res2 = (parseFloat(m2x) && parseFloat(m2y)) ? (parseFloat(m2x) / parseFloat(m2y)) * 100 : null;

  // Mode 3: % Change from X to Y
  const [m3x, setM3x] = useState("");
  const [m3y, setM3y] = useState("");
  const res3 = (parseFloat(m3x) && parseFloat(m3y)) ? ((parseFloat(m3y) - parseFloat(m3x)) / parseFloat(m3x)) * 100 : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <CalcCard>
        <div className="flex flex-wrap items-center gap-4 text-xl">
          <span className="font-medium text-muted-foreground">What is</span>
          <Input className="w-24 h-12 text-center text-lg" value={m1x} onChange={e=>setM1x(e.target.value)} type="number" />
          <span className="font-medium text-muted-foreground">% of</span>
          <Input className="w-32 h-12 text-center text-lg" value={m1y} onChange={e=>setM1y(e.target.value)} type="number" />
          <span className="font-medium text-muted-foreground">?</span>
        </div>
        <Result value={res1} suffix="" />
      </CalcCard>

      <CalcCard>
        <div className="flex flex-wrap items-center gap-4 text-xl">
          <Input className="w-32 h-12 text-center text-lg" value={m2x} onChange={e=>setM2x(e.target.value)} type="number" />
          <span className="font-medium text-muted-foreground">is what % of</span>
          <Input className="w-32 h-12 text-center text-lg" value={m2y} onChange={e=>setM2y(e.target.value)} type="number" />
          <span className="font-medium text-muted-foreground">?</span>
        </div>
        <Result value={res2} suffix="%" />
      </CalcCard>

      <CalcCard>
        <div className="flex flex-wrap items-center gap-4 text-xl">
          <span className="font-medium text-muted-foreground">What is the % change from</span>
          <Input className="w-32 h-12 text-center text-lg" value={m3x} onChange={e=>setM3x(e.target.value)} type="number" />
          <span className="font-medium text-muted-foreground">to</span>
          <Input className="w-32 h-12 text-center text-lg" value={m3y} onChange={e=>setM3y(e.target.value)} type="number" />
          <span className="font-medium text-muted-foreground">?</span>
        </div>
        <Result 
          value={res3} 
          suffix="%" 
          prefix={res3 && res3 > 0 ? "Increase of " : res3 && res3 < 0 ? "Decrease of " : ""} 
          valueOverride={res3 ? Math.abs(res3) : null}
        />
      </CalcCard>
    </div>
  );
}

function CalcCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
      {children}
    </div>
  );
}

function Result({ value, suffix, prefix = "", valueOverride = null }: { value: number | null, suffix: string, prefix?: string, valueOverride?: number | null }) {
  const displayVal = valueOverride !== null ? valueOverride : value;
  
  if (value === null || isNaN(value)) {
    return <div className="text-2xl font-bold text-muted-foreground/30 px-6">-</div>;
  }
  
  return (
    <div className="bg-primary/10 text-primary px-6 py-3 rounded-xl border border-primary/20 whitespace-nowrap min-w-[150px] text-center">
      <div className="text-sm font-semibold opacity-80 mb-1">{prefix || 'Result'}</div>
      <div className="text-3xl font-black">
        {+displayVal!.toFixed(4)}{suffix}
      </div>
    </div>
  );
}
