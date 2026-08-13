// src/routes/store.$id.tsx - الكود المُصحّح بالكامل (حساب التوصيل الاحترافي مثل نون)

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef, lazy, Suspense } from "react";
import { 
  Star, MessageCircle, Store as StoreIcon, Loader2, 
  Clock, MapPin, Globe, Building2, Truck,
  Sparkles, Package, Share2, Flame, BadgeCheck,
  Search, X, ArrowUpDown, Grid3X3, List, ChevronDown,
  RefreshCw, Eye, Heart, TrendingUp, Zap
} from "lucide-react";
import { useApp, useT } from "@/lib/i18n";
import { useListings, useStoreProfile, useDeliveryCompanies } from "@/lib/queries";
import { useGetOrCreateConversation } from "@/lib/hooks/useConversation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// ✅ Lazy Loading للـ ListingCard
const ListingCard = lazy(() => import("@/components/ListingCard"));

export const Route = createFileRoute("/store/$id")({
  component: StorePage,
  head: () => ({ meta: [{ title: "Store — Souqi" }] }),
});

function StorePage() {
  const { id } = Route.useParams();
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [isOpeningConversation, setIsOpeningConversation] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  
  // ====== State التوصيل ======
  const [deliveryPrice, setDeliveryPrice] = useState<{
    distance: number;
    price: number;
    isFree: boolean;
    breakdown: any;
    companyName: string;
    governorateMatch: boolean;
  } | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  // ====== State الفلتر والترتيب (محسّن للأداء) ======
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "price_asc" | "price_desc" | "rating">("recent");
  const [viewFilter, setViewFilter] = useState<"all" | "offers">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [allListings, setAllListings] = useState<any[]>([]);

  // ====== Hooks ======
  const { data: store, isLoading: storeLoading } = useStoreProfile(id) as { data: any; isLoading: boolean };
  const getOrCreateConversation = useGetOrCreateConversation();
  const { data: companies = [] } = useDeliveryCompanies({ active: true });

  // ====== جلب المنتجات مع Pagination وفلتر العروض ======
  const { 
    data: listingsData, 
    isLoading: listingsLoading,
    isFetching,
  } = useListings({ 
    ownerId: id, 
    sort: sortBy,
    page: page,
    limit: limit,
    search: searchQuery || undefined,
    isOffer: viewFilter === "offers" ? true : undefined,
  });

  // ✅ استخراج البيانات بالشكل الصحيح
  const listings = listingsData?.data || [];
  const totalCount = listingsData?.count || 0;
  const totalPages = listingsData?.totalPages || 1;

  // ✅ عدد العروض
  const offersCount = listings.filter((item: any) => item.is_offer === true).length;

  // ====== تجميع المنتجات ======
  useEffect(() => {
    if (page === 1) {
      setAllListings(listings);
    } else {
      setAllListings(prev => [...prev, ...listings]);
    }
  }, [listings, page]);

  // ====== إعادة تعيين الصفحة عند تغيير الفلتر ======
  useEffect(() => {
    setPage(1);
    setAllListings([]);
  }, [searchQuery, sortBy, viewFilter]);

  // ====== حساب المسافة (هافرسين) ======
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return 0;
    
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

  // ====== حساب سعر التوصيل (مثل نون) ======
  const calculateDeliveryPrice = useCallback((company: any, distanceInKm: number, orderTotal: number): number => {
    const freeThreshold = company.free_delivery_threshold || 0;
    if (freeThreshold > 0 && orderTotal >= freeThreshold) {
      return 0;
    }

    const basePrice = company.base_price || 0;
    const pricePerKm = company.price_per_km || 0;
    let price = basePrice + (distanceInKm * pricePerKm);

    const minFee = company.min_delivery_fee || 0;
    if (price < minFee) {
      price = minFee;
    }

    const maxFee = company.max_delivery_fee || 999999;
    if (price > maxFee) {
      price = maxFee;
    }

    price = Math.round(price);
    return price <= 0 ? 0 : price;
  }, []);

  // ====== حساب سعر التوصيل (محسّن مع الهيكلية الجديدة) ======
 // ====== حساب سعر التوصيل (محسّن مع الهيكلية الجديدة) ======
useEffect(() => {
  let isMounted = true;

  const calculateDelivery = async () => {
    if (!store || !app.user) return;

    setDeliveryLoading(true);
    try {
      // ✅ 1. جلب عنوان المستخدم الافتراضي
      const { data: userAddress, error: addressError } = await supabase
        .from("user_addresses")
        .select("governorate_id, lat, lng, address_text")
        .eq("user_id", app.user.id)
        .eq("is_default", true)
        .maybeSingle();

      if (addressError || !userAddress || !isMounted) {
        setDeliveryLoading(false);
        return;
      }

      // ✅ 2. جلب شركة التوصيل
      let deliveryCompanyId = store.delivery_company_id;
      let selectedCompany = null;

      if (deliveryCompanyId) {
        const { data: company, error: companyError } = await supabase
          .from("delivery_companies")
          .select("*")
          .eq("id", deliveryCompanyId)
          .eq("is_active", true)
          .maybeSingle();

        if (!companyError && company) {
          selectedCompany = company;
          console.log("✅ [Delivery] Using store's delivery company:", company.name_ar);
        }
      }

      if (!selectedCompany) {
        const storeGovernorateId = store.governorate_id;
        const { data: companies, error: companiesError } = await supabase
          .from("delivery_companies")
          .select("*")
          .eq("is_active", true);

        if (!companiesError && companies) {
          const matchingCompanies = companies.filter((c: any) => {
            const coverage = c.coverage_areas || [];
            if (coverage.includes("all") || coverage.includes(storeGovernorateId)) {
              return true;
            }
            if (c.governorate_id === storeGovernorateId) {
              return true;
            }
            return false;
          });

          if (matchingCompanies.length > 0) {
            selectedCompany = matchingCompanies.sort((a: any, b: any) => 
              (a.base_price || 0) - (b.base_price || 0)
            )[0];
            console.log("✅ [Delivery] Using best matching company:", selectedCompany.name_ar);
          }
        }
      }

      if (!selectedCompany) {
        const { data: fallbackCompany, error: fallbackError } = await supabase
          .from("delivery_companies")
          .select("*")
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();

        if (!fallbackError && fallbackCompany) {
          selectedCompany = fallbackCompany;
          console.log("✅ [Delivery] Using fallback company:", selectedCompany.name_ar);
        }
      }

      if (!selectedCompany || !isMounted) {
        setDeliveryLoading(false);
        return;
      }

      // ✅ 3. حساب المسافة
      let distance = 0;
      const hasValidCoordinates = store.lat && store.lng && userAddress.lat && userAddress.lng;

      if (hasValidCoordinates) {
        distance = calculateDistance(
          store.lat,
          store.lng,
          userAddress.lat,
          userAddress.lng
        );
        console.log(`📍 [Delivery] Real distance: ${distance.toFixed(2)} km`);
      } else {
        const storeGovId = store.governorate_id;
        const userGovId = userAddress.governorate_id;
        
        if (storeGovId === userGovId) {
          distance = 5;
        } else {
          distance = 25;
        }
        console.log(`📍 [Delivery] Estimated distance: ${distance} km (no coordinates)`);
      }

      // ✅✅✅ 4. جلب قيمة السلة من عناصر السلة (مثل cart.tsx)
      let orderTotal = 0;
      if (app.user) {
        try {
          const { data: cartData, error: cartError } = await supabase
            .from("carts")
            .select(`
              id,
              cart_items (
                quantity,
                price
              )
            `)
            .eq("user_id", app.user.id)
            .eq("status", "active")
            .maybeSingle();

          if (cartError) {
            console.error("❌ [Delivery] Error fetching cart:", cartError);
          }
          
          if (cartData && cartData.cart_items && cartData.cart_items.length > 0) {
            orderTotal = cartData.cart_items.reduce((sum: number, item: any) => {
              return sum + (Number(item.price) * Number(item.quantity));
            }, 0);
            console.log(`🛒 [Delivery] Cart subtotal from items: ${orderTotal} SYP`);
          } else {
            console.log(`🛒 [Delivery] Cart is empty or has no items`);
          }
        } catch (error) {
          console.error("❌ [Delivery] Error calculating cart total:", error);
        }
      }

      // ✅ 5. حساب سعر التوصيل
      let price = calculateDeliveryPrice(selectedCompany, distance, orderTotal);
      const isFree = price === 0;

      console.log(`💰 [Delivery] Final price: ${price} SYP (${isFree ? 'FREE' : 'paid'})`);
      console.log(`💰 [Delivery] Free threshold: ${selectedCompany.free_delivery_threshold || 0} SYP`);
      console.log(`💰 [Delivery] Order total: ${orderTotal} SYP`);
      console.log(`💰 [Delivery] Distance: ${distance} km`);

      // ✅ 6. تحديث الحالة
      if (isMounted) {
        setDeliveryPrice({
          distance: Math.round(distance * 100) / 100,
          price,
          isFree,
          orderTotal,
          companyName: selectedCompany.name_ar || selectedCompany.name_en,
          governorateMatch: store.governorate_id === userAddress.governorate_id,
          breakdown: {
            basePrice: selectedCompany.base_price || 0,
            pricePerKm: selectedCompany.price_per_km || 0,
            distanceCost: distance * (selectedCompany.price_per_km || 0),
            minFee: selectedCompany.min_delivery_fee || 0,
            maxFee: selectedCompany.max_delivery_fee || 999999,
            freeThreshold: selectedCompany.free_delivery_threshold || 0,
            sameGovernorate: store.governorate_id === userAddress.governorate_id,
            hasCoordinates: hasValidCoordinates,
            remainingForFree: selectedCompany.free_delivery_threshold 
              ? Math.max(0, selectedCompany.free_delivery_threshold - orderTotal) 
              : 0,
          }
        });
      }

    } catch (error) {
      console.error("❌ [Delivery] Error calculating delivery:", error);
    } finally {
      if (isMounted) setDeliveryLoading(false);
    }
  };

  calculateDelivery();

  return () => {
    isMounted = false;
  };
}, [store, app.user, calculateDistance, calculateDeliveryPrice]);
  // ====== تحميل المزيد ======
  const loadMore = useCallback(() => {
    if (page < totalPages && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [page, totalPages, isFetching]);

  // ====== فتح المحادثة ======
  const handleMessage = async () => {
    if (!app.user) {
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
      return;
    }
    if (app.user.id === id) {
      toast.error(app.lang === "ar" ? "لا يمكنك مراسلة نفسك" : "You can't message yourself");
      return;
    }
    if (store?.allows_messaging === false) {
      toast.error(app.lang === "ar" ? "هذا المتجر لا يسمح بالمراسلة" : "This store doesn't allow messaging");
      return;
    }

    setIsOpeningConversation(true);
    try {
      const conversation = await getOrCreateConversation.mutateAsync({
        userId: app.user.id,
        otherUserId: id,
      });

      navigate({
        to: "/messages/$userId",
        params: { userId: id },
        search: { cid: conversation.id },
        state: { fromStore: true, storeId: id, storeName: store.store_name || store.full_name },
      });
    } catch (error) {
      toast.error(app.lang === "ar" ? "فشل فتح المحادثة. حاول مرة أخرى" : "Failed to open conversation.");
    } finally {
      setIsOpeningConversation(false);
    }
  };

  // ====== إعادة تعيين الفلتر ======
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSortBy("recent");
    setViewFilter("all");
    setPage(1);
    setAllListings([]);
  }, []);

  // ====== عرض التحميل ======
  if (storeLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-6">
        <Skeleton className="h-48 md:h-72 w-full rounded-2xl" />
        <div className="flex items-center gap-4 -mt-16 px-4">
          <Skeleton className="h-24 w-24 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <StoreIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
        <h2 className="text-2xl font-bold">{app.lang === "ar" ? "المتجر غير موجود" : "Store not found"}</h2>
        <Button className="mt-4 bg-[#0d2e2a] hover:bg-[#1a4f4a] text-white" onClick={() => navigate({ to: "/" })}>
          {app.lang === "ar" ? "العودة للرئيسية" : "Back to home"}
        </Button>
      </div>
    );
  }

  const name = store.store_name || store.full_name || (app.lang === "ar" ? "متجر" : "Store");
  const storeType = store.store_type || "online";
  const isArabic = app.lang === "ar";
  const isLoading = listingsLoading || isFetching;
  const displayListings = page === 1 ? listings : allListings;

  return (
    <div className="bg-gradient-to-b from-[#0d2e2a]/5 via-transparent to-[#2d6b63]/5 dark:from-[#0d2e2a]/20 dark:to-[#2d6b63]/10 min-h-screen">
      
      {/* ====== غلاف المتجر ====== */}
      <div className="relative h-48 md:h-72 bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] overflow-hidden">
        {store.store_cover_url && (
          <img 
            src={store.store_cover_url} 
            className="absolute inset-0 h-full w-full object-cover opacity-60" 
            alt={name}
            loading="eager"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e2a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e2a]/50 to-transparent" />
        
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge className="bg-white/10 backdrop-blur-sm text-white border-white/20 animate-pulse">
            <Sparkles className="h-3 w-3 mr-1 animate-spin-slow" />
            {isArabic ? "متجر مميز" : "Featured Store"}
          </Badge>
        </div>
      </div>

      {/* ====== معلومات المتجر ====== */}
      <div className="mx-auto max-w-7xl px-4 -mt-16 relative z-10">
        <div className="rounded-2xl bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-xl shadow-2xl shadow-[#0d2e2a]/20 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 border border-[#0d2e2a]/10">
          
          {/* شعار المتجر */}
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] overflow-hidden border-4 border-white dark:border-[#1e293b] shadow-xl grid place-items-center text-white font-black text-3xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              {store.store_logo_url || store.avatar_url ? (
                <img 
                  src={store.store_logo_url || store.avatar_url} 
                  className="h-full w-full object-cover" 
                  alt={name}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                name[0]?.toUpperCase() || "?"
              )}
            </div>
            {store.is_featured && (
              <div className="absolute -top-1 -right-1">
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 px-2 py-0.5 text-[8px] animate-bounce">
                  <Flame className="h-2.5 w-2.5 inline mr-0.5" />
                  {isArabic ? "رائج" : "Trending"}
                </Badge>
              </div>
            )}
          </div>

          {/* تفاصيل المتجر */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black text-[#0d2e2a] dark:text-white">{name}</h1>
              <StoreIcon className="h-5 w-5 text-[#2d6b63] animate-pulse" />
              <StoreStatusBadge store={store} lang={app.lang} />
              {store.is_verified && (
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <BadgeCheck className="h-3 w-3 mr-1" />
                  {isArabic ? "موثق" : "Verified"}
                </Badge>
              )}
            </div>
            
            {store.store_description && (
              <p className="text-muted-foreground mt-1 text-sm">{store.store_description}</p>
            )}
            
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-[#4a9f95]">
                <Star className="h-4 w-4 fill-current animate-pulse" />
                {Number(store.rating || 0).toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />
                {totalCount} {t("products_tab")}
              </span>
              
              <span className="flex items-center gap-1 bg-[#0d2e2a]/10 px-2.5 py-0.5 rounded-full text-[#0d2e2a] text-xs font-medium">
                {storeType === "online" ? (
                  <>
                    <Globe className="h-3.5 w-3.5 animate-spin-slow" />
                    {isArabic ? "متجر إلكتروني" : "Online Store"}
                  </>
                ) : (
                  <>
                    <Building2 className="h-3.5 w-3.5" />
                    {isArabic ? "متجر فعلي" : "Physical Store"}
                  </>
                )}
              </span>

              {(store.store_opens_at || store.store_closes_at) && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 animate-pulse" />
                  {(store.store_opens_at || "--:--").slice(0,5)} — {(store.store_closes_at || "--:--").slice(0,5)}
                </span>
              )}

              {store.store_address && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {store.store_address}
                </span>
              )}
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {store.allows_messaging !== false && app.user?.id !== id && (
              <Button
                onClick={handleMessage}
                disabled={isOpeningConversation}
                className="gap-2 bg-gradient-to-r from-[#0d2e2a] to-[#2d6b63] hover:from-[#1a4f4a] hover:to-[#4a9f95] text-white shadow-lg shadow-[#0d2e2a]/30 hover:shadow-xl transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 group"
              >
                {isOpeningConversation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                )}
                {isArabic ? "مراسلة المتجر" : "Message Store"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/store/${id}`, '_blank')}
              className="border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10"
            >
              <Share2 className="h-3.5 w-3.5 mr-1" />
              {isArabic ? "مشاركة" : "Share"}
            </Button>
          </div>
        </div>
      </div>

      {/* ====== سعر التوصيل (محسّن مثل نون) ====== */}
      {app.user && deliveryPrice && !deliveryLoading && (
        <div className="mx-auto max-w-7xl px-4 mt-4">
          <Card className={cn(
            "border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden",
            deliveryPrice.isFree 
              ? 'border-emerald-500/40 hover:border-emerald-500/60 bg-gradient-to-r from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-950/10' 
              : deliveryPrice.governorateMatch 
                ? 'border-[#2d6b63]/30 hover:border-[#2d6b63]/50' 
                : 'border-amber-500/30 hover:border-amber-500/50'
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                    deliveryPrice.isFree 
                      ? "bg-emerald-500/20" 
                      : "bg-[#0d2e2a]/10"
                  )}>
                    <Truck className={cn(
                      "h-6 w-6 transition-all duration-500",
                      deliveryPrice.isFree 
                        ? "text-emerald-500 animate-bounce" 
                        : "text-[#0d2e2a] animate-float"
                    )} />
                  </div>
                  
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {deliveryPrice.isFree ? (
                        <>
                          <span className="text-emerald-600 dark:text-emerald-400">🚚 توصيل مجاني</span>
                          <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-[9px] px-2 py-0.5 animate-pulse">
                            {isArabic ? "🎉 عرض خاص" : "🎉 Special Offer"}
                          </Badge>
                        </>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-200">{isArabic ? "🚚 سعر التوصيل" : "🚚 Delivery Price"}</span>
                      )}
                      
                      <Badge className={cn(
                        "border-0 text-[9px] px-2 py-0.5 animate-pulse",
                        deliveryPrice.governorateMatch 
                          ? 'bg-emerald-500/20 text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-400' 
                          : 'bg-amber-500/20 text-amber-600 dark:bg-amber-500/30 dark:text-amber-400'
                      )}>
                        {deliveryPrice.governorateMatch 
                          ? (isArabic ? "📍 نفس المحافظة" : "📍 Same Governorate") 
                          : (isArabic ? "📍 محافظة مختلفة" : "📍 Different Governorate")}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span>{isArabic ? `المسافة: ${deliveryPrice.distance} كم` : `Distance: ${deliveryPrice.distance} km`}</span>
                      <span className="text-muted-foreground/30">|</span>
                      <span className="text-[#2d6b63] font-medium">{deliveryPrice.companyName}</span>
                      {deliveryPrice.breakdown?.hasCoordinates ? (
                        <Badge className="bg-blue-500/10 text-blue-600 border-0 text-[8px] px-1.5 py-0">
                          📍 {isArabic ? "موقع دقيق" : "Precise"}
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[8px] px-1.5 py-0">
                          📍 {isArabic ? "تقديري" : "Estimated"}
                        </Badge>
                      )}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground/70">
                      <span>الحد الأدنى: {deliveryPrice.breakdown?.minFee || 0} SYP</span>
                      <span>|</span>
                      <span>الحد الأقصى: {deliveryPrice.breakdown?.maxFee || 999999} SYP</span>
                      {deliveryPrice.breakdown?.freeThreshold > 0 && (
                        <>
                          <span>|</span>
                          <span>توصيل مجاني للطلبات فوق {deliveryPrice.breakdown?.freeThreshold} SYP</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {deliveryPrice.isFree ? (
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-sm px-4 py-1.5 animate-bounce rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        {isArabic ? "🆓 مجاني" : "🆓 Free"}
                      </span>
                    </Badge>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-[#0d2e2a] dark:text-[#4a9f95]">
                        {deliveryPrice.price} SYP
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {isArabic ? "شامل الضريبة" : "Tax included"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {!deliveryPrice.isFree && deliveryPrice.breakdown?.freeThreshold > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>{isArabic ? "🔓 أضف منتجات للحصول على توصيل مجاني" : "🔓 Add items for free delivery"}</span>
                    <span className="font-medium text-[#2d6b63]">
                      {deliveryPrice.breakdown?.freeThreshold - 0} SYP
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2d6b63] to-[#4a9f95] rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${Math.min(100, (0 / deliveryPrice.breakdown?.freeThreshold) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ====== الفلتر والترتيب ====== */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        
        {/* شريط البحث والفلتر */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          
          {/* البحث */}
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground group-focus-within:text-[#0d2e2a] transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={isArabic ? "🔍 بحث في المتجر..." : "🔍 Search in store..."}
              className="pl-9 pr-3 h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 my-auto"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-[#0d2e2a] transition-colors" />
              </button>
            )}
          </div>

          {/* أزرار الفلتر والترتيب */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            
            {/* ✅ فلتر المنتجات / العروض (مثل الكبسة) */}
            <div className="relative flex items-center bg-[#0d2e2a]/5 dark:bg-[#0d2e2a]/20 rounded-xl p-1 border border-[#0d2e2a]/10">
              <button
                onClick={() => {
                  setViewFilter("all");
                  setPage(1);
                  setAllListings([]);
                }}
                className={cn(
                  "relative z-10 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  viewFilter === "all" 
                    ? "text-white" 
                    : "text-[#0d2e2a] dark:text-white/60 hover:text-[#0d2e2a] dark:hover:text-white"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" />
                  {isArabic ? "منتجات" : "Products"}
                  <Badge className="bg-white/20 text-white text-[8px] px-1.5 py-0">
                    {totalCount}
                  </Badge>
                </span>
              </button>
              
              <button
                onClick={() => {
                  setViewFilter("offers");
                  setPage(1);
                  setAllListings([]);
                }}
                className={cn(
                  "relative z-10 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  viewFilter === "offers" 
                    ? "text-white" 
                    : "text-[#0d2e2a] dark:text-white/60 hover:text-[#0d2e2a] dark:hover:text-white"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5" />
                  {isArabic ? "عروض" : "Offers"}
                  <Badge className="bg-red-500/30 text-white text-[8px] px-1.5 py-0">
                    {offersCount}
                  </Badge>
                </span>
              </button>
              
              {/* الخلفية المتحركة (الكبسة) */}
              <div 
                className={cn(
                  "absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg bg-gradient-to-r from-[#0d2e2a] to-[#2d6b63] shadow-lg shadow-[#0d2e2a]/30 transition-all duration-300 ease-out",
                  viewFilter === "all" ? "left-1" : "left-[calc(50%-2px)]"
                )}
              />
            </div>

            {/* ترتيب */}
            <Select value={sortBy} onValueChange={(v: any) => {
              setSortBy(v);
              setPage(1);
            }}>
              <SelectTrigger className="w-[140px] h-10 rounded-xl border-[#0d2e2a]/20 bg-white dark:bg-[#1e293b]">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-[#0d2e2a]" />
                  <SelectValue placeholder={isArabic ? "ترتيب" : "Sort"} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">{isArabic ? "🕐 الأحدث" : "🕐 Recent"}</SelectItem>
                <SelectItem value="popular">{isArabic ? "🔥 الأكثر رواجاً" : "🔥 Popular"}</SelectItem>
                <SelectItem value="price_asc">{isArabic ? "💰 السعر: منخفض→مرتفع" : "💰 Price: Low→High"}</SelectItem>
                <SelectItem value="price_desc">{isArabic ? "💰 السعر: مرتفع→منخفض" : "💰 Price: High→Low"}</SelectItem>
                <SelectItem value="rating">{isArabic ? "⭐ الأعلى تقييماً" : "⭐ Top Rated"}</SelectItem>
              </SelectContent>
            </Select>

            {/* تبديل العرض */}
            <div className="flex items-center bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-300",
                  viewMode === "grid" ? "bg-[#0d2e2a] text-white" : "text-muted-foreground hover:bg-[#0d2e2a]/10"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-300",
                  viewMode === "list" ? "bg-[#0d2e2a] text-white" : "text-muted-foreground hover:bg-[#0d2e2a]/10"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* إحصائيات النتائج */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-[#0d2e2a]">
              {viewFilter === "offers" ? offersCount : totalCount}
            </span>
            {viewFilter === "offers" ? (isArabic ? "عرض" : "offers") : (isArabic ? "منتج" : "products")}
            {searchQuery && (
              <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border-[#0d2e2a]/20">
                <Search className="h-3 w-3 mr-1" />
                {searchQuery}
              </Badge>
            )}
            {viewFilter === "offers" && (
              <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                <Flame className="h-3 w-3 mr-1" />
                {isArabic ? "عروض حصرية" : "Exclusive Offers"}
              </Badge>
            )}
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-[#2d6b63]" />
              {isArabic ? "جاري التحميل..." : "Loading..."}
            </div>
          )}
        </div>

        {/* ====== قائمة المنتجات ====== */}
        {displayListings.length === 0 && !isLoading ? (
          <div className="rounded-2xl bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm p-12 text-center border border-[#0d2e2a]/10">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40 animate-float" />
            <p className="text-lg font-medium text-[#0d2e2a] dark:text-white">
              {searchQuery
                ? (isArabic ? "لا توجد منتجات تطابق البحث" : "No products match search")
                : viewFilter === "offers"
                ? (isArabic ? "لا توجد عروض حالياً" : "No offers available")
                : (isArabic ? "لا توجد منتجات بعد" : "No products yet")}
            </p>
            {(searchQuery || viewFilter === "offers") && (
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="mt-4 border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {isArabic ? "إعادة تعيين الفلتر" : "Reset filter"}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className={cn(
              "grid gap-4",
              viewMode === "grid" 
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" 
                : "grid-cols-1"
            )}>
              {displayListings.map((item: any, index: number) => (
                <div 
                  key={item.id} 
                  className="animate-fade-up"
                  style={{ animationDelay: `${(index % 10) * 50}ms` }}
                >
                  <Suspense fallback={<ProductSkeleton />}>
                    <ListingCard item={item} viewMode={viewMode} />
                  </Suspense>
                </div>
              ))}
            </div>

            {/* ✅ زر تحميل المزيد */}
            {page < totalPages && (
              <div ref={loadMoreRef} className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isFetching}
                  className="rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10"
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isArabic ? "جاري التحميل..." : "Loading..."}
                    </>
                  ) : (
                    <>
                      {isArabic ? "عرض المزيد" : "Load More"}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* ✅ عند انتهاء المنتجات */}
            {page >= totalPages && totalCount > limit && (
              <div className="flex justify-center mt-6 text-sm text-muted-foreground">
                {isArabic ? "🎉 تم تحميل جميع المنتجات" : "🎉 All products loaded"}
              </div>
            )}
          </>
        )}

        {/* إحصاءات إضافية */}
        {totalCount > 0 && (
          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground border-t border-[#0d2e2a]/10 pt-4">
            <span>
              {isArabic 
                ? `عرض ${displayListings.length} من ${viewFilter === "offers" ? offersCount : totalCount} ${viewFilter === "offers" ? "عرض" : "منتج"}` 
                : `Showing ${displayListings.length} of ${viewFilter === "offers" ? offersCount : totalCount} ${viewFilter === "offers" ? "offers" : "products"}`}
            </span>
            <span className="flex items-center gap-2">
              <Badge className="bg-[#0d2e2a]/5 text-[#0d2e2a] border-[#0d2e2a]/20">
                {isArabic ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
              </Badge>
            </span>
          </div>
        )}
      </section>

      {/* ====== CSS Animations ====== */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.5s ease-out forwards; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ====== دوال مساعدة ======

export function isStoreCurrentlyOpen(store: any): boolean {
  if (!store || store.store_online === false) return false;

  if (!store.store_opens_at || !store.store_closes_at) {
    console.log('ℹ️ [Store] No opening hours set, assuming open');
    return true;
  }

  try {
    const opens = store.store_opens_at.slice(0, 5);
    const closes = store.store_closes_at.slice(0, 5);

    if (!opens || !closes || opens.length < 5 || closes.length < 5) {
      console.log('ℹ️ [Store] Invalid time format, assuming open');
      return true;
    }

    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();

    const [oh, om] = opens.split(":").map(Number);
    const [ch, cm] = closes.split(":").map(Number);

    if (isNaN(oh) || isNaN(om) || isNaN(ch) || isNaN(cm)) {
      console.log('ℹ️ [Store] Invalid time numbers, assuming open');
      return true;
    }

    const o = oh * 60 + om;
    const c = ch * 60 + cm;

    if (o <= c) {
      return cur >= o && cur <= c;
    } else {
      return cur >= o || cur <= c;
    }
  } catch (error) {
    console.error('❌ [Store] Error checking store status:', error);
    return true;
  }
}

function StoreStatusBadge({ store, lang }: { store: any; lang: "ar" | "en" }) {
  const open = isStoreCurrentlyOpen(store);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
      open 
        ? "bg-[#2d6b63]/15 text-[#2d6b63] animate-pulse" 
        : "bg-muted text-muted-foreground"
    }`}>
      <span className={`h-2 w-2 rounded-full ${
        open ? "bg-[#2d6b63] animate-pulse" : "bg-muted-foreground"
      }`} />
      {open 
        ? (lang === "ar" ? "🟢 مفتوح الآن" : "🟢 Open now") 
        : (lang === "ar" ? "🔴 مغلق" : "🔴 Closed")}
    </span>
  );
}

// ============================================================
// ✅ SKELETON COMPONENT
// ============================================================
function ProductSkeleton() {
  return (
    <div className="rounded-xl bg-white dark:bg-[#1e293b] border border-[#0d2e2a]/10 p-3 animate-pulse">
      <div className="aspect-square rounded-lg bg-[#0d2e2a]/10" />
      <div className="h-4 bg-[#0d2e2a]/10 rounded mt-3 w-3/4" />
      <div className="h-3 bg-[#0d2e2a]/10 rounded mt-2 w-1/2" />
      <div className="flex items-center gap-2 mt-3">
        <div className="h-4 bg-[#0d2e2a]/10 rounded w-1/3" />
        <div className="h-4 bg-[#0d2e2a]/10 rounded w-1/4" />
      </div>
    </div>
  );
}