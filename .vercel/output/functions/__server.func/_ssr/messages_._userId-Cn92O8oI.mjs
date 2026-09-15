import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useLocation, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { bl as Route$9, u as useApp, aL as useGetOrCreateConversation, aM as useConversationStore, b as Button } from "./router-BU7AgYzK.mjs";
import { C as ChatHeader, a as ChatMessages } from "./ChatMessages-oq_48zFM.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { p as LoaderCircle } from "../_libs/lucide-react.mjs";
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
function ChatPage() {
  console.log("🟢 CHAT PAGE RENDERED");
  const {
    userId
  } = Route$9.useParams();
  const location = useLocation();
  const app = useApp();
  const navigate = useNavigate();
  const isRtl = app.lang === "ar";
  const [otherUser, setOtherUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [isInitializing, setIsInitializing] = reactExports.useState(false);
  const [conversationId, setConversationId] = reactExports.useState(null);
  const initializedRef = reactExports.useRef(false);
  const getOrCreateConversation = useGetOrCreateConversation();
  const {
    setActiveConversation
  } = useConversationStore();
  const searchParams = new URLSearchParams(location.search);
  const conversationIdFromUrl = searchParams.get("cid");
  const state = location.state;
  reactExports.useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (error) {
        console.error("❌ Error fetching user:", error);
        toast.error(app.lang === "ar" ? "حدث خطأ في جلب المستخدم" : "Error fetching user");
        setLoading(false);
        return;
      }
      setOtherUser(data);
      setLoading(false);
    };
    fetchUser();
  }, [userId, app.lang]);
  reactExports.useEffect(() => {
    const initializeConversation = async () => {
      if (initializedRef.current) return;
      if (!app.user || !userId) return;
      if (isInitializing) return;
      if (conversationIdFromUrl) {
        setConversationId(conversationIdFromUrl);
        setActiveConversation(conversationIdFromUrl);
        initializedRef.current = true;
        return;
      }
      setIsInitializing(true);
      try {
        const conversation = await getOrCreateConversation.mutateAsync({
          userId: app.user.id,
          otherUserId: userId
        });
        setConversationId(conversation.id);
        setActiveConversation(conversation.id);
        navigate({
          to: "/messages_/$userId",
          params: {
            userId
          },
          search: {
            cid: conversation.id
          },
          replace: true
        });
        initializedRef.current = true;
      } catch (error) {
        console.error("❌ Error initializing conversation:", error);
        toast.error(app.lang === "ar" ? "فشل تهيئة المحادثة. حاول مرة أخرى" : "Failed to initialize conversation. Please try again");
      } finally {
        setIsInitializing(false);
      }
    };
    initializeConversation();
  }, [app.user, userId, conversationIdFromUrl, getOrCreateConversation, navigate, setActiveConversation, isInitializing, app.lang]);
  reactExports.useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    }
  }, [conversationId, setActiveConversation]);
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
    if (state?.fromStore && state?.storeId) {
      navigate({
        to: "/store/$id",
        params: {
          id: state.storeId
        },
        state: {
          fromChat: true
        }
      });
      return;
    }
    const referrer = document.referrer;
    if (referrer.includes("/store/")) {
      navigate({
        to: "/store/$id",
        params: {
          id: userId
        }
      });
      return;
    }
    navigate({
      to: "/messages"
    });
  };
  const handleVoiceCall = () => {
    toast.info(app.lang === "ar" ? "📞 جاري الاتصال الصوتي..." : "📞 Calling...");
  };
  const handleVideoCall = () => {
    toast.info(app.lang === "ar" ? "📹 جاري بدء مكالمة الفيديو..." : "📹 Starting video call...");
  };
  const getUserName = (user) => {
    return user?.store_name || user?.full_name || (app.lang === "ar" ? "مستخدم" : "User");
  };
  const getUserAvatar = (user) => {
    return user?.store_logo_url || user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(user))}&background=2a655f&color=fff&size=128`;
  };
  if (loading || app.authLoading || isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 dark:from-slate-950 dark:to-[#173d38]/20", dir: isRtl ? "rtl" : "ltr", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl backdrop-blur-md border border-[#2a655f]/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mx-auto h-12 w-12 animate-spin text-[#2a655f]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-bold text-slate-700 dark:text-slate-200", children: app.lang === "ar" ? "جاري تجهيز محادثتك الفاخرة..." : "Loading luxury chat..." })
    ] }) });
  }
  if (!app.user) return null;
  if (!otherUser) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4", dir: isRtl ? "rtl" : "ltr", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "❌" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black text-slate-900 dark:text-white", children: app.lang === "ar" ? "المستخدم غير موجود" : "User not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6 rounded-2xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] px-8 text-white font-bold shadow-lg hover:shadow-xl transition-all", onClick: () => navigate({
        to: "/messages"
      }), children: app.lang === "ar" ? "العودة للرسائل" : "Back to messages" })
    ] });
  }
  if (!conversationId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950", dir: isRtl ? "rtl" : "ltr", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mx-auto h-10 w-10 animate-spin text-[#2a655f]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-lg font-bold text-[#2a655f]", children: app.lang === "ar" ? "جاري تهيئة الاتصال الآمن..." : "Initializing secure chat..." })
    ] });
  }
  getUserName(otherUser);
  getUserAvatar(otherUser);
  const isStore = !!otherUser?.store_name;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[100dvh] flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-[#112926]/30 dark:to-slate-950 overflow-hidden", dir: isRtl ? "rtl" : "ltr", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(3deg); }
        }
        .animate-chat-float {
          animation: float-icon 3.5s ease-in-out infinite;
        }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChatHeader, { user: {
      id: otherUser.id,
      full_name: otherUser.full_name || null,
      avatar_url: otherUser.avatar_url || null,
      store_name: otherUser.store_name || null,
      store_logo_url: otherUser.store_logo_url || null,
      is_online: otherUser?.is_online || false,
      last_seen_at: otherUser?.last_seen_at || null
    }, conversationId, isStore, onBack: handleBack, onCall: handleVoiceCall, onVideoCall: handleVideoCall, onViewProfile: () => navigate({
      to: "/profile"
    }), onViewStore: () => {
      if (isStore) {
        navigate({
          to: "/store/$id",
          params: {
            id: userId
          }
        });
      }
    }, showBackButton: true, showActions: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden relative p-1 sm:p-3 max-w-5xl w-full mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-[#2a655f]/20 bg-white/95 dark:bg-[#1a2b28]/95 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChatMessages, { userId: app.user.id, conversationId, otherUserId: userId, className: "h-full w-full bg-transparent", onBack: handleBack, hideHeader: true }) }) })
  ] });
}
export {
  ChatPage as component
};
