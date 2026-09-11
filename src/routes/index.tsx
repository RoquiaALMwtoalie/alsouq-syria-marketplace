// src/routes/index.tsx

import React, { useEffect, useState, useRef, useMemo, useCallback, Suspense, lazy } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingBag, Shirt, Smartphone, Home as HomeIcon, Footprints, Watch, BookOpen,
  Dumbbell, Gamepad2, Palette, Wrench, Utensils, Sparkles, BadgePercent, Gift, Flower2,
  ArrowRight, Package, Store, Star, ChevronLeft, ChevronRight, Heart, Flame,
  TrendingUp, Zap, Crown, Gem, Award, Clock, ThumbsUp, Eye, Truck, Coffee,
  Layers, Grid3X3, List, Percent, Tag, MapPin, Navigation,
  ArrowLeft, Globe, Store as StoreIcon, Building2, Compass, LayoutGrid,
  Folder, FolderTree, X, ShoppingCart, ArrowUpRight
} from "lucide-react";
import { useApp, useT } from "@/lib/i18n";
import { useListings, useBanners, useAllStores, useCategories, useMostFavoritedListings, useMostFavoritedStores, useTrendingListings, useTrendingStores, useProductOffers } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useInView } from "react-intersection-observer";

const ListingCard = lazy(() => import("@/components/ListingCard"));

// ============================================================
// 🎨 ZOOQ BRAND COLORS
// ============================================================
const OLIVE = "#2a655f";
const OLIVE_LIGHT = "#3a8a82";
const OLIVE_DARK = "#1a4f4a";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "ذوق | Zooq — سوقك السوري بين يديك" },
      { name: "description", content: "ذوق | Zooq: منصة سورية شاملة" },
    ],
  }),
});

// ============================================================
// 🧩 عناصر مشتركة
// ============================================================
function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
      <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      {action}
    </div>
  );
}

function Section({ children, alt = false, className }: { children: React.ReactNode; alt?: boolean; className?: string }) {
  return (
    <div className={cn(
      "w-full py-6 md:py-8",
      alt ? "bg-slate-50/80 dark:bg-slate-900/50" : "bg-white dark:bg-slate-900",
      className
    )}>
      <div className="mx-auto max-w-7xl px-3 sm:px-4">{children}</div>
    </div>
  );
}

// ============================================================
// 🎯 مكون: بطاقة قسم رئيسي (بأسلوب نون)
// ============================================================
function CategoryHeroCard({
  parentCategory,
  subCategories,
  lang,
  isExpanded,
  onToggle,
}: {
  parentCategory: any;
  subCategories: any[];
  lang: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isRtl = lang === "ar";
  const ParentIcon = getCategoryIcon(parentCategory.icon);
  const parentName = isRtl ? parentCategory.name_ar : (parentCategory.name_en || parentCategory.name_ar);
  const parentImageUrl = parentCategory.image_url;

  if (!subCategories || subCategories.length === 0) return null;

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden border-2 transition-all duration-500",
        isExpanded
          ? "border-[#2a655f] shadow-2xl shadow-[#2a655f]/25 col-span-full"
          : "border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/60 hover:shadow-xl hover:shadow-[#2a655f]/15 hover:-translate-y-1"
      )}
    >
      {/* ===== رأس البطاقة (صورة الأب + الاسم) ===== */}
      <div className="relative">
        {/* صورة الخلفية - الرابط هنا يفتح صفحة الرئيسي مع السايدبار */}
        <Link
          to="/category/$slug"
          params={{ slug: parentCategory.slug }}
          className="block relative cursor-pointer"
          onClick={(e) => {
            // إذا موسّع، لا تروح للرابط عند الضغط على الرأس
            if (isExpanded) {
              e.preventDefault();
              onToggle();
            }
          }}
        >
          <div className="relative h-32 sm:h-36 overflow-hidden">
            {parentImageUrl ? (
              <OptimizedImage
                src={parentImageUrl}
                alt={parentName}
                width={600}
                height={300}
                quality={85}
                objectFit="cover"
                className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${OLIVE}, ${OLIVE_LIGHT})` }}
              >
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }} />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            {/* أيقونة الأب */}
            <div className="absolute top-3 end-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/30"
                style={{ backgroundColor: `${OLIVE}dd` }}
              >
                <ParentIcon className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* الاسم + عدد الفروع */}
            <div className="absolute bottom-0 inset-x-0 p-3 text-white">
              <h3 className="font-black text-base sm:text-lg leading-tight mb-1">
                {parentName}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 font-bold">
                  {subCategories.length} {isRtl ? "فرع" : "subs"}
                </span>
              </div>
            </div>

            {/* أيقونة Expand */}
            {!isExpanded && (
              <div className="absolute top-3 start-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <ArrowUpRight className="h-4 w-4 text-[#2a655f]" />
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* ===== الجزء السفلي: زر التصفح (expand) + زر تسوق ===== */}
        {!isExpanded && (
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              {/* زر Expand */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle();
                }}
                className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 font-medium hover:text-[#2a655f] transition-colors"
              >
                <FolderTree className="h-3.5 w-3.5" />
                {isRtl ? "تصفح الفروع" : "Browse"}
              </button>

              {/* زر تسوق الآن - يروح للرئيسي مباشرة */}
              <Link
                to="/category/$slug"
                params={{ slug: parentCategory.slug }}
                className="flex items-center gap-1 text-xs font-bold text-[#2a655f] hover:text-[#d81b60] transition-colors group/shop"
              >
                {isRtl ? "تسوق" : "Shop"}
                {isRtl ? (
                  <ChevronLeft className="h-3.5 w-3.5 group-hover/shop:-translate-x-1 transition-transform" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 group-hover/shop:translate-x-1 transition-transform" />
                )}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ===== الجزء الموسَّع: الفرعيات ===== */}
      {isExpanded && (
        <div className="bg-white dark:bg-slate-900 border-t-2 border-[#2a655f]/20">
          {/* رأس القسم الموسَّع */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-[#2a655f]" />
              <span className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82]">
                {isRtl ? "الفروع المتاحة" : "Available Subcategories"}
              </span>
              <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
                {subCategories.length}
              </Badge>
            </div>
            <button
              onClick={onToggle}
              className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all duration-300 hover:rotate-90"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* شبكة الفروع */}
          <div className="p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
              {subCategories.map((sub: any) => {
                const SubIcon = getCategoryIcon(sub.icon);
                const subName = isRtl ? sub.name_ar : (sub.name_en || sub.name_ar);
                const subImageUrl = sub.image_url;

                return (
                  <Link
                    key={sub.id}
                    to="/category/$slug"
                    params={{ slug: sub.slug }}
                    className="flex flex-col items-center gap-2 group/sub p-2 rounded-xl hover:bg-[#2a655f]/5 transition-colors"
                  >
                    <div className="relative h-16 w-16 sm:h-18 sm:w-18 rounded-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover/sub:scale-110 group-hover/sub:shadow-[#2a655f]/40">
                      {subImageUrl ? (
                        <img
                          src={subImageUrl}
                          alt={subName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="h-full w-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${OLIVE}, ${OLIVE_LIGHT})` }}
                        >
                          <SubIcon className="h-7 w-7 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover/sub:border-[#2a655f]/60 transition-colors" />
                    </div>

                    <span className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 text-center line-clamp-2 max-w-[80px] group-hover/sub:text-[#2a655f] transition-colors leading-tight">
                      {subName}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* زر تسوق الآن في الرئيسي */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <Link
                to="/category/$slug"
                params={{ slug: parentCategory.slug }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white text-sm font-bold shadow-lg shadow-[#2a655f]/25 hover:shadow-xl hover:shadow-[#2a655f]/40 hover:scale-105 transition-all duration-300 group/btn"
              >
                <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                {isRtl ? `تسوق الآن في ${parentName}` : `Shop now in ${parentName}`}
                {isRtl ? (
                  <ChevronLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 🏠 HOME COMPONENT
// ============================================================
function Home() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // ===== Infinite Scroll State =====
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 8;

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  // ====== البيانات ======
  const { data: banners = [] } = useBanners();
  const { data: dbCategories = [] } = useCategories();

  const { 
    data: productsData = { data: [], count: 0, totalPages: 0 }, 
    isLoading: pLoading,
    isFetching,
    refetch,
  } = useListings({ sort: "recent", limit: LIMIT, page: page, offerType: 'all' });

  const { data: promoOffersForTodayData = [], isLoading: promoLoading } = useProductOffers({
    isActive: true,
    limit: 30,
  });

  const promoOffersForTodayAsListings = useMemo(() => {
    if (!promoOffersForTodayData || promoOffersForTodayData.length === 0) return [];

    return promoOffersForTodayData.map((offer: any) => {
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
  }, [promoOffersForTodayData, app.lang]);

  const discountOffersFromData = useMemo(() => {
    return (productsData.data || []).filter((item: any) => item.is_offer === true);
  }, [productsData.data]);

  const allOffers = useMemo(() => {
    const discountOffers = discountOffersFromData.slice(0, 30);
    const promoOffers = promoOffersForTodayAsListings.slice(0, 30);
    return [...discountOffers, ...promoOffers];
  }, [discountOffersFromData, promoOffersForTodayAsListings]);

  const paginatedItems = useMemo(() => productsData.data || [], [productsData.data]);

  useEffect(() => { setTotalCount(productsData.count || 0); }, [productsData.count]);

  useEffect(() => {
    const total = productsData.count || 0;
    const loaded = page * LIMIT;
    setHasMore(loaded < total);
  }, [productsData.count, page, LIMIT]);

  useEffect(() => {
    setAllItems(paginatedItems);
    setIsInitialLoad(false);
    setIsLoadingMore(false);
  }, [paginatedItems]);

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore && !isFetching && !isInitialLoad) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, isLoadingMore, isFetching, isInitialLoad]);

  const { data: stores = [], isLoading: sLoading } = useAllStores(8);

  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  // ✅ ✅ ✅ التصنيفات المميزة (رئيسية فقط)
  const featuredCategories = useMemo(() => {
    return dbCategories
      .filter((c: any) => 
        c.is_featured === true && 
        c.active !== false && 
        !c.parent_id  // ✅ فقط الرئيسية
      )
      .sort((a: any, b: any) => (a.featured_sort || 0) - (b.featured_sort || 0));
  }, [dbCategories]);

  // ✅ ✅ ✅ شجرة التصنيفات (أب + فرعيات)
  const categoriesTree = useMemo(() => {
    const mainCategories = dbCategories
      .filter((c: any) => !c.parent_id && c.active !== false)
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

    const tree = mainCategories.map((parent: any) => {
      const children = dbCategories
        .filter((c: any) => c.parent_id === parent.id && c.active !== false)
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

      return { parent, children };
    });

    return tree.filter((node: any) => node.children.length > 0);
  }, [dbCategories]);

  const allStores = stores || [];

  // ✅ دالة التبديل (فتح/إغلاق)
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* ===== BANNER SLIDER ===== */}
      <div className="w-full bg-white dark:bg-slate-900 pt-4 pb-2">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          {banners.length > 0 ? (
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/8] lg:aspect-[21/7] group bg-slate-950">
              {banners.map((b, i) => (
                <div
                  key={b.id}
                  className="absolute inset-0 transition-all duration-700 ease-in-out"
                  style={{ opacity: bannerIdx === i ? 1 : 0, pointerEvents: bannerIdx === i ? "auto" : "none" }}
                >
                  <OptimizedImage
                    src={b.image_url}
                    alt={app.lang === "ar" ? b.title_ar : (b.title_en || b.title_ar)}
                    width={1200}
                    height={400}
                    quality={80}
                    priority={i === 0}
                    objectFit="cover"
                    className="absolute inset-0 h-full w-full group-hover:scale-105 transition-transform duration-10000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 flex flex-col items-start justify-center p-6 sm:p-10 md:p-14 text-white">
                    {bannerIdx === i && (
                      <div className="animate-banner-reveal space-y-3 sm:space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#fbcfe8] to-[#f9a8d4] border border-pink-300/60 shadow-lg shadow-pink-300/30">
                          <span className="text-sm">✨</span>
                          <span className="text-xs sm:text-sm font-black text-[#2a655f] tracking-wide">
                            {app.lang === "ar" ? "عروض حصرية ولفترة محدودة" : "Exclusive Limited Offer"}
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                          {app.lang === "ar" ? b.title_ar : (b.title_en || b.title_ar)}
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-slate-200 font-bold max-w-lg leading-relaxed line-clamp-2">
                          {app.lang === "ar" ? b.subtitle_ar : (b.subtitle_en || b.subtitle_ar)}
                        </p>
                        {b.cta_label_ar && (
                          <div className="pt-2">
                            <Button className="rounded-2xl bg-pink-400 text-white hover:bg-pink-500 font-black px-6 py-5 text-sm sm:text-base transition-all duration-300 shadow-[0_10px_25px_rgba(236,72,153,0.4)] border border-pink-300/40 group/btn cursor-pointer">
                              <span>{app.lang === "ar" ? b.cta_label_ar : (b.cta_label_en || b.cta_label_ar)}</span>
                              <ArrowRight className="h-5 w-5 ms-2.5 text-white group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    {b.link_url && <a href={b.link_url} className="absolute inset-0" aria-label="Banner link" />}
                  </div>
                </div>
              ))}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={() => setBannerIdx((i) => (i - 1 + banners.length) % banners.length)}
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-[#2a655f] text-white transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/20 shadow-xl cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    onClick={() => setBannerIdx((i) => (i + 1) % banners.length)}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-[#2a655f] text-white transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/20 shadow-xl cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </>
              )}
              {banners.length > 1 && (
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setBannerIdx(i)}
                      className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                        bannerIdx === i ? "w-8 sm:w-10 bg-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.9)]" : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl sm:rounded-3xl aspect-[16/9] sm:aspect-[21/8] bg-slate-100 dark:bg-slate-800 animate-pulse" />
          )}
        </div>
      </div>

      {/* ============================================================
          📂 1. الأقسام المميزة
          ============================================================ */}
      <Section>
        <CategorySlider categories={featuredCategories} />
      </Section>

      {/* ============================================================
          🔥 2. عروض اليوم
          ============================================================ */}
      {allOffers.length > 0 && (
        <Section alt>
          <SectionHeader
            title={app.lang === "ar" ? "عروض اليوم" : "Today's Offers"}
            action={
              <Link to="/category/$slug" params={{ slug: "offers" }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold px-3 py-1.5 text-sm transition-all duration-300"
                  style={{ backgroundColor: "#faf8f8", border: "1.5px solid #f9a8d4", color: "#4a4a4a" }}
                >
                  {app.lang === "ar" ? "شاهد المزيد" : "View More"}
                </Button>
              </Link>
            }
          />
          <div className="relative group">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {allOffers.slice(0, 8).map((item: any, index: number) => (
                <div key={item.id || index} className="w-[200px] md:w-[250px] flex-shrink-0">
                  <Suspense fallback={<ProductSkeleton />}>
                    <ListingCard item={item} />
                  </Suspense>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ============================================================
          📂 3. تسوق حسب القسم (بأسلوب نون - Expandable Cards)
          ============================================================ */}
      {categoriesTree.length > 0 && (
        <Section>
          <SectionHeader
            title={app.lang === "ar" ? "🛒 تسوق حسب القسم" : "🛒 Shop by Category"}
            action={
              <Link to="/categories">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold px-3 py-1.5 text-sm transition-all duration-300"
                  style={{ backgroundColor: "#faf8f8", border: "1.5px solid #f9a8d4", color: "#4a4a4a" }}
                >
                  {app.lang === "ar" ? "جميع الأقسام" : "All Categories"}
                </Button>
              </Link>
            }
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {categoriesTree.map((node: any) => (
              <CategoryHeroCard
                key={node.parent.id}
                parentCategory={node.parent}
                subCategories={node.children}
                lang={app.lang}
                isExpanded={expandedCategory === node.parent.id}
                onToggle={() => toggleCategory(node.parent.id)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* ============================================================
          🏪 4. متاجر مميزة
          ============================================================ */}
      <Section alt>
        <SectionHeader
          title={app.lang === "ar" ? "متاجر مميزة" : "Featured Stores"}
          action={
            <Link to="/stores">
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold px-3 py-1.5 text-sm transition-all duration-300"
                style={{ backgroundColor: "#faf8f8", border: "1.5px solid #f9a8d4", color: "#4a4a4a" }}
              >
                {app.lang === "ar" ? "شاهد المزيد" : "View More"}
              </Button>
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allStores.slice(0, 4).map((s, index) => (
            <div key={s.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <StoreCard store={s} />
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================
          🆕 5. أحدث المنتجات والعروض
          ============================================================ */}
      <Section alt className="pb-2">
        <SectionHeader
          title={app.lang === "ar" ? "أحدث المنتجات والعروض" : "Latest Products & Offers"}
          action={
            <Link to="/products">
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold px-3 py-1.5 text-sm transition-all duration-300"
                style={{ backgroundColor: "#faf8f8", border: "1.5px solid #f9a8d4", color: "#4a4a4a" }}
              >
                {app.lang === "ar" ? "شاهد المزيد" : "View More"}
              </Button>
            </Link>
          }
        />

        {pLoading && allItems.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allItems.map((item, index) => (
              <div key={`${item.id}-${item.is_promo_offer ? 'promo' : 'listing'}-${index}`} className="animate-fade-up" style={{ animationDelay: `${(index % 8) * 50}ms` }}>
                <Suspense fallback={<ProductSkeleton />}>
                  <ListingCard item={item} />
                </Suspense>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-6 mt-4">
            {isFetching || isLoadingMore ? (
              <div className="flex items-center gap-3" style={{ color: OLIVE }}>
                <div className="h-5 w-5 border-2 border-[#2a655f] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">
                  {app.lang === "ar" ? "جاري التحميل..." : "Loading..."}
                </span>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground animate-pulse">
                {app.lang === "ar" ? "مرر للأسفل للمزيد" : "Scroll down for more"}
              </div>
            )}
          </div>
        )}
      </Section>

   

      {/* ============================================================
          👀 7. شاهدتها مؤخراً
          ============================================================ */}
      <RecentlyViewed />

    </div>
  );
}

// ============================================================
// CATEGORY SLIDER
// ============================================================
export function CategorySlider({ categories }: { categories: any[] }) {
  const app = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const isRtl = app.lang === "ar";

  if (!categories || categories.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 200;
      const factor = direction === 'left' ? -1 : 1;
      containerRef.current.scrollBy({ left: scrollAmount * factor, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="relative group">
        <div
          ref={containerRef}
          className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((c: any) => {
            const Icon = getCategoryIcon(c.icon);
            const imageUrl = c.image_url;
            const name = isRtl ? c.name_ar : c.name_en;

            return (
              <Link 
                key={c.id} 
                to="/category/$slug" 
                params={{ slug: c.slug }} 
                className="flex-shrink-0 snap-start group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-[#2a655f]/30">
                    {imageUrl ? (
                      <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${OLIVE}, ${OLIVE_LIGHT})` }}>
                        <Icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:border-[#2a655f]/50 transition-colors" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 text-center line-clamp-1 max-w-[80px] group-hover:text-[#2a655f] transition-colors">
                    {name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 border border-slate-200">
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 border border-slate-200">
          <ChevronRight className="h-5 w-5 text-slate-600" />
        </button>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </>
  );
}

// ============================================================
// TRENDING SECTION
// ============================================================
function TrendingSection() {
  const app = useApp();
  const { data: trProducts = [] } = useTrendingListings(12);
  const { data: trStores = [] } = useTrendingStores(12);

  if (trProducts.length === 0 && trStores.length === 0) return null;

  return (
    <>
      <SectionHeader
        title={app.lang === "ar" ? "الأكثر رواجاً" : "Trending Now"}
        action={
          <Link to="/category/$slug" params={{ slug: "trending" }}>
            <Button variant="ghost" size="sm" className="font-semibold px-3 py-1.5 text-sm" style={{ backgroundColor: "#faf8f8", border: "1.5px solid #f9a8d4", color: "#4a4a4a" }}>
              {app.lang === "ar" ? "شاهد المزيد" : "View More"}
            </Button>
          </Link>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trProducts.slice(0, 4).map((i, index) => (
          <div key={i.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
            <Suspense fallback={<ProductSkeleton />}>
              <ListingCard item={i} />
            </Suspense>
          </div>
        ))}
      </div>
    </>
  );
}

// ============================================================
// STORE CARD
// ============================================================
export function StoreCard({ store, badge }: { store: any; badge?: React.ReactNode }) {
  const app = useApp();
  const isRtl = app.lang === "ar";

  const storeName = store.store_name || store.full_name || (isRtl ? "متجر مميز" : "Featured Store");
  const coverUrl = store.store_cover_url;
  const logoUrl = store.store_logo_url || store.avatar_url;
  const rating = Number(store.avg_rating ?? 0).toFixed(1);
  const productsCount = store.listing_count ?? 0;
  const isActive = store.store_active !== false;

  return (
    <Link to="/store/$id" params={{ id: store.id }} className="group flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-[90px] w-full overflow-hidden shrink-0">
        {coverUrl ? (
          <OptimizedImage src={coverUrl} alt={storeName} width={600} height={200} quality={80} objectFit="cover" className="absolute inset-0 h-full w-full group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${OLIVE}, ${OLIVE_LIGHT})` }} />
        )}
        {badge && <div className="absolute top-2.5 end-2.5 z-10">{badge}</div>}
      </div>

      <div className="flex flex-col items-center text-center px-4 pb-4">
        <div className="-mt-8 relative z-10">
          <div className="h-16 w-16 rounded-full bg-white p-0.5 shadow-md overflow-hidden grid place-items-center" style={{ boxShadow: `0 0 0 3px white, 0 4px 12px rgba(15,23,42,0.12)` }}>
            {logoUrl ? (
              <OptimizedImage src={logoUrl} alt={storeName} width={80} height={80} quality={85} objectFit="cover" className="h-full w-full rounded-full" />
            ) : (
              <div className="h-full w-full rounded-full text-white font-black text-lg flex items-center justify-center" style={{ backgroundColor: OLIVE }}>
                {storeName.charAt(0)?.toUpperCase() || <Store className="h-5 w-5" />}
              </div>
            )}
          </div>
        </div>

        <h3 className="mt-2.5 font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{storeName}</h3>

        <div className="flex items-center gap-2.5 mt-1 text-[11px] text-muted-foreground font-medium">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{rating}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
          <span>{productsCount} {isRtl ? "منتج" : "products"}</span>
        </div>

        <span className="mt-3.5 flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-xs font-bold text-white" style={{ backgroundColor: OLIVE }}>
          {isRtl ? "زيارة المتجر" : "Visit Store"}
        </span>
      </div>
    </Link>
  );
}

// ============================================================
// RECENTLY VIEWED
// ============================================================
function RecentlyViewed() {
  const app = useApp();
  const [recentItems, setRecentItems] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recently_viewed');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentItems(parsed.slice(0, 4));
      } catch (e) {}
    }
  }, []);

  if (recentItems.length === 0) return null;

  return (
    <Section alt>
      <SectionHeader
        title={app.lang === "ar" ? "شاهدتها مؤخراً" : "Recently Viewed"}
        action={
          <Link to="/category/$slug" params={{ slug: "recent" }}>
            <Button variant="ghost" size="sm" className="font-semibold px-3 py-1.5 text-sm" style={{ backgroundColor: "#faf8f8", border: "1.5px solid #f9a8d4", color: "#4a4a4a" }}>
              {app.lang === "ar" ? "شاهد المزيد" : "View More"}
            </Button>
          </Link>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentItems.map((item, index) => (
          <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
            <Suspense fallback={<ProductSkeleton />}>
              <ListingCard item={item} />
            </Suspense>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ============================================================
// SKELETON
// ============================================================
function ProductSkeleton() {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 animate-pulse">
      <div className="aspect-square rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mt-3 w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mt-2 w-1/2" />
    </div>
  );
}

export default Home;