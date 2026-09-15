import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, a as useT, b7 as useMyDeliveryCompany, ay as useDistributors, f as useGovernorates, bi as useCreateDistributor, bd as useUpdateDistributor, bj as useDeleteDistributor, D as Dialog, _ as DialogTrigger, b as Button, g as DialogContent, q as DialogHeader, l as DialogTitle, I as Input, aH as Skeleton, d as ImageInput, L as Label, S as Select, r as SelectTrigger, s as SelectValue, t as SelectContent, v as SelectItem, c as cn, B as Badge, w as DialogFooter, P as Avatar, Q as AvatarImage, U as AvatarFallback, b8 as TooltipProvider, b9 as Tooltip, ba as TooltipTrigger, bb as TooltipContent, $ as DropdownMenu, a0 as DropdownMenuTrigger, a1 as DropdownMenuContent, a2 as DropdownMenuItem, bc as DropdownMenuSeparator } from "./router-BU7AgYzK.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BsaVHwzL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { A as ArrowLeft, cL as UsersRound, cK as UserRoundPlus, e as CircleCheckBig, cp as UserCheck, h as Star, m as Truck, q as Search, X, cM as UserPen, _ as CircleAlert, c3 as EyeOff, cr as Lock, p as LoaderCircle, P as Package, b as Clock, a4 as CircleCheck, N as CircleX, E as EllipsisVertical, v as Trash2 } from "../_libs/lucide-react.mjs";
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
function DistributorsManagementPage() {
  const app = useApp();
  useT();
  useNavigate();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [availabilityFilter, setAvailabilityFilter] = reactExports.useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = reactExports.useState(false);
  const [selectedDistributor, setSelectedDistributor] = reactExports.useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = reactExports.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = reactExports.useState(false);
  const [showConvertDialog, setShowConvertDialog] = reactExports.useState(false);
  const [existingUserData, setExistingUserData] = reactExports.useState(null);
  const [pendingFormData, setPendingFormData] = reactExports.useState(null);
  const {
    data: myCompany,
    isLoading: companyLoading
  } = useMyDeliveryCompany(app.user?.id);
  const companyId = myCompany?.id || "";
  const {
    data: distributors = [],
    isLoading,
    refetch
  } = useDistributors({
    companyId: companyId || void 0
  });
  const {
    data: governorates = []
  } = useGovernorates();
  useCreateDistributor();
  const updateDistributor = useUpdateDistributor();
  const deleteDistributor = useDeleteDistributor();
  const isArabic = app.lang === "ar";
  const [distributorStats, setDistributorStats] = reactExports.useState({});
  reactExports.useEffect(() => {
    const fetchStats = async () => {
      if (!distributors.length) return;
      const statsMap = {};
      for (const dist of distributors) {
        const {
          data: orders,
          error
        } = await supabase.from("delivery_orders").select("status, order_id").eq("distributor_id", dist.id);
        if (!error && orders) {
          statsMap[dist.id] = {
            total: orders.length,
            pending: orders.filter((o) => o.status === "pending" || o.status === "assigned").length,
            in_transit: orders.filter((o) => o.status === "in_transit" || o.status === "picked_up").length,
            delivered: orders.filter((o) => o.status === "delivered").length,
            cancelled: orders.filter((o) => o.status === "cancelled" || o.status === "failed").length
          };
        } else {
          statsMap[dist.id] = {
            total: 0,
            pending: 0,
            in_transit: 0,
            delivered: 0,
            cancelled: 0
          };
        }
      }
      setDistributorStats(statsMap);
    };
    fetchStats();
  }, [distributors]);
  const handleConvertUser = async () => {
    if (!existingUserData || !pendingFormData) return;
    const userId = existingUserData.id;
    const {
      full_name_ar,
      full_name_en,
      phone,
      address_ar,
      address_en,
      governorate_id,
      is_available,
      distributor_type,
      avatar_url,
      rating
    } = pendingFormData;
    try {
      if (full_name_ar && full_name_ar !== existingUserData.full_name) {
        await supabase.from("profiles").update({
          full_name: full_name_ar
        }).eq("id", userId);
      }
      await supabase.from("user_roles").insert({
        user_id: userId,
        role: "distributor"
      });
      const {
        data: distributorId,
        error: distributorError
      } = await supabase.rpc("add_distributor", {
        p_user_id: userId,
        p_full_name_ar: full_name_ar || existingUserData.full_name || `موزع ${phone}`,
        p_full_name_en: full_name_en || `Distributor ${phone}`,
        p_phone: phone,
        p_email: `${phone}@distributor.sy`,
        p_address_ar: address_ar || null,
        p_address_en: address_en || null,
        p_governorate_id: governorate_id || null,
        p_is_available: is_available,
        p_distributor_type: distributor_type || "freelance",
        p_avatar_url: avatar_url || existingUserData.avatar_url || null,
        p_delivery_company_id: companyId || null,
        p_rating: rating || 0
      });
      if (distributorError) {
        console.error("❌ RPC error:", distributorError);
        throw distributorError;
      }
      toast.success(isArabic ? `✅ تم تحويل "${existingUserData.full_name}" إلى موزع بنجاح!` : `✅ Successfully converted "${existingUserData.full_name}" to distributor!`);
      setShowConvertDialog(false);
      setExistingUserData(null);
      setPendingFormData(null);
      refetch();
    } catch (error) {
      console.error("Error converting user:", error);
      toast.error(isArabic ? "❌ فشل تحويل المستخدم" : "❌ Failed to convert user");
    }
  };
  const filteredDistributors = reactExports.useMemo(() => {
    let result = distributors;
    if (companyId) {
      result = result.filter((d) => d.delivery_company_id === companyId);
    }
    if (statusFilter !== "all") {
      result = result.filter((d) => statusFilter === "active" ? d.is_active : !d.is_active);
    }
    if (availabilityFilter !== "all") {
      result = result.filter((d) => availabilityFilter === "available" ? d.is_available : !d.is_available);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((d) => {
        const nameAr = d.full_name_ar?.toLowerCase() || "";
        const nameEn = d.full_name_en?.toLowerCase() || "";
        const phone = d.phone || "";
        return nameAr.includes(q) || nameEn.includes(q) || phone.includes(q);
      });
    }
    return result;
  }, [distributors, searchQuery, statusFilter, availabilityFilter, companyId]);
  const stats = reactExports.useMemo(() => {
    const total = distributors.length;
    const active = distributors.filter((d) => d.is_active).length;
    const available = distributors.filter((d) => d.is_available).length;
    const avgRating = distributors.length > 0 ? distributors.reduce((sum, d) => sum + Number(d.rating || 0), 0) / distributors.length : 0;
    const totalOrders = distributors.reduce((sum, d) => sum + (d.completed_orders || 0), 0);
    return {
      total,
      active,
      available,
      avgRating,
      totalOrders
    };
  }, [distributors]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#e8f0ee]/40 via-white to-[#fdf2f8] dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#1a4f4a]/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#0d2e2a]/95 via-[#1a4f4a]/90 to-[#2a655f]/85 backdrop-blur-md text-white overflow-hidden shadow-2xl shadow-[#0d2e2a]/20 border-b border-white/10 sticky top-0 z-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-7xl px-4 py-6 md:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/delivery/dashboard", className: "text-white/70 hover:text-white transition text-sm flex items-center gap-1 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" }),
            isArabic ? "العودة للوحة" : "Back to Dashboard"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-[#f9a8d4] to-[#f48fb1] grid place-items-center shadow-lg shadow-[#f9a8d4]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-5 w-5 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#f9a8d4] via-[#fbcfe8] to-[#f9a8d4] bg-clip-text text-transparent", children: isArabic ? "إدارة الموزعين" : "Distributors Management" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/80 text-xs flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#f9a8d4]" }),
                isArabic ? `إدارة ${distributors.length} موزع` : `Managing ${distributors.length} distributors`
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isAddModalOpen, onOpenChange: setIsAddModalOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#d81b60]/30 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundPlus, { className: "h-4 w-4 mr-1.5" }),
            isArabic ? "إضافة موزع" : "Add Distributor"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto border-[#f9a8d4]/30 shadow-2xl rounded-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#d81b60] dark:text-[#f9a8d4]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundPlus, { className: "h-5 w-5 text-[#d81b60]" }),
              isArabic ? "إضافة موزع جديد" : "Add New Distributor"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddDistributorForm, { companyId, onSuccess: () => {
              refetch();
              setIsAddModalOpen(false);
            }, onConvertUser: handleConvertUser, showConvertDialog, setShowConvertDialog, existingUserData, setExistingUserData, pendingFormData, setPendingFormData })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: UsersRound, label: isArabic ? "الإجمالي" : "Total", value: stats.total, color: "pink" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleCheckBig, label: isArabic ? "نشط" : "Active", value: stats.active, color: "pink" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: UserCheck, label: isArabic ? "متاح" : "Available", value: stats.available, color: "pink" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Star, label: isArabic ? "متوسط التقييم" : "Avg Rating", value: stats.avgRating.toFixed(1), color: "pink" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Truck, label: isArabic ? "إجمالي الطلبات" : "Total Orders", value: stats.totalOrders, color: "olive" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border-2 border-[#f9a8d4]/30 hover:border-[#f9a8d4]/60 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px] group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#d81b60] transition-colors duration-300" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: isArabic ? "🔍 بحث عن موزع..." : "🔍 Search distributor...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "ps-9 h-10 rounded-xl border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 transition-all duration-300" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "h-10 px-3 rounded-xl border border-[#f9a8d4]/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#d81b60]/20 transition-all duration-300 hover:border-[#d81b60]/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: isArabic ? "جميع الحالات" : "All status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: isArabic ? "✅ نشط" : "✅ Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "inactive", children: isArabic ? "❌ غير نشط" : "❌ Inactive" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: availabilityFilter, onChange: (e) => setAvailabilityFilter(e.target.value), className: "h-10 px-3 rounded-xl border border-[#f9a8d4]/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#d81b60]/20 transition-all duration-300 hover:border-[#d81b60]/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: isArabic ? "التوفر" : "Availability" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "available", children: isArabic ? "✅ متاح" : "✅ Available" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "unavailable", children: isArabic ? "❌ غير متاح" : "❌ Unavailable" })
      ] }),
      (searchQuery || statusFilter !== "all" || availabilityFilter !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => {
        setSearchQuery("");
        setStatusFilter("all");
        setAvailabilityFilter("all");
      }, className: "text-[#d81b60] hover:bg-[#fbcfe8]/30 rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
        isArabic ? "مسح" : "Clear"
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 pb-12", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-2xl" }, i)) }) : filteredDistributors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#f9a8d4]/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-16 w-16 text-[#d81b60]/40 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-semibold text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "لا يوجد موزعين" : "No distributors found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: searchQuery ? isArabic ? `لا توجد نتائج تطابق "${searchQuery}"` : `No results match "${searchQuery}"` : isArabic ? "قم بإضافة موزعين لشركتك" : "Add distributors to your company" }),
      !searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-4 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] shadow-lg shadow-[#d81b60]/30 rounded-xl", onClick: () => setIsAddModalOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundPlus, { className: "h-4 w-4 mr-1.5" }),
        isArabic ? "إضافة موزع" : "Add Distributor"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#f9a8d4]/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gradient-to-r from-[#f9a8d4]/30 via-[#fbcfe8]/20 to-[#f9a8d4]/30 dark:from-[#f9a8d4]/20 dark:via-[#fbcfe8]/10 dark:to-[#f9a8d4]/20 border-b-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-right min-w-[180px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20", children: isArabic ? "الموزع" : "Distributor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20", children: isArabic ? "رقم الهاتف" : "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20", children: isArabic ? "المحافظة" : "Governorate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[100px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20", children: isArabic ? "التقييم" : "Rating" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[160px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20", children: isArabic ? "الطلبات" : "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[180px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20", children: isArabic ? "الحالة" : "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px]", children: isArabic ? "إجراءات" : "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredDistributors.map((distributor) => {
        const stats2 = distributorStats[distributor.id] || {
          total: 0,
          pending: 0,
          in_transit: 0,
          delivered: 0,
          cancelled: 0
        };
        return /* @__PURE__ */ jsxRuntimeExports.jsx(DistributorRow, { distributor, stats: stats2, onEdit: () => {
          setSelectedDistributor(distributor);
          setIsEditModalOpen(true);
        }, onDelete: () => {
          setSelectedDistributor(distributor);
          setIsDeleteDialogOpen(true);
        }, onToggleStatus: () => {
          updateDistributor.mutate({
            id: distributor.id,
            patch: {
              is_active: !distributor.is_active
            }
          });
          toast.success(isArabic ? `✅ تم ${distributor.is_active ? "تعطيل" : "تفعيل"} الموزع بنجاح` : `✅ Distributor ${distributor.is_active ? "deactivated" : "activated"} successfully`);
          refetch();
        }, onToggleAvailability: () => {
          updateDistributor.mutate({
            id: distributor.id,
            patch: {
              is_available: !distributor.is_available
            }
          });
          toast.success(isArabic ? `✅ تم ${distributor.is_available ? "إيقاف" : "تفعيل"} توفر الموزع بنجاح` : `✅ Distributor availability ${distributor.is_available ? "disabled" : "enabled"} successfully`);
          refetch();
        } }, distributor.id);
      }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isEditModalOpen, onOpenChange: setIsEditModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto border-[#f9a8d4]/30 shadow-2xl rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#d81b60] dark:text-[#f9a8d4]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPen, { className: "h-5 w-5 text-[#d81b60]" }),
        isArabic ? "تعديل بيانات الموزع" : "Edit Distributor"
      ] }) }),
      selectedDistributor && /* @__PURE__ */ jsxRuntimeExports.jsx(EditDistributorForm, { distributor: selectedDistributor, onSuccess: () => {
        refetch();
        setIsEditModalOpen(false);
        setSelectedDistributor(null);
      } })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isDeleteDialogOpen, onOpenChange: setIsDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md border-[#f9a8d4]/30 shadow-2xl rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-red-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5" }),
        isArabic ? "⚠️ تأكيد الحذف" : "⚠️ Confirm Delete"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? `هل أنت متأكد من حذف الموزع "${selectedDistributor?.full_name_ar}"؟ هذا الإجراء لا يمكن التراجع عنه.` : `Are you sure you want to delete "${selectedDistributor?.full_name_ar}"? This action cannot be undone.` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1 border-[#f9a8d4]/30 hover:bg-[#fbcfe8]/30", onClick: () => setIsDeleteDialogOpen(false), children: isArabic ? "إلغاء" : "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", className: "flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-600/30", onClick: async () => {
            if (!selectedDistributor) return;
            try {
              await deleteDistributor.mutateAsync(selectedDistributor.id);
              toast.success(isArabic ? "✅ تم حذف الموزع بنجاح" : "✅ Distributor deleted successfully");
              refetch();
              setIsDeleteDialogOpen(false);
              setSelectedDistributor(null);
            } catch (error) {
              toast.error(isArabic ? "❌ حدث خطأ" : "❌ Error occurred");
            }
          }, children: isArabic ? "حذف" : "Delete" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      ` })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  color
}) {
  const colors = {
    pink: "bg-[#fbcfe8] dark:bg-[#fbcfe8]/30 border-[#f9a8d4]/60 dark:border-[#f9a8d4]/30 text-[#d81b60]",
    olive: "bg-[#e8f0ee] dark:bg-[#e8f0ee]/20 border-[#2a655f]/40 dark:border-[#2a655f]/30 text-[#2a655f]"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("rounded-xl p-4 shadow-sm border-2 hover:shadow-lg hover:border-[#d81b60]/60 transition-all duration-300 hover:scale-[1.03] group cursor-pointer", colors[color]), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground group-hover:text-[#d81b60] transition-colors", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold mt-1 text-slate-900 dark:text-white group-hover:scale-105 transition-transform", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12", color === "pink" ? "bg-[#f9a8d4]/50 dark:bg-[#f9a8d4]/30 group-hover:bg-[#f9a8d4]/70" : "bg-[#2a655f]/20 group-hover:bg-[#2a655f]/30"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-[#d81b60]" }) })
  ] }) });
}
function DistributorRow({
  distributor,
  stats,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleAvailability
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const tooltips = {
    total: isArabic ? "📦 إجمالي جميع الطلبات الموكلة للموزع" : "📦 Total all orders assigned to distributor",
    pending: isArabic ? "⏳ طلبات قيد المراجعة أو منتظرة التنفيذ" : "⏳ Orders pending review or waiting for execution",
    in_transit: isArabic ? "🚚 طلبات قيد التوصيل (في الطريق)" : "🚚 Orders in transit (on the way)",
    delivered: isArabic ? "✅ طلبات تم توصيلها بنجاح للعميل" : "✅ Orders successfully delivered to customer",
    cancelled: isArabic ? "❌ طلبات ملغية أو فشل توصيلها" : "❌ Cancelled or failed orders"
  };
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-emerald-500";
    if (rating >= 3.5) return "text-blue-500";
    if (rating >= 2.5) return "text-yellow-500";
    if (rating >= 1.5) return "text-orange-500";
    return "text-red-500";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-[#f9a8d4]/15 dark:hover:bg-[#f9a8d4]/10 transition-colors duration-300 border-b-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10 group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right align-middle border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate group-hover:text-[#d81b60] transition-colors", children: isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-10 w-10 flex-shrink-0 ring-2 ring-[#f9a8d4]/30 group-hover:ring-[#d81b60]/50 transition-all duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: distributor.avatar_url || "", className: "object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#d81b60] to-[#f48fb1] text-white text-sm font-bold", children: distributor.full_name_ar?.charAt(0) || distributor.full_name_en?.charAt(0) || "U" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center align-middle text-sm border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10", dir: "ltr", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono bg-[#fbcfe8]/30 dark:bg-[#fbcfe8]/20 px-2 py-1 rounded-lg text-xs border border-[#f9a8d4]/20", children: distributor.phone }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center align-middle text-sm border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10", children: distributor.governorates ? isArabic ? distributor.governorates.name_ar : distributor.governorates.name_en : "-" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center align-middle border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-3.5 w-3.5 fill-current", getRatingColor(Number(distributor.rating || 0))) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("font-bold text-sm", getRatingColor(Number(distributor.rating || 0))), children: Number(distributor.rating || 0).toFixed(1) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all duration-300", style: {
        width: `${Math.min(Number(distributor.rating || 0) / 5 * 100, 100)}%`,
        backgroundColor: Number(distributor.rating || 0) >= 4.5 ? "#10b981" : Number(distributor.rating || 0) >= 3.5 ? "#3b82f6" : Number(distributor.rating || 0) >= 2.5 ? "#eab308" : Number(distributor.rating || 0) >= 1.5 ? "#f97316" : "#ef4444"
      } }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center align-middle border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] dark:text-[#3a8a82] border-0 text-[10px] px-2 py-1 cursor-help hover:scale-105 transition-transform border border-[#2a655f]/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3 w-3 mr-0.5" }),
          stats.total || 0
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "max-w-xs bg-[#0d2e2a] text-white border-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: tooltips.total }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-0 text-[10px] px-2 py-1 cursor-help hover:scale-105 transition-transform", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 mr-0.5" }),
          stats.pending || 0
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "max-w-xs bg-[#0d2e2a] text-white border-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: tooltips.pending }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0 text-[10px] px-2 py-1 cursor-help hover:scale-105 transition-transform", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3 mr-0.5" }),
          stats.in_transit || 0
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "max-w-xs bg-[#0d2e2a] text-white border-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: tooltips.in_transit }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] px-2 py-1 cursor-help hover:scale-105 transition-transform", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 mr-0.5" }),
          stats.delivered || 0
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "max-w-xs bg-[#0d2e2a] text-white border-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: tooltips.delivered }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/10 text-red-500 dark:text-red-400 border-0 text-[10px] px-2 py-1 cursor-help hover:scale-105 transition-transform", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 mr-0.5" }),
          stats.cancelled || 0
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "max-w-xs bg-[#0d2e2a] text-white border-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: tooltips.cancelled }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center align-middle border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: distributor.is_active ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0" : "bg-red-500/20 text-red-500 dark:text-red-400 border-0", children: distributor.is_active ? isArabic ? "✅ نشط" : "✅ Active" : isArabic ? "❌ غير نشط" : "❌ Inactive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: distributor.is_available ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-0" : "bg-slate-500/20 text-slate-500 dark:text-slate-400 border-0", children: distributor.is_available ? isArabic ? "● متاح" : "● Available" : isArabic ? "○ غير متاح" : "○ Unavailable" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center align-middle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 rounded-xl hover:bg-[#fbcfe8]/30 transition-all duration-300 group-hover:scale-110 text-[#d81b60]", onClick: onEdit, children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPen, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 rounded-xl hover:bg-[#fbcfe8]/30 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4 text-[#d81b60]" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "rounded-xl p-1 border-[#f9a8d4]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: onToggleStatus, className: "rounded-lg cursor-pointer hover:bg-[#fbcfe8]/30", children: distributor.is_active ? isArabic ? "تعطيل" : "Deactivate" : isArabic ? "تفعيل" : "Activate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: onToggleAvailability, className: "rounded-lg cursor-pointer hover:bg-[#fbcfe8]/30", children: distributor.is_available ? isArabic ? "إيقاف التوفر" : "Disable availability" : isArabic ? "تفعيل التوفر" : "Enable availability" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "bg-[#f9a8d4]/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "rounded-lg cursor-pointer gap-2 text-red-500 hover:bg-red-50/50", onClick: onDelete, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
            isArabic ? "حذف" : "Delete"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
function AddDistributorForm({
  companyId,
  onSuccess,
  onConvertUser,
  showConvertDialog,
  setShowConvertDialog,
  existingUserData,
  setExistingUserData,
  pendingFormData,
  setPendingFormData
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const {
    data: governorates = []
  } = useGovernorates();
  useCreateDistributor();
  const [loading, setLoading] = reactExports.useState(false);
  const [avatarUrl, setAvatarUrl] = reactExports.useState(null);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    full_name_ar: "",
    full_name_en: "",
    phone: "",
    password: "",
    address_ar: "",
    address_en: "",
    governorate_id: "",
    is_available: true,
    distributor_type: "freelance",
    rating: 0
  });
  const createNewDistributor = async (data) => {
    const {
      full_name_ar,
      full_name_en,
      phone,
      password,
      address_ar,
      address_en,
      governorate_id,
      is_available,
      distributor_type,
      avatar_url,
      rating
    } = data;
    try {
      const response = await fetch(`${"https://jjqgfjpxaxjpyohvcbfi.supabase.co"}/functions/v1/create-distributor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"sb_publishable_fEPybgejg_mSqpmlDj6rNw_7o67e7nt"}`
        },
        body: JSON.stringify({
          phone,
          password,
          full_name_ar,
          full_name_en,
          address_ar,
          address_en,
          governorate_id,
          company_id: companyId || null,
          rating: rating || 0
        })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to create distributor");
      }
      toast.success(isArabic ? `✅ تم إضافة الموزع بنجاح!
📱 الرقم: ${phone}
🔑 كلمة المرور: ${password}
👤 الاسم: ${full_name_ar || full_name_en}
⭐ التقييم: ${rating || 0}` : `✅ Distributor added successfully!
📱 Phone: ${phone}
🔑 Password: ${password}
👤 Name: ${full_name_en || full_name_ar}
⭐ Rating: ${rating || 0}`);
      setShowConvertDialog(false);
      setExistingUserData(null);
      setPendingFormData(null);
      onSuccess();
    } catch (error) {
      console.error("❌ Error creating distributor:", error);
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name_ar.trim()) {
      toast.error(isArabic ? "الاسم (عربي) مطلوب" : "Name (Arabic) is required");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      toast.error(isArabic ? "رقم هاتف صحيح مطلوب" : "Valid phone number is required");
      return;
    }
    setLoading(true);
    try {
      const {
        data: existingProfile
      } = await supabase.from("profiles").select("id, full_name, phone, avatar_url").eq("phone", formData.phone).maybeSingle();
      if (existingProfile) {
        const {
          data: existingDistributor
        } = await supabase.from("distributors").select("id").eq("user_id", existingProfile.id).maybeSingle();
        if (existingDistributor) {
          toast.error(isArabic ? `❌ المستخدم "${existingProfile.full_name}" بالفعل موزع` : `❌ User "${existingProfile.full_name}" is already a distributor`);
          setLoading(false);
          return;
        }
        setExistingUserData(existingProfile);
        setPendingFormData(formData);
        setShowConvertDialog(true);
        setLoading(false);
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        toast.error(isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      await createNewDistributor(formData);
    } catch (error) {
      console.error("Error adding distributor:", error);
      toast.error(isArabic ? "❌ حدث خطأ: " + (error.message || "") : "❌ Error: " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };
  const handleRatingChange = (value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
      setFormData({
        ...formData,
        rating: numValue
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-3 p-4 bg-[#fbcfe8]/20 rounded-xl border border-[#f9a8d4]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageInput, { value: avatarUrl || "", onChange: (value) => setAvatarUrl(value), userId: app.user?.id, folder: "distributors", lang: app.lang, label: isArabic ? "صورة الموزع" : "Distributor Photo", previewClassName: "h-24 w-24 rounded-full object-cover border-4 border-[#f9a8d4]/50", hint: isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "الاسم (عربي) *" : "Name (Arabic) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.full_name_ar, onChange: (e) => setFormData({
            ...formData,
            full_name_ar: e.target.value
          }), placeholder: isArabic ? "أحمد محمد" : "Ahmed", dir: "rtl", required: true, className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "الاسم (إنجليزي)" : "Name (English)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.full_name_en, onChange: (e) => setFormData({
            ...formData,
            full_name_en: e.target.value
          }), placeholder: "Ahmed Mohamad", className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "رقم الهاتف *" : "Phone *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.phone, onChange: (e) => setFormData({
          ...formData,
          phone: e.target.value
        }), placeholder: "0962XXXXXX", dir: "ltr", required: true, className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "سيستخدم هذا الرقم لتسجيل الدخول" : "This number will be used for login" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "كلمة المرور *" : "Password *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.password, onChange: (e) => setFormData({
            ...formData,
            password: e.target.value
          }), type: showPassword ? "text" : "password", placeholder: "********", required: true, minLength: 6, className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl pe-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-[#d81b60] transition-colors", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "6 أحرف على الأقل" : "At least 6 characters" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "المحافظة" : "Governorate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.governorate_id, onValueChange: (value) => setFormData({
          ...formData,
          governorate_id: value
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر المحافظة" : "Select governorate" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: governorates.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g.id, children: isArabic ? g.name_ar : g.name_en }, g.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "العنوان (عربي)" : "Address (Arabic)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.address_ar, onChange: (e) => setFormData({
            ...formData,
            address_ar: e.target.value
          }), placeholder: isArabic ? "دمشق" : "Damascus", dir: "rtl", className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "العنوان (إنجليزي)" : "Address (English)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.address_en, onChange: (e) => setFormData({
            ...formData,
            address_en: e.target.value
          }), placeholder: "Damascus", className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2 text-[#d81b60] dark:text-[#f9a8d4]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-yellow-500 fill-yellow-500" }),
          isArabic ? "تقييم الموزع" : "Distributor Rating"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: formData.rating, onChange: (e) => handleRatingChange(e.target.value), min: "0", max: "5", step: "0.1", className: "w-full border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl", placeholder: "0 - 5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-3 py-1.5 bg-[#fbcfe8]/30 rounded-lg border border-[#f9a8d4]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-4 w-4", formData.rating >= 4.5 ? "text-emerald-500 fill-emerald-500" : formData.rating >= 3.5 ? "text-blue-500 fill-blue-500" : formData.rating >= 2.5 ? "text-yellow-500 fill-yellow-500" : formData.rating >= 1.5 ? "text-orange-500 fill-orange-500" : "text-slate-400") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-[#d81b60]", children: formData.rating.toFixed(1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "/ 5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "⭐ قيم الموزع من 0 إلى 5 (يمكنك استخدام أرقام عشرية مثل 4.5)" : "⭐ Rate the distributor from 0 to 5 (you can use decimal numbers like 4.5)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "نوع الموزع" : "Distributor Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.distributor_type, onValueChange: (value) => setFormData({
            ...formData,
            distributor_type: value
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "freelance", children: isArabic ? "🆓 مستقل" : "🆓 Freelance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "company_employee", children: isArabic ? "🏢 موظف شركة" : "🏢 Company Employee" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "متاح للعمل" : "Available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.is_available ? "available" : "unavailable", onValueChange: (value) => setFormData({
            ...formData,
            is_available: value === "available"
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "available", children: [
                "✅ ",
                isArabic ? "متاح" : "Available"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "unavailable", children: [
                "❌ ",
                isArabic ? "غير متاح" : "Unavailable"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4 border-t border-[#f9a8d4]/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onSuccess, className: "flex-1 border-[#f9a8d4]/30 hover:bg-[#fbcfe8]/30 rounded-xl", children: isArabic ? "إلغاء" : "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "flex-1 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] shadow-lg shadow-[#d81b60]/30 rounded-xl", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          isArabic ? "جاري..." : "Loading..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundPlus, { className: "h-4 w-4 mr-2" }),
          isArabic ? "إضافة موزع" : "Add Distributor"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showConvertDialog, onOpenChange: setShowConvertDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl overflow-hidden p-0 shadow-2xl border-[#f9a8d4]/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-[#d81b60] to-[#f48fb1] p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundPlus, { className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold", children: isArabic ? "🔄 تحويل المستخدم إلى موزع" : "🔄 Convert User to Distributor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm mt-0.5", children: isArabic ? "هذا الرقم مرتبط بحساب موجود" : "This number is linked to an existing account" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-[#fbcfe8]/20 rounded-xl border border-[#f9a8d4]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full bg-[#fbcfe8]/40 flex items-center justify-center overflow-hidden border-2 border-[#f9a8d4]/30", children: existingUserData?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: existingUserData.avatar_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-[#d81b60]", children: existingUserData?.full_name?.charAt(0) || "U" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-[#d81b60] dark:text-[#f9a8d4]", children: existingUserData?.full_name || (isArabic ? "مستخدم" : "User") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", dir: "ltr", children: [
              "📱 ",
              existingUserData?.phone
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "🆔 مستخدم مسجل في النظام" : "🆔 Registered user" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-blue-500/20 text-blue-600 border-blue-500/20", children: isArabic ? "عميل" : "Customer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30 flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-amber-500 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-amber-700 dark:text-amber-400", children: isArabic ? "⚠️ تحويل الدور" : "⚠️ Role Change" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5", children: isArabic ? `سيتم إضافة صلاحية "موزع" للمستخدم "${existingUserData?.full_name}" مع تقييم ${pendingFormData?.rating || 0}` : `The "distributor" role will be added to "${existingUserData?.full_name}" with rating ${pendingFormData?.rating || 0}` })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[#fbcfe8]/20 rounded-xl border border-[#f9a8d4]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: isArabic ? "📋 بيانات الموزع الجديدة" : "📋 New Distributor Data" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "الاسم" : "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#d81b60]", children: pendingFormData?.full_name_ar || pendingFormData?.full_name_en || "-" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "الهاتف" : "Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#d81b60]", dir: "ltr", children: pendingFormData?.phone })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 text-yellow-500 fill-yellow-500" }),
                isArabic ? "التقييم" : "Rating"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#d81b60]", children: pendingFormData?.rating?.toFixed(1) || "0.0" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: isArabic ? "📌 سيتم إضافة الموزع إلى شركتك الحالية" : "📌 The distributor will be added to your current company" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "p-4 border-t border-[#f9a8d4]/30 bg-[#fbcfe8]/20 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => {
          setShowConvertDialog(false);
          setExistingUserData(null);
          setPendingFormData(null);
          toast.info(isArabic ? "📱 يمكنك استخدام رقم آخر لإضافة موزع جديد" : "📱 You can use another number to add a new distributor");
        }, className: "flex-1 border-[#f9a8d4]/30 hover:bg-[#fbcfe8]/30 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
          isArabic ? "استخدام رقم آخر" : "Use Another Number"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onConvertUser, className: "flex-1 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] shadow-lg shadow-[#d81b60]/30 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundPlus, { className: "h-4 w-4 mr-1.5" }),
          isArabic ? "تحويل إلى موزع" : "Convert to Distributor"
        ] })
      ] })
    ] }) })
  ] });
}
function EditDistributorForm({
  distributor,
  onSuccess
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const {
    data: governorates = []
  } = useGovernorates();
  const updateDistributor = useUpdateDistributor();
  const [loading, setLoading] = reactExports.useState(false);
  const [avatarUrl, setAvatarUrl] = reactExports.useState(distributor.avatar_url || null);
  const [formData, setFormData] = reactExports.useState({
    full_name_ar: distributor.full_name_ar || "",
    full_name_en: distributor.full_name_en || "",
    phone: distributor.phone || "",
    address_ar: distributor.address_ar || "",
    address_en: distributor.address_en || "",
    governorate_id: distributor.governorate_id || "",
    is_available: distributor.is_available ?? true,
    distributor_type: distributor.distributor_type || "freelance",
    rating: distributor.rating || 0
  });
  const handleRatingChange = (value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
      setFormData({
        ...formData,
        rating: numValue
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name_ar.trim() || !formData.phone.trim()) {
      toast.error(isArabic ? "الاسم ورقم الهاتف مطلوبان" : "Name and phone are required");
      return;
    }
    setLoading(true);
    try {
      await updateDistributor.mutateAsync({
        id: distributor.id,
        patch: {
          full_name_ar: formData.full_name_ar.trim(),
          full_name_en: formData.full_name_en?.trim() || null,
          phone: formData.phone.trim(),
          address_ar: formData.address_ar?.trim() || null,
          address_en: formData.address_en?.trim() || null,
          governorate_id: formData.governorate_id || null,
          is_available: formData.is_available,
          distributor_type: formData.distributor_type || "freelance",
          avatar_url: avatarUrl,
          rating: formData.rating
        }
      });
      toast.success(isArabic ? "✅ تم تحديث الموزع بنجاح" : "✅ Distributor updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Error updating distributor:", error);
      toast.error(isArabic ? "❌ حدث خطأ: " + (error.message || "") : "❌ Error: " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-3 p-4 bg-[#fbcfe8]/20 rounded-xl border border-[#f9a8d4]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageInput, { value: avatarUrl || "", onChange: (value) => setAvatarUrl(value), userId: app.user?.id, folder: "distributors", lang: app.lang, label: isArabic ? "صورة الموزع" : "Distributor Photo", previewClassName: "h-24 w-24 rounded-full object-cover border-4 border-[#f9a8d4]/50", hint: isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "الاسم (عربي) *" : "Name (Arabic) *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.full_name_ar, onChange: (e) => setFormData({
          ...formData,
          full_name_ar: e.target.value
        }), dir: "rtl", className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "الاسم (إنجليزي)" : "Name (English)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.full_name_en, onChange: (e) => setFormData({
          ...formData,
          full_name_en: e.target.value
        }), className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "رقم الهاتف *" : "Phone *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.phone, onChange: (e) => setFormData({
          ...formData,
          phone: e.target.value
        }), dir: "ltr", className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "المحافظة" : "Governorate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.governorate_id, onValueChange: (value) => setFormData({
          ...formData,
          governorate_id: value
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: governorates.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g.id, children: isArabic ? g.name_ar : g.name_en }, g.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2 text-[#d81b60] dark:text-[#f9a8d4]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-yellow-500 fill-yellow-500" }),
        isArabic ? "تقييم الموزع" : "Distributor Rating"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: formData.rating, onChange: (e) => handleRatingChange(e.target.value), min: "0", max: "5", step: "0.1", className: "w-full border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl", placeholder: "0 - 5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-3 py-1.5 bg-[#fbcfe8]/30 rounded-lg border border-[#f9a8d4]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-4 w-4", formData.rating >= 4.5 ? "text-emerald-500 fill-emerald-500" : formData.rating >= 3.5 ? "text-blue-500 fill-blue-500" : formData.rating >= 2.5 ? "text-yellow-500 fill-yellow-500" : formData.rating >= 1.5 ? "text-orange-500 fill-orange-500" : "text-slate-400") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-[#d81b60]", children: formData.rating.toFixed(1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "/ 5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "⭐ قيم الموزع من 0 إلى 5" : "⭐ Rate the distributor from 0 to 5" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "نوع الموزع" : "Distributor Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.distributor_type, onValueChange: (value) => setFormData({
          ...formData,
          distributor_type: value
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "freelance", children: isArabic ? "🆓 مستقل" : "🆓 Freelance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "company_employee", children: isArabic ? "🏢 موظف شركة" : "🏢 Company Employee" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "الحالة" : "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.is_available ? "available" : "unavailable", onValueChange: (value) => setFormData({
          ...formData,
          is_available: value === "available"
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "available", children: [
              "✅ ",
              isArabic ? "متاح" : "Available"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "unavailable", children: [
              "❌ ",
              isArabic ? "غير متاح" : "Unavailable"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4 border-t border-[#f9a8d4]/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onSuccess, className: "flex-1 border-[#f9a8d4]/30 hover:bg-[#fbcfe8]/30 rounded-xl", children: isArabic ? "إلغاء" : "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "flex-1 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] shadow-lg shadow-[#d81b60]/30 rounded-xl", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
        isArabic ? "جاري..." : "Loading..."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPen, { className: "h-4 w-4 mr-2" }),
        isArabic ? "حفظ التغييرات" : "Save Changes"
      ] }) })
    ] })
  ] });
}
export {
  DistributorsManagementPage as component
};
