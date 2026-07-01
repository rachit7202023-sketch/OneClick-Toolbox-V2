export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
};

export const trackToolUsed = (toolName: string, category: string) => {
  trackEvent("tool_used", {
    tool_name: toolName,
    category: category,
  });
};
