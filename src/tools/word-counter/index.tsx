import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function WordCounter() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
  const readingTime = Math.ceil(words / 200);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Words" value={words} />
        <StatCard label="Characters" value={chars} />
        <StatCard label="Chars (no spaces)" value={charsNoSpaces} />
        <StatCard label="Sentences" value={sentences} />
        <StatCard label="Paragraphs" value={paragraphs} />
        <StatCard label="Reading Time" value={`${readingTime} min`} />
      </div>

      <Textarea
        placeholder="Type or paste your text here..."
        className="min-h-[300px] text-base resize-y"
        value={text}
        onChange={(e) => setText(e.target.value)}
        data-testid="input-word-counter"
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
      <span className="text-3xl font-bold text-primary mb-1">{value}</span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}
