// src/routes/categories.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCategories, useListings } from "@/lib/queries";
import { useApp, useT } from "@/lib/i18n";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { Package, Search, Sparkles, Store, TrendingUp, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "جميع التصنيفات - Souqi" },
      { name: "description", content: "استكشف جميع التصنيفات والمنتجات في سوقي" },
    ],
  }),
});

function CategoriesPage() {
  const app = useApp();
  const t = useT();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: allListings = [] } = useListings({ limit: 1000 });

  // ✅ حساب عدد المنتجات لكل تصنيف
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allListings.forEach((listing: any) => {
      const catId = listing.category_id;
      if (catId) {
        counts[catId] = (counts[catId] || 0) + 1;
      }
    });
    return counts;
  }, [allListings]);

  // ✅ تصفية التصنيفات حسب البحث
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase().trim();
    return categories.filter((cat: any) => {
      const nameAr = cat.name_ar?.toLowerCase() || "";
      const nameEn = cat.name_en?.toLowerCase() || "";
      return nameAr.includes(query) || nameEn.includes(query);
    });
  }, [categories, searchQuery]);

  // ✅ التصنيفات المميزة - من قاعدة البيانات (is_featured)
  const featuredCategories = useMemo(() => {
    return categories
      .filter((c: any) => c.is_featured === true && c.active !== false)
      .sort((a: any, b: any) => (a.featured_sort || 0) - (b.featured_sort || 0));
  }, [categories]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* ===== Header ===== */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1 group">
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              {app.lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
            {app.lang === "ar" ? "جميع التصنيفات" : "All Categories"}
          </h1>
          
          <p className="text-white/80 text-lg max-w-2xl animate-fade-up animation-delay-200">
            {app.lang === "ar" 
              ? `استكشف أكثر من ${categories.length} تصنيف و ${allListings.length} منتج` 
              : `Explore ${categories.length} categories and ${allListings.length} products`}
          </p>

          {/* ===== Search ===== */}
          <div className="mt-6 max-w-md animate-fade-up animation-delay-400">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={app.lang === "ar" ? "ابحث عن تصنيف..." : "Search categories..."}
                className="pl-10 h-12 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-white/60 rounded-xl focus:bg-white/20 focus:border-white/40 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Categories Grid ===== */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        
        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-3" />
                <Skeleton className="h-3 w-1/2 mx-auto mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ===== Featured Categories - من قاعدة البيانات ===== */}
            {!searchQuery && featuredCategories.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-xl bg-[#2a655f] grid place-items-center text-white shadow-md">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {app.lang === "ar" ? "تصنيفات مميزة" : "Featured Categories"}
                  </h2>
                  <Badge className="bg-[#2a655f] text-white border-0 hover:bg-[#3a8a82] transition-colors duration-300">
                    ⭐ {app.lang === "ar" ? "مميزة" : "Featured"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {featuredCategories.slice(0, 6).map((cat: any, index: number) => {
                    const Icon = getCategoryIcon(cat.icon);
                    const count = categoryCounts[cat.id] || 0;
                    const hasImage = cat.image_url && cat.image_url.trim() !== "";
                    
                    return (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 border-[#2a655f]/30 hover:border-[#2a655f]/70 text-center overflow-hidden animate-fade-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2a655f]/5 to-[#3a8a82]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative">
                          {/* ✅ صورة التصنيف أو الأيقونة */}
                          <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/30 dark:to-[#3a8a82]/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 border-2 border-[#2a655f]/20 group-hover:border-[#2a655f]/50">
                            {hasImage ? (
                              <img 
                                src={cat.image_url} 
                                alt={app.lang === "ar" ? cat.name_ar : cat.name_en}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const parent = (e.target as HTMLImageElement).parentElement;
                                  if (parent) {
                                    const icon = document.createElement('span');
                                    icon.className = 'h-8 w-8 text-[#2a655f] dark:text-[#3a8a82]';
                                    parent.appendChild(icon);
                                  }
                                }}
                              />
                            ) : (
                              <Icon className="h-8 w-8 text-[#2a655f] dark:text-[#3a8a82] group-hover:scale-110 transition-transform duration-300" />
                            )}
                          </div>
                          
                          <p className="mt-3 font-semibold text-sm text-slate-900 dark:text-white group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors duration-300">
                            {app.lang === "ar" ? cat.name_ar : cat.name_en}
                          </p>
                          
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {count} {app.lang === "ar" ? "منتج" : "products"}
                          </p>
                          
                          <Badge className="absolute -top-2 -right-2 bg-[#2a655f] text-white border-0 text-[9px] px-1.5 py-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            ⭐ {app.lang === "ar" ? "مميز" : "Featured"}
                          </Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== All Categories ===== */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#2a655f] grid place-items-center text-white shadow-md">
                    <Package className="h-4 w-4" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {searchQuery 
                      ? `${app.lang === "ar" ? "نتائج البحث" : "Search Results"} (${filteredCategories.length})`
                      : app.lang === "ar" ? "جميع التصنيفات" : "All Categories"
                    }
                  </h2>
                </div>
              </div>

              {filteredCategories.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {app.lang === "ar" ? "لم نجد تصنيفاً" : "No categories found"}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {app.lang === "ar" ? "حاول البحث بكلمة مختلفة" : "Try searching with a different keyword"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="mt-4 rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300"
                  >
                    {app.lang === "ar" ? "عرض الكل" : "View all"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredCategories.map((cat: any, index: number) => {
                    const Icon = getCategoryIcon(cat.icon);
                    const count = categoryCounts[cat.id] || 0;
                    const isFeatured = cat.is_featured === true;
                    const hasImage = cat.image_url && cat.image_url.trim() !== "";
                    
                    return (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className={`
                          group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl 
                          transition-all duration-500 hover:-translate-y-2 border text-center relative animate-fade-up
                          ${isFeatured 
                            ? 'border-[#2a655f]/30 hover:border-[#2a655f]/70' 
                            : 'border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30'
                          }
                        `}
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        {isFeatured && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-[#2a655f] text-white border-0 text-[8px] px-1.5 py-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                              ⭐ {app.lang === "ar" ? "مميز" : "Featured"}
                            </Badge>
                          </div>
                        )}
                        
                        {/* ✅ صورة التصنيف أو الأيقونة */}
                        <div className={`
                          h-14 w-14 rounded-full overflow-hidden flex items-center justify-center mx-auto 
                          group-hover:scale-110 transition-transform duration-500
                          ${isFeatured 
                            ? 'bg-gradient-to-br from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/30 dark:to-[#3a8a82]/20 border-2 border-[#2a655f]/20 group-hover:border-[#2a655f]/50' 
                            : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-[#2a655f]/10'
                          }
                        `}>
                          {hasImage ? (
                            <img 
                              src={cat.image_url} 
                              alt={app.lang === "ar" ? cat.name_ar : cat.name_en}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                  const icon = document.createElement('span');
                                  icon.className = `h-7 w-7 ${isFeatured ? 'text-[#2a655f] dark:text-[#3a8a82]' : 'text-[#2a655f] dark:text-[#3a8a82]'}`;
                                  parent.appendChild(icon);
                                }
                              }}
                            />
                          ) : (
                            <Icon className={`h-7 w-7 ${isFeatured ? 'text-[#2a655f] dark:text-[#3a8a82]' : 'text-[#2a655f] dark:text-[#3a8a82]'} group-hover:scale-110 transition-transform duration-300`} />
                          )}
                        </div>
                        
                        <p className="mt-3 font-semibold text-sm text-slate-900 dark:text-white group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors duration-300 line-clamp-1">
                          {app.lang === "ar" ? cat.name_ar : cat.name_en}
                        </p>
                        
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {count} {app.lang === "ar" ? "منتج" : "products"}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}