// src/routes/products.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useApp, useT } from "@/lib/i18n";
import { useListings } from "@/lib/queries";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Filter, X, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({ meta: [{ title: "جميع المنتجات — السوق لعندك" }] }),
});

function ProductsPage() {
  const app = useApp();
  const t = useT();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "product" | "offer">("all");
  
  const { data: allProducts = [], isLoading } = useListings({
    sort: "popular",
    limit: 100,
  });

  // ✅ فلترة ذكية وفورية (Live Search)
  const filteredProducts = useMemo(() => {
    let result = allProducts;
    
    // ✅ فلترة حسب النوع
    if (filterType === "product") {
      result = result.filter((p: any) => p.is_offer !== true);
    } else if (filterType === "offer") {
      result = result.filter((p: any) => p.is_offer === true);
    }
    
    // ✅ بحث فوري (Live Search)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p: any) => {
        const titleAr = (p.title_ar || "").toLowerCase();
        const titleEn = (p.title_en || "").toLowerCase();
        const descAr = (p.description_ar || "").toLowerCase();
        const descEn = (p.description_en || "").toLowerCase();
        
        // ✅ بحث في العنوان والوصف
        return titleAr.includes(q) || 
               titleEn.includes(q) || 
               descAr.includes(q) || 
               descEn.includes(q);
      });
    }
    
    return result;
  }, [allProducts, searchQuery, filterType]);

  // ✅ إحصائيات البحث
  const searchStats = {
    total: allProducts.length,
    filtered: filteredProducts.length,
    hasResults: filteredProducts.length > 0,
  };

  // ✅ اقتراحات البحث (مثل نون)
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    
    const q = searchQuery.toLowerCase().trim();
    const matched = allProducts
      .filter((p: any) => {
        const title = (p.title_ar || "").toLowerCase();
        return title.includes(q) && !filteredProducts.includes(p);
      })
      .slice(0, 5);
    
    return matched;
  }, [allProducts, searchQuery, filteredProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span>{app.lang === "ar" ? "🛍️ جميع المنتجات" : "🛍️ All Products"}</span>
              <Badge className="bg-primary/10 text-primary border-0 text-sm px-3 py-1">
                {searchStats.filtered}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery.trim() ? (
                app.lang === "ar" 
                  ? `نتائج البحث عن "${searchQuery}" (${searchStats.filtered} منتج)` 
                  : `Results for "${searchQuery}" (${searchStats.filtered} products)`
              ) : (
                app.lang === "ar" 
                  ? `عرض جميع المنتجات (${searchStats.total})` 
                  : `Showing all products (${searchStats.total})`
              )}
            </p>
          </div>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <div className="relative mb-4">
          <div className="relative">
            <Search className="absolute inset-y-0 my-auto start-3 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={app.lang === "ar" ? "🔍 ابحث عن منتج... (اكتب أي حرف)" : "🔍 Search for product... (type any letter)"}
              className="ps-12 h-14 rounded-2xl border-2 border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-lg"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* ✅ مؤشر البحث الفوري */}
          {searchQuery.trim() && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>
                {app.lang === "ar" 
                  ? `⚡ بحث فوري: ${searchStats.filtered} نتيجة` 
                  : `⚡ Live search: ${searchStats.filtered} results`}
              </span>
              {searchStats.filtered === 0 && (
                <span className="text-red-500">
                  {app.lang === "ar" ? "⚠️ لا توجد نتائج" : "⚠️ No results"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ===== FILTERS ===== */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {app.lang === "ar" ? "تصفية:" : "Filter:"}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: app.lang === "ar" ? "الكل" : "All" },
              { value: "product", label: app.lang === "ar" ? "📦 منتجات" : "📦 Products" },
              { value: "offer", label: app.lang === "ar" ? "🏷️ عروض" : "🏷️ Offers" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value as any)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  filterType === f.value
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== SUGGESTIONS (مثل نون) ===== */}
        {suggestions.length > 0 && (
          <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-xs text-muted-foreground mb-2">
              {app.lang === "ar" ? "💡 اقتراحات:" : "💡 Suggestions:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((p: any) => (
                <Link
                  key={p.id}
                  to="/listing/$id"
                  params={{ id: p.id }}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-sm hover:bg-primary/10 transition-all border border-slate-200/50 dark:border-slate-700/50"
                >
                  {p.title_ar}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== PRODUCTS GRID ===== */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-slate-200/50 dark:border-slate-800/50">
            <div className="text-7xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold">
              {app.lang === "ar" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              {app.lang === "ar" 
                ? `لم نعثر على منتجات تطابق "${searchQuery}"` 
                : `No products match "${searchQuery}"`}
            </p>
            {searchQuery.trim() && (
              <Button 
                variant="outline" 
                className="mt-4 rounded-xl"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 mr-2" />
                {app.lang === "ar" ? "مسح البحث" : "Clear search"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}