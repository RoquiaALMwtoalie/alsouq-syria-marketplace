// src/routes/stores.tsx

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

export const Route = createFileRoute("/stores")({
  component: StoresPage,
  head: () => ({ meta: [{ title: "جميع المتاجر — السوق لعندك" }] }),
});

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
        // ✅ تخطي إذا لم يكن هناك عنوان للمستخدم
        if (!userAddress) {
          prices[store.id] = { price: null, isFree: false, distance: 0, companyName: '', sameGovernorate: false };
          continue;
        }
        
        // ✅ إحداثيات المتجر
        const storeLat = store.lat;
        const storeLng = store.lng;
        
        // ✅ محافظة المتجر
        const storeGovernorate = store.governorate_name || store.governorate?.name_ar;
        
        // ✅ البحث عن شركة توصيل
        let matchingCompany = null;
        
        // ✅ 1. حاول البحث عن شركة في نفس المحافظة
        if (storeGovernorate) {
          matchingCompany = companies.find(
            (c: any) => c.governorate?.name_ar === storeGovernorate && c.is_active === true
          );
        }
        
        // ✅ 2. إذا لم توجد شركة، استخدم أي شركة نشطة
        if (!matchingCompany) {
          matchingCompany = companies.find((c: any) => c.is_active === true);
        }
        
        if (!matchingCompany) {
          prices[store.id] = { price: null, isFree: false, distance: 0, companyName: '', sameGovernorate: false };
          continue;
        }
        
        // ✅ حساب المسافة
        let distance = 0;
        const sameGovernorate = userGovernorate === storeGovernorate;
        
        if (storeLat && storeLng && userAddress.lat && userAddress.lng) {
          distance = calculateDistance(storeLat, storeLng, userAddress.lat, userAddress.lng);
        } else {
          distance = sameGovernorate ? 5 : 15;
        }
        
        // ✅ حساب السعر
        let price = (matchingCompany.base_price || 0) + (distance * (matchingCompany.price_per_km || 0));
        price = Math.max(price, matchingCompany.min_delivery_fee || 0);
        price = Math.min(price, matchingCompany.max_delivery_fee || 999999);
        price = Math.round(price);
        
        // ✅ توصيل مجاني (إذا كان هناك حد أدنى)
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

  // ✅ عرض سعر التوصيل
  const renderDeliveryPrice = (storeId: string) => {
    const delivery = deliveryPrices[storeId];
    if (!delivery) return null;
    
    if (delivery.price === null) {
      return (
        <span className="text-[10px] text-muted-foreground">
          {app.lang === "ar" ? "غير متاح" : "N/A"}
        </span>
      );
    }
    
    return (
      <div className="flex items-center gap-1.5">
        {delivery.isFree ? (
          <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-[9px] px-1.5 py-0">
            {app.lang === "ar" ? "✅ مجاني" : "✅ Free"}
          </Badge>
        ) : (
          <span className="text-xs font-bold text-primary">
            {delivery.price} SYP
          </span>
        )}
        {!delivery.sameGovernorate && (
          <span className="text-[8px] text-amber-500">⚠️</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span>{app.lang === "ar" ? "🏪 جميع المتاجر" : "🏪 All Stores"}</span>
              <Badge className="bg-primary/10 text-primary border-0 text-sm px-3 py-1">
                {searchStats.filtered}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
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
            <Search className="absolute inset-y-0 my-auto start-3 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={app.lang === "ar" ? "🔍 ابحث عن متجر..." : "🔍 Search for store..."}
              className="ps-12 h-14 rounded-2xl border-2 border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-lg"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {searchQuery.trim() && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
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
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {app.lang === "ar" ? "تصفية:" : "Filter:"}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: app.lang === "ar" ? "الكل" : "All" },
              { value: "online", label: app.lang === "ar" ? "🌐 اونلاين" : "🌐 Online" },
              { value: "physical", label: app.lang === "ar" ? "🏪 متجر حقيقي" : "🏪 Physical" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value as any)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  filterType === f.value
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== SUGGESTIONS ===== */}
        {suggestions.length > 0 && (
          <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-xs text-muted-foreground mb-2">
              {app.lang === "ar" ? "💡 اقتراحات:" : "💡 Suggestions:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s: any) => (
                <Link
                  key={s.id}
                  to="/store/$id"
                  params={{ id: s.id }}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-sm hover:bg-primary/10 transition-all border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5"
                >
                  <Store className="h-3.5 w-3.5" />
                  {s.store_name || s.full_name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== STORES GRID ===== */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-slate-200/50 dark:border-slate-800/50">
            <div className="text-7xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold">
              {app.lang === "ar" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              {app.lang === "ar" 
                ? `لم نعثر على متاجر تطابق "${searchQuery}"` 
                : `No stores match "${searchQuery}"`}
            </p>
            {searchQuery.trim() && (
              <Button 
                variant="outline" 
                className="mt-4 rounded-xl"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 mr-2" />
                {app.lang === "ar" ? "مسح البحث" : "Clear search"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStores.map((s: any) => {
              const allowsMessaging = s.allows_messaging !== false;
              const storeType = s.store_type || "online";
              const address = s.store_address || "";
              const opensAt = s.store_opens_at || "";
              const closesAt = s.store_closes_at || "";
              const offDays = s.weekly_off_days || [];
              const delivery = deliveryPrices[s.id];
              
              return (
                <Link
                  key={s.id}
                  to="/store/$id"
                  params={{ id: s.id }}
                  className="group rounded-2xl bg-card shadow-card overflow-hidden card-hover border hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="relative h-28 bg-gradient-to-br from-primary to-primary-glow">
                    {s.store_cover_url && (
                      <img src={s.store_cover_url} className="absolute inset-0 h-full w-full object-cover" alt="" />
                    )}
                    
                    {/* ✅ نوع المتجر */}
                    <div className="absolute top-2 end-2 flex gap-1">
                      <Badge className="bg-black/50 backdrop-blur text-white border-0 text-[10px]">
                        {storeType === "physical" ? "🏪" : "🌐"}
                      </Badge>
                    </div>

                    {/* ✅ زر المراسلة */}
                    {allowsMessaging && (
                      <button
                        onClick={(e) => goToChat(e, s.id)}
                        className="absolute bottom-2 end-2 p-2.5 rounded-full bg-white/95 hover:bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 group/chat"
                        title={app.lang === "ar" ? "مراسلة المتجر" : "Message store"}
                      >
                        <MessageCircle className="h-4 w-4 text-blue-500 group-hover/chat:text-blue-600" />
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4 -mt-8 relative">
                    <div className="h-14 w-14 rounded-xl bg-card border-4 border-card shadow-md overflow-hidden grid place-items-center text-primary font-black text-xl">
                      {s.store_logo_url || s.avatar_url ? (
                        <img src={s.store_logo_url || s.avatar_url} className="h-full w-full object-cover" alt="" />
                      ) : (
                        (s.store_name || s.full_name || "?")[0]
                      )}
                    </div>
                    
                    <div className="mt-2 font-bold line-clamp-1 text-lg group-hover:text-primary transition">
                      {s.store_name || s.full_name || (app.lang === "ar" ? "متجر" : "Store")}
                    </div>
                    
                    <div className="text-xs text-muted-foreground line-clamp-2 min-h-8">
                      {s.store_description || (app.lang === "ar" ? "متجر على السوق اليك" : "A store on AlSooq Elak")}
                    </div>
                    
                    {/* ✅ معلومات إضافية في البطاقة */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                      {/* العنوان - يظهر فقط للمتاجر الفعلية */}
                      {storeType === "physical" && address && (
                        <span className="flex items-center gap-0.5 bg-muted/30 px-1.5 py-0.5 rounded">
                          <MapPin className="h-2.5 w-2.5" />
                          <span className="truncate max-w-[80px]">{address}</span>
                        </span>
                      )}
                      
                      {/* أوقات العمل */}
                      {(opensAt || closesAt) && (
                        <span className="flex items-center gap-0.5 bg-muted/30 px-1.5 py-0.5 rounded">
                          <Clock className="h-2.5 w-2.5" />
                          {opensAt.slice(0,5)}-{closesAt.slice(0,5)}
                        </span>
                      )}
                      
                      {/* أيام العطل (مختصرة) */}
                      {offDays.length > 0 && (
                        <span className="flex items-center gap-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">
                          <span>📅</span>
                          {offDays.length > 2 
                            ? `${offDays.length} ${app.lang === "ar" ? "أيام" : "days"}` 
                            : offDays.map((d: string) => d.slice(0,3)).join(',')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-accent">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {Number(s.avg_rating ?? 0).toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          <Package className="h-3.5 w-3.5 inline mr-1" />
                          {s.listing_count ?? 0} {t("products_tab")}
                        </span>
                      </div>
                      
                      {/* ✅ ✅ ✅ عرض سعر التوصيل من برا ✅ ✅ ✅ */}
                      {delivery && (
                        <div className="flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-full">
                          <Truck className="h-3 w-3 text-primary" />
                          {renderDeliveryPrice(s.id)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
