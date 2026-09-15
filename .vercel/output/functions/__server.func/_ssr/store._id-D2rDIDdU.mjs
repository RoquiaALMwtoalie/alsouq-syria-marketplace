import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { bx as Route$7, u as useApp, a as useT, by as useStoreProfile, aL as useGetOrCreateConversation, ax as useDeliveryCompanies, bz as useCartTotal, p as useListings, bA as useProductOffers, aH as Skeleton, b as Button, B as Badge, c as cn, I as Input, k as formatPrice, av as Checkbox, aQ as ListingCard, O as OptimizedImage } from "./router-BU7AgYzK.mjs";
import { C as Card, c as CardContent } from "./card-C7XU6h8z.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { c as Store, g as Sparkles, F as Flame, cw as BadgeCheck, h as Star, P as Package, aa as Globe, B as Building2, b as Clock, a0 as MapPin, p as LoaderCircle, o as MessageCircle, S as Share2, m as Truck, G as Gift, bS as Target, aq as Award, q as Search, X, bN as LayoutGrid, z as Grid3x3, D as List, s as Funnel, R as RefreshCw, T as Tag, u as Check, a as ChevronLeft, x as ArrowUpDown, y as ChevronDown } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/zustand.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/react-intersection-observer.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
function SortDropdown({
  value,
  onChange,
  lang
}) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const dropdownRef = reactExports.useRef(null);
  const options = [{
    value: "recent",
    label: lang === "ar" ? "🕐 الأحدث" : "🕐 Recent",
    icon: Clock,
    color: "text-blue-500"
  }, {
    value: "popular",
    label: lang === "ar" ? "🔥 الأكثر رواجاً" : "🔥 Popular",
    icon: Flame,
    color: "text-orange-500"
  }, {
    value: "price_asc",
    label: lang === "ar" ? "💰 السعر: منخفض→مرتفع" : "💰 Price: Low→High",
    icon: ArrowUpDown,
    color: "text-emerald-500"
  }, {
    value: "price_desc",
    label: lang === "ar" ? "💰 السعر: مرتفع→منخفض" : "💰 Price: High→Low",
    icon: ArrowUpDown,
    color: "text-rose-500"
  }, {
    value: "rating",
    label: lang === "ar" ? "⭐ الأعلى تقييماً" : "⭐ Top Rated",
    icon: Star,
    color: "text-yellow-500"
  }];
  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const IconComponent = selectedOption.icon;
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsOpen(!isOpen), className: cn("flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all duration-300 min-w-[170px] group", isOpen ? "border-[#2a655f]/50 bg-[#2a655f]/5 shadow-lg shadow-[#2a655f]/20" : "border-slate-300/60 bg-white dark:bg-slate-800 hover:border-[#2a655f]/50 hover:shadow-lg hover:shadow-[#2a655f]/10"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { className: cn("h-4 w-4 transition-transform duration-300 group-hover:scale-110", selectedOption.color) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-start truncate text-slate-700 dark:text-slate-300", children: selectedOption.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("h-4 w-4 text-slate-400 transition-all duration-300 flex-shrink-0", isOpen ? "rotate-180 text-[#2a655f]" : "group-hover:text-[#2a655f]") })
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-900/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2", children: options.map((option) => {
      const isSelected = value === option.value;
      const OptIcon = option.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        onChange(option.value);
        setIsOpen(false);
      }, className: cn("w-full px-4 py-2.5 text-sm text-start flex items-center gap-3 transition-all duration-200", isSelected ? "bg-[#2a655f]/10 text-[#2a655f] font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-[#2a655f]/5 hover:text-[#2a655f]"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(OptIcon, { className: cn("h-4 w-4", option.color) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 font-medium", children: option.label }),
        isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#2a655f] animate-bounce" })
      ] }, option.value);
    }) }) })
  ] });
}
function StorePage() {
  const {
    id
  } = Route$7.useParams();
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [isOpeningConversation, setIsOpeningConversation] = reactExports.useState(false);
  const loadMoreRef = reactExports.useRef(null);
  const observerRef = reactExports.useRef(null);
  const [deliveryPrice, setDeliveryPrice] = reactExports.useState(null);
  const [deliveryLoading, setDeliveryLoading] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const [limit] = reactExports.useState(8);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [sortBy, setSortBy] = reactExports.useState("recent");
  const [viewFilter, setViewFilter] = reactExports.useState("all");
  const [viewMode, setViewMode] = reactExports.useState("grid");
  const [minPrice, setMinPrice] = reactExports.useState(0);
  const [maxPrice, setMaxPrice] = reactExports.useState(1e7);
  const [showAvailableOnly, setShowAvailableOnly] = reactExports.useState(false);
  const {
    data: store,
    isLoading: storeLoading
  } = useStoreProfile(id);
  const getOrCreateConversation = useGetOrCreateConversation();
  const {
    data: companies = []
  } = useDeliveryCompanies({
    active: true
  });
  const cartTotalForStore = useCartTotal(app.user?.id, id);
  const {
    data: listingsData,
    isLoading: listingsLoading,
    isFetching
  } = useListings({
    ownerId: id,
    sort: sortBy,
    page,
    limit,
    search: searchQuery || void 0
  });
  const {
    data: promoOffersRaw = [],
    isLoading: promoLoading
  } = useProductOffers({
    isActive: true,
    limit: 100,
    storeId: id
  });
  const promoOffers = reactExports.useMemo(() => {
    if (!promoOffersRaw || promoOffersRaw.length === 0) return [];
    const sorted = [...promoOffersRaw];
    switch (sortBy) {
      case "price_asc":
        sorted.sort((a, b) => {
          const priceA = a.products?.[0]?.price || 0;
          const priceB = b.products?.[0]?.price || 0;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        sorted.sort((a, b) => {
          const priceA = a.products?.[0]?.price || 0;
          const priceB = b.products?.[0]?.price || 0;
          return priceB - priceA;
        });
        break;
      case "recent":
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "rating":
        sorted.sort((a, b) => (b.products?.[0]?.rating || 0) - (a.products?.[0]?.rating || 0));
        break;
      case "popular":
      default:
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    return sorted;
  }, [promoOffersRaw, sortBy]);
  const rows = listingsData?.data || [];
  const totalCount = listingsData?.count || 0;
  const totalPages = listingsData?.totalPages || 1;
  const allItems = reactExports.useMemo(() => {
    const listingsItems = rows.map((item) => ({
      ...item,
      is_offer: item.is_offer || false,
      is_promo_offer: false
    }));
    const promoItems = promoOffers.map((offer) => {
      let mainProduct = null;
      if (Array.isArray(offer.products) && offer.products.length > 0) {
        mainProduct = offer.products.find((p) => p.id === offer.listing_id) || offer.products[0];
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
        result_variation_ids: offer.result_variation_ids || []
      };
    });
    let all = [...listingsItems, ...promoItems];
    if (sortBy === "price_asc") {
      all.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price_desc") {
      all.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "recent") {
      all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "rating") {
      all.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return all;
  }, [rows, promoOffers, app.lang, sortBy]);
  const filteredByType = reactExports.useMemo(() => {
    if (viewFilter === "all") return allItems;
    if (viewFilter === "products") {
      return allItems.filter((item) => !item.is_offer && !item.is_promo_offer);
    }
    if (viewFilter === "offers") {
      return allItems.filter((item) => item.is_offer === true || item.is_promo_offer === true);
    }
    return allItems;
  }, [allItems, viewFilter]);
  const items = reactExports.useMemo(() => {
    let filtered = filteredByType;
    if (searchQuery && searchQuery.trim()) {
      const s = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const titleAr = (item.title_ar || "").toLowerCase();
        const titleEn = (item.title_en || "").toLowerCase();
        const descAr = (item.description_ar || "").toLowerCase();
        const descEn = (item.description_en || "").toLowerCase();
        return titleAr.includes(s) || titleEn.includes(s) || descAr.includes(s) || descEn.includes(s);
      });
    }
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || 1e7;
    filtered = filtered.filter((r) => {
      const price = Number(r.price);
      return price >= min && price <= max;
    });
    if (showAvailableOnly) {
      filtered = filtered.filter((r) => r.is_available !== false);
    }
    return filtered;
  }, [filteredByType, searchQuery, minPrice, maxPrice, showAvailableOnly]);
  const offersCount = reactExports.useMemo(() => {
    return allItems.filter((item) => item.is_offer === true || item.is_promo_offer === true).length;
  }, [allItems]);
  const productsCount = reactExports.useMemo(() => {
    return allItems.filter((item) => !item.is_offer && !item.is_promo_offer).length;
  }, [allItems]);
  reactExports.useMemo(() => {
    if (page === 1) return items;
    return items;
  }, [items, page]);
  reactExports.useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy, viewFilter, minPrice, maxPrice, showAvailableOnly]);
  const resetFilters = reactExports.useCallback(() => {
    setSearchQuery("");
    setSortBy("recent");
    setViewFilter("all");
    setMinPrice(0);
    setMaxPrice(1e7);
    setShowAvailableOnly(false);
    setPage(1);
  }, []);
  const calculateDistance = reactExports.useCallback((lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return 0;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);
  const calculateDeliveryPrice = reactExports.useCallback((company, distanceInKm, orderTotal) => {
    const freeThreshold = company.free_delivery_threshold || 0;
    if (freeThreshold > 0 && orderTotal >= freeThreshold) {
      return 0;
    }
    const basePrice = company.base_price || 0;
    const pricePerKm = company.price_per_km || 0;
    let price = basePrice + distanceInKm * pricePerKm;
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
  reactExports.useEffect(() => {
    let isMounted = true;
    const calculateDelivery = async () => {
      if (!store || !app.user) return;
      setDeliveryLoading(true);
      try {
        const {
          data: userAddress,
          error: addressError
        } = await supabase.from("user_addresses").select("governorate_id, lat, lng, address_text").eq("user_id", app.user.id).eq("is_default", true).maybeSingle();
        if (addressError || !userAddress || !isMounted) {
          setDeliveryLoading(false);
          return;
        }
        let deliveryCompanyId = store.delivery_company_id;
        let selectedCompany = null;
        if (deliveryCompanyId) {
          const {
            data: company,
            error: companyError
          } = await supabase.from("delivery_companies").select("*").eq("id", deliveryCompanyId).eq("is_active", true).maybeSingle();
          if (!companyError && company) {
            selectedCompany = company;
          }
        }
        if (!selectedCompany) {
          const storeGovernorateId = store.governorate_id;
          const {
            data: companies2,
            error: companiesError
          } = await supabase.from("delivery_companies").select("*").eq("is_active", true);
          if (!companiesError && companies2) {
            const matchingCompanies = companies2.filter((c) => {
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
              selectedCompany = matchingCompanies.sort((a, b) => (a.base_price || 0) - (b.base_price || 0))[0];
            }
          }
        }
        if (!selectedCompany) {
          const {
            data: fallbackCompany,
            error: fallbackError
          } = await supabase.from("delivery_companies").select("*").eq("is_active", true).limit(1).maybeSingle();
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
          distance = calculateDistance(store.lat, store.lng, userAddress.lat, userAddress.lng);
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
            freeThreshold,
            remainingForFree,
            breakdown: {
              basePrice: selectedCompany.base_price || 0,
              pricePerKm: selectedCompany.price_per_km || 0,
              distanceCost: distance * (selectedCompany.price_per_km || 0),
              minFee: selectedCompany.min_delivery_fee || 0,
              maxFee: selectedCompany.max_delivery_fee || 999999,
              freeThreshold,
              sameGovernorate: store.governorate_id === userAddress.governorate_id,
              hasCoordinates: hasValidCoordinates
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
  reactExports.useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (page >= totalPages || items.length === 0) {
      return;
    }
    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isFetching && page < totalPages) {
        setPage((prev) => prev + 1);
      }
    }, {
      root: null,
      // ✅ viewport
      rootMargin: "400px",
      // ✅ ابدأ التحميل قبل 400 بكسل من الوصول
      threshold: 0.01
      // ✅ يكفي ظهور 1%
    });
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [page, totalPages, isFetching, items.length]);
  const handleMessage = async () => {
    if (!app.user) {
      navigate({
        to: "/auth/$mode",
        params: {
          mode: "login"
        }
      });
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
        otherUserId: id
      });
      navigate({
        to: "/messages/$userId",
        params: {
          userId: id
        },
        search: {
          cid: conversation.id
        },
        state: {
          fromStore: true,
          storeId: id,
          storeName: store.store_name || store.full_name
        }
      });
    } catch (error) {
      toast.error(app.lang === "ar" ? "فشل فتح المحادثة. حاول مرة أخرى" : "Failed to open conversation.");
    } finally {
      setIsOpeningConversation(false);
    }
  };
  if (storeLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-12 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 md:h-72 w-full rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 -mt-16 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-24 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
        ] })
      ] })
    ] });
  }
  if (!store) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-16 w-16 mx-auto mb-4 text-slate-300" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: app.lang === "ar" ? "المتجر غير موجود" : "Store not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 bg-[#2a655f] hover:bg-[#1a4f4a] text-white", onClick: () => navigate({
        to: "/"
      }), children: app.lang === "ar" ? "العودة للرئيسية" : "Back to home" })
    ] });
  }
  const name = store.store_name || store.full_name || (app.lang === "ar" ? "متجر" : "Store");
  const storeType = store.store_type || "online";
  const isArabic = app.lang === "ar";
  const isLoading = listingsLoading || isFetching || promoLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 md:h-72 bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] overflow-hidden", children: [
      store.store_cover_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: store.store_cover_url, className: "absolute inset-0 h-full w-full object-cover opacity-60", alt: name, loading: "eager", decoding: "async" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0d2e2a]/90 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0d2e2a]/60 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-white/15 backdrop-blur-md text-white border-white/30 shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 mr-1" }),
        isArabic ? "متجر مميز" : "Featured Store"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 -mt-16 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-slate-900/10 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 border border-slate-200/80 dark:border-slate-700/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl grid place-items-center text-white font-black text-3xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300", children: store.store_logo_url || store.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: store.store_logo_url || store.avatar_url, className: "h-full w-full object-cover", alt: name, loading: "lazy", decoding: "async" }) : name[0]?.toUpperCase() || "?" }),
        store.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 px-2 py-0.5 text-[8px] shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-2.5 w-2.5 inline mr-0.5" }),
          isArabic ? "رائج" : "Trending"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-black text-slate-900 dark:text-white", children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-[#2a655f]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StoreStatusBadge, { store, lang: app.lang }),
          store.is_verified && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3 w-3 mr-1" }),
            isArabic ? "موثق" : "Verified"
          ] })
        ] }),
        store.store_description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 dark:text-slate-400 mt-1 text-sm", children: store.store_description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600 dark:text-slate-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[#2a655f] font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-current" }),
            Number(store.rating || 0).toFixed(1)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
            allItems.length,
            " ",
            t("products_tab")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-1 bg-[#2a655f]/10 px-2.5 py-0.5 rounded-full text-[#2a655f] text-xs font-bold", children: storeType === "online" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5" }),
            isArabic ? "متجر إلكتروني" : "Online Store"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5" }),
            isArabic ? "متجر فعلي" : "Physical Store"
          ] }) }),
          (store.store_opens_at || store.store_closes_at) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
            (store.store_opens_at || "--:--").slice(0, 5),
            " — ",
            (store.store_closes_at || "--:--").slice(0, 5)
          ] }),
          store.store_address && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
            store.store_address
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 flex-shrink-0", children: [
        store.allows_messaging !== false && app.user?.id !== id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleMessage, disabled: isOpeningConversation, className: "gap-2 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-xl transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 group", children: [
          isOpeningConversation ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 group-hover:rotate-12 transition-transform" }),
          isArabic ? "مراسلة المتجر" : "Message Store"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => window.open(`/store/${id}`, "_blank"), className: "border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-[#2a655f]/50 hover:text-[#2a655f]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5 mr-1" }),
          isArabic ? "مشاركة" : "Share"
        ] })
      ] })
    ] }) }),
    app.user && deliveryPrice && !deliveryLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: cn("border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden", deliveryPrice.isFree ? "border-[#2a655f]/40 hover:border-[#2a655f]/60 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5" : deliveryPrice.governorateMatch ? "border-slate-200 hover:border-[#2a655f]/40" : "border-amber-400/40 hover:border-amber-400/60"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110", deliveryPrice.isFree ? "bg-[#2a655f]/20" : "bg-slate-100 dark:bg-slate-800"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: cn("h-6 w-6 transition-all duration-500", deliveryPrice.isFree ? "text-[#2a655f]" : "text-slate-600") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-sm flex items-center gap-2", children: [
              deliveryPrice.isFree ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] dark:text-[#3a8a82]", children: "🚚 توصيل مجاني" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/20 text-[#2a655f] border-0 text-[9px] px-2 py-0.5", children: isArabic ? "🎉 عرض خاص" : "🎉 Special Offer" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-700 dark:text-slate-200", children: isArabic ? "🚚 سعر التوصيل" : "🚚 Delivery Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("border-0 text-[9px] px-2 py-0.5", deliveryPrice.governorateMatch ? "bg-[#2a655f]/15 text-[#2a655f] dark:bg-[#2a655f]/30 dark:text-[#3a8a82]" : "bg-amber-500/15 text-amber-700 dark:bg-amber-500/30 dark:text-amber-400"), children: deliveryPrice.governorateMatch ? isArabic ? "📍 نفس المحافظة" : "📍 Same Governorate" : isArabic ? "📍 محافظة مختلفة" : "📍 Different Governorate" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? `المسافة: ${deliveryPrice.distance} كم` : `Distance: ${deliveryPrice.distance} km` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium", children: deliveryPrice.companyName }),
              deliveryPrice.breakdown?.hasCoordinates ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500/10 text-blue-600 border-0 text-[8px] px-1.5 py-0", children: [
                "📍 ",
                isArabic ? "موقع دقيق" : "Precise"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-amber-500/10 text-amber-600 border-0 text-[8px] px-1.5 py-0", children: [
                "📍 ",
                isArabic ? "تقديري" : "Estimated"
              ] })
            ] }),
            deliveryPrice.freeThreshold > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2a655f]/10 border border-[#2a655f]/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-3 w-3 text-[#2a655f]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? `🎯 توصيل مجاني للطلبات التي تتجاوز ${deliveryPrice.freeThreshold} SYP` : `🎯 Free delivery on orders over ${deliveryPrice.freeThreshold} SYP` })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: deliveryPrice.isFree ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/20 text-[#2a655f] border-0 text-sm px-4 py-1.5 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
          isArabic ? "🆓 مجاني" : "🆓 Free"
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold text-[#2a655f] dark:text-[#3a8a82]", children: [
          deliveryPrice.price,
          " SYP"
        ] }) }) })
      ] }),
      !deliveryPrice.isFree && deliveryPrice.freeThreshold > 0 && deliveryPrice.remainingForFree > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/70", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "🎯 أضف منتجات بقيمة" : "🎯 Add items worth" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#2a655f] dark:text-[#3a8a82] text-xs", children: [
              deliveryPrice.remainingForFree,
              " SYP"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]/70 dark:text-[#3a8a82]/70", children: isArabic ? "للحصول على توصيل مجاني" : "to get free delivery" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#2a655f]/20 to-[#3a8a82]/20 text-[#2a655f] dark:text-[#3a8a82] border-0 text-[9px] px-2 py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-2.5 w-2.5 inline mr-0.5" }),
            isArabic ? "🎁 عرض" : "🎁 Offer"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] rounded-full transition-all duration-1000 shadow-lg shadow-[#2a655f]/20", style: {
            width: `${Math.min(100, (deliveryPrice.orderTotal || 0) / deliveryPrice.freeThreshold * 100)}%`
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1 text-[10px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500 dark:text-slate-400", children: [
            isArabic ? "📦 قيمة الطلب الحالية" : "📦 Current order value",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#2a655f] dark:text-[#3a8a82] mr-1", children: [
              deliveryPrice.orderTotal || 0,
              " SYP"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
            isArabic ? "الهدف" : "Target",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-slate-900 dark:text-white mr-1", children: [
              deliveryPrice.freeThreshold,
              " SYP"
            ] })
          ] })
        ] }),
        deliveryPrice.remainingForFree > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-2 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 rounded-lg border border-[#2a655f]/15 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-[#2a655f] dark:text-[#3a8a82] font-medium", children: isArabic ? `💡 أضف منتجات بقيمة ${deliveryPrice.remainingForFree} SYP إضافية وستحصل على توصيل مجاني! 🎉` : `💡 Add ${deliveryPrice.remainingForFree} SYP more worth of products and get free delivery! 🎉` })
        ] })
      ] }),
      deliveryPrice.isFree && deliveryPrice.freeThreshold > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/70", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 rounded-lg border border-[#2a655f]/15", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-[#2a655f] dark:text-[#3a8a82] font-medium", children: isArabic ? `🎉 قيمة طلبك (${deliveryPrice.orderTotal || 0} SYP) تجاوزت الحد الأدنى (${deliveryPrice.freeThreshold} SYP) → توصيل مجاني!` : `🎉 Your order value (${deliveryPrice.orderTotal || 0} SYP) exceeded the minimum (${deliveryPrice.freeThreshold} SYP) → Free delivery!` })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-64 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-400 group-focus-within:text-[#2a655f] transition-colors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: searchQuery, onChange: (e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }, placeholder: isArabic ? "🔍 بحث في المتجر..." : "🔍 Search in store...", className: "pl-9 pr-3 h-10 rounded-xl border-slate-300 bg-white dark:bg-slate-800 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300" }),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearchQuery(""), className: "absolute inset-y-0 right-3 my-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-[#2a655f] transition-colors" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setViewFilter("all");
              setPage(1);
            }, className: cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5", viewFilter === "all" ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30" : "text-slate-600 dark:text-slate-400 hover:bg-[#2a655f]/10 hover:text-[#2a655f]"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-3.5 w-3.5" }),
              isArabic ? "الكل" : "All",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("text-[9px] px-1.5 py-0", viewFilter === "all" ? "bg-white/20 text-white" : "bg-[#2a655f]/10 text-[#2a655f]"), children: allItems.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setViewFilter("products");
              setPage(1);
            }, className: cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5", viewFilter === "products" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-600 dark:text-slate-400 hover:bg-blue-500/10 hover:text-blue-600"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
              isArabic ? "منتجات" : "Products",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("text-[9px] px-1.5 py-0", viewFilter === "products" ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-600"), children: productsCount })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setViewFilter("offers");
              setPage(1);
            }, className: cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5", viewFilter === "offers" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30" : "text-slate-600 dark:text-slate-400 hover:bg-amber-500/10 hover:text-amber-600"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5" }),
              isArabic ? "عروض" : "Offers",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("text-[9px] px-1.5 py-0", viewFilter === "offers" ? "bg-white/20 text-white" : "bg-amber-500/10 text-amber-600"), children: offersCount })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortDropdown, { value: sortBy, onChange: (val) => {
            setSortBy(val);
            setPage(1);
          }, lang: app.lang }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewMode("grid"), className: cn("p-1.5 rounded-lg transition-all duration-300", viewMode === "grid" ? "bg-[#2a655f] text-white" : "text-slate-400 hover:bg-[#2a655f]/10"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewMode("list"), className: cn("p-1.5 rounded-lg transition-all duration-300", viewMode === "list" ? "bg-[#2a655f] text-white" : "text-slate-400 hover:bg-[#2a655f]/10"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-4 w-4" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[280px_1fr] gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-32 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-5 shadow-xl shadow-slate-900/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4" }),
              isArabic ? "فلاتر" : "Filters"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: resetFilters, className: "text-[#2a655f] hover:bg-[#2a655f]/10 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 transition-transform duration-500 hover:rotate-180" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold mb-2 text-sm text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4" }),
                isArabic ? "نطاق السعر" : "Price Range"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: minPrice === 0 ? "" : minPrice, onChange: (e) => {
                  const val = e.target.value === "" ? 0 : Number(e.target.value);
                  setMinPrice(val);
                  setPage(1);
                }, placeholder: isArabic ? "الحد الأدنى" : "Min", className: "h-10 rounded-xl px-3 border-slate-300 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300", min: 0 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-sm font-medium px-1", children: "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: maxPrice === 1e7 ? "" : maxPrice, onChange: (e) => {
                  const val = e.target.value === "" ? 1e7 : Number(e.target.value);
                  setMaxPrice(val);
                  setPage(1);
                }, placeholder: isArabic ? "الحد الأعلى" : "Max", className: "h-10 rounded-xl px-3 border-slate-300 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300", min: 0 }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1.5 text-[10px] text-slate-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: minPrice === 0 ? "0" : formatPrice(minPrice, app.currency, app.lang) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] text-[8px]", children: "●" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: maxPrice === 1e7 ? isArabic ? "غير محدود" : "Unlimited" : formatPrice(maxPrice, app.currency, app.lang) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: showAvailableOnly, onCheckedChange: (v) => setShowAvailableOnly(v), className: "border-slate-300 data-[state=checked]:bg-[#2a655f] data-[state=checked]:border-[#2a655f]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-700 dark:text-slate-300 font-medium", children: isArabic ? "المنتجات المتاحة فقط" : "Available only" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: resetFilters, className: "w-full rounded-xl border-slate-300 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" }),
              isArabic ? "إعادة تعيين" : "Reset"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#2a655f]", children: items.length }),
              isArabic ? "منتج" : "products",
              searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 mr-1" }),
                searchQuery
              ] }),
              (minPrice > 0 || maxPrice < 1e7) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500/10 text-blue-600 border-blue-300/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3 w-3 mr-1" }),
                formatPrice(minPrice, app.currency, app.lang),
                " - ",
                maxPrice === 1e7 ? isArabic ? "∞" : "∞" : formatPrice(maxPrice, app.currency, app.lang)
              ] }),
              showAvailableOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 border-emerald-300/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 mr-1" }),
                isArabic ? "متاحة" : "Available"
              ] })
            ] }),
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-[#2a655f]" }),
              isArabic ? "جاري التحميل..." : "Loading..."
            ] })
          ] }),
          items.length === 0 && !isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-12 text-center border border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-16 w-16 mx-auto mb-4 text-slate-300" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-slate-900 dark:text-white", children: searchQuery ? isArabic ? "لا توجد منتجات تطابق البحث" : "No products match search" : viewFilter === "offers" ? isArabic ? "لا توجد عروض حالياً" : "No offers available" : isArabic ? "لا توجد منتجات بعد" : "No products yet" }),
            (searchQuery || viewFilter === "offers" || minPrice > 0 || maxPrice < 1e7 || showAvailableOnly) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: resetFilters, className: "mt-4 border-slate-300 text-[#2a655f] hover:bg-[#2a655f]/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-1" }),
              isArabic ? "إعادة تعيين الفلتر" : "Reset filter"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            viewMode === "grid" ? (
              /* ===== ✅ Grid View ===== */
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch auto-rows-fr", children: items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-up h-full flex", style: {
                animationDelay: `${index % 10 * 50}ms`
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCard, { item, viewMode: "grid" }) }) }) }, item.id)) })
            ) : (
              /* ===== ✅ List View - مثل كرت السلة ===== */
              /* ===== ✅ List View - مبسّط وأنيق ===== */
              /* ===== ✨ List View - تصميم احترافي ===== */
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: items.map((item, index) => {
                const hasDiscount = item.is_offer === true || item.discount_percent && item.discount_percent > 0;
                const hasPromo = item.is_promo_offer === true || item.has_promotional_offer === true;
                const linkTarget = hasPromo ? {
                  to: "/offer/$id",
                  params: {
                    id: item.id
                  }
                } : {
                  to: "/listing/$id",
                  params: {
                    id: item.id
                  }
                };
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { ...linkTarget, className: "animate-fade-up group block relative bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/40 transition-all duration-300 overflow-hidden", style: {
                  animationDelay: `${index % 10 * 40}ms`
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("absolute start-0 top-0 bottom-0 w-1 transition-all duration-300", hasPromo ? "bg-gradient-to-b from-purple-500 to-indigo-500" : hasDiscount ? "bg-gradient-to-b from-[#2a655f] to-[#3a8a82]" : "bg-transparent group-hover:bg-[#2a655f]/40") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3.5 p-3 ps-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[88px] w-[88px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/80 dark:border-slate-700/80 group-hover:scale-[1.02] transition-transform duration-500", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(OptimizedImage, { src: item.cover_url || "/placeholder.png", alt: item.title_ar || "", width: 88, height: 88, quality: 85, objectFit: "cover", className: "h-full w-full object-cover" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-between py-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap mb-1", children: [
                        hasPromo && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-2.5 w-2.5" }),
                          isArabic ? "عرض ترويجي" : "Promo"
                        ] }),
                        !hasPromo && hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm", children: [
                          "🔥 ",
                          isArabic ? `خصم ${item.discount_percent || 20}%` : `${item.discount_percent || 20}% OFF`
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-[13px] text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors", children: isArabic ? item.title_ar : item.title_en || item.title_ar }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-2 mt-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5 min-w-0", children: [
                          hasDiscount && item.old_price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 line-through font-medium shrink-0", children: formatPrice(Number(item.old_price), app.currency, app.lang) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[15px] font-black text-[#2a655f] dark:text-[#3a8a82] tracking-tight", children: formatPrice(Number(item.price), app.currency, app.lang) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                          Number(item.rating || 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 bg-amber-400/15 px-1.5 py-0.5 rounded-full", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5 fill-amber-400 text-amber-400" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-amber-700 dark:text-amber-400", children: Number(item.rating).toFixed(1) })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-full bg-[#2a655f]/10 group-hover:bg-[#2a655f] flex items-center justify-center transition-all duration-300 group-hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3.5 w-3.5 text-[#2a655f] group-hover:text-white transition-colors rtl:rotate-180" }) })
                        ] })
                      ] })
                    ] })
                  ] })
                ] }, item.id);
              }) })
            ),
            page < totalPages && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: loadMoreRef, className: "flex flex-col items-center justify-center py-10 mt-6 min-h-[100px]", children: isFetching ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 border-4 border-[#2a655f]/15 rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 h-14 w-14 border-4 border-[#2a655f] border-t-transparent rounded-full animate-spin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 h-14 w-14 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-[#2a655f] animate-pulse" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "جاري تحميل المزيد..." : "Loading more..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#2a655f]", children: items.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: totalCount || allItems.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-1", children: isArabic ? "منتج" : "products" })
              ] })
            ] }) : (
              // ✅ لم يبدأ التحميل بعد (placeholder صغير)
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-2 opacity-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8" }) })
            ) }),
            page >= totalPages && items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 py-10 mt-6 border-t border-slate-200 dark:border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-gradient-to-br from-[#2a655f]/10 to-[#3a8a82]/10 flex items-center justify-center border-2 border-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-8 w-8 text-[#2a655f] dark:text-[#3a8a82]" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-black text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "🎉 تم تحميل جميع المنتجات" : "🎉 All products loaded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 font-medium", children: isArabic ? `عرض ${items.length} منتج في هذه القائمة` : `Showing ${items.length} products in this list` })
            ] })
          ] }),
          items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? `عرض ${items.length} من ${viewFilter === "offers" ? offersCount : viewFilter === "products" ? productsCount : allItems.length} ${viewFilter === "offers" ? "عرض" : "منتج"}` : `Showing ${items.length} of ${viewFilter === "offers" ? offersCount : viewFilter === "products" ? productsCount : allItems.length} ${viewFilter === "offers" ? "offers" : "products"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20", children: isArabic ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}` }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
      ` })
  ] });
}
function isStoreCurrentlyOpen(store) {
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
    const now = /* @__PURE__ */ new Date();
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
function StoreStatusBadge({
  store,
  lang
}) {
  const open = isStoreCurrentlyOpen(store);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${open ? "bg-[#2a655f]/15 text-[#2a655f] dark:text-[#3a8a82]" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-2 w-2 rounded-full ${open ? "bg-[#2a655f] animate-pulse" : "bg-slate-400"}` }),
    open ? lang === "ar" ? "🟢 مفتوح الآن" : "🟢 Open now" : lang === "ar" ? "🔴 مغلق" : "🔴 Closed"
  ] });
}
function ProductSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 animate-pulse flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-slate-100 dark:bg-slate-800 rounded mt-3 w-3/4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-slate-100 dark:bg-slate-800 rounded mt-2 w-1/2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-auto pt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4" })
    ] })
  ] });
}
export {
  StorePage as component,
  isStoreCurrentlyOpen
};
