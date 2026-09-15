import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, a as useT, b7 as useMyDeliveryCompany, ay as useDistributors, f as useGovernorates, b as Button, I as Input, aH as Skeleton, D as Dialog, g as DialogContent, q as DialogHeader, l as DialogTitle, m as DialogDescription, d as ImageInput, L as Label, c as cn, S as Select, r as SelectTrigger, s as SelectValue, t as SelectContent, v as SelectItem, w as DialogFooter, B as Badge } from "./router-BU7AgYzK.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Building2, t as Users, f as Plus, cp as UserCheck, cN as UserX, h as Star, q as Search, s as Funnel, ah as UserPlus, p as LoaderCircle, e as CircleCheckBig, X, _ as CircleAlert, c3 as EyeOff, W as Eye, cE as PenLine, bX as Save, P as Package, a0 as MapPin, r as Phone, ci as PowerOff, ch as Power, b as Clock, m as Truck } from "../_libs/lucide-react.mjs";
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
function DistributorsPage() {
  const app = useApp();
  useT();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [governorateFilter, setGovernorateFilter] = reactExports.useState("all");
  const [availabilityFilter, setAvailabilityFilter] = reactExports.useState("all");
  const [showAddDistributorDialog, setShowAddDistributorDialog] = reactExports.useState(false);
  const [isAdding, setIsAdding] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [avatarUrl, setAvatarUrl] = reactExports.useState(null);
  const [showEditDistributorDialog, setShowEditDistributorDialog] = reactExports.useState(false);
  const [editingDistributor, setEditingDistributor] = reactExports.useState(null);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [phone, setPhone] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [fullNameAr, setFullNameAr] = reactExports.useState("");
  const [fullNameEn, setFullNameEn] = reactExports.useState("");
  const [addressAr, setAddressAr] = reactExports.useState("");
  const [addressEn, setAddressEn] = reactExports.useState("");
  const [governorateId, setGovernorateId] = reactExports.useState("");
  const [isAvailable, setIsAvailable] = reactExports.useState(true);
  const [distributorType, setDistributorType] = reactExports.useState("freelance");
  const [isPhoneChecking, setIsPhoneChecking] = reactExports.useState(false);
  const [phoneError, setPhoneError] = reactExports.useState(null);
  const [phoneAvailable, setPhoneAvailable] = reactExports.useState(null);
  const [isPhoneChanged, setIsPhoneChanged] = reactExports.useState(false);
  const [editPhone, setEditPhone] = reactExports.useState("");
  const [editFullNameAr, setEditFullNameAr] = reactExports.useState("");
  const [editFullNameEn, setEditFullNameEn] = reactExports.useState("");
  const [editAddressAr, setEditAddressAr] = reactExports.useState("");
  const [editAddressEn, setEditAddressEn] = reactExports.useState("");
  const [editGovernorateId, setEditGovernorateId] = reactExports.useState("");
  const [editIsAvailable, setEditIsAvailable] = reactExports.useState(true);
  const [editDistributorType, setEditDistributorType] = reactExports.useState("freelance");
  const [editAvatarUrl, setEditAvatarUrl] = reactExports.useState(null);
  const [isEditPhoneChecking, setIsEditPhoneChecking] = reactExports.useState(false);
  const [editPhoneError, setEditPhoneError] = reactExports.useState(null);
  const [editPhoneAvailable, setEditPhoneAvailable] = reactExports.useState(null);
  const [isEditPhoneChanged, setIsEditPhoneChanged] = reactExports.useState(false);
  const isArabic = app.lang === "ar";
  const {
    data: company,
    isLoading: companyLoading
  } = useMyDeliveryCompany(app.user?.id);
  const {
    data: distributors = [],
    isLoading: loadingDistributors,
    refetch: refetchDistributors
  } = useDistributors({
    companyId: company?.id,
    // ✅ فلتر حسب الشركة
    isAvailable: true
  });
  const {
    data: governorates = []
  } = useGovernorates();
  if (!companyLoading && !company) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-16 w-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: isArabic ? "🚫 غير مصرح" : "🚫 Unauthorized" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: isArabic ? "أنت لست تابعاً لشركة توصيل. يرجى التواصل مع الإدارة." : "You are not affiliated with a delivery company. Please contact management." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6 bg-[#0d2e2a] text-white hover:bg-[#1a4f4a]", onClick: () => navigate({
        to: "/"
      }), children: isArabic ? "العودة للرئيسية" : "Back to Home" })
    ] }) });
  }
  const checkPhoneAvailability = reactExports.useCallback(async (phone2, excludeId) => {
    if (!phone2 || phone2.length < 5) {
      setPhoneError(null);
      setPhoneAvailable(null);
      return;
    }
    setIsPhoneChecking(true);
    try {
      let query = supabase.from("profiles").select("id, phone").eq("phone", phone2.trim());
      if (excludeId) {
        query = query.neq("id", excludeId);
      }
      const {
        data,
        error
      } = await query.maybeSingle();
      if (error) throw error;
      if (data) {
        setPhoneError("⚠️ هذا الرقم مستخدم من قبل");
        setPhoneAvailable(false);
      } else {
        setPhoneError(null);
        setPhoneAvailable(true);
      }
    } catch (error) {
      console.error("Error checking phone:", error);
      setPhoneError("حدث خطأ في التحقق من الرقم");
      setPhoneAvailable(false);
    } finally {
      setIsPhoneChecking(false);
    }
  }, []);
  const checkEditPhoneAvailability = reactExports.useCallback(async (phone2) => {
    if (!phone2 || phone2.length < 5) {
      setEditPhoneError(null);
      setEditPhoneAvailable(null);
      return;
    }
    setIsEditPhoneChecking(true);
    try {
      const {
        data,
        error
      } = await supabase.from("profiles").select("id, phone").eq("phone", phone2.trim()).neq("id", editingDistributor?.user_id).maybeSingle();
      if (error) throw error;
      if (data) {
        setEditPhoneError("⚠️ هذا الرقم مستخدم من قبل");
        setEditPhoneAvailable(false);
      } else {
        setEditPhoneError(null);
        setEditPhoneAvailable(true);
      }
    } catch (error) {
      console.error("Error checking phone:", error);
      setEditPhoneError("حدث خطأ في التحقق من الرقم");
      setEditPhoneAvailable(false);
    } finally {
      setIsEditPhoneChecking(false);
    }
  }, [editingDistributor]);
  const filteredDistributors = reactExports.useMemo(() => {
    let result = distributors;
    if (governorateFilter !== "all") {
      result = result.filter((d) => d.governorate_id === governorateFilter);
    }
    if (availabilityFilter !== "all") {
      result = result.filter((d) => availabilityFilter === "available" ? d.is_available : !d.is_available);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((d) => {
        const nameAr = d.full_name_ar?.toLowerCase() || "";
        const nameEn = d.full_name_en?.toLowerCase() || "";
        const phone2 = d.phone || "";
        return nameAr.includes(q) || nameEn.includes(q) || phone2.includes(q);
      });
    }
    return result;
  }, [distributors, searchQuery, governorateFilter, availabilityFilter]);
  const handleAddDistributor = async (e) => {
    e.preventDefault();
    if (!fullNameAr.trim()) {
      toast.error(isArabic ? "الاسم (عربي) مطلوب" : "Name (Arabic) is required");
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      toast.error(isArabic ? "رقم هاتف صحيح مطلوب" : "Valid phone number is required");
      return;
    }
    if (phoneAvailable === false || phoneError) {
      toast.error(isArabic ? "❌ هذا الرقم مستخدم من قبل" : "❌ This phone number is already in use");
      return;
    }
    if (!password || password.length < 6) {
      toast.error(isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }
    setIsAdding(true);
    try {
      const response = await fetch(`${"https://jjqgfjpxaxjpyohvcbfi.supabase.co"}/functions/v1/create-distributor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"sb_publishable_fEPybgejg_mSqpmlDj6rNw_7o67e7nt"}`
        },
        body: JSON.stringify({
          phone: phone.trim(),
          password,
          full_name_ar: fullNameAr.trim(),
          full_name_en: fullNameEn.trim() || null,
          address_ar: addressAr.trim() || null,
          address_en: addressEn.trim() || null,
          governorate_id: governorateId || null,
          company_id: company?.id || null
          // ✅ ربط بالشركة الحالية
        })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to create distributor");
      }
      toast.success(isArabic ? `✅ تم إضافة الموزع بنجاح!
📱 ${phone}
🔑 ${password}` : `✅ Distributor added successfully!
📱 ${phone}
🔑 ${password}`);
      setShowAddDistributorDialog(false);
      resetForm();
      await refetchDistributors();
    } catch (error) {
      console.error("❌ Error creating distributor:", error);
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    } finally {
      setIsAdding(false);
    }
  };
  const openEditDialog = (distributor) => {
    setEditingDistributor(distributor);
    setEditPhone(distributor.phone || "");
    setEditFullNameAr(distributor.full_name_ar || "");
    setEditFullNameEn(distributor.full_name_en || "");
    setEditAddressAr(distributor.address_ar || "");
    setEditAddressEn(distributor.address_en || "");
    setEditGovernorateId(distributor.governorate_id || "");
    setEditIsAvailable(distributor.is_available ?? true);
    setEditDistributorType(distributor.distributor_type || "freelance");
    setEditAvatarUrl(distributor.avatar_url || null);
    setIsEditPhoneChanged(false);
    setEditPhoneAvailable(null);
    setEditPhoneError(null);
    setShowEditDistributorDialog(true);
  };
  const handleUpdateDistributor = async (e) => {
    e.preventDefault();
    if (!editingDistributor) return;
    if (!editFullNameAr.trim()) {
      toast.error(isArabic ? "الاسم (عربي) مطلوب" : "Name (Arabic) is required");
      return;
    }
    if (!editPhone.trim() || editPhone.length < 9) {
      toast.error(isArabic ? "رقم هاتف صحيح مطلوب" : "Valid phone number is required");
      return;
    }
    if (isEditPhoneChanged && editPhoneAvailable === false) {
      toast.error(isArabic ? "❌ هذا الرقم مستخدم من قبل" : "❌ This phone number is already in use");
      return;
    }
    setIsEditing(true);
    try {
      const patch = {
        full_name_ar: editFullNameAr.trim(),
        full_name_en: editFullNameEn.trim() || null,
        phone: editPhone.trim(),
        address_ar: editAddressAr.trim() || null,
        address_en: editAddressEn.trim() || null,
        governorate_id: editGovernorateId || null,
        is_available: editIsAvailable,
        distributor_type: editDistributorType,
        avatar_url: editAvatarUrl
      };
      const {
        error: distError
      } = await supabase.from("distributors").update(patch).eq("id", editingDistributor.id);
      if (distError) throw distError;
      if (isEditPhoneChanged && editPhone !== editingDistributor.phone) {
        const {
          error: profileError
        } = await supabase.from("profiles").update({
          phone: editPhone.trim(),
          full_name: editFullNameAr.trim()
        }).eq("id", editingDistributor.user_id);
        if (profileError) throw profileError;
      }
      toast.success(isArabic ? `✅ تم تحديث معلومات الموزع بنجاح` : `✅ Distributor updated successfully`);
      setShowEditDistributorDialog(false);
      setEditingDistributor(null);
      setIsEditing(false);
      await refetchDistributors();
    } catch (error) {
      console.error("❌ Error updating distributor:", error);
      toast.error(isArabic ? `❌ فشل التحديث: ${error.message}` : `❌ Update failed: ${error.message}`);
      setIsEditing(false);
    }
  };
  const handleToggleActive = async (distributor) => {
    const newStatus = !distributor.is_available;
    const actionText = newStatus ? "تفعيل" : "تعطيل";
    if (!confirm(isArabic ? `⚠️ هل أنت متأكد من ${actionText} "${distributor.full_name_ar || distributor.full_name_en}"؟` : `⚠️ Are you sure you want to ${actionText} "${distributor.full_name_en || distributor.full_name_ar}"?`)) return;
    try {
      if (!newStatus) {
        const {
          data: pendingOrders,
          error: ordersError
        } = await supabase.from("delivery_orders").select("id, status").eq("distributor_id", distributor.id).in("status", ["pending", "assigned", "picked_up", "in_transit"]);
        if (ordersError) throw ordersError;
        if (pendingOrders && pendingOrders.length > 0) {
          toast.error(isArabic ? `❌ لا يمكن تعطيل الموزع لديه ${pendingOrders.length} طلبات معلقة` : `❌ Cannot deactivate distributor with ${pendingOrders.length} pending orders`);
          return;
        }
      }
      const {
        error: updateError
      } = await supabase.from("distributors").update({
        is_available: newStatus,
        is_active: newStatus,
        ...newStatus ? {
          deactivated_at: null,
          deactivated_by: null
        } : {
          deactivated_at: (/* @__PURE__ */ new Date()).toISOString(),
          deactivated_by: app.user?.id
        }
      }).eq("id", distributor.id);
      if (updateError) throw updateError;
      toast.success(isArabic ? `✅ تم ${actionText} "${distributor.full_name_ar || distributor.full_name_en}" بنجاح` : `✅ "${distributor.full_name_en || distributor.full_name_ar}" ${actionText}ed successfully`);
      await refetchDistributors();
    } catch (error) {
      console.error("❌ Error toggling distributor:", error);
      toast.error(isArabic ? `❌ فشل ${actionText}: ${error.message}` : `❌ ${actionText} failed: ${error.message}`);
    }
  };
  const resetForm = () => {
    setPhone("");
    setPassword("");
    setFullNameAr("");
    setFullNameEn("");
    setAddressAr("");
    setAddressEn("");
    setGovernorateId("");
    setIsAvailable(true);
    setDistributorType("freelance");
    setAvatarUrl(null);
    setPhoneError(null);
    setPhoneAvailable(null);
    setIsPhoneChanged(false);
  };
  const stats = {
    total: distributors.length,
    available: distributors.filter((d) => d.is_available).length,
    unavailable: distributors.filter((d) => !d.is_available).length,
    avgRating: distributors.length > 0 ? distributors.reduce((sum, d) => sum + Number(d.rating || 0), 0) / distributors.length : 0
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-7xl px-4 py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "text-white/70 hover:text-white transition text-sm flex items-center gap-1", children: [
            "← ",
            isArabic ? "الرئيسية" : "Home"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-white/20 backdrop-blur grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-7 w-7" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-bold", children: isArabic ? "👤 الموزعين" : "👤 Distributors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm mt-1", children: isArabic ? `جميع الموزعين المتاحين للتوصيل (${stats.total} موزع)` : `All available distributors (${stats.total} distributors)` })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105", onClick: () => setShowAddDistributorDialog(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          isArabic ? "إضافة موزع" : "Add Distributor"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 -mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: isArabic ? "إجمالي الموزعين" : "Total Distributors", value: stats.total, color: "blue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: UserCheck, label: isArabic ? "متاح" : "Available", value: stats.available, color: "green" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: UserX, label: isArabic ? "غير متاح" : "Unavailable", value: stats.unavailable, color: "red" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Star, label: isArabic ? "متوسط التقييم" : "Avg Rating", value: stats.avgRating.toFixed(1), color: "yellow" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: isArabic ? "🔍 بحث عن موزع..." : "🔍 Search distributor...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "ps-9 h-10 rounded-xl border-slate-200/50 dark:border-slate-800/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: governorateFilter, onChange: (e) => setGovernorateFilter(e.target.value), className: "h-10 px-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: isArabic ? "جميع المحافظات" : "All Governorates" }),
          governorates.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: g.id, children: isArabic ? g.name_ar : g.name_en }, g.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: availabilityFilter, onChange: (e) => setAvailabilityFilter(e.target.value), className: "h-10 px-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: isArabic ? "الكل" : "All" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "available", children: isArabic ? "✅ متاح" : "✅ Available" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "unavailable", children: isArabic ? "❌ غير متاح" : "❌ Unavailable" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 pb-12", children: loadingDistributors ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-16 rounded-full mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-3/4 mx-auto mt-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full mt-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3 mt-1" })
    ] }, i)) }) : filteredDistributors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-16 w-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-semibold", children: isArabic ? "لا يوجد موزعين" : "No distributors found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 max-w-md mx-auto", children: isArabic ? "لم نجد موزعين مطابقين لمعايير البحث" : "No distributors matching your search criteria" }),
      searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-4 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10", onClick: () => setSearchQuery(""), children: isArabic ? "مسح البحث" : "Clear search" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredDistributors.map((distributor) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      DistributorCard,
      {
        distributor,
        onEdit: () => openEditDialog(distributor),
        onToggleActive: handleToggleActive,
        isArabic
      },
      distributor.id
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAddDistributorDialog, onOpenChange: setShowAddDistributorDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-6 w-6 text-[#0d2e2a]" }),
          isArabic ? "➕ إضافة موزع جديد" : "➕ Add New Distributor"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? "سيتم إنشاء حساب للموزع مع رقم هاتف وكلمة مرور" : "A new distributor account will be created with phone and password" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddDistributor, className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageInput, { value: avatarUrl || "", onChange: (value) => setAvatarUrl(value), userId: app.user?.id, folder: "distributors", lang: app.lang, label: isArabic ? "صورة الموزع" : "Distributor Photo", previewClassName: "h-24 w-24 rounded-full object-cover", hint: isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "الاسم (عربي) *" : "Name (Arabic) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: fullNameAr, onChange: (e) => setFullNameAr(e.target.value), placeholder: isArabic ? "أحمد محمد" : "Ahmed", dir: "rtl", required: true, className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "الاسم (إنجليزي)" : "Name (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: fullNameEn, onChange: (e) => setFullNameEn(e.target.value), placeholder: "Ahmed Mohamad", className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "رقم الهاتف *" : "Phone *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: phone, onChange: (e) => {
              const value = e.target.value;
              setPhone(value);
              setIsPhoneChanged(true);
              if (value.length >= 5) {
                checkPhoneAvailability(value);
              } else {
                setPhoneError(null);
                setPhoneAvailable(null);
              }
            }, placeholder: "0962XXXXXX", dir: "ltr", required: true, className: cn("rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20", phoneError && "border-red-500 focus-visible:ring-red-500", phoneAvailable === true && phone.length >= 5 && "border-emerald-400") }),
            phone.length >= 5 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 end-3 flex items-center", children: isPhoneChecking ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-emerald-300" }) : phoneAvailable === true ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-emerald-400" }) : phoneAvailable === false ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-red-400" }) : null })
          ] }),
          phoneError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
            phoneError
          ] }),
          phoneAvailable === true && phone.length >= 5 && !phoneError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
            isArabic ? "✓ الرقم متاح" : "✓ Number is available"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "كلمة المرور *" : "Password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: password, onChange: (e) => setPassword(e.target.value), type: showPassword ? "text" : "password", placeholder: "********", required: true, minLength: 6, className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 pe-10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "6 أحرف على الأقل" : "At least 6 characters" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "المحافظة" : "Governorate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: setGovernorateId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر المحافظة" : "Select governorate" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: governorates.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g.id, children: isArabic ? g.name_ar : g.name_en }, g.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "العنوان (عربي)" : "Address (Arabic)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: addressAr, onChange: (e) => setAddressAr(e.target.value), placeholder: isArabic ? "دمشق" : "Damascus", dir: "rtl", className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "العنوان (إنجليزي)" : "Address (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: addressEn, onChange: (e) => setAddressEn(e.target.value), placeholder: "Damascus", className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "نوع الموزع" : "Distributor Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { defaultValue: "freelance", onValueChange: setDistributorType, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "freelance", children: isArabic ? "🆓 مستقل" : "🆓 Freelance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "company_employee", children: isArabic ? "🏢 موظف شركة" : "🏢 Company Employee" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "متاح للعمل" : "Available" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { defaultValue: "available", onValueChange: (value) => setIsAvailable(value === "available"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-4 border-t border-[#0d2e2a]/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => {
            setShowAddDistributorDialog(false);
            resetForm();
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
            isArabic ? "إلغاء" : "Cancel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300", disabled: isAdding || phoneAvailable === false, children: [
            isAdding ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-1.5" }),
            isArabic ? "إضافة الموزع" : "Add Distributor"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showEditDistributorDialog, onOpenChange: setShowEditDistributorDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-6 w-6 text-[#0d2e2a]" }),
          isArabic ? "✏️ تعديل معلومات الموزع" : "✏️ Edit Distributor Info"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? "تحديث معلومات الموزع" : "Update distributor information" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdateDistributor, className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageInput, { value: editAvatarUrl || "", onChange: (value) => setEditAvatarUrl(value), userId: app.user?.id, folder: "distributors", lang: app.lang, label: isArabic ? "صورة الموزع" : "Distributor Photo", previewClassName: "h-24 w-24 rounded-full object-cover", hint: isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "الاسم (عربي) *" : "Name (Arabic) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editFullNameAr, onChange: (e) => setEditFullNameAr(e.target.value), placeholder: isArabic ? "أحمد محمد" : "Ahmed", dir: "rtl", required: true, className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "الاسم (إنجليزي)" : "Name (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editFullNameEn, onChange: (e) => setEditFullNameEn(e.target.value), placeholder: "Ahmed Mohamad", className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "رقم الهاتف *" : "Phone *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editPhone, onChange: (e) => {
              const value = e.target.value;
              setEditPhone(value);
              const oldPhone = editingDistributor?.phone || "";
              setIsEditPhoneChanged(value !== oldPhone);
              if (value !== oldPhone && value.length >= 5) {
                checkEditPhoneAvailability(value);
              } else {
                setEditPhoneError(null);
                setEditPhoneAvailable(null);
              }
            }, placeholder: "0962XXXXXX", dir: "ltr", required: true, className: cn("rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20", editPhoneError && "border-red-500 focus-visible:ring-red-500", editPhoneAvailable === true && editPhone.length >= 5 && "border-emerald-400") }),
            editPhone.length >= 5 && isEditPhoneChanged && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 end-3 flex items-center", children: isEditPhoneChecking ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-emerald-300" }) : editPhoneAvailable === true ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-emerald-400" }) : editPhoneAvailable === false ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-red-400" }) : null })
          ] }),
          editPhoneError && isEditPhoneChanged && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
            editPhoneError
          ] }),
          editPhoneAvailable === true && isEditPhoneChanged && editPhone.length >= 5 && !editPhoneError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
            isArabic ? "✓ الرقم متاح" : "✓ Number is available"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "المحافظة" : "Governorate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editGovernorateId || void 0, onValueChange: setEditGovernorateId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر المحافظة" : "Select governorate" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: governorates.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g.id, children: isArabic ? g.name_ar : g.name_en }, g.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "العنوان (عربي)" : "Address (Arabic)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editAddressAr, onChange: (e) => setEditAddressAr(e.target.value), placeholder: isArabic ? "دمشق" : "Damascus", dir: "rtl", className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "العنوان (إنجليزي)" : "Address (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editAddressEn, onChange: (e) => setEditAddressEn(e.target.value), placeholder: "Damascus", className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "نوع الموزع" : "Distributor Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editDistributorType, onValueChange: setEditDistributorType, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "freelance", children: isArabic ? "🆓 مستقل" : "🆓 Freelance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "company_employee", children: isArabic ? "🏢 موظف شركة" : "🏢 Company Employee" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "متاح للعمل" : "Available" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editIsAvailable ? "available" : "unavailable", onValueChange: (value) => setEditIsAvailable(value === "available"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-4 border-t border-[#0d2e2a]/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => {
            setShowEditDistributorDialog(false);
            setEditingDistributor(null);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
            isArabic ? "إلغاء" : "Cancel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300", disabled: isEditing || isEditPhoneChanged && editPhoneAvailable === false, children: [
            isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1.5" }),
            isArabic ? "حفظ التغييرات" : "Save Changes"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  color
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold mt-1", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-lg flex items-center justify-center", colors[color]), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) })
  ] }) });
}
function DistributorCard({
  distributor,
  isArabic,
  onEdit,
  onToggleActive
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300", children: distributor.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: distributor.avatar_url, alt: "", className: "h-full w-full object-cover rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-[#2a655f]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg line-clamp-1 group-hover:text-[#2a655f] transition-colors", children: isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar }),
          distributor.is_available ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 border-0 text-[9px] animate-pulse", children: [
            "● ",
            isArabic ? "متاح" : "Available"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/10 text-red-500 border-0 text-[9px]", children: [
            "● ",
            isArabic ? "غير متاح" : "Unavailable"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground flex-wrap mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-yellow-400 text-yellow-400" }),
            Number(distributor.rating || 0).toFixed(1)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
            distributor.completed_orders || 0,
            " ",
            isArabic ? "طلب" : "orders"
          ] }),
          distributor.governorates && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
              isArabic ? distributor.governorates.name_ar : distributor.governorates.name_en
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 text-xs text-muted-foreground mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }),
          distributor.phone
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-all duration-300 hover:scale-110 group/btn", onClick: (e) => {
          e.stopPropagation();
          onEdit();
        }, title: isArabic ? "تعديل الموزع" : "Edit Distributor", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-3.5 w-3.5 group-hover/btn:rotate-12 transition-transform duration-300" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: cn("h-8 w-8 rounded-xl transition-all duration-300 hover:scale-110 group/btn", distributor.is_available ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"), onClick: (e) => {
          e.stopPropagation();
          onToggleActive(distributor);
        }, title: distributor.is_available ? isArabic ? "تعطيل الموزع" : "Deactivate Distributor" : isArabic ? "تفعيل الموزع" : "Activate Distributor", children: distributor.is_available ? /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-3.5 w-3.5 group-hover/btn:rotate-12 transition-transform duration-300" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-3.5 w-3.5 group-hover/btn:rotate-12 transition-transform duration-300" }) })
      ] })
    ] }),
    !distributor.is_available && distributor.deactivated_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-xs text-muted-foreground flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
      isArabic ? `تم التعطيل: ${new Date(distributor.deactivated_at).toLocaleDateString()}` : `Deactivated: ${new Date(distributor.deactivated_at).toLocaleDateString()}`
    ] }),
    distributor.delivery_company_id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3.5 w-3.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "تابع لشركة:" : "Belongs to:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#2a655f]", children: distributor.delivery_company?.name_ar || distributor.delivery_company?.name_en || (isArabic ? "شركة توصيل" : "Delivery Company") })
    ] }) })
  ] });
}
export {
  DistributorsPage as component
};
