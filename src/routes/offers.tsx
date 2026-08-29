// src/routes/offers.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef, lazy, Suspense } from "react";
import { 
  Filter, Search, MapPin, Flame, Sparkles, Tag, 
  Grid3X3, List, ArrowUpDown, Star, ChevronDown, Check,
  RefreshCw, Package, Store, Clock, TrendingUp, BadgePercent,
  ChevronLeft, Gift, Percent, LayoutGrid, ChevronRight
} from "lucide-react";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useGovernorates, useListings, useProductOffers, useCategories } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/OptimizedImage";

// ✅ ✅ ✅ Lazy Loading لـ ListingCard
const ListingCard = lazy(() => import("@/components/ListingCard"));

export const Route = createFileRoute("/offers")({
  component: OffersPage,
  head: () => ({ meta: [{ title: "🎁 جميع العروض — السوق لعندك" }] }),
});

// ============================================================
// ✅ SortDropdown
// ============================================================
function SortDropdown({ value, onChange, lang }: { value: string; onChange: (val: string) => void; lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: 'newest', label: lang === 'ar' ? 'الأحدث' : 'Newest', icon: Clock, color: 'text-pink-500' },
    { value: 'popularity', label: lang === 'ar' ? 'الأكثر رواجاً' : 'Most Popular', icon: TrendingUp, color: 'text-pink-400' },
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
// ✅ Offers Page
// ============================================================
function OffersPage() {
  const app = useApp();
  const t = useT();
  const isArabic = app.lang === "ar";
  
  const { data: govs = [] } = useGovernorates();
  const { data: categories = [] } = useCategories();

  // ✅ State
  const [gov, setGov] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "popularity" | "price_low" | "price_high" | "discount" | "rating">("newest");
  const [rating, setRating] = useState(0);
  const [search, setSearch] = useState("");
  
  // ✅ ✅ ✅ نطاق السعر - باستخدام Inputs (نفس طريقة التصنيفات)
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // ✅ Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // ✅ جلب بيانات تصنيف "offers"
  const offersCategory = useMemo(() => {
    return categories.find((c: any) => c.slug === "offers");
  }, [categories]);

  const categoryImage = offersCategory?.image_url || null;
  const categoryName = offersCategory 
    ? (app.lang === "ar" ? offersCategory.name_ar : offersCategory.name_en)
    : (app.lang === "ar" ? "🔥 جميع العروض" : "🔥 All Offers");

  // ✅ إعادة تعيين الصفحة عند تغيير الفلاتر
  useEffect(() => {
    setPage(1);
  }, [search, sort, gov, rating, minPrice, maxPrice, showAvailableOnly]);

  // ✅ جلب العروض التخفيضية من listings مع Pagination
  const { 
    data: listingsData = { data: [], count: 0, totalPages: 0 }, 
    isLoading: listingsLoading,
    isFetching,
  } = useListings({
    isOffer: true,
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

  // ✅ جلب العروض الترويجية من product_offers (بدون Pagination لأنها قليلة)
// ✅ الكود المُصحّح
// ✅ جلب governorateId من gov slug
const governorateId = useMemo(() => {
  if (gov === "all") return undefined;
  const selectedGov = govs.find((g: any) => g.slug === gov);
  return selectedGov?.id;
}, [gov, govs]);

// ✅ جلب العروض الترويجية مع فلتر المحافظة
const { data: promoOffersRaw = [], isLoading: promoLoading } = useProductOffers({ 
  isActive: true,
  limit: 100,
  governorateId: governorateId, // ✅ إضافة فلتر المحافظة
});

  // ✅ ترتيب العروض الترويجية حسب الـ sort
  const promoOffers = useMemo(() => {
    if (!promoOffersRaw || promoOffersRaw.length === 0) return [];
    
    const sorted = [...promoOffersRaw];
    
    switch (sort) {
      case 'price_low':
        sorted.sort((a, b) => {
          const priceA = a.products?.[0]?.price || 0;
          const priceB = b.products?.[0]?.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price_high':
        sorted.sort((a, b) => {
          const priceA = a.products?.[0]?.price || 0;
          const priceB = b.products?.[0]?.price || 0;
          return priceB - priceA;
        });
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        sorted.sort((a, b) => (b.products?.[0]?.rating || 0) - (a.products?.[0]?.rating || 0));
        break;
      case 'discount':
        sorted.sort((a, b) => {
          const discountA = a.buy_quantity && a.get_quantity 
            ? (a.get_quantity / (a.buy_quantity + a.get_quantity)) * 100 
            : 0;
          const discountB = b.buy_quantity && b.get_quantity 
            ? (b.get_quantity / (b.buy_quantity + b.get_quantity)) * 100 
            : 0;
          return discountB - discountA;
        });
        break;
      case 'popularity':
      default:
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    
    return sorted;
  }, [promoOffersRaw, sort]);

  const rows = listingsData.data || [];
  const totalCount = listingsData.count || 0;
  const totalPages = listingsData.totalPages || 1;

  // ✅ دمج العروض (تخفيضية + ترويجية)
  const allOffers = useMemo(() => {
    const discountItems = rows.map((item: any) => ({
      ...item,
      is_offer: true,
      is_promo_offer: false,
      offer_source: 'discount',
    }));
    
    const promoItems = promoOffers.map((offer: any) => {
      let mainProduct = null;
      
      if (Array.isArray(offer.products) && offer.products.length > 0) {
        mainProduct = offer.products.find((p: any) => p.id === offer.listing_id) || offer.products[0];
      } else if (offer.products && typeof offer.products === 'object' && !Array.isArray(offer.products)) {
        mainProduct = offer.products;
      }
      
      return {
        ...mainProduct,
        id: offer.id,
        listing_id: offer.listing_id,
        title_ar: offer.display_text_ar || mainProduct?.title_ar || (isArabic ? "عرض ترويجي" : "Promo Offer"),
        title_en: offer.display_text_en || mainProduct?.title_en || (isArabic ? "عرض ترويجي" : "Promo Offer"),
        price: mainProduct?.price || 0,
        old_price: null,
        discount_percent: null,
        is_offer: false,
        is_promo_offer: true,
        offer_source: 'promo',
        cover_url: mainProduct?.cover_url || null,
        owner_id: offer.store_id,
        created_at: offer.created_at,
        offer_type: offer.offer_type,
        buy_quantity: offer.buy_quantity,
        get_quantity: offer.get_quantity,
        free_listing_id: offer.free_listing_id,
        expires_at: offer.expires_at,
        is_featured: offer.is_featured,
        products: offer.products || [],
        colors: mainProduct?.colors || [],
        variations: mainProduct?.variations || [],
        rating: mainProduct?.rating || 0,
        profile: mainProduct?.profile || null,
        variation_ids: offer.variation_ids || [],
        result_variation_ids: offer.result_variation_ids || [],
        display_text_ar: offer.display_text_ar,
        display_text_en: offer.display_text_en,
      };
    });

    let all = [...discountItems, ...promoItems];

    if (sort === 'price_low') {
      all.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price_high') {
      all.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === 'newest') {
      all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'rating') {
      all.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'discount') {
      all.sort((a, b) => {
        const discountA = a.discount_percent || 
          (a.buy_quantity && a.get_quantity ? (a.get_quantity / (a.buy_quantity + a.get_quantity)) * 100 : 0);
        const discountB = b.discount_percent || 
          (b.buy_quantity && b.get_quantity ? (b.get_quantity / (b.buy_quantity + b.get_quantity)) * 100 : 0);
        return discountB - discountA;
      });
    }

    return all;
  }, [rows, promoOffers, isArabic, sort]);

  // ✅ فلترة متقدمة (السعر، التقييم، التوفر، البحث)
  const items = useMemo(() => {
    let filtered = allOffers;
    
    // فلتر البحث
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((item: any) => 
        (item.title_ar?.toLowerCase().includes(s) || 
         item.title_en?.toLowerCase().includes(s) ||
         item.display_text_ar?.toLowerCase().includes(s) ||
         item.display_text_en?.toLowerCase().includes(s))
      );
    }
    
    // فلتر التقييم
    if (rating > 0) {
      filtered = filtered.filter((r: any) => Number(r.rating) >= rating);
    }
    
    // ✅ ✅ ✅ فلتر السعر باستخدام minPrice و maxPrice (نفس طريقة التصنيفات)
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || 10000000;
    
    filtered = filtered.filter((r: any) => {
      const price = Number(r.price);
      return price >= min && price <= max;
    });
    
    // فلتر التوفر
    if (showAvailableOnly) {
      filtered = filtered.filter((r: any) => r.is_available !== false);
    }
    
    return filtered;
  }, [allOffers, search, rating, minPrice, maxPrice, showAvailableOnly]);

  // ✅ عرض الكل
  const showAll = () => {
    setGov("all");
    setRating(0);
    setSearch("");
    setMinPrice(0);
    setMaxPrice(10000000);
    setShowAvailableOnly(false);
    setPage(1);
  };

  // ✅ Pagination Functions
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ إحصائيات
  const stats = useMemo(() => {
    const total = allOffers.length;
    const discountCount = allOffers.filter((i: any) => i.offer_source === 'discount').length;
    const promoCount = allOffers.filter((i: any) => i.offer_source === 'promo').length;
    return { total, discountCount, promoCount, filtered: items.length };
  }, [allOffers, items]);

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);

  const Filters = (
    <div className="space-y-6">
      <div>
        <div className="font-semibold mb-2 text-sm text-pink-600 dark:text-pink-400 flex items-center gap-2">
          <Search className="h-4 w-4" />
          {isArabic ? "بحث" : "Search"}
        </div>
        <div className="relative group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-pink-500 transition-colors" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder={isArabic ? "🔍 ابحث عن عرض..." : "🔍 Search for offer..."} 
            className="ps-9 rounded-xl border-pink-300/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
          />
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2 text-sm text-pink-600 dark:text-pink-400 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {isArabic ? "المحافظة" : "Governorate"}
        </div>
        <Select value={gov} onValueChange={setGov}>
          <SelectTrigger className="rounded-xl border-pink-300/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectItem value="all">{isArabic ? "جميع المحافظات" : "All Governorates"}</SelectItem>
            {govs.map((g) => <SelectItem key={g.id} value={g.slug}>{isArabic ? g.name_ar : g.name_en}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* ✅ ✅ ✅ نطاق السعر - Inputs (نفس طريقة التصنيفات) */}
      <div>
        <div className="font-semibold mb-2 text-sm text-pink-600 dark:text-pink-400 flex items-center gap-2">
          <Tag className="h-4 w-4" />
          {isArabic ? "نطاق السعر" : "Price Range"}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="number"
              value={minPrice === 0 ? "" : minPrice}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : Number(e.target.value);
                setMinPrice(val);
                setPage(1);
              }}
              placeholder={isArabic ? "الحد الأدنى" : "Min"}
              className="h-10 rounded-xl px-3 border-pink-300/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
              min={0}
            />
          </div>
          <span className="text-muted-foreground text-sm font-medium px-1">-</span>
          <div className="relative flex-1">
            <Input
              type="number"
              value={maxPrice === 10000000 ? "" : maxPrice}
              onChange={(e) => {
                const val = e.target.value === "" ? 10000000 : Number(e.target.value);
                setMaxPrice(val);
                setPage(1);
              }}
              placeholder={isArabic ? "الحد الأعلى" : "Max"}
              className="h-10 rounded-xl px-3 border-pink-300/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
              min={0}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5 text-[10px] text-muted-foreground">
          <span>{minPrice === 0 ? "0" : formatPrice(minPrice, app.currency, app.lang)}</span>
          <span className="text-pink-500 text-[8px] animate-pulse">●</span>
          <span>{maxPrice === 10000000 ? (isArabic ? "غير محدود" : "Unlimited") : formatPrice(maxPrice, app.currency, app.lang)}</span>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2 text-sm text-pink-600 dark:text-pink-400 flex items-center gap-2">
          <Star className="h-4 w-4" />
          {isArabic ? "التقييم" : "Rating"}
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
                {r === 0 ? (isArabic ? "الكل" : "All") : `${r}+ ★`}
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
          {isArabic ? "المتاحة فقط" : "Available only"}
        </span>
      </div>

      <Button 
        variant="outline" 
        onClick={showAll}
        className="w-full rounded-xl border-pink-300/30 text-pink-600 hover:bg-pink-500/10 hover:border-pink-400/50 transition-all duration-300 group"
      >
        <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
        {isArabic ? "إعادة تعيين" : "Reset"}
      </Button>
    </div>
  );

  const isLoading = listingsLoading || promoLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-500/5 via-transparent to-rose-500/5">
      
      {/* ===== Header ===== */}
      <div className="relative h-[280px] md:h-[320px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {categoryImage ? (
            <>
              <OptimizedImage
                src={categoryImage}
                alt={categoryName}
                width={1200}
                height={400}
                quality={85}
                priority={true}
                objectFit="cover"
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e2a]/80 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-10" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a655f] to-[#1a4f4a]">
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
              <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-10" />
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white relative z-10">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-black/30 border border-white/30">
                <Flame className="h-8 w-8 text-white animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black drop-shadow-2xl flex items-center gap-3">
                {categoryName}
                <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 text-sm px-4 py-2 shadow-lg shadow-orange-500/30 animate-pulse rounded-full font-bold flex items-center gap-2">
                  <Percent className="h-4 w-4 animate-bounce" />
                  {stats.total} {isArabic ? "عرض" : "Offers"}
                </Badge>
              </h1>
            </div>
            <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto drop-shadow-lg font-medium">
              {isArabic 
                ? "اكتشف أفضل العروض والخصومات الحصرية في السوق لعندك. تخفيضات تصل إلى 70% على مجموعة واسعة من المنتجات."
                : "Discover the best exclusive offers and discounts at Souqi. Up to 70% off on a wide range of products."}
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              <Badge className="bg-pink-500/30 text-white border border-pink-400/30 backdrop-blur-sm px-4 py-2">
                <Package className="h-4 w-4 mr-1" />
                {stats.discountCount} {isArabic ? "تخفيض" : "Discounts"}
              </Badge>
              <Badge className="bg-purple-500/30 text-white border border-purple-400/30 backdrop-blur-sm px-4 py-2">
                <Gift className="h-4 w-4 mr-1" />
                {stats.promoCount} {isArabic ? "ترويجي" : "Promo"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6 grid lg:grid-cols-[300px_1fr] gap-6">
        
        {/* ===== Sidebar Filters ===== */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-2xl bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-sm border border-pink-300/20 p-5 shadow-xl shadow-pink-500/5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                <Filter className="h-4 w-4 animate-pulse" />
                {isArabic ? "فلاتر" : "Filters"}
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
                    <Filter className="h-4 w-4 text-pink-500" /> 
                    {isArabic ? "فلاتر" : "Filters"}
                  </Button>
                </SheetTrigger>
                <SheetContent side={isArabic ? "right" : "left"} className="w-80 overflow-auto border-l-pink-300/20">
                  <SheetTitle className="text-pink-600 flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {isArabic ? "فلاتر" : "Filters"}
                  </SheetTitle>
                  <div className="mt-6">{Filters}</div>
                </SheetContent>
              </Sheet>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-pink-600">{items.length}</span>
                {isArabic ? "عرض" : "offers"}
                {search && (
                  <Badge className="bg-pink-500/10 text-pink-600 border-pink-300/30">
                    <Search className="h-3 w-3 mr-1" />
                    {search}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 bg-pink-500/5 dark:bg-pink-500/10 rounded-xl p-1 border border-pink-300/20">
                <Badge className="bg-pink-500/20 text-pink-600 border-0 text-[10px] px-3 py-1 flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  {stats.discountCount} {isArabic ? "تخفيض" : "Discount"}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-600 border-0 text-[10px] px-3 py-1 flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  {stats.promoCount} {isArabic ? "ترويجي" : "Promo"}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
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
          </div>

          {/* ===== Results Count ===== */}
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground border-b border-pink-300/20 pb-3">
            <span>
              {isArabic 
                ? `عرض ${startIndex}-${endIndex} من ${totalCount} عرض` 
                : `Showing ${startIndex}-${endIndex} of ${totalCount} offers`}
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

          {/* ===== Offers Grid ===== */}
          {isLoading ? (
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
                {isArabic ? "لا توجد عروض" : "No offers"}
              </h3>
              <p className="text-muted-foreground mt-1">
                {isArabic ? "جرّب تعديل الفلاتر أو البحث" : "Try changing your filters or search"}
              </p>
              <Button 
                variant="outline" 
                onClick={showAll}
                className="mt-4 rounded-xl border-pink-300/30 text-pink-600 hover:bg-pink-500/10 hover:border-pink-400/50 transition-all duration-300 group"
              >
                <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                {isArabic ? "إعادة تعيين الفلاتر" : "Reset filters"}
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
                  let offerBadge = null;
                  if (i.offer_source === 'promo') {
                    offerBadge = (
                      <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 text-[9px] px-2 py-0.5 z-10 animate-pulse">
                        <Gift className="h-2.5 w-2.5 inline mr-0.5" />
                        {isArabic ? "ترويجي" : "Promo"}
                      </Badge>
                    );
                  } else if (i.discount_percent && i.discount_percent > 0) {
                    offerBadge = (
                      <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[9px] px-2 py-0.5 z-10 animate-pulse">
                        <Percent className="h-2.5 w-2.5 inline mr-0.5" />
                        {i.discount_percent}% OFF
                      </Badge>
                    );
                  } else if (i.is_offer) {
                    offerBadge = (
                      <Badge className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 text-[9px] px-2 py-0.5 z-10 animate-pulse">
                        <Flame className="h-2.5 w-2.5 inline mr-0.5" />
                        {isArabic ? "عرض" : "Offer"}
                      </Badge>
                    );
                  }
                  
                  return (
                    <div 
                      key={i.id} 
                      className="animate-fade-up relative"
                      style={{ animationDelay: `${(index % 9) * 60}ms` }}
                    >
                      {offerBadge}
                      <Suspense fallback={<ProductSkeleton />}>
                        <ListingCard item={i} variant={viewMode} />
                      </Suspense>
                    </div>
                  );
                })}
              </div>

              {/* ===== Pagination ===== */}
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

// ============================================================
// Product Skeleton
// ============================================================
function ProductSkeleton() {
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-[#1e293b]/80 p-4 animate-pulse border border-pink-300/20">
      <div className="aspect-square rounded-xl bg-pink-500/10" />
      <div className="h-4 bg-pink-500/10 rounded mt-3 w-3/4" />
      <div className="h-3 bg-pink-500/10 rounded mt-2 w-1/2" />
      <div className="flex items-center gap-2 mt-3">
        <div className="h-4 bg-pink-500/10 rounded w-1/3" />
        <div className="h-4 bg-pink-500/10 rounded w-1/4" />
      </div>
    </div>
  );
}

export default OffersPage;