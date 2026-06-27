import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("([A-Z])\\w+");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("Hello World! This is a Test String.");
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      setError(null);

      if (!testString) {
        setMatches([]);
        return;
      }

      // If global flag is not set, matchAll will throw, so we handle it differently
      if (flags.includes('g')) {
        const matchesArray = Array.from(testString.matchAll(regex));
        setMatches(matchesArray);
      } else {
        const match = testString.match(regex);
        setMatches(match ? [match] : []);
      }
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  // Create highlighted HTML
  const getHighlightedText = () => {
    if (error || !pattern || matches.length === 0 || !testString) return testString;

    try {
      let result = testString;
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      
      // Need to be careful with escaping HTML
      const escapeHtml = (unsafe: string) => {
        return unsafe
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      };

      // Wrap matches in span, alternating colors
      let colorIndex = 0;
      const colors = ['bg-blue-500/30 dark:bg-blue-500/50', 'bg-emerald-500/30 dark:bg-emerald-500/50'];
      
      result = testString.replace(regex, (match) => {
        const color = colors[colorIndex % 2];
        colorIndex++;
        return `<mark class="${color} rounded-sm px-0.5 text-foreground">${escapeHtml(match)}</mark>`;
      });

      return <div dangerouslySetInnerHTML={{ __html: result }} className="whitespace-pre-wrap font-mono p-4" />;
    } catch (e) {
      return <div className="whitespace-pre-wrap font-mono p-4">{testString}</div>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_100px] gap-4">
        <div>
          <Label className="mb-2 block">Regular Expression</Label>
          <div className="flex items-center">
            <span className="bg-muted px-3 py-2.5 rounded-l-md border border-r-0 border-input text-muted-foreground font-mono text-lg">/</span>
            <Input
              className="rounded-none font-mono text-lg flex-1 h-auto py-2.5"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="pattern"
            />
            <span className="bg-muted px-3 py-2.5 border border-l-0 border-r-0 border-input text-muted-foreground font-mono text-lg">/</span>
          </div>
        </div>
        <div>
          <Label className="mb-2 block">Flags</Label>
          <Input
            className="rounded-l-none font-mono text-lg text-center h-auto py-2.5"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gmi"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-mono text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        <div className="flex flex-col">
          <Label className="mb-2 block">Test String</Label>
          <Textarea
            className="flex-1 resize-none font-mono text-base p-4"
            placeholder="Enter text to test your regex against..."
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col relative">
          <div className="flex items-center justify-between mb-2">
            <Label>Match Result</Label>
            {!error && pattern && testString && (
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'}
              </span>
            )}
          </div>
          <div className="flex-1 overflow-auto border rounded-md bg-muted/30">
            {getHighlightedText()}
          </div>
        </div>
      </div>

      {!error && matches.length > 0 && (
        <div className="border rounded-xl overflow-hidden bg-card">
          <div className="bg-muted px-4 py-2 border-b text-sm font-semibold text-muted-foreground">
            Match Groups
          </div>
          <div className="p-0 overflow-auto max-h-64">
            <table className="w-full text-left border-collapse font-mono text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-semibold">Match</th>
                  <th className="px-4 py-2 font-semibold">Value</th>
                  <th className="px-4 py-2 font-semibold">Groups</th>
                  <th className="px-4 py-2 font-semibold">Index</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {matches.map((match, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-2 whitespace-nowrap">#{i + 1}</td>
                    <td className="px-4 py-2"><span className="bg-accent px-1 py-0.5 rounded">{match[0]}</span></td>
                    <td className="px-4 py-2">
                      {match.length > 1 ? (
                        <div className="flex flex-col gap-1">
                          {Array.from(match).slice(1).map((group, gi) => (
                            group !== undefined ? (
                              <span key={gi} className="text-xs"><span className="text-muted-foreground mr-1">Group {gi+1}:</span> {group}</span>
                            ) : null
                          ))}
                        </div>
                      ) : <span className="text-muted-foreground italic text-xs">No groups</span>}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{match.index}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
