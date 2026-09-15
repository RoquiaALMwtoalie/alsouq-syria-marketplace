import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, a as useT, b7 as useMyDeliveryCompany, ay as useDistributors, az as useDeliveryOrders, f as useGovernorates, ax as useDeliveryCompanies, b4 as useUserRoles, aI as useConversations, aJ as useUnreadCount, aq as useUserNotifications, aL as useGetOrCreateConversation, aA as useUpdateDeliveryCompany, bd as useUpdateDistributor, au as useMarkNotificationReadV2, be as useMarkAllNotificationsReadV2, bf as useAcceptDeliveryOrder, bg as useRejectDeliveryOrder, b8 as TooltipProvider, b9 as Tooltip, ba as TooltipTrigger, b as Button, bb as TooltipContent, D as Dialog, g as DialogContent, q as DialogHeader, l as DialogTitle, B as Badge, c as cn, w as DialogFooter, m as DialogDescription, I as Input, $ as DropdownMenu, a0 as DropdownMenuTrigger, a1 as DropdownMenuContent, a2 as DropdownMenuItem, aH as Skeleton, _ as DialogTrigger, d as ImageInput, L as Label, S as Select, r as SelectTrigger, s as SelectValue, t as SelectContent, v as SelectItem, k as formatPrice, P as Avatar, Q as AvatarImage, U as AvatarFallback, bc as DropdownMenuSeparator, b2 as AddressPicker, j as Textarea, aw as NOTIFICATION_CONFIG, ap as NOTIFICATION_TYPES, bh as useDeliveryOrderDetails } from "./router-BU7AgYzK.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-C7XU6h8z.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as Truck, ai as Bell, o as MessageCircle, cG as Languages, g as Sparkles, cH as CircleUser, aj as BellOff, cw as BadgeCheck, aq as Award, Z as Zap, bS as Target, cz as Compass, F as Flame, l as Crown, bt as Gem, ar as Rocket, a1 as Shield, i as ShoppingBag, a9 as Settings, aa as Globe, O as Calendar, ak as TrendingUp, G as Gift, al as Megaphone, P as Package, c as Store, N as CircleX, e as CircleCheckBig, b as Clock, U as User, h as Star, cp as UserCheck, cj as Coins, t as Users, q as Search, s as Funnel, y as ChevronDown, u as Check, bV as FileSpreadsheet, an as FileText, bA as Printer, a as ChevronLeft, C as ChevronRight, ah as UserPlus, c3 as EyeOff, cr as Lock, X, bT as Activity, bU as DollarSign, r as Phone, p as LoaderCircle, _ as CircleAlert, R as RefreshCw, ci as PowerOff, $ as Info, a4 as CircleCheck, a0 as MapPin, L as Layers, aS as Bike, B as Building2, cE as PenLine, cI as KeyRound, af as LogOut, W as Eye, cJ as PackageCheck, bX as Save, cF as Map, cf as Wallet, E as EllipsisVertical, ch as Power, cK as UserRoundPlus, cL as UsersRound, k as ShieldCheck, cM as UserPen, cN as UserX, d as TriangleAlert, v as Trash2 } from "../_libs/lucide-react.mjs";
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
function DeliveryAdminsManager({ companyId, companyName, isArabic, onAdminAdded }) {
  const [admins, setAdmins] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showAddDialog, setShowAddDialog] = reactExports.useState(false);
  const [isAdding, setIsAdding] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [companyOwnerId, setCompanyOwnerId] = reactExports.useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = reactExports.useState(false);
  const [deletingAdmin, setDeletingAdmin] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [showEditAdminDialog, setShowEditAdminDialog] = reactExports.useState(false);
  const [editingAdmin, setEditingAdmin] = reactExports.useState(null);
  const [editPhone, setEditPhone] = reactExports.useState("");
  const [editFullName, setEditFullName] = reactExports.useState("");
  const [isPhoneChanged, setIsPhoneChanged] = reactExports.useState(false);
  const [phoneCheckLoading, setPhoneCheckLoading] = reactExports.useState(false);
  const [phoneAvailable, setPhoneAvailable] = reactExports.useState(null);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [phone, setPhone] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [fullName, setFullName] = reactExports.useState("");
  const fetchCompanyOwner = reactExports.useCallback(async () => {
    if (!companyId) return null;
    try {
      const { data, error } = await supabase.from("delivery_companies").select("created_by").eq("id", companyId).single();
      if (error) throw error;
      return data?.created_by;
    } catch (error) {
      console.error("Error fetching company owner:", error);
      return null;
    }
  }, [companyId]);
  const fetchAdmins = reactExports.useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const ownerId = await fetchCompanyOwner();
      setCompanyOwnerId(ownerId);
      const { data: adminRecords, error: adminError } = await supabase.from("delivery_company_admins").select(`
          id,
          company_id,
          user_id,
          created_at,
          profiles:user_id (
            id,
            full_name,
            phone,
            avatar_url
          )
        `).eq("company_id", companyId);
      if (adminError) throw adminError;
      if (adminRecords && adminRecords.length > 0) {
        const merged = adminRecords.map((record) => ({
          ...record.profiles,
          admin_id: record.id,
          admin_since: record.created_at,
          role: "delivery_company",
          is_owner: record.profiles?.id === ownerId
        }));
        setAdmins(merged);
      } else {
        if (ownerId) {
          const { data: ownerProfile, error: ownerError } = await supabase.from("profiles").select("id, full_name, phone, avatar_url").eq("id", ownerId).single();
          if (!ownerError && ownerProfile) {
            const { error: insertError } = await supabase.from("delivery_company_admins").insert({
              company_id: companyId,
              user_id: ownerId
            }).select().single();
            if (insertError) {
              console.warn("⚠️ Could not auto-add owner as admin:", insertError);
            } else {
              await fetchAdmins();
              return;
            }
          }
        }
        setAdmins([]);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error(isArabic ? "❌ فشل جلب المدراء" : "❌ Failed to fetch managers");
    } finally {
      setLoading(false);
    }
  }, [companyId, isArabic, fetchCompanyOwner]);
  const checkPhoneAvailability = async (phone2, excludeUserId) => {
    if (!phone2 || phone2.length < 9) {
      setPhoneAvailable(null);
      return;
    }
    setPhoneCheckLoading(true);
    try {
      const query = supabase.from("profiles").select("id, phone").eq("phone", phone2);
      if (excludeUserId) {
        query.neq("id", excludeUserId);
      }
      const { data: existingProfile, error: profileError } = await query.maybeSingle();
      if (profileError) throw profileError;
      if (existingProfile) {
        setPhoneAvailable(false);
        setPhoneCheckLoading(false);
        return;
      }
      setPhoneAvailable(true);
    } catch (error) {
      console.error("Error checking phone:", error);
      setPhoneAvailable(false);
    } finally {
      setPhoneCheckLoading(false);
    }
  };
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }
    if (!password || password.length < 6) {
      toast.error(isArabic ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password must be at least 6 characters");
      return;
    }
    setIsAdding(true);
    try {
      const response = await fetch(
        `${"https://jjqgfjpxaxjpyohvcbfi.supabase.co"}/functions/v1/create-company-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${"sb_publishable_fEPybgejg_mSqpmlDj6rNw_7o67e7nt"}`
          },
          body: JSON.stringify({
            phone: phone.trim(),
            password,
            full_name_ar: fullName || `مدير ${phone}`,
            full_name_en: `Manager ${phone}`,
            company_id: companyId,
            role: "delivery_company"
          })
        }
      );
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to add manager");
      }
      toast.success(
        isArabic ? `✅ تم إضافة المدير بنجاح
📱 ${phone}
🔑 ${password}` : `✅ Manager added successfully
📱 ${phone}
🔑 ${password}`
      );
      setShowAddDialog(false);
      setPhone("");
      setPassword("");
      setFullName("");
      setIsAdding(false);
      await fetchAdmins();
      if (onAdminAdded) onAdminAdded();
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error(
        isArabic ? `❌ فشل إضافة المدير: ${error.message || "خطأ غير معروف"}` : `❌ Failed to add manager: ${error.message || "Unknown error"}`
      );
      setIsAdding(false);
    }
  };
  const openEditAdminDialog = (admin) => {
    setEditingAdmin(admin);
    setEditPhone(admin.phone || "");
    setEditFullName(admin.full_name || "");
    setIsPhoneChanged(false);
    setPhoneAvailable(null);
    setShowEditAdminDialog(true);
  };
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!editingAdmin) return;
    if (!editPhone || editPhone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }
    if (!editFullName || editFullName.length < 2) {
      toast.error(isArabic ? "❌ الاسم مطلوب" : "❌ Name is required");
      return;
    }
    if (editPhone === editingAdmin.phone && editFullName === editingAdmin.full_name) {
      setShowEditAdminDialog(false);
      setEditingAdmin(null);
      setEditPhone("");
      setEditFullName("");
      setIsPhoneChanged(false);
      setPhoneAvailable(null);
      return;
    }
    if (isPhoneChanged && phoneAvailable === false) {
      toast.error(isArabic ? "❌ هذا الرقم مستخدم من قبل" : "❌ This number is already in use");
      return;
    }
    setIsEditing(true);
    try {
      const userId = editingAdmin.id;
      const { error: profileError } = await supabase.from("profiles").update({
        full_name: editFullName.trim(),
        phone: editPhone.trim()
      }).eq("id", userId);
      if (profileError) throw profileError;
      if (isPhoneChanged) {
        try {
          const { error: authError } = await supabase.auth.admin.updateUserById(
            userId,
            { phone: editPhone.trim() }
          );
          if (authError) {
            console.warn("⚠️ Could not update auth user phone:", authError);
          }
        } catch (authError) {
          console.warn("⚠️ Auth update skipped:", authError);
        }
      }
      toast.success(
        isArabic ? `✅ تم تحديث معلومات المدير بنجاح` : `✅ Admin information updated successfully`
      );
      setShowEditAdminDialog(false);
      setEditingAdmin(null);
      setEditPhone("");
      setEditFullName("");
      setIsPhoneChanged(false);
      setPhoneAvailable(null);
      setIsEditing(false);
      await fetchAdmins();
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error(
        isArabic ? `❌ فشل تحديث المعلومات: ${error.message || "خطأ غير معروف"}` : `❌ Failed to update information: ${error.message || "Unknown error"}`
      );
      setIsEditing(false);
    }
  };
  const openDeleteDialog = (admin) => {
    setDeletingAdmin(admin);
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = async () => {
    if (!deletingAdmin) return;
    setIsDeleting(true);
    try {
      const { error: adminError } = await supabase.from("delivery_company_admins").delete().eq("id", deletingAdmin.admin_id);
      if (adminError) throw adminError;
      toast.success(
        isArabic ? `✅ تم حذف "${deletingAdmin.full_name || deletingAdmin.phone}" من المدراء` : `✅ Removed "${deletingAdmin.full_name || deletingAdmin.phone}" from managers`
      );
      setShowDeleteDialog(false);
      setDeletingAdmin(null);
      setIsDeleting(false);
      await fetchAdmins();
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error(isArabic ? "❌ فشل حذف المدير" : "❌ Failed to remove manager");
      setIsDeleting(false);
    }
  };
  reactExports.useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-br from-[#d81b60] to-[#f48fb1] flex items-center justify-center text-white shadow-lg shadow-[#d81b60]/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "مدراء الشركة" : "Company Managers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#fbcfe8]/30 text-[#d81b60] border-[#f9a8d4]/30", children: admins.length })
        ] }),
        companyName && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#d81b60]" }),
          isArabic ? `إدارة مدراء شركة "${companyName}"` : `Manage managers of "${companyName}"`
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#d81b60]/30 rounded-xl",
          onClick: () => setShowAddDialog(true),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundPlus, { className: "h-4 w-4 mr-1.5" }),
            isArabic ? "إضافة مدير" : "Add Manager"
          ]
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" }, i)) }) : admins.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#f9a8d4]/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#fbcfe8]/30 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-10 w-10 text-[#d81b60]/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "لا يوجد مدراء" : "No managers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: isArabic ? "قم بإضافة مدراء لشركة التوصيل" : "Add managers to your delivery company" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: admins.map((admin) => {
      const isOwner = admin.id === companyOwnerId;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:border-[#f9a8d4]/60 transition-all duration-300 hover:scale-[1.02] group",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full bg-[#fbcfe8]/40 flex items-center justify-center shrink-0 border-2 border-[#f9a8d4]/30 group-hover:border-[#d81b60]/50 transition-all duration-300", children: admin.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: admin.avatar_url, alt: "", className: "h-full w-full object-cover rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-[#d81b60]", children: admin.full_name?.charAt(0) || "M" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-slate-900 dark:text-white group-hover:text-[#d81b60] transition-colors duration-300 line-clamp-1", children: admin.full_name || admin.phone }),
                isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-2.5 w-2.5 inline mr-0.5" }),
                  isArabic ? "المالك" : "Owner"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-2.5 w-2.5 inline mr-0.5" }),
                  isArabic ? "مدير" : "Manager"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground flex-wrap mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", dir: "ltr", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                  admin.phone
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                  admin.admin_since ? new Date(admin.admin_since).toLocaleDateString(isArabic ? "ar-SA" : "en-US") : new Date(admin.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US")
                ] })
              ] })
            ] }),
            !isOwner && admin.admin_id && /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "h-9 w-9 rounded-xl bg-gradient-to-br from-[#fbcfe8]/50 to-[#f9a8d4]/30 hover:from-[#fbcfe8]/70 hover:to-[#f9a8d4]/50 border border-[#f9a8d4]/30 hover:border-[#d81b60]/50 text-[#d81b60] hover:text-[#c2185b] dark:text-[#f9a8d4] dark:hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#d81b60]/25 group",
                    onClick: () => openEditAdminDialog(admin),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPen, { className: "h-4 w-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "bg-[#0d2e2a] text-white border-[#0d2e2a]/30 text-xs font-medium", children: isArabic ? "تعديل المدير" : "Edit Manager" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "h-9 w-9 rounded-xl bg-gradient-to-br from-red-500/15 to-rose-600/10 hover:from-red-500/30 hover:to-rose-600/25 border border-red-500/20 hover:border-red-500/40 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 group",
                    onClick: () => openDeleteDialog(admin),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-4 w-4 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300" })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "bg-[#0d2e2a] text-white border-[#0d2e2a]/30 text-xs font-medium", children: isArabic ? "حذف المدير" : "Delete Manager" })
              ] })
            ] }) })
          ] })
        },
        admin.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAddDialog, onOpenChange: setShowAddDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-[#f9a8d4]/30 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-[#d81b60] to-[#f48fb1] flex items-center justify-center text-white shadow-lg shadow-[#d81b60]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundPlus, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "➕ إضافة مدير شركة" : "➕ Add Company Manager" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? "سيتم إنشاء حساب جديد لمدير الشركة برقم هاتف وكلمة مرور" : "A new company manager account will be created with phone and password" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddAdmin, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "الاسم الكامل (اختياري)" : "Full Name (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: fullName,
                onChange: (e) => setFullName(e.target.value),
                placeholder: isArabic ? "مدير الشركة" : "Company Manager",
                className: "rounded-xl border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#d81b60] dark:text-[#f9a8d4]", children: [
              isArabic ? "رقم الهاتف" : "Phone Number",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: phone,
                onChange: (e) => setPhone(e.target.value),
                type: "tel",
                placeholder: "09XXXXXXXX",
                required: true,
                className: "rounded-xl border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "سيتم استخدام هذا الرقم لتسجيل الدخول" : "This number will be used for login" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#d81b60] dark:text-[#f9a8d4]", children: [
              isArabic ? "كلمة المرور" : "Password",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  type: showPassword ? "text" : "password",
                  placeholder: "********",
                  required: true,
                  minLength: 6,
                  className: "rounded-xl border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 pe-10"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-[#d81b60] transition-colors",
                  children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "6 أحرف على الأقل" : "At least 6 characters" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground bg-[#fbcfe8]/20 p-3 rounded-xl border border-[#f9a8d4]/30", children: isArabic ? `🔗 سيتم ربط المدير بشركة "${companyName || ""}"` : `🔗 Manager will be linked to company "${companyName || ""}"` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-4 border-t border-[#f9a8d4]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => setShowAddDialog(false), className: "border-[#f9a8d4]/30 hover:bg-[#fbcfe8]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
            isArabic ? "إلغاء" : "Cancel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              className: "bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] transition-all duration-300 shadow-lg shadow-[#d81b60]/30",
              disabled: isAdding,
              children: [
                isAdding ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundPlus, { className: "h-4 w-4 mr-1.5" }),
                isArabic ? "إضافة مدير" : "Add Manager"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showEditAdminDialog, onOpenChange: setShowEditAdminDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-[#f9a8d4]/30 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-[#d81b60] to-[#f48fb1] flex items-center justify-center text-white shadow-lg shadow-[#d81b60]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPen, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-[#d81b60] dark:text-[#f9a8d4]", children: isArabic ? "✏️ تعديل معلومات المدير" : "✏️ Edit Manager Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? "تحديث اسم ورقم هاتف المدير" : "Update manager name and phone number" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdateAdmin, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#d81b60] dark:text-[#f9a8d4]", children: [
              isArabic ? "الاسم الكامل" : "Full Name",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editFullName,
                onChange: (e) => setEditFullName(e.target.value),
                placeholder: isArabic ? "اسم المدير" : "Manager name",
                required: true,
                className: "rounded-xl border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#d81b60] dark:text-[#f9a8d4]", children: [
              isArabic ? "رقم الهاتف" : "Phone Number",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editPhone,
                  onChange: (e) => {
                    const newPhone = e.target.value;
                    setEditPhone(newPhone);
                    const oldPhone = editingAdmin?.phone || "";
                    setIsPhoneChanged(newPhone !== oldPhone);
                    if (newPhone !== oldPhone && newPhone.length >= 9) {
                      checkPhoneAvailability(newPhone, editingAdmin?.id);
                    } else {
                      setPhoneAvailable(null);
                    }
                  },
                  type: "tel",
                  placeholder: "09XXXXXXXX",
                  required: true,
                  className: cn(
                    "rounded-xl border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20",
                    isPhoneChanged && phoneAvailable === false && "border-red-500 focus-visible:ring-red-500",
                    isPhoneChanged && phoneAvailable === true && "border-emerald-500 focus-visible:ring-emerald-500"
                  )
                }
              ),
              isPhoneChanged && phoneCheckLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 end-3 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-[#d81b60]" }) }),
              isPhoneChanged && !phoneCheckLoading && phoneAvailable === false && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 end-3 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-red-500" }) }),
              isPhoneChanged && !phoneCheckLoading && phoneAvailable === true && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 end-3 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-emerald-500" }) })
            ] }),
            isPhoneChanged && phoneAvailable === false && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
              isArabic ? "هذا الرقم مستخدم من قبل" : "This number is already in use"
            ] }),
            isPhoneChanged && phoneAvailable === true && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-500 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
              isArabic ? "✓ الرقم متاح" : "✓ Number is available"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "سيتم تحديث رقم الهاتف في حساب المدير" : "Phone number will be updated in manager's account" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-4 border-t border-[#f9a8d4]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => {
            setShowEditAdminDialog(false);
            setEditingAdmin(null);
            setEditPhone("");
            setEditFullName("");
            setIsPhoneChanged(false);
            setPhoneAvailable(null);
          }, className: "border-[#f9a8d4]/30 hover:bg-[#fbcfe8]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
            isArabic ? "إلغاء" : "Cancel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              className: "bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] transition-all duration-300 shadow-lg shadow-[#d81b60]/30",
              disabled: isEditing || isPhoneChanged && phoneAvailable === false,
              children: [
                isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1.5" }),
                isEditing ? isArabic ? "جاري الحفظ..." : "Saving..." : isArabic ? "حفظ التغييرات" : "Save Changes"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDeleteDialog, onOpenChange: setShowDeleteDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-0 p-0 overflow-hidden shadow-2xl bg-white dark:bg-slate-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-7 w-7 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-1 rounded-2xl bg-red-400/30 blur-lg animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-bold", children: isArabic ? "⚠️ تأكيد الحذف" : "⚠️ Confirm Deletion" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm mt-0.5", children: isArabic ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border-2 border-red-200/50 dark:border-red-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-5 w-5 text-red-600 dark:text-red-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-red-700 dark:text-red-300", children: isArabic ? "هل أنت متأكد؟" : "Are you sure?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600/80 dark:text-red-400/70", children: isArabic ? `سيتم حذف "${deletingAdmin?.full_name || deletingAdmin?.phone || ""}" من مدراء الشركة` : `"${deletingAdmin?.full_name || deletingAdmin?.phone || ""}" will be removed from company managers` })
          ] })
        ] }),
        deletingAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3", children: isArabic ? "📋 معلومات المدير" : "📋 Manager Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "الاسم" : "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-900 dark:text-white", children: deletingAdmin.full_name || deletingAdmin.phone || "-" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "رقم الهاتف" : "Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-900 dark:text-white", dir: "ltr", children: deletingAdmin.phone || "-" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700 dark:text-amber-400", children: isArabic ? "سيتم إلغاء صلاحيات المدير فقط، ولن يتم حذف حسابه بالكامل" : "Only manager permissions will be revoked, the account will not be deleted" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setShowDeleteDialog(false);
              setDeletingAdmin(null);
            },
            className: "flex-1 rounded-xl",
            disabled: isDeleting,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
              isArabic ? "إلغاء" : "Cancel"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "destructive",
            onClick: handleConfirmDelete,
            disabled: isDeleting,
            className: "flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300",
            children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
              isArabic ? "جاري الحذف..." : "Deleting..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
              isArabic ? "تأكيد الحذف" : "Confirm Delete"
            ] })
          }
        )
      ] })
    ] }) })
  ] });
}
async function extractGovernorateFromAddress(address, lat, lng) {
  try {
    if (lat && lng) {
      const { data: governorates } = await supabase.from("governorates").select("*");
      if (governorates) {
        for (const g of governorates) {
          if (g.center_lat && g.center_lng) {
            const distance = Math.sqrt(
              Math.pow(lat - g.center_lat, 2) + Math.pow(lng - g.center_lng, 2)
            );
            if (distance < 0.5) {
              return {
                governorate_id: g.id,
                governorate_name: g.name_ar
              };
            }
          }
        }
      }
    }
    if (address) {
      const { data: governorates } = await supabase.from("governorates").select("*");
      if (governorates) {
        for (const g of governorates) {
          if (address.includes(g.name_ar) || address.includes(g.name_en || "")) {
            return {
              governorate_id: g.id,
              governorate_name: g.name_ar
            };
          }
        }
      }
    }
    const { data: defaultGov } = await supabase.from("governorates").select("id, name_ar").eq("name_ar", "دمشق").single();
    if (defaultGov) {
      return {
        governorate_id: defaultGov.id,
        governorate_name: defaultGov.name_ar
      };
    }
    return { governorate_id: "", governorate_name: "" };
  } catch (error) {
    console.error("Error extracting governorate:", error);
    return { governorate_id: "", governorate_name: "" };
  }
}
function DeliveryAccountMenu({
  userData,
  companyName,
  isArabic,
  companyId,
  onCompanyUpdated
}) {
  useNavigate();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [showEditCompanyDialog, setShowEditCompanyDialog] = reactExports.useState(false);
  const [editLoading, setEditLoading] = reactExports.useState(false);
  const [companyData, setCompanyData] = reactExports.useState(null);
  const [isPhoneChanged, setIsPhoneChanged] = reactExports.useState(false);
  const [phoneCheckLoading, setPhoneCheckLoading] = reactExports.useState(false);
  const [phoneAvailable, setPhoneAvailable] = reactExports.useState(null);
  const [addressMethod, setAddressMethod] = reactExports.useState("manual");
  const [location, setLocation] = reactExports.useState(null);
  const [oldPassword, setOldPassword] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const fetchCompanyData = async () => {
    if (!companyId) return;
    try {
      const { data: companyData2, error: companyError } = await supabase.from("delivery_companies").select("*").eq("id", companyId).single();
      if (companyError) throw companyError;
      const { data: profileData, error: profileError } = await supabase.from("profiles").select("address_text, lat, lng, governorate_id").eq("id", userData.id).single();
      if (profileError) {
        console.warn("⚠️ Could not fetch profile:", profileError);
      }
      const mergedData = {
        ...companyData2,
        address_ar: profileData?.address_text || companyData2?.address_ar || "",
        lat: profileData?.lat || 0,
        lng: profileData?.lng || 0,
        governorate_id: profileData?.governorate_id || companyData2?.governorate_id || null
      };
      console.log("📍 Merged data:", {
        address_ar: mergedData.address_ar,
        lat: mergedData.lat,
        lng: mergedData.lng
      });
      setCompanyData(mergedData);
      setIsPhoneChanged(false);
      setPhoneAvailable(null);
      if (mergedData?.address_ar) {
        setLocation({
          address: mergedData.address_ar,
          lat: mergedData.lat || 0,
          lng: mergedData.lng || 0,
          label: mergedData.address_ar,
          details: mergedData.address_ar
        });
        if (mergedData.lat && mergedData.lng) {
          setAddressMethod("map");
          console.log("📍 Using map method (has coordinates), address:", mergedData.address_ar);
        } else {
          setAddressMethod("manual");
          console.log("📍 Using manual method (no coordinates), address:", mergedData.address_ar);
        }
      } else {
        setAddressMethod("manual");
        setLocation(null);
        console.log("📍 No address found, using manual method");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      toast.error(isArabic ? "❌ فشل جلب بيانات الشركة" : "❌ Failed to fetch company data");
    }
  };
  const checkPhoneAvailability = async (phone) => {
    if (!phone || phone.length < 9) {
      setPhoneAvailable(null);
      return;
    }
    setPhoneCheckLoading(true);
    try {
      const { data: existingProfile, error: profileError } = await supabase.from("profiles").select("id, phone").eq("phone", phone).maybeSingle();
      if (profileError) throw profileError;
      if (existingProfile) {
        const { data: companyCheck, error: companyError } = await supabase.from("delivery_companies").select("created_by").eq("id", companyId).single();
        if (companyError) throw companyError;
        const isSameOwner = companyCheck?.created_by === existingProfile.id;
        if (!isSameOwner) {
          setPhoneAvailable(false);
          setPhoneCheckLoading(false);
          return;
        }
      }
      const { data: existingCompany, error: companyError2 } = await supabase.from("delivery_companies").select("id").eq("phone", phone).neq("id", companyId).maybeSingle();
      if (companyError2) throw companyError2;
      if (existingCompany) {
        setPhoneAvailable(false);
      } else {
        setPhoneAvailable(true);
      }
    } catch (error) {
      console.error("Error checking phone:", error);
      setPhoneAvailable(false);
    } finally {
      setPhoneCheckLoading(false);
    }
  };
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    if (!companyData || !companyId) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newPhone = formData.get("phone");
    const newNameAr = formData.get("name_ar");
    if (!newPhone || newPhone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }
    if (isPhoneChanged && newPhone !== companyData.phone) {
      if (phoneAvailable === false) {
        toast.error(isArabic ? "❌ هذا الرقم مستخدم من قبل" : "❌ This number is already in use");
        return;
      }
    }
    setEditLoading(true);
    try {
      const patch = {
        name_ar: newNameAr,
        name_en: formData.get("name_en"),
        phone: newPhone,
        description_ar: formData.get("description_ar"),
        description_en: formData.get("description_en"),
        base_price: parseFloat(formData.get("base_price")) || 0,
        price_per_km: parseFloat(formData.get("price_per_km")) || 0,
        free_delivery_threshold: parseFloat(formData.get("free_delivery_threshold")) || 0,
        min_delivery_fee: parseFloat(formData.get("min_delivery_fee")) || 0,
        max_delivery_fee: parseFloat(formData.get("max_delivery_fee")) || 999999,
        avg_delivery_time: parseInt(formData.get("avg_delivery_time")) || 60,
        has_tracking: formData.get("has_tracking") === "on",
        has_insurance: formData.get("has_insurance") === "on",
        has_cod: formData.get("has_cod") === "on",
        has_express: formData.get("has_express") === "on",
        is_active: formData.get("is_active") === "on"
      };
      let governorateId = "";
      if (addressMethod === "map" && location) {
        patch.address_ar = location.address;
        patch.address_en = location.address;
        const result = await extractGovernorateFromAddress(
          location.address,
          location.lat,
          location.lng
        );
        governorateId = result.governorate_id;
        const { error: updateProfileError } = await supabase.from("profiles").update({
          lat: location.lat || 0,
          lng: location.lng || 0,
          address_text: location.address.trim(),
          governorate_id: governorateId || null
        }).eq("id", userData.id);
        if (updateProfileError) {
          console.error("❌ خطأ في تحديث البروفايل:", updateProfileError);
        }
      } else {
        const manualAddress = formData.get("address_ar");
        patch.address_ar = manualAddress;
        patch.address_en = manualAddress;
        const result = await extractGovernorateFromAddress(manualAddress);
        governorateId = result.governorate_id;
        const { error: updateProfileError } = await supabase.from("profiles").update({
          address_text: manualAddress.trim(),
          governorate_id: governorateId || null
        }).eq("id", userData.id);
        if (updateProfileError) {
          console.error("❌ خطأ في تحديث البروفايل:", updateProfileError);
        }
      }
      if (governorateId) {
        patch.governorate_id = governorateId;
      }
      const profileUpdate = {};
      if (newNameAr && newNameAr !== companyData.name_ar) {
        profileUpdate.full_name = newNameAr.trim();
      }
      if (isPhoneChanged && newPhone !== companyData.phone) {
        profileUpdate.phone = newPhone.trim();
      }
      if (Object.keys(profileUpdate).length > 0) {
        const { error: updateProfileError } = await supabase.from("profiles").update(profileUpdate).eq("id", userData.id);
        if (updateProfileError) {
          console.error("❌ خطأ في تحديث البروفايل:", updateProfileError);
        } else {
          console.log("✅ تم تحديث البروفايل:", profileUpdate);
        }
      }
      const { error: updateError } = await supabase.from("delivery_companies").update(patch).eq("id", companyId);
      if (updateError) throw updateError;
      toast.success(
        isArabic ? `✅ تم تحديث معلومات الشركة "${patch.name_ar}" بنجاح` : `✅ Company "${patch.name_en}" updated successfully`
      );
      setShowEditCompanyDialog(false);
      setEditLoading(false);
      setIsPhoneChanged(false);
      setPhoneAvailable(null);
      if (onCompanyUpdated) onCompanyUpdated();
      setCompanyData({ ...companyData, ...patch });
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(
        isArabic ? `❌ فشل تحديث الشركة: ${error.message || "خطأ غير معروف"}` : `❌ Failed to update company: ${error.message || "Unknown error"}`
      );
      setEditLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success(isArabic ? "✅ تم تسجيل الخروج بنجاح" : "✅ Logged out successfully");
      window.location.href = "/auth/login";
    } catch (error) {
      toast.error(isArabic ? "❌ فشل تسجيل الخروج" : "❌ Logout failed");
      console.error(error);
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error(isArabic ? "❌ كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" : "❌ New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(isArabic ? "❌ كلمة المرور غير متطابقة" : "❌ Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      toast.success(
        isArabic ? "✅ تم تغيير كلمة المرور بنجاح" : "✅ Password changed successfully"
      );
      setShowPasswordDialog(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage = error.message || "";
      let translatedMessage = "";
      if (errorMessage.includes("New password should be different from the old password")) {
        translatedMessage = isArabic ? "❌ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" : "❌ New password should be different from the old password";
      } else if (errorMessage.includes("Password should be at least 6 characters")) {
        translatedMessage = isArabic ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password should be at least 6 characters";
      } else if (errorMessage.includes("Invalid credentials") || errorMessage.includes("Invalid login credentials")) {
        translatedMessage = isArabic ? "❌ كلمة المرور الحالية غير صحيحة" : "❌ Current password is incorrect";
      } else {
        translatedMessage = isArabic ? `❌ فشل تغيير كلمة المرور` : `❌ Failed to change password`;
      }
      toast.error(translatedMessage);
    } finally {
      setLoading(false);
    }
  };
  const getInitials = (name) => {
    if (!name) return "D";
    return name.charAt(0).toUpperCase();
  };
  const openEditCompanyDialog = async () => {
    await fetchCompanyData();
    setShowEditCompanyDialog(true);
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#2a655f]/20 to-[#1a4f4a]/20 hover:from-[#2a655f]/30 hover:to-[#1a4f4a]/30 border border-[#3a8a82]/30 backdrop-blur-md transition-all duration-300 group shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1a4f4a] to-[#2a655f] text-white shadow-md overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-delivery-walk flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bike, { className: "h-4 w-4 text-emerald-300" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8 border-2 border-[#3a8a82]/50 group-hover:border-[#2a655f] transition-all duration-300 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: userData.avatar_url || void 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white text-xs font-black", children: getInitials(userData.full_name) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#2a655f]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-white truncate max-w-[110px]", children: userData.full_name || userData.phone || (isArabic ? "مسؤول التوصيل" : "Manager") }),
          companyName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-emerald-200/80 truncate max-w-[110px] font-medium", children: companyName })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-80 rounded-3xl p-1.5 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 shadow-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] p-4 rounded-2xl text-white shadow-inner relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-6 -bottom-6 opacity-10 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bike, { className: "w-32 h-32" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-12 w-12 border-2 border-white/30 shadow-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: userData.avatar_url || void 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-base font-black", children: getInitials(userData.full_name) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-extrabold text-sm text-white truncate", children: userData.full_name || userData.phone || (isArabic ? "مسؤول التوصيل" : "Manager") }),
              companyName && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-100 truncate font-semibold mt-0.5", children: [
                "🏢 ",
                companyName
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-white/80 truncate mt-0.5", dir: "ltr", children: [
                "📱 ",
                userData.phone || (isArabic ? "غير متاح" : "Not available")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white/20 text-white border border-white/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 backdrop-blur-md", children: isArabic ? "إدارة التوصيل" : "Delivery Admin" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1.5 space-y-1 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DropdownMenuItem,
            {
              onClick: openEditCompanyDialog,
              className: "rounded-2xl cursor-pointer py-3 px-3.5 hover:bg-[#e8f0ee]/30 dark:hover:bg-[#e8f0ee]/20 group transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-r from-[#2a655f]/20 to-[#1a4f4a]/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4 text-[#2a655f]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: isArabic ? "🏢 تعديل بيانات الشركة" : "🏢 Edit Company Info" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-medium", children: isArabic ? "تحديث اسم الشركة، رقم الهاتف، والعنوان" : "Update company name, phone, and address" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-3.5 w-3.5 text-[#2a655f] opacity-0 group-hover:opacity-100 transition-opacity" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DropdownMenuItem,
            {
              onClick: () => {
                setShowPasswordDialog(true);
                setIsOpen(false);
              },
              className: "rounded-2xl cursor-pointer py-3 px-3.5 hover:bg-[#e8f0ee]/30 dark:hover:bg-[#e8f0ee]/20 group transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-r from-[#2a655f]/20 to-[#1a4f4a]/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4 text-[#2a655f]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: isArabic ? "تغيير كلمة المرور" : "Change Password" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-medium", children: isArabic ? "تحديث وتأمين كلمة مرور حسابك" : "Update and secure your password" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-[#2a655f] opacity-0 group-hover:opacity-100 transition-opacity" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "my-1 bg-slate-100 dark:bg-slate-800" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DropdownMenuItem,
            {
              onClick: handleLogout,
              className: "rounded-2xl cursor-pointer py-3 px-3.5 hover:bg-red-50 dark:hover:bg-red-950/30 group transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-red-500/15 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-red-600 dark:text-red-400", children: isArabic ? "تسجيل الخروج" : "Logout" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-medium", children: isArabic ? "الخروج الآمن من لوحة تحكم التوصيل" : "Sign out safely from delivery dashboard" })
                ] })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5 bg-gradient-to-r from-[#e8f0ee]/20 to-[#1a4f4a]/10 dark:from-[#e8f0ee]/10 dark:to-[#1a4f4a]/20 rounded-2xl mt-1 border border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] font-semibold text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-[#2a655f] dark:text-[#3a8a82]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5" }),
            isArabic ? "نظام التوصيل الآمن" : "Secure System"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }),
            isArabic ? "متصل الآن" : "Online"
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showPasswordDialog, onOpenChange: setShowPasswordDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-3xl overflow-hidden p-0 border-[#3a8a82]/30 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] p-6 text-white relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-40 h-40" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-6 w-6 text-emerald-300" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg font-black tracking-tight", children: isArabic ? "🔑 تغيير كلمة المرور بأمان" : "🔑 Change Password Securely" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-white/85 text-xs mt-1 font-medium", children: isArabic ? "أدخل كلمة المرور الحالية والجديدة لتأمين حسابك في شركة التوصيل" : "Enter current and new password to secure your delivery account" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleChangePassword, className: "p-6 space-y-4 bg-white dark:bg-slate-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82]", children: [
            isArabic ? "كلمة المرور الحالية" : "Current Password",
            " *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "password",
              value: oldPassword,
              onChange: (e) => setOldPassword(e.target.value),
              placeholder: isArabic ? "أدخل كلمة المرور الحالية" : "Enter current password",
              required: true,
              className: "rounded-2xl h-11 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20 text-xs font-medium"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82]", children: [
            isArabic ? "كلمة المرور الجديدة" : "New Password",
            " *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: showPassword ? "text" : "password",
                value: newPassword,
                onChange: (e) => setNewPassword(e.target.value),
                placeholder: isArabic ? "أدخل كلمة المرور الجديدة" : "Enter new password",
                required: true,
                minLength: 6,
                className: "rounded-2xl h-11 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20 pe-10 text-xs font-medium"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute inset-y-0 end-0 flex items-center px-3.5 text-muted-foreground hover:text-[#2a655f] transition-colors",
                children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-medium", children: isArabic ? "يجب أن تكون 6 أحرف على الأقل" : "At least 6 characters" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82]", children: [
            isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password",
            " *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "password",
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              placeholder: isArabic ? "أعد إدخال كلمة المرور الجديدة" : "Re-enter new password",
              required: true,
              minLength: 6,
              className: cn(
                "rounded-2xl h-11 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20 text-xs font-medium",
                confirmPassword && newPassword !== confirmPassword && "border-red-500 focus-visible:ring-red-500"
              )
            }
          ),
          confirmPassword && newPassword !== confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-red-500 flex items-center gap-1 font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5" }),
            isArabic ? "كلمة المرور غير متطابقة" : "Passwords do not match"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gradient-to-r from-[#e8f0ee]/30 to-[#1a4f4a]/20 dark:from-[#e8f0ee]/20 dark:to-[#1a4f4a]/20 rounded-2xl border border-[#3a8a82]/30 flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PackageCheck, { className: "h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-[#2a655f] dark:text-[#3a8a82] font-semibold leading-relaxed", children: isArabic ? "سيتم تحديث كلمة المرور فورا وتأمين كافة عمليات التوصيل الخاصة بك." : "Password will be updated immediately to secure all your deliveries." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-3 gap-2 flex-row-reverse sm:flex-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: loading || !oldPassword || !newPassword || newPassword !== confirmPassword,
              className: "flex-1 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white rounded-2xl h-11 text-xs font-bold shadow-lg shadow-[#2a655f]/25",
              children: [
                loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1.5" }),
                loading ? isArabic ? "جاري الحفظ..." : "Saving..." : isArabic ? "حفظ التغييرات" : "Save Changes"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => {
                setShowPasswordDialog(false);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
              },
              className: "flex-1 rounded-2xl h-11 text-xs font-bold border-[#3a8a82]/30 dark:border-[#3a8a82]/20 hover:bg-[#e8f0ee]/30 dark:hover:bg-[#e8f0ee]/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
                isArabic ? "إلغاء" : "Cancel"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showEditCompanyDialog, onOpenChange: setShowEditCompanyDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-[#3a8a82]/30 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] p-6 text-white relative overflow-hidden sticky top-0 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setShowEditCompanyDialog(false);
              setIsPhoneChanged(false);
              setPhoneAvailable(null);
            },
            className: "absolute top-4 right-4 text-white/70 hover:text-white transition-all duration-200 hover:rotate-90 hover:scale-110 z-20",
            "aria-label": "Close dialog",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-40 h-40" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-6 w-6 text-emerald-300" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg font-black tracking-tight", children: isArabic ? "🏢 تعديل معلومات الشركة" : "🏢 Edit Company Info" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-white/85 text-xs mt-1 font-medium", children: isArabic ? "تحديث بيانات شركة التوصيل الخاصة بك" : "Update your delivery company information" })
          ] })
        ] })
      ] }),
      companyData && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdateCompany, className: "p-6 bg-white dark:bg-slate-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5" }),
              isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                name: "name_ar",
                defaultValue: companyData?.name_ar || "",
                placeholder: isArabic ? "شركة التوصيل السريع" : "Fast Delivery Company",
                required: true,
                className: "rounded-2xl h-11 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5" }),
              isArabic ? "اسم الشركة (إنجليزي)" : "Company Name (English)",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                name: "name_en",
                defaultValue: companyData?.name_en || "",
                placeholder: isArabic ? "Fast Delivery Company" : "Fast Delivery Company",
                required: true,
                className: "rounded-2xl h-11 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }),
            isArabic ? "رقم الهاتف" : "Phone",
            " *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                name: "phone",
                type: "tel",
                defaultValue: companyData?.phone || "",
                onChange: (e) => {
                  const newPhone = e.target.value;
                  const oldPhone = companyData?.phone || "";
                  setIsPhoneChanged(newPhone !== oldPhone);
                  if (newPhone !== oldPhone && newPhone.length >= 9) {
                    checkPhoneAvailability(newPhone);
                  } else {
                    setPhoneAvailable(null);
                  }
                },
                required: true,
                className: cn(
                  "rounded-2xl h-11 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20",
                  isPhoneChanged && phoneAvailable === false && "border-red-500 focus-visible:ring-red-500",
                  isPhoneChanged && phoneAvailable === true && "border-emerald-500 focus-visible:ring-emerald-500"
                )
              }
            ),
            isPhoneChanged && phoneCheckLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 end-3 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-[#2a655f]" }) }),
            isPhoneChanged && !phoneCheckLoading && phoneAvailable === false && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 end-3 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-red-500" }) }),
            isPhoneChanged && !phoneCheckLoading && phoneAvailable === true && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 end-3 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-emerald-500" }) })
          ] }),
          isPhoneChanged && phoneAvailable === false && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
            isArabic ? "هذا الرقم مستخدم من قبل" : "This number is already in use"
          ] }),
          isPhoneChanged && phoneAvailable === true && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
            isArabic ? "✓ الرقم متاح" : "✓ Number is available"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "📍 طريقة إدخال العنوان" : "📍 Address Input Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setAddressMethod("manual"),
                className: `
                      flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 border-2
                      ${addressMethod === "manual" ? "bg-gradient-to-r from-[#e8f0ee]/30 to-[#1a4f4a]/20 border-[#2a655f] dark:bg-[#e8f0ee]/20" : "bg-slate-50 dark:bg-slate-800/50 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 hover:bg-[#e8f0ee]/20 dark:hover:bg-[#e8f0ee]/10"}
                    `,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-4 w-4 text-[#2a655f]" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-[#2a655f] dark:text-white", children: isArabic ? "📝 كتابة يدوية" : "✏️ Manual" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setAddressMethod("map"),
                className: `
                      flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 border-2
                      ${addressMethod === "map" ? "bg-gradient-to-r from-[#e8f0ee]/30 to-[#1a4f4a]/20 border-[#2a655f] dark:bg-[#e8f0ee]/20" : "bg-slate-50 dark:bg-slate-800/50 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 hover:bg-[#e8f0ee]/20 dark:hover:bg-[#e8f0ee]/10"}
                    `,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-4 w-4 text-[#2a655f]" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-[#2a655f] dark:text-white", children: isArabic ? "🗺️ اختيار من الخريطة" : "🗺️ Map" })
                ]
              }
            )
          ] })
        ] }),
        addressMethod === "manual" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 mt-4 animate-in fade-in-50 duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
            isArabic ? "العنوان" : "Address",
            " *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              name: "address_ar",
              defaultValue: companyData?.address_ar || "",
              placeholder: isArabic ? "مثال: شارع الأندلس، مبنى 5" : "Example: Al-Andalus Street, Building 5",
              required: true,
              className: "rounded-2xl h-11 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
            }
          )
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mt-4 animate-in fade-in-50 duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-3.5 w-3.5" }),
            isArabic ? "اختر موقعك على الخريطة" : "Select your location on the map",
            " *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-white dark:bg-slate-800/50 p-3 border-2 border-[#3a8a82]/30 focus-within:border-[#2a655f] transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            AddressPicker,
            {
              value: location ?? void 0,
              onChange: setLocation,
              lang: isArabic ? "ar" : "en"
            }
          ) }),
          location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1", children: [
            "✅ ",
            isArabic ? "تم اختيار الموقع" : "Location selected"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isArabic ? "📍 سيتم استخدام العنوان المختار من الخريطة تلقائياً" : "📍 The selected address from the map will be used automatically" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
              isArabic ? "الوصف (عربي)" : "Description (Arabic)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                name: "description_ar",
                defaultValue: companyData?.description_ar || "",
                placeholder: isArabic ? "وصف الشركة بالعربية" : "Company description in Arabic",
                rows: 3,
                className: "rounded-2xl border-[#3a8a82]/30 dark:border-[#3a8a82]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
              isArabic ? "الوصف (إنجليزي)" : "Description (English)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                name: "description_en",
                defaultValue: companyData?.description_en || "",
                placeholder: isArabic ? "وصف الشركة بالإنجليزية" : "Company description in English",
                rows: 3,
                className: "rounded-2xl border-[#3a8a82]/30 dark:border-[#3a8a82]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]", children: [
              isArabic ? "السعر الأساسي" : "Base Price",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground", children: "ل.س" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "base_price",
                  type: "number",
                  step: "0.01",
                  defaultValue: companyData?.base_price || 0,
                  required: true,
                  className: "rounded-2xl h-10 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 ps-10 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]", children: [
              isArabic ? "سعر الكيلومتر" : "Price per KM",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground", children: "ل.س" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "price_per_km",
                  type: "number",
                  step: "0.01",
                  defaultValue: companyData?.price_per_km || 0,
                  required: true,
                  className: "rounded-2xl h-10 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 ps-10 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]", children: [
              isArabic ? "الحد الأدنى" : "Min Fee",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground", children: "ل.س" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "min_delivery_fee",
                  type: "number",
                  step: "0.01",
                  defaultValue: companyData?.min_delivery_fee || 0,
                  required: true,
                  className: "rounded-2xl h-10 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 ps-10 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]", children: [
              isArabic ? "الحد الأقصى" : "Max Fee",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground", children: "ل.س" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "max_delivery_fee",
                  type: "number",
                  step: "0.01",
                  defaultValue: companyData?.max_delivery_fee || 999999,
                  required: true,
                  className: "rounded-2xl h-10 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 ps-10 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "قيمة التوصيل المجاني" : "Free Delivery Threshold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground", children: "ل.س" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "free_delivery_threshold",
                  type: "number",
                  step: "0.01",
                  defaultValue: companyData?.free_delivery_threshold || 0,
                  className: "rounded-2xl h-10 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 ps-10 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]", children: [
              isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                name: "avg_delivery_time",
                type: "number",
                defaultValue: companyData?.avg_delivery_time || 60,
                required: true,
                className: "rounded-2xl h-10 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isArabic ? "بالدقائق" : "In minutes" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-[#e8f0ee]/20 to-[#1a4f4a]/10 dark:from-[#e8f0ee]/10 dark:to-[#1a4f4a]/20 rounded-xl mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-[#2a655f] dark:text-[#3a8a82] cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                name: "has_tracking",
                defaultChecked: companyData?.has_tracking ?? true,
                className: "h-4 w-4 rounded border-[#3a8a82]/30 text-[#2a655f] focus:ring-[#2a655f]/50"
              }
            ),
            isArabic ? "تتبع" : "Tracking"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-[#2a655f] dark:text-[#3a8a82] cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                name: "has_insurance",
                defaultChecked: companyData?.has_insurance ?? true,
                className: "h-4 w-4 rounded border-[#3a8a82]/30 text-[#2a655f] focus:ring-[#2a655f]/50"
              }
            ),
            isArabic ? "تأمين" : "Insurance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-[#2a655f] dark:text-[#3a8a82] cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                name: "has_cod",
                defaultChecked: companyData?.has_cod ?? true,
                className: "h-4 w-4 rounded border-[#3a8a82]/30 text-[#2a655f] focus:ring-[#2a655f]/50"
              }
            ),
            isArabic ? "دفع عند الاستلام" : "Cash on Delivery"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-[#2a655f] dark:text-[#3a8a82] cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                name: "has_express",
                defaultChecked: companyData?.has_express ?? true,
                className: "h-4 w-4 rounded border-[#3a8a82]/30 text-[#2a655f] focus:ring-[#2a655f]/50"
              }
            ),
            isArabic ? "توصيل سريع" : "Express"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-gradient-to-r from-[#e8f0ee]/20 to-[#1a4f4a]/10 dark:from-[#e8f0ee]/10 dark:to-[#1a4f4a]/20 rounded-xl mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              name: "is_active",
              defaultChecked: companyData?.is_active !== false,
              className: "h-4 w-4 rounded border-[#3a8a82]/30 text-[#2a655f] focus:ring-[#2a655f]/50"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82] cursor-pointer", children: isArabic ? "🟢 الشركة نشطة" : "🟢 Company is active" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-6 gap-2 border-t border-[#3a8a82]/30 dark:border-[#3a8a82]/20 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => {
                setShowEditCompanyDialog(false);
                setIsPhoneChanged(false);
                setPhoneAvailable(null);
              },
              className: "rounded-2xl h-11 text-sm font-bold border-[#3a8a82]/30 dark:border-[#3a8a82]/20 hover:bg-[#e8f0ee]/30 dark:hover:bg-[#e8f0ee]/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
                isArabic ? "إلغاء" : "Cancel"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: editLoading || isPhoneChanged && phoneAvailable === false,
              className: "flex-1 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white rounded-2xl h-11 text-sm font-bold shadow-lg shadow-[#2a655f]/25",
              children: [
                editLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1.5" }),
                editLoading ? isArabic ? "جاري الحفظ..." : "Saving..." : isArabic ? "حفظ التغييرات" : "Save Changes"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
const deliveryStyleTag = typeof document !== "undefined" ? document.createElement("style") : null;
if (deliveryStyleTag) {
  deliveryStyleTag.innerHTML = `
    @keyframes deliveryWalk {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-2px) rotate(-3deg); }
    }
    .animate-delivery-walk {
      animation: deliveryWalk 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(deliveryStyleTag);
}
function getPromoOfferData(item) {
  if (item.metadata?.promo_offer_data) {
    return item.metadata.promo_offer_data;
  }
  if (item.variation_snapshot?.offer_data) {
    return item.variation_snapshot.offer_data;
  }
  if (item.offer_data) {
    return item.offer_data;
  }
  return null;
}
function isPromoOffer(item) {
  if (item.is_promo_offer === true) return true;
  if (item.offer_id !== null && item.offer_id !== void 0) return true;
  if (item.variation_snapshot?.is_promo_offer === true) return true;
  if (item.metadata?.promo_offer_data) return true;
  if (item.offer_data) return true;
  if (!!getPromoOfferData(item)) return true;
  return false;
}
const ICON_MAP = {
  "clock": Clock,
  "check-circle": CircleCheckBig,
  "x-circle": CircleX,
  "store": Store,
  "package": Package,
  "sparkles": Sparkles,
  "megaphone": Megaphone,
  "gift": Gift,
  "trending-up": TrendingUp,
  "calendar": Calendar,
  "globe": Globe,
  "settings": Settings,
  "shopping-bag": ShoppingBag,
  "shield": Shield,
  "bell": Bell,
  "rocket": Rocket,
  "gem": Gem,
  "crown": Crown,
  "flame": Flame,
  "compass": Compass,
  "target": Target,
  "zap": Zap,
  "award": Award,
  "badge-check": BadgeCheck
};
const getNotificationConfig = (type) => {
  return NOTIFICATION_CONFIG[type] || NOTIFICATION_CONFIG[NOTIFICATION_TYPES.SYSTEM];
};
function DeliveryDashboardPage() {
  const app = useApp();
  useT();
  const navigate = useNavigate();
  const [addressMethod, setAddressMethod] = reactExports.useState("manual");
  const [location, setLocation] = reactExports.useState(null);
  const [logoUrl, setLogoUrl] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("pending");
  const [activeTab, setActiveTab] = reactExports.useState("orders");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [showCompanyDialog, setShowCompanyDialog] = reactExports.useState(false);
  const [showDistributorDialog, setShowDistributorDialog] = reactExports.useState(false);
  const [showAddDistributorDialog, setShowAddDistributorDialog] = reactExports.useState(false);
  const [notificationsOpen, setNotificationsOpen] = reactExports.useState(false);
  const [showDistributorPassword, setShowDistributorPassword] = reactExports.useState(false);
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const [avatarUrl, setAvatarUrl] = reactExports.useState(null);
  const [showDeactivateDistributorDialog, setShowDeactivateDistributorDialog] = reactExports.useState(false);
  const [deactivatingDistributor, setDeactivatingDistributor] = reactExports.useState(null);
  const [isDeactivating, setIsDeactivating] = reactExports.useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = reactExports.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = reactExports.useState(false);
  const [selectedDeliveryOrderId, setSelectedDeliveryOrderId] = reactExports.useState(null);
  const [selectedOrderId, setSelectedOrderId] = reactExports.useState(null);
  const [selectedDistributorId, setSelectedDistributorId] = reactExports.useState("");
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [distributorSearch, setDistributorSearch] = reactExports.useState("");
  const [estimatedDeliveryHours, setEstimatedDeliveryHours] = reactExports.useState(2);
  const [estimatedPickupHours, setEstimatedPickupHours] = reactExports.useState(0.5);
  const hasRedirected = reactExports.useRef(false);
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [itemsPerPage, setItemsPerPage] = reactExports.useState(10);
  const [showOrderDetails, setShowOrderDetails] = reactExports.useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = reactExports.useState(null);
  const [distributorStats, setDistributorStats] = reactExports.useState({});
  const [isLoadingStats, setIsLoadingStats] = reactExports.useState(false);
  const isArabic = app.lang === "ar";
  const {
    data: company,
    isLoading: companyLoading,
    refetch: refetchCompany
  } = useMyDeliveryCompany(app.user?.id);
  const {
    data: allDistributors = [],
    isLoading: distributorsLoading,
    refetch: refetchDistributors
  } = useDistributors({
    companyId: company?.id,
    isAvailable: true,
    active: true
  });
  const {
    data: orders = [],
    isLoading: ordersLoading,
    refetch: refetchOrders
  } = useDeliveryOrders(app.user?.id);
  const {
    data: governorates = []
  } = useGovernorates();
  const {
    data: allCompanies
  } = useDeliveryCompanies({
    active: true
  });
  const {
    data: userRoles = [],
    refetch: refetchUserRoles
  } = useUserRoles(app.user?.id);
  const {
    data: conversations = []
  } = useConversations();
  const {
    data: unreadCount = 0
  } = useUnreadCount();
  const {
    data: notifications = [],
    refetch: refetchNotifications
  } = useUserNotifications(app.user?.id, {
    limit: 50
  });
  const getOrCreateConversation = useGetOrCreateConversation();
  const updateCompanyMutation = useUpdateDeliveryCompany();
  const updateDistributorMutation = useUpdateDistributor();
  const markRead = useMarkNotificationReadV2();
  const markAllRead = useMarkAllNotificationsReadV2();
  const acceptOrderMutation = useAcceptDeliveryOrder();
  const rejectOrderMutation = useRejectDeliveryOrder();
  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;
  const getProductImage = (item) => {
    const listing = item.listings || item;
    if (item.metadata?.variation_image) return item.metadata.variation_image;
    if (item.metadata?.product_cover) return item.metadata.product_cover;
    if (item.selected_options?.variation_image) return item.selected_options.variation_image;
    if (item.variation_snapshot?.image_url) return item.variation_snapshot.image_url;
    if (item.selected_options?.selected_variation_id) {
      const variations = listing?.variations || [];
      const variation = variations.find((v) => v.id === item.selected_options.selected_variation_id);
      if (variation?.image_url) return variation.image_url;
      if (variation?.color_id) {
        const colors = listing?.colors || [];
        const color = colors.find((c) => c.id === variation.color_id);
        if (color?.image_url) return color.image_url;
      }
    }
    if (item.selected_variation_id) {
      const variations = listing?.variations || [];
      const variation = variations.find((v) => v.id === item.selected_variation_id);
      if (variation?.image_url) return variation.image_url;
      if (variation?.color_id) {
        const colors = listing?.colors || [];
        const color = colors.find((c) => c.id === variation.color_id);
        if (color?.image_url) return color.image_url;
      }
      if (variation?.combination) {
        const colorKeys = ["colors", "color", "اللون", "لون", "colour"];
        let colorValue = null;
        for (const key of colorKeys) {
          if (variation.combination[key]) {
            colorValue = variation.combination[key];
            break;
          }
        }
        if (colorValue) {
          const colors = listing?.colors || [];
          const color = colors.find((c) => c.color_name_ar === colorValue || c.color_name_en === colorValue);
          if (color?.image_url) return color.image_url;
        }
      }
    }
    if (item.variation_combination?.colors) {
      const colorName = item.variation_combination.colors;
      const colors = listing?.colors || [];
      const color = colors.find((c) => c.color_name_ar === colorName || c.color_name_en === colorName);
      if (color?.image_url) return color.image_url;
    }
    if (listing?.variations && listing.variations.length > 0) {
      const firstVariation = listing.variations[0];
      if (firstVariation.image_url) return firstVariation.image_url;
      if (firstVariation.color_id) {
        const colors = listing.colors || [];
        const color = colors.find((c) => c.id === firstVariation.color_id);
        if (color?.image_url) return color.image_url;
      }
    }
    if (listing?.colors && listing.colors.length > 0) {
      const firstColor = listing.colors[0];
      if (firstColor.image_url) return firstColor.image_url;
    }
    if (listing?.listing_images && listing.listing_images.length > 0) {
      const firstImage = listing.listing_images[0];
      if (firstImage?.url) return firstImage.url;
    }
    return listing?.cover_url || null;
  };
  const getStatusLabel = (status) => {
    const labels = {
      pending: isArabic ? "قيد المراجعة" : "Pending",
      assigned: isArabic ? "تم التعيين" : "Assigned",
      picked_up: isArabic ? "تم الاستلام" : "Picked up",
      in_transit: isArabic ? "قيد التوصيل" : "In Transit",
      delivered: isArabic ? "تم التوصيل" : "Delivered",
      cancelled: isArabic ? "ملغي" : "Cancelled",
      failed: isArabic ? "فشل" : "Failed"
    };
    return labels[status] || status;
  };
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-[#e8f0ee]/60 text-[#2a655f] border-[#2a655f]/30",
      assigned: "bg-[#e8f0ee]/60 text-[#2a655f] border-[#2a655f]/30",
      picked_up: "bg-[#e8f0ee]/60 text-[#2a655f] border-[#2a655f]/30",
      in_transit: "bg-[#e8f0ee]/60 text-[#2a655f] border-[#2a655f]/30",
      delivered: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20"
    };
    return colors[status] || "bg-slate-500/10 text-slate-500";
  };
  const notificationChannelRef = reactExports.useRef(null);
  const isSubscribedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!app.user) {
      console.log("⏳ [Delivery] No user, skipping notification setup");
      return;
    }
    if (isSubscribedRef.current) {
      console.log("📡 [Delivery] Already subscribed to notifications");
      return;
    }
    console.log("📡 [Delivery] Setting up REAL-TIME notifications for user:", app.user.id);
    const channel = supabase.channel(`delivery-notifications-${app.user.id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "notifications",
      filter: `user_id=eq.${app.user.id}`
    }, (payload) => {
      const notification = payload.new;
      console.log("📬 [Delivery] 🔔 NEW NOTIFICATION RECEIVED:", notification);
      console.log("📬 [Delivery] Title:", notification.title_ar || notification.title_en);
      console.log("📬 [Delivery] Body:", notification.body_ar || notification.body_en);
      refetchNotifications();
      toast.success(isArabic ? `🔔 ${notification.title_ar || "إشعار جديد"}` : `🔔 ${notification.title_en || "New notification"}`, {
        duration: 15e3,
        position: "top-center",
        icon: "🔔",
        description: isArabic ? notification.body_ar || "" : notification.body_en || "",
        action: {
          label: isArabic ? "📋 عرض" : "📋 View",
          onClick: () => {
            if (notification.link_url) {
              navigate({
                to: notification.link_url
              });
            }
          }
        }
      });
      try {
        const audio = new Audio("/notification.mp3");
        audio.volume = 0.7;
        audio.play().catch(() => console.log("🔇 Audio play failed"));
      } catch (e) {
        console.log("🔇 Audio error:", e);
      }
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const browserNotification = new Notification(isArabic ? notification.title_ar || "إشعار جديد" : notification.title_en || "New notification", {
            body: isArabic ? notification.body_ar : notification.body_en,
            icon: "/images/Logo.png",
            vibrate: [200, 100, 200]
          });
          browserNotification.onclick = () => {
            window.focus();
            if (notification.link_url) {
              navigate({
                to: notification.link_url
              });
            }
          };
          setTimeout(() => browserNotification.close(), 3e4);
        } catch (e) {
          console.log("🔔 Browser notification error:", e);
        }
      }
      setUnreadNotificationsCount((prev) => prev + 1);
    }).subscribe((status) => {
      console.log(`📡 [Delivery] Realtime status: ${status}`);
      if (status === "SUBSCRIBED") {
        isSubscribedRef.current = true;
      }
      if (status === "CLOSED" || status === "CHANNEL_ERROR") {
        isSubscribedRef.current = false;
      }
    });
    notificationChannelRef.current = channel;
    return () => {
      if (notificationChannelRef.current) {
        console.log("🧹 [Delivery] Cleaning up notifications channel");
        supabase.removeChannel(notificationChannelRef.current);
        notificationChannelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [app.user?.id, isArabic, navigate, refetchNotifications]);
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error(isArabic ? "❌ لا توجد بيانات للتصدير" : "❌ No data to export");
      return;
    }
    try {
      const headers = Object.keys(data[0]).filter((key) => !["id", "created_at", "updated_at", "deleted_at"].includes(key));
      let csv = headers.join(",") + "\n";
      data.forEach((row) => {
        const values = headers.map((header) => {
          let value = row[header] || "";
          if (typeof value === "string" && value.includes(",")) {
            value = `"${value}"`;
          }
          if (typeof value === "string" && value.includes("\n")) {
            value = value.replace(/\n/g, " ");
          }
          return value;
        });
        csv += values.join(",") + "\n";
      });
      const blob = new Blob([`\uFEFF${csv}`], {
        type: "text/csv;charset=utf-8;"
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast.success(isArabic ? `✅ تم تصدير ${data.length} سجل بنجاح` : `✅ Exported ${data.length} records successfully`);
    } catch (error) {
      console.error("❌ Export error:", error);
      toast.error(isArabic ? "❌ فشل التصدير" : "❌ Export failed");
    }
  };
  const exportToWord = (data, title) => {
    if (!data || data.length === 0) {
      toast.error(isArabic ? "❌ لا توجد بيانات للتصدير" : "❌ No data to export");
      return;
    }
    try {
      let html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; direction: ${isArabic ? "rtl" : "ltr"}; }
            h1 { color: #2a655f; border-bottom: 3px solid #3a8a82; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #2a655f; color: white; padding: 12px 10px; text-align: ${isArabic ? "right" : "left"}; font-weight: bold; }
            td { padding: 10px; border: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f1f5f9; }
            tr:hover { background-color: #e8f0ee; }
            .footer { margin-top: 30px; color: #666; font-size: 12px; text-align: center; border-top: 1px solid #ddd; padding-top: 15px; }
            .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
            .badge-pending { background: #f59e0b; color: white; }
            .badge-assigned { background: #8b5cf6; color: white; }
            .badge-picked_up { background: #3b82f6; color: white; }
            .badge-in_transit { background: #f97316; color: white; }
            .badge-delivered { background: #22c55e; color: white; }
            .badge-cancelled { background: #ef4444; color: white; }
            .badge-failed { background: #ef4444; color: white; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p><strong>${isArabic ? "تاريخ التصدير" : "Export Date"}:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString(isArabic ? "ar-SA" : "en-US")}</p>
          <p><strong>${isArabic ? "عدد السجلات" : "Total Records"}:</strong> ${data.length}</p>
          <table>
            <thead>
              <tr>
      `;
      const headers = Object.keys(data[0]).filter((key) => !["id", "created_at", "updated_at", "deleted_at"].includes(key));
      headers.forEach((header) => {
        const labelMap = {
          tracking_number: isArabic ? "رقم التتبع" : "Tracking Number",
          status: isArabic ? "الحالة" : "Status",
          delivery_fee: isArabic ? "رسوم التوصيل" : "Delivery Fee",
          delivery_address: isArabic ? "عنوان التوصيل" : "Delivery Address",
          created_at: isArabic ? "تاريخ الإنشاء" : "Created At",
          distributor_id: isArabic ? "الموزع" : "Distributor",
          delivery_company_id: isArabic ? "شركة التوصيل" : "Delivery Company",
          pickup_address: isArabic ? "عنوان الاستلام" : "Pickup Address",
          notes_ar: isArabic ? "ملاحظات" : "Notes",
          notes_en: "Notes",
          order_id: isArabic ? "رقم الطلب" : "Order ID",
          buyer_name: isArabic ? "اسم العميل" : "Customer Name",
          buyer_phone: isArabic ? "رقم العميل" : "Customer Phone",
          total: isArabic ? "المجموع" : "Total",
          cod_amount: isArabic ? "مبلغ الدفع" : "COD Amount",
          delivered_at: isArabic ? "تاريخ التوصيل" : "Delivered At",
          picked_up_at: isArabic ? "تاريخ الاستلام" : "Picked Up At",
          cancelled_at: isArabic ? "تاريخ الإلغاء" : "Cancelled At"
        };
        const label = labelMap[header] || header;
        html += `<th>${label}</th>`;
      });
      html += `</tr></thead><tbody>`;
      data.forEach((row) => {
        html += `<tr>`;
        headers.forEach((header) => {
          let value = row[header] || "-";
          if (header === "status") {
            const statusLabels = {
              pending: isArabic ? "قيد المراجعة" : "Pending",
              assigned: isArabic ? "تم التعيين" : "Assigned",
              picked_up: isArabic ? "تم الاستلام" : "Picked up",
              in_transit: isArabic ? "قيد التوصيل" : "In Transit",
              delivered: isArabic ? "تم التوصيل" : "Delivered",
              cancelled: isArabic ? "ملغي" : "Cancelled",
              failed: isArabic ? "فشل" : "Failed"
            };
            const label = statusLabels[value] || value;
            const colorClass = `badge-${value}`;
            html += `<td><span class="badge ${colorClass}">${label}</span></td>`;
          } else if (header === "created_at" || header === "updated_at" || header === "delivered_at" || header === "picked_up_at" || header === "cancelled_at") {
            html += `<td>${value ? new Date(value).toLocaleString(isArabic ? "ar-SA" : "en-US") : "-"}</td>`;
          } else if (header === "delivery_fee" || header === "total" || header === "cod_amount") {
            html += `<td>${Number(value).toLocaleString()} SYP</td>`;
          } else if (typeof value === "string" && value.length > 50) {
            html += `<td>${value.substring(0, 50)}...</td>`;
          } else {
            html += `<td>${value}</td>`;
          }
        });
        html += `</tr>`;
      });
      html += `
            </tbody>
          </table>
          <div class="footer">
            ${isArabic ? "تم التصدير من لوحة تحكم شركة التوصيل - ذوق" : "Exported from Delivery Company Dashboard - Zooq"}
            <br>© ${(/* @__PURE__ */ new Date()).getFullYear()} ${isArabic ? "ذوق. جميع الحقوق محفوظة" : "Zooq. All rights reserved."}
          </div>
        </body>
        </html>
      `;
      const blob = new Blob([html], {
        type: "application/msword;charset=utf-8"
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${title}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast.success(isArabic ? `✅ تم تصدير ${data.length} سجل إلى Word بنجاح` : `✅ Exported ${data.length} records to Word successfully`);
    } catch (error) {
      console.error("❌ Export to Word error:", error);
      toast.error(isArabic ? "❌ فشل التصدير إلى Word" : "❌ Export to Word failed");
    }
  };
  const handlePrint = () => {
    window.print();
  };
  reactExports.useEffect(() => {
    console.log("🔍 [useEffect] companyLoading:", companyLoading);
    console.log("🔍 [useEffect] company:", company);
    console.log("🔍 [useEffect] is_verified:", company?.is_verified);
    console.log("🔍 [useEffect] pathname:", window.location.pathname);
    console.log("🔍 [useEffect] hasRedirected:", hasRedirected.current);
    if (companyLoading) {
      console.log("⏳ [useEffect] Loading, waiting...");
      return;
    }
    if (window.location.pathname === "/delivery/complete") {
      console.log("📍 [useEffect] Already on complete page, resetting ref");
      hasRedirected.current = false;
      return;
    }
    if (hasRedirected.current) {
      console.log("🚫 [useEffect] Already redirected once, skipping");
      return;
    }
    if (!company) {
      console.log("ℹ️ [useEffect] No company yet, waiting...");
      return;
    }
    if (company.is_verified === true) {
      console.log("✅ [useEffect] Company is verified!");
      hasRedirected.current = false;
      return;
    }
    if (company && company.is_verified === false) {
      console.log("🚫 [useEffect] Company not verified, redirecting...");
      hasRedirected.current = true;
      navigate({
        to: "/delivery/complete"
      });
      toast.info(isArabic ? "📋 يرجى إكمال بيانات شركتك أولاً" : "📋 Please complete your company data first");
    }
  }, [company, companyLoading, navigate, isArabic]);
  const isDeliveryCompany = reactExports.useMemo(() => {
    if (!Array.isArray(userRoles)) return false;
    return userRoles.includes("delivery_company") || userRoles.includes("delivery_company_admin");
  }, [userRoles]);
  console.log("🔍 [DELIVERY DASHBOARD] isDeliveryCompany:", isDeliveryCompany);
  console.log("🔍 [DELIVERY DASHBOARD] userRoles:", userRoles);
  console.log("🔍 [DELIVERY DASHBOARD] company:", company);
  reactExports.useEffect(() => {
    if (!acceptDialogOpen || !allDistributors || allDistributors.length === 0) return;
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const stats2 = {};
        for (const dist of allDistributors) {
          const {
            data: pendingOrders,
            error: pendingError
          } = await supabase.from("delivery_orders").select("id", {
            count: "exact"
          }).eq("distributor_id", dist.id).in("status", ["pending", "assigned", "picked_up", "in_transit"]);
          if (pendingError) {
            console.error("❌ Error fetching pending orders:", pendingError);
          }
          const {
            data: completedOrders,
            error: completedError
          } = await supabase.from("delivery_orders").select("id", {
            count: "exact"
          }).eq("distributor_id", dist.id).in("status", ["delivered", "completed"]);
          if (completedError) {
            console.error("❌ Error fetching completed orders:", completedError);
          }
          stats2[dist.id] = {
            pending: pendingOrders?.length || 0,
            completed: completedOrders?.length || 0,
            total: (pendingOrders?.length || 0) + (completedOrders?.length || 0)
          };
        }
        setDistributorStats(stats2);
      } catch (error) {
        console.error("❌ Error fetching distributor stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, [acceptDialogOpen, allDistributors]);
  const stats = reactExports.useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const assigned = orders.filter((o) => o.status === "assigned").length;
    const inTransit = orders.filter((o) => o.status === "in_transit").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + Number(o.delivery_fee || 0), 0);
    const avgDeliveryTime = orders.filter((o) => o.delivered_at && o.created_at).reduce((sum, o) => {
      const diff = new Date(o.delivered_at).getTime() - new Date(o.created_at).getTime();
      return sum + diff / (1e3 * 60);
    }, 0) / (orders.filter((o) => o.delivered_at && o.created_at).length || 1);
    return {
      total,
      pending,
      assigned,
      inTransit,
      delivered,
      cancelled,
      totalRevenue,
      avgDeliveryTime: Math.round(avgDeliveryTime) || 0,
      completionRate: total > 0 ? Math.round(delivered / total * 100) : 0
    };
  }, [orders]);
  const filteredOrders = reactExports.useMemo(() => {
    let result = orders;
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const cleanedQ = q.replace(/^#/, "");
      result = result.filter((o) => {
        const tracking = (o.tracking_number || "").toLowerCase();
        const id = (o.id || "").toLowerCase();
        const deliveryName = (o.delivery_name || "").toLowerCase();
        const pickupName = (o.pickup_name || "").toLowerCase();
        const deliveryAddress = (o.delivery_address || "").toLowerCase();
        return tracking.includes(cleanedQ) || tracking.includes(q) || deliveryName.includes(q) || pickupName.includes(q) || deliveryAddress.includes(q) || id.includes(q);
      });
    }
    result = [...result].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return result;
  }, [orders, statusFilter, searchQuery]);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = reactExports.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, itemsPerPage]);
  reactExports.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);
  const currentDistributor = reactExports.useMemo(() => {
    if (!app.user?.id) return null;
    return allDistributors.find((d) => d.user_id === app.user.id);
  }, [allDistributors, app.user?.id]);
  const handleAcceptDelivery = reactExports.useCallback(async () => {
    if (!selectedDeliveryOrderId || !selectedOrderId || !selectedDistributorId) {
      toast.error(isArabic ? "❌ الرجاء اختيار موزع" : "❌ Please select a distributor");
      return;
    }
    if (!estimatedDeliveryHours || estimatedDeliveryHours <= 0) {
      toast.error(isArabic ? "❌ الرجاء إدخال وقت متوقع للوصول" : "❌ Please enter estimated delivery time");
      return;
    }
    setIsProcessing(true);
    try {
      const now = /* @__PURE__ */ new Date();
      const estimatedDelivery = new Date(now.getTime() + estimatedDeliveryHours * 60 * 60 * 1e3);
      const estimatedPickup = new Date(now.getTime() + (estimatedPickupHours || 0.5) * 60 * 60 * 1e3);
      await acceptOrderMutation.mutateAsync({
        deliveryOrderId: selectedDeliveryOrderId,
        orderId: selectedOrderId,
        distributorId: selectedDistributorId,
        estimatedDeliveryAt: estimatedDelivery.toISOString(),
        estimatedPickupAt: estimatedPickup.toISOString()
      });
      setAcceptDialogOpen(false);
      setSelectedDeliveryOrderId(null);
      setSelectedOrderId(null);
      setSelectedDistributorId("");
      setEstimatedDeliveryHours(2);
      setEstimatedPickupHours(0.5);
      refetchOrders();
    } catch (error) {
      console.error("❌ Error accepting delivery:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedDeliveryOrderId, selectedOrderId, selectedDistributorId, estimatedDeliveryHours, estimatedPickupHours, acceptOrderMutation, refetchOrders, isArabic]);
  const handleRejectDelivery = reactExports.useCallback(async () => {
    if (!selectedDeliveryOrderId || !selectedOrderId || !rejectReason.trim()) {
      toast.error(isArabic ? "❌ الرجاء إدخال سبب الرفض" : "❌ Please enter a rejection reason");
      return;
    }
    setIsProcessing(true);
    try {
      await rejectOrderMutation.mutateAsync({
        deliveryOrderId: selectedDeliveryOrderId,
        orderId: selectedOrderId,
        reason: rejectReason.trim()
      });
      setRejectDialogOpen(false);
      setSelectedDeliveryOrderId(null);
      setSelectedOrderId(null);
      setRejectReason("");
      refetchOrders();
    } catch (error) {
      console.error("❌ Error rejecting delivery:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedDeliveryOrderId, selectedOrderId, rejectReason, rejectOrderMutation, refetchOrders, isArabic]);
  const handleNotificationClick = reactExports.useCallback(async (notification) => {
    if (!notification.is_read) {
      try {
        await markRead.mutateAsync({
          notificationId: notification.id,
          userId: app.user.id
        });
        await refetchNotifications();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    if (notification.link_url) {
      window.location.href = notification.link_url;
      setNotificationsOpen(false);
    }
  }, [markRead, app.user, refetchNotifications]);
  reactExports.useCallback(async (notificationId, e) => {
    e.stopPropagation();
    try {
      await markRead.mutateAsync({
        notificationId,
        userId: app.user.id
      });
      await refetchNotifications();
      toast.success(isArabic ? "تم تحديد الإشعار كمقروء" : "Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(isArabic ? "حدث خطأ" : "An error occurred");
    }
  }, [markRead, app.user, isArabic, refetchNotifications]);
  const handleMarkAllAsRead = reactExports.useCallback(async () => {
    try {
      await markAllRead.mutateAsync({
        userId: app.user.id
      });
      await refetchNotifications();
      toast.success(isArabic ? "تم تحديد الكل كمقروء" : "All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error(isArabic ? "حدث خطأ" : "An error occurred");
    }
  }, [markAllRead, app.user, isArabic, refetchNotifications]);
  reactExports.useCallback(async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success(isArabic ? "✅ تم تسجيل الخروج بنجاح" : "✅ Logged out successfully");
      window.location.href = "/auth/login";
    } catch (error) {
      toast.error(isArabic ? "❌ فشل تسجيل الخروج" : "❌ Logout failed");
      console.error(error);
    }
  }, [isArabic]);
  const handleMessages = reactExports.useCallback(() => {
    navigate({
      to: "/delivery/messages"
    });
  }, [navigate]);
  const toggleLanguage = reactExports.useCallback(() => {
    const newLang = isArabic ? "en" : "ar";
    app.setLang(newLang);
    toast.success(isArabic ? "✅ تم التبديل إلى الإنجليزية" : "✅ Switched to Arabic");
  }, [app, isArabic]);
  reactExports.useCallback(() => {
    setNotificationsOpen(true);
  }, []);
  const openConversation = reactExports.useCallback(async (otherUserId) => {
    if (!app.user) return;
    if (otherUserId === app.user.id) {
      toast.info(isArabic ? "💬 لا يمكنك مراسلة نفسك" : "💬 You can't message yourself");
      return;
    }
    setIsCreating(true);
    try {
      const conversation = await getOrCreateConversation.mutateAsync({
        userId: app.user.id,
        otherUserId
      });
      navigate({
        to: "/delivery/conversation/$userId",
        params: {
          userId: otherUserId
        },
        search: {
          cid: conversation.id
        }
      });
    } catch (error) {
      console.error("❌ Error opening conversation:", error);
      toast.error(isArabic ? "فشل فتح المحادثة" : "Failed to open conversation");
    } finally {
      setIsCreating(false);
    }
  }, [app.user, getOrCreateConversation, navigate, isArabic]);
  reactExports.useCallback(async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const basePrice = parseFloat(formData.get("base_price")) || 0;
    const pricePerKm = parseFloat(formData.get("price_per_km")) || 0;
    const freeDeliveryThreshold = parseFloat(formData.get("free_delivery_threshold")) || 0;
    if (basePrice <= 0) {
      toast.error(isArabic ? "❌ السعر الأساسي يجب أن يكون أكبر من صفر" : "❌ Base price must be greater than zero");
      return;
    }
    if (pricePerKm <= 0) {
      toast.error(isArabic ? "❌ سعر الكيلومتر يجب أن يكون أكبر من صفر" : "❌ Price per km must be greater than zero");
      return;
    }
    if (freeDeliveryThreshold <= 0) {
      toast.error(isArabic ? "❌ قيمة التوصيل المجاني يجب أن تكون أكبر من صفر" : "❌ Free delivery threshold must be greater than zero");
      return;
    }
    const patch = {
      name_ar: formData.get("name_ar"),
      name_en: formData.get("name_en"),
      phone: formData.get("phone"),
      description_ar: formData.get("description_ar"),
      description_en: formData.get("description_en"),
      base_price: basePrice,
      price_per_km: pricePerKm,
      free_delivery_threshold: freeDeliveryThreshold,
      min_delivery_fee: parseFloat(formData.get("min_delivery_fee")) || 0,
      max_delivery_fee: parseFloat(formData.get("max_delivery_fee")) || 1e9,
      avg_delivery_time: parseInt(formData.get("avg_delivery_time")) || 60,
      has_tracking: formData.get("has_tracking") === "on",
      has_insurance: formData.get("has_insurance") === "on",
      has_cod: formData.get("has_cod") === "on",
      has_express: formData.get("has_express") === "on",
      is_active: formData.get("is_active") === "on"
    };
    if (addressMethod === "map" && location) {
      patch.address_ar = location.address;
      patch.address_en = location.address;
      const {
        error: updateProfileError
      } = await supabase.from("profiles").update({
        lat: location.lat || 0,
        lng: location.lng || 0,
        address_text: location.address.trim()
      }).eq("id", app.user?.id);
      if (updateProfileError) {
        console.error("❌ خطأ في تحديث إحداثيات البروفايل:", updateProfileError);
      }
    } else {
      patch.address_ar = formData.get("address_ar");
      patch.address_en = formData.get("address_ar");
    }
    if (logoUrl) {
      patch.logo_url = logoUrl;
    }
    try {
      await updateCompanyMutation.mutateAsync({
        id: company.id,
        patch
      });
      toast.success(isArabic ? "✅ تم تحديث معلومات الشركة" : "✅ Company updated successfully");
      setShowCompanyDialog(false);
      await refetchCompany();
    } catch (error) {
      toast.error(isArabic ? "❌ فشل التحديث" : "❌ Update failed");
      console.error(error);
    }
  }, [company, updateCompanyMutation, isArabic, refetchCompany, addressMethod, location, logoUrl, app.user?.id]);
  reactExports.useCallback(async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const patch = {
      full_name_ar: formData.get("full_name_ar"),
      full_name_en: formData.get("full_name_en"),
      phone: formData.get("phone"),
      address_ar: formData.get("address_ar"),
      address_en: formData.get("address_en"),
      is_available: formData.get("is_available") === "on"
    };
    try {
      await updateDistributorMutation.mutateAsync({
        id: currentDistributor.id,
        patch
      });
      toast.success(isArabic ? "✅ تم تحديث معلومات الموزع" : "✅ Distributor updated successfully");
      setShowDistributorDialog(false);
      await refetchDistributors();
    } catch (error) {
      toast.error(isArabic ? "❌ فشل التحديث" : "❌ Update failed");
      console.error(error);
    }
  }, [currentDistributor, updateDistributorMutation, isArabic, refetchDistributors]);
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
      avatar_url
    } = data;
    const phoneRegex = /^(09|096|095|093|094)[0-9]{7,8}$/;
    if (!phoneRegex.test(phone)) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح. يجب أن يبدأ بـ 09 أو 096 أو 095 أو 093 أو 094 ويتكون من 9-10 أرقام" : "❌ Invalid phone number. Must start with 09, 096, 095, 093, or 094 and be 9-10 digits");
      return;
    }
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
          company_id: company?.id || null
        })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to create distributor");
      }
      toast.success(isArabic ? `✅ تم إضافة الموزع بنجاح!
📱 الرقم: ${phone}
🔑 كلمة المرور: ${password}
👤 الاسم: ${full_name_ar || full_name_en}` : `✅ Distributor added successfully!
📱 Phone: ${phone}
🔑 Password: ${password}
👤 Name: ${full_name_en || full_name_ar}`);
      setShowAddDistributorDialog(false);
      await refetchDistributors();
    } catch (error) {
      console.error("❌ Error creating distributor:", error);
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    }
  };
  const handleAddDistributor = reactExports.useCallback(async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const full_name_ar = formData.get("full_name_ar");
    const full_name_en = formData.get("full_name_en");
    const phone = formData.get("phone");
    const password = formData.get("password");
    const address_ar = formData.get("address_ar");
    const address_en = formData.get("address_en");
    const governorate_id = formData.get("governorate_id");
    const is_available = formData.get("is_available") === "available";
    const distributor_type = formData.get("distributor_type") || "freelance";
    if (!full_name_ar.trim()) {
      toast.error(isArabic ? "الاسم (عربي) مطلوب" : "Name (Arabic) is required");
      return;
    }
    const phoneRegex = /^(09|096|095|093|094)[0-9]{7,8}$/;
    if (!phone.trim() || !phoneRegex.test(phone)) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح. يجب أن يبدأ بـ 09 أو 096 أو 095 أو 093 أو 094 ويتكون من 9-10 أرقام" : "❌ Invalid phone number. Must start with 09, 096, 095, 093, or 094 and be 9-10 digits");
      return;
    }
    try {
      const {
        data: existingProfile,
        error: profileCheckError
      } = await supabase.from("profiles").select("id").eq("phone", phone).maybeSingle();
      if (profileCheckError) {
        console.error("Error checking profile:", profileCheckError);
        throw new Error("حدث خطأ في التحقق من الرقم");
      }
      if (existingProfile) {
        toast.error(isArabic ? "❌ هذا الرقم مستخدم من قبل ولا يمكن إضافته كموزع" : "❌ This phone number is already in use and cannot be added as a distributor");
        return;
      }
      if (!password || password.length < 6) {
        toast.error(isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
        return;
      }
      await createNewDistributor({
        full_name_ar,
        full_name_en,
        phone,
        password,
        address_ar,
        address_en,
        governorate_id,
        is_available,
        distributor_type,
        avatar_url: avatarUrl
      });
    } catch (error) {
      console.error("Error adding distributor:", error);
      toast.error(isArabic ? "❌ حدث خطأ: " + (error.message || "") : "❌ Error: " + (error.message || ""));
    }
  }, [company, isArabic, avatarUrl, createNewDistributor]);
  const handleDeactivateDistributor = async () => {
    if (!deactivatingDistributor) return;
    setIsDeactivating(true);
    try {
      const distributorId = deactivatingDistributor.id;
      const distributorName = deactivatingDistributor.full_name_ar || deactivatingDistributor.full_name_en || "الموزع";
      const {
        data: pendingOrders,
        error: ordersError
      } = await supabase.from("delivery_orders").select("id, status").eq("distributor_id", distributorId).in("status", ["pending", "assigned", "picked_up", "in_transit"]);
      if (ordersError) throw ordersError;
      if (pendingOrders && pendingOrders.length > 0) {
        toast.error(isArabic ? `❌ لا يمكن تعطيل الموزع لديه ${pendingOrders.length} طلبات معلقة` : `❌ Cannot deactivate distributor with ${pendingOrders.length} pending orders`);
        setIsDeactivating(false);
        return;
      }
      const {
        error: updateError
      } = await supabase.from("distributors").update({
        is_available: false,
        is_active: false
      }).eq("id", distributorId);
      if (updateError) throw updateError;
      toast.success(isArabic ? `✅ تم تعطيل الموزع "${distributorName}" بنجاح` : `✅ Distributor "${distributorName}" deactivated successfully`);
      setShowDeactivateDistributorDialog(false);
      setDeactivatingDistributor(null);
      setIsDeactivating(false);
      await refetchDistributors();
    } catch (error) {
      console.error("❌ Error deactivating distributor:", error);
      toast.error(isArabic ? `❌ فشل تعطيل الموزع: ${error.message || "خطأ غير معروف"}` : `❌ Failed to deactivate distributor: ${error.message || "Unknown error"}`);
      setIsDeactivating(false);
    }
  };
  const openDeactivateDistributorDialog = (distributor) => {
    setDeactivatingDistributor(distributor);
    setShowDeactivateDistributorDialog(true);
  };
  const [systemAdmin, setSystemAdmin] = reactExports.useState(null);
  const [loadingAdmin, setLoadingAdmin] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const fetchSystemAdmin = async () => {
      setLoadingAdmin(true);
      try {
        const {
          data: adminRoles
        } = await supabase.from("user_roles").select("user_id").eq("role", "admin").limit(1);
        if (!adminRoles || adminRoles.length === 0) {
          setLoadingAdmin(false);
          return;
        }
        const {
          data: adminProfile
        } = await supabase.from("profiles").select("id, full_name, phone, avatar_url").eq("id", adminRoles[0].user_id).maybeSingle();
        setSystemAdmin(adminProfile);
      } catch (error) {
        console.error("Error fetching system admin:", error);
      } finally {
        setLoadingAdmin(false);
      }
    };
    fetchSystemAdmin();
  }, []);
  reactExports.useCallback(async () => {
    if (!systemAdmin) {
      toast.error(isArabic ? "❌ لا يوجد أدمن للنظام" : "❌ No system admin found");
      return;
    }
    if (systemAdmin.id === app.user?.id) {
      toast.info(isArabic ? "💬 أنت الأدمن، لا يمكنك مراسلة نفسك" : "💬 You are the admin, you can't message yourself");
      return;
    }
    await openConversation(systemAdmin.id);
  }, [systemAdmin, app.user, openConversation, isArabic]);
  reactExports.useMemo(() => {
    return allDistributors.filter((d) => d.delivery_company_id === company?.id && d.user_id !== app.user?.id);
  }, [allDistributors, company, app.user]);
  if (app.authLoading || ordersLoading || distributorsLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f]" }) });
  }
  if (!app.user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#e8f0ee]/40 via-white to-[#f1f5f9] dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#1a4f4a]/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#0d2e2a]/95 via-[#1a4f4a]/90 to-[#2a655f]/85 backdrop-blur-md text-white overflow-hidden shadow-2xl shadow-[#0d2e2a]/20 border-b border-white/10 sticky top-0 z-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none opacity-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 -translate-y-1/2 animate-drive-across", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-full border border-white/10 shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-12 w-12 text-white animate-bounce-truck" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-white/30 animate-spin-slow", style: {
            animationDuration: "1s"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-white/30 animate-spin-slow", style: {
            animationDuration: "1s",
            animationDelay: "0.3s"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-white/30 animate-spin-slow", style: {
            animationDuration: "1s",
            animationDelay: "0.6s"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-white/30 animate-spin-slow", style: {
            animationDuration: "1s",
            animationDelay: "0.9s"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white/40 tracking-widest", children: "● ● ●" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-white/15 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-white/15 animate-pulse", style: {
            animationDelay: "0.5s"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-white/15 animate-pulse", style: {
            animationDelay: "1s"
          } })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-7xl px-4 py-3 md:py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 group flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-16 w-16 md:h-20 md:w-20 flex items-center justify-center group-hover:scale-110 transition-all duration-500 flex-shrink-0 animate-float-logo", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-[#2a655f]/20 blur-2xl group-hover:bg-[#2a655f]/40 transition-all duration-700 animate-pulse-slow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-2 rounded-full border-2 border-[#3a8a82]/40 animate-spin-slow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-full border border-[#3a8a82]/20 animate-spin-slow", style: {
              animationDirection: "reverse",
              animationDuration: "8s"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-6 rounded-full border border-[#3a8a82]/10 animate-spin-slow", style: {
              animationDuration: "10s"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-8 rounded-full border border-[#3a8a82]/5 animate-spin-slow", style: {
              animationDuration: "12s",
              animationDirection: "reverse"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/Logo.png", className: "h-14 w-14 md:h-16 md:w-16 object-contain drop-shadow-2xl relative z-10 animate-pulse-glow", loading: "eager" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#3a8a82] animate-ping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -left-1 h-2.5 w-2.5 rounded-full bg-[#3a8a82] animate-ping", style: {
              animationDelay: "0.5s"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 -right-3 h-2 w-2 rounded-full bg-[#3a8a82] animate-pulse", style: {
              animationDelay: "1s"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 -left-3 h-2 w-2 rounded-full bg-[#3a8a82] animate-pulse", style: {
              animationDelay: "1.5s"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 left-1/2 h-1.5 w-1.5 rounded-full bg-[#3a8a82] animate-bounce" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-3 left-1/2 h-1.5 w-1.5 rounded-full bg-[#3a8a82] animate-bounce", style: {
              animationDelay: "0.7s"
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col min-w-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-wrap flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative", onClick: () => setNotificationsOpen(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 md:h-5 md:w-5" }),
              unreadNotificationsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse border-2 border-[#1a4f4a]", children: unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "bottom", className: "bg-[#0d2e2a] text-white border-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isArabic ? "الإشعارات" : "Notifications" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative", onClick: handleMessages, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 md:h-5 md:w-5" }),
              unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse border-2 border-[#1a4f4a]", children: unreadCount > 9 ? "9+" : unreadCount })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "bottom", className: "bg-[#0d2e2a] text-white border-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isArabic ? "الرسائل" : "Messages" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300", onClick: toggleLanguage, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "h-4 w-4 md:h-5 md:w-5" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "bottom", className: "bg-[#0d2e2a] text-white border-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isArabic ? "تبديل اللغة" : "Switch Language" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-white/10 mx-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DeliveryAccountMenu, { userData: {
              id: app.user?.id || "",
              full_name: company?.name_ar || app.user?.name || (isArabic ? "مدير شركة" : "Company Manager"),
              phone: company?.phone || app.user?.phone || "",
              avatar_url: company?.logo_url || "",
              role: "delivery_company"
            }, companyName: company?.name_ar, isArabic, companyId: company?.id, onCompanyUpdated: refetchCompany }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] md:text-[10px] text-white/70 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-1.5 w-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" })
                ] }),
                isArabic ? "شركة توصيل • متاحة" : "Delivery Company • Available"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] md:text-[10px] text-white/30", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] md:text-[10px] text-white/50 flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2 w-2 md:h-2.5 md:w-2.5 animate-spin-slow text-[#3a8a82]" }),
                isArabic ? "توصيل سريع" : "Fast Delivery"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-white/10 mx-0.5" }),
          currentDistributor && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300", onClick: () => setShowDistributorDialog(true), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { className: "h-4 w-4 md:h-5 md:w-5" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "bottom", className: "bg-[#0d2e2a] text-white border-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isArabic ? "حساب الموزع" : "Distributor Account" }) })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: notificationsOpen, onOpenChange: setNotificationsOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-[#2a655f]/30 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#2a655f] dark:text-[#3a8a82]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-[#2a655f]" }),
          isArabic ? "الإشعارات" : "Notifications",
          unreadNotificationsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f] text-white border-0 text-[10px]", children: unreadNotificationsCount })
        ] }),
        unreadNotificationsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: handleMarkAllAsRead, className: "text-xs text-[#2a655f] hover:bg-[#e8f0ee]/20 rounded-xl", children: isArabic ? "تحديد الكل كمقروء" : "Mark all as read" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] overflow-y-auto space-y-2", children: notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-12 w-12 mx-auto mb-2 text-muted-foreground/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isArabic ? "لا توجد إشعارات" : "No notifications" })
      ] }) : notifications.map((notification) => {
        const config = getNotificationConfig(notification.type);
        const Icon = config?.icon ? ICON_MAP[config.icon] || Bell : Bell;
        const isRead = notification.is_read;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => handleNotificationClick(notification), className: cn("p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md", isRead ? "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-700/50" : "bg-[#e8f0ee]/30 border-[#2a655f]/40 hover:bg-[#e8f0ee]/50"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", isRead ? "bg-slate-100 dark:bg-slate-800" : "bg-[#3a8a82]/30"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-[#2a655f]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("text-sm font-semibold", isRead ? "text-slate-700 dark:text-slate-300" : "text-[#2a655f]"), children: isArabic ? notification.title_ar : notification.title_en || notification.title_ar }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: isArabic ? notification.body_ar : notification.body_en || notification.body_ar }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-1", children: formatTime(notification.created_at) })
          ] }),
          !isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-[#2a655f] animate-pulse flex-shrink-0 mt-1" })
        ] }) }, notification.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setNotificationsOpen(false), className: "rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#e8f0ee]/30", children: isArabic ? "إغلاق" : "Close" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDistributorDialog, onOpenChange: setShowDistributorDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-[#2a655f]/30 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#2a655f] dark:text-[#3a8a82]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { className: "h-5 w-5 text-[#2a655f]" }),
          isArabic ? "حساب الموزع" : "Distributor Account"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? "معلومات حساب الموزع الحالي" : "Current distributor account information" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-4", children: currentDistributor && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-3 bg-[#e8f0ee]/20 rounded-xl border border-[#2a655f]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-[#3a8a82]/30 flex items-center justify-center overflow-hidden", children: currentDistributor.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: currentDistributor.avatar_url, alt: currentDistributor.full_name_ar, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-6 w-6 text-[#2a655f]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-[#2a655f] dark:text-[#3a8a82]", children: currentDistributor.full_name_ar || currentDistributor.full_name_en }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", dir: "ltr", children: currentDistributor.phone })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-[#e8f0ee]/20 dark:bg-[#e8f0ee]/10 rounded-xl border border-[#2a655f]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "الحالة" : "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-[#2a655f] dark:text-[#3a8a82]", children: currentDistributor.is_available ? isArabic ? "🟢 متاح" : "🟢 Available" : isArabic ? "🔴 غير متاح" : "🔴 Unavailable" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-[#e8f0ee]/20 dark:bg-[#e8f0ee]/10 rounded-xl border border-[#2a655f]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "التقييم" : "Rating" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-yellow-400 text-yellow-400" }),
              currentDistributor.rating || 0
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-[#e8f0ee]/20 dark:bg-[#e8f0ee]/10 rounded-xl border border-[#2a655f]/30 col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "العنوان" : "Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-[#2a655f] dark:text-[#3a8a82] text-sm", children: currentDistributor.address_ar || currentDistributor.address_en || (isArabic ? "غير محدد" : "Not specified") })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowDistributorDialog(false), className: "rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#e8f0ee]/30", children: isArabic ? "إغلاق" : "Close" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Package, label: isArabic ? "الطلبات" : "Orders", value: stats.total, color: "olive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Clock, label: isArabic ? "قيد المراجعة" : "Pending", value: stats.pending, color: "slate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: UserCheck, label: isArabic ? "تم التعيين" : "Assigned", value: stats.assigned, color: "slate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Truck, label: isArabic ? "قيد التوصيل" : "In Transit", value: stats.inTransit, color: "slate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleCheckBig, label: isArabic ? "تم التوصيل" : "Delivered", value: stats.delivered, color: "olive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Coins, label: isArabic ? "الإيرادات" : "Revenue", value: stats.totalRevenue.toLocaleString(), color: "slate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: TrendingUp, label: isArabic ? "نسبة الإنجاز" : "Completion", value: `${stats.completionRate}%`, color: "olive" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 border-b border-[#2a655f]/30 mb-6 overflow-x-auto", children: [{
        id: "orders",
        label: isArabic ? "الطلبات" : "Orders",
        icon: ShoppingBag,
        iconBg: "from-[#2a655f] to-[#3a8a82]",
        iconColor: "text-[#2a655f]"
      }, {
        id: "distributors",
        label: isArabic ? "الموزعين" : "Distributors",
        icon: Users,
        iconBg: "from-[#1a4f4a] to-[#2a655f]",
        iconColor: "text-[#2a655f]"
      }, {
        id: "analytics",
        label: isArabic ? "التحليلات" : "Analytics",
        icon: TrendingUp,
        iconBg: "from-[#2a655f] to-[#3a8a82]",
        iconColor: "text-[#2a655f]"
      }, {
        id: "admins",
        label: isArabic ? "المدراء" : "Managers",
        icon: Crown,
        iconBg: "from-amber-500 to-yellow-500",
        iconColor: "text-amber-500"
      }].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center gap-3 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 whitespace-nowrap group ${activeTab === tab.id ? "border-[#2a655f] text-[#2a655f] dark:text-[#3a8a82]" : "border-transparent text-muted-foreground hover:text-[#2a655f] hover:border-[#3a8a82]/50"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6", activeTab === tab.id ? `bg-gradient-to-br ${tab.iconBg} text-white shadow-lg shadow-[#2a655f]/25` : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-[#e8f0ee]/30 group-hover:text-[#2a655f]"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "transition-all duration-300 group-hover:translate-x-0.5", children: tab.label }),
        activeTab === tab.id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#2a655f] animate-pulse" })
      ] }, tab.id)) }),
      activeTab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in slide-in-from-top-5 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px] max-w-sm group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#2a655f] transition-colors duration-300" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: isArabic ? "🔍 بحث عن طلب..." : "🔍 Search orders...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "ps-9 h-10 rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20 transition-all duration-300" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-[#2a655f] animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-10 px-4 rounded-xl border-2 border-[#2a655f]/40 hover:border-[#2a655f]/50 hover:bg-[#e8f0ee]/30 transition-all duration-300 flex items-center gap-2 min-w-[160px] justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: statusFilter === "all" ? isArabic ? "📋 جميع الحالات" : "📋 All status" : statusFilter === "pending" ? isArabic ? "⏳ قيد المراجعة" : "⏳ Pending" : statusFilter === "assigned" ? isArabic ? "📌 تم التعيين" : "📌 Assigned" : statusFilter === "picked_up" ? isArabic ? "📦 تم الاستلام" : "📦 Picked up" : statusFilter === "in_transit" ? isArabic ? "🚚 قيد التوصيل" : "🚚 In transit" : statusFilter === "delivered" ? isArabic ? "✅ تم التوصيل" : "✅ Delivered" : isArabic ? "جميع الحالات" : "All status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-[#2a655f]" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "start", className: "w-[220px] rounded-xl border-2 border-[#2a655f]/30 shadow-xl p-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("all"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "all" ? "bg-[#e8f0ee]/50 text-[#2a655f] font-semibold" : "hover:bg-[#e8f0ee]/30 hover:text-[#2a655f]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "📋" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "جميع الحالات" : "All status" }),
                  statusFilter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#2a655f]" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("pending"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "pending" ? "bg-[#e8f0ee]/50 text-[#2a655f] font-semibold" : "hover:bg-[#e8f0ee]/30 hover:text-[#2a655f]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "⏳" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "قيد المراجعة" : "Pending" }),
                  statusFilter === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#2a655f]" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("assigned"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "assigned" ? "bg-[#e8f0ee]/50 text-[#2a655f] font-semibold" : "hover:bg-[#e8f0ee]/30 hover:text-[#2a655f]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "📌" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "تم التعيين" : "Assigned" }),
                  statusFilter === "assigned" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#2a655f]" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("picked_up"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "picked_up" ? "bg-[#e8f0ee]/50 text-[#2a655f] font-semibold" : "hover:bg-[#e8f0ee]/30 hover:text-[#2a655f]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "📦" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "تم الاستلام" : "Picked up" }),
                  statusFilter === "picked_up" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#2a655f]" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("in_transit"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "in_transit" ? "bg-[#e8f0ee]/50 text-[#2a655f] font-semibold" : "hover:bg-[#e8f0ee]/30 hover:text-[#2a655f]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "🚚" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "قيد التوصيل" : "In transit" }),
                  statusFilter === "in_transit" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#2a655f]" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("delivered"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "delivered" ? "bg-[#e8f0ee]/50 text-[#2a655f] font-semibold" : "hover:bg-[#e8f0ee]/30 hover:text-[#2a655f]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "✅" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "تم التوصيل" : "Delivered" }),
                  statusFilter === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#2a655f]" })
                ] }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => exportToCSV(filteredOrders, "الطلبات"), className: "h-9 rounded-xl border-[#2a655f]/30 hover:bg-[#e8f0ee]/30 transition-all duration-300 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#2a655f]", children: isArabic ? "Excel" : "Excel" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "تصدير إلى Excel" : "Export to Excel" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => exportToWord(filteredOrders, "تقرير الطلبات"), className: "h-9 rounded-xl border-[#2a655f]/30 hover:bg-[#e8f0ee]/30 transition-all duration-300 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#2a655f]", children: isArabic ? "Word" : "Word" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "تصدير إلى Word" : "Export to Word" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handlePrint, className: "h-9 rounded-xl border-[#2a655f]/30 hover:bg-[#e8f0ee]/30 transition-all duration-300 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#2a655f]", children: isArabic ? "طباعة" : "Print" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "طباعة التقرير" : "Print Report" })
            ] })
          ] })
        ] }),
        ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" }, i)) }) : filteredOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#2a655f]/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#e8f0ee]/30 flex items-center justify-center mx-auto mb-4 animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-10 w-10 text-[#2a655f]/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-slate-900 dark:text-white", children: isArabic ? "لا توجد طلبات" : "No orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: isArabic ? "لم يتم استلام أي طلبات توصيل بعد" : "No delivery orders received yet" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: paginatedOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCard, { order, isArabic, onAccept: () => {
            console.log("📦 Order data:", order);
            console.log("🆔 order.id:", order.id);
            console.log("🆔 order.order_id:", order.order_id);
            console.log("🔍 order_id exists?", !!order.order_id);
            setSelectedDeliveryOrderId(order.id);
            setSelectedOrderId(order.order_id);
            setSelectedDistributorId("");
            setDistributorSearch("");
            setAcceptDialogOpen(true);
          }, onReject: () => {
            setSelectedDeliveryOrderId(order.id);
            setSelectedOrderId(order.order_id);
            setRejectReason("");
            setRejectDialogOpen(true);
          }, onViewDetails: (details) => {
            setSelectedOrderForDetails(details);
            setShowOrderDetails(true);
          } }, order.id)) }),
          filteredOrders.length > 0 && totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[#2a655f]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? `عرض ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredOrders.length)} من ${filteredOrders.length} طلب` : `Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredOrders.length)} of ${filteredOrders.length} orders` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: "rounded-xl h-9 w-9 p-0 border-[#2a655f]/30 hover:bg-[#e8f0ee]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 text-[#2a655f]" }) }),
              [...Array(Math.min(totalPages, 7))].map((_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                  if (i === 6) pageNum = totalPages;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                if (i === 0 && pageNum > 1) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(1), className: "rounded-xl h-9 min-w-[36px] px-2 text-xs border-[#2a655f]/30 hover:bg-[#e8f0ee]/30", children: "1" }, "first");
                }
                if (i === 0 && pageNum > 2) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1 text-muted-foreground", children: "…" }, "dots1");
                }
                if (i === 6 && pageNum < totalPages - 1) {
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1 text-muted-foreground", children: "…" }, "dots2");
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: currentPage === pageNum ? "default" : "outline", size: "sm", onClick: () => setCurrentPage(pageNum), className: cn("rounded-xl h-9 min-w-[36px] px-2 text-xs", currentPage === pageNum && "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-md shadow-[#2a655f]/30"), children: pageNum }, pageNum);
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: "rounded-xl h-9 w-9 p-0 border-[#2a655f]/30 hover:bg-[#e8f0ee]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-[#2a655f]" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: itemsPerPage, onChange: (e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }, className: "h-9 px-2 rounded-xl border border-[#2a655f]/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "5", children: "5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "10", children: "10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "25", children: "25" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "50", children: "50" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "لكل صفحة" : "per page" })
            ] })
          ] })
        ] })
      ] }),
      activeTab === "distributors" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6 flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-[#2a655f]" }),
              isArabic ? "الموزعين" : "Distributors",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-muted-foreground", children: [
                "(",
                allDistributors.length,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "إدارة الموزعين وحالتهم" : "Manage distributors and their status" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => exportToCSV(allDistributors, "الموزعين"), className: "h-9 rounded-xl border-[#2a655f]/30 hover:bg-[#e8f0ee]/30 transition-all duration-300 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#2a655f]", children: isArabic ? "Excel" : "Excel" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "تصدير الموزعين إلى Excel" : "Export distributors to Excel" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => exportToWord(allDistributors, "تقرير الموزعين"), className: "h-9 rounded-xl border-[#2a655f]/30 hover:bg-[#e8f0ee]/30 transition-all duration-300 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#2a655f]", children: isArabic ? "Word" : "Word" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "تصدير الموزعين إلى Word" : "Export distributors to Word" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handlePrint, className: "h-9 rounded-xl border-[#2a655f]/30 hover:bg-[#e8f0ee]/30 transition-all duration-300 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#2a655f]", children: isArabic ? "طباعة" : "Print" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "طباعة تقرير الموزعين" : "Print distributors report" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showAddDistributorDialog, onOpenChange: setShowAddDistributorDialog, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white hover:from-[#1a4f4a] hover:to-[#2a655f] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#2a655f]/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-1" }),
                isArabic ? "إضافة موزع" : "Add Distributor"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-h-[90vh] overflow-y-auto border-[#2a655f]/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-6 w-6 text-[#2a655f]" }),
                    isArabic ? "➕ إضافة موزع جديد" : "➕ Add New Distributor"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? "سيتم إنشاء حساب للموزع مع رقم هاتف وكلمة مرور" : "A new distributor account will be created with phone and password" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddDistributor, className: "space-y-4 py-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-3 p-4 bg-[#e8f0ee]/20 rounded-xl border border-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageInput, { value: avatarUrl || "", onChange: (value) => setAvatarUrl(value), userId: app.user?.id, folder: "distributors", lang: app.lang, label: isArabic ? "صورة الموزع" : "Distributor Photo", previewClassName: "h-24 w-24 rounded-full object-cover border-4 border-[#3a8a82]/50", hint: isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "الاسم (عربي) *" : "Name (Arabic) *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "full_name_ar", placeholder: isArabic ? "أحمد محمد" : "Ahmed", dir: "rtl", required: true, className: "rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "الاسم (إنجليزي)" : "Name (English)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "full_name_en", placeholder: "Ahmed Mohamad", className: "rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "رقم الهاتف *" : "Phone *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "phone", placeholder: "0962XXXXXX", dir: "ltr", required: true, className: "rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "سيستخدم هذا الرقم لتسجيل الدخول" : "This number will be used for login" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "كلمة المرور *" : "Password *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "password", type: showDistributorPassword ? "text" : "password", placeholder: "********", required: true, minLength: 6, className: "rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20 pe-10" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowDistributorPassword(!showDistributorPassword), className: "absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-[#2a655f] transition-colors", children: showDistributorPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "6 أحرف على الأقل" : "At least 6 characters" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "المحافظة" : "Governorate" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (value) => {
                      const form = document.querySelector("form");
                      if (form) {
                        const existingInput = form.querySelector('input[name="governorate_id"]');
                        if (existingInput) existingInput.remove();
                        const input = document.createElement("input");
                        input.type = "hidden";
                        input.name = "governorate_id";
                        input.value = value;
                        form.appendChild(input);
                      }
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر المحافظة" : "Select governorate" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: governorates.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g.id, children: isArabic ? g.name_ar : g.name_en }, g.id)) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "العنوان (عربي)" : "Address (Arabic)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "address_ar", placeholder: isArabic ? "دمشق" : "Damascus", dir: "rtl", className: "rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "العنوان (إنجليزي)" : "Address (English)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "address_en", placeholder: "Damascus", className: "rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "نوع الموزع" : "Distributor Type" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { defaultValue: "freelance", onValueChange: (value) => {
                        const form = document.querySelector("form");
                        if (form) {
                          const existingInput = form.querySelector('input[name="distributor_type"]');
                          if (existingInput) existingInput.remove();
                          const input = document.createElement("input");
                          input.type = "hidden";
                          input.name = "distributor_type";
                          input.value = value;
                          form.appendChild(input);
                        }
                      }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "freelance", children: isArabic ? "🆓 مستقل" : "🆓 Freelance" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "company_employee", children: isArabic ? "🏢 موظف شركة" : "🏢 Company Employee" })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "متاح للعمل" : "Available" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { defaultValue: "available", onValueChange: (value) => {
                        const form = document.querySelector("form");
                        if (form) {
                          const existingInput = form.querySelector('input[name="is_available"]');
                          if (existingInput) existingInput.remove();
                          const input = document.createElement("input");
                          input.type = "hidden";
                          input.name = "is_available";
                          input.value = value;
                          form.appendChild(input);
                        }
                      }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
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
                  company && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground bg-[#e8f0ee]/20 p-3 rounded-xl border border-[#2a655f]/30", children: isArabic ? `🔗 سيتم ربط الموزع بشركة "${company.name_ar}"` : `🔗 Distributor will be linked to company "${company.name_en}"` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-4 border-t border-[#2a655f]/30", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => setShowAddDistributorDialog(false), className: "border-[#2a655f]/30 hover:bg-[#e8f0ee]/30", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
                      isArabic ? "إلغاء" : "Cancel"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white hover:from-[#1a4f4a] hover:to-[#2a655f] transition-all duration-300 shadow-lg shadow-[#2a655f]/30", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-1" }),
                      isArabic ? "إضافة الموزع" : "Add Distributor"
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/delivery/distributors", className: "inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "border-[#2a655f]/30 hover:bg-[#e8f0ee]/30 transition-all duration-300 text-[#2a655f]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 mr-1" }),
              isArabic ? "إدارة الموزعين" : "Manage Distributors"
            ] }) })
          ] })
        ] }),
        distributorsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-2xl" }, i)) }) : allDistributors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#2a655f]/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-12 w-12 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "لا يوجد موزعين" : "No distributors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: isArabic ? "قم بإضافة موزعين لشركتك" : "Add distributors to your company" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: allDistributors.map((dist) => /* @__PURE__ */ jsxRuntimeExports.jsx(DistributorCard, { distributor: dist, isArabic, onDeactivate: openDeactivateDistributorDialog }, dist.id)) })
      ] }),
      activeTab === "analytics" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in slide-in-from-top-5 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-[#2a655f]" }),
              isArabic ? "📈 التحليلات" : "📈 Analytics"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "إحصائيات وتقارير الأداء" : "Statistics and performance reports" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
                const analyticsData = [{
                  [isArabic ? "المؤشر" : "Metric"]: isArabic ? "إجمالي الطلبات" : "Total Orders",
                  [isArabic ? "القيمة" : "Value"]: stats.total
                }, {
                  [isArabic ? "المؤشر" : "Metric"]: isArabic ? "قيد المراجعة" : "Pending",
                  [isArabic ? "القيمة" : "Value"]: stats.pending
                }, {
                  [isArabic ? "المؤشر" : "Metric"]: isArabic ? "تم التعيين" : "Assigned",
                  [isArabic ? "القيمة" : "Value"]: stats.assigned
                }, {
                  [isArabic ? "المؤشر" : "Metric"]: isArabic ? "قيد التوصيل" : "In Transit",
                  [isArabic ? "القيمة" : "Value"]: stats.inTransit
                }, {
                  [isArabic ? "المؤشر" : "Metric"]: isArabic ? "تم التوصيل" : "Delivered",
                  [isArabic ? "القيمة" : "Value"]: stats.delivered
                }, {
                  [isArabic ? "المؤشر" : "Metric"]: isArabic ? "ملغي" : "Cancelled",
                  [isArabic ? "القيمة" : "Value"]: stats.cancelled
                }, {
                  [isArabic ? "المؤشر" : "Metric"]: isArabic ? "الإيرادات" : "Revenue",
                  [isArabic ? "القيمة" : "Value"]: stats.totalRevenue
                }, {
                  [isArabic ? "المؤشر" : "Metric"]: isArabic ? "نسبة الإنجاز" : "Completion Rate",
                  [isArabic ? "القيمة" : "Value"]: `${stats.completionRate}%`
                }, {
                  [isArabic ? "المؤشر" : "Metric"]: isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time",
                  [isArabic ? "القيمة" : "Value"]: `${stats.avgDeliveryTime} ${isArabic ? "دقيقة" : "min"}`
                }];
                exportToCSV(analyticsData, "التقارير_التحليلية");
              }, className: "h-9 rounded-xl border-[#2a655f]/30 hover:bg-[#e8f0ee]/30 transition-all duration-300 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#2a655f]", children: isArabic ? "Excel" : "Excel" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "تصدير التحليلات إلى Excel" : "Export analytics to Excel" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handlePrint, className: "h-9 rounded-xl border-[#2a655f]/30 hover:bg-[#e8f0ee]/30 transition-all duration-300 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#2a655f]", children: isArabic ? "طباعة" : "Print" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "طباعة التحليلات" : "Print analytics" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-[#2a655f]/40 hover:border-[#2a655f]/60 transition-all duration-300 shadow-xl shadow-[#2a655f]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-[#2a655f] dark:text-[#3a8a82]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-5 w-5 text-emerald-500" }),
                isArabic ? "📈 الإيرادات" : "📈 Revenue"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "إجمالي إيرادات التوصيل" : "Total delivery revenue" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-4xl font-bold text-emerald-500 animate-in slide-in-from-left-5 duration-500", children: [
                stats.totalRevenue.toLocaleString(),
                " ",
                app.currency
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
                isArabic ? `من ${stats.delivered} طلب تم توصيله` : `from ${stats.delivered} delivered orders`
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-[#2a655f]/40 hover:border-[#2a655f]/60 transition-all duration-300 shadow-xl shadow-[#2a655f]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-[#2a655f] dark:text-[#3a8a82]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-[#2a655f]" }),
                isArabic ? "📊 توزيع الطلبات" : "📊 Orders Distribution"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "حالة الطلبات الحالية" : "Current order status" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [{
              label: isArabic ? "قيد المراجعة" : "Pending",
              value: stats.pending,
              color: "bg-[#3a8a82]"
            }, {
              label: isArabic ? "تم التعيين" : "Assigned",
              value: stats.assigned,
              color: "bg-[#2a655f]"
            }, {
              label: isArabic ? "قيد التوصيل" : "In Transit",
              value: stats.inTransit,
              color: "bg-[#1a4f4a]"
            }, {
              label: isArabic ? "تم التوصيل" : "Delivered",
              value: stats.delivered,
              color: "bg-emerald-500"
            }, {
              label: isArabic ? "ملغي" : "Cancelled",
              value: stats.cancelled,
              color: "bg-red-500"
            }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-full rounded-full", item.color), style: {
                width: stats.total > 0 ? `${item.value / stats.total * 100}%` : "0%"
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium min-w-[80px]", children: item.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground min-w-[40px] text-end", children: item.value })
            ] }, item.label)) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "md:col-span-2 border-2 border-[#2a655f]/40 hover:border-[#2a655f]/60 transition-all duration-300 shadow-xl shadow-[#2a655f]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-[#2a655f] dark:text-[#3a8a82]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5 text-[#2a655f]" }),
              isArabic ? "⚡ مقاييس الأداء" : "⚡ Performance Metrics"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-[#e8f0ee]/20 rounded-xl hover:shadow-md transition-all group hover:scale-105", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-6 w-6 text-[#2a655f] mx-auto mb-2 group-hover:rotate-12 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-[#2a655f]", children: [
                  stats.completionRate,
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "نسبة الإنجاز" : "Completion Rate" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-[#e8f0ee]/20 rounded-xl hover:shadow-md transition-all group hover:scale-105", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6 text-[#2a655f] mx-auto mb-2 group-hover:rotate-12 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-[#2a655f]", children: [
                  stats.avgDeliveryTime,
                  " ",
                  isArabic ? "د" : "min"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-[#e8f0ee]/20 rounded-xl hover:shadow-md transition-all group hover:scale-105", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-[#2a655f] mx-auto mb-2 group-hover:rotate-12 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-[#2a655f]", children: stats.delivered }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "تم التوصيل" : "Delivered" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-[#e8f0ee]/20 rounded-xl hover:shadow-md transition-all group hover:scale-105", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-6 w-6 text-[#2a655f] mx-auto mb-2 group-hover:rotate-12 transition-transform" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-[#2a655f]", children: stats.totalRevenue.toLocaleString() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "إجمالي الإيرادات" : "Total Revenue" })
              ] })
            ] }) })
          ] })
        ] })
      ] }),
      activeTab === "admins" && company && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in slide-in-from-top-5 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5 text-amber-500" }),
            isArabic ? " المدراء" : " Managers"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "إدارة مدراء شركة التوصيل" : "Manage delivery company managers" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DeliveryAdminsManager, { companyId: company.id, companyName: company.name_ar, isArabic })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: acceptDialogOpen, onOpenChange: setAcceptDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg rounded-2xl border-[#2a655f]/40 bg-white dark:bg-slate-900 p-0 shadow-2xl shadow-[#2a655f]/20 overflow-hidden max-h-[90vh] flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] p-5 text-white flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold", children: isArabic ? "🚚 قبول طلب التوصيل" : "🚚 Accept Delivery Order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm mt-0.5", children: isArabic ? "اختر موزعاً من شركتك وحدد وقت التوصيل" : "Select a distributor from your company and set delivery time" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 flex-1 overflow-y-auto", children: distributorsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: isArabic ? "جاري تحميل الموزعين..." : "Loading distributors..." })
      ] }) : !allDistributors || allDistributors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-12 w-12 text-muted-foreground/50 mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-700 dark:text-slate-300", children: isArabic ? "❌ لا يوجد موزعين في شركتك" : "❌ No distributors in your company" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: isArabic ? "قم بإضافة موزعين للشركة من تبويب الموزعين" : "Add distributors to your company from the Distributors tab" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: isArabic ? "🔍 ابحث باسم أو رقم الموزع..." : "🔍 Search by name or phone...", value: distributorSearch, onChange: (e) => setDistributorSearch(e.target.value), className: "ps-9 h-10 rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20" }),
          distributorSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDistributorSearch(""), className: "absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: isArabic ? `🟢 ${allDistributors.length} موزع في شركتك` : `🟢 ${allDistributors.length} distributors in your company` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-[300px] overflow-y-auto pr-1", children: allDistributors.filter((dist) => {
          const search = distributorSearch.toLowerCase().trim();
          if (!search) return true;
          const nameAr = dist.full_name_ar?.toLowerCase() || "";
          const nameEn = dist.full_name_en?.toLowerCase() || "";
          const phone = dist.phone?.toLowerCase() || "";
          return nameAr.includes(search) || nameEn.includes(search) || phone.includes(search);
        }).map((dist) => {
          const stats2 = distributorStats[dist.id] || {
            pending: 0,
            completed: 0
          };
          stats2.pending > 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setSelectedDistributorId(dist.id), className: cn("flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md", selectedDistributorId === dist.id ? "border-[#2a655f] bg-[#e8f0ee]/30 shadow-md shadow-[#2a655f]/20" : "border-[#2a655f]/30 hover:border-[#2a655f]/50 hover:bg-[#e8f0ee]/20"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-[#e8f0ee]/40 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-[#2a655f]/40", children: dist.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: dist.avatar_url, alt: dist.full_name_ar || dist.full_name_en || "موزع", className: "h-full w-full object-cover", onError: (e) => {
              e.target.style.display = "none";
            } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-[#2a655f]", children: dist.full_name_ar?.charAt(0) || dist.full_name_en?.charAt(0) || "M" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-900 dark:text-white", children: isArabic ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar }),
                dist.is_available ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-[9px]", children: [
                  "● ",
                  isArabic ? "متاح" : "Available"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/20 text-red-600 dark:text-red-400 border-0 text-[9px]", children: [
                  "● ",
                  isArabic ? "غير متاح" : "Unavailable"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                  dist.phone || (isArabic ? "غير متوفر" : "Not available")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-yellow-400 text-yellow-400" }),
                  Number(dist.rating || 0).toFixed(1)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-end gap-0.5 flex-shrink-0", children: isLoadingStats ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-[#2a655f]" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-amber-600 dark:text-amber-400 font-medium", children: isArabic ? "جارية:" : "Active:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-xs font-bold", stats2.pending > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"), children: stats2.pending }),
                stats2.pending > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-emerald-600 dark:text-emerald-400 font-medium", children: isArabic ? "مكتملة:" : "Completed:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-emerald-600 dark:text-emerald-400", children: stats2.completed }),
                stats2.completed > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 text-emerald-500" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0", selectedDistributorId === dist.id ? "border-[#2a655f] bg-[#2a655f]" : "border-[#2a655f]/50"), children: selectedDistributorId === dist.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-white" }) })
          ] }, dist.id);
        }) }),
        allDistributors.filter((dist) => {
          const search = distributorSearch.toLowerCase().trim();
          if (!search) return true;
          const nameAr = dist.full_name_ar?.toLowerCase() || "";
          const nameEn = dist.full_name_en?.toLowerCase() || "";
          const phone = dist.phone?.toLowerCase() || "";
          return nameAr.includes(search) || nameEn.includes(search) || phone.includes(search);
        }).length === 0 && distributorSearch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-8 w-8 text-muted-foreground/50 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? `❌ لا توجد نتائج لـ "${distributorSearch}"` : `❌ No results for "${distributorSearch}"` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-4 bg-[#e8f0ee]/20 rounded-xl border border-[#2a655f]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            isArabic ? "⏰ الوقت المتوقع للوصول" : "⏰ Estimated Delivery Time"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600 dark:text-slate-300", children: isArabic ? "عدد الساعات حتى الوصول" : "Hours until delivery" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0.5, step: 0.5, value: estimatedDeliveryHours, onChange: (e) => setEstimatedDeliveryHours(parseFloat(e.target.value) || 0), className: "h-9 rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20 w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: isArabic ? "ساعة" : "hrs" })
              ] }),
              estimatedDeliveryHours > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-600 dark:text-emerald-400 mt-1", children: [
                "🕐 ",
                new Date(Date.now() + estimatedDeliveryHours * 60 * 60 * 1e3).toLocaleTimeString(isArabic ? "ar-SA" : "en-US", {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-slate-600 dark:text-slate-300", children: isArabic ? "وقت الاستلام المتوقع" : "Estimated pickup time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0.25, step: 0.25, value: estimatedPickupHours, onChange: (e) => setEstimatedPickupHours(parseFloat(e.target.value) || 0), className: "h-9 rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20 w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: isArabic ? "ساعة" : "hrs" })
              ] }),
              estimatedPickupHours > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-blue-600 dark:text-blue-400 mt-1", children: [
                "🕐 ",
                new Date(Date.now() + estimatedPickupHours * 60 * 60 * 1e3).toLocaleTimeString(isArabic ? "ar-SA" : "en-US", {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              ] })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-[#2a655f]/30 bg-[#e8f0ee]/20 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => {
          setAcceptDialogOpen(false);
          setSelectedDeliveryOrderId(null);
          setSelectedOrderId(null);
          setSelectedDistributorId("");
          setDistributorSearch("");
        }, className: "flex-1 rounded-xl border-[#2a655f]/30 hover:bg-[#e8f0ee]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
          isArabic ? "إلغاء" : "Cancel"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleAcceptDelivery, disabled: !selectedDistributorId || isProcessing, className: "flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white hover:from-[#1a4f4a] hover:to-[#2a655f] shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100", children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }),
          isArabic ? "جاري..." : "Processing..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 mr-2" }),
          isArabic ? "تأكيد القبول" : "Confirm Accept"
        ] }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: rejectDialogOpen, onOpenChange: setRejectDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-red-200/50 dark:border-red-800/30 bg-white dark:bg-slate-900 p-0 shadow-2xl shadow-red-500/10 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-red-600 to-rose-600 p-5 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold", children: isArabic ? "❌ رفض طلب التوصيل" : "❌ Reject Delivery Order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm mt-0.5", children: isArabic ? "أدخل سبب الرفض لإرساله للعميل والبائع" : "Enter the rejection reason to send to customer and seller" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "سيتم إرسال سبب الرفض إلى البائع والعميل" : "The rejection reason will be sent to the seller and customer" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-1.5", children: [
            isArabic ? "سبب الرفض" : "Rejection Reason",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: rejectReason, onChange: (e) => setRejectReason(e.target.value), placeholder: isArabic ? "اكتب سبب رفض الطلب (مثال: لا يوجد موزع متاح، المنطقة غير مغطاة، ...)" : "Write the reason for rejecting the order (e.g., no distributor available, area not covered, ...)", className: "w-full min-h-[100px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-200 resize-none", dir: isArabic ? "rtl" : "ltr" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            rejectReason.length,
            "/500"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: [isArabic ? "لا يوجد موزع متاح" : "No distributor available", isArabic ? "المنطقة غير مغطاة" : "Area not covered", isArabic ? "الطلب خارج أوقات العمل" : "Order outside working hours", isArabic ? "مشكلة في العنوان" : "Address issue", isArabic ? "العميل غير متاح" : "Customer unavailable", isArabic ? "سبب آخر" : "Other reason"].map((reason, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRejectReason(reason), className: "px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200", children: reason }, idx)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => {
          setRejectDialogOpen(false);
          setSelectedDeliveryOrderId(null);
          setSelectedOrderId(null);
          setRejectReason("");
        }, className: "flex-1 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
          isArabic ? "إلغاء" : "Cancel"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleRejectDelivery, disabled: !rejectReason.trim() || isProcessing, className: "flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100", children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }),
          isArabic ? "جاري الرفض..." : "Rejecting..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 mr-2" }),
          isArabic ? "تأكيد الرفض" : "Confirm Reject"
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDeactivateDistributorDialog, onOpenChange: setShowDeactivateDistributorDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-0 p-0 overflow-hidden shadow-2xl bg-white dark:bg-slate-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-7 w-7 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-1 rounded-2xl bg-amber-400/30 blur-lg animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-bold", children: isArabic ? "⚠️ تعطيل الموزع" : "⚠️ Deactivate Distributor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm mt-0.5", children: isArabic ? "لن يتمكن الموزع من استلام طلبات جديدة" : "Distributor will not be able to receive new orders" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-amber-700 dark:text-amber-300", children: isArabic ? "هل أنت متأكد؟" : "Are you sure?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-amber-600/80 dark:text-amber-400/70", children: isArabic ? `سيتم تعطيل "${deactivatingDistributor?.full_name_ar || deactivatingDistributor?.full_name_en || ""}" ولن يتمكن من استلام طلبات جديدة` : `"${deactivatingDistributor?.full_name_en || deactivatingDistributor?.full_name_ar || ""}" will be deactivated and won't receive new orders` })
          ] })
        ] }),
        deactivatingDistributor && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "الاسم" : "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: deactivatingDistributor.full_name_ar || deactivatingDistributor.full_name_en || "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "رقم الهاتف" : "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", dir: "ltr", children: deactivatingDistributor.phone || "-" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-blue-500 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-700 dark:text-blue-400", children: isArabic ? "💡 يمكنك تفعيل الموزع مرة أخرى في أي وقت" : "💡 You can reactivate the distributor at any time" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => {
          setShowDeactivateDistributorDialog(false);
          setDeactivatingDistributor(null);
        }, className: "flex-1 rounded-xl", disabled: isDeactivating, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
          isArabic ? "إلغاء" : "Cancel"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDeactivateDistributor, disabled: isDeactivating, className: "flex-1 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-600/30 transition-all duration-300", children: isDeactivating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          isArabic ? "جاري التعطيل..." : "Deactivating..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-4 w-4 mr-2" }),
          isArabic ? "تأكيد التعطيل" : "Confirm Deactivate"
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showOrderDetails, onOpenChange: setShowOrderDetails, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-[#2a655f]/30 bg-white dark:bg-slate-900 p-6 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "absolute top-4 end-4 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white z-30", onClick: () => setShowOrderDetails(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
      (() => {
        const orderData = selectedOrderForDetails;
        if (!orderData) {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin mx-auto text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: isArabic ? "جاري تحميل تفاصيل الطلب..." : "Loading order details..." })
          ] });
        }
        const orderItems = orderData?.order_items || [];
        const orderObj = orderData?.order || null;
        console.log("📦 [OrderDetailsDialog] orderItems:", orderItems);
        console.log("📦 [OrderDetailsDialog] orderItems length:", orderItems.length);
        const buyerName = orderObj?.buyer_name || orderData?.buyer?.name || (isArabic ? "غير معروف" : "Unknown");
        const buyerPhone = orderObj?.buyer_phone || orderData?.buyer?.phone || "";
        const buyerAvatar = orderObj?.buyer_avatar || orderData?.buyer?.avatar_url || null;
        const deliveryAddress = orderObj?.delivery_address || orderData?.delivery_address || orderData?.pickup_address || (isArabic ? "غير محدد" : "Not specified");
        let storeName = "";
        let storeLogo = null;
        let storePhone = null;
        if (orderItems.length > 0) {
          const firstItem = orderItems[0];
          const listing = firstItem?.listings;
          if (listing?.profile) {
            storeName = listing.profile.store_name || listing.profile.full_name || (isArabic ? "متجر" : "Store");
            storeLogo = listing.profile.store_logo_url || null;
            storePhone = listing.profile.store_phone || null;
          }
        }
        if (!storeName && orderObj?.listings?.profile) {
          storeName = orderObj.listings.profile.store_name || orderObj.listings.profile.full_name || (isArabic ? "متجر" : "Store");
          storeLogo = orderObj.listings.profile.store_logo_url || null;
          storePhone = orderObj.listings.profile.store_phone || null;
        }
        if (!storeName) {
          storeName = isArabic ? "متجر" : "Store";
        }
        const subtotal = orderObj?.total || orderData?.totals?.subtotal || 0;
        const deliveryFee = orderObj?.delivery_fee || orderData?.totals?.delivery_fee || 0;
        const promoDiscount = orderObj?.promo_discount || orderData?.totals?.promo_discount || 0;
        const totalWithDelivery = orderObj?.total_with_delivery || orderData?.totals?.total_with_delivery || subtotal + deliveryFee - promoDiscount;
        const currency = orderObj?.currency || orderData?.totals?.currency || app.currency || "SYP";
        const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1;
        const status = getStatusLabel(orderData.status);
        const statusColor = getStatusColor(orderData.status);
        const isActive = orderData.status === "pending" || orderData.status === "assigned" || orderData.status === "in_transit";
        const getVariationCombination2 = (item) => {
          if (item.variation_snapshot?.combination) return item.variation_snapshot.combination;
          if (item.metadata?.variation_combination) return item.metadata.variation_combination;
          if (item.variation_combination) return item.variation_combination;
          if (item.selected_options?.variation_combination) return item.selected_options.variation_combination;
          return null;
        };
        const getVariationDisplay2 = (combination) => {
          if (!combination) return null;
          const parts = [];
          const order = ["colors", "sizes", "size", "color", "اللون", "المقاس", "colour"];
          for (const key of order) {
            if (combination[key]) parts.push(combination[key]);
          }
          for (const [key, value] of Object.entries(combination)) {
            if (!order.includes(key) && value) parts.push(String(value));
          }
          return parts.length > 0 ? parts.join(" • ") : null;
        };
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }) }),
                isArabic ? "تفاصيل الطلب" : "Order Details"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#2a655f]" }),
                isArabic ? `طلب #${orderData.id?.substring(0, 8) || "غير معروف"}` : `Order #${orderData.id?.substring(0, 8) || "Unknown"}`
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("border-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm", statusColor, isActive && "animate-pulse"), children: status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("p-4 rounded-xl border mb-4", statusColor), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-8 w-8 rounded-lg flex items-center justify-center bg-white/20", children: [
              orderData.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-yellow-500" }),
              orderData.status === "assigned" && /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-purple-500" }),
              orderData.status === "picked_up" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-blue-500" }),
              orderData.status === "in_transit" && /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-orange-500" }),
              orderData.status === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-500" }),
              orderData.status === "cancelled" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-red-500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm", children: status }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                orderData.status === "pending" && (isArabic ? "في انتظار الموافقة من شركة التوصيل" : "Awaiting delivery company approval"),
                orderData.status === "assigned" && (isArabic ? "تم تعيين موزع لتوصيل الطلب" : "Distributor assigned for delivery"),
                orderData.status === "picked_up" && (isArabic ? "تم استلام الطلب من الموزع" : "Order picked up by distributor"),
                orderData.status === "in_transit" && (isArabic ? "الطلب في طريقه إليك" : "Order is on its way"),
                orderData.status === "delivered" && (isArabic ? "تم توصيل الطلب بنجاح" : "Order delivered successfully"),
                orderData.status === "cancelled" && (isArabic ? "تم إلغاء الطلب" : "Order cancelled")
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#e8f0ee]/20 dark:bg-[#e8f0ee]/10 rounded-xl border border-[#2a655f]/30 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              storeLogo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: storeLogo, alt: storeName, className: "h-12 w-12 rounded-xl object-cover border-2 border-[#2a655f]/30" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white font-bold text-lg", children: storeName.charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3 text-[#2a655f]" }),
                  isArabic ? "المتجر" : "Store"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-700 dark:text-slate-300", children: storeName }),
                storePhone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                  storePhone
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 text-[#2a655f]" }),
                isArabic ? "العميل" : "Customer"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
                buyerAvatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: buyerAvatar, alt: buyerName, className: "h-8 w-8 rounded-full object-cover border-2 border-[#2a655f]/30" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-[#e8f0ee]/30 flex items-center justify-center border-2 border-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-[#2a655f]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-700 dark:text-slate-300", children: buyerName }),
                  buyerPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                    buyerPhone
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-[#e8f0ee]/20 dark:bg-[#e8f0ee]/10 rounded-xl border border-[#2a655f]/30 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-[#2a655f]" }),
              isArabic ? "عنوان التوصيل" : "Delivery Address"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 dark:text-slate-300 mt-1", children: deliveryAddress })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-[#2a655f]/30 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-sm flex items-center gap-2 mb-3 text-[#2a655f]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-[#2a655f]" }),
              isArabic ? "المنتجات" : "Products",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#e8f0ee]/30 text-[#2a655f] border-0 text-[10px]", children: orderItems.length })
            ] }),
            orderItems.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orderItems.map((item, index) => {
              const listing = item.listings || item;
              const isPromo = isPromoOffer(item);
              const offerData = getPromoOfferData(item);
              const imageUrl = getProductImage(item);
              const variationCombination = getVariationCombination2(item);
              const hasVariation = !!(variationCombination && Object.keys(variationCombination).length > 0);
              const variationDisplay = getVariationDisplay2(variationCombination);
              const itemPrice = Number(item.price) || 0;
              const itemQuantity = item.quantity || 1;
              const totalPrice = itemPrice * itemQuantity;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("p-3 rounded-xl border-2 transition-all duration-300", isPromo ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-300/50 dark:border-purple-700/50 hover:border-purple-400/70" : "bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/50"), children: [
                isPromo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 px-3 py-1 rounded-full text-xs font-bold", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-3.5 w-3.5 inline mr-1.5" }),
                      isArabic ? "عرض ترويجي" : "Promo Offer"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-purple-300 text-purple-600 text-[10px]", children: offerData?.offer_type === "bogo" ? "🎁 نفس المنتج" : offerData?.offer_type === "cross_sell" ? "🔄 منتج مختلف" : "📦 باقة" })
                  ] }),
                  offerData?.display_text_ar && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: isArabic ? offerData.display_text_ar : offerData.display_text_en }),
                  Object.keys(offerData?.required_products?.variations || {}).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-slate-500 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-4 bg-purple-500 rounded-full" }),
                      "🛒 ",
                      isArabic ? "المنتجات المطلوبة" : "Required Products",
                      "(",
                      Object.keys(offerData?.required_products?.variations || {}).length,
                      ")"
                    ] }),
                    Object.entries(offerData?.required_products?.variations || {}).map(([id, data]) => {
                      const comboText = Object.values(data.combination || {}).join(" • ");
                      const variationImage = data.image_url || offerData?.required_products?.main_product?.cover_url || null;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 bg-white/70 rounded-xl border border-purple-100/50", children: [
                        variationImage ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: variationImage, alt: comboText, className: "w-10 h-10 rounded-lg object-cover border border-purple-100", onError: (e) => {
                          e.target.src = "/placeholder.png";
                        } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 truncate", children: comboText || "فيرنت" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                            isArabic ? "الكمية" : "Qty",
                            ": ",
                            data.quantity
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-purple-600 whitespace-nowrap", children: [
                          (data.price * data.quantity).toLocaleString(),
                          " SYP"
                        ] })
                      ] }, id);
                    })
                  ] }),
                  Object.keys(offerData?.free_product?.variations || {}).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-emerald-500 flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-4 bg-emerald-500 rounded-full" }),
                      "🎁 ",
                      isArabic ? "الهدية" : "Gift",
                      "(",
                      Object.keys(offerData?.free_product?.variations || {}).length,
                      ")"
                    ] }),
                    Object.entries(offerData?.free_product?.variations || {}).map(([id, data]) => {
                      const comboText = Object.values(data.combination || {}).join(" • ");
                      const giftImage = data.image_url || offerData?.free_product?.cover_url || null;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 bg-emerald-50/70 rounded-xl border border-emerald-100/50", children: [
                        giftImage ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: giftImage, alt: comboText, className: "w-10 h-10 rounded-lg object-cover border border-emerald-100", onError: (e) => {
                          e.target.src = "/placeholder.png";
                        } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 truncate", children: comboText || "فيرنت" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                            isArabic ? "الكمية" : "Qty",
                            ": ",
                            data.quantity
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/20 text-emerald-600 border-0 text-xs font-bold px-3 py-1 rounded-full", children: [
                          "🎁 ",
                          isArabic ? "مجاناً" : "Free"
                        ] })
                      ] }, id);
                    })
                  ] })
                ] }),
                !isPromo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50", children: imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl, alt: "", className: "h-full w-full object-cover", onError: (e) => {
                    e.target.style.display = "none";
                  } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-slate-400" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-slate-800 dark:text-white", children: isArabic ? listing?.title_ar || "منتج" : listing?.title_en || listing?.title_ar || "Product" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground flex-wrap mt-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-600 dark:text-slate-400", children: isArabic ? "الكمية:" : "Qty:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-800 dark:text-white", children: itemQuantity })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-600 dark:text-emerald-400", children: isArabic ? "سعر الوحدة:" : "Unit:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-700 dark:text-emerald-300", children: formatPrice(itemPrice, currency, app.lang) })
                      ] }),
                      itemQuantity > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-[#e8f0ee]/30 px-2 py-0.5 rounded-full border border-[#2a655f]/30", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#2a655f]", children: isArabic ? "الإجمالي:" : "Total:" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#2a655f]", children: formatPrice(totalPrice, currency, app.lang) })
                        ] })
                      ] }),
                      hasVariation && variationDisplay && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/80 flex items-center gap-1 bg-[#e8f0ee]/20 px-2 py-0.5 rounded-full border border-[#2a655f]/20", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3 w-3 text-[#2a655f]" }),
                          variationDisplay,
                          imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl, alt: "", className: "h-4 w-4 rounded-md object-cover border border-slate-200/50 dark:border-slate-700/50 flex-shrink-0 ml-0.5" })
                        ] })
                      ] }),
                      item.metadata?.variation_combination && Object.keys(item.metadata.variation_combination).length > 0 && !variationDisplay && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground/70 flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-2.5 w-2.5" }),
                          Object.values(item.metadata.variation_combination).join(" • ")
                        ] })
                      ] }),
                      item.selected_options?.selected_color && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground/70 flex items-center gap-1 bg-[#e8f0ee]/20 px-2 py-0.5 rounded-full", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#2a655f]", children: "🎨" }),
                          item.selected_options.selected_color,
                          item.selected_options.selected_size && ` (${item.selected_options.selected_size})`
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              ] }, item.id || index);
            }) }) : (
              // ✅ حالة عدم وجود order_items
              (() => {
                const oldOrder = orderData?.order || orderData?.orders || null;
                const oldListing = oldOrder?.listings || orderData?.listings || null;
                if (oldListing) {
                  const oldQuantity = oldOrder?.quantity || 1;
                  const oldTotal = oldOrder?.total || 0;
                  const oldImageUrl = oldOrder?.metadata?.variation_image || oldOrder?.metadata?.product_cover || oldListing?.cover_url || null;
                  const oldVariationCombination = oldOrder?.metadata?.variation_combination || oldOrder?.variation_combination || null;
                  const oldHasVariation = !!(oldVariationCombination && Object.keys(oldVariationCombination).length > 0);
                  const oldVariationDisplay = getVariationDisplay2(oldVariationCombination);
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/50 transition-all duration-300", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50", children: oldImageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: oldImageUrl, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-slate-400" }) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-slate-800 dark:text-white", children: isArabic ? oldListing?.title_ar || "منتج" : oldListing?.title_en || oldListing?.title_ar || "Product" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: isArabic ? "الكمية:" : "Qty:" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-800 dark:text-white", children: oldQuantity })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-600 dark:text-emerald-400", children: isArabic ? "الإجمالي:" : "Total:" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-700 dark:text-emerald-300", children: formatPrice(oldTotal, currency, app.lang) })
                        ] }),
                        oldHasVariation && oldVariationDisplay && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/80 flex items-center gap-1 bg-[#e8f0ee]/20 px-2 py-0.5 rounded-full border border-[#2a655f]/20", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3 w-3 text-[#2a655f]" }),
                            oldVariationDisplay,
                            oldImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: oldImageUrl, alt: "", className: "h-4 w-4 rounded-md object-cover border border-slate-200/50 dark:border-slate-700/50 flex-shrink-0 ml-0.5" })
                          ] })
                        ] })
                      ] })
                    ] })
                  ] }) });
                } else {
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: isArabic ? "لا توجد منتجات في هذا الطلب" : "No products in this order" })
                  ] });
                }
              })()
            )
          ] }),
          orderObj?.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
              isArabic ? "ملاحظات العميل" : "Customer Notes"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 mt-1", children: orderObj.notes })
          ] }),
          orderData.status === "rejected" && orderData.rejection_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/30 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
              isArabic ? "سبب الرفض" : "Rejection Reason"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 mt-1", children: orderData.rejection_reason })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[#e8f0ee]/20 dark:bg-[#e8f0ee]/10 rounded-xl border border-[#2a655f]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: isArabic ? "المجموع الفرعي" : "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-[#2a655f] dark:text-[#3a8a82]", children: formatPrice(subtotal, currency, app.lang) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1 pt-1 border-t border-[#2a655f]/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: isArabic ? "سعر التوصيل" : "Delivery Fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-sm font-medium", deliveryFee === 0 ? "text-emerald-500 font-bold" : "text-[#2a655f]"), children: deliveryFee === 0 ? isArabic ? "🆓 مجاني" : "🆓 Free" : formatPrice(deliveryFee, currency, app.lang) })
            ] }),
            promoDiscount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1 pt-1 border-t border-[#2a655f]/20 text-emerald-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: isArabic ? "💚 الخصم" : "💚 Discount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold", children: [
                "-",
                formatPrice(promoDiscount, currency, app.lang)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t-2 border-[#2a655f]/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-[#2a655f] dark:text-white", children: isArabic ? "الإجمالي الكامل" : "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-[#2a655f] dark:text-[#3a8a82]", children: formatPrice(totalWithDelivery, currency, app.lang) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                totalItems,
                " ",
                isArabic ? "منتج" : "items"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(orderData.created_at || orderData.order_created_at || Date.now()).toLocaleString(isArabic ? "ar-SA" : "en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowOrderDetails(false), className: "rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#e8f0ee]/30", children: isArabic ? "إغلاق" : "Close" }),
            orderData.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white hover:from-[#1a4f4a] hover:to-[#2a655f] shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105", onClick: () => {
                setShowOrderDetails(false);
                const orderId = orderData.order?.id || orderData.id;
                setSelectedDeliveryOrderId(orderData.id);
                setSelectedOrderId(orderId);
                setSelectedDistributorId("");
                setDistributorSearch("");
                setAcceptDialogOpen(true);
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-1.5" }),
                isArabic ? "قبول الطلب" : "Accept Order"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", className: "rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105", onClick: () => {
                setShowOrderDetails(false);
                const orderId = orderData.order?.id || orderData.id;
                setSelectedDeliveryOrderId(orderData.id);
                setSelectedOrderId(orderId);
                setRejectReason("");
                setRejectDialogOpen(true);
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 mr-1.5" }),
                isArabic ? "رفض الطلب" : "Reject Order"
              ] })
            ] })
          ] })
        ] });
      })()
    ] }) }),
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
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-4px) rotate(-2deg); }
    75% { transform: translateY(-4px) rotate(2deg); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
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
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes float-truck {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-3px) rotate(-2deg); }
    75% { transform: translateY(-3px) rotate(2deg); }
  }
  .animate-float-truck {
    animation: float-truck 3s ease-in-out infinite;
  }
  
  @keyframes slide-in-from-top-5 {
    0% { transform: translateY(-5px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .animate-in.slide-in-from-top-5 {
    animation: slide-in-from-top-5 0.3s ease-out;
  }
  
  @keyframes slide-in-from-left-5 {
    0% { transform: translateX(-5px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  .animate-in.slide-in-from-left-5 {
    animation: slide-in-from-left-5 0.5s ease-out;
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(42,101,95,0.1); }
    50% { box-shadow: 0 0 40px rgba(42,101,95,0.2); }
  }
  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }
  
  @keyframes float-logo {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-6px) rotate(-2deg); }
    75% { transform: translateY(4px) rotate(2deg); }
  }
  .animate-float-logo {
    animation: float-logo 4s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { filter: drop-shadow(0 0 15px rgba(42,101,95,0.3)); }
    50% { filter: drop-shadow(0 0 30px rgba(42,101,95,0.6)); }
  }
  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }

  @keyframes pulse-slow {
    0%, 100% { opacity: 0.3; transform: scale(0.95); }
    50% { opacity: 0.6; transform: scale(1.05); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
` })
  ] }) });
}
function StatCard({
  icon: Icon,
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#e8f0ee] dark:bg-[#e8f0ee]/30 rounded-xl p-4 shadow-sm border-2 border-[#3a8a82]/60 dark:border-[#3a8a82]/30 hover:shadow-lg hover:border-[#2a655f]/60 transition-all duration-300 hover:scale-[1.03] group cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82] group-hover:text-[#2a655f] transition-colors duration-300", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold mt-1 text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-[#3a8a82]/50 dark:bg-[#3a8a82]/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#3a8a82]/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-[#2a655f]" }) })
  ] }) });
}
function OrderCard({
  order,
  isArabic,
  onAccept,
  onReject,
  onViewDetails
}) {
  const app = useApp();
  useNavigate();
  const {
    data: orderDetails,
    isLoading: loadingDetails,
    isError: detailsError
  } = useDeliveryOrderDetails(order.id);
  const formatTime2 = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString(isArabic ? "ar-SA" : "en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const getTotal = () => {
    if (orderDetails?.totals) {
      return orderDetails.totals.total_with_delivery || orderDetails.totals.subtotal || 0;
    }
    return order.delivery_fee || 0;
  };
  const getDeliveryFee = () => {
    if (orderDetails?.totals) {
      return orderDetails.totals.delivery_fee || 0;
    }
    return 0;
  };
  const getCustomerName = () => {
    if (orderDetails?.buyer?.name) {
      return orderDetails.buyer.name;
    }
    if (orderDetails?.order?.buyer_name) {
      return orderDetails.order.buyer_name;
    }
    if (order?.orders?.buyer_name) {
      return order.orders.buyer_name;
    }
    return isArabic ? "عميل" : "Customer";
  };
  const statusColors = {
    pending: "bg-[#e8f0ee]/60 text-[#2a655f] border-[#2a655f]/30",
    assigned: "bg-[#e8f0ee]/60 text-[#2a655f] border-[#2a655f]/30",
    picked_up: "bg-[#e8f0ee]/60 text-[#2a655f] border-[#2a655f]/30",
    in_transit: "bg-[#e8f0ee]/60 text-[#2a655f] border-[#2a655f]/30",
    delivered: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    failed: "bg-red-500/10 text-red-500 border-red-500/20"
  };
  const statusLabels = {
    pending: isArabic ? "قيد المراجعة" : "Pending",
    assigned: isArabic ? "تم التعيين" : "Assigned",
    picked_up: isArabic ? "تم الاستلام" : "Picked up",
    in_transit: isArabic ? "قيد التوصيل" : "In Transit",
    delivered: isArabic ? "تم التوصيل" : "Delivered",
    cancelled: isArabic ? "ملغي" : "Cancelled",
    failed: isArabic ? "فشل" : "Failed"
  };
  const isPending = order.status === "pending";
  const itemsCount = orderDetails?.order_items?.length || 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:border-[#2a655f]/60 transition-all duration-300 hover:scale-[1.01] group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-[#e8f0ee]/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-[#2a655f] dark:text-[#3a8a82]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors duration-300", children: [
            "#",
            order.tracking_number || order.id.substring(0, 8)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("border transition-all duration-300 hover:scale-105", statusColors[order.status] || "bg-slate-500/10 text-slate-500"), children: statusLabels[order.status] || order.status }),
          itemsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#e8f0ee]/30 text-[#2a655f] border-0 text-[9px]", children: [
            itemsCount,
            " ",
            isArabic ? "منتج" : "items"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 text-[#2a655f]" }),
            getCustomerName()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 group-hover:text-[#2a655f] transition-colors duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 group-hover:scale-110 transition-transform duration-300" }),
            order.delivery_address?.substring(0, 30) || (isArabic ? "عنوان غير محدد" : "No address")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[#2a655f]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
            formatTime2(order.created_at)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
            formatDate(order.created_at)
          ] }),
          loadingDetails ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-1 text-[#2a655f]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) }) : detailsError ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 text-[10px]", children: "⚠️" }) : orderDetails ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-[#2a655f] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3" }),
              isArabic ? "توصيل:" : "Delivery:",
              getDeliveryFee() === 0 ? isArabic ? "🆓 مجاني" : "🆓 Free" : formatPrice(getDeliveryFee(), app.currency, app.lang)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#2a655f] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3 w-3" }),
              isArabic ? "الإجمالي:" : "Total:",
              formatPrice(getTotal(), app.currency, app.lang)
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-[#2a655f]", children: [
            order.delivery_fee?.toLocaleString(),
            " ",
            app.currency
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "h-7 px-2.5 rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white text-[10px] font-bold shadow-md shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105", onClick: (e) => {
          e.stopPropagation();
          onAccept();
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 mr-1" }),
          isArabic ? "قبول" : "Accept"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", className: "h-7 px-2.5 rounded-lg text-[10px] font-bold shadow-md shadow-red-500/30 transition-all duration-300 hover:scale-105", onClick: (e) => {
          e.stopPropagation();
          onReject();
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 mr-1" }),
          isArabic ? "رفض" : "Reject"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 px-3 rounded-xl hover:bg-[#e8f0ee]/30 transition-all duration-300 group-hover:scale-110 text-[#2a655f]", onClick: () => {
        onViewDetails(orderDetails || order);
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
    ] })
  ] }) });
}
function DistributorCard({
  distributor,
  isArabic,
  onDeactivate
}) {
  const isActive = distributor.is_active !== false;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border-3 border-[#2a655f]/40 hover:border-[#2a655f] hover:shadow-xl shadow-[#2a655f]/10 transition-all duration-300 hover:scale-[1.03] group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-[#e8f0ee]/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 border-2 border-[#3a8a82]/50", children: distributor.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: distributor.avatar_url, alt: "", className: "h-full w-full object-cover rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-[#2a655f]" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors duration-300 line-clamp-1", children: isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar }),
        isActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-[9px] animate-pulse", children: [
          "● ",
          isArabic ? "نشط" : "Active"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/20 text-red-600 dark:text-red-400 border-0 text-[9px]", children: [
          "● ",
          isArabic ? "معطل" : "Deactivated"
        ] }),
        distributor.is_available ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-[9px]", children: isArabic ? "متاح" : "Available" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-red-500/20 text-red-600 dark:text-red-400 border-0 text-[9px]", children: isArabic ? "غير متاح" : "Unavailable" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground flex-wrap mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-yellow-400 text-yellow-400" }),
          Number(distributor.rating || 0).toFixed(1)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
          distributor.phone
        ] }),
        !isActive && distributor.deactivated_at && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: isArabic ? `تم التعطيل: ${new Date(distributor.deactivated_at).toLocaleDateString()}` : `Deactivated: ${new Date(distributor.deactivated_at).toLocaleDateString()}` })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 rounded-xl hover:bg-red-500/10 transition-all duration-300 group-hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuContent, { align: "end", className: "rounded-xl p-1 min-w-[180px]", children: isActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "rounded-lg cursor-pointer gap-2 text-amber-600 hover:bg-amber-50/50", onClick: () => onDeactivate(distributor), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-4 w-4" }),
        isArabic ? "تعطيل الموزع" : "Deactivate Distributor"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "rounded-lg cursor-pointer gap-2 text-emerald-600 hover:bg-emerald-50/50", onClick: () => {
        toast.info(isArabic ? "ℹ️ يمكنك إعادة تفعيل الموزع من صفحة إدارة الموزعين" : "ℹ️ You can reactivate the distributor from the Distributors management page");
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4" }),
        isArabic ? "تفعيل الموزع" : "Activate Distributor"
      ] }) })
    ] })
  ] }) });
}
function formatTime(date) {
  const now = /* @__PURE__ */ new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 6e4);
  const diffHours = Math.floor(diffMs / 36e5);
  const diffDays = Math.floor(diffMs / 864e5);
  const isArabic = document.documentElement.dir === "rtl";
  if (isArabic) {
    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return then.toLocaleDateString("ar-SA", {
      day: "numeric",
      month: "short"
    });
  } else {
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short"
    });
  }
}
export {
  DeliveryDashboardPage as component
};
