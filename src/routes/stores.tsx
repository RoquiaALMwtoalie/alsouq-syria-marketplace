// src/routes/stores.tsx - الكود المُصحّح بالكامل (نمط index.tsx - بطاقات مضغوطة)

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useApp, useT } from "@/lib/i18n";
import { useAllStores, useDeliveryCompanies } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, ArrowLeft, Star, Store, Package, X, 
  Sparkles, Filter, MapPin, Building2, MessageCircle,
  Clock, Globe, Truck, ShieldCheck, Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { OptimizedImage } from "@/components/OptimizedImage";

// ============================================================
// 🎨 ZOOQ BRAND COLORS
// ============================================================
const OLIVE = "#2a655f";
const OLIVE_LIGHT = "#3a8a82";
const OLIVE_DARK = "#1a4f4a";

// ============================================================
// 📐 GRID — نفس نمط index.tsx (عمودين على الموبايل)
// ============================================================
const GRID_STORES = "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 items-stretch";

export const Route = createFileRoute("/stores")({
  component: StoresPage,
  head: () => ({ meta: [{ title: "جميع المتاجر — ذوق" }] }),
});

// ============================================================
// 🏪 STORE CARD — نفس النمط من index.tsx
// ============================================================
function StoreCard({ 
  store, 
  delivery, 
  onChat,
  lang,
  t,
}: { 
  store: any; 
  delivery?: any;
  onChat: (e: React.MouseEvent, storeId: string) => void;
  lang: string;
  t: (key: string) => string;
}) {
  const isRtl = lang === "ar";

  const storeName = store.store_name || store.full_name || (isRtl ? "متجر مميز" : "Featured Store");
  const coverUrl = store.store_cover_url;
  const logoUrl = store.store_logo_url || store.avatar_url;
  const rating = Number(store.avg_rating ?? 0).toFixed(1);
  const productsCount = store.listing_count ?? 0;
  const storeType = store.store_type || "online";
  const allowsMessaging = store.allows_messaging !== false;

  return (
    <Link
      to="/store/$id"
      params={{ id: store.id }}
      className="group flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full relative"
    >
      {/* Cover مصغّر */}
      <div className="relative h-[55px] sm:h-[70px] md:h-[80px] w-full overflow-hidden shrink-0">
        {coverUrl ? (
          <OptimizedImage
            src={coverUrl}
            alt={storeName}
            width={400}
            height={150}
            quality={75}
            objectFit="cover"
            className="absolute inset-0 h-full w-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${OLIVE}, ${OLIVE_LIGHT})` }} />
        )}

        {/* Badge النوع */}
        <div className="absolute top-1.5 start-1.5 z-10">
          <Badge className="bg-black/50 backdrop-blur text-white border-0 text-[9px] px-1.5 py-0">
            {storeType === "physical" ? "🏪" : "🌐"}
          </Badge>
        </div>

        {/* زر المراسلة */}
        {allowsMessaging && (
          <button
            onClick={(e) => onChat(e, store.id)}
            className="absolute top-1.5 end-1.5 z-10 p-1.5 rounded-full bg-white/95 hover:bg-white shadow-md hover:shadow-lg transition-all hover:scale-110"
            title={isRtl ? "مراسلة المتجر" : "Message store"}
          >
            <MessageCircle className="h-3 w-3 text-[#2a655f]" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center text-center px-2 pb-2.5 flex-1">
        {/* Logo مصغّر */}
        <div className="-mt-6 relative z-10">
          <div
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-white p-0.5 shadow-md overflow-hidden grid place-items-center"
            style={{ boxShadow: `0 0 0 2px white, 0 3px 8px rgba(15,23,42,0.12)` }}
          >
            {logoUrl ? (
              <OptimizedImage
                src={logoUrl}
                alt={storeName}
                width={60}
                height={60}
                quality={80}
                objectFit="cover"
                className="h-full w-full rounded-full"
              />
            ) : (
              <div
                className="h-full w-full rounded-full text-white font-black text-sm flex items-center justify-center"
                style={{ backgroundColor: OLIVE }}
              >
                {storeName.charAt(0)?.toUpperCase() || <Store className="h-4 w-4" />}
              </div>
            )}
          </div>
        </div>

        {/* الاسم */}
        <h3 className="mt-1.5 font-bold text-[11px] sm:text-xs text-slate-800 dark:text-slate-100 line-clamp-1">
          {storeName}
        </h3>

        {/* التقييم + العدد */}
        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] sm:text-[10px] text-muted-foreground font-medium">
          <span className="flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
            {rating}
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
          <span>{productsCount} {isRtl ? "منتج" : "products"}</span>
        </div>

        {/* سعر التوصيل */}
        {delivery && (
          <div className="mt-1 flex items-center justify-center gap-1 text-[9px] sm:text-[10px]">
            <Truck className="h-2.5 w-2.5 text-[#2a655f]" />
            {delivery.price === null ? (
              <span className="text-slate-400">{isRtl ? "—" : "—"}</span>
            ) : delivery.isFree ? (
              <span className="text-[#2a655f] font-bold">{isRtl ? "مجاني" : "Free"}</span>
            ) : (
              <span className="text-[#2a655f] font-bold">{delivery.price} SYP</span>
            )}
          </div>
        )}

        {/* زر الزيارة */}
        <span
          className="mt-2 flex items-center justify-center w-full rounded-lg py-1.5 text-[10px] sm:text-[11px] font-bold text-white mt-auto"
          style={{ backgroundColor: OLIVE }}
        >
          {isRtl ? "زيارة" : "Visit"}
        </span>
      </div>
    </Link>
  );
}

function StoresPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "online" | "physical">("all");
  const [userGovernorate, setUserGovernorate] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryPrices, setDeliveryPrices] = useState<Record<string, { price: number; isFree: boolean; distance: number; companyName: string; sameGovernorate: boolean }>>({});
  const [loadingDeliveries, setLoadingDeliveries] = useState<Record<string, boolean>>({});
  
  const { data: allStores = [], isLoading } = useAllStores(100);
  const { data: companies = [] } = useDeliveryCompanies({ active: true });

  // ✅ جلب محافظة المستخدم وإحداثياته
  useEffect(() => {
    const fetchUserData = async () => {
      if (!app.user) return;
      
      const { data: address } = await supabase
        .from("user_addresses")
        .select("governorate_id, lat, lng")
        .eq("user_id", app.user.id)
        .eq("is_default", true)
        .maybeSingle();
      
      if (address) {
        if (address.governorate_id) {
          const { data: gov } = await supabase
            .from("governorates")
            .select("name_ar")
            .eq("id", address.governorate_id)
            .maybeSingle();
          setUserGovernorate(gov?.name_ar || null);
        }
        if (address.lat && address.lng) {
          setUserAddress({ lat: address.lat, lng: address.lng });
        }
      }
    };
    
    fetchUserData();
  }, [app.user]);

  // ✅ حساب سعر التوصيل لكل متجر
  useEffect(() => {
    const calculateAllDeliveries = async () => {
      if (!allStores.length || !companies.length || !app.user) return;
      
      const prices: Record<string, any> = {};
      
      for (const store of allStores) {
        if (!userAddress) {
          prices[store.id] = { price: null, isFree: false, distance: 0, companyName: '', sameGovernorate: false };
          continue;
        }
        
        const storeLat = store.lat;
        const storeLng = store.lng;
        const storeGovernorate = store.governorate_name || store.governorate?.name_ar;
        
        let matchingCompany = null;
        
        if (storeGovernorate) {
          matchingCompany = companies.find(
            (c: any) => c.governorate?.name_ar === storeGovernorate && c.is_active === true
          );
        }
        
        if (!matchingCompany) {
          matchingCompany = companies.find((c: any) => c.is_active === true);
        }
        
        if (!matchingCompany) {
          prices[store.id] = { price: null, isFree: false, distance: 0, companyName: '', sameGovernorate: false };
          continue;
        }
        
        let distance = 0;
        const sameGovernorate = userGovernorate === storeGovernorate;
        
        if (storeLat && storeLng && userAddress.lat && userAddress.lng) {
          distance = calculateDistance(storeLat, storeLng, userAddress.lat, userAddress.lng);
        } else {
          distance = sameGovernorate ? 5 : 15;
        }
        
        let price = (matchingCompany.base_price || 0) + (distance * (matchingCompany.price_per_km || 0));
        price = Math.max(price, matchingCompany.min_delivery_fee || 0);
        price = Math.min(price, matchingCompany.max_delivery_fee || 999999);
        price = Math.round(price);
        
        const isFree = price === 0;
        
        prices[store.id] = {
          price,
          isFree,
          distance: Math.round(distance * 100) / 100,
          companyName: matchingCompany.name_ar,
          sameGovernorate,
        };
      }
      
      setDeliveryPrices(prices);
    };
    
    calculateAllDeliveries();
  }, [allStores, companies, app.user, userGovernorate, userAddress]);

  // ✅ دالة حساب المسافة
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // ✅ فلترة ذكية وفورية
  const filteredStores = useMemo(() => {
    let result = allStores;
    
    if (filterType === "online") {
      result = result.filter((s: any) => s.store_type === "online");
    } else if (filterType === "physical") {
      result = result.filter((s: any) => s.store_type === "physical");
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s: any) => {
        const name = (s.store_name || s.full_name || "").toLowerCase();
        const desc = (s.store_description || "").toLowerCase();
        const address = (s.store_address || "").toLowerCase();
        
        return name.includes(q) || desc.includes(q) || address.includes(q);
      });
    }
    
    return result;
  }, [allStores, searchQuery, filterType]);

  // ✅ إحصائيات البحث
  const searchStats = {
    total: allStores.length,
    filtered: filteredStores.length,
    hasResults: filteredStores.length > 0,
  };

  // ✅ اقتراحات البحث
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    
    const q = searchQuery.toLowerCase().trim();
    const matched = allStores
      .filter((s: any) => {
        const name = (s.store_name || s.full_name || "").toLowerCase();
        return name.includes(q) && !filteredStores.includes(s);
      })
      .slice(0, 5);
    
    return matched;
  }, [allStores, searchQuery, filteredStores]);

  // ✅ دالة الذهاب للمراسلة
  const goToChat = (e: React.MouseEvent, storeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!app.user) {
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }
    
    navigate({
      to: "/messages/$userId",
      params: { userId: storeId }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
        
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-500 hover:text-[#2a655f] transition-colors mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 rtl:rotate-180" />
              {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 sm:gap-3 text-slate-900 dark:text-white">
              <span>{app.lang === "ar" ? "🏪 جميع المتاجر" : "🏪 All Stores"}</span>
              <Badge className="bg-[#2a655f]/15 text-[#2a655f] dark:bg-[#2a655f]/30 dark:text-[#3a8a82] border-0 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 font-bold">
                {searchStats.filtered}
              </Badge>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {searchQuery.trim() ? (
                app.lang === "ar" 
                  ? `نتائج البحث عن "${searchQuery}" (${searchStats.filtered} متجر)` 
                  : `Results for "${searchQuery}" (${searchStats.filtered} stores)`
              ) : (
                app.lang === "ar" 
                  ? `عرض جميع المتاجر (${searchStats.total})` 
                  : `Showing all stores (${searchStats.total})`
              )}
            </p>
          </div>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <div className="relative mb-4">
          <div className="relative">
            <Search className="absolute inset-y-0 my-auto start-3 h-5 w-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={app.lang === "ar" ? "🔍 ابحث عن متجر..." : "🔍 Search for store..."}
              className="ps-12 h-12 sm:h-14 text-base sm:text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#2a655f] focus:ring-4 focus:ring-[#2a655f]/10 transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {searchQuery.trim() && (
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-[#2a655f]" />
              <span>
                {app.lang === "ar" 
                  ? `⚡ بحث فوري: ${searchStats.filtered} نتيجة` 
                  : `⚡ Live search: ${searchStats.filtered} results`}
              </span>
              {searchStats.filtered === 0 && (
                <span className="text-red-500">
                  {app.lang === "ar" ? "⚠️ لا توجد نتائج" : "⚠️ No results"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ===== FILTERS ===== */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#2a655f]" />
            <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {app.lang === "ar" ? "تصفية:" : "Filter:"}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { value: "all", label: app.lang === "ar" ? "الكل" : "All" },
              { value: "online", label: app.lang === "ar" ? "🌐 اونلاين" : "🌐 Online" },
              { value: "physical", label: app.lang === "ar" ? "🏪 متجر حقيقي" : "🏪 Physical" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value as any)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all",
                  filterType === f.value
                    ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-md shadow-[#2a655f]/25"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-[#2a655f]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== SUGGESTIONS ===== */}
        {suggestions.length > 0 && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              {app.lang === "ar" ? "💡 اقتراحات:" : "💡 Suggestions:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s: any) => (
                <Link
                  key={s.id}
                  to="/store/$id"
                  params={{ id: s.id }}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-sm hover:bg-[#2a655f]/10 transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:border-[#2a655f]/40"
                >
                  <Store className="h-3.5 w-3.5 text-[#2a655f]" />
                  {s.store_name || s.full_name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== STORES GRID ===== */}
        {isLoading ? (
          <div className={GRID_STORES}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 animate-pulse h-full"
              >
                <div className="h-[55px] sm:h-[70px] rounded-md bg-slate-200 dark:bg-slate-700" />
                <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto -mt-6 border-4 border-white dark:border-slate-900" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mt-2 w-3/4 mx-auto" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded mt-1.5 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700">
            <div className="text-5xl sm:text-7xl mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
              {app.lang === "ar" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto px-4">
              {app.lang === "ar" 
                ? `لم نعثر على متاجر تطابق "${searchQuery}"` 
                : `No stores match "${searchQuery}"`}
            </p>
            {searchQuery.trim() && (
              <Button 
                variant="outline" 
                className="mt-4 rounded-xl border-slate-300 text-[#2a655f] hover:bg-[#2a655f]/10"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 mr-2" />
                {app.lang === "ar" ? "مسح البحث" : "Clear search"}
              </Button>
            )}
          </div>
        ) : (
          <div className={GRID_STORES}>
            {filteredStores.map((s: any) => (
              <StoreCard
                key={s.id}
                store={s}
                delivery={deliveryPrices[s.id]}
                onChat={goToChat}
                lang={app.lang}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StoresPage;