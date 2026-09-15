import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, a as useT, aq as useUserNotifications, au as useMarkNotificationReadV2, be as useMarkAllNotificationsReadV2, aJ as useUnreadCount, bh as useDeliveryOrderDetails, b8 as TooltipProvider, b9 as Tooltip, ba as TooltipTrigger, b as Button, bb as TooltipContent, B as Badge, D as Dialog, g as DialogContent, q as DialogHeader, l as DialogTitle, c as cn, w as DialogFooter, I as Input, $ as DropdownMenu, a0 as DropdownMenuTrigger, a1 as DropdownMenuContent, a2 as DropdownMenuItem, aH as Skeleton, k as formatPrice, L as Label, j as Textarea, m as DialogDescription, P as Avatar, Q as AvatarImage, U as AvatarFallback, bc as DropdownMenuSeparator, d as ImageInput, S as Select, r as SelectTrigger, s as SelectValue, t as SelectContent, v as SelectItem, aw as NOTIFICATION_CONFIG, ap as NOTIFICATION_TYPES } from "./router-BU7AgYzK.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BsaVHwzL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as Truck, ai as Bell, o as MessageCircle, cG as Languages, g as Sparkles, aj as BellOff, cw as BadgeCheck, aq as Award, Z as Zap, bS as Target, cz as Compass, F as Flame, l as Crown, bt as Gem, ar as Rocket, a1 as Shield, i as ShoppingBag, a9 as Settings, aa as Globe, O as Calendar, ak as TrendingUp, G as Gift, al as Megaphone, P as Package, c as Store, N as CircleX, e as CircleCheckBig, b as Clock, cQ as ClipboardList, bV as FileSpreadsheet, an as FileText, bA as Printer, q as Search, s as Funnel, y as ChevronDown, u as Check, U as User, R as RefreshCw, a0 as MapPin, r as Phone, a as ChevronLeft, C as ChevronRight, W as Eye, _ as CircleAlert, p as LoaderCircle, L as Layers, j as Percent, X, bF as Camera, t as Users, h as Star, bU as DollarSign, cR as UserCog, bY as SquarePen, cI as KeyRound, af as LogOut, bX as Save, c3 as EyeOff } from "../_libs/lucide-react.mjs";
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
function DistributorAccountMenu({
  userData,
  companyName,
  isArabic,
  showEarnings = false,
  earnings = 0,
  ordersCount = 0,
  rating = 0
}) {
  useNavigate();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [showProfileDialog, setShowProfileDialog] = reactExports.useState(false);
  const [profileLoading, setProfileLoading] = reactExports.useState(false);
  const [localUserData, setLocalUserData] = reactExports.useState({
    id: userData.id,
    full_name: userData.full_name || "",
    phone: userData.phone || "",
    avatar_url: userData.avatar_url || null,
    role: userData.role || "distributor"
  });
  const [profileData, setProfileData] = reactExports.useState({
    full_name_ar: userData.full_name || "",
    full_name_en: "",
    phone: userData.phone || "",
    address_ar: "",
    address_en: "",
    governorate_id: ""
  });
  const [governorates, setGovernorates] = reactExports.useState([]);
  const getPublicAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) {
      return path;
    }
    let fileName = path;
    if (path.includes("/")) {
      fileName = path.split("/").pop() || path;
    }
    const baseUrl = "https://jjqgfjpxaxjpyohvcbfi.supabase.co";
    const publicUrl = `${baseUrl}/storage/v1/object/public/uploads/${fileName}`;
    return publicUrl;
  };
  reactExports.useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const { data, error } = await supabase.from("governorates").select("id, name_ar, name_en").order("name_ar");
        if (error) throw error;
        setGovernorates(data || []);
      } catch (error) {
        console.error("Error fetching governorates:", error);
      }
    };
    fetchGovernorates();
  }, []);
  const [oldPassword, setOldPassword] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
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
  reactExports.useEffect(() => {
    const fetchDistributorData = async () => {
      if (!userData.id) return;
      try {
        const { data, error } = await supabase.from("distributors").select("full_name_ar, full_name_en, phone, address_ar, address_en, governorate_id, avatar_url").eq("user_id", userData.id).maybeSingle();
        if (error) throw error;
        if (data) {
          console.log("📝 [DistributorAccountMenu] Fetched data:", data);
          const publicAvatarUrl = getPublicAvatarUrl(data.avatar_url);
          setLocalUserData((prev) => ({
            ...prev,
            full_name: data.full_name_ar || userData.full_name || "",
            phone: data.phone || userData.phone || "",
            avatar_url: publicAvatarUrl
          }));
          setProfileData({
            full_name_ar: data.full_name_ar || userData.full_name || "",
            full_name_en: data.full_name_en || "",
            phone: data.phone || userData.phone || "",
            address_ar: data.address_ar || "",
            address_en: data.address_en || "",
            governorate_id: data.governorate_id || ""
          });
        }
      } catch (error) {
        console.error("Error fetching distributor data:", error);
      }
    };
    fetchDistributorData();
  }, [userData.id]);
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileData.full_name_ar.trim()) {
      toast.error(isArabic ? "❌ الاسم مطلوب" : "❌ Name is required");
      return;
    }
    if (!profileData.phone.trim() || profileData.phone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }
    setProfileLoading(true);
    try {
      const { error: distributorError } = await supabase.from("distributors").update({
        full_name_ar: profileData.full_name_ar,
        full_name_en: profileData.full_name_en || null,
        phone: profileData.phone,
        address_ar: profileData.address_ar || null,
        address_en: profileData.address_en || null,
        governorate_id: profileData.governorate_id || null,
        avatar_url: localUserData.avatar_url
      }).eq("user_id", userData.id);
      if (distributorError) {
        console.error("❌ Distributor update error:", distributorError);
        throw distributorError;
      }
      const { error: profileError } = await supabase.from("profiles").update({
        full_name: profileData.full_name_ar,
        phone: profileData.phone,
        avatar_url: localUserData.avatar_url
      }).eq("id", userData.id);
      if (profileError) {
        console.error("❌ Profile update error:", profileError);
        throw profileError;
      }
      toast.success(
        isArabic ? "✅ تم تحديث الملف الشخصي بنجاح" : "✅ Profile updated successfully"
      );
      setShowProfileDialog(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error(
        isArabic ? `❌ فشل تحديث الملف: ${error.message}` : `❌ Failed to update profile: ${error.message}`
      );
    } finally {
      setProfileLoading(false);
    }
  };
  const handleImageChange = (value) => {
    console.log("📸 [handleImageChange] value received:", value);
    let publicUrl = value;
    let storagePath = value;
    if (value?.startsWith("http")) {
      const match = value.match(/\/uploads\/([^/]+)$/);
      if (match) {
        storagePath = match[1];
        publicUrl = value;
      }
    }
    setLocalUserData((prev) => ({
      ...prev,
      avatar_url: publicUrl
    }));
    const updateAvatarInDB = async () => {
      try {
        console.log("📸 [handleImageChange] updating DB with path:", storagePath);
        const { error: distError } = await supabase.from("distributors").update({ avatar_url: storagePath }).eq("user_id", userData.id);
        if (distError) throw distError;
        const { error: profileError } = await supabase.from("profiles").update({ avatar_url: storagePath }).eq("id", userData.id);
        if (profileError) throw profileError;
        console.log("✅ [handleImageChange] avatar updated successfully!");
        toast.success(isArabic ? "✅ تم تحديث الصورة بنجاح" : "✅ Image updated successfully");
      } catch (error) {
        console.error("❌ [handleImageChange] error:", error);
        toast.error(isArabic ? "❌ فشل تحديث الصورة" : "❌ Failed to update image");
      }
    };
    updateAvatarInDB();
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
      toast.error(
        isArabic ? `❌ فشل تغيير كلمة المرور: ${error.message}` : `❌ Failed to change password: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-10 w-10 border-2 border-[#3a8a82]/30 group-hover:border-[#3a8a82]/60 transition-all duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: localUserData.avatar_url || void 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white text-sm font-bold", children: getInitials(localUserData.full_name) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#3a8a82]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-white truncate max-w-[100px]", children: localUserData.full_name || localUserData.phone || (isArabic ? "موزع" : "Distributor") }),
          companyName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-white/60 truncate max-w-[100px]", children: companyName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-white/50 truncate max-w-[100px]", children: isArabic ? "🚚 موزع" : "🚚 Distributor" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-80 rounded-2xl p-1 border-[#3a8a82]/30 dark:border-[#3a8a82]/20 shadow-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] p-4 text-white border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-14 w-14 border-2 border-white/30 shadow-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: localUserData.avatar_url || void 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-white/20 text-white text-xl font-bold", children: getInitials(localUserData.full_name) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold truncate text-base", children: localUserData.full_name || localUserData.phone || (isArabic ? "موزع" : "Distributor") }),
            companyName && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/80 truncate", children: [
              "🏢 ",
              companyName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/70 truncate", dir: "ltr", children: [
              "📱 ",
              localUserData.phone || (isArabic ? "غير متاح" : "Not available")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-white/20 text-white border-0 text-[9px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-2.5 w-2.5 inline mr-0.5" }),
                isArabic ? "موزع" : "Distributor"
              ] }),
              rating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500/30 text-white border-0 text-[9px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5 inline mr-0.5 fill-yellow-400" }),
                rating.toFixed(1)
              ] })
            ] })
          ] })
        ] }) }),
        showEarnings && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-1.5 p-3 border-b border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2 bg-[#e8f0ee]/30 dark:bg-[#e8f0ee]/20 rounded-lg hover:bg-[#e8f0ee]/50 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-emerald-500 mx-auto mb-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-900 dark:text-white", children: earnings.toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground", children: isArabic ? "الأرباح" : "Earnings" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2 bg-[#e8f0ee]/30 dark:bg-[#e8f0ee]/20 rounded-lg hover:bg-[#e8f0ee]/50 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-blue-500 mx-auto mb-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-900 dark:text-white", children: ordersCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground", children: isArabic ? "الطلبات" : "Orders" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2 bg-[#e8f0ee]/30 dark:bg-[#e8f0ee]/20 rounded-lg hover:bg-[#e8f0ee]/50 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-yellow-500 mx-auto mb-0.5 fill-yellow-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-900 dark:text-white", children: rating.toFixed(1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground", children: isArabic ? "التقييم" : "Rating" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropdownMenuItem,
          {
            onClick: () => {
              setShowProfileDialog(true);
              setIsOpen(false);
            },
            className: "rounded-xl cursor-pointer py-2.5 px-3 hover:bg-[#e8f0ee]/30 dark:hover:bg-[#e8f0ee]/20 group",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-4 w-4 text-purple-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-white", children: isArabic ? "تعديل الملف الشخصي" : "Edit Profile" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isArabic ? "تحديث معلوماتك الشخصية" : "Update your personal information" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3.5 w-3.5 text-muted-foreground" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "my-1.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropdownMenuItem,
          {
            onClick: () => {
              setShowPasswordDialog(true);
              setIsOpen(false);
            },
            className: "rounded-xl cursor-pointer py-2.5 px-3 hover:bg-[#e8f0ee]/30 dark:hover:bg-[#e8f0ee]/20 group",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4 text-amber-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-white", children: isArabic ? "تغيير كلمة المرور" : "Change Password" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isArabic ? "تحديث كلمة مرور حسابك" : "Update your account password" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "my-1.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropdownMenuItem,
          {
            onClick: handleLogout,
            className: "rounded-xl cursor-pointer py-2.5 px-3 hover:bg-red-50/50 dark:hover:bg-red-950/20 group",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 text-red-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-red-600 dark:text-red-400", children: isArabic ? "تسجيل الخروج" : "Logout" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isArabic ? "الخروج من حسابك" : "Sign out of your account" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 bg-[#e8f0ee]/20 dark:bg-[#e8f0ee]/10 border-t border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 text-[#2a655f]" }),
            isArabic ? "حساب نشط" : "Active account"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }),
            isArabic ? "متصل" : "Online"
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showProfileDialog, onOpenChange: setShowProfileDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] p-6 text-white sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold", children: isArabic ? "✏️ تعديل الملف الشخصي" : "✏️ Edit Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-white/80 text-sm mt-0.5", children: isArabic ? "تحديث معلوماتك الشخصية كموزع" : "Update your personal information as a distributor" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdateProfile, className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 p-4 bg-[#e8f0ee]/20 dark:bg-[#e8f0ee]/10 rounded-xl border-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ImageInput,
            {
              value: localUserData.avatar_url || "",
              onChange: handleImageChange,
              userId: userData.id,
              folder: "distributors",
              lang: isArabic ? "ar" : "en",
              label: isArabic ? "صورة الموزع" : "Distributor Photo",
              previewClassName: "h-24 w-24 rounded-full object-cover border-4 border-[#3a8a82]/50",
              hint: isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "📸 اضغط على الصورة لتغييرها" : "📸 Click on the image to change it" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]", children: [
              isArabic ? "الاسم (عربي)" : "Name (Arabic)",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: profileData.full_name_ar,
                onChange: (e) => setProfileData({ ...profileData, full_name_ar: e.target.value }),
                placeholder: isArabic ? "أحمد محمد" : "Ahmed Mohamad",
                required: true,
                className: "rounded-xl border-[#3a8a82]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "الاسم (إنجليزي)" : "Name (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: profileData.full_name_en,
                onChange: (e) => setProfileData({ ...profileData, full_name_en: e.target.value }),
                placeholder: "Ahmed Mohamad",
                className: "rounded-xl border-[#3a8a82]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]", children: [
            isArabic ? "رقم الهاتف" : "Phone Number",
            " *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: profileData.phone,
              onChange: (e) => setProfileData({ ...profileData, phone: e.target.value }),
              type: "tel",
              placeholder: "09XXXXXXXX",
              required: true,
              className: "rounded-xl border-[#3a8a82]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "العنوان (عربي)" : "Address (Arabic)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: profileData.address_ar,
                onChange: (e) => setProfileData({ ...profileData, address_ar: e.target.value }),
                placeholder: isArabic ? "دمشق، سوريا" : "Damascus, Syria",
                className: "rounded-xl border-[#3a8a82]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "العنوان (إنجليزي)" : "Address (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: profileData.address_en,
                onChange: (e) => setProfileData({ ...profileData, address_en: e.target.value }),
                placeholder: "Damascus, Syria",
                className: "rounded-xl border-[#3a8a82]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]", children: isArabic ? "المحافظة" : "Governorate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: profileData.governorate_id,
              onValueChange: (value) => setProfileData({ ...profileData, governorate_id: value }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-[#3a8a82]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر المحافظة" : "Select governorate" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: governorates.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g.id, children: isArabic ? g.name_ar : g.name_en }, g.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-4 border-t border-[#3a8a82]/20 gap-2 sticky bottom-0 bg-white dark:bg-slate-900 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => setShowProfileDialog(false),
              className: "flex-1 rounded-xl border-[#3a8a82]/30 hover:bg-[#e8f0ee]/30",
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
              disabled: profileLoading,
              className: "flex-1 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white hover:from-[#1a4f4a] hover:to-[#2a655f] rounded-xl shadow-lg shadow-[#2a655f]/30",
              children: [
                profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1.5" }),
                profileLoading ? isArabic ? "جاري..." : "Saving..." : isArabic ? "حفظ التغييرات" : "Save Changes"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showPasswordDialog, onOpenChange: setShowPasswordDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl overflow-hidden p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] p-6 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold", children: isArabic ? "🔑 تغيير كلمة المرور" : "🔑 Change Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-white/80 text-sm mt-0.5", children: isArabic ? "أدخل كلمة المرور الجديدة لتحديث حسابك" : "Enter your new password to update your account" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleChangePassword, className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]", children: [
            isArabic ? "كلمة المرور الحالية" : "Current Password",
            " *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "password",
              value: oldPassword,
              onChange: (e) => setOldPassword(e.target.value),
              placeholder: isArabic ? "أدخل كلمة المرور الحالية" : "Enter current password",
              required: true,
              className: "rounded-xl border-[#3a8a82]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]", children: [
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
                className: "rounded-xl border-[#3a8a82]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20 pe-10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-[#2a655f] transition-colors",
                children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "6 أحرف على الأقل" : "At least 6 characters" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]", children: [
            isArabic ? "تأكيد كلمة المرور" : "Confirm Password",
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
                "rounded-xl border-[#3a8a82]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20",
                confirmPassword && newPassword !== confirmPassword && "border-red-500 focus-visible:ring-red-500"
              )
            }
          ),
          confirmPassword && newPassword !== confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
            isArabic ? "كلمة المرور غير متطابقة" : "Passwords do not match"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-4 border-t border-[#3a8a82]/20 gap-2", children: [
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
              className: "flex-1 rounded-xl border-[#3a8a82]/30 hover:bg-[#e8f0ee]/30",
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
              disabled: loading || !oldPassword || !newPassword || newPassword !== confirmPassword,
              className: "flex-1 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white hover:from-[#1a4f4a] hover:to-[#2a655f] rounded-xl shadow-lg shadow-[#2a655f]/30",
              children: [
                loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1.5" }),
                loading ? isArabic ? "جاري..." : "Saving..." : isArabic ? "حفظ التغييرات" : "Save Changes"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
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
const getNotificationConfig = (type) => {
  return NOTIFICATION_CONFIG[type] || NOTIFICATION_CONFIG[NOTIFICATION_TYPES.SYSTEM];
};
function DistributorDashboardPage() {
  const app = useApp();
  useT();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selectedOrder, setSelectedOrder] = reactExports.useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = reactExports.useState(false);
  const [showMapOrderId, setShowMapOrderId] = reactExports.useState(null);
  const [statusNotes, setStatusNotes] = reactExports.useState("");
  const [isUpdating, setIsUpdating] = reactExports.useState(false);
  const [notificationsOpen, setNotificationsOpen] = reactExports.useState(false);
  const [showOrderDetails, setShowOrderDetails] = reactExports.useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = reactExports.useState(null);
  const [historyPage, setHistoryPage] = reactExports.useState(1);
  const [historyLimit, setHistoryLimit] = reactExports.useState(10);
  const [historyFilter, setHistoryFilter] = reactExports.useState("all");
  const [historySearch, setHistorySearch] = reactExports.useState("");
  const [activePage, setActivePage] = reactExports.useState(1);
  const [activeLimit, setActiveLimit] = reactExports.useState(5);
  const [allOrders, setAllOrders] = reactExports.useState([]);
  const [ordersLoading, setOrdersLoading] = reactExports.useState(true);
  const [distributors, setDistributors] = reactExports.useState([]);
  const [showAvatarDialog, setShowAvatarDialog] = reactExports.useState(false);
  const [avatarFile, setAvatarFile] = reactExports.useState(null);
  const [avatarPreview, setAvatarPreview] = reactExports.useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = reactExports.useState(false);
  const isArabic = app.lang === "ar";
  const {
    data: notifications = [],
    refetch: refetchNotifications
  } = useUserNotifications(app.user?.id, {
    limit: 50
  });
  const markRead = useMarkNotificationReadV2();
  const markAllRead = useMarkAllNotificationsReadV2();
  const [unreadNotificationsCount, setUnreadNotificationsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const count = notifications.filter((n) => !n.is_read).length;
    setUnreadNotificationsCount(count);
  }, [notifications]);
  const notificationChannelRef = reactExports.useRef(null);
  const isSubscribedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!app.user) {
      console.log("⏳ [Distributor] No user, skipping notification setup");
      return;
    }
    if (isSubscribedRef.current) {
      console.log("📡 [Distributor] Already subscribed to notifications");
      return;
    }
    console.log("📡 [Distributor] Setting up REAL-TIME notifications for user:", app.user.id);
    const channel = supabase.channel(`distributor-notifications-${app.user.id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "notifications",
      filter: `user_id=eq.${app.user.id}`
    }, (payload) => {
      const notification = payload.new;
      console.log("📬 [Distributor] 🔔 NEW NOTIFICATION RECEIVED:", notification);
      console.log("📬 [Distributor] Title:", notification.title_ar || notification.title_en);
      console.log("📬 [Distributor] Body:", notification.body_ar || notification.body_en);
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
      console.log(`📡 [Distributor] Realtime status: ${status}`);
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
        console.log("🧹 [Distributor] Cleaning up notifications channel");
        supabase.removeChannel(notificationChannelRef.current);
        notificationChannelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [app.user?.id, isArabic, navigate, refetchNotifications]);
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
            tr:nth-child(even) { background-color: #e8f0ee; }
            tr:hover { background-color: #d0e0dc; }
            .footer { margin-top: 30px; color: #666; font-size: 12px; text-align: center; border-top: 1px solid #ddd; padding-top: 15px; }
            .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
            .badge-pending { background: #f59e0b; color: white; }
            .badge-assigned { background: #8b5cf6; color: white; }
            .badge-picked_up { background: #3b82f6; color: white; }
            .badge-in_transit { background: #f97316; color: white; }
            .badge-delivered { background: #22c55e; color: white; }
            .badge-cancelled { background: #ef4444; color: white; }
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
              assigned: isArabic ? "تم التعيين" : "Assigned",
              picked_up: isArabic ? "تم الاستلام" : "Picked up",
              in_transit: isArabic ? "قيد التوصيل" : "In Transit",
              delivered: isArabic ? "تم التوصيل" : "Delivered",
              cancelled: isArabic ? "ملغي" : "Cancelled"
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
            ${isArabic ? "تم التصدير من لوحة تحكم الموزع - ذوق" : "Exported from Distributor Dashboard - Zooq"}
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
  const fetchDistributors = reactExports.useCallback(async () => {
    if (!app.user?.id) return;
    const {
      data,
      error
    } = await supabase.from("distributors").select("*").eq("user_id", app.user.id);
    if (!error) setDistributors(data || []);
  }, [app.user?.id]);
  reactExports.useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);
  reactExports.useEffect(() => {
    const fetchOrders = async () => {
      if (!app.user?.id) return;
      setOrdersLoading(true);
      try {
        const {
          data: distributor,
          error: distError
        } = await supabase.from("distributors").select("id").eq("user_id", app.user.id).maybeSingle();
        if (distError || !distributor) {
          setOrdersLoading(false);
          return;
        }
        const {
          data: orders2,
          error: ordersError
        } = await supabase.from("delivery_orders").select(`
            *,
            orders:order_id (
              *,
              order_items (
                *,
                listings:listing_id (
                  *,
                  profile:profiles!owner_id (*),
                  colors:product_colors (*),
                  variations:product_variations (*),
                  listing_images (*)
                )
              ),
              listings:listing_id (
                *,
                profile:profiles!owner_id (*)
              )
            )
          `).eq("distributor_id", distributor.id).order("created_at", {
          ascending: false
        });
        if (ordersError) {
          setAllOrders([]);
        } else {
          setAllOrders(orders2 || []);
        }
      } catch (error) {
        setAllOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [app.user?.id]);
  const refetchOrders = reactExports.useCallback(async () => {
    if (!app.user?.id) return;
    try {
      const {
        data: distributor
      } = await supabase.from("distributors").select("id").eq("user_id", app.user.id).maybeSingle();
      if (distributor) {
        const {
          data: orders2
        } = await supabase.from("delivery_orders").select(`
            *,
            orders:order_id (
              *,
              order_items (
                *,
                listings:listing_id (
                  *,
                  profile:profiles!owner_id (*),
                  colors:product_colors (*),
                  variations:product_variations (*),
                  listing_images (*)
                )
              ),
              listings:listing_id (
                *,
                profile:profiles!owner_id (*)
              )
            )
          `).eq("distributor_id", distributor.id).order("created_at", {
          ascending: false
        });
        setAllOrders(orders2 || []);
      }
    } catch (error) {
      console.error("Refetch error:", error);
    }
  }, [app.user?.id]);
  const refetchDistributors = reactExports.useCallback(async () => {
    if (!app.user?.id) return;
    const {
      data,
      error
    } = await supabase.from("distributors").select("*").eq("user_id", app.user.id);
    if (!error) {
      setDistributors(data || []);
    }
  }, [app.user?.id]);
  const {
    data: unreadCount = 0
  } = useUnreadCount();
  const currentDistributor = reactExports.useMemo(() => {
    return distributors.find((d) => d.user_id === app.user?.id);
  }, [distributors, app.user]);
  reactExports.useEffect(() => {
    if (currentDistributor && !currentDistributor.avatar_url) {
      const timer = setTimeout(() => {
        setShowAvatarDialog(true);
      }, 1e3);
      return () => clearTimeout(timer);
    }
  }, [currentDistributor]);
  const handleUploadAvatar = async () => {
    if (!avatarFile || !currentDistributor) {
      toast.error(isArabic ? "الرجاء اختيار صورة أولاً" : "Please select an image first");
      return;
    }
    setIsUploadingAvatar(true);
    try {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `distributors/${currentDistributor.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;
      const {
        error: uploadError
      } = await supabase.storage.from("uploads").upload(filePath, avatarFile, {
        cacheControl: "3600",
        upsert: true
      });
      if (uploadError) {
        console.error("❌ [Upload] Upload error:", uploadError);
        throw uploadError;
      }
      const {
        data: urlData
      } = supabase.storage.from("uploads").getPublicUrl(filePath);
      const avatarUrl = urlData.publicUrl;
      const {
        error: updateError
      } = await supabase.from("distributors").update({
        avatar_url: avatarUrl
      }).eq("id", currentDistributor.id);
      if (updateError) {
        console.error("❌ [Upload] Update distributor error:", updateError);
        throw updateError;
      }
      const {
        error: profileError
      } = await supabase.from("profiles").update({
        avatar_url: avatarUrl
      }).eq("id", app.user?.id);
      if (profileError) {
        console.warn("⚠️ [Upload] Could not update profile avatar:", profileError);
      }
      setDistributors((prev) => prev.map((d) => d.id === currentDistributor.id ? {
        ...d,
        avatar_url: avatarUrl
      } : d));
      if (app.user) {
        app.user.avatar_url = avatarUrl;
      }
      setShowAvatarDialog(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setIsUploadingAvatar(false);
      await refetchDistributors();
      toast.success(isArabic ? "✅ تم رفع الصورة بنجاح! ✅" : "✅ Avatar uploaded successfully! ✅");
    } catch (error) {
      console.error("❌ [Upload] Error uploading avatar:", error);
      let errorMessage = error.message;
      if (error.message?.includes("permission")) {
        errorMessage = isArabic ? "ليس لديك صلاحية لرفع الصورة. يرجى التواصل مع المدير." : "You don't have permission to upload. Please contact admin.";
      } else if (error.message?.includes("duplicate")) {
        errorMessage = isArabic ? "هذه الصورة موجودة بالفعل. جارٍ استبدالها..." : "This image already exists. Replacing...";
      }
      toast.error(isArabic ? `❌ فشل رفع الصورة: ${errorMessage}` : `❌ Upload failed: ${errorMessage}`);
      setIsUploadingAvatar(false);
    }
  };
  const [companyAdmin, setCompanyAdmin] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const fetchCompanyAdmin = async () => {
      if (!currentDistributor?.delivery_company_id) {
        setCompanyAdmin(null);
        return;
      }
      try {
        const companyId = currentDistributor.delivery_company_id;
        const {
          data: companyAdmins,
          error: adminsError
        } = await supabase.from("delivery_company_admins").select(`
            user_id,
            company_id,
            created_at,
            profiles:user_id (
              id,
              full_name,
              phone,
              avatar_url
            )
          `).eq("company_id", companyId).limit(1);
        if (adminsError) {
          console.error("❌ خطأ في جلب أدمن الشركة:", adminsError);
          throw adminsError;
        }
        if (companyAdmins && companyAdmins.length > 0) {
          const admin = companyAdmins[0];
          setCompanyAdmin({
            id: admin.profiles?.id || admin.user_id,
            full_name: admin.profiles?.full_name || "غير معروف",
            phone: admin.profiles?.phone || "",
            avatar_url: admin.profiles?.avatar_url || ""
          });
        } else {
          setCompanyAdmin(null);
        }
      } catch (error) {
        console.error("❌ خطأ في جلب أدمن الشركة:", error);
        setCompanyAdmin(null);
      }
    };
    fetchCompanyAdmin();
  }, [currentDistributor?.delivery_company_id]);
  const orders = reactExports.useMemo(() => {
    if (!currentDistributor?.id) return [];
    return allOrders.filter((order) => order.distributor_id === currentDistributor.id);
  }, [allOrders, currentDistributor]);
  const stats = reactExports.useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const assigned = orders.filter((o) => o.status === "assigned").length;
    const inTransit = orders.filter((o) => o.status === "in_transit").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const avgDeliveryTime = orders.filter((o) => o.delivered_at && o.created_at).reduce((sum, o) => {
      const diff = new Date(o.delivered_at).getTime() - new Date(o.created_at).getTime();
      return sum + diff / (1e3 * 60);
    }, 0) / (orders.filter((o) => o.delivered_at && o.created_at).length || 1);
    const completionRate = total > 0 ? Math.round(delivered / total * 100) : 0;
    return {
      total,
      pending,
      assigned,
      inTransit,
      delivered,
      cancelled,
      avgDeliveryTime: Math.round(avgDeliveryTime),
      completionRate,
      activeOrders: pending + assigned + inTransit
    };
  }, [orders]);
  const activeOrders = reactExports.useMemo(() => {
    return orders.filter((o) => o.status === "pending" || o.status === "assigned" || o.status === "in_transit" || o.status === "picked_up");
  }, [orders]);
  const historyOrders = reactExports.useMemo(() => {
    let result = orders.filter((o) => o.status === "delivered" || o.status === "cancelled");
    if (historyFilter !== "all") {
      result = result.filter((o) => o.status === historyFilter);
    }
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase().trim();
      const cleanedQ = q.replace(/^#/, "");
      result = result.filter((o) => {
        const tracking = (o.tracking_number || "").toLowerCase();
        const id = (o.id || "").toLowerCase();
        const deliveryName = (o.delivery_name || "").toLowerCase();
        const pickupName = (o.pickup_name || "").toLowerCase();
        const deliveryAddress = (o.delivery_address || "").toLowerCase();
        const buyerName = (o.orders?.buyer_name || "").toLowerCase();
        const buyerPhone = (o.orders?.buyer_phone || "").toLowerCase();
        const notes = (o.orders?.notes || "").toLowerCase();
        return tracking.includes(cleanedQ) || tracking.includes(q) || id.includes(cleanedQ) || id.includes(q) || deliveryName.includes(q) || pickupName.includes(q) || deliveryAddress.includes(q) || buyerName.includes(q) || buyerPhone.includes(q) || notes.includes(q);
      });
    }
    return result;
  }, [orders, historyFilter, historySearch]);
  const totalHistoryPages = Math.ceil(historyOrders.length / historyLimit);
  const paginatedHistoryOrders = reactExports.useMemo(() => {
    const start = (historyPage - 1) * historyLimit;
    return historyOrders.slice(start, start + historyLimit);
  }, [historyOrders, historyPage, historyLimit]);
  const filteredOrders = reactExports.useMemo(() => {
    let result = activeOrders;
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
        const buyerName = (o.orders?.buyer_name || "").toLowerCase();
        const buyerPhone = (o.orders?.buyer_phone || "").toLowerCase();
        const notes = (o.orders?.notes || "").toLowerCase();
        return tracking.includes(cleanedQ) || tracking.includes(q) || id.includes(cleanedQ) || id.includes(q) || deliveryName.includes(q) || pickupName.includes(q) || deliveryAddress.includes(q) || buyerName.includes(q) || buyerPhone.includes(q) || notes.includes(q);
      });
    }
    return result;
  }, [activeOrders, statusFilter, searchQuery]);
  const totalActivePages = Math.ceil(filteredOrders.length / activeLimit);
  const paginatedActiveOrders = reactExports.useMemo(() => {
    const start = (activePage - 1) * activeLimit;
    return filteredOrders.slice(start, start + activeLimit);
  }, [filteredOrders, activePage, activeLimit]);
  const getAvailableStatuses = (currentStatus) => {
    const statusFlow = {
      pending: ["assigned"],
      assigned: ["picked_up"],
      picked_up: ["in_transit", "delivered"],
      in_transit: ["delivered"]
    };
    return statusFlow[currentStatus] || [];
  };
  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!currentDistributor?.id) {
      toast.error(isArabic ? "لا يوجد موزع" : "No distributor found");
      return;
    }
    setIsUpdating(true);
    try {
      const {
        data: deliveryOrder,
        error: orderError
      } = await supabase.from("delivery_orders").select(`
          *,
          orders:order_id (
            *,
            order_items (
              *,
              listings:listing_id (
                *,
                profile:profiles!owner_id (*)
              )
            ),
            listings:listing_id (
              *,
              profile:profiles!owner_id (*)
            )
          )
        `).eq("id", orderId).single();
      if (orderError) throw orderError;
      const mainOrder = deliveryOrder?.orders;
      const updateData = {
        status: newStatus,
        notes_ar: statusNotes || null,
        notes_en: statusNotes || null
      };
      if (newStatus === "picked_up") updateData.picked_up_at = (/* @__PURE__ */ new Date()).toISOString();
      else if (newStatus === "delivered") updateData.delivered_at = (/* @__PURE__ */ new Date()).toISOString();
      else if (newStatus === "cancelled") updateData.cancelled_at = (/* @__PURE__ */ new Date()).toISOString();
      const {
        error: updateDeliveryError
      } = await supabase.from("delivery_orders").update(updateData).eq("id", orderId);
      if (updateDeliveryError) throw updateDeliveryError;
      if (mainOrder) {
        let orderStatus = "pending";
        if (newStatus === "delivered") orderStatus = "delivered";
        else if (newStatus === "cancelled") orderStatus = "cancelled";
        else if (newStatus === "assigned") orderStatus = "assigned";
        else if (newStatus === "picked_up" || newStatus === "in_transit") orderStatus = "shipped";
        const deliveryStatus = newStatus === "delivered" ? "delivered" : newStatus;
        const {
          error: updateOrderError
        } = await supabase.from("orders").update({
          status: orderStatus,
          delivery_status: deliveryStatus,
          delivered_at: newStatus === "delivered" ? (/* @__PURE__ */ new Date()).toISOString() : null
        }).eq("id", mainOrder.id);
        if (updateOrderError) throw updateOrderError;
      }
      const statusLabels = {
        picked_up: isArabic ? "تم استلام الطلب" : "Order picked up",
        in_transit: isArabic ? "الطلب في الطريق" : "Order in transit",
        delivered: isArabic ? "تم توصيل الطلب" : "Order delivered",
        cancelled: isArabic ? "تم إلغاء الطلب" : "Order cancelled",
        assigned: isArabic ? "تم تعيين موزع" : "Order assigned"
      };
      const statusEmojis = {
        picked_up: "📦",
        in_transit: "🚚",
        delivered: "✅",
        cancelled: "❌",
        assigned: "📌"
      };
      if (mainOrder?.buyer_id) {
        await supabase.from("notifications").insert({
          user_id: mainOrder.buyer_id,
          type: "delivery_status_update",
          title_ar: `${statusEmojis[newStatus] || "📬"} ${statusLabels[newStatus] || newStatus}`,
          body_ar: `طلبك "${mainOrder.order_items?.[0]?.listings?.title_ar || mainOrder.listings?.title_ar || "طلب رقم " + mainOrder.id.substring(0, 8)}" - ${statusLabels[newStatus] || newStatus}${statusNotes ? `
📝 ملاحظات: ${statusNotes}` : ""}`,
          title_en: `${statusEmojis[newStatus] || "📬"} ${statusLabels[newStatus] || newStatus}`,
          body_en: `Your order "${mainOrder.order_items?.[0]?.listings?.title_en || mainOrder.listings?.title_en || "Order " + mainOrder.id.substring(0, 8)}" - ${statusLabels[newStatus] || newStatus}${statusNotes ? `
📝 Notes: ${statusNotes}` : ""}`,
          link_url: `/orders`,
          metadata: {
            order_id: mainOrder.id,
            delivery_order_id: orderId,
            status: newStatus,
            notes: statusNotes,
            distributor_id: currentDistributor?.id,
            distributor_name: currentDistributor?.full_name_ar
          }
        });
      }
      if (newStatus === "delivered" && mainOrder?.buyer_id) {
        const firstListing = mainOrder.order_items?.[0]?.listings || mainOrder.listings;
        const storeName = firstListing?.profile?.store_name || firstListing?.profile?.full_name || "المتجر";
        const storeLogo = firstListing?.profile?.store_logo_url || null;
        const storeNameEn = firstListing?.profile?.store_name || firstListing?.profile?.full_name || "the store";
        await supabase.from("notifications").insert({
          user_id: mainOrder.buyer_id,
          type: "order_review_request",
          title_ar: "⭐ كيف كانت تجربتك؟",
          body_ar: `طلبك من "${storeName}" وصل! 🎉

قيّم تجربتك من 1 إلى 5 نجوم وساعدنا نتحسن 💚`,
          title_en: "⭐ How was your experience?",
          body_en: `Your order from "${storeNameEn}" has arrived! 🎉

Rate your experience from 1 to 5 stars and help us improve 💚`,
          link_url: `/orders?review=${mainOrder.id}`,
          image_url: storeLogo,
          metadata: {
            order_id: mainOrder.id,
            delivery_order_id: orderId,
            type: "order_review_request",
            action_label_ar: "⭐ قيّم الآن",
            action_label_en: "⭐ Rate now",
            action_url: `/orders?review=${mainOrder.id}`
          }
        });
      }
      if (mainOrder?.seller_id) {
        await supabase.from("notifications").insert({
          user_id: mainOrder.seller_id,
          type: "delivery_status_update",
          title_ar: `${statusEmojis[newStatus] || "📬"} ${statusLabels[newStatus] || newStatus}`,
          body_ar: `طلب "${mainOrder.order_items?.[0]?.listings?.title_ar || mainOrder.listings?.title_ar}" - ${statusLabels[newStatus] || newStatus} بواسطة ${currentDistributor?.full_name_ar || "الموزع"}${statusNotes ? `
📝 ملاحظات: ${statusNotes}` : ""}`,
          title_en: `${statusEmojis[newStatus] || "📬"} ${statusLabels[newStatus] || newStatus}`,
          body_en: `Order "${mainOrder.order_items?.[0]?.listings?.title_en || mainOrder.listings?.title_en}" - ${statusLabels[newStatus] || newStatus} by ${currentDistributor?.full_name_en || "distributor"}${statusNotes ? `
📝 Notes: ${statusNotes}` : ""}`,
          link_url: `/dashboard`,
          metadata: {
            order_id: mainOrder.id,
            delivery_order_id: orderId,
            status: newStatus,
            notes: statusNotes,
            distributor_id: currentDistributor?.id,
            distributor_name: currentDistributor?.full_name_ar
          }
        });
      }
      if (deliveryOrder?.delivery_company_id) {
        const {
          data: companyAdmins
        } = await supabase.from("delivery_company_admins").select("user_id").eq("company_id", deliveryOrder.delivery_company_id);
        if (companyAdmins && companyAdmins.length > 0) {
          const adminIds = companyAdmins.map((a) => a.user_id);
          await supabase.from("notifications").insert(adminIds.map((userId) => ({
            user_id: userId,
            type: "delivery_status_update",
            title_ar: `${statusEmojis[newStatus] || "📬"} ${statusLabels[newStatus] || newStatus}`,
            body_ar: `طلب #${deliveryOrder.tracking_number || orderId.substring(0, 8)} - ${statusLabels[newStatus] || newStatus}${statusNotes ? `
📝 ملاحظات: ${statusNotes}` : ""}`,
            title_en: `${statusEmojis[newStatus] || "📬"} ${statusLabels[newStatus] || newStatus}`,
            body_en: `Order #${deliveryOrder.tracking_number || orderId.substring(0, 8)} - ${statusLabels[newStatus] || newStatus}${statusNotes ? `
📝 Notes: ${statusNotes}` : ""}`,
            link_url: `/delivery/dashboard`,
            metadata: {
              order_id: mainOrder?.id,
              delivery_order_id: orderId,
              status: newStatus,
              notes: statusNotes,
              distributor_id: currentDistributor?.id,
              distributor_name: currentDistributor?.full_name_ar
            }
          })));
        }
      }
      toast.success(isArabic ? `تم تحديث حالة الطلب إلى ${getStatusLabel(newStatus)}` : `Order status updated to ${getStatusLabel(newStatus)}`);
      await refetchOrders();
      await refetchDistributors();
      setIsStatusDialogOpen(false);
      setStatusNotes("");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(isArabic ? "حدث خطأ في تحديث الحالة" : "Error updating status");
    } finally {
      setIsUpdating(false);
    }
  };
  const getStatusLabel = (status) => {
    const labels = {
      assigned: isArabic ? "تم التعيين" : "Assigned",
      picked_up: isArabic ? "تم الاستلام" : "Picked up",
      in_transit: isArabic ? "قيد التوصيل" : "In Transit",
      delivered: isArabic ? "تم التوصيل" : "Delivered",
      cancelled: isArabic ? "ملغي" : "Cancelled"
    };
    return labels[status] || status;
  };
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-[#e8f0ee]/60 text-[#1a4f4a] border-[#3a8a82]/30",
      assigned: "bg-[#e8f0ee]/60 text-[#1a4f4a] border-[#3a8a82]/30",
      picked_up: "bg-[#e8f0ee]/60 text-[#1a4f4a] border-[#3a8a82]/30",
      in_transit: "bg-[#e8f0ee]/60 text-[#1a4f4a] border-[#3a8a82]/30",
      delivered: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20"
    };
    return colors[status] || "bg-slate-500/10 text-slate-500";
  };
  const getProductImage = (item) => {
    const listing = item.listings || item;
    if (item.metadata?.variation_image) {
      return item.metadata.variation_image;
    }
    if (item.metadata?.product_cover) {
      return item.metadata.product_cover;
    }
    if (item.selected_options?.variation_image) {
      return item.selected_options.variation_image;
    }
    if (item.variation_snapshot?.image_url) {
      return item.variation_snapshot.image_url;
    }
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
    return listing?.cover_url || null;
  };
  const getVariationCombination = (item) => {
    if (item.variation_snapshot?.combination) {
      return item.variation_snapshot.combination;
    }
    if (item.metadata?.variation_combination) {
      return item.metadata.variation_combination;
    }
    if (item.variation_combination) {
      return item.variation_combination;
    }
    if (item.selected_options?.variation_combination) {
      return item.selected_options.variation_combination;
    }
    return null;
  };
  const getVariationDisplay = (combination) => {
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
  const {
    data: orderDetails,
    isLoading: loadingDetails
  } = useDeliveryOrderDetails(selectedOrderForDetails?.id);
  const orderItems = orderDetails?.order_items || [];
  const orderData = orderDetails?.order || selectedOrderForDetails?.orders || null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#e8f0ee]/40 via-white to-[#f8fafc] dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#1a4f4a]/10", children: [
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-[#3a8a82]/20 blur-2xl group-hover:bg-[#3a8a82]/40 transition-all duration-700 animate-pulse-slow" }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/Logo.png", alt: "ذوق", className: "h-14 w-14 md:h-16 md:w-16 object-contain drop-shadow-2xl relative z-10 animate-pulse-glow", loading: "eager" }),
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/distributor/messages", className: "h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative flex items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 md:h-5 md:w-5" }),
            unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse border-2 border-[#1a4f4a]", children: unreadCount > 9 ? "9+" : unreadCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300", onClick: () => {
              const newLang = isArabic ? "en" : "ar";
              app.setLang(newLang);
              toast.success(isArabic ? "تم التبديل إلى الإنجليزية" : "Switched to Arabic");
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "h-4 w-4 md:h-5 md:w-5" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "bottom", className: "bg-[#0d2e2a] text-white border-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isArabic ? "تبديل اللغة" : "Switch Language" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-white/10 mx-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DistributorAccountMenu, { userData: {
              id: app.user?.id || "",
              full_name: currentDistributor?.full_name_ar || app.user?.name || (isArabic ? "موزع" : "Distributor"),
              phone: currentDistributor?.phone || app.user?.phone || "",
              avatar_url: currentDistributor?.avatar_url || app.user?.avatar_url || "",
              role: "distributor"
            }, companyName: currentDistributor?.delivery_companies?.name_ar, isArabic, showEarnings: false, earnings: 0, ordersCount: stats.delivered, rating: currentDistributor?.rating || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] md:text-[10px] text-white/70 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-1.5 w-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" })
                ] }),
                isArabic ? "موزع • متاح" : "Distributor • Available"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] md:text-[10px] text-white/30", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] md:text-[10px] text-white/50 flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2 w-2 md:h-2.5 md:w-2.5 animate-spin-slow text-[#3a8a82]" }),
                isArabic ? "توصيل سريع" : "Fast Delivery"
              ] })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: notificationsOpen, onOpenChange: setNotificationsOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-[#3a8a82]/30 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#1a4f4a] dark:text-[#3a8a82]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-[#1a4f4a]" }),
          isArabic ? "الإشعارات" : "Notifications",
          unreadNotificationsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#1a4f4a] text-white border-0 text-[10px]", children: unreadNotificationsCount })
        ] }),
        unreadNotificationsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: handleMarkAllAsRead, className: "text-xs text-[#1a4f4a] hover:bg-[#e8f0ee] rounded-xl", children: isArabic ? "تحديد الكل كمقروء" : "Mark all as read" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] overflow-y-auto space-y-2", children: notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-12 w-12 mx-auto mb-2 text-muted-foreground/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isArabic ? "لا توجد إشعارات" : "No notifications" })
      ] }) : notifications.map((notification) => {
        const config = getNotificationConfig(notification.type);
        const Icon = config?.icon ? ICON_MAP[config.icon] || Bell : Bell;
        const isRead = notification.is_read;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => handleNotificationClick(notification), className: cn("p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md", isRead ? "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-700/50" : "bg-[#e8f0ee]/50 border-[#3a8a82]/40 hover:bg-[#e8f0ee]/70"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", isRead ? "bg-slate-100 dark:bg-slate-800" : "bg-[#3a8a82]/30"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-[#1a4f4a]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("text-sm font-semibold", isRead ? "text-slate-700 dark:text-slate-300" : "text-[#1a4f4a]"), children: isArabic ? notification.title_ar : notification.title_en || notification.title_ar }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: isArabic ? notification.body_ar : notification.body_en || notification.body_ar }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-1", children: formatTime(notification.created_at) })
          ] }),
          !isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-[#1a4f4a] animate-pulse flex-shrink-0 mt-1" })
        ] }) }, notification.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setNotificationsOpen(false), className: "rounded-xl border-[#3a8a82]/30 text-[#1a4f4a] hover:bg-[#e8f0ee]/50", children: isArabic ? "إغلاق" : "Close" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: ClipboardList, label: isArabic ? "الطلبات" : "Orders", value: stats.total, color: "olive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Clock, label: isArabic ? "نشطة" : "Active", value: stats.activeOrders, color: "olive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleCheckBig, label: isArabic ? "تم التوصيل" : "Delivered", value: stats.delivered, color: "olive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Award, label: isArabic ? "متوسط الوقت" : "Avg Time", value: `${stats.avgDeliveryTime} ${isArabic ? "د" : "min"}`, color: "olive" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-[#3a8a82]/30 mb-6 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 border-[#1a4f4a] text-[#1a4f4a] dark:text-[#3a8a82] hover:scale-105", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 animate-bounce-slow text-[#1a4f4a]" }),
          isArabic ? "الطلبات النشطة" : "Active Orders",
          stats.activeOrders > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#1a4f4a] text-white border-0 text-[10px] px-1.5 py-0.5 animate-pulse", children: stats.activeOrders })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: activeLimit, onChange: (e) => {
            setActiveLimit(Number(e.target.value));
            setActivePage(1);
          }, className: "h-9 px-3 rounded-xl border border-[#3a8a82]/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#3a8a82]/50 transition-all duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "5", children: "5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "10", children: "10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "20", children: "20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "50", children: "50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => exportToCSV(filteredOrders, "الطلبات_النشطة"), className: "h-9 rounded-xl border-[#3a8a82]/30 hover:bg-[#e8f0ee]/50 transition-all duration-300 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 text-[#1a4f4a] group-hover:scale-110 transition-transform" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#1a4f4a]", children: isArabic ? "Excel" : "Excel" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "تصدير إلى Excel" : "Export to Excel" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => exportToWord(filteredOrders, "تقرير_الطلبات_النشطة"), className: "h-9 rounded-xl border-[#3a8a82]/30 hover:bg-[#e8f0ee]/50 transition-all duration-300 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-[#1a4f4a] group-hover:scale-110 transition-transform" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#1a4f4a]", children: isArabic ? "Word" : "Word" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "تصدير إلى Word" : "Export to Word" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handlePrint, className: "h-9 rounded-xl border-[#3a8a82]/30 hover:bg-[#e8f0ee]/50 transition-all duration-300 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 text-[#1a4f4a] group-hover:scale-110 transition-transform" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#1a4f4a]", children: isArabic ? "طباعة" : "Print" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "طباعة التقرير" : "Print Report" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in slide-in-from-top-5 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px] max-w-sm group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#1a4f4a] transition-all duration-300 group-focus-within:scale-110" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: isArabic ? "🔍 بحث عن طلب (رقم، اسم، هاتف، عنوان)..." : "🔍 Search orders (ID, name, phone, address)...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "ps-9 h-10 rounded-xl border-[#3a8a82]/30 focus:border-[#1a4f4a] focus:ring-[#3a8a82]/40 transition-all duration-300 focus:scale-[1.02]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-[#1a4f4a] animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-10 px-4 rounded-xl border-2 border-[#3a8a82]/40 hover:border-[#1a4f4a]/50 hover:bg-[#e8f0ee]/50 transition-all duration-300 flex items-center gap-2 min-w-[160px] justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: statusFilter === "all" ? isArabic ? "📋 جميع الحالات" : "📋 All status" : statusFilter === "pending" ? isArabic ? "⏳ قيد المراجعة" : "⏳ Pending" : statusFilter === "assigned" ? isArabic ? "📌 تم التعيين" : "📌 Assigned" : statusFilter === "picked_up" ? isArabic ? "📦 تم الاستلام" : "📦 Picked up" : statusFilter === "in_transit" ? isArabic ? "🚚 قيد التوصيل" : "🚚 In transit" : statusFilter === "delivered" ? isArabic ? "✅ تم التوصيل" : "✅ Delivered" : isArabic ? "جميع الحالات" : "All status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-[#1a4f4a]" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "start", className: "w-[220px] rounded-xl border-2 border-[#3a8a82]/30 shadow-xl p-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("all"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "all" ? "bg-[#e8f0ee]/70 text-[#1a4f4a] font-semibold" : "hover:bg-[#e8f0ee]/50 hover:text-[#1a4f4a]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "📋" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "جميع الحالات" : "All status" }),
                  statusFilter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#1a4f4a]" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("pending"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "pending" ? "bg-[#e8f0ee]/70 text-[#1a4f4a] font-semibold" : "hover:bg-[#e8f0ee]/50 hover:text-[#1a4f4a]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "⏳" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "قيد المراجعة" : "Pending" }),
                  statusFilter === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#1a4f4a]" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("assigned"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "assigned" ? "bg-[#e8f0ee]/70 text-[#1a4f4a] font-semibold" : "hover:bg-[#e8f0ee]/50 hover:text-[#1a4f4a]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "📌" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "تم التعيين" : "Assigned" }),
                  statusFilter === "assigned" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#1a4f4a]" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("picked_up"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "picked_up" ? "bg-[#e8f0ee]/70 text-[#1a4f4a] font-semibold" : "hover:bg-[#e8f0ee]/50 hover:text-[#1a4f4a]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "📦" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "تم الاستلام" : "Picked up" }),
                  statusFilter === "picked_up" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#1a4f4a]" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("in_transit"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "in_transit" ? "bg-[#e8f0ee]/70 text-[#1a4f4a] font-semibold" : "hover:bg-[#e8f0ee]/50 hover:text-[#1a4f4a]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "🚚" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "قيد التوصيل" : "In transit" }),
                  statusFilter === "in_transit" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#1a4f4a]" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setStatusFilter("delivered"), className: cn("rounded-lg py-2.5 px-3 cursor-pointer transition-all duration-200", statusFilter === "delivered" ? "bg-[#e8f0ee]/70 text-[#1a4f4a] font-semibold" : "hover:bg-[#e8f0ee]/50 hover:text-[#1a4f4a]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "✅" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? "تم التوصيل" : "Delivered" }),
                  statusFilter === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#1a4f4a]" })
                ] }) })
              ] })
            ] })
          ] })
        ] }),
        ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl animate-pulse" }, i)) }) : filteredOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#3a8a82]/40 hover:border-[#3a8a82]/60 transition-all duration-300 hover:scale-[1.01]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#e8f0ee]/50 flex items-center justify-center mx-auto mb-4 animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-10 w-10 text-[#1a4f4a]/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-slate-900 dark:text-white", children: isArabic ? "لا توجد طلبات نشطة" : "No active orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: isArabic ? "جميع الطلبات مكتملة أو ملغية" : "All orders are completed or cancelled" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-100 dark:border-slate-800 hover:bg-transparent bg-gradient-to-r from-[#e8f0ee]/60 via-[#f8fafc]/40 to-[#e8f0ee]/60 dark:from-[#3a8a82]/20 dark:via-[#f8fafc]/10 dark:to-[#3a8a82]/20 border-b-3 border-[#3a8a82]/50 dark:border-[#3a8a82]/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-right min-w-[120px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "رقم الطلب" : "Order #" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[120px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "العميل" : "Customer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[100px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "الحالة" : "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[100px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "التوصيل" : "Delivery" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[120px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "الإجمالي" : "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[100px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "التاريخ" : "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[200px]", children: isArabic ? "الإجراءات" : "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: paginatedActiveOrders.map((order) => {
                const address = order.delivery_address || order.pickup_address;
                const customerName = order.orders?.buyer_name || order.buyer_name || (isArabic ? "عميل" : "Customer");
                const buyerPhone = order.orders?.buyer_phone || order.buyer_phone || null;
                const total = order.orders?.total_with_delivery || order.orders?.total || order.cod_amount || 0;
                const deliveryFee = order.delivery_fee || 0;
                const canUpdate = ["pending", "assigned", "picked_up", "in_transit"].includes(order.status);
                const statusColors = {
                  pending: "bg-[#e8f0ee]/60 text-[#1a4f4a] border-[#3a8a82]/30",
                  assigned: "bg-[#e8f0ee]/60 text-[#1a4f4a] border-[#3a8a82]/30",
                  picked_up: "bg-[#e8f0ee]/60 text-[#1a4f4a] border-[#3a8a82]/30",
                  in_transit: "bg-[#e8f0ee]/60 text-[#1a4f4a] border-[#3a8a82]/30",
                  delivered: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
                  cancelled: "bg-red-500/10 text-red-500 border-red-500/20"
                };
                const statusLabels = {
                  pending: isArabic ? "قيد المراجعة" : "Pending",
                  assigned: isArabic ? "تم التعيين" : "Assigned",
                  picked_up: isArabic ? "تم الاستلام" : "Picked up",
                  in_transit: isArabic ? "قيد التوصيل" : "In Transit",
                  delivered: isArabic ? "تم التوصيل" : "Delivered",
                  cancelled: isArabic ? "ملغي" : "Cancelled"
                };
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-100 dark:border-slate-800 hover:bg-[#3a8a82]/15 dark:hover:bg-[#3a8a82]/10 transition-colors duration-300 group border-b-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-semibold text-slate-900 dark:text-white text-right border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "group-hover:text-[#2a655f] transition-colors", children: [
                      "#",
                      order.tracking_number || order.id.substring(0, 8)
                    ] }),
                    order.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-yellow-500/20 text-yellow-600 border-0 text-[9px] animate-pulse", children: isArabic ? "جديد" : "New" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-slate-600 dark:text-slate-300 text-center border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 text-[#1a4f4a]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: customerName })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("border transition-all duration-300 hover:scale-105", statusColors[order.status] || "bg-slate-500/10 text-slate-500"), children: statusLabels[order.status] || order.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-[#2a655f] dark:text-[#3a8a82] text-center group-hover:scale-110 transition-transform duration-300 border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: deliveryFee === 0 ? isArabic ? "🆓 مجاني" : "🆓 Free" : formatPrice(Number(deliveryFee), app.currency, app.lang) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-[#2a655f] dark:text-[#3a8a82] text-center group-hover:scale-110 transition-transform duration-300 border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: formatPrice(Number(total), app.currency, app.lang) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-slate-500 text-center border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: new Date(order.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 flex-wrap", children: [
                    canUpdate && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "h-8 px-3 rounded-xl bg-gradient-to-r from-[#1a4f4a] to-[#3a8a82] hover:from-[#0d2e2a] hover:to-[#2a655f] text-white transition-all duration-300 hover:scale-105 text-xs shadow-lg shadow-[#1a4f4a]/30", onClick: () => {
                      setSelectedOrder(order);
                      setStatusNotes("");
                      setIsStatusDialogOpen(true);
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 mr-1 group-hover:rotate-180 transition-all duration-500" }),
                      isArabic ? "تحديث" : "Update"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-8 px-3 rounded-xl transition-all duration-300 hover:scale-105 text-xs border-[#3a8a82]/40 hover:bg-[#e8f0ee]/50 hover:border-[#1a4f4a]/50", onClick: () => {
                      setSelectedOrderForDetails(order);
                      setShowOrderDetails(true);
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5 mr-1" }),
                      isArabic ? "تفاصيل" : "Details"
                    ] }),
                    address && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-8 px-3 rounded-xl transition-all duration-300 hover:scale-105 text-xs hover:bg-[#e8f0ee]/50 border-[#3a8a82]/30", onClick: () => {
                      setShowMapOrderId(showMapOrderId === order.id ? null : order.id);
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 mr-1 text-[#1a4f4a]" }),
                      isArabic ? "خريطة" : "Map"
                    ] }),
                    buyerPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "h-8 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/40 transition-all duration-300 hover:scale-105 border-0 flex items-center gap-1 text-xs", onClick: (e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${buyerPhone}`;
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: isArabic ? "اتصل" : "Call" })
                    ] })
                  ] }) })
                ] }, order.id);
              }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t-3 border-[#3a8a82]/20 dark:border-[#3a8a82]/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-[#e8f0ee]/30 via-[#f8fafc]/20 to-[#e8f0ee]/30 dark:from-[#3a8a82]/10 dark:via-[#f8fafc]/5 dark:to-[#3a8a82]/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? `عرض ${paginatedActiveOrders.length} من ${filteredOrders.length} طلب` : `Showing ${paginatedActiveOrders.length} of ${filteredOrders.length} orders` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20", children: isArabic ? "📋 طلبات نشطة" : "📋 Active Orders" }),
                statusFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-[#e8f0ee]/30 text-[#2a655f] border-2 border-[#3a8a82]/20", children: [
                  "🔍 ",
                  statusFilter
                ] }),
                searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-[#e8f0ee]/30 text-[#2a655f] border-2 border-[#3a8a82]/20", children: [
                  "🔍 ",
                  searchQuery
                ] })
              ] })
            ] })
          ] }),
          totalActivePages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-4 mt-4 border-t border-[#3a8a82]/30 flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-[#1a4f4a] animate-pulse" }),
              isArabic ? `صفحة ${activePage} من ${totalActivePages}` : `Page ${activePage} of ${totalActivePages}`,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                filteredOrders.length,
                " ",
                isArabic ? "طلب" : "orders"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setActivePage(1), disabled: activePage === 1, className: "h-8 w-8 p-0 rounded-xl border-[#3a8a82]/40 hover:border-[#1a4f4a]/50 hover:bg-[#e8f0ee]/50 disabled:opacity-50 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-[#1a4f4a]", children: "«" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setActivePage(activePage - 1), disabled: activePage === 1, className: "h-8 w-8 p-0 rounded-xl border-[#3a8a82]/40 hover:border-[#1a4f4a]/50 hover:bg-[#e8f0ee]/50 disabled:opacity-50 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 text-[#1a4f4a]" }) }),
              Array.from({
                length: Math.min(5, totalActivePages)
              }, (_, i) => {
                let p;
                if (totalActivePages <= 5) {
                  p = i + 1;
                } else if (activePage <= 3) {
                  p = i + 1;
                } else if (activePage >= totalActivePages - 2) {
                  p = totalActivePages - 4 + i;
                } else {
                  p = activePage - 2 + i;
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: p === activePage ? "default" : "ghost", size: "sm", onClick: () => setActivePage(p), className: cn("h-8 w-8 p-0 rounded-xl text-xs font-medium transition-all duration-300", p === activePage ? "bg-gradient-to-r from-[#1a4f4a] to-[#3a8a82] text-white shadow-md shadow-[#1a4f4a]/30" : "hover:bg-[#e8f0ee]/50 hover:text-[#1a4f4a]"), children: p }, p);
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setActivePage(activePage + 1), disabled: activePage === totalActivePages, className: "h-8 w-8 p-0 rounded-xl border-[#3a8a82]/40 hover:border-[#1a4f4a]/50 hover:bg-[#e8f0ee]/50 disabled:opacity-50 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-[#1a4f4a]" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setActivePage(totalActivePages), disabled: activePage === totalActivePages, className: "h-8 w-8 p-0 rounded-xl border-[#3a8a82]/40 hover:border-[#1a4f4a]/50 hover:bg-[#e8f0ee]/50 disabled:opacity-50 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-[#1a4f4a]", children: "»" }) })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 pb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-[#3a8a82]/30 mb-6 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 border-[#1a4f4a] text-[#1a4f4a] dark:text-[#3a8a82] hover:scale-105", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 animate-spin-slow text-[#1a4f4a]" }),
          isArabic ? "تاريخ الطلبات" : "Order History",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#e8f0ee]/50 text-[#1a4f4a] border-0 text-[10px]", children: historyOrders.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => exportToCSV(historyOrders, "تاريخ_الطلبات"), className: "h-9 rounded-xl border-[#3a8a82]/30 hover:bg-[#e8f0ee]/50 transition-all duration-300 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 text-[#1a4f4a] group-hover:scale-110 transition-transform" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#1a4f4a]", children: isArabic ? "Excel" : "Excel" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "تصدير إلى Excel" : "Export to Excel" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => exportToWord(historyOrders, "تقرير_تاريخ_الطلبات"), className: "h-9 rounded-xl border-[#3a8a82]/30 hover:bg-[#e8f0ee]/50 transition-all duration-300 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-[#1a4f4a] group-hover:scale-110 transition-transform" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#1a4f4a]", children: isArabic ? "Word" : "Word" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "تصدير إلى Word" : "Export to Word" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handlePrint, className: "h-9 rounded-xl border-[#3a8a82]/30 hover:bg-[#e8f0ee]/50 transition-all duration-300 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 text-[#1a4f4a] group-hover:scale-110 transition-transform" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs mr-1 text-[#1a4f4a]", children: isArabic ? "طباعة" : "Print" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: isArabic ? "طباعة التقرير" : "Print Report" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px] max-w-sm group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#1a4f4a] transition-all duration-300 group-focus-within:scale-110" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: isArabic ? "🔍 بحث في التاريخ (رقم، اسم، هاتف، عنوان)..." : "🔍 Search history (ID, name, phone, address)...", value: historySearch, onChange: (e) => setHistorySearch(e.target.value), className: "ps-9 h-10 rounded-xl border-[#3a8a82]/30 focus:border-[#1a4f4a] focus:ring-[#3a8a82]/40 transition-all duration-300" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: historyFilter, onChange: (e) => {
          setHistoryFilter(e.target.value);
          setHistoryPage(1);
        }, className: "h-10 px-3 rounded-xl border border-[#3a8a82]/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#3a8a82]/40 transition-all duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: isArabic ? "جميع الحالات" : "All status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "delivered", children: isArabic ? "تم التوصيل" : "Delivered" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cancelled", children: isArabic ? "ملغي" : "Cancelled" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: historyLimit, onChange: (e) => {
          setHistoryLimit(Number(e.target.value));
          setHistoryPage(1);
        }, className: "h-10 px-3 rounded-xl border border-[#3a8a82]/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#3a8a82]/40 transition-all duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "5", children: "5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "10", children: "10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "25", children: "25" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "50", children: "50" })
        ] })
      ] }),
      ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-2xl animate-pulse" }, i)) }) : historyOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#3a8a82]/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#e8f0ee]/50 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-8 w-8 text-[#1a4f4a]/40" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: isArabic ? "لا توجد طلبات في السجل" : "No orders in history" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "ستظهر الطلبات المكتملة والملغية هنا" : "Completed and cancelled orders will appear here" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-100 dark:border-slate-800 hover:bg-transparent bg-gradient-to-r from-[#e8f0ee]/60 via-[#f8fafc]/40 to-[#e8f0ee]/60 dark:from-[#3a8a82]/20 dark:via-[#f8fafc]/10 dark:to-[#3a8a82]/20 border-b-3 border-[#3a8a82]/50 dark:border-[#3a8a82]/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-right min-w-[120px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "رقم الطلب" : "Order #" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[120px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "العميل" : "Customer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[100px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "الحالة" : "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[100px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "التوصيل" : "Delivery" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[120px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "الإجمالي" : "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[100px] border-r-2 border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: isArabic ? "تاريخ التسليم" : "Delivered Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] text-center min-w-[100px]", children: isArabic ? "الإجراءات" : "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: paginatedHistoryOrders.map((order) => {
              order.delivery_address || order.pickup_address;
              const customerName = order.orders?.buyer_name || order.buyer_name || (isArabic ? "عميل" : "Customer");
              const total = order.orders?.total_with_delivery || order.orders?.total || order.cod_amount || 0;
              const deliveryFee = order.delivery_fee || 0;
              const statusColors = {
                delivered: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
                cancelled: "bg-red-500/10 text-red-500 border-red-500/20"
              };
              const statusLabels = {
                delivered: isArabic ? "تم التوصيل" : "Delivered",
                cancelled: isArabic ? "ملغي" : "Cancelled"
              };
              const deliveredDate = order.delivered_at || order.updated_at || order.created_at;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-100 dark:border-slate-800 hover:bg-[#3a8a82]/15 dark:hover:bg-[#3a8a82]/10 transition-colors duration-300 group border-b-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-semibold text-slate-900 dark:text-white text-right border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "group-hover:text-[#2a655f] transition-colors", children: [
                  "#",
                  order.tracking_number || order.id.substring(0, 8)
                ] }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-slate-600 dark:text-slate-300 text-center border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 text-[#1a4f4a]" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: customerName })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("border transition-all duration-300 hover:scale-105", statusColors[order.status] || "bg-slate-500/10 text-slate-500"), children: statusLabels[order.status] || order.status }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-[#2a655f] dark:text-[#3a8a82] text-center group-hover:scale-110 transition-transform duration-300 border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: deliveryFee === 0 ? isArabic ? "🆓 مجاني" : "🆓 Free" : formatPrice(Number(deliveryFee), app.currency, app.lang) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-[#2a655f] dark:text-[#3a8a82] text-center group-hover:scale-110 transition-transform duration-300 border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: formatPrice(Number(total), app.currency, app.lang) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-slate-500 text-center border-r-2 border-[#3a8a82]/20 dark:border-[#3a8a82]/10", children: new Date(deliveredDate).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1.5 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-8 px-3 rounded-xl transition-all duration-300 hover:scale-105 text-xs border-[#3a8a82]/40 hover:bg-[#e8f0ee]/50 hover:border-[#1a4f4a]/50", onClick: () => {
                  setSelectedOrderForDetails(order);
                  setShowOrderDetails(true);
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 mr-1" }),
                  isArabic ? "عرض" : "View"
                ] }) }) })
              ] }, order.id);
            }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t-3 border-[#3a8a82]/20 dark:border-[#3a8a82]/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-[#e8f0ee]/30 via-[#f8fafc]/20 to-[#e8f0ee]/30 dark:from-[#3a8a82]/10 dark:via-[#f8fafc]/5 dark:to-[#3a8a82]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? `عرض ${paginatedHistoryOrders.length} من ${historyOrders.length} طلب` : `Showing ${paginatedHistoryOrders.length} of ${historyOrders.length} orders` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20", children: isArabic ? "📋 السجل" : "📋 History" }),
              historyFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-[#e8f0ee]/30 text-[#2a655f] border-2 border-[#3a8a82]/20", children: [
                "🔍 ",
                historyFilter
              ] }),
              historySearch && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-[#e8f0ee]/30 text-[#2a655f] border-2 border-[#3a8a82]/20", children: [
                "🔍 ",
                historySearch
              ] })
            ] })
          ] })
        ] }),
        totalHistoryPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-[#3a8a82]/30 flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? `صفحة ${historyPage} من ${totalHistoryPages}` : `Page ${historyPage} of ${totalHistoryPages}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setHistoryPage(1), disabled: historyPage === 1, className: "h-8 w-8 p-0 rounded-xl border-[#3a8a82]/40 hover:border-[#1a4f4a]/50 hover:bg-[#e8f0ee]/50 disabled:opacity-50 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-[#1a4f4a]", children: "«" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setHistoryPage(historyPage - 1), disabled: historyPage === 1, className: "h-8 w-8 p-0 rounded-xl border-[#3a8a82]/40 hover:border-[#1a4f4a]/50 hover:bg-[#e8f0ee]/50 disabled:opacity-50 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 text-[#1a4f4a]" }) }),
            Array.from({
              length: Math.min(5, totalHistoryPages)
            }, (_, i) => {
              const p = i + 1;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: p === historyPage ? "default" : "ghost", size: "sm", onClick: () => setHistoryPage(p), className: cn("h-8 w-8 p-0 rounded-xl text-xs font-medium transition-all duration-300", p === historyPage ? "bg-gradient-to-r from-[#1a4f4a] to-[#3a8a82] text-white shadow-md shadow-[#1a4f4a]/30" : "hover:bg-[#e8f0ee]/50 hover:text-[#1a4f4a]"), children: p }, p);
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setHistoryPage(historyPage + 1), disabled: historyPage === totalHistoryPages, className: "h-8 w-8 p-0 rounded-xl border-[#3a8a82]/40 hover:border-[#1a4f4a]/50 hover:bg-[#e8f0ee]/50 disabled:opacity-50 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-[#1a4f4a]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setHistoryPage(totalHistoryPages), disabled: historyPage === totalHistoryPages, className: "h-8 w-8 p-0 rounded-xl border-[#3a8a82]/40 hover:border-[#1a4f4a]/50 hover:bg-[#e8f0ee]/50 disabled:opacity-50 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-[#1a4f4a]", children: "»" }) })
          ] })
        ] })
      ] })
    ] }),
    isStatusDialogOpen && selectedOrder && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl border-4 border-[#3a8a82] max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold text-[#1a4f4a] dark:text-[#3a8a82] flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5 animate-spin-slow text-[#1a4f4a]" }),
          isArabic ? "تحديث حالة الطلب" : "Update Order Status"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? `اختر الحالة الجديدة للطلب #${selectedOrder?.tracking_number || selectedOrder?.id?.substring(0, 8)}` : `Select new status for order #${selectedOrder?.tracking_number || selectedOrder?.id?.substring(0, 8)}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: isArabic ? "ملاحظات (اختياري)" : "Notes (Optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: statusNotes, onChange: (e) => setStatusNotes(e.target.value), placeholder: isArabic ? "أضف ملاحظات عن حالة الطلب..." : "Add notes about the order status...", className: "mt-1 min-h-[60px] resize-none border-[#3a8a82]/30 focus:border-[#1a4f4a] focus:ring-[#3a8a82]/40", dir: isArabic ? "rtl" : "ltr" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 mt-4", children: getAvailableStatuses(selectedOrder.status).map((status) => {
        const statusConfig = {
          assigned: {
            icon: User,
            label: isArabic ? "تم التعيين" : "Assigned",
            color: "border-[#1a4f4a]"
          },
          picked_up: {
            icon: Package,
            label: isArabic ? "تم الاستلام" : "Picked up",
            color: "border-[#1a4f4a]"
          },
          in_transit: {
            icon: Truck,
            label: isArabic ? "قيد التوصيل" : "In Transit",
            color: "border-[#1a4f4a]"
          },
          delivered: {
            icon: CircleCheckBig,
            label: isArabic ? "تم التوصيل" : "Delivered",
            color: "border-emerald-500"
          }
        };
        const config = statusConfig[status];
        if (!config) return null;
        const Icon = config.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: cn("h-16 flex flex-col gap-1 transition-all duration-300 hover:scale-105 hover:bg-[#e8f0ee]/50", config.color, "border-[#3a8a82]/40"), onClick: () => handleStatusUpdate(selectedOrder.id, status), disabled: isUpdating, children: [
          isUpdating ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5 animate-spin text-[#1a4f4a]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-[#1a4f4a]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: config.label })
        ] }, status);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "لا يمكنك الرجوع إلى حالة سابقة. سيتم إرسال إشعارات للمشتري والبائع وشركة التوصيل" : "You cannot go back to a previous status. Notifications will be sent to buyer, seller and delivery company" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setIsStatusDialogOpen(false), className: "text-muted-foreground hover:text-foreground", children: isArabic ? "إلغاء" : "Cancel" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showOrderDetails, onOpenChange: setShowOrderDetails, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto border-[#3a8a82]/30 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-bold text-[#1a4f4a] dark:text-[#3a8a82] flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-xl bg-gradient-to-br from-[#1a4f4a] to-[#3a8a82] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-white" }) }),
          isArabic ? "تفاصيل الطلب" : "Order Details"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? `الطلب #${selectedOrderForDetails?.tracking_number || selectedOrderForDetails?.id?.substring(0, 8)}` : `Order #${selectedOrderForDetails?.tracking_number || selectedOrderForDetails?.id?.substring(0, 8)}` })
      ] }),
      loadingDetails ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin mx-auto text-[#1a4f4a]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: isArabic ? "جاري تحميل تفاصيل الطلب..." : "Loading order details..." })
      ] }) : selectedOrderForDetails ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 p-4 bg-[#e8f0ee]/30 rounded-xl border border-[#3a8a82]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "رقم الطلب" : "Order ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: selectedOrderForDetails.id.substring(0, 8) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "الحالة" : "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("border-0", getStatusColor(selectedOrderForDetails.status)), children: getStatusLabel(selectedOrderForDetails.status) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "رسوم التوصيل" : "Delivery Fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-[#1a4f4a]", children: formatPrice(Number(selectedOrderForDetails.delivery_fee || 0), app.currency, app.lang) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "تاريخ الطلب" : "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: new Date(selectedOrderForDetails.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "المجموع الكلي" : "Total Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-[#1a4f4a]", children: formatPrice(Number(orderData?.total_with_delivery || selectedOrderForDetails.cod_amount || orderData?.total || 0), app.currency, app.lang) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[#e8f0ee]/30 rounded-xl border border-[#3a8a82]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-[#1a4f4a]" }),
            isArabic ? "عنوان التوصيل" : "Delivery Address"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm mt-1", children: orderData?.delivery_address || selectedOrderForDetails.pickup_address || (isArabic ? "غير محدد" : "Not specified") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[#e8f0ee]/30 rounded-xl border border-[#3a8a82]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-[#1a4f4a]" }),
            isArabic ? "معلومات العميل" : "Customer Info"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: orderData?.buyer_name || (isArabic ? "غير معروف" : "Unknown") }),
            orderData?.buyer_phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 text-[#1a4f4a]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono", dir: "ltr", children: orderData.buyer_phone }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 px-2 rounded-lg bg-[#e8f0ee]/50 hover:bg-[#e8f0ee]/70 text-[#1a4f4a] transition-all duration-300", onClick: () => window.location.href = `tel:${orderData.buyer_phone}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs mr-1", children: isArabic ? "اتصل" : "Call" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-[#3a8a82]/30 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-sm flex items-center gap-2 mb-3 text-[#1a4f4a]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-[#1a4f4a]" }),
            isArabic ? "المنتجات" : "Products",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#e8f0ee]/50 text-[#1a4f4a] border-0 text-[10px]", children: orderItems.length })
          ] }),
          orderItems.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orderItems.map((item, index) => {
            const listing = item.listings || item;
            const imageUrl = getProductImage(item);
            const isPromo = isPromoOffer(item);
            const offerData = getPromoOfferData(item);
            const requiredVariations = offerData?.required_products?.variations || {};
            const giftVariations = offerData?.free_product?.variations || {};
            const hasRequired = Object.keys(requiredVariations).length > 0;
            const hasGift = Object.keys(giftVariations).length > 0;
            const itemPrice = Number(item.price) || 0;
            const itemQuantity = item.quantity || 1;
            const totalPrice = itemPrice * itemQuantity;
            const variationCombination = getVariationCombination(item);
            const hasVariation = !!(variationCombination && Object.keys(variationCombination).length > 0);
            const variationDisplay = getVariationDisplay(variationCombination);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("p-3 rounded-xl border-2 transition-all duration-300", isPromo ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-300/50 dark:border-purple-700/50 hover:border-purple-400/70" : "bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 hover:border-[#3a8a82]/50"), children: isPromo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 px-3 py-1 rounded-full text-xs font-bold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-3.5 w-3.5 inline mr-1.5" }),
                  isArabic ? "عرض ترويجي" : "Promo Offer"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-purple-300 text-purple-600 text-[10px]", children: offerData?.offer_type === "bogo" ? "🎁 نفس المنتج" : offerData?.offer_type === "cross_sell" ? "🔄 منتج مختلف" : "📦 باقة" })
              ] }),
              offerData?.display_text_ar && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: isArabic ? offerData.display_text_ar : offerData.display_text_en }),
              hasRequired && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-slate-500 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-4 bg-purple-500 rounded-full" }),
                  "🛒 ",
                  isArabic ? "المنتجات المطلوبة" : "Required Products",
                  " (",
                  Object.keys(requiredVariations).length,
                  ")"
                ] }),
                Object.entries(requiredVariations).map(([id, data]) => {
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
              hasGift && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-emerald-500 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-4 bg-emerald-500 rounded-full" }),
                  "🎁 ",
                  isArabic ? "الهدية" : "Gift",
                  " (",
                  Object.keys(giftVariations).length,
                  ")"
                ] }),
                Object.entries(giftVariations).map(([id, data]) => {
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
            ] }) : (
              // ✅ العرض العادي
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50", children: imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-slate-400" }) }) }),
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-700 dark:text-emerald-300", children: formatPrice(itemPrice, app.currency, app.lang) })
                    ] }),
                    itemQuantity > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-[#e8f0ee]/50 px-2 py-0.5 rounded-full border border-[#3a8a82]/30", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1a4f4a]", children: isArabic ? "الإجمالي:" : "Total:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#1a4f4a]", children: formatPrice(totalPrice, app.currency, app.lang) })
                      ] })
                    ] }),
                    hasVariation && variationDisplay && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/80 flex items-center gap-1 bg-[#e8f0ee]/40 px-2 py-0.5 rounded-full border border-[#3a8a82]/20", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3 w-3 text-[#1a4f4a]" }),
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
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground/70 flex items-center gap-1 bg-[#e8f0ee]/40 px-2 py-0.5 rounded-full", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#1a4f4a]", children: "🎨" }),
                        item.selected_options.selected_color,
                        item.selected_options.selected_size && ` (${item.selected_options.selected_size})`
                      ] })
                    ] })
                  ] })
                ] })
              ] })
            ) }, item.id || index);
          }) }) : (() => {
            const oldOrder = orderData?.order || orderData?.orders || null;
            const oldListing = oldOrder?.listings || orderData?.listings || null;
            if (oldListing) {
              const oldQuantity = oldOrder?.quantity || 1;
              const oldTotal = oldOrder?.total || 0;
              const oldImageUrl = oldOrder?.metadata?.variation_image || oldOrder?.metadata?.product_cover || oldListing?.cover_url || null;
              const oldVariationCombination = oldOrder?.metadata?.variation_combination || oldOrder?.variation_combination || null;
              const oldHasVariation = !!(oldVariationCombination && Object.keys(oldVariationCombination).length > 0);
              const oldVariationDisplay = getVariationDisplay(oldVariationCombination);
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-[#3a8a82]/50 transition-all duration-300", children: [
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-700 dark:text-emerald-300", children: formatPrice(oldTotal, app.currency, app.lang) })
                    ] }),
                    oldHasVariation && oldVariationDisplay && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/80 flex items-center gap-1 bg-[#e8f0ee]/40 px-2 py-0.5 rounded-full border border-[#3a8a82]/20", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3 w-3 text-[#1a4f4a]" }),
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
        ] }),
        orderData?.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
            isArabic ? "ملاحظات العميل" : "Customer Notes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 mt-1", children: orderData.notes })
        ] }),
        selectedOrderForDetails.status === "rejected" && selectedOrderForDetails.rejection_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
            isArabic ? "سبب الرفض" : "Rejection Reason"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 mt-1", children: selectedOrderForDetails.rejection_reason })
        ] }),
        (() => {
          const subtotal = orderData?.total || orderData?.totals?.subtotal || 0;
          const deliveryFee = orderData?.delivery_fee || orderData?.totals?.delivery_fee || 0;
          const promoDiscount = orderData?.promo_discount || orderData?.totals?.promo_discount || 0;
          const totalWithDelivery = orderData?.total_with_delivery || orderData?.totals?.total_with_delivery || subtotal + deliveryFee - promoDiscount;
          const currency = orderData?.currency || orderData?.totals?.currency || app.currency || "SYP";
          const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1;
          const hasDiscount = promoDiscount > 0;
          const isFreeDelivery = deliveryFee === 0;
          orderItems.some((item) => isPromoOffer(item));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[#e8f0ee]/30 dark:bg-[#e8f0ee]/10 rounded-xl border border-[#3a8a82]/30 dark:border-[#3a8a82]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: isArabic ? "المجموع الفرعي" : "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-[#1a4f4a] dark:text-[#3a8a82]", children: formatPrice(subtotal, currency, app.lang) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1 pt-1 border-t border-[#3a8a82]/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground flex items-center gap-1.5", children: [
                isFreeDelivery ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4 text-emerald-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-600", children: isArabic ? "التوصيل" : "Delivery" })
                ] }) : isArabic ? "سعر التوصيل" : "Delivery Fee",
                isFreeDelivery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/20 text-emerald-600 border-0 text-[9px] animate-pulse", children: [
                  "🎁 ",
                  isArabic ? "مجاني" : "Free"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-sm font-medium", isFreeDelivery ? "text-emerald-500 font-bold" : "text-[#1a4f4a]"), children: isFreeDelivery ? "🆓 مجاني" : formatPrice(deliveryFee, currency, app.lang) })
            ] }),
            hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1 pt-1 border-t border-[#3a8a82]/20 text-emerald-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "h-4 w-4 text-emerald-500" }),
                isArabic ? "💚 الخصم (كود خصم)" : "💚 Discount (Promo Code)",
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/20 text-emerald-600 border-0 text-[9px]", children: [
                  "-",
                  Math.round(promoDiscount / (subtotal + deliveryFee) * 100),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold", children: [
                "-",
                formatPrice(promoDiscount, currency, app.lang)
              ] })
            ] }),
            hasDiscount && isFreeDelivery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30 animate-in fade-in slide-in-from-top-3 duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-emerald-500 animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-emerald-700 dark:text-emerald-300", children: isArabic ? "🎉 تم تطبيق كود الخصم + التوصيل المجاني!" : "🎉 Promo code applied + Free delivery!" })
            ] }),
            isFreeDelivery && !hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30 animate-in fade-in slide-in-from-top-3 duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4 text-blue-500 animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-blue-700 dark:text-blue-300", children: isArabic ? "🎁 التوصيل مجاني لهذا الطلب!" : "🎁 Free delivery for this order!" })
            ] }),
            hasDiscount && !isFreeDelivery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 p-2.5 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-200/50 dark:border-purple-800/30 animate-in fade-in slide-in-from-top-3 duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "h-4 w-4 text-purple-500 animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-purple-700 dark:text-purple-300", children: isArabic ? `💚 تم تطبيق خصم ${Math.round(promoDiscount / (subtotal + deliveryFee) * 100)}% على الطلب!` : `💚 ${Math.round(promoDiscount / (subtotal + deliveryFee) * 100)}% discount applied!` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t-2 border-[#3a8a82]/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-[#1a4f4a] dark:text-white flex items-center gap-1.5", children: [
                isFreeDelivery && /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4 text-emerald-500" }),
                isArabic ? "الإجمالي الكامل" : "Total"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-[#1a4f4a] dark:text-[#3a8a82]", children: formatPrice(totalWithDelivery, currency, app.lang) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                totalItems,
                " ",
                isArabic ? "منتج" : "items",
                hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-emerald-500", children: [
                  "💚 ",
                  isArabic ? "خصم" : "discount"
                ] }),
                isFreeDelivery && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-emerald-500", children: [
                  "🎁 ",
                  isArabic ? "توصيل مجاني" : "free delivery"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(selectedOrderForDetails.created_at || Date.now()).toLocaleString(isArabic ? "ar-SA" : "en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }) })
            ] })
          ] });
        })()
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin mx-auto text-[#1a4f4a]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: isArabic ? "جاري تحميل تفاصيل الطلب..." : "Loading order details..." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "border-t border-[#3a8a82]/30 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setShowOrderDetails(false), className: "rounded-xl border-[#3a8a82]/30 hover:bg-[#e8f0ee]/50 text-[#1a4f4a]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
        isArabic ? "إغلاق" : "Close"
      ] }) })
    ] }) }),
    currentDistributor && !currentDistributor.avatar_url && /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAvatarDialog, onOpenChange: setShowAvatarDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "w-[95vw] max-w-md rounded-2xl max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-slate-900 border-[#3a8a82]/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-[#1a4f4a] to-[#3a8a82] p-4 md:p-6 text-white rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-6 w-6 md:h-7 md:w-7 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-1 rounded-2xl bg-[#3a8a82]/30 blur-lg animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg md:text-2xl font-bold", children: isArabic ? "📸 أضف صورة ملفك الشخصي" : "📸 Add Your Profile Picture" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs md:text-sm mt-0.5", children: isArabic ? "ساعد العملاء على التعرف عليك بشكل أفضل" : "Help customers recognize you better" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-3 md:space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 md:gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-dashed border-[#3a8a82]/40 bg-[#e8f0ee]/10 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-[#1a4f4a]/50 group", children: avatarPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: avatarPreview, alt: "Preview", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-8 w-8 md:h-10 md:w-10 text-[#1a4f4a]/30 group-hover:text-[#1a4f4a]/50 transition-colors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] md:text-xs", children: isArabic ? "اختر صورة" : "Choose image" })
            ] }) }),
            avatarPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setAvatarFile(null);
              setAvatarPreview(null);
            }, className: "absolute -top-1 -right-1 h-5 w-5 md:h-6 md:w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 md:h-4 md:w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full rounded-xl border-[#3a8a82]/40 hover:bg-[#e8f0ee]/50 transition-all duration-300 h-9 md:h-10 text-sm", onClick: () => document.getElementById("avatar-input")?.click(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-3 w-3 md:h-4 md:w-4 mr-2 text-[#1a4f4a]" }),
            avatarPreview ? isArabic ? "تغيير الصورة" : "Change image" : isArabic ? "اختر صورة من جهازك" : "Choose image from your device"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "avatar-input", type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
            const file = e.target.files?.[0];
            if (file) {
              setAvatarFile(file);
              const reader = new FileReader();
              reader.onload = (event) => {
                setAvatarPreview(event.target?.result);
              };
              reader.readAsDataURL(file);
            }
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] md:text-xs text-muted-foreground text-center", children: isArabic ? "📷 يفضل استخدام صورة واضحة بحجم 500x500 بكسل على الأقل" : "📷 Use a clear image at least 500x500 pixels" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 md:h-5 md:w-5 text-amber-500 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs md:text-sm font-medium text-amber-700 dark:text-amber-300", children: isArabic ? "⚠️ صورة الموزع مهمة جداً" : "⚠️ Distributor photo is very important" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] md:text-xs text-amber-600/80 dark:text-amber-400/70", children: isArabic ? "ستظهر هذه الصورة للعملاء عند اختيار الموزع المناسب لتوصيل طلباتهم" : "This photo will appear to customers when choosing the right distributor for their orders" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 md:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] md:text-xs font-medium text-muted-foreground mb-2 md:mb-3", children: isArabic ? "📌 كيف ستبدو صورته للعملاء:" : "📌 How it will look to customers:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 md:gap-4 p-2 md:p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/50 dark:border-slate-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#e8f0ee]/50 flex items-center justify-center flex-shrink-0", children: avatarPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: avatarPreview, alt: "Preview", className: "h-full w-full object-cover rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 md:h-6 md:w-6 text-[#1a4f4a]/40" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-xs md:text-sm", children: currentDistributor?.full_name_ar || currentDistributor?.full_name_en || isArabic ? "الموزع" : "Distributor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5 md:h-3 md:w-3 fill-yellow-400 text-yellow-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: currentDistributor?.rating || 0 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-2.5 w-2.5 md:h-3 md:w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  currentDistributor?.completed_orders || 0,
                  " ",
                  isArabic ? "طلب" : "orders"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/20 text-emerald-600 border-0 text-[8px] md:text-[9px]", children: [
              "● ",
              isArabic ? "متاح" : "Available"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "p-3 md:p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 gap-2 flex-col sm:flex-row rounded-b-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => {
          setShowAvatarDialog(false);
          setAvatarFile(null);
          setAvatarPreview(null);
        }, className: "w-full sm:w-auto rounded-xl h-9 md:h-10 text-sm border-[#3a8a82]/40 hover:bg-[#e8f0ee]/50", disabled: isUploadingAvatar, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 md:h-4 md:w-4 mr-1.5" }),
          isArabic ? "تخطي الآن" : "Skip for now"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleUploadAvatar, disabled: !avatarFile || isUploadingAvatar, className: "w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#1a4f4a] to-[#3a8a82] hover:from-[#0d2e2a] hover:to-[#2a655f] text-white shadow-lg shadow-[#1a4f4a]/30 transition-all duration-300 h-9 md:h-10 text-sm", children: isUploadingAvatar ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 md:h-4 md:w-4 mr-2 animate-spin" }),
          isArabic ? "جاري الرفع..." : "Uploading..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-3 w-3 md:h-4 md:w-4 mr-2" }),
          isArabic ? "رفع الصورة" : "Upload Image"
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 4s linear infinite; }
          @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
          @keyframes drive-across { 0% { transform: translateX(-20%); } 100% { transform: translateX(120%); } }
          .animate-drive-across { animation: drive-across 14s linear infinite; }
          @keyframes bounce-truck { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-4px) rotate(-1deg); } 75% { transform: translateY(-4px) rotate(1deg); } }
          .animate-bounce-truck { animation: bounce-truck 2.5s ease-in-out infinite; }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          .animate-float { animation: float 3s ease-in-out infinite; }
          @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease-in-out infinite; }
          @keyframes ping { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
          .animate-ping { animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
          @keyframes float-logo { 0%, 100% { transform: translateY(0px) rotate(0deg); } 25% { transform: translateY(-6px) rotate(-2deg); } 75% { transform: translateY(4px) rotate(2deg); } }
          .animate-float-logo { animation: float-logo 4s ease-in-out infinite; }
          @keyframes pulse-glow { 0%, 100% { filter: drop-shadow(0 0 15px rgba(58,138,130,0.3)); } 50% { filter: drop-shadow(0 0 30px rgba(58,138,130,0.6)); } }
          .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
          @keyframes pulse-slow { 0%, 100% { opacity: 0.3; transform: scale(0.95); } 50% { opacity: 0.6; transform: scale(1.05); } }
          .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          .animate-shimmer { animation: shimmer 3s infinite; }
        ` })
  ] }) });
}
function StatCard({
  icon: Icon,
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#e8f0ee] dark:bg-[#e8f0ee]/30 rounded-xl p-4 shadow-sm border-2 border-[#3a8a82]/60 dark:border-[#3a8a82]/30 hover:shadow-lg hover:border-[#1a4f4a]/60 transition-all duration-300 hover:scale-[1.03] group cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82] group-hover:text-[#1a4f4a] transition-colors duration-300", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold mt-1 text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-[#3a8a82]/50 dark:bg-[#3a8a82]/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#3a8a82]/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-[#1a4f4a]" }) })
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
  DistributorDashboardPage as component
};
