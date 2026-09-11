// src/routes/category/$slug.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  SlidersHorizontal, X, Store, Package, Star, ChevronDown, Check,
  Sparkles, Filter, Search, MapPin, TrendingUp,
  Grid3X3, List, Tag, ArrowUpDown, RefreshCw, ChevronLeft, ChevronRight,
  FolderTree, Home, Shield, Percent, Layers, ArrowLeft
} from "lucide-react";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import {
  useGovernorates, useListings, useStoresByCategory,
  useCategories, useProductOffers,
} from "@/lib/queries";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

// ============================================================
// 🎨 Brand
// ============================================================
const OLIVE = "#2a655f";

// ============================================================
// ✅ CategoryPage
// ============================================================
function CategoryPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const app = useApp();
  const t = useT();
  const isRtl = app.lang === "ar";

  useEffect(() => {
    if (slug === "offers") navigate({ to: "/offers" });
  }, [slug, navigate]);

  const { data: govs = [] } = useGovernorates();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const searchParams = Route.useSearch() as { q?: string; gov?: string } | undefined;

  // ===== State =====
  const [tab, setTab] = useState<"products" | "stores">("products");
  const [productFilter, setProductFilter] = useState<'all' | 'products' | 'offers'>('all');
  const [offerType, setOfferType] = useState<'all' | 'promotional' | 'discount'>('all');
  const [gov, setGov] = useState<string>(searchParams?.gov ?? "all");
  const [sort, setSort] = useState<"popularity" | "newest" | "price_low" | "price_high" | "discount" | "rating">("popularity");
  const [rating, setRating] = useState(0);
  const [search, setSearch] = useState(searchParams?.q ?? "");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [activeSubSlug, setActiveSubSlug] = useState<string | null>(null);
  const [subCounts, setSubCounts] = useState<Record<string, number>>({});

  // ===== Category derivation =====
  const category = useMemo(
    () => categories.find((c: any) => c.slug === slug),
    [categories, slug]
  );

  const isMainCategory = useMemo(() => category && !category.parent_id, [category]);

  const subCategories = useMemo(() => {
    if (!isMainCategory || !category) return [];
    return categories
      .filter((c: any) => c.parent_id === category.id && c.active !== false)
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [categories, category, isMainCategory]);

  const effectiveSlug = useMemo(() => {
    if (isMainCategory && activeSubSlug) return activeSubSlug;
    return slug;
  }, [isMainCategory, activeSubSlug, slug]);

  useEffect(() => {
    setSearch(searchParams?.q ?? "");
    setGov(searchParams?.gov ?? "all");
  }, [searchParams?.q, searchParams?.gov]);

  // ===== جلب عدد المنتجات لكل فرع =====
  useEffect(() => {
    if (!isMainCategory || subCategories.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const subIds = subCategories.map((s: any) => s.id);
        const { data, error } = await supabase
          .from("listings")
          .select("category_id")
          .in("category_id", subIds)
          .eq("status", "published")
          .eq("is_available", true);
        if (error) throw error;
        const counts: Record<string, number> = {};
        subCategories.forEach((sub: any) => { counts[sub.id] = 0; });
        (data || []).forEach((item: any) => {
          if (item.category_id && counts[item.category_id] !== undefined)
            counts[item.category_id]++;
        });
        if (!cancelled) setSubCounts(counts);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { cancelled = true; };
  }, [isMainCategory, subCategories]);

  // ===== Offers =====
  let governorateId: any = null;
  if (gov !== "all" && gov) {
    const g = govs.find((g: any) => g.slug === gov);
    if (g) governorateId = g.id;
  }

  // ✅ القسم الفرعي النشط
  const activeSubCategory = useMemo(() => {
    if (isMainCategory && activeSubSlug) {
      return subCategories.find((s: any) => s.slug === activeSubSlug);
    }
    return null;
  }, [isMainCategory, activeSubSlug, subCategories]);

  // ✅ ID القسم الفعّال (فرعي أو رئيسي)
  const effectiveCategoryId = useMemo(() => {
    if (activeSubCategory) return activeSubCategory.id;
    return category?.id;
  }, [activeSubCategory, category?.id]);

  const offerOptions = useMemo(() => ({
    isActive: true,
    limit: 50,
    categoryId: effectiveCategoryId || undefined,
    governorateId: governorateId || undefined,
  }), [effectiveCategoryId, governorateId]);

  const { data: promoOffers = [] } = useProductOffers(offerOptions);

  const promoOffersAsListings = useMemo(() => {
    if (!promoOffers || promoOffers.length === 0) return [];
    return promoOffers.map((offer: any) => {
      let mainProduct = null;
      if (Array.isArray(offer.products) && offer.products.length > 0) {
        mainProduct = offer.products.find((p: any) => p.id === offer.listing_id) || offer.products[0];
      } else if (offer.products && typeof offer.products === "object" && !Array.isArray(offer.products)) {
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

  // ===== Listings =====
  const {
    data: listingsData = { data: [], count: 0, totalPages: 0 },
    isLoading,
    isFetching,
  } = useListings({
    categorySlug: effectiveSlug,
    governorateSlug: gov === "all" ? undefined : gov,
    sort: sort === "popularity" ? "popular" :
          sort === "newest" ? "recent" :
          sort === "price_low" ? "cheapest" :
          sort === "price_high" ? "price_high" :
          sort === "discount" ? "discount" : "rating",
    search: search || undefined,
    page,
    limit,
    offerType: productFilter === "offers" ? (offerType === "all" ? null : offerType) : null,
  });

  const rows = listingsData.data || [];
  const totalCount = listingsData.count || 0;
  const totalPages = listingsData.totalPages || 1;

  const { data: stores = [], isLoading: storesLoading } = useStoresByCategory(effectiveSlug);

  // ===== Merge & Filter =====
  const allItems = useMemo(() => {
    const listingsItems = rows.map((item: any) => ({
      ...item,
      is_offer: item.is_offer || false,
      has_promotional_offer: item.product_offers && Array.isArray(item.product_offers) && item.product_offers.length > 0,
    }));
    let all = [...listingsItems, ...promoOffersAsListings];
    if (sort === "price_low") all.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "price_high") all.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sort === "newest") all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sort === "rating") all.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === "discount") all.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0));
    return all;
  }, [rows, sort, promoOffersAsListings]);

  const filteredByType = useMemo(() => {
    if (productFilter === "all") return allItems;
    if (productFilter === "products")
      return allItems.filter((item: any) => !item.is_offer && !item.is_promo_offer);
    if (productFilter === "offers") {
      return allItems.filter((item: any) => {
        if (item.is_offer === true) return true;
        if (item.is_promo_offer === true) return true;
        if (item.product_offers && Array.isArray(item.product_offers) && item.product_offers.length > 0) return true;
        return false;
      });
    }
    return allItems;
  }, [allItems, productFilter]);

  const filteredByOfferType = useMemo(() => {
    if (productFilter !== "offers") return filteredByType;
    if (offerType === "all") return filteredByType;
    if (offerType === "promotional") {
      return filteredByType.filter((item: any) =>
        item.is_promo_offer === true ||
        (item.product_offers && Array.isArray(item.product_offers) && item.product_offers.length > 0)
      );
    }
    if (offerType === "discount") {
      return filteredByType.filter((item: any) => (item.discount_percent || 0) > 0);
    }
    return filteredByType;
  }, [filteredByType, offerType, productFilter]);

  const items = useMemo(() => {
    let filtered = filteredByOfferType;
    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      filtered = filtered.filter((item: any) => {
        const titleAr = (item.title_ar || "").toLowerCase();
        const titleEn = (item.title_en || "").toLowerCase();
        const descAr = (item.description_ar || "").toLowerCase();
        const descEn = (item.description_en || "").toLowerCase();
        return titleAr.includes(s) || titleEn.includes(s) || descAr.includes(s) || descEn.includes(s);
      });
    }
    if (rating > 0) filtered = filtered.filter((r: any) => Number(r.rating) >= rating);
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || 10000000;
    filtered = filtered.filter((r: any) => {
      const price = Number(r.price);
      return price >= min && price <= max;
    });
    if (showAvailableOnly) filtered = filtered.filter((r: any) => r.is_available !== false);
    return filtered;
  }, [filteredByOfferType, search, rating, minPrice, maxPrice, showAvailableOnly]);

  // ============================================================
  // ✅ ✅ ✅ الإحصائيات المُصححة - تشمل العروض الترويجية
  // ============================================================
  const stats = useMemo(() => {
    // عدد العروض الترويجية من product_offers
    const promoCount = promoOffersAsListings.length;

    // عدد العروض التخفيضية من الصفحة الحالية
    const discountCount = rows.filter((r: any) => r.is_offer === true).length;

    // إجمالي العروض
    const offers = promoCount + discountCount;

    // ✅ المجموع = منتجات useListings + العروض الترويجية
    // totalCount يشمل التخفيضات (لأنها listings) لكن لا يشمل promoOffers
    const total = totalCount + promoCount;

    // ✅ المنتجات العادية = الكلي - التخفيضات
    const products = Math.max(0, totalCount - discountCount);

    return {
      total,          // ← الآن يشمل العروض الترويجية
      products,
      offers,
      stores: stores.length,
      filtered: items.length,
    };
  }, [totalCount, promoOffersAsListings.length, rows, stores.length, items.length]);

  useEffect(() => {
    setPage(1);
  }, [search, sort, gov, rating, minPrice, maxPrice, showAvailableOnly, productFilter, offerType, activeSubSlug]);

  const goToPage = (n: number) => {
    if (n >= 1 && n <= totalPages) {
      setPage(n);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetAll = () => {
    setProductFilter("all");
    setOfferType("all");
    setGov("all");
    setRating(0);
    setSearch("");
    setMinPrice(0);
    setMaxPrice(10000000);
    setShowAvailableOnly(false);
    setPage(1);
    setActiveSubSlug(null);
  };

  // ============================================================
  // Filters Sidebar
  // ============================================================
  const SidebarFilters = (
    <div className="hidden lg:block space-y-5 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#2a655f]" />
          {t("filters")}
        </h3>
        <button
          onClick={resetAll}
          className="text-[10px] text-[#2a655f] font-bold hover:underline"
        >
          {isRtl ? "إعادة ضبط" : "Reset"}
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
          {isRtl ? "بحث داخل القسم" : "Search in category"}
        </label>
        <div className="relative">
          <Search className="absolute start-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_placeholder")}
            className="bg-slate-50 border-slate-200 text-xs ps-8 h-8 rounded-lg text-slate-800"
          />
        </div>
      </div>

      {/* Governorate */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
          {isRtl ? "المحافظة" : "Governorate"}
        </label>
        <select
          value={gov}
          onChange={(e) => setGov(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 h-8 text-xs text-slate-800 focus:outline-none focus:border-[#2a655f]"
        >
          <option value="all">{t("all_governorates")}</option>
          {govs.map((g: any) => (
            <option key={g.id} value={g.slug}>
              {isRtl ? g.name_ar : g.name_en}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
          {isRtl ? "نطاق السعر" : "Price Range"}
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={isRtl ? "من" : "Min"}
            value={minPrice || ""}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="bg-slate-50 border-slate-200 text-xs h-8 rounded-lg text-slate-800"
          />
          <span className="text-slate-400">-</span>
          <Input
            type="number"
            placeholder={isRtl ? "إلى" : "Max"}
            value={maxPrice === 10000000 ? "" : maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="bg-slate-50 border-slate-200 text-xs h-8 rounded-lg text-slate-800"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
          {isRtl ? "التقييم الأدنى" : "Minimum rating"}
        </label>
        <div className="space-y-1">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setRating(r)}
              className={cn(
                "w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition",
                rating === r
                  ? "bg-[#2a655f]/10 text-[#2a655f] font-bold border border-[#2a655f]/30"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <span>
                {r === 0
                  ? isRtl ? "كل التقييمات" : "All ratings"
                  : `${r} ${isRtl ? "نجوم فأكثر" : "stars & up"}`}
              </span>
              {r > 0 && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Available */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
          <Checkbox
            checked={showAvailableOnly}
            onCheckedChange={(v) => setShowAvailableOnly(v as boolean)}
            className="border-slate-300 data-[state=checked]:bg-[#2a655f] data-[state=checked]:border-[#2a655f]"
          />
          <span className="text-xs text-slate-700 font-semibold">
            {isRtl ? "المتاحة فقط" : "Available only"}
          </span>
        </label>
      </div>
    </div>
  );

  // ============================================================
  // Loading / Not Found
  // ============================================================
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-stone-50/50 p-6 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-4xl">
          <Skeleton className="h-32 w-full rounded-2xl bg-stone-100" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl bg-stone-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-stone-50 text-slate-800 flex flex-col items-center justify-center p-6">
        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Package className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold mb-4">
          {isRtl ? "التصنيف غير موجود" : "Category not found"}
        </h1>
        <Link to="/">
          <Button className="rounded-xl bg-[#2a655f] text-white">
            <ArrowLeft className="h-4 w-4 me-2" />
            {isRtl ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </Link>
      </div>
    );
  }

  const categoryName = isRtl ? category.name_ar : category.name_en;
  const categoryDescription = isRtl
    ? category.description_ar || `تصفح تشكيلة ${categoryName}`
    : category.description_en || `Explore ${categoryName}`;
  const Icon = getCategoryIcon(category.icon);

  const activeSub = activeSubSlug
    ? subCategories.find((s: any) => s.slug === activeSubSlug)
    : null;

  // ============================================================
  // Main Render
  // ============================================================
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
            <Link to="/categories" className="hover:text-[#2a655f]">
              {isRtl ? "التصنيفات" : "Categories"}
            </Link>
            <span className="text-slate-300">/</span>
            {activeSub ? (
              <>
                <button
                  onClick={() => { setActiveSubSlug(null); setPage(1); }}
                  className="hover:text-[#2a655f]"
                >
                  {categoryName}
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-[#2a655f] font-bold">
                  {isRtl ? activeSub.name_ar : activeSub.name_en}
                </span>
              </>
            ) : (
              <span className="text-[#2a655f] font-bold">{categoryName}</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-[#2a655f]/20 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                {category.image_url ? (
                  <img src={category.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Icon className="w-7 h-7 text-[#2a655f]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    {activeSub
                      ? (isRtl ? activeSub.name_ar : activeSub.name_en)
                      : categoryName}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-[#2a655f]/10 text-[#2a655f] text-[10px] font-bold border border-[#2a655f]/20">
                    {isMainCategory
                      ? (isRtl ? "قسم رئيسي" : "Main")
                      : (isRtl ? "قسم فرعي" : "Sub")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-lg line-clamp-1">
                  {activeSub
                    ? (isRtl
                        ? `تصفح منتجات ${activeSub.name_ar} في قسم ${categoryName}`
                        : `Browse ${activeSub.name_en} products in ${categoryName}`)
                    : categoryDescription}
                </p>
              </div>
            </div>

            {/* Quick Stats Pills - ✅ الأرقام الصحيحة */}
            <div className="flex items-center gap-2 bg-white/80 border border-[#2a655f]/15 backdrop-blur-md px-3 py-2 rounded-2xl shadow-2xs self-start sm:self-auto">
              <div className="px-2 text-center border-e border-slate-200">
                <span className="block text-sm font-black text-slate-900">{stats.total}</span>
                <span className="text-[9px] text-slate-500">{isRtl ? "منتج" : "items"}</span>
              </div>
              <div className="px-2 text-center border-e border-slate-200">
                <span className="block text-sm font-black text-[#2a655f]">{stats.stores}</span>
                <span className="text-[9px] text-slate-500">{isRtl ? "متجر" : "stores"}</span>
              </div>
              <div className="px-2 text-center">
                <span className="block text-sm font-black text-amber-600">{stats.offers}</span>
                <span className="text-[9px] text-slate-500">{isRtl ? "عرض" : "offers"}</span>
              </div>
            </div>
          </div>

          {/* Subcategories Horizontal Pill Bar */}
          {isMainCategory && subCategories.length > 0 && (
            <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => { setActiveSubSlug(null); setPage(1); }}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border shrink-0",
                  !activeSubSlug
                    ? "bg-[#2a655f] text-white border-[#2a655f] shadow-xs"
                    : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                {isRtl ? "الكل" : "All"} ({stats.total})
              </button>
              {subCategories.map((sub: any) => {
                const isActive = activeSubSlug === sub.slug;
                return (
                  <button
                    key={sub.id}
                    onClick={() => { setActiveSubSlug(sub.slug); setPage(1); }}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border shrink-0",
                      isActive
                        ? "bg-[#2a655f] text-white border-[#2a655f] shadow-xs"
                        : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
                    )}
                  >
                    {sub.image_url && (
                      <img
                        src={sub.image_url}
                        alt=""
                        className="w-3.5 h-3.5 rounded-full object-cover"
                      />
                    )}
                    {isRtl ? sub.name_ar : sub.name_en}
                    <span className="opacity-70 text-[10px]">
                      ({subCounts[sub.id] || 0})
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 🎛️ Glassmorphic Control Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex items-center justify-between gap-4 bg-white/90 backdrop-blur-xl border border-slate-200/80 p-3 rounded-2xl mb-6 shadow-2xs flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type Switcher Tabs */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
              {[
                { id: "products" as const, label: isRtl ? "المنتجات" : "Products", count: stats.total },
                { id: "stores" as const, label: isRtl ? "المتاجر" : "Stores", count: stats.stores },
              ].map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setTab(tb.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                    tab === tb.id
                      ? "bg-[#2a655f] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {tb.label} ({tb.count})
                </button>
              ))}
            </div>

            {/* Product Sub-filter Pills */}
            {tab === "products" && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {[
                  { id: "all" as const, label: isRtl ? "الكل" : "All" },
                  { id: "products" as const, label: isRtl ? "منتجات فقط" : "Products only" },
                  { id: "offers" as const, label: isRtl ? "عروض" : "Offers" },
                ].map((pf) => (
                  <button
                    key={pf.id}
                    onClick={() => setProductFilter(pf.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs transition-all",
                      productFilter === pf.id
                        ? "bg-white text-slate-900 font-bold shadow-2xs"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {pf.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Selector */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2a655f] cursor-pointer"
            >
              <option value="popularity">🔥 {isRtl ? "الأكثر رواجاً" : "Most popular"}</option>
              <option value="newest">✨ {isRtl ? "الأحدث" : "Newest"}</option>
              <option value="price_low">⬇️ {isRtl ? "السعر: من الأقل" : "Price: Low"}</option>
              <option value="price_high">⬆️ {isRtl ? "السعر: من الأعلى" : "Price: High"}</option>
              <option value="discount">🏷️ {isRtl ? "أكبر خصم" : "Discount"}</option>
              <option value="rating">⭐ {isRtl ? "الأعلى تقييماً" : "Top rated"}</option>
            </select>

            {/* View Mode */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-lg",
                  viewMode === "grid"
                    ? "bg-white text-[#2a655f] shadow-2xs"
                    : "text-slate-400"
                )}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-lg",
                  viewMode === "list"
                    ? "bg-white text-[#2a655f] shadow-2xs"
                    : "text-slate-400"
                )}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden gap-2 h-8 px-3 rounded-xl border-slate-200 text-xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {t("filters")}
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRtl ? "right" : "left"}
                className="w-80 overflow-auto p-4"
              >
                <SheetTitle className="mb-4">{t("filters")}</SheetTitle>

                {/* Mobile Subcategories */}
                {isMainCategory && subCategories.length > 0 && (
                  <div className="mb-5 pb-5 border-b border-slate-200">
                    <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5">
                      <FolderTree className="w-3.5 h-3.5 text-[#2a655f]" />
                      {isRtl ? "الأقسام" : "Categories"}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => { setActiveSubSlug(null); setPage(1); }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                          !activeSubSlug
                            ? "bg-[#2a655f] text-white border-[#2a655f]"
                            : "bg-white text-slate-700 border-slate-200"
                        )}
                      >
                        {isRtl ? "الكل" : "All"}
                      </button>
                      {subCategories.map((sub: any) => (
                        <button
                          key={sub.id}
                          onClick={() => { setActiveSubSlug(sub.slug); setPage(1); }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                            activeSubSlug === sub.slug
                              ? "bg-[#2a655f] text-white border-[#2a655f]"
                              : "bg-white text-slate-700 border-slate-200"
                          )}
                        >
                          {isRtl ? sub.name_ar : sub.name_en}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {SidebarFilters}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Content Section with Filters Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Sidebar Filters */}
          {tab === "products" && SidebarFilters}

          {/* Main Listings Grid */}
          <div className={cn(tab === "products" ? "lg:col-span-3" : "lg:col-span-4")}>
            {tab === "products" ? (
              isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-2xl bg-slate-200" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-2xs">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {isRtl ? "لا توجد منتجات مطابقة" : "No matching products"}
                  </h3>
                  <p className="text-slate-500 text-xs mb-5">
                    {isRtl
                      ? "جرب تغيير معايير البحث أو الفلترة الخاصة بك"
                      : "Try changing your search or filter criteria"}
                  </p>
                  <Button
                    onClick={resetAll}
                    className="rounded-xl bg-[#2a655f] text-white text-xs font-bold h-9"
                  >
                    {isRtl ? "إعادة تعيين الفلاتر" : "Reset filters"}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <span className="text-slate-500">
                      {isRtl
                        ? `عرض ${items.length} من ${stats.total} نتيجة`
                        : `Showing ${items.length} of ${stats.total} results`}
                    </span>
                    {isFetching && (
                      <div className="flex items-center gap-1.5 text-[#2a655f]">
                        <div className="h-3 w-3 border-2 border-[#2a655f] border-t-transparent rounded-full animate-spin" />
                        <span>{isRtl ? "جاري التحديث..." : "Updating..."}</span>
                      </div>
                    )}
                  </div>

                  <div
                    className={cn(
                      "grid gap-4",
                      viewMode === "grid"
                        ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3"
                        : "grid-cols-1"
                    )}
                  >
                    {items.map((item: any) => (
                      <div
                        key={item.id}
                        className="transition-transform duration-300 hover:-translate-y-1"
                      >
                        <ListingCard item={item} viewMode={viewMode} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <Button
                        variant="outline"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1 || isFetching}
                        className="rounded-xl bg-white border-slate-200 text-slate-700 h-9 w-9 p-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let n: number;
                        if (totalPages <= 5) n = i + 1;
                        else if (page <= 3) n = i + 1;
                        else if (page >= totalPages - 2) n = totalPages - 4 + i;
                        else n = page - 2 + i;
                        if (n > totalPages) return null;
                        return (
                          <Button
                            key={n}
                            variant={n === page ? "default" : "outline"}
                            onClick={() => goToPage(n)}
                            disabled={isFetching}
                            className={cn(
                              "h-9 min-w-[36px] rounded-xl text-xs font-bold p-0 px-3",
                              n === page
                                ? "bg-[#2a655f] text-white border-[#2a655f]"
                                : "bg-white border-slate-200 text-slate-700"
                            )}
                          >
                            {n}
                          </Button>
                        );
                      })}

                      <Button
                        variant="outline"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages || isFetching}
                        className="rounded-xl bg-white border-slate-200 text-slate-700 h-9 w-9 p-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              )
            ) : storesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-2xl bg-slate-200" />
                ))}
              </div>
            ) : stores.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
                {isRtl
                  ? "لا توجد متاجر في هذا القسم حالياً"
                  : "No stores in this category yet"}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stores.map((s: any) => (
                  <Link
                    key={s.id}
                    to="/store/$id"
                    params={{ id: s.id }}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden p-4 hover:border-[#2a655f]/50 hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                        {s.store_logo_url || s.avatar_url ? (
                          <img
                            src={s.store_logo_url || s.avatar_url!}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <Store className="w-5 h-5 text-[#2a655f]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#2a655f] transition truncate">
                          {s.store_name || s.full_name || (isRtl ? "متجر" : "Store")}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {s.listing_count || 0} {isRtl ? "منتج" : "products"}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {s.store_description || (isRtl ? "متجر معتمد" : "Verified store")}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;