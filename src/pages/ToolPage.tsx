import { Suspense } from "react";
import { useParams } from "wouter";
import { Share2, Link as LinkIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RelatedTools } from "@/components/RelatedTools";
import { tools } from "@/data/tools";
import { toolComponents } from "@/data/toolComponents";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import NotFound from "@/pages/not-found";

function ToolSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-10 w-1/3" />
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-10 flex-1 max-w-5xl">
        <Breadcrumb items={[
          { label: "Tools", href: "/tools" },
          { label: tool.name }
        ]} />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-xl flex-shrink-0">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
              <p className="text-muted-foreground mt-1">{tool.description}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2" data-testid="button-share">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2" data-testid="button-copy-link">
              <LinkIcon className="h-4 w-4" /> Copy Link
            </Button>
          </div>
        </div>

        {/* Tool Interface */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-12">
          {ToolComponent ? (
            <Suspense fallback={<ToolSkeleton />}>
              <ToolComponent />
            </Suspense>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Tool component not found.
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Input Your Data", desc: `Enter or paste your content into the ${tool.name} interface.` },
              { step: "2", title: "Instant Processing", desc: "The tool processes your input instantly, right in your browser." },
              { step: "3", title: "Use Your Results", desc: "Copy, download, or use your results directly from the page." },
            ].map(item => (
              <div key={item.step} className="flex gap-4 p-5 bg-muted/40 rounded-xl border border-border">
                <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              {
                q: `Is the ${tool.name} free to use?`,
                a: `Yes, the ${tool.name} is completely free. No account, no subscription, no limits.`
              },
              {
                q: "Is my data private?",
                a: "All processing happens locally in your browser. No data is sent to any server."
              },
              {
                q: "Does it work on mobile?",
                a: `Yes, the ${tool.name} is fully responsive and works on all devices.`
              }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-6 bg-card">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <RelatedTools currentTool={tool} />
      </div>

      <Footer />
    </div>
  );
}
