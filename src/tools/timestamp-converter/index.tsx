import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [dateResult, setDateResult] = useState<{ formatted: string; relative: string; utc: string } | null>(null);
  const [datetimeInput, setDatetimeInput] = useState("");
  const [timestampResult, setTimestampResult] = useState<string | null>(null);

  // Set current timestamp on load
  useEffect(() => {
    const now = Math.floor(Date.now() / 1000).toString();
    setTimestamp(now);
    
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1);
    setDatetimeInput(localISOTime.slice(0, 19));
  }, []);

  // Update date when timestamp changes
  useEffect(() => {
    if (!timestamp) {
      setDateResult(null);
      return;
    }

    try {
      let ts = parseInt(timestamp);
      // Determine if seconds or milliseconds
      if (timestamp.length === 13) {
        // Milliseconds, do nothing
      } else if (timestamp.length === 10) {
        ts = ts * 1000; // Convert to milliseconds
      } else {
        setDateResult({ formatted: "Invalid timestamp format", relative: "", utc: "" });
        return;
      }

      const date = new Date(ts);
      if (isNaN(date.getTime())) {
        setDateResult({ formatted: "Invalid date", relative: "", utc: "" });
        return;
      }

      setDateResult({
        formatted: format(date, "PPPP p"),
        relative: formatDistanceToNow(date, { addSuffix: true }),
        utc: date.toUTCString()
      });
    } catch (e) {
      setDateResult({ formatted: "Error parsing timestamp", relative: "", utc: "" });
    }
  }, [timestamp]);

  // Update timestamp when date changes
  useEffect(() => {
    if (!datetimeInput) {
      setTimestampResult(null);
      return;
    }

    try {
      const date = new Date(datetimeInput);
      if (isNaN(date.getTime())) {
        setTimestampResult("Invalid date");
        return;
      }
      setTimestampResult(Math.floor(date.getTime() / 1000).toString());
    } catch (e) {
      setTimestampResult("Error parsing date");
    }
  }, [datetimeInput]);

  const setCurrentTime = () => {
    const now = Math.floor(Date.now() / 1000).toString();
    setTimestamp(now);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* TS to Date */}
      <div className="bg-card border rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Timestamp to Date</h2>
          <Button variant="outline" size="sm" onClick={setCurrentTime}>
            <Clock className="h-4 w-4 mr-2" />
            Current Time
          </Button>
        </div>
        
        <div>
          <Label className="mb-2 block">Unix Timestamp (Seconds or Milliseconds)</Label>
          <Input
            className="font-mono text-lg h-12"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="1678886400"
          />
        </div>

        {dateResult && (
          <div className="grid gap-4 pt-4 border-t">
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-1">Local Time</div>
              <div className="text-lg font-medium">{dateResult.formatted}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">UTC Time</div>
                <div className="font-mono text-sm">{dateResult.utc}</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-1">Relative</div>
                <div className="text-sm">{dateResult.relative}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date to TS */}
      <div className="bg-card border rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Date to Timestamp</h2>
        
        <div>
          <Label className="mb-2 block">Local Date & Time</Label>
          <Input
            type="datetime-local"
            className="text-lg h-12"
            value={datetimeInput}
            onChange={(e) => setDatetimeInput(e.target.value)}
          />
        </div>

        {timestampResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-1">Unix Timestamp (Seconds)</div>
              <div className="text-xl font-mono font-bold bg-muted px-4 py-2 rounded-md inline-block text-primary">
                {timestampResult}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-1">Milliseconds</div>
              <div className="text-xl font-mono bg-muted px-4 py-2 rounded-md inline-block">
                {timestampResult !== "Invalid date" && timestampResult !== "Error parsing date" 
                  ? timestampResult + "000" 
                  : "-"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
