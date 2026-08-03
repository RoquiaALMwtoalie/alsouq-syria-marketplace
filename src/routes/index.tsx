import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingBag, Shirt, Smartphone, Home as HomeIcon, Footprints, Watch, BookOpen,
  Dumbbell, Gamepad2, Palette, Wrench, Utensils, Sparkles, BadgePercent, Gift, Flower2,
  ArrowRight, Package, Store, Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApp, useT } from "@/lib/i18n";
import { useListings, useBanners, useAllStores, useCategories, useMostFavoritedListings, useMostFavoritedStores, useTrendingListings, useTrendingStores } from "@/lib/queries";
import { Flame, Heart } from "lucide-react";
import { getSupabaseImageUrl } from "@/components/ImageInput";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

// ✅ استيراد دالة الأيقونات من قاعدة البيانات
import { getCategoryIcon } from "@/lib/categoryIcons";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "السوق اليك — سوقك السوري بين يديك" },
      { name: "description", content: "منصة سورية شاملة: تسوّق واحجز واكتشف من المتاجر والخدمات والعروض والهدايا في كل المحافظات." },
    ],
  }),
});

function Home() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const isAdmin = app.roles?.includes("admin");

  // ✅ التحقق من اكتمال الملف الشخصي
  useEffect(() => {
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const [{ data: profile }, { data: addressRows }] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone, address_text")
          .eq("id", session.user.id)
          .maybeSingle(),
        supabase
          .from("user_addresses" as any)
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
    };
    
    checkProfile();
  }, []);

  const { data: banners = [] } = useBanners();
  const { data: dbCategories = [] } = useCategories();
  const [tab, setTab] = useState<"products" | "stores">("products");
  const [bannerIdx, setBannerIdx] = useState(0);

  const { data: products = [], isLoading: pLoading } = useListings({
    sort: "popular",
    limit: 24,
  });
  const { data: offers = [] } = useListings({ isOffer: true, limit: 8, sort: "recent" });
  const { data: stores = [], isLoading: sLoading } = useAllStores(24);

  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  // ✅ جلب التصنيفات المميزة من قاعدة البيانات
  const featuredCategories = dbCategories
    .filter((c: any) => c.is_featured === true && c.active !== false)
    .sort((a: any, b: any) => (a.featured_sort || 0) - (b.featured_sort || 0));

  return (
    <div>
      {/* ============ ADMIN BANNER SLIDER ============ */}
      <section className="mx-auto max-w-7xl px-3 sm:px-4 pt-3 sm:pt-4">
        {banners.length > 0 ? (
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/8] lg:aspect-[21/7]">
            {banners.map((b, i) => (
              <div
                key={b.id}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: bannerIdx === i ? 1 : 0, pointerEvents: bannerIdx === i ? "auto" : "none" }}
              >
                <img
                  src={b.image_url}
                  alt={app.lang === "ar" ? b.title_ar : (b.title_en || b.title_ar)}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-start justify-center p-6 md:p-10 text-white">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-black max-w-2xl leading-tight">
                    {app.lang === "ar" ? b.title_ar : (b.title_en || b.title_ar)}
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-white/80 max-w-lg">
                    {app.lang === "ar" ? b.subtitle_ar : (b.subtitle_en || b.subtitle_ar)}
                  </p>
                  {b.cta_label_ar && (
                    <Button className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                      {app.lang === "ar" ? b.cta_label_ar : (b.cta_label_en || b.cta_label_ar)}
                    </Button>
                  )}
                  {b.link_url && <a href={b.link_url} className="absolute inset-0" aria-label="Banner link" />}
                </div>
              </div>
            ))}
            {banners.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex justify-center gap-1.5 sm:gap-2 pointer-events-none">
                {banners.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={(e) => { e.preventDefault(); setBannerIdx(i); }}
                    className={`pointer-events-auto h-1.5 sm:h-2 rounded-full transition-all ${bannerIdx === i ? "w-6 sm:w-8 bg-white" : "w-1.5 sm:w-2 bg-white/60"}`} 
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl sm:rounded-3xl aspect-[16/9] sm:aspect-[21/8] bg-muted animate-pulse" />
        )}
      </section>

      {/* ============ FEATURED CATEGORIES - من قاعدة البيانات ============ */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 grid place-items-center text-white shadow-md">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black">
                {app.lang === "ar" ? "أقسام مميزة" : "Featured Categories"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {app.lang === "ar" ? "اختيارات مميزة من السوق اليك" : "Handpicked by AlSooq Elak"}
              </p>
            </div>
          </div>
          <Link to="/categories">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-[#2a655f] hover:text-[#1a4f4a] font-semibold"
            >
              {app.lang === "ar" ? "عرض الكل" : "View All"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {featuredCategories.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center text-muted-foreground text-sm border border-dashed">
            {app.lang === "ar" 
              ? "لا توجد أقسام مميزة حالياً — قم بتفعيلها من لوحة التحكم" 
              : "No featured categories yet — activate them from the dashboard"}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {featuredCategories.slice(0, 12).map((c: any) => {
              // ✅ كل شيء من قاعدة البيانات
              const Icon = getCategoryIcon(c.icon);
              const img = c.image_url;
              const isOffer = c.slug === "offers";
              
              return (
                <Link 
                  key={c.id} 
                  to="/category/$slug" 
                  params={{ slug: c.slug }}
                  className="group relative overflow-hidden rounded-2xl border-2 border-[#2a655f]/30 bg-card shadow-card hover:shadow-2xl hover:shadow-[#2a655f]/20 transition-all duration-500 hover:-translate-y-2 hover:border-[#2a655f]/70 hover:scale-[1.02] aspect-[4/5]"
                >
                  {img ? (
                    <img 
                      src={img} 
                      alt="" 
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      loading="lazy" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary-glow/40 group-hover:scale-110 transition-transform duration-700" />
                  )}
                  <div className={`absolute inset-0 ${isOffer ? "bg-gradient-to-t from-red-600/85 via-red-600/40 to-transparent" : "bg-gradient-to-t from-primary/85 via-primary/30 to-transparent"} group-hover:from-primary/95 transition-colors duration-500`} />
                  
                  {/* ✅ شارة مميز */}
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-[9px] px-1.5 py-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      ⭐ {app.lang === "ar" ? "مميز" : "Featured"}
                    </Badge>
                  </div>
                  
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white flex items-center gap-2 z-10">
                    <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur grid place-items-center shrink-0 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-sm sm:text-base leading-tight line-clamp-1 group-hover:text-yellow-300 transition-colors duration-300">
                        {app.lang === "ar" ? c.name_ar : c.name_en}
                      </div>
                      <div className="text-[10px] sm:text-xs opacity-80 line-clamp-1 group-hover:opacity-100 transition-opacity duration-300">
                        {app.lang === "ar" ? "استكشف الآن →" : "Explore now →"}
                      </div>
                    </div>
                  </div>
                  
                  {/* ✅ تأثير إضاءة عند التمرير */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a655f]/40 via-transparent to-transparent" />
                    <div className="absolute -inset-full top-0 h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_ease-in-out]" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        
        {/* ✅ زر عرض الكل تحت الأقسام المميزة */}
        {featuredCategories.length > 6 && (
          <div className="mt-6 text-center">
            <Link to="/categories">
              <Button 
                variant="outline" 
                className="px-8 py-6 rounded-2xl border-2 border-dashed border-[#2a655f]/30 hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all group"
              >
                <span className="flex items-center gap-3 text-[#2a655f] dark:text-[#3a8a82] font-semibold text-base">
                  <Star className="h-5 w-5" />
                  {app.lang === "ar" ? "⭐ عرض كل الأقسام المميزة" : "⭐ View All Featured Categories"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                </span>
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* ============ FEATURED (user hearts) ============ */}
      <FeaturedSection />

      {/* ============ TRENDING (admin picks) ============ */}
      <TrendingSection />

      {/* ============ PRODUCTS / STORES TABS ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="flex items-center gap-2 border-b mb-6">
          {([
            { id: "products" as const, icon: Package, label: t("products_tab") },
            { id: "stores" as const, icon: Store, label: t("stores_tab") },
          ]).map((tItem) => (
            <button 
              key={tItem.id} 
              onClick={() => setTab(tItem.id)}
              className={`flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition ${
                tab === tItem.id ? "border-[#2a655f] text-[#2a655f]" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tItem.icon className="h-4 w-4" /> {tItem.label}
            </button>
          ))}
        </div>

        {tab === "products" ? (
          pLoading ? (
            <SkeletonGrid />
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.slice(0, 8).map((i) => (
                  <ListingCard key={i.id} item={i} />
                ))}
              </div>
              
              {products.length > 8 && (
                <div className="mt-6 text-center">
                  <Link to="/products">
                    <Button 
                      variant="outline" 
                      className="px-8 py-6 rounded-2xl border-2 border-dashed border-[#2a655f]/30 hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all group"
                    >
                      <span className="flex items-center gap-3 text-[#2a655f] dark:text-[#3a8a82] font-semibold text-base">
                        {app.lang === "ar" ? "🛍️ عرض كل المنتجات" : "🛍️ View All Products"}
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                      </span>
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )
        ) : (
          sLoading ? (
            <SkeletonGrid />
          ) : stores.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stores.slice(0, 4).map((s) => (
                  <StoreMiniCard key={s.id} s={s} />
                ))}
              </div>
              
              {stores.length > 4 && (
                <div className="mt-6 text-center">
                  <Link to="/stores">
                    <Button 
                      variant="outline" 
                      className="px-8 py-6 rounded-2xl border-2 border-dashed border-[#2a655f]/30 hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all group"
                    >
                      <span className="flex items-center gap-3 text-[#2a655f] dark:text-[#3a8a82] font-semibold text-base">
                        {app.lang === "ar" ? "🏪 عرض كل المتاجر" : "🏪 View All Stores"}
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                      </span>
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )
        )}
      </section>

      {/* ============ OFFERS STRIP ============ */}
      {offers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14">
         <div className="rounded-3xl bg-gradient-to-br from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] p-6 md:p-10 relative overflow-hidden shadow-elegant">
            <div className="absolute -end-8 -top-8 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
            <div className="grid md:grid-cols-[1fr_auto] items-center gap-6 relative">
              <div>
                <Badge className="bg-white/25 text-white border-0">
                  <BadgePercent className="h-3 w-3 me-1" />
                  {app.lang === "ar" ? "عروض حصرية" : "Exclusive offers"}
                </Badge>
                <h3 className="mt-3 text-2xl md:text-3xl font-black text-white">
                  {app.lang === "ar" ? "أفضل العروض على السوق اليك" : "Best offers on AlSooq Elak"}
                </h3>
              </div>
              <Link to="/category/$slug" params={{ slug: "offers" }}>
                <Button size="lg" variant="secondary" className="bg-white text-[#2a655f] hover:bg-white/90 shadow-elegant font-bold">
                  {t("view_all")} <ArrowRight className="h-4 w-4 ms-1 rtl-flip" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {offers.slice(0, 4).map((d) => <ListingCard key={d.id} item={d} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyState() {
  const app = useApp();
  return (
    <div className="rounded-2xl bg-card p-12 text-center shadow-card border">
      <p className="text-muted-foreground">{app.lang === "ar" ? "لا توجد نتائج بعد." : "No results yet."}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-muted/50 aspect-[4/5] animate-pulse" />
      ))}
    </div>
  );
}

/* ============================================================
   FEATURED — driven by user hearts (❤️) on products & stores
   ============================================================ */
function FeaturedSection() {
  const app = useApp();
  const t = useT();
  const [innerTab, setInnerTab] = useState<"products" | "stores">("products");
  const { data: favProducts = [], isLoading: lp } = useMostFavoritedListings(12);
  const { data: favStores = [], isLoading: ls } = useMostFavoritedStores(12);

  if (!lp && !ls && favProducts.length === 0 && favStores.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4">
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 grid place-items-center text-white shadow-md">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black">
              {app.lang === "ar" ? "المتاجر والمنتجات المميزة" : "Featured stores and products"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {app.lang === "ar" ? "الأكثر إعجاباً من زوار السوق اليك" : "Most loved by AlSooq Elak visitors"}
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
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${
                innerTab === it.id ? "bg-card text-[#2a655f] shadow-sm" : "text-muted-foreground"
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>

      {innerTab === "products" ? (
        favProducts.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center text-muted-foreground text-sm border">
            {app.lang === "ar" ? "لا توجد منتجات مميزة بعد — كن أول من يضيفها لقائمة المفضلة." : "No favorites yet — be the first to heart a product."}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favProducts.map((i) => <ListingCard key={i.id} item={i} />)}
          </div>
        )
      ) : (
        favStores.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center text-muted-foreground text-sm border">
            {app.lang === "ar" ? "لا توجد متاجر مميزة بعد." : "No featured stores yet."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favStores.map((s) => (
              <StoreMiniCard 
                key={s.id} 
                s={s} 
                badge={
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-600 px-2 py-0.5 text-[11px] font-bold">
                    <Heart className="h-3 w-3 fill-current" />
                    {s.hearts}
                  </span>
                } 
              />
            ))}
          </div>
        )
      )}
    </section>
  );
}

/* ============================================================
   TRENDING — admin-picked (is_featured on listings & profiles)
   ============================================================ */
function TrendingSection() {
  const app = useApp();
  const t = useT();
  const [innerTab, setInnerTab] = useState<"products" | "stores">("products");
  const { data: trProducts = [] } = useTrendingListings(12);
  const { data: trStores = [] } = useTrendingStores(12);

  if (trProducts.length === 0 && trStores.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10">
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 grid place-items-center text-white shadow-md">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black">
              {app.lang === "ar" ? "الأكثر رواجاً" : "Trending now"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {app.lang === "ar" ? "اختيارات فريق السوق اليك" : "Handpicked by AlSooq Elak"}
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
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${
                innerTab === it.id ? "bg-card text-[#2a655f] shadow-sm" : "text-muted-foreground"
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>

      {innerTab === "products" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trProducts.map((i) => <ListingCard key={i.id} item={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trStores.map((s) => (
            <StoreMiniCard 
              key={s.id} 
              s={s} 
              badge={
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 text-orange-600 px-2 py-0.5 text-[11px] font-bold">
                  <Flame className="h-3 w-3" />
                  {app.lang === "ar" ? "رائج" : "Trending"}
                </span>
              } 
            />
          ))}
        </div>
      )}
    </section>
  );
}

function StoreMiniCard({ s, badge }: { s: any; badge?: React.ReactNode }) {
  const app = useApp();
  const t = useT();
  
  return (
    <Link 
      to="/store/$id" 
      params={{ id: s.id }} 
      className="group rounded-2xl bg-card shadow-card overflow-hidden card-hover border"
    >
      <div className="relative h-28 bg-gradient-to-br from-primary to-primary-glow">
        {s.store_cover_url && (
          <img 
            src={s.store_cover_url} 
            className="absolute inset-0 h-full w-full object-cover" 
            alt="" 
          />
        )}
        {badge && <div className="absolute top-2 end-2">{badge}</div>}
      </div>
      <div className="p-4 -mt-8 relative">
        <div className="h-14 w-14 rounded-xl bg-card border-4 border-card shadow-md overflow-hidden grid place-items-center text-primary font-black text-xl">
          {s.store_logo_url || s.avatar_url ? (
            <img 
              src={s.store_logo_url || s.avatar_url} 
              className="h-full w-full object-cover" 
              alt="" 
            />
          ) : ((s.store_name || s.full_name || "?")[0])}
        </div>
        <div className="mt-2 font-bold line-clamp-1">
          {s.store_name || s.full_name || (app.lang === "ar" ? "متجر" : "Store")}
        </div>
        <div className="text-xs text-muted-foreground line-clamp-2 min-h-8">
          {s.store_description || (app.lang === "ar" ? "متجر على السوق اليك" : "A store on AlSooq Elak")}
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs">
          <span className="flex items-center gap-1 text-accent">
            <Star className="h-3.5 w-3.5 fill-current" />
            {Number(s.avg_rating ?? 0).toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            {s.listing_count ?? 0} {t("products_tab")}
          </span>
        </div>
      </div>
    </Link>
  );
}