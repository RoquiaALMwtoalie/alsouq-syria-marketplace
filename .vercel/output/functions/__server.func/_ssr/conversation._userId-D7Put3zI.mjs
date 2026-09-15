import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useLocation, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { bF as Route$2, u as useApp, bv as useUserStatus, aM as useConversationStore, b as Button, P as Avatar, U as AvatarFallback, c as cn, B as Badge } from "./router-BU7AgYzK.mjs";
import { a as ChatMessages } from "./ChatMessages-oq_48zFM.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { p as LoaderCircle, C as ChevronRight, E as EllipsisVertical, l as Crown, B as Building2, c as Store, m as Truck, U as User } from "../_libs/lucide-react.mjs";
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
import "./popover-CtuXcnOY.mjs";
import "../_libs/radix-ui__react-popover.mjs";
function DistributorConversationPage() {
  const {
    userId
  } = Route$2.useParams();
  const location = useLocation();
  const app = useApp();
  const navigate = useNavigate();
  const [otherUser, setOtherUser] = reactExports.useState(null);
  const [otherUserRoles, setOtherUserRoles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [conversationId, setConversationId] = reactExports.useState(null);
  const {
    data: userStatus
  } = useUserStatus(userId);
  const isOnline = userStatus?.is_online || false;
  const lastSeen = userStatus?.last_seen_at || null;
  const {
    setActiveConversation
  } = useConversationStore();
  const searchParams = new URLSearchParams(location.search);
  const conversationIdFromUrl = searchParams.get("cid");
  reactExports.useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const {
          data: userData,
          error: userError
        } = await supabase.from("profiles").select("*").eq("id", userId).single();
        if (userError) throw userError;
        const {
          data: rolesData,
          error: rolesError
        } = await supabase.from("user_roles").select("role").eq("user_id", userId);
        if (rolesError) throw rolesError;
        const roles = rolesData?.map((r) => r.role) || [];
        setOtherUser(userData);
        setOtherUserRoles(roles);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        toast.error(app.lang === "ar" ? "حدث خطأ في جلب المستخدم" : "Error fetching user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, app.lang]);
  reactExports.useEffect(() => {
    if (conversationIdFromUrl) {
      setConversationId(conversationIdFromUrl);
      setActiveConversation(conversationIdFromUrl);
    }
  }, [conversationIdFromUrl, setActiveConversation]);
  reactExports.useEffect(() => {
    if (!app.authLoading && !app.user) {
      navigate({
        to: "/auth/$mode",
        params: {
          mode: "login"
        }
      });
    }
  }, [app.authLoading, app.user, navigate]);
  const handleBack = () => {
    navigate({
      to: "/distributor/messages"
    });
  };
  const getRoleInfo = () => {
    const rolePriority = [{
      role: "admin",
      label: app.lang === "ar" ? "أدمن النظام" : "System Admin",
      icon: Crown,
      color: "text-yellow-500"
    }, {
      role: "delivery_company",
      label: app.lang === "ar" ? "شركة توصيل" : "Delivery Co.",
      icon: Building2,
      color: "text-emerald-500"
    }, {
      role: "seller",
      label: app.lang === "ar" ? "بائع" : "Seller",
      icon: Store,
      color: "text-purple-500"
    }, {
      role: "distributor",
      label: app.lang === "ar" ? "موزع" : "Distributor",
      icon: Truck,
      color: "text-blue-500"
    }];
    for (const priority of rolePriority) {
      if (otherUserRoles.includes(priority.role)) {
        return priority;
      }
    }
    return {
      role: "customer",
      label: app.lang === "ar" ? "عميل" : "Customer",
      icon: User,
      color: "text-slate-500"
    };
  };
  if (loading || app.authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a2e]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mx-auto h-8 w-8 animate-spin text-[#0d2e2a]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: app.lang === "ar" ? "جاري تحميل المحادثة..." : "Loading conversation..." })
    ] }) });
  }
  if (!app.user) return null;
  if (!otherUser) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a2e]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "❌" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-red-600", children: app.lang === "ar" ? "المستخدم غير موجود" : "User not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 rounded-full bg-[#0d2e2a] px-6 text-white hover:bg-[#2a655f]", onClick: handleBack, children: app.lang === "ar" ? "العودة للرسائل" : "Back to messages" })
    ] });
  }
  if (!conversationId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a2e]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "⚠️" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-yellow-600", children: app.lang === "ar" ? "جاري تهيئة المحادثة..." : "Initializing conversation..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mx-auto mt-4 h-6 w-6 animate-spin text-[#0d2e2a]" })
    ] });
  }
  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[100dvh] flex-col bg-[#f0f2f5] dark:bg-[#1a1a2e]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center justify-between border-b border-slate-200/50 bg-white px-3 py-2 dark:border-slate-700/50 dark:bg-[#242538] sm:px-4 sm:py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: handleBack, className: "h-9 w-9 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105 group", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform duration-300" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-slate-200 dark:ring-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: otherUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.full_name || "User")}&background=0d2e2a&color=fff`, alt: otherUser?.full_name || "User", className: "object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-[#0d2e2a] text-white", children: (otherUser?.full_name || "U").charAt(0).toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900", isOnline ? "bg-emerald-500" : "bg-slate-400") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold truncate text-slate-900 dark:text-white", children: otherUser?.full_name || (app.lang === "ar" ? "مستخدم" : "User") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[9px] px-1.5 py-0 h-4 rounded-full flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RoleIcon, { className: `h-2.5 w-2.5 ${roleInfo.color}` }),
                roleInfo.label
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isOnline ? app.lang === "ar" ? "متصل الآن" : "Online" : lastSeen ? app.lang === "ar" ? `آخر ظهور ${new Date(lastSeen).toLocaleTimeString("ar-SA", {
                hour: "2-digit",
                minute: "2-digit"
              })}` : `Last seen ${new Date(lastSeen).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              })}` : app.lang === "ar" ? "غير متصل" : "Offline" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-center gap-0.5 sm:gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-full p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4 sm:h-5 sm:w-5" }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatMessages, { userId: app.user.id, conversationId, otherUserId: userId, className: "h-full w-full max-w-4xl mx-auto bg-white shadow-xl dark:bg-[#242538]", onBack: handleBack, hideHeader: true }) })
  ] });
}
export {
  DistributorConversationPage as component
};
