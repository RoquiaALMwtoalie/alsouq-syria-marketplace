import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useApp, aH as Skeleton, b as Button, B as Badge, k as formatPrice, c as cn, D as Dialog, g as DialogContent, q as DialogHeader, l as DialogTitle, m as DialogDescription, w as DialogFooter } from "./router-BU7AgYzK.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { H as Heart, i as ShoppingBag, g as Sparkles, Z as Zap, v as Trash2, c as Store, h as Star, a0 as MapPin, a8 as ShoppingCart, co as HeartOff, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
const RatingStars = ({ rating }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Star,
    {
      className: cn(
        "h-3.5 w-3.5 transition-all duration-300",
        star <= rating ? "fill-[#f9a8d4] text-[#f9a8d4]" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
      )
    },
    star
  )) });
};
function FavoritesPage() {
  const app = useApp();
  const navigate = useNavigate();
  const isRTL = app.lang === "ar";
  const [favorites, setFavorites] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [selectedItem, setSelectedItem] = reactExports.useState(null);
  const [showRemoveDialog, setShowRemoveDialog] = reactExports.useState(false);
  const [showEmptyDialog, setShowEmptyDialog] = reactExports.useState(false);
  const styles = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .animate-shimmer {
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    .animate-pulse-slow {
      animation: pulse-slow 2.5s ease-in-out infinite;
    }
    @keyframes heart-beat {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.15); }
      50% { transform: scale(0.95); }
      75% { transform: scale(1.05); }
    }
    .animate-heart-beat {
      animation: heart-beat 1.5s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .animate-bounce-slow {
      animation: bounce-slow 2s ease-in-out infinite;
    }
    @keyframes slide-up {
      0% { opacity: 0; transform: translateY(30px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-slide-up {
      animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `;
  const fetchFavorites = async () => {
    if (!app.user) {
      navigate({ to: "/auth/login" });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("favorites").select(`
          id,
          listing_id,
          created_at,
          listings:listing_id (
            id,
            title_ar,
            title_en,
            description_ar,
            description_en,
            price,
            price_usd,
            old_price,
            currency,
            cover_url,
            status,
            is_available,
            is_offer,
            discount_percent,
            rating,
            views,
            favorites_count,
            created_at,
            category_id,
            governorate_id,
            owner_id,
            delivery_method,
            payment_method,
            categories:category_id (
              name_ar,
              name_en,
              slug
            ),
            governorates:governorate_id (
              name_ar,
              name_en,
              slug
            ),
            listing_images (
              url,
              sort_order
            ),
            profile:owner_id (
              store_name,
              full_name,
              avatar_url,
              store_logo_url
            )
          )
        `).eq("user_id", app.user.id).order("created_at", { ascending: false });
      if (error) throw error;
      const validFavorites = (data || []).filter(
        (item) => item.listings !== null
      );
      setFavorites(validFavorites);
      const deletedCount = (data || []).length - validFavorites.length;
      if (deletedCount > 0) {
        toast.info(
          isRTL ? `⚠️ تم حذف ${deletedCount} منتج من المفضلة` : `⚠️ ${deletedCount} products were removed`,
          { duration: 3e3 }
        );
      }
    } catch (error) {
      console.error("❌ Error fetching favorites:", error);
      toast.error(
        isRTL ? "❌ فشل جلب المفضلة" : "❌ Failed to load favorites"
      );
    } finally {
      setIsLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchFavorites();
  }, [app.user]);
  const removeFromFavorites = async (favoriteId) => {
    try {
      const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
      if (error) throw error;
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
      setShowRemoveDialog(false);
      setSelectedItem(null);
      toast.success(
        isRTL ? "✅ تمت الإزالة من المفضلة" : "✅ Removed from favorites"
      );
    } catch (error) {
      console.error("❌ Error removing favorite:", error);
      toast.error(
        isRTL ? "❌ فشل الإزالة" : "❌ Failed to remove"
      );
    }
  };
  const clearAllFavorites = async () => {
    if (!app.user) return;
    try {
      const { error } = await supabase.from("favorites").delete().eq("user_id", app.user.id);
      if (error) throw error;
      setFavorites([]);
      setShowEmptyDialog(false);
      toast.success(
        isRTL ? "✅ تم تفريغ المفضلة" : "✅ Favorites cleared"
      );
    } catch (error) {
      console.error("❌ Error clearing favorites:", error);
      toast.error(
        isRTL ? "❌ فشل التفريغ" : "❌ Failed to clear"
      );
    }
  };
  const addToCart = (listing) => {
    if (!listing || !listing.id) {
      toast.error(
        isRTL ? "❌ بيانات المنتج غير مكتملة" : "❌ Product data incomplete"
      );
      return;
    }
    app.addToCart({
      id: listing.id,
      title: isRTL ? listing.title_ar : listing.title_en || listing.title_ar,
      price: listing.price,
      currency: listing.currency || "SYP",
      image: listing.cover_url || "/placeholder.png",
      quantity: 1
    });
    toast.success(
      isRTL ? "🛒 تمت الإضافة إلى السلة" : "🛒 Added to cart"
    );
  };
  const getProductTitle = (item) => {
    if (!item?.listings) {
      return isRTL ? "منتج غير متوفر" : "Product unavailable";
    }
    const listing = item.listings;
    return isRTL ? listing.title_ar : listing.title_en || listing.title_ar;
  };
  const getStoreName = (item) => {
    if (!item?.listings?.profile) {
      return isRTL ? "متجر" : "Store";
    }
    const profile = item.listings.profile;
    return profile.store_name || profile.full_name || (isRTL ? "متجر" : "Store");
  };
  const getProductImage = (item) => {
    if (!item?.listings) {
      return "/placeholder.png";
    }
    const listing = item.listings;
    if (listing.listing_images && listing.listing_images.length > 0) {
      return listing.listing_images[0].url;
    }
    return listing.cover_url || "/placeholder.png";
  };
  const getGovernorateName = (item) => {
    if (!item?.listings?.governorates) {
      return "";
    }
    const gov = item.listings.governorates;
    return isRTL ? gov.name_ar : gov.name_en || gov.name_ar;
  };
  const getAvailability = (item) => {
    if (!item?.listings) {
      return {
        isAvailable: false,
        text: isRTL ? "غير متوفر" : "Unavailable",
        color: "text-red-500"
      };
    }
    const isAvailable = item.listings.is_available !== false;
    return {
      isAvailable,
      text: isAvailable ? isRTL ? "متوفر" : "Available" : isRTL ? "غير متوفر" : "Unavailable",
      color: isAvailable ? "text-emerald-500" : "text-red-500"
    };
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-[#2a655f]/5 via-transparent to-[#3a8a82]/5 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: styles }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-56" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-40 mt-2" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-32 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6", children: [...Array(10)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl overflow-hidden border-2 border-pink-400/60 dark:border-pink-400/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-1/3" })
          ] })
        ] }, i)) })
      ] })
    ] });
  }
  if (favorites.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[80vh] bg-gradient-to-b from-[#2a655f]/5 via-transparent to-[#3a8a82]/5 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10 flex items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: styles }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto text-center px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#2a655f] to-[#3a8a82] rounded-full blur-3xl opacity-20 animate-pulse-slow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-32 w-32 rounded-full bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-14 w-14 text-pink-500 fill-pink-500 animate-heart-beat" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground mt-6", children: isRTL ? "💔 قائمة المفضلة فارغة" : "💔 Favorites is empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 leading-relaxed", children: isRTL ? "ابدأ بإضافة المنتجات التي تعجبك إلى قائمة المفضلة لتجدها بسهولة لاحقاً" : "Start adding products you like to your favorites list to find them easily later" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => navigate({ to: "/" }),
              className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white rounded-2xl px-8 py-6 text-base shadow-lg shadow-[#2a655f]/30 hover:shadow-[#2a655f]/50 transition-all hover:scale-105",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5 mr-2" }),
                isRTL ? "استكشف المنتجات" : "Explore Products"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => navigate({ to: "/categories" }),
              className: "rounded-2xl px-8 py-6 text-base border-2 border-pink-400/60 hover:border-pink-500 hover:bg-pink-500/10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 mr-2 text-pink-500" }),
                isRTL ? "تصفح التصنيفات" : "Browse Categories"
              ]
            }
          )
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-[#2a655f]/5 via-transparent to-[#3a8a82]/5 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: styles }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-2xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-6 w-6 text-pink-500 fill-pink-500 animate-heart-beat" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3", children: [
              isRTL ? "المفضلة" : "Favorites",
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
                isRTL ? "مباشر" : "Live"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2", children: [
              isRTL ? `${favorites.length} منتج في قائمتك` : `${favorites.length} products in your list`,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#f9a8d4]/50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-[#d81b60] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 animate-pulse" }),
                isRTL ? "تحديث لحظي" : "Real-time"
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => navigate({ to: "/" }),
              className: "rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/5 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 mr-1.5 text-[#2a655f]" }),
                isRTL ? "مواصلة التسوق" : "Continue Shopping"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setShowEmptyDialog(true),
              className: "rounded-xl border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/30 hover:border-red-300 transition-all duration-300 h-10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1.5" }),
                isRTL ? "تفريغ الكل" : "Clear All"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-8", children: [
        {
          icon: Heart,
          label: isRTL ? "إجمالي المفضلات" : "Total Favorites",
          value: favorites.length,
          gradient: "from-[#d81b60] to-[#f9a8d4]"
        },
        {
          icon: Store,
          label: isRTL ? "عدد المتاجر" : "Stores",
          value: new Set(favorites.map((f) => f.listings?.owner_id)).size,
          gradient: "from-[#2a655f] to-[#1a4f4a]"
        },
        {
          icon: ShoppingBag,
          label: isRTL ? "متوفر للشراء" : "Available",
          value: favorites.filter((f) => f.listings?.is_available !== false).length,
          gradient: "from-emerald-500 to-teal-500"
        },
        {
          icon: Star,
          label: isRTL ? "متوسط التقييم" : "Avg Rating",
          value: (favorites.reduce((acc, f) => acc + (f.listings?.rating || 0), 0) / favorites.length || 0).toFixed(1),
          gradient: "from-amber-500 to-orange-500"
        }
      ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: stat.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: stat.value })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-6 w-6 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "h-3.5 w-3.5 text-white" }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 animate-shimmer`,
                style: { width: `${Math.min(100, Number(stat.value) / (favorites.length || 1) * 100)}%` }
              }
            ) })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6", children: favorites.map((item, index) => {
        if (!item?.listings) return null;
        const listing = item.listings;
        const productTitle = getProductTitle(item);
        const storeName = getStoreName(item);
        const image = getProductImage(item);
        const governorateName = getGovernorateName(item);
        const { isAvailable, text: availabilityText, color: availabilityColor } = getAvailability(item);
        const isOffer = listing.is_offer === true;
        const discount = listing.discount_percent || 0;
        const price = listing.price || 0;
        const oldPrice = listing.old_price || 0;
        const rating = listing.rating || 0;
        const favoritesCount = listing.favorites_count || 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "group relative bg-white dark:bg-[#1e293b] rounded-2xl overflow-hidden border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] animate-slide-up",
            style: { animationDelay: `${index * 60}ms` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/listing/${listing.id}`, className: "block relative aspect-square overflow-hidden bg-[#2a655f]/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: image,
                    alt: productTitle,
                    className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
                    onError: (e) => {
                      e.target.src = "/placeholder.png";
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 flex flex-col gap-1.5 z-10", children: [
                  isOffer && discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#d81b60] to-[#f9a8d4] text-white border-2 border-white/30 shadow-lg rounded-full px-2.5 py-0.5 text-[10px] font-bold animate-pulse", children: [
                    "🔥 -",
                    discount,
                    "%"
                  ] }),
                  !isAvailable && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/90 text-white border-2 border-white/30 shadow-lg rounded-full px-2.5 py-0.5 text-[10px]", children: [
                    "❌ ",
                    isRTL ? "غير متوفر" : "Out of stock"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedItem(item);
                      setShowRemoveDialog(true);
                    },
                    className: "absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center shadow-lg hover:border-pink-500 hover:bg-pink-500/10 transition-all duration-300 hover:scale-110 z-10",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Heart,
                      {
                        className: "h-5 w-5 fill-pink-500 text-pink-500 animate-heart-beat"
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: `/store/${listing.owner_id}`,
                    className: "text-xs text-[#2a655f] dark:text-[#3a8a82] hover:text-pink-500 hover:underline flex items-center gap-1 font-bold transition-colors",
                    onClick: (e) => e.stopPropagation(),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3 text-[#2a655f] dark:text-[#3a8a82]" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: storeName })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/listing/${listing.id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-[#2a655f] transition-colors leading-snug", children: productTitle }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RatingStars, { rating }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-medium", children: [
                    "(",
                    favoritesCount,
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-[#2a655f] dark:text-[#3a8a82]", children: formatPrice(price, listing.currency || "SYP", app.lang) }),
                  isOffer && oldPrice > 0 && oldPrice > price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-[#d81b60] line-through font-medium", children: formatPrice(oldPrice, listing.currency || "SYP", app.lang) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t-2 border-[#2a655f]/10 dark:border-[#2a655f]/20", children: [
                  governorateName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-[#2a655f]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[70px] font-medium", children: governorateName })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-1.5 w-1.5 rounded-full animate-pulse", isAvailable ? "bg-emerald-500" : "bg-red-500") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-[10px] font-bold", availabilityColor), children: availabilityText })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pt-2 border-t-2 border-[#2a655f]/10 dark:border-[#2a655f]/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(listing);
                      },
                      disabled: !isAvailable,
                      className: "flex-1 rounded-xl text-[11px] font-bold h-8 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-md shadow-[#2a655f]/25 transition-all duration-300 hover:scale-[1.02] border-2 border-white/20",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3.5 w-3.5 mr-1" }),
                        isRTL ? "أضف للسلة" : "Add to Cart"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedItem(item);
                        setShowRemoveDialog(true);
                      },
                      className: "rounded-xl h-8 w-8 p-0 text-pink-500 hover:text-white hover:bg-pink-500 hover:scale-110 transition-all duration-300 border-2 border-pink-400/60 hover:border-pink-500",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] })
              ] })
            ]
          },
          item.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-5 w-5 text-pink-500 fill-pink-500 animate-heart-beat" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: isRTL ? `لديك ${favorites.length} منتج في قائمة المفضلة` : `You have ${favorites.length} products in your favorites list` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => navigate({ to: "/" }),
              className: "rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/5 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
              children: isRTL ? "مواصلة التسوق" : "Continue Shopping"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => setShowEmptyDialog(true),
              className: "rounded-xl bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/25 transition-all duration-300 hover:scale-105 border-2 border-white/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1.5" }),
                isRTL ? "تفريغ الكل" : "Clear All"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showRemoveDialog, onOpenChange: setShowRemoveDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl p-0 overflow-hidden bg-white dark:bg-[#1e293b]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-2xl bg-pink-500/10 border-2 border-pink-400/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeartOff, { className: "h-6 w-6 text-pink-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "إزالة من المفضلة" : "Remove from favorites" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 rounded-full hover:bg-[#2a655f]/10 border border-slate-200 dark:border-slate-700",
              onClick: () => setShowRemoveDialog(false),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-slate-500 dark:text-slate-400", children: isRTL ? `هل أنت متأكد من إزالة "${getProductTitle(selectedItem)}" من قائمتك؟` : `Are you sure you want to remove "${getProductTitle(selectedItem)}" from your list?` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-6 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setShowRemoveDialog(false),
            className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300 h-11",
            children: isRTL ? "إلغاء" : "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => selectedItem && removeFromFavorites(selectedItem.id),
            className: "flex-1 rounded-xl bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/25 transition-all duration-300 hover:scale-105 border-2 border-white/20 h-11",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1.5" }),
              isRTL ? "إزالة" : "Remove"
            ]
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showEmptyDialog, onOpenChange: setShowEmptyDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl p-0 overflow-hidden bg-white dark:bg-[#1e293b]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-2xl bg-red-500/10 border-2 border-red-400/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-6 w-6 text-red-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "تفريغ المفضلة" : "Clear favorites" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 rounded-full hover:bg-[#2a655f]/10 border border-slate-200 dark:border-slate-700",
              onClick: () => setShowEmptyDialog(false),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-slate-500 dark:text-slate-400", children: isRTL ? `هل أنت متأكد من إزالة جميع المنتجات (${favorites.length}) من قائمتك؟ هذا الإجراء لا يمكن التراجع عنه.` : `Are you sure you want to remove all (${favorites.length}) products from your list? This action cannot be undone.` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-6 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setShowEmptyDialog(false),
            className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300 h-11",
            children: isRTL ? "إلغاء" : "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: clearAllFavorites,
            className: "flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-600/25 transition-all duration-300 hover:scale-105 border-2 border-white/20 h-11",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1.5" }),
              isRTL ? "تأكيد التفريغ" : "Confirm Clear"
            ]
          }
        )
      ] })
    ] }) }) })
  ] });
}
const SplitComponent = FavoritesPage;
export {
  SplitComponent as component
};
