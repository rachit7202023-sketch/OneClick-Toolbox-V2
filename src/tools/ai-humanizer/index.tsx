import { useState } from "react";
import { BaseAITool } from "@/components/ai/BaseAITool";
import { generateText } from "@/services/aiService";
import { buildHumanizerPrompt, HumanizerSettings } from "@/lib/prompts/humanizer";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function AIHumanizer() {
  const [input, setInput] = useState("");
  const [settings, setSettings] = useState<HumanizerSettings>({
    humanizationLevel: "Balanced",
    tone: "Natural",
    creativity: 50,
    preserveFormatting: true,
    preserveBullets: true,
    preserveTechTerms: true,
  });

  const handleGenerate = async (text: string, currentSettings: HumanizerSettings, signal: AbortSignal) => {
    const systemPrompt = buildHumanizerPrompt(currentSettings);
    
    const response = await generateText({
      prompt: text,
      systemPrompt,
      temperature: currentSettings.creativity / 100,
      signal,
    });
    
    return response.text;
  };

  return (
    <BaseAITool<HumanizerSettings>
      toolName="AI Humanizer"
      title="AI Text Humanizer"
      inputPlaceholder="Paste your robotic or AI-generated text here..."
      input={input}
      setInput={setInput}
      settings={settings}
      onGenerate={handleGenerate}
      renderSettings={({ isGenerating }) => (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Humanization Level</Label>
            <Select 
              disabled={isGenerating}
              value={settings.humanizationLevel} 
              onValueChange={(val: any) => setSettings({ ...settings, humanizationLevel: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Light">Light (Minor tweaks)</SelectItem>
                <SelectItem value="Balanced">Balanced (Recommended)</SelectItem>
                <SelectItem value="Aggressive">Aggressive (Complete rewrite)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Tone</Label>
            <Select 
              disabled={isGenerating}
              value={settings.tone} 
              onValueChange={(val: any) => setSettings({ ...settings, tone: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Natural">Natural</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Creativity</Label>
              <span className="text-xs text-muted-foreground">{settings.creativity}%</span>
            </div>
            <Slider 
              disabled={isGenerating}
              value={[settings.creativity]} 
              onValueChange={([val]) => setSettings({ ...settings, creativity: val })}
              max={100} 
              step={1} 
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="format" className="cursor-pointer">Preserve Formatting</Label>
              <Switch 
                id="format"
                disabled={isGenerating}
                checked={settings.preserveFormatting} 
                onCheckedChange={(c) => setSettings({ ...settings, preserveFormatting: c })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="bullets" className="cursor-pointer">Preserve Bullet Points</Label>
              <Switch 
                id="bullets"
                disabled={isGenerating}
                checked={settings.preserveBullets} 
                onCheckedChange={(c) => setSettings({ ...settings, preserveBullets: c })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="tech" className="cursor-pointer">Preserve Technical Terms</Label>
              <Switch 
                id="tech"
                disabled={isGenerating}
                checked={settings.preserveTechTerms} 
                onCheckedChange={(c) => setSettings({ ...settings, preserveTechTerms: c })}
              />
            </div>
          </div>
        </div>
      )}
    />
  );
}
