// src/routes/categories.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCategories, useListings } from "@/lib/queries";
import { useApp, useT } from "@/lib/i18n";
import { getCategoryIcon } from "@/lib/categoryIcons";
import {
  Package, Search, Sparkles, ChevronLeft, Layers, ArrowRight, ArrowLeft,
  Grid3X3, TrendingUp, Star, Home, Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect, useRef } from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "جميع التصنيفات - السوق لعندك" },
      { name: "description", content: "استكشف جميع التصنيفات والمنتجات بكل سهولة في السوق لعندك" },
    ],
  }),
});

// ============================================================
// 🎨 Brand
// ============================================================
const OLIVE = "#2a655f";

function CategoriesPage() {
  const app = useApp();
  const t = useT();
  const isRtl = app.lang === "ar";
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: listingsData = { data: [], count: 0, totalPages: 0 } } = useListings({ limit: 1000 });
  const allListings = listingsData.data || [];

  // ✅ التصنيفات الرئيسية فقط (بدون parent_id)
  const mainCategories = useMemo(() => {
    return categories
      .filter((c: any) => !c.parent_id && c.active !== false)
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [categories]);

  // ✅ تصفية التصنيفات حسب البحث
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return mainCategories;
    const query = searchQuery.toLowerCase().trim();
    return mainCategories.filter((cat: any) => {
      const nameAr = cat.name_ar?.toLowerCase() || "";
      const nameEn = cat.name_en?.toLowerCase() || "";
      return nameAr.includes(query) || nameEn.includes(query);
    });
  }, [mainCategories, searchQuery]);

  // ✅ التصنيفات المميزة
  const featuredCategories = useMemo(() => {
    return categories
      .filter((c: any) => c.is_featured === true && c.active !== false && !c.parent_id)
      .sort((a: any, b: any) => (a.featured_sort || 0) - (b.featured_sort || 0))
      .slice(0, 6);
  }, [categories]);

  // ✅ عدد المنتجات لكل تصنيف (بما فيها الفرعية)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!allListings || !Array.isArray(allListings)) return counts;

    // بناء خريطة: category_id → parent_id
    const parentMap = new Map<string, string>();
    categories.forEach((c: any) => {
      if (c.parent_id) {
        parentMap.set(c.id, c.parent_id);
      }
    });

    // حساب عدد المنتجات لكل تصنيف رئيسي (بما فيها الفرعية)
    allListings.forEach((listing: any) => {
      const catId = listing.category_id;
      if (!catId) return;

      // إذا كان المنتج في تصنيف فرعي، احسبه للتصنيف الرئيسي أيضاً
      let currentCat = catId;
      let parentId = parentMap.get(currentCat);

      // احسب للتصنيف المباشر
      counts[currentCat] = (counts[currentCat] || 0) + 1;

      // احسب للتصنيف الرئيسي أيضاً
      while (parentId) {
        counts[parentId] = (counts[parentId] || 0) + 1;
        currentCat = parentId;
        parentId = parentMap.get(currentCat);
      }
    });

    return counts;
  }, [allListings, categories]);

  // ✅ عدد التصنيفات الفرعية لكل تصنيف
  const subCategoriesCount = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((c: any) => {
      if (c.parent_id) {
        counts[c.parent_id] = (counts[c.parent_id] || 0) + 1;
      }
    });
    return counts;
  }, [categories]);

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-slate-800 pb-20 font-sans selection:bg-[#2a655f]/20">

      {/* 🌿 Compact Olive Hero Banner */}
      <div className="relative overflow-hidden py-6 px-4 border-b border-[#2a655f]/10 bg-gradient-to-b from-[#eaf2f1] via-[#f2f6f5] to-[#f4f7f6]">
        <div className="absolute -top-20 -start-20 w-72 h-72 rounded-full bg-[#2a655f]/15 blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium flex-wrap">
            <Link to="/" className="hover:text-[#2a655f] flex items-center gap-1">
              <Home className="w-3 h-3" />
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#2a655f] font-bold">
              {isRtl ? "التصنيفات" : "Categories"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-[#2a655f]/20 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                <Layers className="w-7 h-7 text-[#2a655f]" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    {isRtl ? "جميع التصنيفات" : "All Categories"}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-[#2a655f]/10 text-[#2a655f] text-[10px] font-bold border border-[#2a655f]/20">
                    {mainCategories.length} {isRtl ? "قسم" : "sections"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-lg line-clamp-1">
                  {isRtl
                    ? `تصفح ${mainCategories.length} تصنيف رئيسي يضم أكثر من ${allListings.length} منتج متنوع`
                    : `Browse ${mainCategories.length} main categories with over ${allListings.length} products`}
                </p>
              </div>
            </div>

            {/* Quick Stats Pills */}
            <div className="flex items-center gap-2 bg-white/80 border border-[#2a655f]/15 backdrop-blur-md px-3 py-2 rounded-2xl shadow-2xs self-start sm:self-auto">
              <div className="px-2 text-center border-e border-slate-200">
                <span className="block text-sm font-black text-slate-900">{mainCategories.length}</span>
                <span className="text-[9px] text-slate-500">{isRtl ? "تصنيف" : "categories"}</span>
              </div>
              <div className="px-2 text-center border-e border-slate-200">
                <span className="block text-sm font-black text-[#2a655f]">{categories.length}</span>
                <span className="text-[9px] text-slate-500">{isRtl ? "قسم" : "sections"}</span>
              </div>
              <div className="px-2 text-center">
                <span className="block text-sm font-black text-amber-600">{allListings.length}</span>
                <span className="text-[9px] text-slate-500">{isRtl ? "منتج" : "items"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎛️ Glassmorphic Control Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex items-center justify-between gap-4 bg-white/90 backdrop-blur-xl border border-slate-200/80 p-3 rounded-2xl mb-6 shadow-2xs flex-wrap">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? "ابحث عن تصنيف..." : "Search category..."}
                className="ps-9 pe-9 h-9 rounded-xl border-2 border-slate-100 focus:border-[#2a655f] focus:ring-0 text-xs bg-slate-50/50 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-[10px] font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter icon (decorative) */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <Grid3X3 className="w-3.5 h-3.5" />
              {isRtl ? "عرض الكل" : "View All"}
            </div>
          </div>
        </div>

        {/* ===== المحتوى الرئيسي ===== */}
        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 animate-pulse">
                <Skeleton className="h-14 w-14 rounded-xl mx-auto bg-slate-100" />
                <Skeleton className="h-3 w-3/4 mx-auto mt-3 bg-slate-100" />
                <Skeleton className="h-2.5 w-1/2 mx-auto mt-1.5 bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ===== التصنيفات المميزة ===== */}
            {!searchQuery && featuredCategories.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-[#2a655f] grid place-items-center text-white shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      {isRtl ? "🌸 التصنيفات المميزة" : "🌸 Featured Categories"}
                    </h2>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border border-amber-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                    ⭐ {isRtl ? "مميزة" : "Featured"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {featuredCategories.map((cat: any, index: number) => {
                    const Icon = getCategoryIcon(cat.icon);
                    const count = categoryCounts[cat.id] || 0;
                    const hasImage = cat.image_url && cat.image_url.trim() !== "";

                    return (
                      <Link
                        key={cat.id}
                        to="/category/$slug"
                        params={{ slug: cat.slug }}
                        className="group relative bg-white rounded-2xl border border-slate-100 hover:border-[#2a655f]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 text-center overflow-hidden"
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        {/* شريط علوي زيتي عند الـ hover */}
                        <div className="absolute top-0 inset-x-0 h-0.5 bg-[#2a655f] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

                        <div className="flex flex-col items-center">
                          {/* Icon/Image */}
                          <div className="h-14 w-14 rounded-2xl overflow-hidden flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500 bg-[#eef5f4] border border-[#2a655f]/10">
                            {hasImage ? (
                              <OptimizedImage
                                src={cat.image_url}
                                alt={isRtl ? cat.name_ar : cat.name_en}
                                width={80}
                                height={80}
                                quality={80}
                                objectFit="cover"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Icon className="h-6 w-6 text-[#2a655f]" />
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="font-bold text-xs text-slate-900 group-hover:text-[#2a655f] transition-colors line-clamp-1">
                            {isRtl ? cat.name_ar : cat.name_en}
                          </h3>

                          {/* Count */}
                          <span className="mt-1.5 text-[10px] font-bold text-[#2a655f] bg-[#eef5f4] py-0.5 px-2 rounded-full inline-block">
                            {count} {isRtl ? "منتج" : "items"}
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
                  <div className="h-7 w-7 rounded-lg bg-[#2a655f] grid place-items-center text-white shadow-sm">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    {searchQuery
                      ? `${isRtl ? "نتائج البحث عن:" : "Search results for:"} "${searchQuery}"`
                      : isRtl ? "كافة التصنيفات" : "All Categories"
                    }
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                    {filteredCategories.length}
                  </span>
                </div>
              </div>

              {filteredCategories.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-2xs max-w-sm mx-auto">
                  <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <Search className="h-7 w-7 text-slate-300" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {isRtl ? "لا توجد نتائج" : "No results"}
                  </h3>
                  <p className="text-slate-500 text-xs mb-5">
                    {isRtl ? "جرب البحث بكلمة أخرى" : "Try another search term"}
                  </p>
                  <Button
                    onClick={() => setSearchQuery("")}
                    className="rounded-xl bg-[#2a655f] text-white text-xs font-bold h-9 px-5"
                  >
                    {isRtl ? "عرض الكل" : "View All"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredCategories.map((cat: any, index: number) => {
                    const Icon = getCategoryIcon(cat.icon);
                    const count = categoryCounts[cat.id] || 0;
                    const subsCount = subCategoriesCount[cat.id] || 0;
                    const isFeatured = cat.is_featured === true;
                    const hasImage = cat.image_url && cat.image_url.trim() !== "";

                    return (
                      <Link
                        key={cat.id}
                        to="/category/$slug"
                        params={{ slug: cat.slug }}
                        className="group relative bg-white rounded-2xl border border-slate-100 hover:border-[#2a655f]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 text-center overflow-hidden"
                        style={{ animationDelay: `${(index % 9) * 30}ms` }}
                      >
                        {/* شريط علوي زيتي عند الـ hover */}
                        <div className="absolute top-0 inset-x-0 h-0.5 bg-[#2a655f] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

                        {/* Featured Badge */}
                        {isFeatured && (
                          <div className="absolute top-2 end-2 z-10">
                            <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col items-center">
                          {/* Icon/Image */}
                          <div className="h-14 w-14 rounded-2xl overflow-hidden flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500 bg-[#eef5f4] border border-[#2a655f]/10">
                            {hasImage ? (
                              <OptimizedImage
                                src={cat.image_url}
                                alt={isRtl ? cat.name_ar : cat.name_en}
                                width={80}
                                height={80}
                                quality={80}
                                objectFit="cover"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Icon className="h-6 w-6 text-[#2a655f]" />
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="font-bold text-xs text-slate-900 group-hover:text-[#2a655f] transition-colors line-clamp-1">
                            {isRtl ? cat.name_ar : cat.name_en}
                          </h3>

                          {/* Sub-categories count */}
                          {subsCount > 0 && (
                            <span className="text-[9px] font-semibold text-slate-400 mt-0.5">
                              {subsCount} {isRtl ? "قسم فرعي" : "subs"}
                            </span>
                          )}

                          {/* Products Count */}
                          <span className="mt-1.5 text-[10px] font-bold text-[#2a655f] bg-[#eef5f4] py-0.5 px-2 rounded-full inline-block">
                            {count} {isRtl ? "منتج" : "items"}
                          </span>
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

export default CategoriesPage;