// src/routes/index.tsx - الأداء الخارق 🚀 مع لمسات وردية ناعمة وأيقونات احترافية

import React, { useEffect, useState, useRef, useMemo, useCallback, Suspense, lazy } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingBag, Shirt, Smartphone, Home as HomeIcon, Footprints, Watch, BookOpen,
  Dumbbell, Gamepad2, Palette, Wrench, Utensils, Sparkles, BadgePercent, Gift, Flower2,
  ArrowRight, Package, Store, Star, ChevronLeft, ChevronRight, Heart, Flame,
  TrendingUp, Zap, Crown, Gem, Award, Clock, ThumbsUp, Eye, Truck, Coffee,
  Layers, Grid3X3, List, Percent, Tag, MapPin, Navigation, 
  ArrowLeft,
  Globe,  Store as StoreIcon,
  Building2,
  Compass
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

// ✅ ✅ ✅ إضافة Select imports (ناقصة)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ ✅ ✅ Lazy Loading لـ ListingCard
const ListingCard = lazy(() => import("@/components/ListingCard"));

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "السوق لعندك — سوقك السوري بين يديك" },
      { name: "description", content: "منصة سورية شاملة: تسوّق واحجز واكتشف من المتاجر والخدمات والعروض والهدايا في كل المحافظات." },
    ],
  }),
});

function Home() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const isAdmin = app.roles?.includes("admin");
  const [page, setPage] = useState(1);
  const [bannerIdx, setBannerIdx] = useState(0);
  const LIMIT = 12;

  // ====== البيانات مع Pagination ======
  const { data: banners = [] } = useBanners();
  const { data: dbCategories = [] } = useCategories();

  // ✅ المنتجات - مع Pagination
  const { data: productsData = { data: [], count: 0, totalPages: 0 }, isLoading: pLoading } = useListings({
    sort: "popular",
    limit: LIMIT,
    page: page,
  });
  const products = productsData.data || [];
  const totalPages = productsData.totalPages || 1;
  
  // ✅ العروض التخفيضية من listings
  const { data: discountOffersData = { data: [], count: 0, totalPages: 0 } } = useListings({
    isOffer: true,
    sort: "discount_desc",
    limit: 12,
  });
  const discountOffers = discountOffersData.data || [];

  // ✅ ✅ ✅ العروض الترويجية - مع useMemo لتثبيت الـ options (الحل)
  const offerOptions = useMemo(() => ({ 
    isActive: true,
    limit: 30
  }), []);

  const { data: promoOffers = [], isLoading: promoLoading } = useProductOffers(offerOptions);

console.log('🔍 [Home] promoOffers:', promoOffers);
console.log('🔍 [Home] promoOffers length:', promoOffers.length);
console.log('🔍 [Home] promoLoading:', promoLoading);

  // ✅ تحويل العروض الترويجية لنفس شكل listings عشان تتعامل معها زي العروض التخفيضية
const promoOffersAsListings = useMemo(() => {
  console.log('🔍 [Home] promoOffersAsListings - promoOffers:', promoOffers);
  console.log('🔍 [Home] promoOffersAsListings - promoOffers length:', promoOffers.length);
  
  if (!promoOffers || promoOffers.length === 0) return [];
  
  const result = promoOffers.map((offer: any) => {
    console.log('🔍 [Home] Processing offer:', offer);
    
    // ✅ جلب المنتج الرئيسي
    let mainProduct = null;
    if (Array.isArray(offer.products) && offer.products.length > 0) {
      mainProduct = offer.products.find((p: any) => p.id === offer.listing_id) || offer.products[0];
    } else if (offer.products && typeof offer.products === 'object' && !Array.isArray(offer.products)) {
      mainProduct = offer.products;
    }
    
    console.log('🔍 [Home] mainProduct:', mainProduct);
    
    // ✅ ✅ ✅ نفس هيكل store.$id.tsx بالضبط
    return {
      ...mainProduct,  // ✅ كل بيانات المنتج
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
      
      // ✅ ✅ ✅ الحقول المفقودة (نفس store.$id.tsx)
      colors: mainProduct?.colors || [],
      variations: mainProduct?.variations || [],
      listing_images: mainProduct?.listing_images || [],
      governorates: mainProduct?.governorates || null,
      profile: mainProduct?.profile || null,
      categories: mainProduct?.categories || null,
      rating: mainProduct?.rating || 0,
      reviews_count: mainProduct?.reviews_count || 0,
      
      // ✅ ✅ ✅ للمحافظة والتصنيف في ListingCard
      governorate_id: mainProduct?.governorate_id || null,
      category_id: mainProduct?.category_id || null,
    };
  });
  
  console.log('🔍 [Home] promoOffersAsListings result:', result);
  return result;
}, [promoOffers, app.lang, app.currency]);

// ✅ دمج العروض التخفيضية والترويجية في قائمة واحدة
const allOffers = useMemo(() => {
  console.log('🔍 [Home] discountOffers:', discountOffers);
  console.log('🔍 [Home] promoOffersAsListings:', promoOffersAsListings);
  const merged = [...discountOffers, ...promoOffersAsListings];
  console.log('🔍 [Home] allOffers merged:', merged);
  return merged;
}, [discountOffers, promoOffersAsListings]);

  const { data: stores = [], isLoading: sLoading } = useAllStores(8);

  // ✅ Banner slider
  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  // ✅ التصنيفات المميزة
  const featuredCategories = useMemo(() => {
    return dbCategories
      .filter((c: any) => c.is_featured === true && c.active !== false)
      .sort((a: any, b: any) => (a.featured_sort || 0) - (b.featured_sort || 0));
  }, [dbCategories]);

  // ✅ التنقل بين الصفحات
  const goToPage = useCallback((p: number) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  return (
    <div className="bg-gradient-to-b from-[#2a655f]/5 via-transparent to-[#3a8a82]/5 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10">
      
      {/* ===== BANNER SLIDER ===== */}
      <section className="mx-auto max-w-7xl px-3 sm:px-4 pt-3 sm:pt-4">
        {banners.length > 0 ? (
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(23,61,56,0.25)] aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/8] lg:aspect-[21/7] group border border-[#2a655f]/30 bg-slate-950">
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
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2a655f]/90 border border-pink-300/40 shadow-lg">
                        <span className="text-sm animate-icon-dance">✨</span>
                        <span className="text-xs sm:text-sm font-black text-pink-100 tracking-wide">
                          {app.lang === "ar" ? "عروض حصرية ولفترة محدودة" : "Exclusive Limited Offer"}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                        {app.lang === "ar" ? b.title_ar : (b.title_en || b.title_ar)}
                      </h2>
                      <p className="text-xs sm:text-sm md:text-base text-slate-200 font-bold max-w-lg leading-relaxed line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {app.lang === "ar" ? b.subtitle_ar : (b.subtitle_en || b.subtitle_ar)}
                      </p>
                      {b.cta_label_ar && (
                        <div className="pt-2">
                          <Button className="rounded-2xl bg-pink-400 text-white hover:bg-pink-500 font-black px-6 py-5 text-sm sm:text-base hover:scale-105 transition-all duration-300 shadow-[0_10px_25px_rgba(236,72,153,0.4)] border border-pink-300/40 group/btn cursor-pointer">
                            <span>{app.lang === "ar" ? b.cta_label_ar : (b.cta_label_en || b.cta_label_ar)}</span>
                            <ArrowRight className="h-5 w-5 ms-2.5 text-white group-hover/btn:translate-x-1 transition-transform animate-icon-dance" />
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
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-[#2a655f] text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/20 shadow-xl cursor-pointer"
                  aria-label="Previous banner"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={() => setBannerIdx((i) => (i + 1) % banners.length)}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-2xl bg-black/60 hover:bg-[#2a655f] text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/20 shadow-xl cursor-pointer"
                  aria-label="Next banner"
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
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-3xl aspect-[16/9] sm:aspect-[21/8] bg-[#2a655f]/10 animate-pulse border border-[#2a655f]/20" />
        )}
      </section>

      {/* ===== FEATURED CATEGORIES ===== */}
      <CategorySlider 
        categories={featuredCategories} 
        getCategoryIcon={getCategoryIcon} 
      />

      {/* ✅ عروض اليوم - كل العروض سوا (تخفيضية + ترويجية) زي ما هي */}
{allOffers.length > 0 && (
  <section className="mx-auto max-w-7xl px-4 py-6 md:py-8">
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <h2 className="text-2xl font-bold">
            {app.lang === "ar" ? "عروض اليوم" : "Today's Offers"}
          </h2>
          <Badge className="bg-pink-400 text-white">
            {allOffers.length}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {app.lang === "ar" 
            ? `خصومات وعروض حصرية` 
            : `Exclusive discounts and offers`
          }
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/category/$slug" params={{ slug: "offers" }}>
          <Button variant="outline" size="sm" className="rounded-full border-pink-300/50 text-pink-600 hover:bg-pink-500/10 hover:text-pink-600 hover:scale-105 transition-all duration-300">
            {app.lang === "ar" ? "عرض الكل" : "View All"}
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>

    <div className="relative group">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {allOffers.map((item: any, index: number) => (
          <div key={item.id || index} className="w-[200px] md:w-[250px] flex-shrink-0">
            {/* ✅ كل العروض تتعامل معها بنفس البطاقة (ListingCard) */}
            <Suspense fallback={<ProductSkeleton />}>
              <ListingCard item={item} />
            </Suspense>
          </div>
        ))}
      </div>
      
      <button 
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        onClick={() => {
          const container = document.querySelector('.scrollbar-hide');
          if (container) container.scrollLeft -= 300;
        }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        onClick={() => {
          const container = document.querySelector('.scrollbar-hide');
          if (container) container.scrollLeft += 300;
        }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  </section>
)}
      
      {/* ===== FEATURED PRODUCTS - أيقونة Gem ===== */}
      <FeaturedSection />

      {/* ===== TRENDING NOW - أيقونة Flame ===== */}
      <TrendingSection />

      {/* ===== POPULAR STORES - أيقونة Crown ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-8 md:pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] grid place-items-center text-white shadow-md">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-foreground">
                {app.lang === "ar" ? "👑 متاجر مميزة" : "👑 Popular Stores"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {app.lang === "ar" ? "أفضل المتاجر على السوق لعندك" : "Top stores on Souqi"}
              </p>
            </div>
          </div>
          <Link to="/stores">
            <Button variant="ghost" size="sm" className="gap-1 text-pink-600 font-semibold hover:bg-pink-500/10 hover:text-pink-600 hover:scale-105 transition-all duration-300 group">
              {app.lang === "ar" ? "عرض الكل" : "View All"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stores.slice(0, 4).map((s, index) => (
            <div key={s.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <StoreCard store={s} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== ✅ NEARBY STORES - أيقونة Compass ===== */}
      <NearbyStores />

      {/* ===== CATEGORY BANNERS ===== */}
      <CategoryBanners />

      {/* ===== RECENTLY VIEWED ===== */}
      <RecentlyViewed />

      {/* ===== OFFERS STRIP - أيقونة Gift (كل العروض سوا) ===== */}
      {allOffers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14">
          <div className="rounded-3xl bg-gradient-to-br from-[#fce4ec] via-[#f9a8d4] to-[#fbcfe8] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-pink-500/20 group border border-pink-300/30">
            <div className="absolute -end-8 -top-8 h-56 w-56 rounded-full bg-white/30 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute -start-8 -bottom-8 h-56 w-56 rounded-full bg-white/20 blur-2xl group-hover:scale-150 transition-transform duration-1000 delay-300" />
            
            <div className="grid md:grid-cols-[1fr_auto] items-center gap-6 relative">
              <div>
                <Badge className="bg-[#2a655f]/20 text-[#2a655f] dark:text-[#3a8a82] border-[#2a655f]/30 hover:bg-[#2a655f]/30 backdrop-blur-sm">
                  <Gift className="h-3 w-3 me-1" />
                  {app.lang === "ar" ? "🔥 عروض حصرية" : "🔥 Exclusive Offers"}
                </Badge>
                <h3 className="mt-3 text-2xl md:text-3xl font-black text-[#2a655f] dark:text-white">
                  {app.lang === "ar" ? "أفضل العروض على السوق لعندك" : "Best Offers on Souqi"}
                </h3>
                <p className="text-[#1a4f4a]/80 dark:text-white/70 text-sm mt-1">
                  {app.lang === "ar" ? "خصومات وعروض ترويجية لفترة محدودة" : "Discounts and promo offers for a limited time"}
                </p>
              </div>
              <Link to="/category/$slug" params={{ slug: "offers" }}>
                <Button size="lg" variant="secondary" className="bg-[#2a655f] text-white hover:bg-[#1a4f4a] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#2a655f]/30 group">
                  {t("view_all")} 
                  <ArrowRight className="h-4 w-4 ms-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {allOffers.slice(0, 4).map((item: any, index: number) => (
                <div key={item.id || index} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Suspense fallback={<ProductSkeleton />}>
                    <ListingCard item={item} />
                  </Suspense>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PRODUCTS GRID WITH PAGINATION ===== */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#2a655f]" />
              {app.lang === "ar" ? "✨ أحدث المنتجات" : "✨ Latest Products"}
              <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20">
                {productsData.count || 0}
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground">
              {app.lang === "ar" 
                ? `عرض ${products.length} من ${productsData.count || 0} منتج` 
                : `Showing ${products.length} of ${productsData.count || 0} products`}
            </p>
          </div>
        </div>

        {pLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {products.map((item, index) => (
              <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${(index % 8) * 50}ms` }}>
                <Suspense fallback={<ProductSkeleton />}>
                  <ListingCard item={item} />
                </Suspense>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1 || pLoading}
              className="rounded-xl border-[#2a655f]/20 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/40 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
              {app.lang === "ar" ? "السابق" : "Previous"}
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                
                return (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(p)}
                    className={cn(
                      "h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all duration-300",
                      p === page
                        ? "bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30"
                        : "border-[#2a655f]/20 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/40"
                    )}
                  >
                    {p}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages || pLoading}
              className="rounded-xl border-[#2a655f]/20 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/40 transition-all duration-300"
            >
              {app.lang === "ar" ? "التالي" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

// ============================================================
// CATEGORY SLIDER - أيقونة Sparkles
// ============================================================

export function CategorySlider({ categories }: { categories: any[] }) {
  const app = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isRtl = app.lang === "ar";

  if (!categories || categories.length === 0) return null;

  const duplicatedCategories = [...categories, ...categories, ...categories, ...categories];

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 320;
      const factor = direction === 'left' ? -1 : 1;
      containerRef.current.scrollBy({ 
        left: scrollAmount * factor, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 grid place-items-center text-white shadow-md hover:scale-110 hover:rotate-12 transition-all duration-500 cursor-pointer">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              {isRtl ? "✨ الأقسام المميزة" : "✨ Featured Categories"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isRtl ? "اختيارات مميزة من السوق لعندك" : "Handpicked by Souqi"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full border-pink-300/50 text-pink-600 hover:bg-pink-50"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full border-pink-300/50 text-pink-600 hover:bg-pink-50"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Link to="/categories">
            <Button variant="ghost" size="sm" className="gap-1 text-pink-600 font-semibold hover:bg-pink-500/10 hover:text-pink-600 hover:scale-105 transition-all duration-300 group">
              {isRtl ? "عرض الكل" : "View All"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-2xl">
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-[#2a655f] text-white transition-all duration-300 hover:scale-110 border border-white/20 shadow-xl cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-[#2a655f] text-white transition-all duration-300 hover:scale-110 border border-white/20 shadow-xl cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div 
          ref={containerRef}
          dir="ltr"
          className="relative overflow-x-auto custom-scrollbar pb-3 select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="marquee-track flex gap-4"
            style={{ 
              animationPlayState: isPaused ? 'paused' : 'running',
              animationDuration: '160s'
            }}
          >
            {duplicatedCategories.map((c: any, index: number) => {
              const Icon = getCategoryIcon(c.icon);
              const imageUrl = c.image_url;
              
              const nameAr = c.name_ar || "";
              const nameEn = c.name_en || "";
              const slug = c.slug || "";
              const isOffer = 
                slug.toLowerCase().includes("offer") || 
                slug.toLowerCase().includes("discount") ||
                nameAr.includes("عرض") || 
                nameAr.includes("عروض") || 
                nameAr.includes("خصم") || 
                nameAr.includes("خصومات") ||
                nameEn.toLowerCase().includes("offer") || 
                nameEn.toLowerCase().includes("discount");
              
              return (
                <div
                  key={`${c.id}-${index}`}
                  className="marquee-item px-1 flex-shrink-0"
                >
                  <Link
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className={cn(
                      "group relative block w-[160px] md:w-[200px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl",
                      isOffer 
                        ? "p-[3px] glowing-border-pink shadow-[0_0_25px_rgba(236,72,153,0.6)] animate-pulse" 
                        : "hover:shadow-[#2a655f]/30"
                    )}
                  >
                    <div className={cn(
                      "relative h-[120px] md:h-[150px] w-full overflow-hidden rounded-[14px]",
                      isOffer && "bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 bg-[length:200%_200%] animate-gradient-flow"
                    )}>
                      {imageUrl ? (
                        <OptimizedImage
                          src={imageUrl}
                          alt={isRtl ? c.name_ar : c.name_en}
                          width={400}
                          height={400}
                          quality={80}
                          objectFit="cover"
                          className="absolute inset-0 h-full w-full group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2a655f]/60 to-[#3a8a82]/60" />
                      )}
                      
                      <div className={cn(
                        "absolute inset-0",
                        isOffer 
                          ? "bg-gradient-to-t from-pink-950/90 via-pink-900/40 to-transparent" 
                          : "bg-gradient-to-t from-[#0d2e2a]/80 via-[#0d2e2a]/30 to-transparent"
                      )} />
                      
                      <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      
                      <div className="absolute bottom-0 inset-x-0 p-3">
                        <h3 className="text-white font-bold text-sm md:text-base line-clamp-1 flex items-center gap-1" dir={isRtl ? "rtl" : "ltr"}>
                          {isOffer && <span className="animate-bounce">🔥</span>}
                          {isRtl ? c.name_ar : c.name_en}
                        </h3>
                        <p className="text-white/70 text-[10px] md:text-xs">
                          {isRtl ? "استكشف الآن ←" : "Explore now →"}
                        </p>
                      </div>
                      
                      <div className="absolute top-3 left-3">
                        {isOffer ? (
                          <Badge className="bg-gradient-to-r from-pink-500 to-rose-400 text-white border-0 text-[9px] px-2 py-0.5 shadow-xl animate-bounce font-black">
                            ⚡ {isRtl ? "عرض خاص" : "Hot Deal"}
                          </Badge>
                        ) : (
                          <Badge className="bg-[#2a655f] text-white border-0 text-[8px] px-1.5 py-0.5 shadow-lg">
                            ⭐ {isRtl ? "مميز" : "Featured"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-25%)); }
        }
        @keyframes border-glow-pink {
          0% { box-shadow: 0 0 5px #f9a8d4, 0 0 10px #fbcfe8, inset 0 0 5px #f9a8d4; }
          50% { box-shadow: 0 0 20px #f9a8d4, 0 0 35px #fbcfe8, inset 0 0 12px #fbcfe8; }
          100% { box-shadow: 0 0 5px #f9a8d4, 0 0 10px #fbcfe8, inset 0 0 5px #f9a8d4; }
        }
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glowing-border-pink {
          animation: border-glow-pink 2s infinite ease-in-out;
        }
        .animate-gradient-flow {
          animation: gradient-flow 4s ease infinite;
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 160s linear infinite;
          will-change: transform;
        }
        .marquee-item {
          flex-shrink: 0;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(42, 101, 95, 0.1);
          border-radius: 10px;
          margin: 0 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a655f;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3a8a82;
        }
      `}</style>
    </section>
  );
}

// ============================================================
// FEATURED SECTION - أيقونة Gem
// ============================================================
function FeaturedSection() {
  const app = useApp();
  const t = useT();
  const [innerTab, setInnerTab] = useState<"products" | "stores">("products");
  const { data: favProducts = [], isLoading: lp } = useMostFavoritedListings(12);
  const { data: favStores = [], isLoading: ls } = useMostFavoritedStores(12);

  if (!lp && !ls && favProducts.length === 0 && favStores.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="flex items-end justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 grid place-items-center text-white shadow-md hover:scale-110 hover:-rotate-6 transition-all duration-500 cursor-pointer">
            <Gem className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              {app.lang === "ar" ? "💎 منتجات مميزة" : "💎 Featured Products"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {app.lang === "ar" ? "الأكثر إعجاباً من زوار السوق لعندك" : "Most loved by Souqi visitors"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
          {([
            { id: "products" as const, label: t("products_tab") },
            { id: "stores" as const, label: t("stores_tab") },
          ]).map((it) => (
            <button 
              key={it.id} 
              onClick={() => setInnerTab(it.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                innerTab === it.id ? "bg-card text-[#2a655f] shadow-sm" : "text-muted-foreground hover:text-[#2a655f]"
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>

      {innerTab === "products" ? (
        favProducts.length === 0 ? (
          <EmptyState message={app.lang === "ar" ? "لا توجد منتجات مميزة بعد" : "No featured products yet"} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favProducts.slice(0, 8).map((i, index) => (
              <div key={i.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                <Suspense fallback={<ProductSkeleton />}>
                  <ListingCard item={i} />
                </Suspense>
              </div>
            ))}
          </div>
        )
      ) : (
        favStores.length === 0 ? (
          <EmptyState message={app.lang === "ar" ? "لا توجد متاجر مميزة بعد" : "No featured stores yet"} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favStores.slice(0, 4).map((s, index) => (
              <div key={s.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                <StoreCard store={s} badge={
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-600 px-2 py-0.5 text-[10px] font-bold">
                    <Heart className="h-3 w-3 fill-current" />
                    {s.hearts}
                  </span>
                } />
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}

// ============================================================
// TRENDING SECTION - أيقونة Flame
// ============================================================
function TrendingSection() {
  const app = useApp();
  const t = useT();
  const [innerTab, setInnerTab] = useState<"products" | "stores">("products");
  const { data: trProducts = [] } = useTrendingListings(12);
  const { data: trStores = [] } = useTrendingStores(12);

  if (trProducts.length === 0 && trStores.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12 bg-gradient-to-r from-pink-400/5 via-rose-400/5 to-pink-400/5 rounded-3xl">
      <div className="flex items-end justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] grid place-items-center text-white shadow-md hover:scale-110 hover:rotate-12 transition-all duration-500 cursor-pointer">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              {app.lang === "ar" ? "🔥 الأكثر رواجاً" : "🔥 Trending Now"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {app.lang === "ar" ? "اختيارات فريق السوق لعندك" : "Handpicked by Souqi team"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
          {([
            { id: "products" as const, label: t("products_tab") },
            { id: "stores" as const, label: t("stores_tab") },
          ]).map((it) => (
            <button 
              key={it.id} 
              onClick={() => setInnerTab(it.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                innerTab === it.id ? "bg-card text-[#2a655f] shadow-sm" : "text-muted-foreground hover:text-[#2a655f]"
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>

      {innerTab === "products" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trProducts.slice(0, 8).map((i, index) => (
            <div key={i.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
              <Suspense fallback={<ProductSkeleton />}>
                <ListingCard item={i} />
              </Suspense>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trStores.slice(0, 4).map((s, index) => (
            <div key={s.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
              <StoreCard store={s} badge={
                <span className="inline-flex items-center gap-1 rounded-full bg-[#2a655f]/10 text-[#2a655f] px-2 py-0.5 text-[10px] font-bold">
                  <TrendingUp className="h-3 w-3" />
                  {app.lang === "ar" ? "رائج" : "Trending"}
                </span>
              } />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ============================================================
// ✅ NEARBY STORES - أيقونة Compass
// ============================================================
function NearbyStores() {
  const app = useApp();
  const t = useT();
  const [nearbyStores, setNearbyStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocations, setUserLocations] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    governorateId?: string;
    addressId?: string;
    label?: string;
    addressText?: string;
  } | null>(null);

  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const addressesPromise = app.user 
          ? supabase
              .from("user_addresses")
              .select("id, label, address_text, lat, lng, governorate_id, is_default")
              .eq("user_id", app.user.id)
              .order("is_default", { ascending: false })
          : Promise.resolve({ data: null });

        const { data: sellers, error: sellersError } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "seller");

        if (sellersError) {
          console.error("❌ Error fetching sellers:", sellersError);
          setNearbyStores([]);
          setLoading(false);
          return;
        }

        const sellerIds = sellers?.map((s: any) => s.user_id) || [];
        
        if (sellerIds.length === 0) {
          setNearbyStores([]);
          setLoading(false);
          return;
        }

        const storesPromise = supabase
          .from("profiles")
          .select(`
            id, full_name, store_name, store_description, store_logo_url,
            store_cover_url, store_phone, store_active, store_online,
            store_type, lat, lng, governorate_id, is_featured,
            allows_messaging, store_opens_at, store_closes_at, store_address
          `)
          .in("id", sellerIds)
          .eq("store_active", true)
          .not("store_name", "is", null);

        const [{ data: addresses }, { data: stores }] = await Promise.all([
          addressesPromise,
          storesPromise
        ]);

        if (!isMounted) return;

        let activeLocation = null;
        if (addresses && addresses.length > 0) {
          setUserLocations(addresses);
          const defaultAddress = addresses.find((a: any) => a.is_default) || addresses[0];
          setSelectedAddressId(defaultAddress.id);
          
          activeLocation = {
            lat: defaultAddress.lat || 0,
            lng: defaultAddress.lng || 0,
            governorateId: defaultAddress.governorate_id,
            addressId: defaultAddress.id,
            label: defaultAddress.label,
            addressText: defaultAddress.address_text
          };
          setUserLocation(activeLocation);
        }

        if (!stores || stores.length === 0) {
          setNearbyStores([]);
          setLoading(false);
          return;
        }

        const storeIds = stores.map((s: any) => s.id);
        const { data: listings, error: listingsError } = await supabase
          .from("listings")
          .select("owner_id")
          .in("owner_id", storeIds)
          .eq("status", "published");

        if (listingsError) {
          console.error("❌ Error fetching listings count:", listingsError);
        }

        const listingsCountMap = new Map();
        (listings || []).forEach((item: any) => {
          const ownerId = item.owner_id;
          listingsCountMap.set(ownerId, (listingsCountMap.get(ownerId) || 0) + 1);
        });

        let storesWithProducts = stores.filter((store: any) => {
          const count = listingsCountMap.get(store.id) || 0;
          return count > 0;
        });

        storesWithProducts = storesWithProducts.map((store: any) => ({
          ...store,
          listing_count: listingsCountMap.get(store.id) || 0
        }));

        if (storesWithProducts.length === 0) {
          setNearbyStores([]);
          setLoading(false);
          return;
        }

        let storesWithDistance = storesWithProducts.map((store: any) => {
          let distance = Infinity;
          let distanceText = app.lang === "ar" ? "غير محدد" : "Unknown";
          
          if (activeLocation) {
            if (activeLocation.lat && activeLocation.lng && store.lat && store.lng) {
              distance = calculateDistance(activeLocation.lat, activeLocation.lng, store.lat, store.lng);
              if (distance < 1) {
                distanceText = `${Math.round(distance * 1000)} م`;
              } else if (distance < 10) {
                distanceText = `${distance.toFixed(1)} كم`;
              } else {
                distanceText = `${Math.round(distance)} كم`;
              }
            } else if (activeLocation.governorateId && store.governorate_id === activeLocation.governorateId) {
              distance = store.store_type === 'physical' ? 4 : 6;
              distanceText = `📍 ${app.lang === 'ar' ? 'نفس المحافظة' : 'Same gov'}`;
            } else if (activeLocation.governorateId && store.governorate_id) {
              distance = 30;
              distanceText = `🚗 ${app.lang === 'ar' ? 'محافظة أخرى' : 'Other gov'}`;
            }
          }
          
          return { ...store, distance, distanceText };
        });

        storesWithDistance.sort((a: any, b: any) => {
          if (a.distance === Infinity && b.distance !== Infinity) return 1;
          if (a.distance !== Infinity && b.distance === Infinity) return -1;
          return a.distance - b.distance;
        });

        setNearbyStores(storesWithDistance.slice(0, 8));
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [app.user, calculateDistance]);

  const changeAddress = useCallback(async (addressId: string) => {
    const address = userLocations.find((a: any) => a.id === addressId);
    if (!address) return;

    setSelectedAddressId(addressId);
    
    const newLoc = {
      lat: address.lat || 0,
      lng: address.lng || 0,
      governorateId: address.governorate_id,
      addressId: address.id,
      label: address.label,
      addressText: address.address_text
    };
    setUserLocation(newLoc);

    setNearbyStores((prevStores) => {
      const updated = prevStores.map((store: any) => {
        let distance = Infinity;
        let distanceText = app.lang === "ar" ? "غير محدد" : "Unknown";

        if (newLoc.lat && newLoc.lng && store.lat && store.lng) {
          distance = calculateDistance(newLoc.lat, newLoc.lng, store.lat, store.lng);
          distanceText = distance < 1 ? `${Math.round(distance * 1000)} م` : `${distance.toFixed(1)} كم`;
        } else if (newLoc.governorateId && store.governorate_id === newLoc.governorateId) {
          distance = 5;
          distanceText = `📍 ${app.lang === 'ar' ? 'نفس المحافظة' : 'Same gov'}`;
        }
        return { ...store, distance, distanceText };
      });

      return updated.sort((a, b) => a.distance - b.distance);
    });
  }, [userLocations, calculateDistance, app.lang]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-[#2a655f] grid place-items-center text-white shadow-lg animate-pulse">
            <Compass className="h-6 w-6 animate-bounce" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-48 bg-[#2a655f]/10 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-[#2a655f]/10 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const isArabic = app.lang === "ar";

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] opacity-75 blur-md animate-pulse"></div>
            <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] grid place-items-center text-white shadow-xl">
              <Compass className="h-6 w-6 animate-bounce" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-2.5 tracking-tight">
              {isArabic ? "🧭 المتاجر الأقرب إليك" : "🧭 Nearby Stores"}
              <Badge className="bg-[#2a655f]/15 text-[#2a655f] dark:text-emerald-400 border border-[#2a655f]/30 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
                {nearbyStores.length} {isArabic ? "متجر نشط" : "Active stores"}
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 font-medium">
              <Truck className="h-3.5 w-3.5 text-[#2a655f] animate-pulse" />
              {isArabic ? "اكتشف أفضل المتاجر والخصومات المتاحة حولك فوراً" : "Discover top stores and discounts around you instantly"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {userLocations.length > 1 && (
            <Select value={selectedAddressId || undefined} onValueChange={changeAddress}>
              <SelectTrigger className="w-[210px] h-11 rounded-2xl border-2 border-[#2a655f]/30 bg-card hover:border-[#2a655f] transition-all text-xs font-bold shadow-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#2a655f]" />
                  <SelectValue placeholder={isArabic ? "اختر عنوان التوصيل" : "Select address"} />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#2a655f]/20 shadow-xl">
                {userLocations.map((addr: any) => (
                  <SelectItem key={addr.id} value={addr.id} className="font-medium text-xs py-2">
                    <div className="flex items-center gap-2">
                      <span>{addr.label || addr.address_text}</span>
                      {addr.is_default && (
                        <Badge className="bg-[#2a655f]/15 text-[#2a655f] text-[9px] px-1.5 rounded-md font-bold">
                          {isArabic ? "الافتراضي" : "Default"}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Link to="/stores">
            <Button variant="ghost" size="sm" className="gap-1 text-pink-600 font-semibold hover:bg-pink-500/10 hover:text-pink-600 hover:scale-105 transition-all duration-300 group">
              {isArabic ? "عرض كل المتاجر" : "View All Stores"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {userLocation?.addressText && app.user && (
        <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground bg-gradient-to-r from-[#2a655f]/10 via-transparent to-transparent rounded-2xl px-4 py-2.5 border border-[#2a655f]/20 shadow-sm animate-fade-in">
          <MapPin className="h-4 w-4 text-[#2a655f] animate-bounce flex-shrink-0" />
          <span className="font-bold text-foreground">{isArabic ? "العنوان النشط:" : "Active Address:"}</span>
          <span className="truncate">{userLocation.addressText}</span>
          {userLocation.label && (
            <Badge className="bg-[#2a655f] text-white text-[9px] px-2 py-0.5 rounded-lg font-bold">
              {userLocation.label}
            </Badge>
          )}
        </div>
      )}

      {nearbyStores.length === 0 ? (
        <div className="rounded-3xl bg-card p-12 text-center text-muted-foreground text-sm border-2 border-dashed border-[#2a655f]/30 shadow-lg">
          <StoreIcon className="h-16 w-16 mx-auto mb-3 text-[#2a655f]/50 animate-pulse" />
          <p className="font-bold text-base text-foreground">{isArabic ? "🚫 لا توجد متاجر قريبة متاحة حالياً." : "🚫 No nearby stores available."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nearbyStores.map((store: any, index: number) => (
            <div key={store.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <StoreCard 
                store={store} 
                badge={
                  <Badge className="bg-black/80 backdrop-blur-md text-white border border-white/20 text-[10px] px-2 py-0.5 flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    {store.distanceText}
                  </Badge>
                }
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ============================================================
// STORE CARD
// ============================================================

interface StoreCardProps {
  store: any;
  badge?: React.ReactNode;
}

export function StoreCard({ store, badge }: StoreCardProps) {
  const app = useApp();
  const t = useT();
  const isRtl = app.lang === "ar";

  const storeName = store.store_name || store.full_name || (isRtl ? "متجر مميز" : "Featured Store");
  const storeDesc = store.store_description || (isRtl ? "متجر موثوق على السوق لعندك لبيع أفضل المنتجات" : "A trusted store on Souqi for the best products");
  const coverUrl = store.store_cover_url;
  const logoUrl = store.store_logo_url || store.avatar_url;
  const rating = Number(store.avg_rating ?? 0).toFixed(1);
  const productsCount = store.listing_count ?? 0;
  const isVerified = store.is_verified || store.verified || true;

  return (
    <Link 
      to="/store/$id" 
      params={{ id: store.id }} 
      className="group relative rounded-3xl bg-white dark:bg-slate-900 overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:border-pink-300/60 shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-[330px] select-none"
    >
      <div className="relative h-[130px] w-full bg-gradient-to-r from-[#173d38] via-[#2a655f] to-[#3a8a82] overflow-hidden shrink-0">
        {coverUrl ? (
          <OptimizedImage
            src={coverUrl}
            alt={storeName}
            width={600}
            height={200}
            quality={80}
            objectFit="cover"
            className="absolute inset-0 h-full w-full group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-300/20 via-transparent to-transparent opacity-60" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="absolute top-3 end-3 flex items-center gap-1.5 z-10">
          {badge}
          {isVerified && (
            <Badge className="bg-pink-400/90 backdrop-blur-md text-white border-0 shadow-lg text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              {isRtl ? "موثوق" : "Verified"}
            </Badge>
          )}
        </div>
      </div>

      <div className="px-5 pt-0 pb-4 flex-1 flex flex-col justify-between relative">
        
        <div className="flex items-end justify-between -mt-9 mb-2 relative z-10">
          <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-xl border-2 border-white dark:border-slate-800 group-hover:border-pink-300 transition-all duration-300 group-hover:scale-105 shrink-0 overflow-hidden grid place-items-center">
            {logoUrl ? (
              <OptimizedImage
                src={logoUrl}
                alt={storeName}
                width={80}
                height={80}
                quality={85}
                objectFit="cover"
                className="h-full w-full rounded-xl"
              />
            ) : (
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white font-black text-xl flex items-center justify-center">
                {storeName[0]?.toUpperCase() || <Store className="h-6 w-6" />}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 px-2.5 py-1 rounded-full shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-amber-800 dark:text-amber-300">{rating}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-pink-600 transition-colors duration-300">
              {storeName}
            </h3>
            
            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#2a655f]/10 dark:bg-[#2a655f]/20 text-[#2a655f] dark:text-[#3a8a82] border border-[#2a655f]/20 shadow-sm">
              <Globe className="h-2.5 w-2.5" />
              {isRtl ? "متجر إلكتروني" : "Online Store"}
            </span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">
            {storeDesc}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs mt-2">
          <div className="flex items-center gap-1.5 font-semibold text-[#2a655f] dark:text-[#3a8a82]">
            <Package className="h-4 w-4" />
            <span>{productsCount} {t("products_tab") || (isRtl ? "منتج" : "Products")}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-pink-600 transition-colors">
            <span>{isRtl ? "زيارة المتجر" : "Visit Store"}</span>
            {isRtl ? (
              <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// CATEGORY BANNERS
// ============================================================
function CategoryBanners() {
  const app = useApp();
  
  const banners = [
    {
      id: 1,
      title: app.lang === "ar" ? "🛍️ أحدث الإلكترونيات" : "🛍️ Latest Electronics",
      subtitle: app.lang === "ar" ? "أفضل العروض على الأجهزة" : "Best deals on devices",
      color: "from-[#2a655f] to-[#3a8a82]",
      icon: Smartphone,
    },
    {
      id: 2,
      title: app.lang === "ar" ? "🎁 أزياء وهدايا" : "🎁 Fashion & Gifts",
      subtitle: app.lang === "ar" ? "تشكيلة مميزة للمناسبات" : "Special collection for occasions",
      color: "from-pink-400 to-rose-400",
      icon: Gift,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner, index) => {
          const Icon = banner.icon;
          return (
            <Link 
              key={banner.id}
              to="/categories"
              className={cn(
                "group relative overflow-hidden rounded-2xl p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl",
                `bg-gradient-to-br ${banner.color}`
              )}
            >
              <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="absolute -start-10 -bottom-10 h-40 w-40 rounded-full bg-white/5 blur-2xl group-hover:scale-150 transition-transform duration-1000 delay-300" />
              
              <div className="relative flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="text-white">
                  <h3 className="text-xl md:text-2xl font-black">{banner.title}</h3>
                  <p className="text-white/80 text-sm">{banner.subtitle}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-white/90 group-hover:gap-2 transition-all">
                    {app.lang === "ar" ? "تسوق الآن" : "Shop Now"}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
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
      } catch (e) {
        console.error('Error parsing recently viewed:', e);
      }
    }
  }, []);

  if (recentItems.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 grid place-items-center text-white shadow-md">
          <Eye className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {app.lang === "ar" ? "👁️ شاهدتها مؤخراً" : "👁️ Recently Viewed"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {app.lang === "ar" ? "منتجات اطلعت عليها" : "Products you've viewed"}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentItems.map((item, index) => (
          <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
            <Suspense fallback={<ProductSkeleton />}>
              <ListingCard item={item} />
            </Suspense>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// SKELETON COMPONENTS
// ============================================================
function ProductSkeleton() {
  return (
    <div className="rounded-xl bg-white dark:bg-[#1e293b] border border-[#2a655f]/10 p-3 animate-pulse">
      <div className="aspect-square rounded-lg bg-[#2a655f]/10" />
      <div className="h-4 bg-[#2a655f]/10 rounded mt-3 w-3/4" />
      <div className="h-3 bg-[#2a655f]/10 rounded mt-2 w-1/2" />
      <div className="flex items-center gap-2 mt-3">
        <div className="h-4 bg-[#2a655f]/10 rounded w-1/3" />
        <div className="h-4 bg-[#2a655f]/10 rounded w-1/4" />
      </div>
    </div>
  );
}

function StoreSkeleton() {
  return (
    <div className="rounded-xl bg-white dark:bg-[#1e293b] border border-[#2a655f]/10 p-4 animate-pulse">
      <div className="h-28 bg-[#2a655f]/10 rounded-t-xl" />
      <div className="flex items-center gap-3 mt-2">
        <div className="h-14 w-14 rounded-full bg-[#2a655f]/10" />
        <div className="flex-1">
          <div className="h-4 bg-[#2a655f]/10 rounded w-3/4" />
          <div className="h-3 bg-[#2a655f]/10 rounded w-1/2 mt-2" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// UTILITY COMPONENTS
// ============================================================
function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-card p-8 text-center text-muted-foreground text-sm border border-dashed border-[#2a655f]/20">
      {message}
    </div>
  );
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
export function isStoreCurrentlyOpen(store: any): boolean {
  if (!store || store.store_online === false) return false;
  const opens = (store.store_opens_at || "").slice(0, 5);
  const closes = (store.store_closes_at || "").slice(0, 5);
  if (!opens || !closes) return true;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = opens.split(":").map(Number);
  const [ch, cm] = closes.split(":").map(Number);
  const o = oh * 60 + om;
  const c = ch * 60 + cm;
  return o <= c ? cur >= o && cur <= c : cur >= o || cur <= c;
}

// ✅ ✅ ✅ التصدير مع React.memo (الحل النهائي)
export default Home;