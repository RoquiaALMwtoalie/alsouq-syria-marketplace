// src/routes/store.$id.tsx - الكود المُصحّح بالكامل (زيتي + رمادي + كروت موحّدة + Infinite Scroll)

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef, Suspense, useMemo } from "react";
import { 
  Star, MessageCircle, Store as StoreIcon, Loader2, 
  Clock, MapPin, Globe, Building2, Truck,
  Sparkles, Package, Share2, Flame, BadgeCheck,
  Search, X, ArrowUpDown, Grid3X3, List, ChevronDown,
  RefreshCw, Eye, Heart, TrendingUp, Zap, Gift, Target, Award,
  LayoutGrid, Check, Tag, Filter, ChevronLeft
} from "lucide-react";
import { useApp, useT, formatPrice } from "@/lib/i18n";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import ListingCard from "@/components/ListingCard";
import { OptimizedImage } from "@/components/OptimizedImage";

// ============================================================
// 🎨 Brand Colors (زيتي)
// ============================================================
const OLIVE = "#2a655f";
const OLIVE_DARK = "#1a4f4a";
const OLIVE_LIGHT = "#3a8a82";

export const Route = createFileRoute("/store/$id")({
  component: StorePage,
  head: () => ({ meta: [{ title: "Store — Souqi" }] }),
});

// ============================================================
// ✅ SortDropdown
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
            ? "border-[#2a655f]/50 bg-[#2a655f]/5 shadow-lg shadow-[#2a655f]/20" 
            : "border-slate-300/60 bg-white dark:bg-slate-800 hover:border-[#2a655f]/50 hover:shadow-lg hover:shadow-[#2a655f]/10"
        )}
      >
        <IconComponent className={cn("h-4 w-4 transition-transform duration-300 group-hover:scale-110", selectedOption.color)} />
        <span className="flex-1 text-start truncate text-slate-700 dark:text-slate-300">{selectedOption.label}</span>
        <ChevronDown className={cn(
          "h-4 w-4 text-slate-400 transition-all duration-300 flex-shrink-0",
          isOpen ? 'rotate-180 text-[#2a655f]' : 'group-hover:text-[#2a655f]'
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-900/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                      ? "bg-[#2a655f]/10 text-[#2a655f] font-bold" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-[#2a655f]/5 hover:text-[#2a655f]"
                  )}
                >
                  <OptIcon className={cn("h-4 w-4", option.color)} />
                  <span className="flex-1 font-medium">{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-[#2a655f] animate-bounce" />
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  
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
  const [limit] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "price_asc" | "price_desc" | "rating">("recent");
  const [viewFilter, setViewFilter] = useState<"all" | "products" | "offers">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // ====== State نطاق السعر ======
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

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
    const listingsItems = rows.map((item: any) => ({
      ...item,
      is_offer: item.is_offer || false,
      is_promo_offer: false,
    }));
    
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

    let all = [...listingsItems, ...promoItems];

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

  // ✅ فلترة متقدمة (السعر، التقييم، التوفر، البحث)
  const items = useMemo(() => {
    let filtered = filteredByType;
    
    if (searchQuery && searchQuery.trim()) {
      const s = searchQuery.toLowerCase().trim();
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
    
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || 10000000;
    
    filtered = filtered.filter((r: any) => {
      const price = Number(r.price);
      return price >= min && price <= max;
    });
    
    if (showAvailableOnly) {
      filtered = filtered.filter((r: any) => r.is_available !== false);
    }
    
    return filtered;
  }, [filteredByType, searchQuery, minPrice, maxPrice, showAvailableOnly]);

  // ✅ عدد العروض
  const offersCount = useMemo(() => {
    return allItems.filter((item: any) => 
      item.is_offer === true || item.is_promo_offer === true
    ).length;
  }, [allItems]);

  // ✅ عدد المنتجات
  const productsCount = useMemo(() => {
    return allItems.filter((item: any) => 
      !item.is_offer && !item.is_promo_offer
    ).length;
  }, [allItems]);

  const displayListings = useMemo(() => {
    if (page === 1) return items;
    return items;
  }, [items, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy, viewFilter, minPrice, maxPrice, showAvailableOnly]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSortBy("recent");
    setViewFilter("all");
    setMinPrice(0);
    setMaxPrice(10000000);
    setShowAvailableOnly(false);
    setPage(1);
  }, []);

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

  // ============================================================
  // ✅✅✅ INFINITE SCROLL - IntersectionObserver
  // ============================================================
  useEffect(() => {
    // ✅ تنظيف الـ observer القديم
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // ✅ إذا وصلنا للنهاية أو لا توجد منتجات → لا داعي للمراقبة
    if (page >= totalPages || items.length === 0) {
      return;
    }

    // ✅ إنشاء observer جديد
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        // ✅ إذا ظهر sentinel في الشاشة + لا يوجد تحميل جارٍ → حمّل الصفحة التالية
        if (entry.isIntersecting && !isFetching && page < totalPages) {
          setPage(prev => prev + 1);
        }
      },
      {
        root: null,                    // ✅ viewport
        rootMargin: '400px',           // ✅ ابدأ التحميل قبل 400 بكسل من الوصول
        threshold: 0.01,               // ✅ يكفي ظهور 1%
      }
    );

    // ✅ راقب الـ sentinel
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    // ✅ تنظيف عند unmount أو تغيير dependencies
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [page, totalPages, isFetching, items.length]);

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
        <StoreIcon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
        <h2 className="text-2xl font-bold">{app.lang === "ar" ? "المتجر غير موجود" : "Store not found"}</h2>
        <Button className="mt-4 bg-[#2a655f] hover:bg-[#1a4f4a] text-white" onClick={() => navigate({ to: "/" })}>
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
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen">
      
      {/* ====== غلاف المتجر ====== */}
      <div className="relative h-48 md:h-72 bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] overflow-hidden">
        {store.store_cover_url && (
          <img 
            src={store.store_cover_url} 
            className="absolute inset-0 h-full w-full object-cover opacity-60" 
            alt={name}
            loading="eager"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e2a]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e2a]/60 to-transparent" />
        
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge className="bg-white/15 backdrop-blur-md text-white border-white/30 shadow-lg">
            <Sparkles className="h-3 w-3 mr-1" />
            {isArabic ? "متجر مميز" : "Featured Store"}
          </Badge>
        </div>
      </div>

      {/* ====== معلومات المتجر ====== */}
      <div className="mx-auto max-w-7xl px-4 -mt-16 relative z-10">
        <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-slate-900/10 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 border border-slate-200/80 dark:border-slate-700/80">
          
          {/* شعار المتجر */}
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl grid place-items-center text-white font-black text-3xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
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
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 px-2 py-0.5 text-[8px] shadow-lg">
                  <Flame className="h-2.5 w-2.5 inline mr-0.5" />
                  {isArabic ? "رائج" : "Trending"}
                </Badge>
              </div>
            )}
          </div>

          {/* تفاصيل المتجر */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{name}</h1>
              <StoreIcon className="h-5 w-5 text-[#2a655f]" />
              <StoreStatusBadge store={store} lang={app.lang} />
              {store.is_verified && (
                <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20">
                  <BadgeCheck className="h-3 w-3 mr-1" />
                  {isArabic ? "موثق" : "Verified"}
                </Badge>
              )}
            </div>
            
            {store.store_description && (
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{store.store_description}</p>
            )}
            
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1 text-[#2a655f] font-bold">
                <Star className="h-4 w-4 fill-current" />
                {Number(store.rating || 0).toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />
                {allItems.length} {t("products_tab")}
              </span>
              
              <span className="flex items-center gap-1 bg-[#2a655f]/10 px-2.5 py-0.5 rounded-full text-[#2a655f] text-xs font-bold">
                {storeType === "online" ? (
                  <>
                    <Globe className="h-3.5 w-3.5" />
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
                  <Clock className="h-3.5 w-3.5" />
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
                className="gap-2 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-xl transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 group"
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
              className="border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-[#2a655f]/50 hover:text-[#2a655f]"
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
              ? 'border-[#2a655f]/40 hover:border-[#2a655f]/60 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5' 
              : deliveryPrice.governorateMatch 
                ? 'border-slate-200 hover:border-[#2a655f]/40' 
                : 'border-amber-400/40 hover:border-amber-400/60'
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                    deliveryPrice.isFree 
                      ? "bg-[#2a655f]/20" 
                      : "bg-slate-100 dark:bg-slate-800"
                  )}>
                    <Truck className={cn(
                      "h-6 w-6 transition-all duration-500",
                      deliveryPrice.isFree 
                        ? "text-[#2a655f]" 
                        : "text-slate-600"
                    )} />
                  </div>
                  
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {deliveryPrice.isFree ? (
                        <>
                          <span className="text-[#2a655f] dark:text-[#3a8a82]">🚚 توصيل مجاني</span>
                          <Badge className="bg-[#2a655f]/20 text-[#2a655f] border-0 text-[9px] px-2 py-0.5">
                            {isArabic ? "🎉 عرض خاص" : "🎉 Special Offer"}
                          </Badge>
                        </>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-200">{isArabic ? "🚚 سعر التوصيل" : "🚚 Delivery Price"}</span>
                      )}
                      
                      <Badge className={cn(
                        "border-0 text-[9px] px-2 py-0.5",
                        deliveryPrice.governorateMatch 
                          ? 'bg-[#2a655f]/15 text-[#2a655f] dark:bg-[#2a655f]/30 dark:text-[#3a8a82]' 
                          : 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/30 dark:text-amber-400'
                      )}>
                        {deliveryPrice.governorateMatch 
                          ? (isArabic ? "📍 نفس المحافظة" : "📍 Same Governorate") 
                          : (isArabic ? "📍 محافظة مختلفة" : "📍 Different Governorate")}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{isArabic ? `المسافة: ${deliveryPrice.distance} كم` : `Distance: ${deliveryPrice.distance} km`}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-[#2a655f] font-medium">{deliveryPrice.companyName}</span>
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
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2a655f]/10 border border-[#2a655f]/20">
                          <Gift className="h-3 w-3 text-[#2a655f]" />
                          <span className="text-[10px] font-medium text-[#2a655f] dark:text-[#3a8a82]">
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
                    <Badge className="bg-[#2a655f]/20 text-[#2a655f] border-0 text-sm px-4 py-1.5 rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        {isArabic ? "🆓 مجاني" : "🆓 Free"}
                      </span>
                    </Badge>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-[#2a655f] dark:text-[#3a8a82]">
                        {deliveryPrice.price} SYP
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {!deliveryPrice.isFree && deliveryPrice.freeThreshold > 0 && deliveryPrice.remainingForFree > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/70">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-3.5 w-3.5 text-[#2a655f]" />
                      <span className="font-medium text-[#2a655f] dark:text-[#3a8a82]">
                        {isArabic ? "🎯 أضف منتجات بقيمة" : "🎯 Add items worth"}
                      </span>
                      <span className="font-bold text-[#2a655f] dark:text-[#3a8a82] text-xs">
                        {deliveryPrice.remainingForFree} SYP
                      </span>
                      <span className="text-[#2a655f]/70 dark:text-[#3a8a82]/70">
                        {isArabic ? "للحصول على توصيل مجاني" : "to get free delivery"}
                      </span>
                    </div>
                    <Badge className="bg-gradient-to-r from-[#2a655f]/20 to-[#3a8a82]/20 text-[#2a655f] dark:text-[#3a8a82] border-0 text-[9px] px-2 py-0.5">
                      <Gift className="h-2.5 w-2.5 inline mr-0.5" />
                      {isArabic ? "🎁 عرض" : "🎁 Offer"}
                    </Badge>
                  </div>
                  <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] rounded-full transition-all duration-1000 shadow-lg shadow-[#2a655f]/20"
                      style={{ 
                        width: `${Math.min(100, ((deliveryPrice.orderTotal || 0) / deliveryPrice.freeThreshold) * 100)}%` 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      {isArabic ? "📦 قيمة الطلب الحالية" : "📦 Current order value"}
                      <span className="font-bold text-[#2a655f] dark:text-[#3a8a82] mr-1">
                        {deliveryPrice.orderTotal || 0} SYP
                      </span>
                    </span>
                    <span className="text-slate-400">
                      {isArabic ? "الهدف" : "Target"} 
                      <span className="font-bold text-slate-900 dark:text-white mr-1">
                        {deliveryPrice.freeThreshold} SYP
                      </span>
                    </span>
                  </div>
                  
                  {deliveryPrice.remainingForFree > 0 && (
                    <div className="mt-2 p-2 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 rounded-lg border border-[#2a655f]/15 flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                      <p className="text-[10px] text-[#2a655f] dark:text-[#3a8a82] font-medium">
                        {isArabic 
                          ? `💡 أضف منتجات بقيمة ${deliveryPrice.remainingForFree} SYP إضافية وستحصل على توصيل مجاني! 🎉`
                          : `💡 Add ${deliveryPrice.remainingForFree} SYP more worth of products and get free delivery! 🎉`}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {deliveryPrice.isFree && deliveryPrice.freeThreshold > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/70">
                  <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 rounded-lg border border-[#2a655f]/15">
                    <Sparkles className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                    <p className="text-[10px] text-[#2a655f] dark:text-[#3a8a82] font-medium">
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
            <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400 group-focus-within:text-[#2a655f] transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={isArabic ? "🔍 بحث في المتجر..." : "🔍 Search in store..."}
              className="pl-9 pr-3 h-10 rounded-xl border-slate-300 bg-white dark:bg-slate-800 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 my-auto"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-[#2a655f] transition-colors" />
              </button>
            )}
          </div>

          {/* أزرار الفلتر والترتيب */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            
            {/* Toggle Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setViewFilter("all");
                  setPage(1);
                }}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5",
                  viewFilter === "all" 
                    ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-[#2a655f]/10 hover:text-[#2a655f]"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                {isArabic ? "الكل" : "All"}
                <Badge className={cn(
                  "text-[9px] px-1.5 py-0",
                  viewFilter === "all" 
                    ? "bg-white/20 text-white" 
                    : "bg-[#2a655f]/10 text-[#2a655f]"
                )}>
                  {allItems.length}
                </Badge>
              </button>
              
              <button
                onClick={() => {
                  setViewFilter("products");
                  setPage(1);
                }}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5",
                  viewFilter === "products" 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-blue-500/10 hover:text-blue-600"
                )}
              >
                <Package className="h-3.5 w-3.5" />
                {isArabic ? "منتجات" : "Products"}
                <Badge className={cn(
                  "text-[9px] px-1.5 py-0",
                  viewFilter === "products" 
                    ? "bg-white/20 text-white" 
                    : "bg-blue-500/10 text-blue-600"
                )}>
                  {productsCount}
                </Badge>
              </button>
              
              <button
                onClick={() => {
                  setViewFilter("offers");
                  setPage(1);
                }}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5",
                  viewFilter === "offers" 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-amber-500/10 hover:text-amber-600"
                )}
              >
                <Flame className="h-3.5 w-3.5" />
                {isArabic ? "عروض" : "Offers"}
                <Badge className={cn(
                  "text-[9px] px-1.5 py-0",
                  viewFilter === "offers" 
                    ? "bg-white/20 text-white" 
                    : "bg-amber-500/10 text-amber-600"
                )}>
                  {offersCount}
                </Badge>
              </button>
            </div>

            {/* ترتيب */}
            <SortDropdown
              value={sortBy}
              onChange={(val) => {
                setSortBy(val as any);
                setPage(1);
              }}
              lang={app.lang}
            />

            {/* تبديل العرض */}
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-300",
                  viewMode === "grid" ? "bg-[#2a655f] text-white" : "text-slate-400 hover:bg-[#2a655f]/10"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-300",
                  viewMode === "list" ? "bg-[#2a655f] text-white" : "text-slate-400 hover:bg-[#2a655f]/10"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ====== Sidebar Filters (Desktop) ====== */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-5 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {isArabic ? "فلاتر" : "Filters"}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-[#2a655f] hover:bg-[#2a655f]/10 rounded-xl"
                >
                  <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 hover:rotate-180" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* نطاق السعر */}
                <div>
                  <div className="font-semibold mb-2 text-sm text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    {isArabic ? "نطاق السعر" : "Price Range"}
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
                        placeholder={isArabic ? "الحد الأدنى" : "Min"}
                        className="h-10 rounded-xl px-3 border-slate-300 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
                        min={0}
                      />
                    </div>
                    <span className="text-slate-400 text-sm font-medium px-1">-</span>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        value={maxPrice === 10000000 ? "" : maxPrice}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 10000000 : Number(e.target.value);
                          setMaxPrice(val);
                          setPage(1);
                        }}
                        placeholder={isArabic ? "الحد الأعلى" : "Max"}
                        className="h-10 rounded-xl px-3 border-slate-300 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
                        min={0}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500">
                    <span>{minPrice === 0 ? "0" : formatPrice(minPrice, app.currency, app.lang)}</span>
                    <span className="text-[#2a655f] text-[8px]">●</span>
                    <span>{maxPrice === 10000000 ? (isArabic ? "غير محدود" : "Unlimited") : formatPrice(maxPrice, app.currency, app.lang)}</span>
                  </div>
                </div>

                {/* المتاحة فقط */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Checkbox 
                    checked={showAvailableOnly} 
                    onCheckedChange={(v) => setShowAvailableOnly(v as boolean)}
                    className="border-slate-300 data-[state=checked]:bg-[#2a655f] data-[state=checked]:border-[#2a655f]"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {isArabic ? "المنتجات المتاحة فقط" : "Available only"}
                  </span>
                </div>

                {/* زر إعادة تعيين */}
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="w-full rounded-xl border-slate-300 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 group"
                >
                  <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  {isArabic ? "إعادة تعيين" : "Reset"}
                </Button>
              </div>
            </div>
          </aside>

          {/* ====== Main Content ====== */}
          <div>
            
            {/* إحصائيات النتائج */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-bold text-[#2a655f]">
                  {items.length}
                </span>
                {isArabic ? "منتج" : "products"}
                {searchQuery && (
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20">
                    <Search className="h-3 w-3 mr-1" />
                    {searchQuery}
                  </Badge>
                )}
                {(minPrice > 0 || maxPrice < 10000000) && (
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-300/30">
                    <Tag className="h-3 w-3 mr-1" />
                    {formatPrice(minPrice, app.currency, app.lang)} - {maxPrice === 10000000 ? (isArabic ? "∞" : "∞") : formatPrice(maxPrice, app.currency, app.lang)}
                  </Badge>
                )}
                {showAvailableOnly && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300/30">
                    <Check className="h-3 w-3 mr-1" />
                    {isArabic ? "متاحة" : "Available"}
                  </Badge>
                )}
              </div>
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-[#2a655f]" />
                  {isArabic ? "جاري التحميل..." : "Loading..."}
                </div>
              )}
            </div>

            {/* قائمة المنتجات */}
            {items.length === 0 && !isLoading ? (
              <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-12 text-center border border-slate-200 dark:border-slate-700">
                <Package className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-900 dark:text-white">
                  {searchQuery
                    ? (isArabic ? "لا توجد منتجات تطابق البحث" : "No products match search")
                    : viewFilter === "offers"
                    ? (isArabic ? "لا توجد عروض حالياً" : "No offers available")
                    : (isArabic ? "لا توجد منتجات بعد" : "No products yet")}
                </p>
                {(searchQuery || viewFilter === "offers" || minPrice > 0 || maxPrice < 10000000 || showAvailableOnly) && (
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="mt-4 border-slate-300 text-[#2a655f] hover:bg-[#2a655f]/10"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    {isArabic ? "إعادة تعيين الفلتر" : "Reset filter"}
                  </Button>
                )}
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  /* ===== ✅ Grid View ===== */
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch auto-rows-fr">
                    {items.map((item: any, index: number) => (
                      <div 
                        key={item.id} 
                        className="animate-fade-up h-full flex"
                        style={{ animationDelay: `${(index % 10) * 50}ms` }}
                      >
                        <div className="w-full h-full">
                          <Suspense fallback={<ProductSkeleton />}>
                            <ListingCard item={item} viewMode="grid" />
                          </Suspense>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* ===== ✅ List View - مثل كرت السلة ===== */
             /* ===== ✅ List View - مبسّط وأنيق ===== */
/* ===== ✨ List View - تصميم احترافي ===== */
<div className="space-y-2.5">
  {items.map((item: any, index: number) => {
    const hasDiscount = item.is_offer === true || (item.discount_percent && item.discount_percent > 0);
    const hasPromo = item.is_promo_offer === true || item.has_promotional_offer === true;
    
    // ✅ التوجيه الذكي
    const linkTarget = hasPromo 
      ? { to: "/offer/$id", params: { id: item.id } } 
      : { to: "/listing/$id", params: { id: item.id } };
    
    return (
      <Link
        key={item.id}
        {...linkTarget}
        className="animate-fade-up group block relative bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/40 transition-all duration-300 overflow-hidden"
        style={{ animationDelay: `${(index % 10) * 40}ms` }}
      >
        {/* ✅ شريط زيتي على اليسار (يتحول للون الذهبي عند hover) */}
        <div className={cn(
          "absolute start-0 top-0 bottom-0 w-1 transition-all duration-300",
          hasPromo 
            ? "bg-gradient-to-b from-purple-500 to-indigo-500" 
            : hasDiscount 
              ? "bg-gradient-to-b from-[#2a655f] to-[#3a8a82]" 
              : "bg-transparent group-hover:bg-[#2a655f]/40"
        )} />

        <div className="flex gap-3.5 p-3 ps-4">
          
          {/* ===== الصورة (يمين) - 88×88 ===== */}
          <div className="relative h-[88px] w-[88px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/80 dark:border-slate-700/80 group-hover:scale-[1.02] transition-transform duration-500">
            <OptimizedImage
              src={item.cover_url || '/placeholder.png'}
              alt={item.title_ar || ''}
              width={88}
              height={88}
              quality={85}
              objectFit="cover"
              className="h-full w-full object-cover"
            />
            
            {/* Overlay خفيف عند hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* ===== التفاصيل (يسار) ===== */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            
            {/* ===== الصف العلوي: Badges ===== */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              {hasPromo && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  <Gift className="h-2.5 w-2.5" />
                  {isArabic ? "عرض ترويجي" : "Promo"}
                </span>
              )}
              {!hasPromo && hasDiscount && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  🔥 {isArabic ? `خصم ${item.discount_percent || 20}%` : `${item.discount_percent || 20}% OFF`}
                </span>
              )}
            </div>

            {/* ===== العنوان ===== */}
            <h3 className="font-bold text-[13px] text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors">
              {isArabic ? item.title_ar : (item.title_en || item.title_ar)}
            </h3>

            {/* ===== الصف السفلي: السعر + التقييم + سهم ===== */}
            <div className="flex items-end justify-between gap-2 mt-1.5">
              
              {/* السعر */}
              <div className="flex items-baseline gap-1.5 min-w-0">
                {hasDiscount && item.old_price && (
                  <span className="text-[10px] text-slate-400 line-through font-medium shrink-0">
                    {formatPrice(Number(item.old_price), app.currency, app.lang)}
                  </span>
                )}
                <span className="text-[15px] font-black text-[#2a655f] dark:text-[#3a8a82] tracking-tight">
                  {formatPrice(Number(item.price), app.currency, app.lang)}
                </span>
              </div>

              {/* التقييم + سهم */}
              <div className="flex items-center gap-2 shrink-0">
                {Number(item.rating || 0) > 0 && (
                  <div className="flex items-center gap-0.5 bg-amber-400/15 px-1.5 py-0.5 rounded-full">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                      {Number(item.rating).toFixed(1)}
                    </span>
                  </div>
                )}
                
                {/* زر دائري صغير */}
                <div className="h-7 w-7 rounded-full bg-[#2a655f]/10 group-hover:bg-[#2a655f] flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <ChevronLeft className="h-3.5 w-3.5 text-[#2a655f] group-hover:text-white transition-colors rtl:rotate-180" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  })}
</div>
                )}

                {/* ============================================================ */}
                {/* ✅✅✅ INFINITE SCROLL SENTINEL */}
                {/* ============================================================ */}
                {page < totalPages && (
                  <div 
                    ref={loadMoreRef} 
                    className="flex flex-col items-center justify-center py-10 mt-6 min-h-[100px]"
                  >
                    {isFetching ? (
                      <div className="flex flex-col items-center gap-3">
                        {/* ✅ Spinner احترافي */}
                        <div className="relative">
                          <div className="h-14 w-14 border-4 border-[#2a655f]/15 rounded-full" />
                          <div className="absolute inset-0 h-14 w-14 border-4 border-[#2a655f] border-t-transparent rounded-full animate-spin" />
                          <div className="absolute inset-0 h-14 w-14 flex items-center justify-center">
                            <Package className="h-5 w-5 text-[#2a655f] animate-pulse" />
                          </div>
                        </div>
                        
                        {/* ✅ نص التحميل */}
                        <span className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82]">
                          {isArabic ? "جاري تحميل المزيد..." : "Loading more..."}
                        </span>
                        
                        {/* ✅ تقدم التحميل */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-[#2a655f]">{items.length}</span>
                          <span>/</span>
                          <span>{totalCount || allItems.length}</span>
                          <span className="ms-1">{isArabic ? "منتج" : "products"}</span>
                        </div>
                      </div>
                    ) : (
                      // ✅ لم يبدأ التحميل بعد (placeholder صغير)
                      <div className="flex flex-col items-center gap-2 opacity-0">
                        <div className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                )}

                {/* ============================================================ */}
                {/* ✅✅✅ رسالة "تم تحميل جميع المنتجات" */}
                {/* ============================================================ */}
                {page >= totalPages && items.length > 0 && (
                  <div className="flex flex-col items-center gap-3 py-10 mt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#2a655f]/10 to-[#3a8a82]/10 flex items-center justify-center border-2 border-[#2a655f]/20">
                      <Check className="h-8 w-8 text-[#2a655f] dark:text-[#3a8a82]" />
                    </div>
                    <p className="text-base font-black text-[#2a655f] dark:text-[#3a8a82]">
                      {isArabic ? "🎉 تم تحميل جميع المنتجات" : "🎉 All products loaded"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {isArabic 
                        ? `عرض ${items.length} منتج في هذه القائمة` 
                        : `Showing ${items.length} products in this list`}
                    </p>
                  </div>
                )}
              </>
            )}

            {items.length > 0 && (
              <div className="mt-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-4">
                <span>
                  {isArabic 
                    ? `عرض ${items.length} من ${viewFilter === "offers" ? offersCount : viewFilter === "products" ? productsCount : allItems.length} ${viewFilter === "offers" ? "عرض" : "منتج"}` 
                    : `Showing ${items.length} of ${viewFilter === "offers" ? offersCount : viewFilter === "products" ? productsCount : allItems.length} ${viewFilter === "offers" ? "offers" : "products"}`}
                </span>
                <span className="flex items-center gap-2">
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20">
                    {isArabic ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
                  </Badge>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.5s ease-out forwards; }
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
        ? "bg-[#2a655f]/15 text-[#2a655f] dark:text-[#3a8a82]" 
        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
    }`}>
      <span className={`h-2 w-2 rounded-full ${
        open ? "bg-[#2a655f] animate-pulse" : "bg-slate-400"
      }`} />
      {open 
        ? (lang === "ar" ? "🟢 مفتوح الآن" : "🟢 Open now") 
        : (lang === "ar" ? "🔴 مغلق" : "🔴 Closed")}
    </span>
  );
}

// ============================================================
// ✅ SKELETON COMPONENT - موحّد الارتفاع
// ============================================================
function ProductSkeleton() {
  return (
    <div className="w-full h-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 animate-pulse flex flex-col">
      <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 w-full" />
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded mt-3 w-3/4" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded mt-2 w-1/2" />
      <div className="flex items-center gap-2 mt-auto pt-3">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
      </div>
    </div>
  );
}