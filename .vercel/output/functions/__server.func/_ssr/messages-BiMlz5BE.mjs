import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, b7 as useMyDeliveryCompany, b4 as useUserRoles, ay as useDistributors, aI as useConversations, aJ as useUnreadCount, aK as useDeleteConversation, aL as useGetOrCreateConversation, aM as useConversationStore, b as Button, B as Badge, D as Dialog, _ as DialogTrigger, g as DialogContent, q as DialogHeader, l as DialogTitle, m as DialogDescription, I as Input, P as Avatar, U as AvatarFallback, w as DialogFooter, $ as DropdownMenu, a0 as DropdownMenuTrigger, a1 as DropdownMenuContent, a2 as DropdownMenuItem, c as cn } from "./router-BU7AgYzK.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { U as User, k as ShieldCheck, l as Crown, B as Building2, m as Truck, c as Store, C as ChevronRight, o as MessageCircle, q as Search, r as Phone, cL as UsersRound, s as Funnel, t as Users, u as Check, R as RefreshCw, E as EllipsisVertical, v as Trash2 } from "../_libs/lucide-react.mjs";
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
function DistributorMessagesPage() {
  const app = useApp();
  const navigate = useNavigate();
  const isArabic = app.lang === "ar";
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const [filterType, setFilterType] = reactExports.useState("all");
  const [showAdminDialog, setShowAdminDialog] = reactExports.useState(false);
  const [showDistributorDialog, setShowDistributorDialog] = reactExports.useState(false);
  const [adminSearch, setAdminSearch] = reactExports.useState("");
  const [distributorSearch, setDistributorSearch] = reactExports.useState("");
  const [companyAdmins, setCompanyAdmins] = reactExports.useState([]);
  const [loadingAdmins, setLoadingAdmins] = reactExports.useState(true);
  const [userRolesMap, setUserRolesMap] = reactExports.useState(/* @__PURE__ */ new Map());
  const {
    data: company
  } = useMyDeliveryCompany(app.user?.id);
  const {
    data: userRoles = []
  } = useUserRoles(app.user?.id);
  const {
    data: allDistributors = []
  } = useDistributors({});
  const {
    data: conversations = [],
    isLoading,
    refetch
  } = useConversations();
  const {
    data: unreadCount = 0
  } = useUnreadCount();
  const deleteConversation = useDeleteConversation();
  const getOrCreateConversation = useGetOrCreateConversation();
  const {
    setConversations,
    deleteConversation: deleteFromStore
  } = useConversationStore();
  userRoles.includes("distributor");
  const getOtherUser = reactExports.useCallback((conv) => {
    if (!app.user?.id) {
      console.warn("⚠️ getOtherUser: No user logged in");
      return null;
    }
    if (!conv || !conv.participant1_id || !conv.participant2_id) {
      console.warn("⚠️ getOtherUser: Invalid conversation", conv);
      return null;
    }
    return conv.participant1_id === app.user.id ? conv.participant2 : conv.participant1;
  }, [app.user?.id]);
  const getUserName = reactExports.useCallback((user) => {
    if (!user) return app.lang === "ar" ? "مستخدم" : "User";
    return user?.store_name || user?.full_name || (app.lang === "ar" ? "مستخدم" : "User");
  }, [app.lang]);
  const getUserAvatar = reactExports.useCallback((user) => {
    if (!user) {
      return `https://ui-avatars.com/api/?name=${app.lang === "ar" ? "مستخدم" : "User"}&background=d81b60&color=fff&size=128`;
    }
    return user?.store_logo_url || user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(user))}&background=d81b60&color=fff&size=128`;
  }, [getUserName, app.lang]);
  const getUserRole = reactExports.useCallback((user) => {
    if (!user?.id) return "customer";
    const roles = userRolesMap.get(user.id) || [];
    const isCompanyAdmin = companyAdmins.some((admin) => admin.id === user.id);
    if (isCompanyAdmin) return "company_admin";
    if (roles.includes("admin")) return "admin";
    if (roles.includes("delivery_company")) return "delivery_company";
    if (roles.includes("distributor")) return "distributor";
    if (roles.includes("seller")) return "store";
    if (user?.store_name) return "store";
    return "customer";
  }, [userRolesMap, companyAdmins]);
  const getRoleIcon = reactExports.useCallback((role) => {
    switch (role) {
      case "store":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3" });
      case "distributor":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3" });
      case "delivery_company":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3 w-3" });
      case "admin":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3" });
      case "company_admin":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3" });
    }
  }, []);
  const getRoleLabel = reactExports.useCallback((role) => {
    if (app.lang === "ar") {
      switch (role) {
        case "store":
          return "متجر";
        case "distributor":
          return "موزع";
        case "delivery_company":
          return "شركة توصيل";
        case "admin":
          return "أدمن النظام";
        case "company_admin":
          return "أدمن الشركة";
        default:
          return "عميل";
      }
    } else {
      switch (role) {
        case "store":
          return "Store";
        case "distributor":
          return "Distributor";
        case "delivery_company":
          return "Delivery Co.";
        case "admin":
          return "System Admin";
        case "company_admin":
          return "Company Admin";
        default:
          return "Customer";
      }
    }
  }, [app.lang]);
  const getRoleColor = reactExports.useCallback((role) => {
    switch (role) {
      case "store":
        return "bg-emerald-500/20 text-emerald-600 border-emerald-500/30";
      case "distributor":
        return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case "delivery_company":
        return "bg-purple-500/20 text-purple-600 border-purple-500/30";
      case "admin":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "company_admin":
        return "bg-pink-500/20 text-pink-600 border-pink-500/30";
      default:
        return "bg-slate-500/20 text-slate-600 border-slate-500/30";
    }
  }, []);
  const formatTime = reactExports.useCallback((date) => {
    if (!date) return "";
    try {
      const now = /* @__PURE__ */ new Date();
      const then = new Date(date);
      const diffMins = Math.floor((now.getTime() - then.getTime()) / 6e4);
      if (app.lang === "ar") {
        if (diffMins < 1) return "الآن";
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
        if (diffMins < 1440) return `منذ ${Math.floor(diffMins / 60)} ساعة`;
        return then.toLocaleDateString("ar-SA", {
          day: "numeric",
          month: "short"
        });
      } else {
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return then.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short"
        });
      }
    } catch (error) {
      console.warn("⚠️ formatTime error:", error);
      return "";
    }
  }, [app.lang]);
  reactExports.useEffect(() => {
    if (conversations.length > 0) {
      setConversations(conversations);
    }
  }, [conversations, setConversations]);
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
  reactExports.useEffect(() => {
    const fetchCompanyAdmins = async () => {
      if (!company?.id) {
        console.log("ℹ️ No company found, skipping admin fetch");
        setCompanyAdmins([]);
        setLoadingAdmins(false);
        return;
      }
      console.log("🔍 Fetching admins for company:", company.id);
      setLoadingAdmins(true);
      try {
        const {
          data: adminRecords,
          error: adminError
        } = await supabase.from("delivery_company_admins").select(`
            user_id,
            company_id,
            profiles:user_id (
              id,
              full_name,
              phone,
              avatar_url
            )
          `).eq("company_id", company.id);
        if (adminError) {
          console.error("❌ Error fetching company admins:", adminError);
          throw adminError;
        }
        console.log("📋 Admin records found:", adminRecords?.length || 0);
        if (!adminRecords || adminRecords.length === 0) {
          console.log("ℹ️ No admins found for this company");
          setCompanyAdmins([]);
          setLoadingAdmins(false);
          return;
        }
        const adminProfiles = adminRecords.map((r) => r.profiles).filter(Boolean).map((profile) => ({
          ...profile,
          id: profile.id,
          full_name: profile.full_name || "غير معروف"
        }));
        console.log("👤 Admin profiles:", adminProfiles.length);
        setCompanyAdmins(adminProfiles);
      } catch (error) {
        console.error("❌ Error in fetchCompanyAdmins:", error);
        setCompanyAdmins([]);
      } finally {
        setLoadingAdmins(false);
      }
    };
    fetchCompanyAdmins();
  }, [company]);
  reactExports.useEffect(() => {
    const fetchAllUserRoles = async () => {
      if (!conversations.length) return;
      const userIds = /* @__PURE__ */ new Set();
      conversations.forEach((conv) => {
        const user1 = conv.participant1;
        const user2 = conv.participant2;
        if (user1?.id) userIds.add(user1.id);
        if (user2?.id) userIds.add(user2.id);
      });
      if (!userIds.size) return;
      try {
        const {
          data,
          error
        } = await supabase.from("user_roles").select("user_id, role").in("user_id", Array.from(userIds));
        if (error) throw error;
        const rolesMap = /* @__PURE__ */ new Map();
        data?.forEach((item) => {
          if (!rolesMap.has(item.user_id)) {
            rolesMap.set(item.user_id, []);
          }
          rolesMap.get(item.user_id).push(item.role);
        });
        setUserRolesMap(rolesMap);
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    };
    fetchAllUserRoles();
  }, [conversations]);
  const openConversation = reactExports.useCallback(async (otherUserId) => {
    if (!app.user) return;
    if (otherUserId === app.user.id) {
      toast.info(app.lang === "ar" ? "💬 لا يمكنك مراسلة نفسك" : "💬 You can't message yourself");
      return;
    }
    setIsCreating(true);
    try {
      const conversation = await getOrCreateConversation.mutateAsync({
        userId: app.user.id,
        otherUserId
      });
      navigate({
        to: "/distributor/conversation/$userId",
        params: {
          userId: otherUserId
        },
        search: {
          cid: conversation.id
        }
      });
    } catch (error) {
      console.error("❌ Error opening conversation:", error);
      toast.error(app.lang === "ar" ? "فشل فتح المحادثة" : "Failed to open conversation");
    } finally {
      setIsCreating(false);
    }
  }, [app.user, app.lang, getOrCreateConversation, navigate]);
  const handleDeleteConversation = reactExports.useCallback(async (convId, e) => {
    e.stopPropagation();
    if (!app.user) return;
    const confirmMessage = app.lang === "ar" ? "هل أنت متأكد من حذف هذه المحادثة؟" : "Are you sure?";
    if (!confirm(confirmMessage)) return;
    try {
      await deleteConversation.mutateAsync({
        conversationId: convId,
        userId: app.user.id
      });
      deleteFromStore(convId);
      refetch();
    } catch (error) {
      toast.error(app.lang === "ar" ? "حدث خطأ" : "An error occurred");
    }
  }, [app.user, app.lang, deleteConversation, deleteFromStore, refetch]);
  const startAdminChat = reactExports.useCallback(async (admin) => {
    if (!admin?.id) {
      toast.error(app.lang === "ar" ? "❌ هذا الأدمن ليس لديه حساب" : "❌ This admin does not have an account");
      setShowAdminDialog(false);
      return;
    }
    if (admin.id === app.user?.id) {
      toast.info(app.lang === "ar" ? "💬 أنت هذا الأدمن، لا يمكنك مراسلة نفسك" : "💬 You are this admin, you can't message yourself");
      setShowAdminDialog(false);
      return;
    }
    setShowAdminDialog(false);
    await openConversation(admin.id);
  }, [app.user, app.lang, openConversation]);
  const startDistributorChat = reactExports.useCallback(async (distributor) => {
    if (!distributor?.user_id) {
      toast.error(app.lang === "ar" ? "❌ هذا الموزع ليس لديه حساب في النظام" : "❌ This distributor does not have a system account");
      setShowDistributorDialog(false);
      return;
    }
    if (distributor.user_id === app.user?.id) {
      toast.info(app.lang === "ar" ? "💬 أنت هذا الموزع، لا يمكنك مراسلة نفسك" : "💬 You are this distributor, you can't message yourself");
      setShowDistributorDialog(false);
      return;
    }
    setShowDistributorDialog(false);
    await openConversation(distributor.user_id);
  }, [app.user, app.lang, openConversation]);
  const companyDistributors = reactExports.useMemo(() => {
    return allDistributors.filter((d) => d.delivery_company_id === company?.id && d.user_id !== app.user?.id && d.user_id !== null);
  }, [allDistributors, company?.id, app.user?.id]);
  const filteredAdmins = reactExports.useMemo(() => {
    const search = adminSearch.toLowerCase().trim();
    return companyAdmins.filter((admin) => {
      const name = admin.full_name?.toLowerCase() || "";
      const phone = admin.phone?.toLowerCase() || "";
      return name.includes(search) || phone.includes(search);
    });
  }, [companyAdmins, adminSearch]);
  const filteredDistributors = reactExports.useMemo(() => {
    const search = distributorSearch.toLowerCase().trim();
    return companyDistributors.filter((dist) => {
      const name = (app.lang === "ar" ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar)?.toLowerCase() || "";
      const phone = dist.phone?.toLowerCase() || "";
      return name.includes(search) || phone.includes(search);
    });
  }, [companyDistributors, distributorSearch, app.lang]);
  const filteredConversations = reactExports.useMemo(() => {
    return conversations.filter((conv) => {
      const otherUser = getOtherUser(conv);
      if (!otherUser) return false;
      const name = getUserName(otherUser);
      const role = getUserRole(otherUser);
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      if (filterType === "all") return matchesSearch;
      if (filterType === "orders") return matchesSearch && (role === "customer" || role === "store");
      if (filterType === "distributors") return matchesSearch && (role === "distributor" || role === "delivery_company");
      if (filterType === "admins") return matchesSearch && (role === "admin" || role === "company_admin");
      return matchesSearch;
    });
  }, [conversations, filterType, searchQuery, getOtherUser, getUserName, getUserRole]);
  const stats = reactExports.useMemo(() => {
    return {
      total: conversations.length,
      unread: unreadCount,
      customers: conversations.filter((c) => {
        const user = getOtherUser(c);
        if (!user) return false;
        const role = getUserRole(user);
        return role === "customer" || role === "store";
      }).length,
      distributors: conversations.filter((c) => {
        const user = getOtherUser(c);
        if (!user) return false;
        const role = getUserRole(user);
        return role === "distributor" || role === "delivery_company";
      }).length,
      admins: conversations.filter((c) => {
        const user = getOtherUser(c);
        if (!user) return false;
        const role = getUserRole(user);
        return role === "admin" || role === "company_admin";
      }).length
    };
  }, [conversations, unreadCount, getOtherUser, getUserRole]);
  if (app.authLoading || isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d81b60]/5 via-white to-[#d81b60]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#d81b60]/20 border-t-[#d81b60]" }) });
  }
  if (!app.user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d81b60]/5 via-white to-[#d81b60]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: app.lang === "ar" ? "يرجى تسجيل الدخول" : "Please login" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate({
        to: "/auth/$mode",
        params: {
          mode: "login"
        }
      }), className: "mt-4 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/30", children: app.lang === "ar" ? "تسجيل الدخول" : "Login" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#d81b60]/5 via-white to-[#d81b60]/10 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#d81b60]/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#d81b60] via-[#f48fb1] to-[#d81b60] text-white overflow-hidden shadow-lg shadow-[#d81b60]/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse", style: {
          animationDelay: "2s"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-spin-slow" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none opacity-15", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 -translate-y-1/2 animate-drive-across", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-10 w-10 text-white animate-bounce-truck" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-white/30 animate-spin-slow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-white/30 animate-spin-slow", style: {
            animationDelay: "0.3s"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-white/30 animate-spin-slow", style: {
            animationDelay: "0.6s"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-white/30 tracking-widest animate-pulse", children: "● ● ●" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative container mx-auto px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate({
            to: "/distributor/dashboard"
          }), className: "h-9 w-9 shrink-0 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 hover:scale-105 group border border-white/30", children: isArabic ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl md:text-3xl font-bold flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg shadow-white/20 animate-float", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }) }),
              app.lang === "ar" ? "المراسلات" : "Messages",
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-white/20 text-white border-0 text-[10px] px-2 py-0.5 flex items-center gap-1 animate-pulse backdrop-blur-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3 animate-bounce-slow" }),
                app.lang === "ar" ? "موزع" : "Distributor"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/80", children: app.lang === "ar" ? `${stats.total} محادثة` : `${stats.total} conversations` }),
              stats.unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500 text-white rounded-full px-3 py-1 animate-pulse shadow-lg shadow-red-500/50", children: [
                stats.unread,
                " ",
                app.lang === "ar" ? "غير مقروءة" : "unread"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-white/70", children: [
                stats.customers,
                " ",
                app.lang === "ar" ? "عملاء" : "customers",
                " ·",
                stats.distributors,
                " ",
                app.lang === "ar" ? "موزعين" : "distributors",
                " ·",
                stats.admins,
                " ",
                app.lang === "ar" ? "أدمن" : "admins"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showAdminDialog, onOpenChange: setShowAdminDialog, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-10 px-5 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 border-white/20 hover:border-white/40 text-white hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 group font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 mr-2 text-white/80 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: app.lang === "ar" ? "أدمن الشركة" : "Company Admin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline sm:hidden", children: app.lang === "ar" ? "أدمن" : "Admin" }),
              companyAdmins.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-gradient-to-r from-white/30 to-white/20 text-white border-0 text-[10px] px-2 py-0.5 ml-1.5 backdrop-blur-sm", children: companyAdmins.length })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md border-2 border-[#d81b60]/30 shadow-2xl shadow-[#d81b60]/20 bg-white dark:bg-slate-900", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#d81b60] dark:text-white text-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-xl bg-gradient-to-br from-[#d81b60] to-[#f48fb1]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-white" }) }),
                  app.lang === "ar" ? "أدمن الشركة" : "Company Admins"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: app.lang === "ar" ? `اختر أدمن من شركتك (${companyAdmins.length}) لبدء المحادثة` : `Select an admin from your company (${companyAdmins.length}) to start chatting` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d81b60]/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: app.lang === "ar" ? "بحث عن أدمن..." : "Search admin...", value: adminSearch, onChange: (e) => setAdminSearch(e.target.value), className: "pl-9 rounded-xl border-2 border-[#d81b60]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto space-y-1.5 border-2 rounded-xl p-1.5 border-[#d81b60]/20", children: loadingAdmins ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-[#d81b60]/20 border-t-[#d81b60]" }) }) : filteredAdmins.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground text-sm", children: adminSearch ? app.lang === "ar" ? `لا يوجد أدمن باسم أو رقم "${adminSearch}"` : `No admin named or phone "${adminSearch}"` : app.lang === "ar" ? "لا يوجد أدمن في الشركة" : "No admins in the company" }) : filteredAdmins.map((admin) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl hover:bg-[#d81b60]/10 dark:hover:bg-[#d81b60]/20 cursor-pointer transition-all hover:border-[#d81b60]/40 border-2 border-transparent group", onClick: () => startAdminChat(admin), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-10 w-10 ring-2 ring-[#d81b60]/20 group-hover:ring-[#d81b60]/40 transition-all", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: admin.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.full_name || "A")}&background=d81b60&color=fff`, alt: admin.full_name || "Admin", className: "object-cover" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#d81b60] to-[#f48fb1] text-white", children: (admin.full_name || "A").charAt(0).toUpperCase() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate group-hover:text-[#d81b60] transition-colors", children: admin.full_name || (app.lang === "ar" ? "أدمن" : "Admin") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: admin.phone || (app.lang === "ar" ? "رقم غير متاح" : "No phone") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#d81b60]/20 text-[#d81b60] dark:text-[#f48fb1] text-[8px] px-2 py-0 flex items-center gap-0.5 border-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-2.5 w-2.5" }),
                      app.lang === "ar" ? "أدمن" : "Admin"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 rounded-full hover:bg-[#d81b60]/20 opacity-0 group-hover:opacity-100 transition-all text-[#d81b60]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) })
              ] }, admin.id)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowAdminDialog(false), className: "border-2 border-[#d81b60]/30 hover:bg-[#d81b60]/10 text-[#d81b60]", children: app.lang === "ar" ? "إغلاق" : "Close" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showDistributorDialog, onOpenChange: setShowDistributorDialog, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-10 px-5 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 border-white/20 hover:border-white/40 text-white hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 group font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-4 w-4 mr-2 text-white/80 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: app.lang === "ar" ? "الموزعين" : "Distributors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline sm:hidden", children: app.lang === "ar" ? "موزعين" : "Dists" }),
              companyDistributors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-gradient-to-r from-white/30 to-white/20 text-white border-0 text-[10px] px-2 py-0.5 ml-1.5 backdrop-blur-sm", children: companyDistributors.length })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md border-2 border-[#d81b60]/30 shadow-2xl shadow-[#d81b60]/20 bg-white dark:bg-slate-900", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#d81b60] dark:text-white text-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-xl bg-gradient-to-br from-[#d81b60] to-[#f48fb1]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-5 w-5 text-white" }) }),
                  app.lang === "ar" ? "الموزعين" : "Distributors"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: app.lang === "ar" ? `اختر موزعاً من شركتك (${companyDistributors.length}) لبدء المحادثة` : `Select a distributor from your company (${companyDistributors.length}) to start chatting` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d81b60]/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: app.lang === "ar" ? "بحث عن موزع..." : "Search distributor...", value: distributorSearch, onChange: (e) => setDistributorSearch(e.target.value), className: "pl-9 rounded-xl border-2 border-[#d81b60]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto space-y-1.5 border-2 rounded-xl p-1.5 border-[#d81b60]/20", children: filteredDistributors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground text-sm", children: distributorSearch ? app.lang === "ar" ? `لا يوجد موزع باسم أو رقم "${distributorSearch}"` : `No distributor named or phone "${distributorSearch}"` : app.lang === "ar" ? "لا يوجد موزعين في الشركة" : "No distributors in the company" }) : filteredDistributors.map((dist) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 p-3 rounded-xl hover:bg-[#d81b60]/10 dark:hover:bg-[#d81b60]/20 cursor-pointer transition-all hover:border-[#d81b60]/40 border-2 border-transparent group ${!dist.user_id ? "opacity-50 cursor-not-allowed" : ""}`, onClick: () => dist.user_id && startDistributorChat(dist), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-10 w-10 ring-2 ring-[#d81b60]/20 group-hover:ring-[#d81b60]/40 transition-all", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: dist.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(dist.full_name_ar || dist.full_name_en || "D")}&background=d81b60&color=fff`, alt: dist.full_name_ar || dist.full_name_en || "Distributor", className: "object-cover" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#d81b60] to-[#f48fb1] text-white", children: (dist.full_name_ar || dist.full_name_en || "D").charAt(0).toUpperCase() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate group-hover:text-[#d81b60] transition-colors", children: app.lang === "ar" ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: dist.phone }),
                    dist.is_available && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/20 text-emerald-600 text-[8px] px-2 py-0 flex items-center gap-1 border-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }),
                      app.lang === "ar" ? "متاح" : "Available"
                    ] }),
                    !dist.user_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/20 text-red-600 text-[8px] px-2 py-0 border-0", children: [
                      "⚠️ ",
                      app.lang === "ar" ? "بدون حساب" : "No account"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: `h-8 w-8 rounded-full ${dist.user_id ? "hover:bg-[#d81b60]/20 opacity-0 group-hover:opacity-100 text-[#d81b60]" : "opacity-50 cursor-not-allowed"} transition-all`, disabled: !dist.user_id, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) })
              ] }, dist.id)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowDistributorDialog(false), className: "border-2 border-[#d81b60]/30 hover:bg-[#d81b60]/10 text-[#d81b60]", children: app.lang === "ar" ? "إغلاق" : "Close" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-8 bg-[#d81b60]/30 mx-1 hidden sm:block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d81b60]/50 group-focus-within:text-[#d81b60] transition-all duration-300 group-focus-within:scale-110" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: app.lang === "ar" ? "🔍 بحث في المحادثات..." : "🔍 Search conversations...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-9 w-full md:w-56 rounded-xl border-2 border-[#d81b60]/30 dark:border-[#d81b60]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 transition-all duration-300 focus:scale-[1.02]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "h-10 px-3 rounded-xl border-2 border-[#d81b60]/30 hover:bg-[#d81b60]/10 text-[#d81b60]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "rounded-xl p-1 border-2 border-[#d81b60]/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setFilterType("all"), className: "rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#d81b60]/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
                app.lang === "ar" ? "الكل" : "All",
                filterType === "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#d81b60] mr-auto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setFilterType("distributors"), className: "rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#d81b60]/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4" }),
                app.lang === "ar" ? "الموزعين" : "Distributors",
                filterType === "distributors" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#d81b60] mr-auto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setFilterType("admins"), className: "rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#d81b60]/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
                app.lang === "ar" ? "الأدمن" : "Admins",
                filterType === "admins" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#d81b60] mr-auto" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-10 w-10 rounded-xl hover:bg-[#d81b60]/10 transition-all duration-300 hover:rotate-180 group border-2 border-[#d81b60]/30 hover:border-[#d81b60]/60", onClick: () => refetch(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-[#d81b60] group-hover:scale-110 transition-all duration-300" }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-6", children: isCreating ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#d81b60]/20 border-t-[#d81b60]" }) }) : filteredConversations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900/50 rounded-3xl border-2 border-[#d81b60]/20 dark:border-[#d81b60]/30 p-12 text-center shadow-sm hover:shadow-md hover:border-[#d81b60]/40 transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#d81b60]/10 dark:bg-[#d81b60]/20 flex items-center justify-center mx-auto mb-4 animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-10 w-10 text-[#d81b60]/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-[#d81b60] dark:text-white", children: searchQuery ? app.lang === "ar" ? "لا توجد نتائج" : "No results found" : app.lang === "ar" ? "لا توجد محادثات" : "No conversations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-sm mx-auto", children: searchQuery ? app.lang === "ar" ? `لا توجد محادثات تطابق "${searchQuery}"` : `No conversations match "${searchQuery}"` : app.lang === "ar" ? "سيظهر الموزعين والأدمن الذين تتواصل معهم هنا" : "Distributors and admins you communicate with will appear here" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filteredConversations.map((conv) => {
      const otherUser = getOtherUser(conv);
      if (!otherUser) {
        console.warn("⚠️ Skipping conversation with no other user:", conv);
        return null;
      }
      const name = getUserName(otherUser);
      const avatar = getUserAvatar(otherUser);
      const role = getUserRole(otherUser);
      const roleLabel = getRoleLabel(role);
      const roleIcon = getRoleIcon(role);
      const roleColor = getRoleColor(role);
      const unread = conv.unread_count_participant1 > 0 || conv.unread_count_participant2 > 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group cursor-pointer", onClick: () => openConversation(otherUser.id), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `
                      bg-white dark:bg-slate-900 rounded-2xl border-2 p-4 hover:shadow-xl transition-all duration-300 
                      hover:border-[#d81b60]/50 hover:scale-[1.01]
                      ${unread ? "border-[#d81b60]/40 dark:border-[#d81b60]/50 bg-gradient-to-r from-[#d81b60]/5 to-transparent dark:from-[#d81b60]/10 dark:to-transparent" : "border-[#d81b60]/20 dark:border-[#d81b60]/30"}
                    `, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-14 w-14 ring-2 ring-[#d81b60]/30 dark:ring-[#d81b60]/40 group-hover:ring-[#d81b60] transition-all duration-300 group-hover:scale-105", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: avatar, alt: name, className: "object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#d81b60] to-[#f48fb1] text-white text-sm font-bold", children: name.charAt(0).toUpperCase() })
            ] }),
            role === "store" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-2.5 w-2.5 text-emerald-500" }) }),
            role === "distributor" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-2.5 w-2.5 text-blue-500 animate-bounce-slow" }) }),
            role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-yellow-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-2.5 w-2.5 text-yellow-500 animate-spin-slow" }) }),
            role === "company_admin" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-pink-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-2.5 w-2.5 text-pink-500" }) }),
            role === "delivery_company" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-purple-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-2.5 w-2.5 text-purple-500" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold truncate text-slate-900 dark:text-white group-hover:text-[#d81b60] transition-colors duration-300", children: name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn("text-[9px] px-1.5 py-0 h-4 rounded-full flex items-center gap-1 border", roleColor), children: [
                  roleIcon,
                  roleLabel
                ] })
              ] }),
              conv.last_message_at && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: formatTime(conv.last_message_at) })
            ] }),
            conv.last_message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate mt-0.5 group-hover:text-[#d81b60]/70 transition-colors duration-300", children: conv.last_message })
          ] }),
          unread && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#d81b60] text-white rounded-full px-2.5 py-0.5 text-xs font-bold animate-pulse shadow-lg shadow-[#d81b60]/30 border-0", children: conv.unread_count_participant1 || conv.unread_count_participant2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-[#d81b60]/50 group-hover:translate-x-1 group-hover:text-[#d81b60] transition-all duration-300" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 rounded-full hover:bg-[#d81b60]/10 border-2 border-[#d81b60]/20 hover:border-[#d81b60]/50 text-[#d81b60]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuContent, { align: "end", className: "rounded-xl border-2 border-[#d81b60]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer", onClick: (e) => handleDeleteConversation(conv.id, e), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
            app.lang === "ar" ? "حذف المحادثة" : "Delete conversation"
          ] }) })
        ] }) })
      ] }, conv.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes drive-across {
          0% { transform: translateX(-20%); }
          100% { transform: translateX(120%); }
        }
        .animate-drive-across {
          animation: drive-across 14s linear infinite;
        }
        @keyframes bounce-truck {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(-1deg); }
          75% { transform: translateY(-4px) rotate(1deg); }
        }
        .animate-bounce-truck {
          animation: bounce-truck 2.5s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      ` })
  ] });
}
export {
  DistributorMessagesPage as component
};
