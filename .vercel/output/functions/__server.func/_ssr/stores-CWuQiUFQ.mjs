import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, a as useT, aE as useAllStores, ax as useDeliveryCompanies, B as Badge, I as Input, c as cn, aH as Skeleton, b as Button, O as OptimizedImage } from "./router-BU7AgYzK.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { A as ArrowLeft, q as Search, X, g as Sparkles, s as Funnel, c as Store, o as MessageCircle, a0 as MapPin, b as Clock, h as Star, P as Package, m as Truck } from "../_libs/lucide-react.mjs";
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
function StoresPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [userGovernorate, setUserGovernorate] = reactExports.useState(null);
  const [userAddress, setUserAddress] = reactExports.useState(null);
  const [deliveryPrices, setDeliveryPrices] = reactExports.useState({});
  const [loadingDeliveries, setLoadingDeliveries] = reactExports.useState({});
  const {
    data: allStores = [],
    isLoading
  } = useAllStores(100);
  const {
    data: companies = []
  } = useDeliveryCompanies({
    active: true
  });
  reactExports.useEffect(() => {
    const fetchUserData = async () => {
      if (!app.user) return;
      const {
        data: address
      } = await supabase.from("user_addresses").select("governorate_id, lat, lng").eq("user_id", app.user.id).eq("is_default", true).maybeSingle();
      if (address) {
        if (address.governorate_id) {
          const {
            data: gov
          } = await supabase.from("governorates").select("name_ar").eq("id", address.governorate_id).maybeSingle();
          setUserGovernorate(gov?.name_ar || null);
        }
        if (address.lat && address.lng) {
          setUserAddress({
            lat: address.lat,
            lng: address.lng
          });
        }
      }
    };
    fetchUserData();
  }, [app.user]);
  reactExports.useEffect(() => {
    const calculateAllDeliveries = async () => {
      if (!allStores.length || !companies.length || !app.user) return;
      const prices = {};
      for (const store of allStores) {
        if (!userAddress) {
          prices[store.id] = {
            price: null,
            isFree: false,
            distance: 0,
            companyName: "",
            sameGovernorate: false
          };
          continue;
        }
        const storeLat = store.lat;
        const storeLng = store.lng;
        const storeGovernorate = store.governorate_name || store.governorate?.name_ar;
        let matchingCompany = null;
        if (storeGovernorate) {
          matchingCompany = companies.find((c) => c.governorate?.name_ar === storeGovernorate && c.is_active === true);
        }
        if (!matchingCompany) {
          matchingCompany = companies.find((c) => c.is_active === true);
        }
        if (!matchingCompany) {
          prices[store.id] = {
            price: null,
            isFree: false,
            distance: 0,
            companyName: "",
            sameGovernorate: false
          };
          continue;
        }
        let distance = 0;
        const sameGovernorate = userGovernorate === storeGovernorate;
        if (storeLat && storeLng && userAddress.lat && userAddress.lng) {
          distance = calculateDistance(storeLat, storeLng, userAddress.lat, userAddress.lng);
        } else {
          distance = sameGovernorate ? 5 : 15;
        }
        let price = (matchingCompany.base_price || 0) + distance * (matchingCompany.price_per_km || 0);
        price = Math.max(price, matchingCompany.min_delivery_fee || 0);
        price = Math.min(price, matchingCompany.max_delivery_fee || 999999);
        price = Math.round(price);
        const isFree = price === 0;
        prices[store.id] = {
          price,
          isFree,
          distance: Math.round(distance * 100) / 100,
          companyName: matchingCompany.name_ar,
          sameGovernorate
        };
      }
      setDeliveryPrices(prices);
    };
    calculateAllDeliveries();
  }, [allStores, companies, app.user, userGovernorate, userAddress]);
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  const filteredStores = reactExports.useMemo(() => {
    let result = allStores;
    if (filterType === "online") {
      result = result.filter((s) => s.store_type === "online");
    } else if (filterType === "physical") {
      result = result.filter((s) => s.store_type === "physical");
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s) => {
        const name = (s.store_name || s.full_name || "").toLowerCase();
        const desc = (s.store_description || "").toLowerCase();
        const address = (s.store_address || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || address.includes(q);
      });
    }
    return result;
  }, [allStores, searchQuery, filterType]);
  const searchStats = {
    total: allStores.length,
    filtered: filteredStores.length,
    hasResults: filteredStores.length > 0
  };
  const suggestions = reactExports.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    const matched = allStores.filter((s) => {
      const name = (s.store_name || s.full_name || "").toLowerCase();
      return name.includes(q) && !filteredStores.includes(s);
    }).slice(0, 5);
    return matched;
  }, [allStores, searchQuery, filteredStores]);
  const goToChat = (e, storeId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!app.user) {
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }
    navigate({
      to: "/messages/$userId",
      params: {
        userId: storeId
      }
    });
  };
  const renderDeliveryPrice = (storeId) => {
    const delivery = deliveryPrices[storeId];
    if (!delivery) return null;
    if (delivery.price === null) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 dark:text-slate-400", children: app.lang === "ar" ? "غير متاح" : "N/A" });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      delivery.isFree ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/20 text-[#2a655f] border-0 text-[9px] px-1.5 py-0 font-bold", children: app.lang === "ar" ? "✅ مجاني" : "✅ Free" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82]", children: [
        delivery.price,
        " SYP"
      ] }),
      !delivery.sameGovernorate && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-amber-500", children: "⚠️" })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#2a655f] transition-colors mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 rtl:rotate-180" }),
        app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: app.lang === "ar" ? "🏪 جميع المتاجر" : "🏪 All Stores" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/15 text-[#2a655f] dark:bg-[#2a655f]/30 dark:text-[#3a8a82] border-0 text-sm px-3 py-1 font-bold", children: searchStats.filtered })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: searchQuery.trim() ? app.lang === "ar" ? `نتائج البحث عن "${searchQuery}" (${searchStats.filtered} متجر)` : `Results for "${searchQuery}" (${searchStats.filtered} stores)` : app.lang === "ar" ? `عرض جميع المتاجر (${searchStats.total})` : `Showing all stores (${searchStats.total})` })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-5 w-5 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: app.lang === "ar" ? "🔍 ابحث عن متجر..." : "🔍 Search for store...", className: "ps-12 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#2a655f] focus:ring-4 focus:ring-[#2a655f]/10 transition-all text-lg", autoFocus: true }),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearchQuery(""), className: "absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
      ] }),
      searchQuery.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: app.lang === "ar" ? `⚡ بحث فوري: ${searchStats.filtered} نتيجة` : `⚡ Live search: ${searchStats.filtered} results` }),
        searchStats.filtered === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: app.lang === "ar" ? "⚠️ لا توجد نتائج" : "⚠️ No results" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-[#2a655f]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-500 dark:text-slate-400", children: app.lang === "ar" ? "تصفية:" : "Filter:" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [{
        value: "all",
        label: app.lang === "ar" ? "الكل" : "All"
      }, {
        value: "online",
        label: app.lang === "ar" ? "🌐 اونلاين" : "🌐 Online"
      }, {
        value: "physical",
        label: app.lang === "ar" ? "🏪 متجر حقيقي" : "🏪 Physical"
      }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilterType(f.value), className: cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all", filterType === f.value ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-md shadow-[#2a655f]/25" : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-[#2a655f]"), children: f.label }, f.value)) })
    ] }),
    suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mb-2", children: app.lang === "ar" ? "💡 اقتراحات:" : "💡 Suggestions:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/store/$id", params: {
        id: s.id
      }, className: "px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-sm hover:bg-[#2a655f]/10 transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:border-[#2a655f]/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
        s.store_name || s.full_name
      ] }, s.id)) })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: Array.from({
      length: 8
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" }, i)) }) : filteredStores.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl mb-4", children: "🔍" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: app.lang === "ar" ? "لا توجد نتائج" : "No results found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto", children: app.lang === "ar" ? `لم نعثر على متاجر تطابق "${searchQuery}"` : `No stores match "${searchQuery}"` }),
      searchQuery.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "mt-4 rounded-xl border-slate-300 text-[#2a655f] hover:bg-[#2a655f]/10", onClick: () => setSearchQuery(""), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-2" }),
        app.lang === "ar" ? "مسح البحث" : "Clear search"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: filteredStores.map((s) => {
      const allowsMessaging = s.allows_messaging !== false;
      const storeType = s.store_type || "online";
      const address = s.store_address || "";
      const opensAt = s.store_opens_at || "";
      const closesAt = s.store_closes_at || "";
      const offDays = s.weekly_off_days || [];
      const delivery = deliveryPrices[s.id];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/store/$id", params: {
        id: s.id
      }, className: "group rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/40 hover:shadow-xl transition-all hover:-translate-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-28 bg-gradient-to-br from-[#2a655f] to-[#1a4f4a]", children: [
          s.store_cover_url && /* @__PURE__ */ jsxRuntimeExports.jsx(OptimizedImage, { src: s.store_cover_url, alt: s.store_name || "Store", width: 400, height: 150, quality: 80, objectFit: "cover", className: "absolute inset-0 h-full w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 end-2 flex gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-black/50 backdrop-blur text-white border-0 text-[10px]", children: storeType === "physical" ? "🏪" : "🌐" }) }),
          allowsMessaging && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => goToChat(e, s.id), className: "absolute bottom-2 end-2 p-2.5 rounded-full bg-white/95 hover:bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 group/chat", title: app.lang === "ar" ? "مراسلة المتجر" : "Message store", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-[#2a655f] group-hover/chat:text-[#1a4f4a]" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 -mt-8 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-md overflow-hidden grid place-items-center text-[#2a655f] font-black text-xl", children: s.store_logo_url || s.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(OptimizedImage, { src: s.store_logo_url || s.avatar_url, alt: s.store_name || "Store", width: 60, height: 60, quality: 85, objectFit: "cover", className: "h-full w-full" }) : (s.store_name || s.full_name || "?")[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 font-bold line-clamp-1 text-lg group-hover:text-[#2a655f] transition text-slate-900 dark:text-white", children: s.store_name || s.full_name || (app.lang === "ar" ? "متجر" : "Store") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-8", children: s.store_description || (app.lang === "ar" ? "متجر على ذوق" : "A store on Zooq") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400", children: [
            storeType === "physical" && address && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-2.5 w-2.5 text-[#2a655f]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[80px]", children: address })
            ] }),
            (opensAt || closesAt) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5 text-[#2a655f]" }),
              opensAt.slice(0, 5),
              "-",
              closesAt.slice(0, 5)
            ] }),
            offDays.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📅" }),
              offDays.length > 2 ? `${offDays.length} ${app.lang === "ar" ? "أيام" : "days"}` : offDays.map((d) => d.slice(0, 3)).join(",")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[#2a655f] font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-current" }),
                Number(s.avg_rating ?? 0).toFixed(1)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500 dark:text-slate-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5 inline mr-1" }),
                s.listing_count ?? 0,
                " ",
                t("products_tab")
              ] })
            ] }),
            delivery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-[#2a655f]/10 px-2 py-0.5 rounded-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3 text-[#2a655f]" }),
              renderDeliveryPrice(s.id)
            ] })
          ] })
        ] })
      ] }, s.id);
    }) })
  ] }) });
}
export {
  StoresPage as component
};
