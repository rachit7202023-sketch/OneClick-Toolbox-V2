import { Suspense } from "react";
import { useParams } from "wouter";
import { Share2, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { tools } from "@/data/tools";
import { toolComponents } from "@/data/toolComponents";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/seo/SEO";
import { ToolContentLayout } from "@/components/seo/ToolContentLayout";
import { ToolAnalyticsWrapper } from "@/components/seo/ToolAnalyticsWrapper";
import NotFound from "@/pages/not-found";

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  text:        ["#6366f1", "#8b5cf6"],
  developer:   ["#10b981", "#06b6d4"],
  generators:  ["#f59e0b", "#ef4444"],
  calculators: ["#6366f1", "#3b82f6"],
  color:       ["#ec4899", "#f43f5e"],
  image:       ["#f43f5e", "#fb923c"],
  utilities:   ["#64748b", "#6366f1"],
  ai:          ["#8b5cf6", "#6366f1"],
  default:     ["#7c3aed", "#a78bfa"],
};

function ToolSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-12 w-1/3" />
    </div>
  );
}

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const tool = tools.find(t => t.slug === slug);

  if (!tool) return <NotFound />;

  const ToolComponent = toolComponents[slug];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: tool.name, url });
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard!" });
  };

  const Icon = tool.icon;
  const [from, to] = CATEGORY_GRADIENTS[tool.category] ?? CATEGORY_GRADIENTS.default;

  // JSON-LD Schema Generation
  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "url": `https://atomest.com/tools/${slug}`,
      "description": tool.metaDescription || tool.description,
      "applicationCategory": "BrowserApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ];

  if (tool.faqs && tool.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": tool.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://atomest.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://atomest.com/tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.name,
        "item": `https://atomest.com/tools/${slug}`
      }
    ]
  });

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background ambient mesh gradient based on category */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-10 pointer-events-none rounded-full blur-[120px]"
        style={{
          background: `radial-gradient(ellipse at center, ${from}, transparent 70%)`
        }}
      />
      
      <SEO 
        title={tool.seoTitle || tool.name}
        description={tool.seoDescription || tool.metaDescription || tool.description}
        canonicalPath={`/tools/${slug}`}
        schema={schemas}
      />
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex-1 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Breadcrumb items={[
            { label: "Tools", href: "/tools" },
            { label: tool.name }
          ]} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-12 mt-8"
        >
          <div className="flex items-center sm:items-start gap-5">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center rounded-[24px] flex-shrink-0"
              style={{
                width: 80,
                height: 80,
                background: `linear-gradient(135deg, ${from}, ${to})`,
                boxShadow: `0 12px 32px -8px ${from}80, inset 0 2px 4px rgba(255,255,255,0.2)`,
              }}
            >
              <Icon className="h-10 w-10 text-white drop-shadow-md" />
            </motion.div>
            <div className="flex flex-col justify-center h-[80px]">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight-head leading-tight">{tool.name}</h1>
              <p className="text-muted-foreground text-[1.1rem] mt-1 hidden sm:block">{tool.description}</p>
            </div>
          </div>
          <p className="text-muted-foreground sm:hidden mb-2">{tool.description}</p>
          
          <div className="flex gap-2 flex-shrink-0 mt-2 sm:mt-4">
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 rounded-lg font-bold shadow-sm" data-testid="button-share">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2 rounded-lg font-bold shadow-sm" data-testid="button-copy-link">
              <LinkIcon className="h-4 w-4" /> Copy
            </Button>
          </div>
        </motion.div>

        {/* Tool Interface Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 md:p-10 mb-16 shadow-2xl depth-floating"
        >
          {ToolComponent ? (
            <ToolAnalyticsWrapper toolName={tool.slug} category={tool.category}>
              <Suspense fallback={<ToolSkeleton />}>
                <ToolComponent />
              </Suspense>
            </ToolAnalyticsWrapper>
          ) : (
            <div className="text-center py-16 text-muted-foreground text-lg">
              Tool component not found.
            </div>
          )}
        </motion.div>

        {/* Dynamic Semantic Content Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <ToolContentLayout tool={tool} />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
