import React, { useEffect, useRef, useCallback } from "react";
import { trackToolUsed } from "@/lib/analytics";

interface ToolAnalyticsWrapperProps {
  toolName: string;
  category: string;
  children: React.ReactNode;
}

export function ToolAnalyticsWrapper({ toolName, category, children }: ToolAnalyticsWrapperProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasFiredRef = useRef(false);

  // Reset the flag if the tool completely changes
  useEffect(() => {
    hasFiredRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [toolName]);

  const handleInteraction = useCallback((e: React.SyntheticEvent) => {
    const target = e.target as HTMLElement;

    // Check for clear events (e.g. user completely deleting input to start fresh)
    if ((e.type === "input" || e.type === "change" || e.type === "keyup") && 
        (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
      if (!target.value.trim()) {
        hasFiredRef.current = false; // Reset to allow another fire in the same session
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        return;
      }
      // Require some meaningful length for text inputs to trigger the event
      if (target.value.trim().length < 3) return;
    }

    // Ignore clicks on simple wrappers or layout if it's not a button or input
    // But since it's hard to distinguish perfectly, we rely on the debounce + the fact that
    // meaningful tools have buttons/inputs.
    // To be safe, we allow clicks on buttons, labels, svg (icons), inputs, selects
    const isMeaningfulClick = 
      e.type === "click" && 
      (target.closest("button") || 
       target.closest("input") || 
       target.closest("label") || 
       target.closest("select") || 
       target.closest("[role='button']") ||
       target.closest("[role='switch']") ||
       target.closest("[role='slider']"));

    const isMeaningfulInput = e.type === "input" || e.type === "change" || e.type === "keyup";

    if (!isMeaningfulClick && !isMeaningfulInput) return;

    if (hasFiredRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 2500ms debounce ensures they've actually completed their task (e.g. finished typing or clicking "Generate")
    timeoutRef.current = setTimeout(() => {
      if (!hasFiredRef.current) {
        trackToolUsed(toolName, category);
        hasFiredRef.current = true;
      }
    }, 2500);

  }, [toolName, category]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
      onClickCapture={handleInteraction}
      onInputCapture={handleInteraction}
      onChangeCapture={handleInteraction}
      onKeyUpCapture={handleInteraction}
      className="contents" // Use contents to avoid layout interference
    >
      {children}
    </div>
  );
}
