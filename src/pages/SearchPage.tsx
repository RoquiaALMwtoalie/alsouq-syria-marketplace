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
  Grid3x3, 
  List, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Check
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// ============================================================
// ✅ Dropdown مخصص للترتيب - مثل نون 100%
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
      {/* ✅ زر الاختيار - مثل نون */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all duration-200 min-w-[170px]
          ${isOpen 
            ? 'border-blue-500 bg-white dark:bg-[#1e293b] shadow-lg shadow-blue-500/10' 
            : 'border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] hover:border-blue-400/50'
          }
        `}
      >
        <span className="text-base leading-none">{selectedOption.icon}</span>
        <span className="flex-1 text-start truncate">{selectedOption.label}</span>
        <ChevronDown className={`
          h-4 w-4 text-muted-foreground transition-transform duration-200 flex-shrink-0
          ${isOpen ? 'rotate-180' : ''}
        `} />
      </button>

      {/* ✅ القائمة المنسدلة - مثل نون */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
                  className={`
                    w-full px-4 py-2.5 text-sm text-start flex items-center gap-3 transition-colors duration-150
                    ${isSelected 
                      ? 'bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                    }
                  `}
                >
                  <span className="text-base leading-none w-6 text-center">{option.icon}</span>
                  <span className="flex-1 font-medium">{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
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
    isLoading,
    totalResults,
    hasMore,
    loadMore,
    filters,
    setFilter,
    resetFilters,
  } = useSearch();

  // استقبال الـ params من الـ URL
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
      {/* ✅ Header البحث */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={app.lang === "ar" ? "ابحث عن منتجات، متاجر، تصنيفات..." : "Search for products, stores, categories..."}
                className="ps-9 pe-10 h-12 bg-muted/50 border-2 border-blue-200/30 dark:border-blue-800/30 rounded-xl focus:border-blue-400/60 focus:bg-card transition-all text-base"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 my-auto end-3 h-6 w-6 rounded-full hover:bg-muted flex items-center justify-center transition"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* ✅ زر الفلتر للجوال */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden h-12 gap-2 rounded-xl border-slate-200/60 dark:border-slate-700/60">
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <Badge className="h-5 min-w-5 px-1 rounded-full bg-blue-600 text-white text-[10px]">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side={app.lang === "ar" ? "right" : "left"} className="w-[300px] p-0">
                <SearchFilters
                  filters={filters}
                  setFilter={setFilter}
                  resetFilters={resetFilters}
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* ✅ View mode */}
            <div className="hidden sm:flex items-center gap-1 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "list"
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-muted text-muted-foreground"
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
          {/* ✅ Sidebar فلتر للديسكتوب */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <SearchFilters
                filters={filters}
                setFilter={setFilter}
                resetFilters={resetFilters}
              />
            </div>
          </aside>

          {/* ✅ النتائج */}
          <main className="flex-1 min-w-0">
            {/* ✅ شريط المعلومات */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {app.lang === "ar" ? "نتائج البحث" : "Search Results"}
                </h1>
                {totalResults > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {app.lang === "ar"
                      ? `تم العثور على ${totalResults.toLocaleString()} نتيجة`
                      : `${totalResults.toLocaleString()} results found`}
                  </p>
                )}
              </div>

              {/* ✅ ترتيب النتائج - مثل نون 100% */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
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
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-200/30 py-1.5 px-3 rounded-lg">
                    {app.lang === "ar" ? "تصنيف" : "Category"}: {filters.category}
                    <button
                      onClick={() => setFilter("category", undefined)}
                      className="ml-2 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.governorate && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200/30 py-1.5 px-3 rounded-lg">
                    {app.lang === "ar" ? "محافظة" : "Governorate"}: {filters.governorate}
                    <button
                      onClick={() => setFilter("governorate", undefined)}
                      className="ml-2 hover:text-emerald-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.minPrice && (
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-200/30 py-1.5 px-3 rounded-lg">
                    {app.lang === "ar" ? "من" : "From"}: {filters.minPrice}
                    <button
                      onClick={() => setFilter("minPrice", undefined)}
                      className="ml-2 hover:text-purple-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.maxPrice && (
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-200/30 py-1.5 px-3 rounded-lg">
                    {app.lang === "ar" ? "إلى" : "To"}: {filters.maxPrice}
                    <button
                      onClick={() => setFilter("maxPrice", undefined)}
                      className="ml-2 hover:text-purple-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.rating && (
                  <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200/30 py-1.5 px-3 rounded-lg">
                    ⭐ {filters.rating}+
                    <button
                      onClick={() => setFilter("rating", undefined)}
                      className="ml-2 hover:text-yellow-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-500 hover:text-red-600 transition px-2 py-1"
                >
                  {app.lang === "ar" ? "مسح الكل" : "Clear all"}
                </button>
              </div>
            )}

            {/* ✅ النتائج */}
            <SearchResults
              results={results}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              totalResults={totalResults}
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
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {app.lang === "ar" ? "لا توجد نتائج" : "No results found"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  {app.lang === "ar"
                    ? `لم نعثر على أي نتائج لـ "${query}". حاول استخدام كلمات بحث مختلفة أو قلل من الفلاتر.`
                    : `No results found for "${query}". Try different keywords or reduce filters.`}
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-xl"
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