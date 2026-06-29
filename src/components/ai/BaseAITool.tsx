import React, { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Download, Trash2, RefreshCw, StopCircle, History, X, Clock, Type, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export interface AIGeneration {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  duration: number;
  settings: Record<string, any>;
}

export interface BaseAIToolProps<TSettings extends Record<string, any> = any> {
  toolName: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  
  inputPlaceholder?: string;
  
  // State
  input: string;
  setInput: (value: string) => void;
  settings: TSettings;
  
  // Actions
  onGenerate: (input: string, settings: TSettings, signal: AbortSignal) => Promise<string>;
  
  // Custom Renderers (optional)
  renderInput?: (props: { input: string, setInput: (v: string) => void, onGenerate: () => void, isGenerating: boolean }) => React.ReactNode;
  renderSettings?: (props: { isGenerating: boolean }) => React.ReactNode;
  renderOutput?: (props: { output: string, isGenerating: boolean, error: string | null }) => React.ReactNode;
}

const MAX_HISTORY = 20;

export function BaseAITool<TSettings extends Record<string, any> = any>({
  toolName,
  title,
  subtitle,
  description,
  icon,
  inputPlaceholder = "Enter your text here...",
  input,
  setInput,
  settings,
  onGenerate,
  renderInput,
  renderSettings,
  renderOutput,
}: BaseAIToolProps<TSettings>) {
  const { toast } = useToast();
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AIGeneration[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`ai_history_${toolName}`);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, [toolName]);

  // Save history
  const saveHistory = (generation: AIGeneration) => {
    setHistory((prev) => {
      const updated = [generation, ...prev].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(`ai_history_${toolName}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Analytics (localStorage for now)
  const logAnalytics = (duration: number, inLen: number, outLen: number) => {
    try {
      const stored = JSON.parse(localStorage.getItem('ai_analytics') || '[]');
      stored.push({
        tool: toolName,
        timestamp: Date.now(),
        duration,
        inputLength: inLen,
        outputLength: outLen
      });
      localStorage.setItem('ai_analytics', JSON.stringify(stored));
    } catch (e) {}
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({ title: "Input is empty", description: "Please enter some text.", variant: "destructive" });
      return;
    }

    if (isGenerating && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    setError(null);
    abortControllerRef.current = new AbortController();
    const startTime = performance.now();

    try {
      const result = await onGenerate(input, settings, abortControllerRef.current.signal);
      
      const duration = performance.now() - startTime;
      setOutput(result);
      
      // Save history & analytics
      saveHistory({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        input,
        output: result,
        duration,
        settings
      });
      
      logAnalytics(duration, input.length, result.length);
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast({ title: "Generation Stopped" });
      } else {
        setError(err.message || "Failed to generate text.");
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast({ title: "Copied to clipboard!" });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadHistoryItem = (item: AIGeneration) => {
    setInput(item.input);
    setOutput(item.output);
    toast({ title: "History item loaded" });
  };

  // Keyboard shortcut (Cmd/Ctrl + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, settings, isGenerating]);

  // Input Stats
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const chars = input.length;
  const readingTime = Math.ceil(words / 200);

  return (
    <div className="flex flex-col gap-6 lg:flex-row w-full max-w-7xl mx-auto">
      {/* Left Column: Settings & Input */}
      <div className="flex flex-col gap-6 w-full lg:w-1/2">
        {/* Settings Panel */}
        {renderSettings && (
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Configuration</h3>
            {renderSettings({ isGenerating })}
          </div>
        )}

        {/* Input Panel */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Input</h3>
            <div className="flex gap-2">
              <Badge variant="secondary" className="font-normal gap-1">
                <Type className="w-3 h-3" /> {words} words
              </Badge>
              <Badge variant="secondary" className="font-normal gap-1">
                <Hash className="w-3 h-3" /> {chars} chars
              </Badge>
              <Badge variant="secondary" className="font-normal gap-1">
                <Clock className="w-3 h-3" /> {readingTime}m read
              </Badge>
            </div>
          </div>
          
          {renderInput ? (
            renderInput({ input, setInput, onGenerate: handleGenerate, isGenerating })
          ) : (
            <Textarea
              className="flex-1 min-h-[300px] resize-y text-base p-4"
              placeholder={inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isGenerating}
            />
          )}

          <div className="mt-4 flex justify-between items-center">
            <Button variant="ghost" onClick={handleClear} disabled={isGenerating}>
              <Trash2 className="w-4 h-4 mr-2" /> Clear
            </Button>
            
            <div className="text-xs text-muted-foreground mr-4 hidden sm:block">
              Cmd/Ctrl + Enter to generate
            </div>

            {isGenerating ? (
              <Button onClick={handleStop} variant="destructive">
                <StopCircle className="w-4 h-4 mr-2" /> Stop Generation
              </Button>
            ) : (
              <Button onClick={handleGenerate} className="px-8">
                Generate <Wand2Icon className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Output & History */}
      <div className="flex flex-col w-full lg:w-1/2">
        <Tabs defaultValue="output" className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="output">Result</TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" /> History
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={handleCopy} disabled={!output || isGenerating}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={handleDownload} disabled={!output || isGenerating}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="output" className="flex-1 m-0 h-full">
            <div className="bg-card border rounded-2xl p-6 shadow-sm h-full min-h-[400px] flex flex-col relative overflow-hidden">
              {isGenerating ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
                      <span className="text-sm font-medium text-primary">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="flex-1 flex items-center justify-center text-center p-6 text-destructive">
                  <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                    <p className="font-medium">{error}</p>
                    <Button variant="outline" onClick={handleGenerate} className="mt-4 border-destructive/30 hover:bg-destructive hover:text-destructive-foreground">
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : output ? (
                renderOutput ? (
                  renderOutput({ output, isGenerating, error })
                ) : (
                  <Textarea 
                    className="flex-1 min-h-[350px] resize-none border-none shadow-none focus-visible:ring-0 p-0 text-base"
                    readOnly
                    value={output}
                  />
                )
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p>Your generated content will appear here.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="m-0">
            <div className="bg-card border rounded-2xl p-6 shadow-sm h-[400px] overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">No history available for this tool.</p>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="p-4 border rounded-xl hover:bg-accent cursor-pointer transition-colors" onClick={() => loadHistoryItem(item)}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{item.duration.toFixed(0)}ms</span>
                      </div>
                      <p className="text-sm line-clamp-2">{item.input}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Wand2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/>
      <path d="m14 7 3 3"/>
      <path d="M5 6v4"/>
      <path d="M19 14v4"/>
      <path d="M10 2v2"/>
      <path d="M7 8H3"/>
      <path d="M21 16h-4"/>
      <path d="M11 3H9"/>
    </svg>
  )
}
