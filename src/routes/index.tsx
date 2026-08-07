// src/routes/index.tsx - الأداء العالي 🚀

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingBag, Shirt, Smartphone, Home as HomeIcon, Footprints, Watch, BookOpen,
  Dumbbell, Gamepad2, Palette, Wrench, Utensils, Sparkles, BadgePercent, Gift, Flower2,
  ArrowRight, Package, Store, Star, ChevronLeft, ChevronRight, Heart, Flame,
  TrendingUp, Zap, Crown, Gem, Award, Clock, ThumbsUp, Eye, Truck, Coffee,
  Layers, Grid3X3, List, Percent, Tag,
} from "lucide-react";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useApp, useT } from "@/lib/i18n";
import { useListings, useBanners, useAllStores, useCategories, useMostFavoritedListings, useMostFavoritedStores, useTrendingListings, useTrendingStores } from "@/lib/queries";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "السوق عندك — سوقك السوري بين يديك" },
      { name: "description", content: "منصة سورية شاملة: تسوّق واحجز واكتشف من المتاجر والخدمات والعروض والهدايا في كل المحافظات." },
    ],
  }),
});

function Home() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const isAdmin = app.roles?.includes("admin");

  // ✅ التحقق من اكتمال الملف الشخصي (تحسين: useCallback)
  const checkProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const [{ data: profile }, { data: addressRows }] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, phone, address_text")
        .eq("id", session.user.id)
        .maybeSingle(),
      supabase
        .from("user_addresses")
        .select("address_text")
        .eq("user_id", session.user.id)
        .eq("is_default", true)
        .maybeSingle(),
    ]);
    
    const hasAddress = Boolean(profile?.address_text?.trim() || addressRows?.address_text?.trim());
    const isMissing = !profile?.full_name?.trim() || !profile?.phone?.trim() || !hasAddress;
    
    if (isMissing && window.location.pathname !== "/auth/complete") {
      window.location.replace("/auth/complete");
    }
  }, []);

  useEffect(() => {
    checkProfile();
  }, [checkProfile]);

  const { data: banners = [] } = useBanners();
  const { data: dbCategories = [] } = useCategories();
  const [bannerIdx, setBannerIdx] = useState(0);

  // ============================================================
  // ✅ استخدام useListings مع التنسيق الجديد { data, count, totalPages }
  // ============================================================

  // ✅ المنتجات - استخراج data من النتيجة
  const { data: productsData = { data: [], count: 0, totalPages: 0 }, isLoading: pLoading } = useListings({
    sort: "popular",
    limit: 8,
  });
  const products = productsData.data || [];

  // ✅ العروض - استخراج data من النتيجة
  const { data: allDealsData = { data: [], count: 0, totalPages: 0 } } = useListings({
    isOffer: true,
    sort: "discount_desc",
    limit: 20,
  });
  const allDeals = allDealsData.data || [];

  // ✅ العروض الحصرية - استخراج data من النتيجة
  const { data: offersData = { data: [], count: 0, totalPages: 0 } } = useListings({
    isOffer: true,
    limit: 6,
    sort: "recent",
  });
  const offers = offersData.data || [];

  // ✅ العروض الأولى فقط - الآن slice يعمل بشكل صحيح
  const dealsOfTheDay = useMemo(() => allDeals.slice(0, 4), [allDeals]);

  const { data: stores = [], isLoading: sLoading } = useAllStores(8);

  // ✅ Banner slider
  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  // ✅ التصنيفات المميزة - مع useMemo
  const featuredCategories = useMemo(() => {
    return dbCategories
      .filter((c: any) => c.is_featured === true && c.active !== false)
      .sort((a: any, b: any) => (a.featured_sort || 0) - (b.featured_sort || 0));
  }, [dbCategories]);

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
                <img
                  src={b.image_url}
                  alt={app.lang === "ar" ? b.title_ar : (b.title_en || b.title_ar)}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-10000 ease-out"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex flex-col items-start justify-center p-6 sm:p-10 md:p-14 text-white">
                  {bannerIdx === i && (
                    <div className="animate-banner-reveal space-y-3 sm:space-y-4 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2a655f]/90 border border-emerald-400/40 shadow-lg">
                        <span className="text-sm animate-icon-dance">✨</span>
                        <span className="text-xs sm:text-sm font-black text-emerald-100 tracking-wide">
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
                          <Button className="rounded-2xl bg-white text-[#2a655f] hover:bg-slate-100 font-black px-6 py-5 text-sm sm:text-base hover:scale-105 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.4)] border border-white/40 group/btn cursor-pointer">
                            <span>{app.lang === "ar" ? b.cta_label_ar : (b.cta_label_en || b.cta_label_ar)}</span>
                            <ArrowRight className="h-5 w-5 ms-2.5 text-[#2a655f] group-hover/btn:translate-x-1 transition-transform animate-icon-dance" />
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
                      bannerIdx === i ? "w-8 sm:w-10 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" : "w-2 bg-white/50 hover:bg-white/80"
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
      <CategorySlider categories={featuredCategories} />

      {/* ===== DEALS OF THE DAY ===== */}
      {allDeals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6 md:py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 grid place-items-center text-white shadow-md animate-pulse">
                <Percent className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                  {app.lang === "ar" ? "🔥 عروض اليوم" : "🔥 Deals of the Day"}
                  <Badge className="bg-red-500 text-white text-[10px] animate-pulse">
                    {app.lang === "ar" ? `${allDeals.length} عرض` : `${allDeals.length} Offers`}
                  </Badge>
                </h2>
                <p className="text-xs text-muted-foreground">
                  {app.lang === "ar" ? `أكبر ${allDeals.length} خصم في السوق` : `Top ${allDeals.length} discounts`}
                </p>
              </div>
            </div>
            <Link to="/category/$slug" params={{ slug: "offers" }}>
              <Button variant="ghost" size="sm" className="gap-1 text-[#2a655f] font-semibold group">
                {app.lang === "ar" ? "عرض الكل" : "View All"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div 
            dir="ltr"
            className="relative overflow-x-auto rounded-2xl custom-scrollbar-deals pb-3 select-none"
            onMouseEnter={(e) => {
              const track = e.currentTarget.querySelector(".marquee-track-deals");
              if (track) track.classList.add("paused");
            }}
            onMouseLeave={(e) => {
              const track = e.currentTarget.querySelector(".marquee-track-deals");
              if (track) track.classList.remove("paused");
            }}
          >
            <div className="marquee-track-deals gap-4 py-2">
              {[...allDeals, ...allDeals, ...allDeals].map((item, index) => (
                <div key={`${item.id}-${index}`} className="marquee-item-deals w-[200px] md:w-[250px] shrink-0">
                  <div className="relative group">
                    <div className="absolute -top-2 -left-2 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                      {item.discount_percent}% OFF
                    </div>
                    <ListingCard item={item} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @keyframes marquee-scroll-deals {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-100% / 3)); }
            }
            .marquee-track-deals {
              display: flex;
              width: max-content;
              animation: marquee-scroll-deals 450s linear infinite;
              will-change: transform;
            }
            .marquee-track-deals.paused {
              animation-play-state: paused !important;
            }
            .marquee-item-deals {
              flex-shrink: 0;
            }
            .custom-scrollbar-deals::-webkit-scrollbar {
              height: 6px;
            }
            .custom-scrollbar-deals::-webkit-scrollbar-track {
              background: rgba(42, 101, 95, 0.1);
              border-radius: 10px;
              margin: 0 10px;
            }
            .custom-scrollbar-deals::-webkit-scrollbar-thumb {
              background: #2a655f;
              border-radius: 10px;
            }
            .custom-scrollbar-deals::-webkit-scrollbar-thumb:hover {
              background: #3a8a82;
            }
          `}</style>
        </section>
      )}

      {/* ===== FEATURED PRODUCTS ===== */}
      <FeaturedSection />

      {/* ===== TRENDING NOW ===== */}
      <TrendingSection />

      {/* ===== POPULAR STORES ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-8 md:pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] grid place-items-center text-white shadow-md">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-foreground">
                {app.lang === "ar" ? "🏪 متاجر مميزة" : "🏪 Popular Stores"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {app.lang === "ar" ? "أفضل المتاجر على السوق عندك" : "Top stores on Souqi"}
              </p>
            </div>
          </div>
          <Link to="/stores">
            <Button variant="ghost" size="sm" className="gap-1 text-[#2a655f] font-semibold group">
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

      {/* ===== CATEGORY BANNERS ===== */}
      <CategoryBanners />

      {/* ===== RECENTLY VIEWED ===== */}
      <RecentlyViewed />

      {/* ===== OFFERS STRIP ===== */}
      {offers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14">
          <div className="rounded-3xl bg-gradient-to-br from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-[#2a655f]/30 group border border-[#3a8a82]/30">
            <div className="absolute -end-8 -top-8 h-56 w-56 rounded-full bg-white/15 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute -start-8 -bottom-8 h-56 w-56 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-1000 delay-300" />
            
            <div className="grid md:grid-cols-[1fr_auto] items-center gap-6 relative">
              <div>
                <Badge className="bg-white/25 text-white border-white/20 hover:bg-white/30 backdrop-blur-sm">
                  <BadgePercent className="h-3 w-3 me-1" />
                  {app.lang === "ar" ? "🔥 عروض حصرية" : "🔥 Exclusive Offers"}
                </Badge>
                <h3 className="mt-3 text-2xl md:text-3xl font-black text-white">
                  {app.lang === "ar" ? "أفضل العروض على السوق عندك" : "Best Offers on Souqi"}
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  {app.lang === "ar" ? "خصومات تصل إلى 70% لفترة محدودة" : "Up to 70% off for a limited time"}
                </p>
              </div>
              <Link to="/category/$slug" params={{ slug: "offers" }}>
                <Button size="lg" variant="secondary" className="bg-white text-[#2a655f] hover:bg-white/90 font-bold hover:scale-105 transition-all duration-300 shadow-lg group">
                  {t("view_all")} 
                  <ArrowRight className="h-4 w-4 ms-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {offers.slice(0, 4).map((d, index) => (
                <div key={d.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <ListingCard item={d} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ============================================================
// CATEGORY SLIDER
// ============================================================
function CategorySlider({ categories }: { categories: any[] }) {
  const app = useApp();
  const [isPaused, setIsPaused] = useState(false);

  if (categories.length === 0) return null;

  const duplicatedCategories = [...categories, ...categories, ...categories];

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] grid place-items-center text-white shadow-md hover:scale-110 hover:rotate-12 transition-all duration-500 cursor-pointer">
            <Grid3X3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              {app.lang === "ar" ? "الأقسام المميزة" : "Featured Categories"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {app.lang === "ar" ? "اختيارات مميزة من السوق عندك" : "Handpicked by Souqi"}
            </p>
          </div>
        </div>
        <Link to="/categories">
          <Button variant="ghost" size="sm" className="gap-1 text-[#2a655f] font-semibold group">
            {app.lang === "ar" ? "عرض الكل" : "View All"}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div 
        dir="ltr"
        className="relative overflow-x-auto rounded-2xl custom-scrollbar pb-3 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="marquee-track"
          style={{ 
            animationPlayState: isPaused ? 'paused' : 'running' 
          }}
        >
          {duplicatedCategories.map((c: any, index: number) => {
            const Icon = getCategoryIcon(c.icon);
            const imageUrl = c.image_url;
            const isOffer = c.slug === "offers";
            
            return (
              <div
                key={`${c.id}-${index}`}
                className="marquee-item px-2"
              >
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group relative block w-[160px] md:w-[200px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#2a655f]/30"
                >
                  <div className="relative h-[120px] md:h-[150px] w-full overflow-hidden">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={app.lang === "ar" ? c.name_ar : c.name_en}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2a655f]/60 to-[#3a8a82]/60" />
                    )}
                    
                    <div className={cn(
                      "absolute inset-0",
                      isOffer 
                        ? "bg-gradient-to-t from-[#2a655f]/90 via-[#2a655f]/50 to-transparent" 
                        : "bg-gradient-to-t from-[#0d2e2a]/80 via-[#0d2e2a]/30 to-transparent"
                    )} />
                    
                    <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    
                    <div className="absolute bottom-0 inset-x-0 p-3">
                      <h3 className="text-white font-bold text-sm md:text-base line-clamp-1">
                        {app.lang === "ar" ? c.name_ar : c.name_en}
                      </h3>
                      <p className="text-white/70 text-[10px] md:text-xs">
                        {app.lang === "ar" ? "استكشف الآن →" : "Explore now →"}
                      </p>
                    </div>
                    
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-[#2a655f] text-white border-0 text-[8px] px-1.5 py-0.5 shadow-lg">
                        ⭐ {app.lang === "ar" ? "مميز" : "Featured"}
                      </Badge>
                    </div>
                    
                    {isOffer && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-red-500 text-white border-0 text-[8px] px-1.5 py-0.5 shadow-lg animate-pulse">
                          🔥 {app.lang === "ar" ? "عروض" : "Offers"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 40s linear infinite;
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
// FEATURED SECTION
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
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 grid place-items-center text-white shadow-md hover:scale-110 hover:-rotate-6 transition-all duration-500 cursor-pointer">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              {app.lang === "ar" ? "❤️ المنتجات المميزة" : "❤️ Featured Products"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {app.lang === "ar" ? "الأكثر إعجاباً من زوار السوق عندك" : "Most loved by Souqi visitors"}
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
                <ListingCard item={i} />
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
// TRENDING SECTION
// ============================================================
function TrendingSection() {
  const app = useApp();
  const t = useT();
  const [innerTab, setInnerTab] = useState<"products" | "stores">("products");
  const { data: trProducts = [] } = useTrendingListings(12);
  const { data: trStores = [] } = useTrendingStores(12);

  if (trProducts.length === 0 && trStores.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12 bg-gradient-to-r from-[#2a655f]/5 via-[#3a8a82]/5 to-[#2a655f]/5 rounded-3xl">
      <div className="flex items-end justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] grid place-items-center text-white shadow-md hover:scale-110 hover:rotate-12 transition-all duration-500 cursor-pointer">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              {app.lang === "ar" ? "🔥 الأكثر رواجاً" : "🔥 Trending Now"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {app.lang === "ar" ? "اختيارات فريق السوق عندك" : "Handpicked by Souqi team"}
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
              <ListingCard item={i} />
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
// STORE CARD
// ============================================================
function StoreCard({ store, badge }: { store: any; badge?: React.ReactNode }) {
  const app = useApp();
  const t = useT();
  
  return (
    <Link 
      to="/store/$id" 
      params={{ id: store.id }} 
      className="group rounded-2xl bg-card shadow-card overflow-hidden border border-[#2a655f]/10 hover:border-[#2a655f]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2a655f]/20"
    >
      <div className="relative h-28 bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] overflow-hidden">
        {store.store_cover_url && (
          <img 
            src={store.store_cover_url} 
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt="" 
          />
        )}
        {badge && <div className="absolute top-2 end-2">{badge}</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 -mt-8 relative">
        <div className="h-14 w-14 rounded-xl bg-card border-4 border-card shadow-md overflow-hidden grid place-items-center text-[#2a655f] font-black text-xl group-hover:scale-110 transition-transform duration-300">
          {store.store_logo_url || store.avatar_url ? (
            <img 
              src={store.store_logo_url || store.avatar_url} 
              className="h-full w-full object-cover" 
              alt="" 
            />
          ) : ((store.store_name || store.full_name || "?")[0])}
        </div>
        <div className="mt-2 font-bold line-clamp-1 group-hover:text-[#2a655f] transition-colors duration-300">
          {store.store_name || store.full_name || (app.lang === "ar" ? "متجر" : "Store")}
        </div>
        <div className="text-xs text-muted-foreground line-clamp-2 min-h-8">
          {store.store_description || (app.lang === "ar" ? "متجر على السوق عندك" : "A store on Souqi")}
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs">
          <span className="flex items-center gap-1 text-[#2a655f]">
            <Star className="h-3.5 w-3.5 fill-current" />
            {Number(store.avg_rating ?? 0).toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            {store.listing_count ?? 0} {t("products_tab")}
          </span>
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
      color: "from-[#1a4f4a] to-[#2a655f]",
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
            <ListingCard item={item} />
          </div>
        ))}
      </div>
    </section>
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