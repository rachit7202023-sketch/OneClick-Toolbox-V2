import { useParams } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ToolCard } from "@/components/ToolCard";
import { categories } from "@/data/categories";
import { tools } from "@/data/tools";
import NotFound from "@/pages/not-found";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find(c => c.id === slug);

  if (!category) return <NotFound />;

  const categoryTools = tools.filter(t => t.category === slug);
  const Icon = category.icon as any;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-10 flex-1">
        <Breadcrumb items={[
          { label: "Categories", href: "/categories" },
          { label: category.name }
        ]} />

        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-muted-foreground mt-1">
              {category.description} — {categoryTools.length} tool{categoryTools.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {categoryTools.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">No tools in this category yet.</p>
            <p className="text-muted-foreground mt-2">Check back soon — we're adding new tools regularly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
