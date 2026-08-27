// src/routes/category/$slug.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useGovernorates, useListings, useStoresByCategory, useCategories, useProductOffers } from "@/lib/queries";
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
// ✅ SortDropdown
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
// ✅ Product Filter Buttons
// ============================================================
function ProductFilterButtons({ 
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
  const buttons = [
    { id: 'all' as const, label: lang === 'ar' ? 'الكل' : 'All', icon: LayoutGrid, count: counts.all, color: 'from-pink-500 to-rose-500' },
    { id: 'products' as const, label: lang === 'ar' ? 'منتجات' : 'Products', icon: Package, count: counts.products, color: 'from-blue-500 to-indigo-500' },
    { id: 'offers' as const, label: lang === 'ar' ? 'عروض' : 'Offers', icon: Flame, count: counts.offers, color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="flex items-center gap-1 bg-pink-500/5 dark:bg-pink-500/10 rounded-xl p-1 border border-pink-300/20">
      {buttons.map((btn) => {
        const Icon = btn.icon;
        const isActive = value === btn.id;
        return (
          <button
            key={btn.id}
            onClick={() => onChange(btn.id)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5",
              isActive 
                ? `bg-gradient-to-r ${btn.color} text-white shadow-lg shadow-${btn.color.split(' ')[1]?.split('-')[1] || 'pink'}-500/30` 
                : "text-[#0d2e2a] dark:text-white/60 hover:bg-pink-500/10 hover:text-pink-600"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {btn.label}
            <Badge className={cn(
              "text-[9px] px-1.5 py-0",
              isActive 
                ? "bg-white/20 text-white" 
                : "bg-pink-500/10 dark:bg-pink-500/30 text-pink-600 dark:text-pink-400"
            )}>
              {btn.count}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// ✅ Stats Badge
// ============================================================
const AnimatedBadge = ({ count, label, icon: Icon, color }: any) => (
  <div className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-300/30 hover:bg-pink-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20">
    <Icon className={cn("h-4 w-4 animate-pulse", color || "text-pink-500")} />
    <span className="text-sm font-bold text-pink-600 dark:text-pink-400">{count}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

// ============================================================
// ✅ Offer Type Filter Buttons
// ============================================================
function OfferTypeButtons({ 
  value, 
  onChange, 
  lang 
}: { 
  value: 'all' | 'promotional' | 'discount'; 
  onChange: (val: 'all' | 'promotional' | 'discount') => void;
  lang: string;
}) {
  const buttons = [
    { id: 'all' as const, label: lang === 'ar' ? 'الكل' : 'All', icon: LayoutGrid, color: 'from-pink-500 to-rose-500' },
    { id: 'promotional' as const, label: lang === 'ar' ? '🎁 ترويجية' : '🎁 Promotional', icon: Gift, color: 'from-purple-500 to-violet-500' },
    { id: 'discount' as const, label: lang === 'ar' ? '🔥 تخفيضية' : '🔥 Discount', icon: Flame, color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="flex items-center gap-1 bg-pink-500/5 dark:bg-pink-500/10 rounded-xl p-1 border border-pink-300/20">
      {buttons.map((btn) => {
        const Icon = btn.icon;
        const isActive = value === btn.id;
        return (
          <button
            key={btn.id}
            onClick={() => onChange(btn.id)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5",
              isActive 
                ? `bg-gradient-to-r ${btn.color} text-white shadow-lg shadow-${btn.color.split(' ')[1]?.split('-')[1] || 'pink'}-500/30` 
                : "text-[#0d2e2a] dark:text-white/60 hover:bg-pink-500/10 hover:text-pink-600"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {btn.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// ✅ Category Page
// ============================================================
function CategoryPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const app = useApp();
  const t = useT();
  
  // ✅ إذا كان slug === "offers"، حول إلى /offers
  useEffect(() => {
    if (slug === "offers") {
      navigate({ to: "/offers" });
    }
  }, [slug, navigate]);
  
  const { data: govs = [] } = useGovernorates();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const searchParams = Route.useSearch() as { q?: string; gov?: string } | undefined;

  // ✅ State
  const [tab, setTab] = useState<"products" | "stores">("products");
  const [productFilter, setProductFilter] = useState<'all' | 'products' | 'offers'>('all');
  const [offerType, setOfferType] = useState<'all' | 'promotional' | 'discount'>('all');
  const [gov, setGov] = useState<string>(searchParams?.gov ?? "all");
  const [sort, setSort] = useState<"popularity" | "newest" | "price_low" | "price_high" | "discount" | "rating">("popularity");
  const [rating, setRating] = useState(0);
  const [search, setSearch] = useState(searchParams?.q ?? "");
  
  // ✅ نطاق السعر - باستخدام Inputs بدلاً من Slider
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // ✅ category
  const category = useMemo(() => {
    return categories.find((c: any) => c.slug === slug);
  }, [categories, slug]);

  useEffect(() => {
    setSearch(searchParams?.q ?? "");
    setGov(searchParams?.gov ?? "all");
  }, [searchParams?.q, searchParams?.gov]);

  // ✅ ✅ ✅ جلب العروض الترويجية - مثل index.tsx
  // ✅ جلب governorate_id من slug
let governorateId = null;
if (gov !== "all" && gov) {
  const selectedGov = govs.find((g: any) => g.slug === gov);
  if (selectedGov) {
    governorateId = selectedGov.id;
  }
}

// ✅ جلب العروض الترويجية مع governorateId
const offerOptions = useMemo(() => ({ 
  isActive: true,
  limit: 50,
  categoryId: category?.id || undefined,
  governorateId: governorateId || undefined,  // ✅ أضف هذا
}), [category?.id, governorateId]);

const { data: promoOffers = [], isLoading: promoLoading } = useProductOffers(offerOptions);

  // ✅ ✅ ✅ تحويل العروض الترويجية لنفس شكل listings - مثل index.tsx
  const promoOffersAsListings = useMemo(() => {
    if (!promoOffers || promoOffers.length === 0) return [];
    
    return promoOffers.map((offer: any) => {
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
        title_ar: offer.display_text_ar || mainProduct?.title_ar || (app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"),
        title_en: offer.display_text_en || mainProduct?.title_en || (app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"),
        description_ar: offer.display_text_ar || mainProduct?.description_ar || "",
        description_en: offer.display_text_en || mainProduct?.description_en || "",
        price: mainProduct?.price || 0,
        old_price: mainProduct?.old_price || null,
        discount_percent: mainProduct?.discount_percent || null,
        is_offer: false,
        is_promo_offer: true,
        cover_url: mainProduct?.cover_url || null,
        status: "published",
        is_available: true,
        owner_id: offer.store_id,
        created_at: offer.created_at,
        updated_at: offer.updated_at,
        promo_offer: offer,
        offer_type: offer.offer_type,
        buy_quantity: offer.buy_quantity,
        get_quantity: offer.get_quantity,
        free_listing_id: offer.free_listing_id,
        required_product_ids: offer.required_product_ids || [],
        variation_ids: offer.variation_ids || [],
        result_variation_ids: offer.result_variation_ids || [],
        expires_at: offer.expires_at,
        is_featured: offer.is_featured,
        products: offer.products || [],
        colors: mainProduct?.colors || [],
        variations: mainProduct?.variations || [],
        listing_images: mainProduct?.listing_images || [],
        governorates: mainProduct?.governorates || null,
        profile: mainProduct?.profile || null,
        categories: mainProduct?.categories || null,
        rating: mainProduct?.rating || 0,
        reviews_count: mainProduct?.reviews_count || 0,
        governorate_id: mainProduct?.governorate_id || null,
        category_id: mainProduct?.category_id || null,
      };
    });
  }, [promoOffers, app.lang]);

  // ✅ جلب المنتجات من listings
  const { 
    data: listingsData = { data: [], count: 0, totalPages: 0 }, 
    isLoading,
    isFetching,
  } = useListings({
    categorySlug: slug,
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
    offerType: productFilter === 'offers' ? (offerType === 'all' ? null : offerType) : null,
  });

  const rows = listingsData.data || [];
  const totalCount = listingsData.count || 0;
  const totalPages = listingsData.totalPages || 1;
  
  const { data: stores = [], isLoading: storesLoading } = useStoresByCategory(slug);

  // ✅ دمج كل العناصر (المنتجات + العروض الترويجية)
  const allItems = useMemo(() => {
    const listingsItems = rows.map((item: any) => ({
      ...item,
      is_offer: item.is_offer || false,
      has_promotional_offer: item.product_offers && Array.isArray(item.product_offers) && item.product_offers.length > 0,
    }));

    // ✅ دمج مع العروض الترويجية
    let all = [...listingsItems, ...promoOffersAsListings];

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
        const discountA = a.discount_percent || 0;
        const discountB = b.discount_percent || 0;
        return discountB - discountA;
      });
    }

    return all;
  }, [rows, sort, promoOffersAsListings]);

  // ✅ فلترة العناصر حسب النوع
  const filteredByType = useMemo(() => {
    if (productFilter === 'all') return allItems;
    
    if (productFilter === 'products') {
      return allItems.filter((item: any) => !item.is_offer && !item.is_promo_offer);
    }
    
    if (productFilter === 'offers') {
      return allItems.filter((item: any) => {
        // ✅ العروض التخفيضية
        if (item.is_offer === true) return true;
        
        // ✅ العروض الترويجية
        if (item.is_promo_offer === true) return true;
        
        // ✅ العروض الترويجية من product_offers
        if (item.product_offers && Array.isArray(item.product_offers) && item.product_offers.length > 0) {
          return true;
        }
        
        return false;
      });
    }
    
    return allItems;
  }, [allItems, productFilter]);

  // ✅ فلترة العروض حسب النوع (ترويجية / تخفيضية)
  const filteredByOfferType = useMemo(() => {
    if (productFilter !== 'offers') return filteredByType;
    
    if (offerType === 'all') return filteredByType;
    
    if (offerType === 'promotional') {
      return filteredByType.filter((item: any) => 
        item.is_promo_offer === true || 
        (item.product_offers && Array.isArray(item.product_offers) && item.product_offers.length > 0)
      );
    }
    
    if (offerType === 'discount') {
      return filteredByType.filter((item: any) => (item.discount_percent || 0) > 0);
    }
    
    return filteredByType;
  }, [filteredByType, offerType, productFilter]);

  // ✅ فلترة متقدمة (السعر، التقييم، التوفر، البحث)
  const items = useMemo(() => {
    let filtered = filteredByOfferType;
    
    // ✅ فلتر البحث الذكي
    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      filtered = filtered.filter((item: any) => {
        const titleAr = (item.title_ar || "").toLowerCase();
        const titleEn = (item.title_en || "").toLowerCase();
        const descAr = (item.description_ar || "").toLowerCase();
        const descEn = (item.description_en || "").toLowerCase();
        
        return titleAr.includes(s) || 
               titleEn.includes(s) || 
               descAr.includes(s) || 
               descEn.includes(s);
      });
    }
    
    // ✅ فلتر التقييم
    if (rating > 0) {
      filtered = filtered.filter((r: any) => Number(r.rating) >= rating);
    }
    
    // ✅ فلتر السعر باستخدام minPrice و maxPrice
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || 10000000;
    
    filtered = filtered.filter((r: any) => {
      const price = Number(r.price);
      return price >= min && price <= max;
    });
    
    // ✅ فلتر التوفر
    if (showAvailableOnly) {
      filtered = filtered.filter((r: any) => r.is_available !== false);
    }
    
    return filtered;
  }, [filteredByOfferType, search, rating, minPrice, maxPrice, showAvailableOnly]);

  // ✅ إحصائيات
  const stats = useMemo(() => {
    const all = allItems.length;
    const products = allItems.filter((i: any) => !i.is_offer && !i.is_promo_offer).length;
    const offers = allItems.filter((i: any) => i.is_offer === true || i.is_promo_offer === true || (i.product_offers && i.product_offers.length > 0)).length;
    const promotionalOffers = allItems.filter((i: any) => i.is_promo_offer === true || (i.product_offers && i.product_offers.length > 0)).length;
    const discountOffers = allItems.filter((i: any) => (i.discount_percent || 0) > 0).length;
    
    return {
      total: all,
      products,
      offers,
      promotionalOffers,
      discountOffers,
      stores: stores.length,
      filtered: items.length,
    };
  }, [allItems, stores.length, items.length]);

  // ✅ إعادة تعيين الصفحة
  useEffect(() => {
    setPage(1);
  }, [search, sort, gov, rating, minPrice, maxPrice, showAvailableOnly, productFilter, offerType]);

  // ✅ Pagination
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ عرض الكل
  const showAll = () => {
    setProductFilter('all');
    setOfferType('all');
    setGov("all");
    setRating(0);
    setSearch("");
    setMinPrice(0);
    setMaxPrice(10000000);
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

      {/* نطاق السعر - Inputs بدون "من" و "إلى" داخل الحقول */}
<div>
  <div className="font-semibold mb-2 text-sm text-pink-600 dark:text-pink-400 flex items-center gap-2">
    <Tag className="h-4 w-4" />
    {app.lang === "ar" ? "نطاق السعر" : "Price Range"}
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
        placeholder={app.lang === "ar" ? "الحد الأدنى" : "Min"}
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
        placeholder={app.lang === "ar" ? "الحد الأعلى" : "Max"}
        className="h-10 rounded-xl px-3 border-pink-300/30 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
        min={0}
      />
    </div>
  </div>
  <div className="flex items-center justify-between mt-1.5 text-[10px] text-muted-foreground">
    <span>{minPrice === 0 ? "0" : formatPrice(minPrice, app.currency, app.lang)}</span>
    <span className="text-pink-500 text-[8px] animate-pulse">●</span>
    <span>{maxPrice === 10000000 ? (app.lang === "ar" ? "غير محدود" : "Unlimited") : formatPrice(maxPrice, app.currency, app.lang)}</span>
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

  if (!category) {
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

  const Icon = getCategoryIcon(category.icon);
  const categoryName = app.lang === "ar" ? category.name_ar : category.name_en;
  const categoryImage = category?.image_url || null;
  const isArabic = app.lang === "ar";

  const categoryDescription = app.lang === "ar" 
    ? (category.description_ar || `استكشف مجموعة مميزة من ${categoryName} في السوق لعندك. تشكيلة واسعة من المنتجات والخدمات بجودة عالية وأسعار تنافسية.`)
    : (category.description_en || `Explore a unique collection of ${categoryName} at Souqi. A wide range of products and services with high quality and competitive prices.`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-500/5 via-transparent to-rose-500/5">
      
      {/* ===== Header ===== */}
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
                    <Badge className="bg-gradient-to-r from-pink-400/30 to-rose-400/30 text-white border border-white/30 backdrop-blur-sm text-[10px] px-2.5 py-1 rounded-full font-bold animate-pulse">
                      <Rocket className="h-3 w-3 mr-1 inline animate-bounce" />
                      {app.lang === "ar" ? "رئيسي" : "Main"}
                    </Badge>
                  </h1>
                  
                  <p className="text-white/95 text-sm md:text-base max-w-2xl leading-relaxed mt-1.5 drop-shadow-lg font-medium tracking-wide">
                    {categoryDescription}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <AnimatedBadge count={stats.total} label={isArabic ? "منتج" : "products"} icon={Package} color="text-pink-300" />
                    <AnimatedBadge count={stats.offers} label={isArabic ? "عرض" : "offers"} icon={Flame} color="text-orange-300" />
                    <AnimatedBadge count={stats.promotionalOffers} label={isArabic ? "ترويجي" : "promo"} icon={Gift} color="text-purple-300" />
                    <AnimatedBadge count={stats.discountOffers} label={isArabic ? "تخفيض" : "discount"} icon={BadgePercent} color="text-orange-300" />
                    <AnimatedBadge count={stats.stores} label={isArabic ? "متجر" : "stores"} icon={Store} color="text-pink-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tabs ===== */}
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
        
        {/* ===== Sidebar Filters ===== */}
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
              
              {/* ✅ Product Filter Buttons */}
              {tab === "products" && (
                <ProductFilterButtons
                  value={productFilter}
                  onChange={setProductFilter}
                  counts={{
                    all: stats.total,
                    products: stats.products,
                    offers: stats.offers,
                  }}
                  lang={app.lang}
                />
              )}
              
              {/* ✅ Offer Type Filter Buttons - تظهر فقط عند اختيار "عروض" */}
              {tab === "products" && productFilter === "offers" && (
                <OfferTypeButtons
                  value={offerType}
                  onChange={setOfferType}
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
                  {items.map((i: any, index: number) => (
                    <div 
                      key={i.id} 
                      className="animate-fade-up"
                      style={{ animationDelay: `${(index % 9) * 60}ms` }}
                    >
                      <ListingCard item={i} viewMode={viewMode} />
                    </div>
                  ))}
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
            )
          ) : (
            // ===== Stores Tab =====
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