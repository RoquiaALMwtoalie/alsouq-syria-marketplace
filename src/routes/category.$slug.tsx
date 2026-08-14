// src/routes/category/$slug.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import { 
  SlidersHorizontal, X, Store, Package, Star, ChevronDown, Check,
  Sparkles, Filter, Search, MapPin, TrendingUp, Zap, Flame,
  Crown, Gem, Award, Clock, ThumbsUp, Eye, Truck, Coffee,
  Layers, Grid3X3, List, Percent, Tag, ArrowUpDown,
  Heart, ShoppingBag, Gift, Flower2, BadgePercent,
  RefreshCw, ArrowLeft, ChevronLeft, ChevronRight,
  CircleDot, Rocket, Sparkle, Compass, Wand2,
  LayoutGrid
} from "lucide-react";
import { useApp, useT } from "@/lib/i18n";
import { useGovernorates, useListings, useStoresByCategory, useCategories } from "@/lib/queries";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

// ============================================================
// ✅ SortDropdown - مع لمسات وردية
// ============================================================
function SortDropdown({ value, onChange, lang }: { value: string; onChange: (val: string) => void; lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: 'popularity', label: lang === 'ar' ? 'الأكثر رواجاً' : 'Most Popular', icon: TrendingUp, color: 'text-pink-500' },
    { value: 'newest', label: lang === 'ar' ? 'الواصل حديثاً' : 'New Arrivals', icon: Sparkles, color: 'text-pink-400' },
    { value: 'price_low', label: lang === 'ar' ? 'السعر: من الأقل' : 'Price: Low to High', icon: ArrowUpDown, color: 'text-emerald-500' },
    { value: 'price_high', label: lang === 'ar' ? 'السعر: من الأعلى' : 'Price: High to Low', icon: ArrowUpDown, color: 'text-rose-500' },
    { value: 'discount', label: lang === 'ar' ? 'أكبر خصم' : 'Biggest Discount', icon: BadgePercent, color: 'text-orange-500' },
    { value: 'rating', label: lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated', icon: Star, color: 'text-yellow-500' },
  ];

  const selectedOption = options.find(opt => opt.value === value) || options[0];
  const IconComponent = selectedOption.icon;

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
          "flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all duration-300 min-w-[170px] group",
          isOpen 
            ? "border-pink-400/50 bg-pink-500/5 dark:bg-pink-500/10 shadow-lg shadow-pink-500/20" 
            : "border-pink-300/30 dark:border-pink-400/30 bg-white dark:bg-[#1e293b] hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-500/10"
        )}
      >
        <IconComponent className={cn("h-4 w-4 transition-transform duration-300 group-hover:scale-110", selectedOption.color)} />
        <span className="flex-1 text-start truncate text-slate-700 dark:text-slate-300">{selectedOption.label}</span>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-all duration-300 flex-shrink-0",
          isOpen ? 'rotate-180 text-pink-500' : 'group-hover:text-pink-500'
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e293b] rounded-xl border border-pink-300/30 dark:border-pink-400/30 shadow-2xl shadow-pink-500/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-2">
            {options.map((option) => {
              const isSelected = value === option.value;
              const OptIcon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-sm text-start flex items-center gap-3 transition-all duration-200",
                    isSelected 
                      ? "bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-pink-500/5 dark:hover:bg-pink-500/10 hover:text-pink-600"
                  )}
                >
                  <OptIcon className={cn("h-4 w-4", option.color)} />
                  <span className="flex-1 font-medium">{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-pink-500 animate-bounce" />
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
// ✅ Stats Badge - مع لمسات وردية
// ============================================================
const AnimatedBadge = ({ count, label, icon: Icon, color }: any) => (
  <div className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-300/30 hover:bg-pink-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20">
    <Icon className={cn("h-4 w-4 animate-pulse", color || "text-pink-500")} />
    <span className="text-sm font-bold text-pink-600 dark:text-pink-400">{count}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

// ============================================================
// ✅ Product Filter Tabs - مع لمسات وردية
// ============================================================
function ProductFilterTabs({ 
  value, 
  onChange, 
  counts,
  lang 
}: { 
  value: 'all' | 'products' | 'offers'; 
  onChange: (val: 'all' | 'products' | 'offers') => void;
  counts: { all: number; products: number; offers: number };
  lang: string;
}) {
  const tabs = [
    { id: 'all' as const, label: lang === 'ar' ? 'الكل' : 'All', icon: LayoutGrid, count: counts.all },
    { id: 'products' as const, label: lang === 'ar' ? 'منتجات' : 'Products', icon: Package, count: counts.products },
    { id: 'offers' as const, label: lang === 'ar' ? 'عروض' : 'Offers', icon: Flame, count: counts.offers },
  ];

  return (
    <div className="relative flex items-center bg-pink-500/5 dark:bg-pink-500/10 rounded-xl p-1 border border-pink-300/20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = value === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5",
              isActive 
                ? "text-white" 
                : "text-[#0d2e2a] dark:text-white/60 hover:text-pink-600 dark:hover:text-pink-400"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {tab.label}
            <Badge className={cn(
              "text-[8px] px-1.5 py-0",
              isActive 
                ? "bg-white/20 text-white" 
                : "bg-pink-500/10 dark:bg-pink-500/30 text-pink-600 dark:text-pink-400"
            )}>
              {tab.count}
            </Badge>
          </button>
        );
      })}
      
      <div 
        className={cn(
          "absolute top-1 h-[calc(100%-8px)] w-[calc(33.33%-4px)] rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30 transition-all duration-300 ease-out",
          value === 'all' ? "left-1" : value === 'products' ? "left-[calc(33.33%+2px)]" : "left-[calc(66.66%+2px)]"
        )}
      />
    </div>
  );
}

// ============================================================
// ✅ Category Page
// ============================================================
function CategoryPage() {
  const { slug } = Route.useParams();
  const app = useApp();
  const t = useT();
  
  const isOffersPage = slug === "offers";
  
  const { data: govs = [] } = useGovernorates();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const searchParams = Route.useSearch() as { q?: string; gov?: string } | undefined;

  // ✅ State
  const [tab, setTab] = useState<"products" | "stores">("products");
  const [productFilter, setProductFilter] = useState<'all' | 'products' | 'offers'>('all');
  const [gov, setGov] = useState<string>(searchParams?.gov ?? "all");
  const [sort, setSort] = useState<"popularity" | "newest" | "price_low" | "price_high" | "discount" | "rating">("popularity");
  const [rating, setRating] = useState(0);
  const [search, setSearch] = useState(searchParams?.q ?? "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Number.MAX_SAFE_INTEGER]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // ✅ category
  const category = useMemo(() => {
    if (isOffersPage) return null;
    return categories.find((c: any) => c.slug === slug);
  }, [categories, slug, isOffersPage]);

  useEffect(() => {
    setSearch(searchParams?.q ?? "");
    setGov(searchParams?.gov ?? "all");
  }, [searchParams?.q, searchParams?.gov]);

  // ✅ useListings مع Pagination
  const { 
    data: listingsData = { data: [], count: 0, totalPages: 0 }, 
    isLoading,
    isFetching,
  } = useListings({
    categorySlug: isOffersPage ? undefined : slug,
    isOffer: productFilter === 'offers' ? true : productFilter === 'products' ? false : undefined,
    governorateSlug: gov === "all" ? undefined : gov,
    sort: sort === "popularity" ? "popular" : 
          sort === "newest" ? "recent" :
          sort === "price_low" ? "cheapest" :
          sort === "price_high" ? "price_high" :
          sort === "discount" ? "discount" :
          "rating",
    search: search || undefined,
    page: page,
    limit: limit,
  });
  
  console.log('🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍');
  console.log('📦 [CategoryPage] listingsData:', listingsData);
  console.log('📦 [CategoryPage] productFilter:', productFilter);
  console.log('📦 [CategoryPage] page:', page);
  console.log('📦 [CategoryPage] limit:', limit);
  console.log('📦 [CategoryPage] isLoading:', isLoading);
  console.log('📦 [CategoryPage] isFetching:', isFetching);
  console.log('🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍');

  const rows = listingsData.data || [];
  const totalCount = listingsData.count || 0;
  const totalPages = listingsData.totalPages || 1;
  
  console.log('📊 [CategoryPage] rows.length:', rows.length);
  console.log('📊 [CategoryPage] totalCount:', totalCount);
  console.log('📊 [CategoryPage] totalPages:', totalPages);
  
  const { data: stores = [], isLoading: storesLoading } = useStoresByCategory(isOffersPage ? undefined : slug);

  // ✅ فلترة متقدمة
  const items = useMemo(() => {
    console.log('🔍 [items] Starting filter - rows.length:', rows.length);
    let filtered = rows;
    
    if (rating > 0) {
      filtered = filtered.filter((r: any) => Number(r.rating) >= rating);
      console.log('🔍 [items] After rating filter (>=' + rating + '):', filtered.length);
    }
    
    filtered = filtered.filter((r: any) => 
      Number(r.price) >= priceRange[0] && Number(r.price) <= priceRange[1]
    );
    console.log('🔍 [items] After price filter (' + priceRange[0] + '-' + priceRange[1] + '):', filtered.length);
    
    if (showAvailableOnly) {
      filtered = filtered.filter((r: any) => r.is_available !== false);
      console.log('🔍 [items] After availability filter:', filtered.length);
    }
    
    console.log('🔍 [items] Final filtered length:', filtered.length);
    return filtered;
  }, [rows, rating, priceRange, showAvailableOnly]);

  // ✅ إحصائيات
  const allProductsCount = rows.length;
  const productsCount = rows.filter((r: any) => r.is_offer !== true).length;
  const offersCount = rows.filter((r: any) => r.is_offer === true).length;

  console.log('📊 [CategoryPage] Stats:', {
    allProductsCount,
    productsCount,
    offersCount,
    itemsLength: items.length,
    totalCount,
  });

  const stats = {
    total: totalCount,
    filtered: items.length,
    offers: offersCount,
    products: productsCount,
    stores: stores.length,
  };

  // ✅ إعادة تعيين الصفحة عند تغيير الفلاتر
  useEffect(() => {
    setPage(1);
  }, [search, sort, gov, rating, priceRange, showAvailableOnly, productFilter]);

  // ✅ دوال Pagination
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ عرض الكل (إعادة تعيين الفلاتر)
  const showAll = () => {
    setProductFilter('all');
    setGov("all");
    setRating(0);
    setSearch("");
    setPriceRange([0, 1000000]);
    setShowAvailableOnly(false);
    setPage(1);
  };

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);

  const Filters = (
    <div className="space-y-6">
      <div>
        <div className="font-semibold mb-2 text-sm text-pink-600 dark:text-pink-400 flex items-center gap-2">
          <Search className="h-4 w-4" />
          {app.lang === "ar" ? "بحث" : "Search"}
        </div>
        <div className="relative group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-pink-500 transition-colors" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder={t("search_placeholder")} 
            className="ps-9 rounded-xl border-pink-300/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
          />
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2 text-sm text-pink-600 dark:text-pink-400 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {app.lang === "ar" ? "المحافظة" : "Governorate"}
        </div>
        <Select value={gov} onValueChange={setGov}>
          <SelectTrigger className="rounded-xl border-pink-300/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectItem value="all">{t("all_governorates")}</SelectItem>
            {govs.map((g) => <SelectItem key={g.id} value={g.slug}>{app.lang === "ar" ? g.name_ar : g.name_en}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="font-semibold mb-2 text-sm text-pink-600 dark:text-pink-400 flex items-center gap-2">
          <Tag className="h-4 w-4" />
          {app.lang === "ar" ? "نطاق السعر" : "Price Range"}
        </div>
        <div className="px-2">
          <Slider
            min={0}
            max={1000000}
            step={1000}
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            className="[&>span:first-child]:bg-pink-500"
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{priceRange[0].toLocaleString()} SYP</span>
          <span>{priceRange[1].toLocaleString()} SYP</span>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2 text-sm text-pink-600 dark:text-pink-400 flex items-center gap-2">
          <Star className="h-4 w-4" />
          {t("rating")}
        </div>
        <div className="space-y-2">
          {[0, 3, 4, 4.5].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm cursor-pointer group">
              <Checkbox 
                checked={rating === r} 
                onCheckedChange={() => setRating(r)}
                className="border-pink-300/30 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
              />
              <span className="group-hover:text-pink-600 transition-colors">
                {r === 0 ? (app.lang === "ar" ? "الكل" : "All") : `${r}+ ★`}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-pink-500/5 rounded-xl border border-pink-300/20">
        <Checkbox 
          checked={showAvailableOnly} 
          onCheckedChange={(v) => setShowAvailableOnly(v as boolean)}
          className="border-pink-300/30 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
        />
        <span className="text-sm text-pink-600 dark:text-pink-400 font-medium">
          {app.lang === "ar" ? "المنتجات المتاحة فقط" : "Available only"}
        </span>
      </div>

      <Button 
        variant="outline" 
        onClick={showAll}
        className="w-full rounded-xl border-pink-300/30 text-pink-600 hover:bg-pink-500/10 hover:border-pink-400/50 transition-all duration-300 group"
      >
        <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
        {app.lang === "ar" ? "إعادة تعيين" : "Reset"}
      </Button>
    </div>
  );

  if (categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-56 w-full rounded-2xl animate-pulse bg-pink-500/10" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-pink-500/5 p-4 animate-pulse">
              <div className="aspect-square rounded-xl bg-pink-500/10" />
              <div className="h-4 bg-pink-500/10 rounded mt-3 w-3/4" />
              <div className="h-3 bg-pink-500/10 rounded mt-2 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isOffersPage && !category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="relative inline-block">
          <div className="h-24 w-24 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto animate-bounce">
            <Package className="h-12 w-12 text-pink-500/40" />
          </div>
          <div className="absolute -inset-4 rounded-full bg-pink-500/5 animate-ping" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-6">
          {app.lang === "ar" ? "التصنيف غير موجود" : "Category not found"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          {app.lang === "ar" ? "عذراً، التصنيف الذي تبحث عنه غير موجود" : "Sorry, the category you're looking for doesn't exist"}
        </p>
        <Link to="/">
          <Button className="mt-6 rounded-xl bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </Link>
      </div>
    );
  }

  const Icon = category ? getCategoryIcon(category.icon) : getCategoryIcon("default");
  const categoryName = category 
    ? (app.lang === "ar" ? category.name_ar : category.name_en)
    : (app.lang === "ar" ? "🔥 جميع العروض" : "🔥 All Offers");
  const categoryImage = category?.image_url || null;
  const isArabic = app.lang === "ar";

  const categoryDescription = isOffersPage
    ? (app.lang === "ar" 
        ? "اكتشف أفضل العروض والخصومات الحصرية في السوق لعندك. تخفيضات تصل إلى 70% على مجموعة واسعة من المنتجات."
        : "Discover the best exclusive offers and discounts at Souqi. Up to 70% off on a wide range of products.")
    : (category 
        ? (app.lang === "ar" 
            ? (category.description_ar || `استكشف مجموعة مميزة من ${categoryName} في السوق لعندك. تشكيلة واسعة من المنتجات والخدمات بجودة عالية وأسعار تنافسية.`)
            : (category.description_en || `Explore a unique collection of ${categoryName} at Souqi. A wide range of products and services with high quality and competitive prices.`))
        : "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-500/5 via-transparent to-rose-500/5">
      
      {/* ===== Header - مع لمسات وردية ===== */}
      <div className="relative h-[320px] md:h-[400px] overflow-hidden bg-[#1b433e]">
        {categoryImage ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src={categoryImage} 
              alt={categoryName} 
              className="h-full w-full object-cover scale-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e2a]/80 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a655f] to-[#1a4f4a]" />
        )}
        
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-7xl px-4 w-full pb-8 text-white relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Link to="/" className="text-white/80 hover:text-white transition-colors text-xs font-medium flex items-center gap-1 group bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform duration-300" />
                {app.lang === "ar" ? "الرئيسية" : "Home"}
              </Link>
              <span className="text-white/40 text-xs">/</span>
              <Link to="/categories" className="text-white/70 hover:text-white transition-colors text-xs font-medium hover:underline underline-offset-2">
                {app.lang === "ar" ? "التصنيفات" : "Categories"}
              </Link>
              <span className="text-white/40 text-xs">/</span>
              <span className="text-white font-bold text-xs bg-pink-500/30 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-pink-400/40">
                {categoryName}
              </span>
            </div>
            
            <div className="flex items-end justify-between mt-3 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-400/30 to-rose-400/30 blur-lg animate-pulse" />
                  <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-black/30 border border-white/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Icon className="h-8 w-8 md:h-10 md:w-10 text-white animate-float" />
                    <Sparkle className="absolute -top-2 -right-2 h-4 w-4 text-pink-300 animate-spin-slow" />
                    <CircleDot className="absolute -bottom-1 -left-2 h-3 w-3 text-pink-300 animate-pulse" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-2xl tracking-tight flex items-center gap-3">
                    {categoryName}
                    {!isOffersPage && (
                      <Badge className="bg-gradient-to-r from-pink-400/30 to-rose-400/30 text-white border border-white/30 backdrop-blur-sm text-[10px] px-2.5 py-1 rounded-full font-bold animate-pulse">
                        <Rocket className="h-3 w-3 mr-1 inline animate-bounce" />
                        {app.lang === "ar" ? "رئيسي" : "Main"}
                      </Badge>
                    )}
                  </h1>
                  
                  <p className="text-white/95 text-sm md:text-base max-w-2xl leading-relaxed mt-1.5 drop-shadow-lg font-medium tracking-wide">
                    {categoryDescription}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <AnimatedBadge count={stats.total} label={isArabic ? "منتج" : "products"} icon={Package} color="text-pink-300" />
                    <AnimatedBadge count={stats.offers} label={isArabic ? "عرض" : "offers"} icon={Flame} color="text-orange-300" />
                    <AnimatedBadge count={stats.stores} label={isArabic ? "متجر" : "stores"} icon={Store} color="text-pink-300" />
                  </div>
                </div>
              </div>
              
              {isOffersPage && (
                <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 text-sm px-4 py-2 shadow-lg shadow-pink-500/30 animate-pulse rounded-full font-bold flex items-center gap-2">
                  <Flame className="h-4 w-4 animate-bounce" />
                  {isArabic ? "🔥 عروض حصرية" : "🔥 Exclusive Offers"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tabs - مع لمسات وردية ===== */}
      <div className="border-b border-pink-300/20 dark:border-pink-400/20 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 flex gap-1">
          {([
            { id: "products" as const, icon: Package, label: t("products_tab"), count: stats.total },
            { id: "stores" as const, icon: Store, label: t("stores_tab"), count: stats.stores },
          ]).map((tItem) => (
            <button 
              key={tItem.id} 
              onClick={() => setTab(tItem.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 font-semibold text-sm transition-all duration-300 relative group",
                tab === tItem.id 
                  ? "border-pink-500 text-pink-600 dark:text-pink-400" 
                  : "border-transparent text-muted-foreground hover:text-pink-600 hover:border-pink-400/30"
              )}
            >
              <tItem.icon className={cn(
                "h-4 w-4 transition-transform duration-300",
                tab === tItem.id ? "animate-pulse" : "group-hover:scale-110"
              )} />
              {tItem.label}
              <Badge className={cn(
                "text-[10px] px-1.5 py-0 transition-all duration-300",
                tab === tItem.id 
                  ? "bg-pink-500 text-white" 
                  : "bg-pink-500/10 text-pink-600 group-hover:bg-pink-500/20"
              )}>
                {tItem.count}
              </Badge>
              {tab === tItem.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6 grid lg:grid-cols-[300px_1fr] gap-6">
        
        {/* ===== Sidebar Filters - مع لمسات وردية ===== */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-2xl bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-sm border border-pink-300/20 p-5 shadow-xl shadow-pink-500/5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                <Filter className="h-4 w-4 animate-pulse" />
                {t("filters")}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={showAll}
                className="text-pink-600 hover:bg-pink-500/10 rounded-xl"
              >
                <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 hover:rotate-180" />
              </Button>
            </div>
            {Filters}
          </div>
        </aside>

        {/* ===== Main Content ===== */}
        <div>
          {/* ===== Toolbar ===== */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2 rounded-xl border-pink-300/30 hover:border-pink-400/50 hover:bg-pink-500/5 transition-all duration-300">
                    <SlidersHorizontal className="h-4 w-4 text-pink-500" /> 
                    {t("filters")}
                  </Button>
                </SheetTrigger>
                <SheetContent side={app.lang === "ar" ? "right" : "left"} className="w-80 overflow-auto border-l-pink-300/20">
                  <SheetTitle className="text-pink-600 flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {t("filters")}
                  </SheetTitle>
                  <div className="mt-6">{Filters}</div>
                </SheetContent>
              </Sheet>
              
              {/* ✅ Product Filter Tabs */}
              {tab === "products" && (
                <ProductFilterTabs
                  value={productFilter}
                  onChange={setProductFilter}
                  counts={{
                    all: allProductsCount,
                    products: productsCount,
                    offers: offersCount,
                  }}
                  lang={app.lang}
                />
              )}
              
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-pink-600">{items.length}</span>
                {isArabic ? "منتج" : "products"}
                {search && (
                  <Badge className="bg-pink-500/10 text-pink-600 border-pink-300/30">
                    <Search className="h-3 w-3 mr-1" />
                    {search}
                  </Badge>
                )}
              </div>
            </div>
            
            {tab === "products" && (
              <div className="flex items-center gap-2">
                {/* ViewMode Toggle */}
                <div className="flex items-center bg-white dark:bg-[#1e293b] rounded-xl border border-pink-300/30 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-1.5 rounded-lg transition-all duration-300",
                      viewMode === "grid" 
                        ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30" 
                        : "text-muted-foreground hover:bg-pink-500/10 hover:text-pink-600"
                    )}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-1.5 rounded-lg transition-all duration-300",
                      viewMode === "list" 
                        ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30" 
                        : "text-muted-foreground hover:bg-pink-500/10 hover:text-pink-600"
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                
                <SortDropdown
                  value={sort}
                  onChange={(val) => setSort(val as any)}
                  lang={app.lang}
                />
              </div>
            )}
          </div>

          {/* ===== Results Count ===== */}
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground border-b border-pink-300/20 pb-3">
            <span>
              {isArabic 
                ? `عرض ${startIndex}-${endIndex} من ${totalCount} منتج` 
                : `Showing ${startIndex}-${endIndex} of ${totalCount} products`}
            </span>
            <div className="flex items-center gap-2">
              {items.length !== totalCount && (
                <Badge className="bg-pink-500/10 text-pink-600 border-pink-300/30">
                  {isArabic ? "مفلتر" : "Filtered"}
                </Badge>
              )}
              {isFetching && (
                <div className="flex items-center gap-1 text-pink-500">
                  <div className="h-3 w-3 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">{isArabic ? "جاري التحميل..." : "Loading..."}</span>
                </div>
              )}
            </div>
          </div>

          {/* ===== Products Grid ===== */}
          {tab === "products" ? (
            isLoading ? (
              <div className={cn(
                "grid gap-4",
                viewMode === "grid" 
                  ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3" 
                  : "grid-cols-1"
              )}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/80 dark:bg-[#1e293b]/80 p-4 animate-pulse border border-pink-300/20">
                    <div className="aspect-square rounded-xl bg-pink-500/10" />
                    <div className="h-4 bg-pink-500/10 rounded mt-3 w-3/4" />
                    <div className="h-3 bg-pink-500/10 rounded mt-2 w-1/2" />
                    <div className="flex items-center gap-2 mt-3">
                      <div className="h-4 bg-pink-500/10 rounded w-1/3" />
                      <div className="h-4 bg-pink-500/10 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-3xl bg-white/80 dark:bg-[#1e293b]/80 border-2 border-dashed border-pink-300/30 p-16 text-center">
                <div className="relative inline-block">
                  <div className="h-20 w-20 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto animate-bounce">
                    <Package className="h-10 w-10 text-pink-500/40" />
                  </div>
                  <div className="absolute -inset-4 rounded-full bg-pink-500/5 animate-ping" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
                  {app.lang === "ar" ? "لا توجد نتائج" : "No results"}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {app.lang === "ar" ? "جرّب تعديل الفلاتر أو البحث" : "Try changing your filters or search"}
                </p>
                <Button 
                  variant="outline" 
                  onClick={showAll}
                  className="mt-4 rounded-xl border-pink-300/30 text-pink-600 hover:bg-pink-500/10 hover:border-pink-400/50 transition-all duration-300 group"
                >
                  <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  {app.lang === "ar" ? "إعادة تعيين الفلاتر" : "Reset filters"}
                </Button>
              </div>
            ) : (
              <>
                <div className={cn(
                  "grid gap-4",
                  viewMode === "grid" 
                    ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3" 
                    : "grid-cols-1"
                )}>
                  {items.map((i: any, index: number) => {
                    console.log('🎯 [RENDER] Rendering product:', i.id, i.title_ar);
                    return (
                      <div 
                        key={i.id} 
                        className="animate-fade-up"
                        style={{ animationDelay: `${(index % 9) * 60}ms` }}
                      >
                        <ListingCard item={i} viewMode={viewMode} />
                      </div>
                    );
                  })}
                </div>

                {/* ===== Pagination - مع لمسات وردية ===== */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1 || isFetching}
                      className="rounded-xl border-pink-300/30 hover:border-pink-400/50 hover:bg-pink-500/5 transition-all duration-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        if (pageNum > totalPages) return null;
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNum)}
                            disabled={isFetching}
                            className={cn(
                              "min-w-[36px] rounded-xl transition-all duration-300",
                              pageNum === page 
                                ? "bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-500/30" 
                                : "border-pink-300/30 hover:border-pink-400/50 hover:bg-pink-500/5"
                            )}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages || isFetching}
                      className="rounded-xl border-pink-300/30 hover:border-pink-400/50 hover:bg-pink-500/5 transition-all duration-300"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )
          ) : (
            // ===== Stores Tab - مع لمسات وردية =====
            storesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/80 dark:bg-[#1e293b]/80 p-4 animate-pulse border border-pink-300/20">
                    <div className="h-32 bg-pink-500/10 rounded-xl" />
                    <div className="flex items-center gap-3 mt-3">
                      <div className="h-14 w-14 rounded-full bg-pink-500/10" />
                      <div className="flex-1">
                        <div className="h-4 bg-pink-500/10 rounded w-3/4" />
                        <div className="h-3 bg-pink-500/10 rounded w-1/2 mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : stores.length === 0 ? (
              <div className="rounded-3xl bg-white/80 dark:bg-[#1e293b]/80 border-2 border-dashed border-pink-300/30 p-16 text-center">
                <div className="relative inline-block">
                  <div className="h-20 w-20 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto animate-bounce">
                    <Store className="h-10 w-10 text-pink-500/40" />
                  </div>
                  <div className="absolute -inset-4 rounded-full bg-pink-500/5 animate-ping" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
                  {app.lang === "ar" ? "لا يوجد متاجر بعد" : "No stores yet"}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {app.lang === "ar" ? "سيتم إضافة المتاجر قريباً" : "Stores will be added soon"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {stores.map((s: any, index: number) => (
                  <div 
                    key={s.id} 
                    className="animate-fade-up"
                    style={{ animationDelay: `${(index % 9) * 60}ms` }}
                  >
                    <Link to="/store/$id" params={{ id: s.id }} className="group block rounded-2xl bg-white dark:bg-[#1e293b] border border-pink-300/20 hover:border-pink-400/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20 overflow-hidden">
                      <div className="relative h-32 bg-gradient-to-br from-pink-500 to-rose-500 overflow-hidden">
                        {s.store_cover_url && (
                          <img src={s.store_cover_url} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                      <div className="p-4 -mt-8 relative">
                        <div className="h-14 w-14 rounded-xl bg-white dark:bg-[#1e293b] border-4 border-white dark:border-[#1e293b] shadow-md overflow-hidden grid place-items-center text-pink-600 font-black text-xl group-hover:scale-110 transition-transform duration-300">
                          {s.store_logo_url || s.avatar_url ? (
                            <img src={s.store_logo_url || s.avatar_url!} className="h-full w-full object-cover" alt="" />
                          ) : ((s.store_name || s.full_name || "?")[0])}
                        </div>
                        <div className="mt-2 font-bold line-clamp-1 group-hover:text-pink-600 transition-colors">
                          {s.store_name || s.full_name || (app.lang === "ar" ? "متجر" : "Store")}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2 min-h-8">
                          {s.store_description || (app.lang === "ar" ? "متجر على سوقي" : "A store on Souqi")}
                        </div>
                        <div className="flex items-center gap-3 mt-3 text-xs">
                          <span className="flex items-center gap-1 text-pink-600">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {Number(s.avg_rating || 0).toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">
                            <Package className="h-3.5 w-3.5 inline mr-1" />
                            {s.listing_count || 0} {t("products_tab")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* ===== CSS Animations ===== */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.5s ease-out forwards; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .animate-bounce { animation: bounce 0.5s ease-in-out infinite; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
}

function EmptyBlock({ title }: { title: string }) {
  const app = useApp();
  return (
    <div className="rounded-2xl bg-card p-12 text-center shadow-card">
      <div className="text-lg font-semibold">{title}</div>
      <p className="text-muted-foreground text-sm mt-1">{app.lang === "ar" ? "جرّب تعديل الفلاتر" : "Try changing your filters"}</p>
    </div>
  );
}