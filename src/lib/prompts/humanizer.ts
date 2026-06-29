export type HumanizerSettings = {
  humanizationLevel: "Light" | "Balanced" | "Aggressive";
  tone: "Natural" | "Professional" | "Casual" | "Academic";
  creativity: number; // 0 to 100
  preserveFormatting: boolean;
  preserveBullets: boolean;
  preserveTechTerms: boolean;
};

export function buildHumanizerPrompt(settings: HumanizerSettings): string {
  const {
    humanizationLevel,
    tone,
    creativity,
    preserveFormatting,
    preserveBullets,
    preserveTechTerms,
  } = settings;

  let prompt = `You are an expert AI text humanizer and copywriter. Your goal is to rewrite the user's text to make it sound completely natural and human, removing any robotic or AI-like phrasing.\n\n`;

  prompt += `### INSTRUCTIONS\n`;
  
  if (humanizationLevel === "Light") {
    prompt += `- Make minor adjustments to phrasing and flow. Keep the original structure mostly intact.\n`;
  } else if (humanizationLevel === "Balanced") {
    prompt += `- Rewrite sentences to improve flow and naturalness while retaining the core meaning and structure.\n`;
  } else if (humanizationLevel === "Aggressive") {
    prompt += `- Completely overhaul the text to ensure it sounds 100% human. Restructure sentences, change vocabulary, and add natural transitions.\n`;
  }

  prompt += `- Target Tone: **${tone}**. Ensure the vocabulary and rhythm match this tone perfectly.\n`;
  
  // Map creativity (0-100) to a conceptual instruction
  if (creativity > 70) {
    prompt += `- Feel free to use creative analogies and vivid language where appropriate.\n`;
  } else if (creativity < 30) {
    prompt += `- Stick strictly to the facts and be direct without adding unnecessary flourish.\n`;
  }

  prompt += `\n### CONSTRAINTS\n`;
  prompt += `- NEVER invent new facts, statistics, or information that is not present in the original text.\n`;
  prompt += `- Do NOT add introductory or concluding remarks like "Here is the rewritten text:" or "Let me know if you need changes." Just output the raw rewritten text.\n`;

  if (preserveFormatting) {
    prompt += `- Strictly preserve the original Markdown formatting (bold, italics, headings, paragraphs).\n`;
  }
  
  if (preserveBullets) {
    prompt += `- Do not convert bulleted lists into paragraphs, and do not convert paragraphs into lists. Keep lists exactly as they are.\n`;
  }
  
  if (preserveTechTerms) {
    prompt += `- Preserve all technical terminology, jargon, proper nouns, and acronyms exactly as they appear in the original text.\n`;
  }

  return prompt;
}
