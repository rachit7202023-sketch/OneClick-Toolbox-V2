import {
  Wand2, Type, Image as ImageIcon, Video, Music, FileText, Code, DollarSign, Calculator, GraduationCap,
  CheckCircle, Hash, Briefcase, Wrench, Palette, PaintBucket, Search, Zap, RefreshCw, BookOpen, Heart, Shuffle
} from "lucide-react";

export type Category = {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
  toolCount: number;
};

export const categories: Category[] = [
  { id: "ai", name: "AI Tools", icon: Wand2, description: "Artificial intelligence utilities", color: "text-purple-500", toolCount: 0 },
  { id: "text", name: "Text Tools", icon: Type, description: "Format, convert, and manipulate text", color: "text-blue-500", toolCount: 9 },
  { id: "image", name: "Image Tools", icon: ImageIcon, description: "Compress, convert, and edit images", color: "text-pink-500", toolCount: 2 },
  { id: "video", name: "Video Tools", icon: Video, description: "Video processing and editing", color: "text-red-500", toolCount: 0 },
  { id: "audio", name: "Audio Tools", icon: Music, description: "Audio editing and conversion", color: "text-yellow-500", toolCount: 0 },
  { id: "pdf", name: "PDF Tools", icon: FileText, description: "Merge, split, and edit PDFs", color: "text-orange-500", toolCount: 0 },
  { id: "developer", name: "Developer Tools", icon: Code, description: "Formatters, validators, and generators", color: "text-emerald-500", toolCount: 6 },
  { id: "finance", name: "Finance Tools", icon: DollarSign, description: "Financial calculators and trackers", color: "text-green-600", toolCount: 0 },
  { id: "calculators", name: "Calculators", icon: Calculator, description: "Math, health, and finance calculators", color: "text-indigo-500", toolCount: 5 },
  { id: "students", name: "Students", icon: GraduationCap, description: "Tools for studying and research", color: "text-cyan-500", toolCount: 0 },
  { id: "productivity", name: "Productivity", icon: CheckCircle, description: "Time management and organization", color: "text-teal-500", toolCount: 0 },
  { id: "social-media", name: "Social Media", icon: Hash, description: "Generators and formatting for social", color: "text-sky-500", toolCount: 0 },
  { id: "business", name: "Business", icon: Briefcase, description: "Tools for entrepreneurs and startups", color: "text-blue-600", toolCount: 0 },
  { id: "utilities", name: "Utilities", icon: Wrench, description: "Everyday handy web utilities", color: "text-gray-500", toolCount: 1 },
  { id: "design", name: "Design Tools", icon: Palette, description: "Utilities for UI/UX designers", color: "text-fuchsia-500", toolCount: 0 },
  { id: "color", name: "Color Tools", icon: PaintBucket, description: "Pickers, converters, and palettes", color: "text-rose-500", toolCount: 3 },
  { id: "seo", name: "SEO Tools", icon: Search, description: "Search engine optimization helpers", color: "text-lime-500", toolCount: 0 },
  { id: "generators", name: "Generators", icon: Zap, description: "Generate passwords, UUIDs, and more", color: "text-amber-500", toolCount: 5 },
  { id: "converters", name: "Converters", icon: RefreshCw, description: "Convert between various formats", color: "text-violet-500", toolCount: 0 },
  { id: "education", name: "Education", icon: BookOpen, description: "Learning and teaching resources", color: "text-indigo-400", toolCount: 0 },
  { id: "health", name: "Health", icon: Heart, description: "Fitness and health calculators", color: "text-red-400", toolCount: 0 },
  { id: "random", name: "Random", icon: Shuffle, description: "Randomizers and fun tools", color: "text-orange-400", toolCount: 0 },
];
