// src/routes/categories.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCategories, useListings } from "@/lib/queries";
import { useApp, useT } from "@/lib/i18n";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { Package, Search, Sparkles, ChevronLeft, Layers, ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "جميع التصنيفات - السوق عندك" },
      { name: "description", content: "استكشف جميع التصنيفات والمنتجات بكل سهولة في السوق عندك" },
    ],
  }),
});

function CategoriesPage() {
  const app = useApp();
  const t = useT();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: listingsData = { data: [], count: 0, totalPages: 0 } } = useListings({ limit: 1000 });
  const allListings = listingsData.data || [];

  // ✅ تصفية التصنيفات التي تحتوي على صور لعرضها في البنر الخلفي
  const bannerCategories = useMemo(() => {
    return categories.filter((cat: any) => cat.image_url && cat.image_url.trim() !== "");
  }, [categories]);

  // ✅ تأثير تغيير البنر الخلفي تلقائياً كل 4.5 ثانية
  useEffect(() => {
    if (bannerCategories.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerCategories.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [bannerCategories.length]);

  // ✅ حساب عدد المنتجات لكل تصنيف
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!allListings || !Array.isArray(allListings)) return counts;
    
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

  // ✅ التصنيفات المميزة
  const featuredCategories = useMemo(() => {
    return categories
      .filter((c: any) => c.is_featured === true && c.active !== false)
      .sort((a: any, b: any) => (a.featured_sort || 0) - (b.featured_sort || 0));
  }, [categories]);

  const currentBannerCat = bannerCategories[currentBannerIndex] || categories[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      
      {/* ===== Header مع بنر خلفي عالي الوضوح والنقاء 100% ===== */}
      <div className="relative bg-[#1b433e] text-white overflow-hidden py-8 md:py-10 shadow-lg">
        
        {/* ✅ البنر الخلفي بوضوح كامل (opacity 90%) وبدون أي ضبابية */}
        {bannerCategories.length > 0 && currentBannerCat && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              key={currentBannerCat.id}
              src={currentBannerCat.image_url} 
              alt="" 
              className="h-full w-full object-cover animate-fade-in transition-all duration-1000 scale-100 opacity-90" 
            />
            {/* تدرج خفيف جداً من الأطراف فقط لضمان قراءة النص مع إبقاء الصورة واضحة تماماً */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/75 backdrop-blur-[0.5px]" />
          </div>
        )}
        
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-3 mb-2.5">
            <Link to="/" className="text-white/90 hover:text-white transition text-xs font-semibold flex items-center gap-1 group bg-black/50 px-3 py-1 rounded-full backdrop-blur-md border border-white/40 shadow-md">
              <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform duration-300" />
              {app.lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </div>
          
          {/* ✅ المساحة المطلوبة max-w-3xl */}
          <div className="max-w-3xl bg-black/60 dark:bg-slate-950/75 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-white/35 shadow-2xl relative overflow-hidden">
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-[10px] font-bold mb-2 text-emerald-300">
              <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} />
              {app.lang === "ar" ? "دليل الأقسام الشامل" : "Comprehensive Directory"}
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold mb-1.5 tracking-tight drop-shadow-md">
              {app.lang === "ar" ? "استكشف جميع التصنيفات" : "Explore All Categories"}
            </h1>
            
            <p className="text-white text-xs max-w-xl leading-relaxed font-medium mb-3 drop-shadow-md">
              {app.lang === "ar" 
                ? `تصفح أكثر من ${categories.length} تصنيف رئيسي وأفرع يضم ما يزيد عن ${allListings.length} منتج متنوع في قسم "${currentBannerCat?.name_ar || ''}".` 
                : `Browse over ${categories.length} categories featuring more than ${allListings.length} items.`}
            </p>

            {/* تفاصيل القسم الحالي وزر الدخول */}
            {currentBannerCat && (
              <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-bold text-emerald-200 bg-black/70 px-2.5 py-1 rounded-lg border border-emerald-500/50 flex items-center gap-1.5 shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {app.lang === "ar" ? `قسم معروض حالياً: ${currentBannerCat.name_ar}` : `Featured: ${currentBannerCat.name_en}`}
                </span>

                <Link
                  to={`/category/$slug`}
                  params={{ slug: currentBannerCat.slug }}
                  className="text-[11px] font-bold bg-white text-[#2a655f] hover:bg-emerald-50 px-3.5 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1 shadow-lg"
                >
                  <span>{app.lang === "ar" ? "دخول القسم" : "Enter Section"}</span>
                  {app.lang === "ar" ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                </Link>
              </div>
            )}

            {/* ===== شريط البحث السريع المدمج ===== */}
            <div className="max-w-md">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={app.lang === "ar" ? "ابحث عن أي تصنيف تريده..." : "Search any category..."}
                    className="pl-10 h-10 bg-white dark:bg-slate-900 border-0 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl shadow-md focus-visible:ring-2 focus-visible:ring-emerald-400 text-xs font-medium"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 text-[10px] font-bold text-slate-400 hover:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                    >
                      {app.lang === "ar" ? "إلغاء" : "Clear"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* نقاط المؤشرات للبنر */}
            <div className="absolute bottom-3 left-5 flex items-center gap-1.5 z-20">
              {bannerCategories.slice(0, 8).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${idx === currentBannerIndex ? 'w-5 bg-emerald-400' : 'w-1 bg-white/60'}`}
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ===== المحتوى الرئيسي ===== */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        
        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
                <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-3" />
                <Skeleton className="h-3 w-1/2 mx-auto mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ===== التصنيفات المميزة بأيقونات متحركة كالأمواج (Wave Animation) ===== */}
            {!searchQuery && featuredCategories.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#2a655f] to-[#3a8a82] grid place-items-center text-white shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {app.lang === "ar" ? "التصنيفات الأكثر طلباً" : "Most Demanded Categories"}
                    </h2>
                  </div>
                  
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] dark:text-[#3a8a82] border border-[#2a655f]/20 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
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
                        to={`/category/$slug`}
                        params={{ slug: cat.slug }}
                        className="group relative bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-[#2a655f] hover:border-[#3a8a82] text-center overflow-hidden flex flex-col items-center justify-between h-[155px] category-wave-card"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-[#2a655f]/5 via-transparent to-[#2a655f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10 mt-1">
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#2a655f]/10 to-[#3a8a82]/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-inner border border-[#2a655f]/30">
                            {hasImage ? (
                              <img src={cat.image_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <Icon className="h-6 w-6 text-[#2a655f] dark:text-[#3a8a82]" />
                            )}
                          </div>
                        </div>
                        
                        <div className="relative z-10 w-full mt-1.5">
                          <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors line-clamp-1">
                            {app.lang === "ar" ? cat.name_ar : cat.name_en}
                          </h3>
                          <span className="mt-1 text-[10px] font-semibold text-[#2a655f] dark:text-[#3a8a82] bg-[#2a655f]/10 py-0.5 px-2 rounded-full inline-block">
                            {count} {app.lang === "ar" ? "منتج" : "items"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== شبكة جميع التصنيفات ===== */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#2a655f] to-[#3a8a82] grid place-items-center text-white shadow-sm">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {searchQuery 
                      ? `${app.lang === "ar" ? "نتائج البحث عن:" : "Search results for:"} "${searchQuery}"`
                      : app.lang === "ar" ? "كافة التصنيفات المتاحة" : "All Available Categories"
                    }
                  </h2>
                </div>
              </div>

              {filteredCategories.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-[#2a655f]/30 shadow-md max-w-sm mx-auto">
                  <Search className="h-8 w-8 text-[#2a655f] mx-auto mb-2 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {app.lang === "ar" ? "لم نجد أي تصنيف مطابق" : "No categories found"}
                  </h3>
                  <Button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 bg-[#2a655f] hover:bg-[#3a8a82] text-white rounded-xl px-4 h-8 text-xs font-bold"
                  >
                    {app.lang === "ar" ? "عرض الكل" : "View All"}
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
                        to={`/category/$slug`}
                        params={{ slug: cat.slug }}
                        className="group relative bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-[#2a655f]/80 hover:border-[#2a655f] text-center overflow-hidden flex flex-col items-center justify-between h-[150px] category-wave-card"
                        style={{ animationDelay: `${(index % 5) * 0.25}s` }}
                      >
                        {isFeatured && (
                          <div className="absolute top-2 right-2 z-10">
                            <span className="bg-[#2a655f] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                              ⭐
                            </span>
                          </div>
                        )}
                        
                        <div className="relative z-10 mt-1">
                          <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 border border-[#2a655f]/30">
                            {hasImage ? (
                              <img src={cat.image_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <Icon className="h-5 w-5 text-[#2a655f] dark:text-[#3a8a82]" />
                            )}
                          </div>
                        </div>
                        
                        <div className="relative z-10 w-full mt-1.5">
                          <h3 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors line-clamp-1">
                            {app.lang === "ar" ? cat.name_ar : cat.name_en}
                          </h3>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                            {count} {app.lang === "ar" ? "منتج" : "items"}
                          </p>
                        </div>
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

// ✅ الأنماط الحركية (التلاشي الواضح + حركة الأمواج للبطاقات)
const styleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleTag) {
  styleTag.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(1.02); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }

    @keyframes wave-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
    .category-wave-card {
      animation: wave-float 4s ease-in-out infinite;
    }
    .category-wave-card:hover {
      animation-play-state: paused;
    }
  `;
  document.head.appendChild(styleTag);
}