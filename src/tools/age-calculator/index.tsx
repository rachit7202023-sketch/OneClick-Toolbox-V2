import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { differenceInYears, differenceInMonths, differenceInDays, addYears, format } from "date-fns";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);
  const [nextBirthday, setNextBirthday] = useState<{ date: string; daysLeft: number } | null>(null);

  useEffect(() => {
    if (!birthDate) {
      setResult(null);
      setNextBirthday(null);
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime()) || birth > today) {
      setResult(null);
      setNextBirthday(null);
      return;
    }

    const years = differenceInYears(today, birth);
    const dateAfterYears = addYears(birth, years);
    const months = differenceInMonths(today, dateAfterYears);
    const dateAfterMonths = new Date(dateAfterYears);
    dateAfterMonths.setMonth(dateAfterMonths.getMonth() + months);
    const days = differenceInDays(today, dateAfterMonths);

    setResult({ years, months, days });

    // Next birthday calculation
    let nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today && nextBday.toDateString() !== today.toDateString()) {
      nextBday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    
    const daysLeft = differenceInDays(nextBday, today);
    setNextBirthday({
      date: format(nextBday, "MMMM do, yyyy"),
      daysLeft
    });
  }, [birthDate]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-card border rounded-2xl p-6 sm:p-10 shadow-sm space-y-10">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <Label htmlFor="dob" className="text-lg font-semibold">Enter your Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            className="h-14 text-xl text-center"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {result ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 sm:p-6">
                <div className="text-4xl sm:text-5xl font-black text-primary mb-2">{result.years}</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Years</div>
              </div>
              <div className="bg-muted border rounded-xl p-4 sm:p-6">
                <div className="text-4xl sm:text-5xl font-black text-foreground mb-2">{result.months}</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Months</div>
              </div>
              <div className="bg-muted border rounded-xl p-4 sm:p-6">
                <div className="text-4xl sm:text-5xl font-black text-foreground mb-2">{result.days}</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Days</div>
              </div>
            </div>

            {nextBirthday && (
              <div className="bg-card border rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
                <div>
                  <div className="text-sm text-muted-foreground font-medium mb-1">Next Birthday</div>
                  <div className="text-lg font-semibold">{nextBirthday.date}</div>
                </div>
                <div className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-bold">
                  {nextBirthday.daysLeft === 0 ? "It's today! 🎉" : `${nextBirthday.daysLeft} days left`}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
            Select a date above to see your exact age
          </div>
        )}
      </div>
    </div>
  );
}
