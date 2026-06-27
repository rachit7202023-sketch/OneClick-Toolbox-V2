import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("5");

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(years) * 12;

    if (p > 0 && r > 0 && n > 0) {
      const calcEmi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmt = calcEmi * n;
      const totalInt = totalAmt - p;
      
      setEmi(calcEmi);
      setTotalAmount(totalAmt);
      setTotalInterest(totalInt);
    } else {
      setEmi(0);
      setTotalAmount(0);
      setTotalInterest(0);
    }
  }, [principal, rate, years]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-card border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Loan Amount (Principal)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="number" 
              className="pl-10 h-14 text-lg" 
              value={principal} 
              onChange={(e) => setPrincipal(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="text-base font-semibold">Interest Rate (% per year)</Label>
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
            <Input 
              type="number" 
              className="pr-10 h-14 text-lg" 
              value={rate} 
              onChange={(e) => setRate(e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Loan Tenure (Years)</Label>
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Years</span>
            <Input 
              type="number" 
              className="pr-16 h-14 text-lg" 
              value={years} 
              onChange={(e) => setYears(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-lg flex flex-col justify-center space-y-8">
        <div>
          <div className="text-primary-foreground/70 font-medium uppercase tracking-wider text-sm mb-2">Monthly EMI</div>
          <div className="text-5xl font-black tabular-nums">{emi > 0 ? formatCurrency(emi) : "$0.00"}</div>
        </div>
        
        <div className="h-px bg-primary-foreground/20 w-full" />
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-primary-foreground/70 font-medium">Principal Amount</div>
            <div className="text-xl font-bold tabular-nums">{parseFloat(principal) > 0 ? formatCurrency(parseFloat(principal)) : "$0.00"}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-primary-foreground/70 font-medium">Total Interest</div>
            <div className="text-xl font-bold tabular-nums">{totalInterest > 0 ? formatCurrency(totalInterest) : "$0.00"}</div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="text-primary-foreground/90 font-bold">Total Amount Payable</div>
            <div className="text-2xl font-black tabular-nums">{totalAmount > 0 ? formatCurrency(totalAmount) : "$0.00"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
