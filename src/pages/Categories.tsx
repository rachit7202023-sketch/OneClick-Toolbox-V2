import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { categories } from "@/data/categories";
import { tools } from "@/data/tools";

export default function Categories() {
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    toolCount: tools.filter(t => t.category === cat.id).length,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">All Categories</h1>
          <p className="text-muted-foreground">
            Browse {categories.length} categories to find the perfect tool
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categoriesWithCount.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
