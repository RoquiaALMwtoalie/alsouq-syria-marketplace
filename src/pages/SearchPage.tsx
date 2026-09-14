// src/pages/SearchPage.tsx

import { useState, useEffect, useRef } from "react";
import { useSearch } from "@/lib/hooks/useSearch";
import { useApp } from "@/lib/i18n";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchFilters } from "@/components/search/SearchFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Check,
  Store,
  ShoppingBag,
  FolderTree,
  Sparkles
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// ============================================================
// ✅ Dropdown مخصص للترتيب - مثل نون
// ============================================================
function SortDropdown({ value, onChange, lang }: { value: string; onChange: (val: string) => void; lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: 'popularity', label: lang === 'ar' ? 'الأكثر رواجاً' : 'Most Popular', icon: '⭐' },
    { value: 'newest', label: lang === 'ar' ? 'الواصل حديثاً' : 'New Arrivals', icon: '🆕' },
    { value: 'price_low', label: lang === 'ar' ? 'السعر: من الأقل' : 'Price: Low to High', icon: '💰' },
    { value: 'price_high', label: lang === 'ar' ? 'السعر: من الأعلى' : 'Price: High to Low', icon: '💰' },
    { value: 'discount', label: lang === 'ar' ? 'أكبر خصم' : 'Biggest Discount', icon: '🏷️' },
    { value: 'rating', label: lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated', icon: '⭐' },
  ];

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all duration-200 min-w-[170px]",
          isOpen 
            ? 'border-[#2a655f] bg-white dark:bg-slate-800 shadow-lg shadow-[#2a655f]/10' 
            : 'border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 hover:border-[#2a655f]/50'
        )}
      >
        <span className="text-base leading-none">{selectedOption.icon}</span>
        <span className="flex-1 text-start truncate">{selectedOption.label}</span>
        <ChevronDown className={cn(
          "h-4 w-4 text-slate-400 transition-transform duration-200 flex-shrink-0",
          isOpen ? 'rotate-180' : ''
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-1.5">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-sm text-start flex items-center gap-3 transition-colors duration-150",
                    isSelected 
                      ? 'bg-[#2a655f]/10 text-[#2a655f] font-bold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  )}
                >
                  <span className="text-base leading-none w-6 text-center">{option.icon}</span>
                  <span className="flex-1 font-medium">{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ✅ SearchPage الرئيسي
// ============================================================
export function SearchPage() {
  const app = useApp();
  const location = useLocation();
  const search = location.search as { q?: string; gov?: string };
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const {
    query,
    setQuery,
    results,
    allResults,
    isLoading,
    totalResults,
    productsCount,
    storesCount,
    categoriesCount,
    activeType,
    setActiveType,
    hasMore,
    loadMore,
    filters,
    setFilter,
    resetFilters,
  } = useSearch();

  // ✅ استقبال الـ params من الـ URL
  useEffect(() => {
    const q = search?.q || "";
    const gov = search?.gov || "";
    
    if (q) setQuery(q);
    if (gov) setFilter("governorate", gov);
  }, [search, setQuery, setFilter]);

  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key as keyof typeof filters] && key !== "sortBy"
  ).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      {/* ============================================================ */}
      {/* ✅ Header البحث */}
      {/* ============================================================ */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            {/* ✅ حقل البحث */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={app.lang === "ar" ? "ابحث عن منتجات، متاجر، تصنيفات..." : "Search for products, stores, categories..."}
                className="ps-9 pe-10 h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#2a655f] focus:bg-white dark:focus:bg-slate-900 transition-all text-base"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 my-auto end-3 h-6 w-6 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              )}
            </div>

            {/* ✅ زر الفلتر للجوال */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="lg:hidden h-12 gap-2 rounded-xl border-slate-200/60 dark:border-slate-700/60 relative"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full bg-[#2a655f] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent 
  side={app.lang === "ar" ? "right" : "left"} 
  className="w-[320px] p-0 [&>button]:hidden"
>
                <SearchFilters
                  filters={filters}
                  setFilter={setFilter}
                  resetFilters={resetFilters}
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* ✅ تبديل العرض */}
            <div className="hidden sm:flex items-center gap-1 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-1 bg-white dark:bg-slate-800">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "grid"
                    ? "bg-[#2a655f] text-white shadow-md"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "list"
                    ? "bg-[#2a655f] text-white shadow-md"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          {/* ============================================================ */}
          {/* ✅ Sidebar فلتر للديسكتوب */}
          {/* ============================================================ */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <SearchFilters
                filters={filters}
                setFilter={setFilter}
                resetFilters={resetFilters}
              />
            </div>
          </aside>

          {/* ============================================================ */}
          {/* ✅ النتائج */}
          {/* ============================================================ */}
          <main className="flex-1 min-w-0">
            {/* ✅ شريط المعلومات */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-[#2a655f]/10 border border-[#2a655f]/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-[#2a655f]" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {app.lang === "ar" ? "نتائج البحث" : "Search Results"}
                  </h1>
                  {query && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {app.lang === "ar" ? "عن:" : "for:"}{" "}
                      <span className="font-bold text-[#2a655f]">
                        "{query}"
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* ✅ ترتيب النتائج */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">
                  {app.lang === "ar" ? "ترتيب حسب:" : "Sort by:"}
                </span>
                <SortDropdown
                  value={filters.sortBy || "popularity"}
                  onChange={(val) => setFilter("sortBy", val)}
                  lang={app.lang}
                />
              </div>
            </div>

            {/* ✅ الفلاتر النشطة */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {filters.category && (
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 py-1.5 px-3 rounded-lg flex items-center gap-1">
                    <FolderTree className="h-3 w-3" />
                    {app.lang === "ar" ? "تصنيف" : "Category"}
                    <button
                      onClick={() => setFilter("category", undefined)}
                      className="ms-1 hover:text-red-500 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.governorate && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 py-1.5 px-3 rounded-lg flex items-center gap-1">
                    <Store className="h-3 w-3" />
                    {app.lang === "ar" ? "محافظة" : "Governorate"}
                    <button
                      onClick={() => setFilter("governorate", undefined)}
                      className="ms-1 hover:text-red-500 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.minPrice && (
                  <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20 py-1.5 px-3 rounded-lg flex items-center gap-1">
                    {app.lang === "ar" ? "من" : "From"}: {filters.minPrice}
                    <button
                      onClick={() => setFilter("minPrice", undefined)}
                      className="ms-1 hover:text-red-500 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.maxPrice && (
                  <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20 py-1.5 px-3 rounded-lg flex items-center gap-1">
                    {app.lang === "ar" ? "إلى" : "To"}: {filters.maxPrice}
                    <button
                      onClick={() => setFilter("maxPrice", undefined)}
                      className="ms-1 hover:text-red-500 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.rating && (
                  <Badge className="bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 py-1.5 px-3 rounded-lg flex items-center gap-1">
                    ⭐ {filters.rating}+
                    <button
                      onClick={() => setFilter("rating", undefined)}
                      className="ms-1 hover:text-red-500 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-red-500 hover:text-red-600 transition px-2 py-1 font-bold"
                >
                  {app.lang === "ar" ? "مسح الكل" : "Clear all"}
                </button>
              </div>
            )}

            {/* ============================================================ */}
            {/* ✅ النتائج مع Tabs */}
            {/* ============================================================ */}
            <SearchResults
              results={results}
              allResults={allResults}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              totalResults={totalResults}
              productsCount={productsCount}
              storesCount={storesCount}
              categoriesCount={categoriesCount}
              activeType={activeType}
              setActiveType={setActiveType}
              viewMode={viewMode}
            />

            {/* ✅ إذا لا توجد نتائج */}
            {!isLoading && results.length === 0 && query && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {app.lang === "ar" ? "لا توجد نتائج" : "No results found"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                  {app.lang === "ar"
                    ? `لم نعثر على أي نتائج لـ "${query}". حاول استخدام كلمات بحث مختلفة أو قلل من الفلاتر.`
                    : `No results found for "${query}". Try different keywords or reduce filters.`}
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-xl border-slate-300 text-[#2a655f] hover:bg-[#2a655f]/10"
                  onClick={() => {
                    setQuery("");
                    resetFilters();
                  }}
                >
                  {app.lang === "ar" ? "مسح البحث" : "Clear search"}
                </Button>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}