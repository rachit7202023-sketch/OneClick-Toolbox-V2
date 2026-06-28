import { Type, Braces, Link as LinkIcon, Hash, Fingerprint, CalendarClock, Shield, QrCode, Dices, Shuffle, Coins, FileJson, Image as ImageIcon, FileImage, Palette, Droplet, Brush, Calculator, Percent, Landmark, Activity, AlignLeft, ArrowDownUp, Minimize, SplitSquareHorizontal, Layers, Copy, FileText, FileCode2 } from "lucide-react";

export type Tool = {
  id: string;
  name: string;
  description: string;
  metaDescription: string;
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
    metaDescription: "Count words, characters, sentences, paragraphs, and reading time instantly. Paste any text and get a full real-time breakdown. Free, fast, and 100% private.",
    category: "text",
    keywords: ["word", "character", "count", "text", "length", "reading time"],
    icon: Type,
    slug: "word-counter"
  },
  {
    id: "2",
    name: "Character Counter",
    description: "Count characters with or without spaces, lines, and words.",
    metaDescription: "Count characters with or without spaces, total lines, and words in any text. Perfect for Twitter, SMS, forms, and any character-limited input field.",
    category: "text",
    keywords: ["character", "count", "text", "length", "spaces"],
    icon: Braces,
    slug: "character-counter"
  },
  {
    id: "3",
    name: "Case Converter",
    description: "Convert text to UPPERCASE, lowercase, camelCase, PascalCase, and more.",
    metaDescription: "Convert text to uppercase, lowercase, camelCase, PascalCase, snake_case, and title case instantly. Free online text case converter with one-click copy.",
    category: "text",
    keywords: ["case", "convert", "uppercase", "lowercase", "camelcase", "snakecase"],
    icon: ArrowDownUp,
    slug: "case-converter"
  },
  {
    id: "4",
    name: "Text Repeater",
    description: "Repeat any text multiple times with custom separators.",
    metaDescription: "Repeat any text or phrase a custom number of times with any separator you choose. Useful for generating test data, fill patterns, and repetitive content.",
    category: "text",
    keywords: ["repeat", "text", "multiply", "loop", "generator"],
    icon: Copy,
    slug: "text-repeater"
  },
  {
    id: "5",
    name: "Text Reverser",
    description: "Reverse characters, words, or lines in any text.",
    metaDescription: "Reverse any text by characters, words, or lines in one click. Great for creating backwards text, fun messages, anagrams, or debugging string problems.",
    category: "text",
    keywords: ["reverse", "flip", "backwards", "text", "characters"],
    icon: ArrowDownUp,
    slug: "text-reverser"
  },
  {
    id: "6",
    name: "Remove Duplicate Lines",
    description: "Easily clean up lists by removing duplicate lines from your text.",
    metaDescription: "Remove duplicate lines from any text or list instantly. Keeps only unique lines with options to sort and trim whitespace. Free online deduplication tool.",
    category: "text",
    keywords: ["duplicate", "remove", "clean", "lines", "unique", "list"],
    icon: Layers,
    slug: "remove-duplicate-lines"
  },
  {
    id: "7",
    name: "Sort Lines",
    description: "Sort text lines alphabetically, by length, or randomize them.",
    metaDescription: "Sort text lines alphabetically ascending or descending, by length, or randomize their order. Instantly organize any list or block of text for free.",
    category: "text",
    keywords: ["sort", "alphabetical", "order", "lines", "randomize"],
    icon: AlignLeft,
    slug: "sort-lines"
  },
  {
    id: "8",
    name: "Lorem Ipsum Generator",
    description: "Generate random placeholder text for your designs and layouts.",
    metaDescription: "Generate Lorem Ipsum placeholder text by words, sentences, or paragraphs. Perfect for UI mockups, wireframes, and design layouts. Copy with one click.",
    category: "text",
    keywords: ["lorem", "ipsum", "placeholder", "text", "generator", "dummy"],
    icon: FileText,
    slug: "lorem-ipsum-generator"
  },
  {
    id: "9",
    name: "Markdown Preview",
    description: "Write and preview Markdown with live HTML rendering.",
    metaDescription: "Write Markdown and see a live HTML preview side by side. Supports headings, bold, italic, lists, links, code blocks, tables, and all standard Markdown syntax.",
    category: "text",
    keywords: ["markdown", "preview", "editor", "html", "render", "text"],
    icon: SplitSquareHorizontal,
    slug: "markdown-preview"
  },
  {
    id: "10",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON data instantly.",
    metaDescription: "Format, validate, and minify JSON data instantly in your browser. Highlights syntax errors and makes deeply nested JSON easy to read and debug.",
    category: "developer",
    keywords: ["json", "format", "validate", "minify", "beautify", "developer"],
    icon: FileJson,
    slug: "json-formatter"
  },
  {
    id: "11",
    name: "Base64 Encoder/Decoder",
    description: "Encode text to Base64 or decode Base64 back to text.",
    metaDescription: "Encode plain text to Base64 or decode Base64 strings back to readable text in one click. Runs entirely in your browser — no data is sent to any server.",
    category: "developer",
    keywords: ["base64", "encode", "decode", "convert", "developer"],
    icon: FileCode2,
    slug: "base64"
  },
  {
    id: "12",
    name: "URL Encoder/Decoder",
    description: "Safely encode or decode URLs and URI components.",
    metaDescription: "Encode or decode URLs and URI components instantly. Converts special characters for safe use in links, query strings, and API requests. Free and private.",
    category: "developer",
    keywords: ["url", "encode", "decode", "uri", "web", "link"],
    icon: LinkIcon,
    slug: "url-encoder"
  },
  {
    id: "13",
    name: "UUID Generator",
    description: "Generate secure, random UUIDs (version 4) instantly.",
    metaDescription: "Generate cryptographically random UUID v4 identifiers instantly. Copy single or bulk UUIDs for use in databases, APIs, and software development projects.",
    category: "developer",
    keywords: ["uuid", "guid", "generator", "random", "unique", "id"],
    icon: Fingerprint,
    slug: "uuid-generator"
  },
  {
    id: "14",
    name: "Regex Tester",
    description: "Test and debug regular expressions with live highlighting.",
    metaDescription: "Test and debug regular expressions with live match highlighting. Supports global, multiline, and case-insensitive flags. Free online regex tester and validator.",
    category: "developer",
    keywords: ["regex", "regular expression", "test", "match", "developer"],
    icon: Hash,
    slug: "regex-tester"
  },
  {
    id: "15",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps to readable dates and vice versa.",
    metaDescription: "Convert Unix timestamps to human-readable dates and times, or any date back to a Unix epoch value. Supports both seconds and millisecond timestamps.",
    category: "developer",
    keywords: ["timestamp", "unix", "epoch", "time", "date", "converter"],
    icon: CalendarClock,
    slug: "timestamp-converter"
  },
  {
    id: "16",
    name: "Password Generator",
    description: "Create secure, random passwords with custom parameters.",
    metaDescription: "Generate strong, random passwords with custom length, uppercase, lowercase, numbers, and symbols. Secure password creation that runs entirely in your browser.",
    category: "generators",
    keywords: ["password", "secure", "generator", "random", "security"],
    icon: Shield,
    slug: "password-generator"
  },
  {
    id: "17",
    name: "QR Code Generator",
    description: "Create scannable QR codes for text, URLs, and more.",
    metaDescription: "Create scannable QR codes for URLs, text, contact info, and more. Download as PNG instantly. Free online QR code maker with no sign-up required.",
    category: "generators",
    keywords: ["qr", "code", "generator", "scan", "barcode", "link"],
    icon: QrCode,
    slug: "qr-code-generator"
  },
  {
    id: "18",
    name: "Random Number Generator",
    description: "Generate random numbers within a specific range.",
    metaDescription: "Generate one or multiple random numbers within any custom range. Set your min and max values for tailored results. Free online RNG for games and decisions.",
    category: "generators",
    keywords: ["random", "number", "generator", "rng", "chance"],
    icon: Shuffle,
    slug: "random-number"
  },
  {
    id: "19",
    name: "Coin Flip",
    description: "Simulate flipping a coin for heads or tails.",
    metaDescription: "Flip a virtual coin and get instant heads or tails results. Track your flip history and statistics in real time. Great for decisions and probability demos.",
    category: "generators",
    keywords: ["coin", "flip", "heads", "tails", "random", "chance"],
    icon: Coins,
    slug: "coin-flip"
  },
  {
    id: "20",
    name: "Dice Roller",
    description: "Roll virtual dice for tabletop games and probability.",
    metaDescription: "Roll one or more virtual dice including D4, D6, D8, D10, D12, and D20 sides. Perfect for tabletop RPGs, board games, and random number decisions.",
    category: "generators",
    keywords: ["dice", "roll", "d20", "dnd", "random", "generator"],
    icon: Dices,
    slug: "dice-roller"
  },
  {
    id: "21",
    name: "Image Compressor",
    description: "Compress images directly in your browser without quality loss.",
    metaDescription: "Compress JPEG, PNG, and WebP images directly in your browser with no upload needed. Reduce file size while maintaining visual quality. Free and private.",
    category: "image",
    keywords: ["image", "compress", "optimize", "reduce", "size", "photo"],
    icon: Minimize,
    slug: "image-compressor"
  },
  {
    id: "22",
    name: "Image Converter",
    description: "Convert images between PNG, JPEG, and WebP formats.",
    metaDescription: "Convert images between PNG, JPEG, and WebP formats instantly in your browser. No upload, no account needed — fully private client-side image conversion.",
    category: "image",
    keywords: ["image", "convert", "format", "png", "jpeg", "webp"],
    icon: FileImage,
    slug: "image-converter"
  },
  {
    id: "23",
    name: "Color Picker",
    description: "Extract colors, convert formats, and find the perfect shade.",
    metaDescription: "Pick, explore, and convert colors between HEX, RGB, and HSL formats. Browse color palettes and find the perfect shade for your designs and projects.",
    category: "color",
    keywords: ["color", "picker", "hex", "rgb", "hsl", "design"],
    icon: Palette,
    slug: "color-picker"
  },
  {
    id: "24",
    name: "HEX to RGB Converter",
    description: "Quickly convert color values between HEX, RGB, and HSL.",
    metaDescription: "Instantly convert color values between HEX, RGB, and HSL formats. Enter any color code and get all three representations at once. Free and fast.",
    category: "color",
    keywords: ["color", "converter", "hex", "rgb", "hsl", "translate"],
    icon: Droplet,
    slug: "hex-rgb-converter"
  },
  {
    id: "25",
    name: "Gradient Generator",
    description: "Create beautiful CSS gradients and copy the code instantly.",
    metaDescription: "Create beautiful linear and radial CSS gradients with a visual editor. Copy the ready-to-use CSS code instantly for your web design projects.",
    category: "color",
    keywords: ["gradient", "color", "css", "generator", "design", "background"],
    icon: Brush,
    slug: "gradient-generator"
  },
  {
    id: "26",
    name: "Age Calculator",
    description: "Calculate exact age in years, months, and days.",
    metaDescription: "Calculate your exact age in years, months, and days from your date of birth. Also find out how many days remain until your next birthday.",
    category: "calculators",
    keywords: ["age", "calculator", "birthday", "date", "time", "years"],
    icon: CalendarClock,
    slug: "age-calculator"
  },
  {
    id: "27",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index (BMI) for adults.",
    metaDescription: "Calculate your Body Mass Index (BMI) using height and weight in metric or imperial units. Instantly see your BMI category and what it means for your health.",
    category: "calculators",
    keywords: ["bmi", "calculator", "health", "weight", "height", "fitness"],
    icon: Activity,
    slug: "bmi-calculator"
  },
  {
    id: "28",
    name: "Percentage Calculator",
    description: "Easily calculate percentages, increases, and decreases.",
    metaDescription: "Calculate percentages, find what percent one number is of another, and compute percentage increases or decreases instantly. Simple, free math tool.",
    category: "calculators",
    keywords: ["percentage", "percent", "calculator", "math", "fraction"],
    icon: Percent,
    slug: "percentage-calculator"
  },
  {
    id: "29",
    name: "EMI Calculator",
    description: "Calculate Equated Monthly Installments for loans.",
    metaDescription: "Calculate monthly EMI for any loan amount, interest rate, and tenure. See a full amortization breakdown showing principal and interest for every payment.",
    category: "calculators",
    keywords: ["emi", "loan", "calculator", "finance", "interest", "monthly"],
    icon: Landmark,
    slug: "emi-calculator"
  },
  {
    id: "30",
    name: "GST Calculator",
    description: "Calculate Goods and Services Tax (inclusive or exclusive).",
    metaDescription: "Calculate GST-inclusive or GST-exclusive prices for any tax rate. Instantly find the tax amount and net or gross totals for your business transactions.",
    category: "calculators",
    keywords: ["gst", "tax", "calculator", "finance", "business", "percentage"],
    icon: Calculator,
    slug: "gst-calculator"
  },
  {
    id: "31",
    name: "URL Shortener",
    description: "Shorten long URLs into clean, manageable links.",
    metaDescription: "Shorten any long URL into a compact, shareable link. Preview your shortened links instantly with no sign-up required. Free and fast URL shortener.",
    category: "utilities",
    keywords: ["url", "shortener", "link", "tiny", "minify"],
    icon: LinkIcon,
    slug: "url-shortener"
  }
];
