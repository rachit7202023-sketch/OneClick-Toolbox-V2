import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function GstCalculator() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [type, setType] = useState("exclusive");

  const [gstAmount, setGstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [baseAmount, setBaseAmount] = useState(0);

  useEffect(() => {
    const a = parseFloat(amount);
    const r = parseFloat(rate);

    if (a > 0 && r > 0) {
      if (type === "exclusive") {
        // Amount is base, add GST
        const gst = (a * r) / 100;
        setBaseAmount(a);
        setGstAmount(gst);
        setTotalAmount(a + gst);
      } else {
        // Amount includes GST, extract it
        const base = a / (1 + (r / 100));
        const gst = a - base;
        setBaseAmount(base);
        setGstAmount(gst);
        setTotalAmount(a);
      }
    } else {
      setBaseAmount(0);
      setGstAmount(0);
      setTotalAmount(0);
    }
  }, [amount, rate, type]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-card border rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
        
        <div className="space-y-4">
          <Label className="text-base font-semibold">Tax Type</Label>
          <RadioGroup defaultValue="exclusive" value={type} onValueChange={setType} className="flex gap-4">
            <div className="flex items-center space-x-2 border rounded-lg p-4 flex-1 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="exclusive" id="exclusive" />
              <Label htmlFor="exclusive" className="cursor-pointer font-medium">Add GST (Exclusive)</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4 flex-1 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="inclusive" id="inclusive" />
              <Label htmlFor="inclusive" className="cursor-pointer font-medium">Remove GST (Inclusive)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Amount</Label>
          <div className="relative">
            <Input 
              type="number" 
              className="pl-4 h-14 text-lg" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="text-base font-semibold">GST Rate (%)</Label>
          <Select value={rate} onValueChange={setRate}>
            <SelectTrigger className="h-14 text-lg">
              <SelectValue placeholder="Select rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5%</SelectItem>
              <SelectItem value="12">12%</SelectItem>
              <SelectItem value="18">18%</SelectItem>
              <SelectItem value="28">28%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col justify-center space-y-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
            <div className="text-muted-foreground font-medium">Base Amount</div>
            <div className="text-xl font-bold tabular-nums">{formatCurrency(baseAmount)}</div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-primary/5 text-primary rounded-xl border border-primary/20">
            <div>
              <div className="font-bold">Total GST</div>
              <div className="text-xs opacity-80">(CGST: {formatCurrency(gstAmount/2)} + SGST: {formatCurrency(gstAmount/2)})</div>
            </div>
            <div className="text-2xl font-black tabular-nums">+{formatCurrency(gstAmount)}</div>
          </div>
          
          <div className="h-px bg-border w-full" />
          
          <div className="flex justify-between items-center pt-2">
            <div className="text-foreground font-bold text-lg">Total Amount</div>
            <div className="text-4xl font-black tabular-nums text-foreground">{formatCurrency(totalAmount)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
