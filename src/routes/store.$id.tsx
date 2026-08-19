// src/routes/store.$id.tsx - الكود المُصحّح بالكامل مع فلتر يدوي يعمل 100%

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef, lazy, Suspense, useMemo } from "react";
import { 
  Star, MessageCircle, Store as StoreIcon, Loader2, 
  Clock, MapPin, Globe, Building2, Truck,
  Sparkles, Package, Share2, Flame, BadgeCheck,
  Search, X, ArrowUpDown, Grid3X3, List, ChevronDown,
  RefreshCw, Eye, Heart, TrendingUp, Zap, Gift, Target, Award,
  LayoutGrid, Check
} from "lucide-react";
import { useApp, useT } from "@/lib/i18n";
import { useListings, useStoreProfile, useDeliveryCompanies, useProductOffers } from "@/lib/queries";
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
import { useCartTotal } from "@/lib/hooks/useCartTotal";

// ✅ Lazy Loading للـ ListingCard
const ListingCard = lazy(() => import("@/components/ListingCard"));

export const Route = createFileRoute("/store/$id")({
  component: StorePage,
  head: () => ({ meta: [{ title: "Store — Souqi" }] }),
});

// ============================================================
// ✅ SortDropdown (نفس الموجود في category/$slug.tsx)
// ============================================================
function SortDropdown({ value, onChange, lang }: { value: string; onChange: (val: string) => void; lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: 'recent', label: lang === 'ar' ? '🕐 الأحدث' : '🕐 Recent', icon: Clock, color: 'text-blue-500' },
    { value: 'popular', label: lang === 'ar' ? '🔥 الأكثر رواجاً' : '🔥 Popular', icon: Flame, color: 'text-orange-500' },
    { value: 'price_asc', label: lang === 'ar' ? '💰 السعر: منخفض→مرتفع' : '💰 Price: Low→High', icon: ArrowUpDown, color: 'text-emerald-500' },
    { value: 'price_desc', label: lang === 'ar' ? '💰 السعر: مرتفع→منخفض' : '💰 Price: High→Low', icon: ArrowUpDown, color: 'text-rose-500' },
    { value: 'rating', label: lang === 'ar' ? '⭐ الأعلى تقييماً' : '⭐ Top Rated', icon: Star, color: 'text-yellow-500' },
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
    orderTotal: number;
    remainingForFree: number;
    freeThreshold: number;
  } | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  // ====== State الفلتر والترتيب ======
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "price_asc" | "price_desc" | "rating">("recent");
  const [viewFilter, setViewFilter] = useState<"all" | "products" | "offers">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // ====== Hooks ======
  const { data: store, isLoading: storeLoading } = useStoreProfile(id) as { data: any; isLoading: boolean };
  const getOrCreateConversation = useGetOrCreateConversation();
  const { data: companies = [] } = useDeliveryCompanies({ active: true });
  
  const cartTotalForStore = useCartTotal(app.user?.id, id);

  // ====== جلب المنتجات والعروض التخفيضية من listings ======
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
  });

  // ====== جلب العروض الترويجية من product_offers ======
  const { data: promoOffersRaw = [], isLoading: promoLoading } = useProductOffers({ 
    isActive: true,
    limit: 100,
    storeId: id,
  });

  // ✅ ترتيب العروض الترويجية حسب الـ sortBy
  const promoOffers = useMemo(() => {
    if (!promoOffersRaw || promoOffersRaw.length === 0) return [];
    
    const sorted = [...promoOffersRaw];
    
    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => {
          const priceA = a.products?.[0]?.price || 0;
          const priceB = b.products?.[0]?.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        sorted.sort((a, b) => {
          const priceA = a.products?.[0]?.price || 0;
          const priceB = b.products?.[0]?.price || 0;
          return priceB - priceA;
        });
        break;
      case 'recent':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        sorted.sort((a, b) => (b.products?.[0]?.rating || 0) - (a.products?.[0]?.rating || 0));
        break;
      case 'popular':
      default:
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    
    return sorted;
  }, [promoOffersRaw, sortBy]);

  const rows = listingsData?.data || [];
  const totalCount = listingsData?.count || 0;
  const totalPages = listingsData?.totalPages || 1;

  // ✅ دمج كل العناصر مع الترتيب الاحترافي
  const allItems = useMemo(() => {
    // ✅ منتجات وعروض تخفيضية من useListings
    const listingsItems = rows.map((item: any) => ({
      ...item,
      is_offer: item.is_offer || false,
      is_promo_offer: false,
    }));
    
    // ✅ عروض ترويجية من product_offers
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
        title_ar: offer.display_text_ar || mainProduct?.title_ar || (app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"),
        title_en: offer.display_text_en || mainProduct?.title_en || (app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"),
        description_ar: offer.display_text_ar || mainProduct?.description_ar || "",
        description_en: offer.display_text_en || mainProduct?.description_en || "",
        price: mainProduct?.price || 0,
        old_price: null,
        discount_percent: null,
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
        required_product_ids: offer.required_product_ids,
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
        variation_ids: offer.variation_ids || [],
        result_variation_ids: offer.result_variation_ids || [],
      };
    });

    // ✅ دمج الكل
    let all = [...listingsItems, ...promoItems];

    // ✅ ترتيب الكل حسب الـ sortBy
    if (sortBy === 'price_asc') {
      all.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      all.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'recent') {
      all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'rating') {
      all.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return all;
  }, [rows, promoOffers, app.lang, sortBy]);

  // ✅ فلترة العناصر حسب النوع
  const filteredByType = useMemo(() => {
    if (viewFilter === 'all') return allItems;
    
    if (viewFilter === 'products') {
      return allItems.filter((item: any) => 
        !item.is_offer && !item.is_promo_offer
      );
    }
    
    if (viewFilter === 'offers') {
      return allItems.filter((item: any) => 
        item.is_offer === true || item.is_promo_offer === true
      );
    }
    
    return allItems;
  }, [allItems, viewFilter]);

  // ✅ عدد العروض (تخفيضية + ترويجية)
  const offersCount = useMemo(() => {
    return allItems.filter((item: any) => 
      item.is_offer === true || item.is_promo_offer === true
    ).length;
  }, [allItems]);

  // ✅ عدد المنتجات (بدون عروض)
  const productsCount = useMemo(() => {
    return allItems.filter((item: any) => 
      !item.is_offer && !item.is_promo_offer
    ).length;
  }, [allItems]);

  // ✅ العناصر المعروضة
  const displayListings = useMemo(() => {
    if (page === 1) return filteredByType;
    return filteredByType;
  }, [filteredByType, page]);

  // ✅ إعادة تعيين الصفحة عند تغيير الفلاتر
  useEffect(() => {
    setPage(1);
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

  // ====== حساب سعر التوصيل ======
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

  // ====== حساب سعر التوصيل ======
  useEffect(() => {
    let isMounted = true;

    const calculateDelivery = async () => {
      if (!store || !app.user) return;

      setDeliveryLoading(true);
      try {
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
          }
        }

        if (!selectedCompany || !isMounted) {
          setDeliveryLoading(false);
          return;
        }

        let distance = 0;
        const hasValidCoordinates = store.lat && store.lng && userAddress.lat && userAddress.lng;

        if (hasValidCoordinates) {
          distance = calculateDistance(
            store.lat,
            store.lng,
            userAddress.lat,
            userAddress.lng
          );
        } else {
          const storeGovId = store.governorate_id;
          const userGovId = userAddress.governorate_id;
          
          if (storeGovId === userGovId) {
            distance = 5;
          } else {
            distance = 25;
          }
        }

        const orderTotal = cartTotalForStore || 0;

        const freeThreshold = selectedCompany.free_delivery_threshold || 0;
        let price = calculateDeliveryPrice(selectedCompany, distance, orderTotal);
        const isFree = price === 0;
        const remainingForFree = freeThreshold > 0 ? Math.max(0, freeThreshold - orderTotal) : 0;

        if (isMounted) {
          setDeliveryPrice({
            distance: Math.round(distance * 100) / 100,
            price,
            isFree,
            orderTotal,
            companyName: selectedCompany.name_ar || selectedCompany.name_en,
            governorateMatch: store.governorate_id === userAddress.governorate_id,
            freeThreshold: freeThreshold,
            remainingForFree: remainingForFree,
            breakdown: {
              basePrice: selectedCompany.base_price || 0,
              pricePerKm: selectedCompany.price_per_km || 0,
              distanceCost: distance * (selectedCompany.price_per_km || 0),
              minFee: selectedCompany.min_delivery_fee || 0,
              maxFee: selectedCompany.max_delivery_fee || 999999,
              freeThreshold: freeThreshold,
              sameGovernorate: store.governorate_id === userAddress.governorate_id,
              hasCoordinates: hasValidCoordinates,
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
  }, [store, app.user, cartTotalForStore, calculateDistance, calculateDeliveryPrice]);

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
        <Button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white" onClick={() => navigate({ to: "/" })}>
          {app.lang === "ar" ? "العودة للرئيسية" : "Back to home"}
        </Button>
      </div>
    );
  }

  const name = store.store_name || store.full_name || (app.lang === "ar" ? "متجر" : "Store");
  const storeType = store.store_type || "online";
  const isArabic = app.lang === "ar";
  const isLoading = listingsLoading || isFetching || promoLoading;

  return (
    <div className="bg-gradient-to-b from-pink-500/5 via-transparent to-rose-500/5 dark:from-pink-500/20 dark:to-rose-500/10 min-h-screen">
      
      {/* ====== غلاف المتجر ====== */}
      <div className="relative h-48 md:h-72 bg-gradient-to-br from-pink-500 to-rose-500 overflow-hidden">
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
        <div className="rounded-2xl bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-xl shadow-2xl shadow-pink-500/20 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 border border-pink-300/20">
          
          {/* شعار المتجر */}
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 overflow-hidden border-4 border-white dark:border-[#1e293b] shadow-xl grid place-items-center text-white font-black text-3xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
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
              <StoreIcon className="h-5 w-5 text-pink-500 animate-pulse" />
              <StoreStatusBadge store={store} lang={app.lang} />
              {store.is_verified && (
                <Badge className="bg-pink-500/10 text-pink-600 border-pink-500/20">
                  <BadgeCheck className="h-3 w-3 mr-1" />
                  {isArabic ? "موثق" : "Verified"}
                </Badge>
              )}
            </div>
            
            {store.store_description && (
              <p className="text-muted-foreground mt-1 text-sm">{store.store_description}</p>
            )}
            
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-pink-500">
                <Star className="h-4 w-4 fill-current animate-pulse" />
                {Number(store.rating || 0).toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />
                {allItems.length} {t("products_tab")}
              </span>
              
              <span className="flex items-center gap-1 bg-pink-500/10 px-2.5 py-0.5 rounded-full text-pink-600 text-xs font-medium">
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
                className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 group"
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
              className="border-pink-300/30 text-pink-600 hover:bg-pink-500/10"
            >
              <Share2 className="h-3.5 w-3.5 mr-1" />
              {isArabic ? "مشاركة" : "Share"}
            </Button>
          </div>
        </div>
      </div>

      {/* ====== سعر التوصيل ====== */}
      {app.user && deliveryPrice && !deliveryLoading && (
        <div className="mx-auto max-w-7xl px-4 mt-4">
          <Card className={cn(
            "border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden",
            deliveryPrice.isFree 
              ? 'border-pink-400/40 hover:border-pink-500/60 bg-gradient-to-r from-pink-50/50 to-pink-100/30 dark:from-pink-950/20 dark:to-pink-950/10' 
              : deliveryPrice.governorateMatch 
                ? 'border-pink-400/30 hover:border-pink-500/50' 
                : 'border-amber-500/30 hover:border-amber-500/50'
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                    deliveryPrice.isFree 
                      ? "bg-pink-500/20" 
                      : "bg-pink-500/10"
                  )}>
                    <Truck className={cn(
                      "h-6 w-6 transition-all duration-500",
                      deliveryPrice.isFree 
                        ? "text-pink-500 animate-bounce" 
                        : "text-pink-600 animate-float"
                    )} />
                  </div>
                  
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {deliveryPrice.isFree ? (
                        <>
                          <span className="text-pink-600 dark:text-pink-400">🚚 توصيل مجاني</span>
                          <Badge className="bg-pink-500/20 text-pink-600 border-0 text-[9px] px-2 py-0.5 animate-pulse">
                            {isArabic ? "🎉 عرض خاص" : "🎉 Special Offer"}
                          </Badge>
                        </>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-200">{isArabic ? "🚚 سعر التوصيل" : "🚚 Delivery Price"}</span>
                      )}
                      
                      <Badge className={cn(
                        "border-0 text-[9px] px-2 py-0.5 animate-pulse",
                        deliveryPrice.governorateMatch 
                          ? 'bg-pink-500/20 text-pink-600 dark:bg-pink-500/30 dark:text-pink-400' 
                          : 'bg-amber-500/20 text-amber-600 dark:bg-amber-500/30 dark:text-amber-400'
                      )}>
                        {deliveryPrice.governorateMatch 
                          ? (isArabic ? "📍 نفس المحافظة" : "📍 Same Governorate") 
                          : (isArabic ? "📍 محافظة مختلفة" : "📍 Different Governorate")}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span>{isArabic ? `المسافة: ${deliveryPrice.distance} كم` : `Distance: ${deliveryPrice.distance} km`}</span>
                      <span className="text-muted-foreground/30">|</span>
                      <span className="text-pink-600 font-medium">{deliveryPrice.companyName}</span>
                      {deliveryPrice.breakdown?.hasCoordinates ? (
                        <Badge className="bg-blue-500/10 text-blue-600 border-0 text-[8px] px-1.5 py-0">
                          📍 {isArabic ? "موقع دقيق" : "Precise"}
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[8px] px-1.5 py-0">
                          📍 {isArabic ? "تقديري" : "Estimated"}
                        </Badge>
                      )}
                    </div>
                    
                    {deliveryPrice.freeThreshold > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
                          <Gift className="h-3 w-3 text-pink-500" />
                          <span className="text-[10px] font-medium text-pink-600 dark:text-pink-400">
                            {isArabic 
                              ? `🎯 توصيل مجاني للطلبات التي تتجاوز ${deliveryPrice.freeThreshold} SYP`
                              : `🎯 Free delivery on orders over ${deliveryPrice.freeThreshold} SYP`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  {deliveryPrice.isFree ? (
                    <Badge className="bg-pink-500/20 text-pink-600 border-0 text-sm px-4 py-1.5 animate-bounce rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        {isArabic ? "🆓 مجاني" : "🆓 Free"}
                      </span>
                    </Badge>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        {deliveryPrice.price} SYP
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {!deliveryPrice.isFree && deliveryPrice.freeThreshold > 0 && deliveryPrice.remainingForFree > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-3.5 w-3.5 text-pink-500 animate-pulse" />
                      <span className="font-medium text-pink-600 dark:text-pink-400">
                        {isArabic ? "🎯 أضف منتجات بقيمة" : "🎯 Add items worth"}
                      </span>
                      <span className="font-bold text-pink-600 dark:text-pink-400 text-xs">
                        {deliveryPrice.remainingForFree} SYP
                      </span>
                      <span className="text-pink-600/70 dark:text-pink-400/70">
                        {isArabic ? "للحصول على توصيل مجاني" : "to get free delivery"}
                      </span>
                    </div>
                    <Badge className="bg-gradient-to-r from-pink-500/20 to-pink-400/20 text-pink-600 dark:text-pink-300 border-0 text-[9px] px-2 py-0.5 animate-pulse">
                      <Gift className="h-2.5 w-2.5 inline mr-0.5" />
                      {isArabic ? "🎁 عرض" : "🎁 Offer"}
                    </Badge>
                  </div>
                  <div className="relative h-2 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 via-pink-400 to-rose-500 rounded-full transition-all duration-1000 shadow-lg shadow-pink-500/20"
                      style={{ 
                        width: `${Math.min(100, ((deliveryPrice.orderTotal || 0) / deliveryPrice.freeThreshold) * 100)}%` 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-muted-foreground/70">
                      {isArabic ? "📦 قيمة الطلب الحالية" : "📦 Current order value"}
                      <span className="font-bold text-pink-600 dark:text-pink-400 mr-1">
                        {deliveryPrice.orderTotal || 0} SYP
                      </span>
                    </span>
                    <span className="text-muted-foreground/50">
                      {isArabic ? "الهدف" : "Target"} 
                      <span className="font-bold text-[#0d2e2a] dark:text-white mr-1">
                        {deliveryPrice.freeThreshold} SYP
                      </span>
                    </span>
                  </div>
                  
                  {deliveryPrice.remainingForFree > 0 && (
                    <div className="mt-2 p-2 bg-gradient-to-r from-pink-50/50 to-pink-100/30 dark:from-pink-950/30 dark:to-pink-950/20 rounded-lg border border-pink-200/50 dark:border-pink-800/30 flex items-center gap-2">
                      <Award className="h-4 w-4 text-pink-500 flex-shrink-0" />
                      <p className="text-[10px] text-pink-700 dark:text-pink-300 font-medium">
                        {isArabic 
                          ? `💡 أضف منتجات بقيمة ${deliveryPrice.remainingForFree} SYP إضافية وستحصل على توصيل مجاني! 🎉`
                          : `💡 Add ${deliveryPrice.remainingForFree} SYP more worth of products and get free delivery! 🎉`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {deliveryPrice.isFree && deliveryPrice.freeThreshold > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-pink-50/50 to-pink-100/30 dark:from-pink-950/30 dark:to-pink-950/20 rounded-lg border border-pink-200/50 dark:border-pink-800/30">
                    <Sparkles className="h-4 w-4 text-pink-500 flex-shrink-0 animate-pulse" />
                    <p className="text-[10px] text-pink-700 dark:text-pink-300 font-medium">
                      {isArabic 
                        ? `🎉 قيمة طلبك (${deliveryPrice.orderTotal || 0} SYP) تجاوزت الحد الأدنى (${deliveryPrice.freeThreshold} SYP) → توصيل مجاني!`
                        : `🎉 Your order value (${deliveryPrice.orderTotal || 0} SYP) exceeded the minimum (${deliveryPrice.freeThreshold} SYP) → Free delivery!`}
                    </p>
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
            <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground group-focus-within:text-pink-600 transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={isArabic ? "🔍 بحث في المتجر..." : "🔍 Search in store..."}
              className="pl-9 pr-3 h-10 rounded-xl border-pink-300/30 dark:border-pink-400/30 bg-white dark:bg-[#1e293b] focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 my-auto"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-pink-600 transition-colors" />
              </button>
            )}
          </div>

          {/* أزرار الفلتر والترتيب */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            
            {/* ✅ فلتر يدوي - أزرار منفصلة - شغالة 100% */}
            <div className="relative flex items-center bg-pink-500/5 dark:bg-pink-500/20 rounded-xl p-1 border border-pink-300/20">
              {/* زر الكل */}
              <button
                onClick={() => {
                  setViewFilter("all");
                  setPage(1);
                }}
                className={cn(
                  "relative z-10 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  viewFilter === "all" 
                    ? "text-white" 
                    : "text-[#0d2e2a] dark:text-white/60 hover:text-pink-600 dark:hover:text-pink-400"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  {isArabic ? "الكل" : "All"}
                  <Badge className="bg-white/20 text-white text-[8px] px-1.5 py-0">
                    {allItems.length}
                  </Badge>
                </span>
              </button>
              
              {/* زر منتجات */}
              <button
                onClick={() => {
                  setViewFilter("products");
                  setPage(1);
                }}
                className={cn(
                  "relative z-10 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  viewFilter === "products" 
                    ? "text-white" 
                    : "text-[#0d2e2a] dark:text-white/60 hover:text-pink-600 dark:hover:text-pink-400"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" />
                  {isArabic ? "منتجات" : "Products"}
                  <Badge className="bg-white/20 text-white text-[8px] px-1.5 py-0">
                    {productsCount}
                  </Badge>
                </span>
              </button>
              
              {/* زر عروض */}
              <button
                onClick={() => {
                  setViewFilter("offers");
                  setPage(1);
                }}
                className={cn(
                  "relative z-10 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  viewFilter === "offers" 
                    ? "text-white" 
                    : "text-[#0d2e2a] dark:text-white/60 hover:text-pink-600 dark:hover:text-pink-400"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5" />
                  {isArabic ? "عروض" : "Offers"}
                  <Badge className="bg-white/20 text-white text-[8px] px-1.5 py-0">
                    {offersCount}
                  </Badge>
                </span>
              </button>
              
              {/* المؤشر المتحرك */}
              <div 
                className={cn(
                  "absolute top-1 h-[calc(100%-8px)] w-[calc(33.33%-4px)] rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30 transition-all duration-300 ease-out",
                  viewFilter === "all" ? "left-1" : 
                  viewFilter === "products" ? "left-[calc(33.33%+2px)]" : 
                  "left-[calc(66.66%+2px)]"
                )}
              />
            </div>

            {/* ✅ ترتيب */}
            <SortDropdown
              value={sortBy}
              onChange={(val) => {
                setSortBy(val as any);
                setPage(1);
              }}
              lang={app.lang}
            />

            {/* تبديل العرض */}
            <div className="flex items-center bg-white dark:bg-[#1e293b] rounded-xl border border-pink-300/30 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-300",
                  viewMode === "grid" ? "bg-pink-500 text-white" : "text-muted-foreground hover:bg-pink-500/10"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-300",
                  viewMode === "list" ? "bg-pink-500 text-white" : "text-muted-foreground hover:bg-pink-500/10"
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
            <span className="font-medium text-pink-600">
              {viewFilter === "offers" ? offersCount : 
               viewFilter === "products" ? productsCount : 
               allItems.length}
            </span>
            {viewFilter === "offers" ? (isArabic ? "عرض" : "offers") : 
             viewFilter === "products" ? (isArabic ? "منتج" : "products") :
             (isArabic ? "منتج" : "products")}
            {searchQuery && (
              <Badge className="bg-pink-500/10 text-pink-600 border-pink-300/30">
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
              <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
              {isArabic ? "جاري التحميل..." : "Loading..."}
            </div>
          )}
        </div>

        {/* ====== قائمة المنتجات ====== */}
        {displayListings.length === 0 && !isLoading ? (
          <div className="rounded-2xl bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm p-12 text-center border border-pink-300/20">
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
                className="mt-4 border-pink-300/30 text-pink-600 hover:bg-pink-500/10"
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

            {page < totalPages && (
              <div ref={loadMoreRef} className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isFetching}
                  className="rounded-xl border-pink-300/30 hover:bg-pink-500/10 text-pink-600"
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

            {page >= totalPages && allItems.length > limit && (
              <div className="flex justify-center mt-6 text-sm text-muted-foreground">
                {isArabic ? "🎉 تم تحميل جميع المنتجات" : "🎉 All products loaded"}
              </div>
            )}
          </>
        )}

        {allItems.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground border-t border-pink-300/20 pt-4">
            <span>
              {isArabic 
                ? `عرض ${displayListings.length} من ${viewFilter === "offers" ? offersCount : viewFilter === "products" ? productsCount : allItems.length} ${viewFilter === "offers" ? "عرض" : "منتج"}` 
                : `Showing ${displayListings.length} of ${viewFilter === "offers" ? offersCount : viewFilter === "products" ? productsCount : allItems.length} ${viewFilter === "offers" ? "offers" : "products"}`}
            </span>
            <span className="flex items-center gap-2">
              <Badge className="bg-pink-500/10 text-pink-600 border-pink-300/30">
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
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ====== دوال مساعدة ======

export function isStoreCurrentlyOpen(store: any): boolean {
  if (!store || store.store_online === false) return false;

  if (!store.store_opens_at || !store.store_closes_at) {
    return true;
  }

  try {
    const opens = store.store_opens_at.slice(0, 5);
    const closes = store.store_closes_at.slice(0, 5);

    if (!opens || !closes || opens.length < 5 || closes.length < 5) {
      return true;
    }

    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();

    const [oh, om] = opens.split(":").map(Number);
    const [ch, cm] = closes.split(":").map(Number);

    if (isNaN(oh) || isNaN(om) || isNaN(ch) || isNaN(cm)) {
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
    return true;
  }
}

function StoreStatusBadge({ store, lang }: { store: any; lang: "ar" | "en" }) {
  const open = isStoreCurrentlyOpen(store);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
      open 
        ? "bg-pink-500/15 text-pink-600 animate-pulse" 
        : "bg-muted text-muted-foreground"
    }`}>
      <span className={`h-2 w-2 rounded-full ${
        open ? "bg-pink-500 animate-pulse" : "bg-muted-foreground"
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
    <div className="rounded-xl bg-white dark:bg-[#1e293b] border border-pink-300/20 p-3 animate-pulse">
      <div className="aspect-square rounded-lg bg-pink-500/10" />
      <div className="h-4 bg-pink-500/10 rounded mt-3 w-3/4" />
      <div className="h-3 bg-pink-500/10 rounded mt-2 w-1/2" />
      <div className="flex items-center gap-2 mt-3">
        <div className="h-4 bg-pink-500/10 rounded w-1/3" />
        <div className="h-4 bg-pink-500/10 rounded w-1/4" />
      </div>
    </div>
  );
}