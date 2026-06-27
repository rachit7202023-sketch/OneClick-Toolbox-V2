import { Type, Braces, Link as LinkIcon, Hash, Fingerprint, CalendarClock, Shield, QrCode, Dices, Shuffle, Coins, FileJson, Image as ImageIcon, FileImage, Palette, Droplet, Brush, Calculator, Percent, Landmark, Activity, AlignLeft, ArrowDownUp, Minimize, SplitSquareHorizontal, Layers, Copy, FileText, FileCode2 } from "lucide-react";

export type Tool = {
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  icon: any;
  slug: string;
};

export const tools: Tool[] = [
  {
    id: "1",
    name: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs in real-time.",
    category: "text",
    keywords: ["word", "character", "count", "text", "length", "reading time"],
    icon: Type,
    slug: "word-counter"
  },
  {
    id: "2",
    name: "Character Counter",
    description: "Count characters with or without spaces, lines, and words.",
    category: "text",
    keywords: ["character", "count", "text", "length", "spaces"],
    icon: Braces,
    slug: "character-counter"
  },
  {
    id: "3",
    name: "Case Converter",
    description: "Convert text to UPPERCASE, lowercase, camelCase, PascalCase, and more.",
    category: "text",
    keywords: ["case", "convert", "uppercase", "lowercase", "camelcase", "snakecase"],
    icon: ArrowDownUp,
    slug: "case-converter"
  },
  {
    id: "4",
    name: "Text Repeater",
    description: "Repeat any text multiple times with custom separators.",
    category: "text",
    keywords: ["repeat", "text", "multiply", "loop", "generator"],
    icon: Copy,
    slug: "text-repeater"
  },
  {
    id: "5",
    name: "Text Reverser",
    description: "Reverse characters, words, or lines in any text.",
    category: "text",
    keywords: ["reverse", "flip", "backwards", "text", "characters"],
    icon: ArrowDownUp,
    slug: "text-reverser"
  },
  {
    id: "6",
    name: "Remove Duplicate Lines",
    description: "Easily clean up lists by removing duplicate lines from your text.",
    category: "text",
    keywords: ["duplicate", "remove", "clean", "lines", "unique", "list"],
    icon: Layers,
    slug: "remove-duplicate-lines"
  },
  {
    id: "7",
    name: "Sort Lines",
    description: "Sort text lines alphabetically, by length, or randomize them.",
    category: "text",
    keywords: ["sort", "alphabetical", "order", "lines", "randomize"],
    icon: AlignLeft,
    slug: "sort-lines"
  },
  {
    id: "8",
    name: "Lorem Ipsum Generator",
    description: "Generate random placeholder text for your designs and layouts.",
    category: "text",
    keywords: ["lorem", "ipsum", "placeholder", "text", "generator", "dummy"],
    icon: FileText,
    slug: "lorem-ipsum-generator"
  },
  {
    id: "9",
    name: "Markdown Preview",
    description: "Write and preview Markdown with live HTML rendering.",
    category: "text",
    keywords: ["markdown", "preview", "editor", "html", "render", "text"],
    icon: SplitSquareHorizontal,
    slug: "markdown-preview"
  },
  {
    id: "10",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON data instantly.",
    category: "developer",
    keywords: ["json", "format", "validate", "minify", "beautify", "developer"],
    icon: FileJson,
    slug: "json-formatter"
  },
  {
    id: "11",
    name: "Base64 Encoder/Decoder",
    description: "Encode text to Base64 or decode Base64 back to text.",
    category: "developer",
    keywords: ["base64", "encode", "decode", "convert", "developer"],
    icon: FileCode2,
    slug: "base64"
  },
  {
    id: "12",
    name: "URL Encoder/Decoder",
    description: "Safely encode or decode URLs and URI components.",
    category: "developer",
    keywords: ["url", "encode", "decode", "uri", "web", "link"],
    icon: LinkIcon,
    slug: "url-encoder"
  },
  {
    id: "13",
    name: "UUID Generator",
    description: "Generate secure, random UUIDs (version 4) instantly.",
    category: "developer",
    keywords: ["uuid", "guid", "generator", "random", "unique", "id"],
    icon: Fingerprint,
    slug: "uuid-generator"
  },
  {
    id: "14",
    name: "Regex Tester",
    description: "Test and debug regular expressions with live highlighting.",
    category: "developer",
    keywords: ["regex", "regular expression", "test", "match", "developer"],
    icon: Hash,
    slug: "regex-tester"
  },
  {
    id: "15",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps to readable dates and vice versa.",
    category: "developer",
    keywords: ["timestamp", "unix", "epoch", "time", "date", "converter"],
    icon: CalendarClock,
    slug: "timestamp-converter"
  },
  {
    id: "16",
    name: "Password Generator",
    description: "Create secure, random passwords with custom parameters.",
    category: "generators",
    keywords: ["password", "secure", "generator", "random", "security"],
    icon: Shield,
    slug: "password-generator"
  },
  {
    id: "17",
    name: "QR Code Generator",
    description: "Create scannable QR codes for text, URLs, and more.",
    category: "generators",
    keywords: ["qr", "code", "generator", "scan", "barcode", "link"],
    icon: QrCode,
    slug: "qr-code-generator"
  },
  {
    id: "18",
    name: "Random Number Generator",
    description: "Generate random numbers within a specific range.",
    category: "generators",
    keywords: ["random", "number", "generator", "rng", "chance"],
    icon: Shuffle,
    slug: "random-number"
  },
  {
    id: "19",
    name: "Coin Flip",
    description: "Simulate flipping a coin for heads or tails.",
    category: "generators",
    keywords: ["coin", "flip", "heads", "tails", "random", "chance"],
    icon: Coins,
    slug: "coin-flip"
  },
  {
    id: "20",
    name: "Dice Roller",
    description: "Roll virtual dice for tabletop games and probability.",
    category: "generators",
    keywords: ["dice", "roll", "d20", "dnd", "random", "generator"],
    icon: Dices,
    slug: "dice-roller"
  },
  {
    id: "21",
    name: "Image Compressor",
    description: "Compress images directly in your browser without quality loss.",
    category: "image",
    keywords: ["image", "compress", "optimize", "reduce", "size", "photo"],
    icon: Minimize,
    slug: "image-compressor"
  },
  {
    id: "22",
    name: "Image Converter",
    description: "Convert images between PNG, JPEG, and WebP formats.",
    category: "image",
    keywords: ["image", "convert", "format", "png", "jpeg", "webp"],
    icon: FileImage,
    slug: "image-converter"
  },
  {
    id: "23",
    name: "Color Picker",
    description: "Extract colors, convert formats, and find the perfect shade.",
    category: "color",
    keywords: ["color", "picker", "hex", "rgb", "hsl", "design"],
    icon: Palette,
    slug: "color-picker"
  },
  {
    id: "24",
    name: "HEX to RGB Converter",
    description: "Quickly convert color values between HEX, RGB, and HSL.",
    category: "color",
    keywords: ["color", "converter", "hex", "rgb", "hsl", "translate"],
    icon: Droplet,
    slug: "hex-rgb-converter"
  },
  {
    id: "25",
    name: "Gradient Generator",
    description: "Create beautiful CSS gradients and copy the code instantly.",
    category: "color",
    keywords: ["gradient", "color", "css", "generator", "design", "background"],
    icon: Brush,
    slug: "gradient-generator"
  },
  {
    id: "26",
    name: "Age Calculator",
    description: "Calculate exact age in years, months, and days.",
    category: "calculators",
    keywords: ["age", "calculator", "birthday", "date", "time", "years"],
    icon: CalendarClock,
    slug: "age-calculator"
  },
  {
    id: "27",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index (BMI) for adults.",
    category: "calculators",
    keywords: ["bmi", "calculator", "health", "weight", "height", "fitness"],
    icon: Activity,
    slug: "bmi-calculator"
  },
  {
    id: "28",
    name: "Percentage Calculator",
    description: "Easily calculate percentages, increases, and decreases.",
    category: "calculators",
    keywords: ["percentage", "percent", "calculator", "math", "fraction"],
    icon: Percent,
    slug: "percentage-calculator"
  },
  {
    id: "29",
    name: "EMI Calculator",
    description: "Calculate Equated Monthly Installments for loans.",
    category: "calculators",
    keywords: ["emi", "loan", "calculator", "finance", "interest", "monthly"],
    icon: Landmark,
    slug: "emi-calculator"
  },
  {
    id: "30",
    name: "GST Calculator",
    description: "Calculate Goods and Services Tax (inclusive or exclusive).",
    category: "calculators",
    keywords: ["gst", "tax", "calculator", "finance", "business", "percentage"],
    icon: Calculator,
    slug: "gst-calculator"
  },
  {
    id: "31",
    name: "URL Shortener",
    description: "Shorten long URLs into clean, manageable links.",
    category: "utilities",
    keywords: ["url", "shortener", "link", "tiny", "minify"],
    icon: LinkIcon,
    slug: "url-shortener"
  }
];
