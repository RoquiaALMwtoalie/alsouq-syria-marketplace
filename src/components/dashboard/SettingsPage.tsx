import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { useProfile, useUpdateStorePreferences, useGovernorates } from "@/lib/queries";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; // ✅ مطلوب
import { 
  MapPin, Globe, Building, Calendar, Store, Phone, 
  Clock, MessageSquare, BookOpen, AlertCircle, RefreshCw,
  X, CheckCircle2, Image as ImageIcon, FileSpreadsheet, FileText,
  Power, PowerOff, AlertTriangle, Sparkles, Rocket, Zap,
  Shield, Crown, Star, ShieldCheck, Settings, Sliders,
  Heart, Award, Target, TrendingUp, Users, ShoppingBag,
  Bell  // ✅ مطلوب
} from "lucide-react";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { ImageInput } from "@/components/ImageInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
// أيام الأسبوع
const WEEK_DAYS = [
  { value: 'Monday', label: 'الإثنين' },
  { value: 'Tuesday', label: 'الثلاثاء' },
  { value: 'Wednesday', label: 'الأربعاء' },
  { value: 'Thursday', label: 'الخميس' },
  { value: 'Friday', label: 'الجمعة' },
  { value: 'Saturday', label: 'السبت' },
  { value: 'Sunday', label: 'الأحد' },
];

export function SettingsPage() {
  const app = useApp();
  const t = useT();
  const { data: profile, refetch } = useProfile(app.user?.id) as { data: any; refetch: () => void };
  const { data: governorates = [] } = useGovernorates();
  const update = useUpdateStorePreferences();

  // ===== جميع حالات المتجر =====
  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [storeCover, setStoreCover] = useState("");
  const [online, setOnline] = useState(true);
  const [opensAt, setOpensAt] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [allowsMessaging, setAllowsMessaging] = useState(true);
  const [allowsBookings, setAllowsBookings] = useState(false);
  const [storeType, setStoreType] = useState<'online' | 'physical'>('online');
  const [governorateId, setGovernorateId] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [weeklyOffDays, setWeeklyOffDays] = useState<string[]>([]);
  const [storeActive, setStoreActive] = useState(true);
  const [storeInactiveReason, setStoreInactiveReason] = useState("");
  const [showInactiveReason, setShowInactiveReason] = useState(false);
  
  // ✅ State للمودال
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [tempInactiveReason, setTempInactiveReason] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);

  // ===== تحميل البيانات من قاعدة البيانات =====
  useEffect(() => {
    if (profile) {
      setStoreName(profile.store_name || "");
      setStorePhone(profile.store_phone || profile.phone || "");
      setStoreDesc(profile.store_description || "");
      setStoreLogo(profile.store_logo_url || "");
      setStoreCover(profile.store_cover_url || "");
      
      setOnline(profile.store_online !== false);
      setStoreActive(profile.store_active !== false);
      setStoreInactiveReason(profile.store_inactive_reason || "");
      setShowInactiveReason(profile.store_active === false && profile.store_inactive_reason);
      
      setOpensAt(profile.store_opens_at ? profile.store_opens_at.slice(0, 5) : "");
      setClosesAt(profile.store_closes_at ? profile.store_closes_at.slice(0, 5) : "");
      
      setAllowsMessaging(profile.allows_messaging !== false);
      setAllowsBookings(profile.allows_bookings === true);
      
      setStoreType(profile.store_type || 'online');
      setGovernorateId(profile.governorate_id || "");
      setStoreAddress(profile.store_address || "");
      setWeeklyOffDays(profile.weekly_off_days || []);
      
      setSeeded(true);
    }
  }, [profile]);

  // ===== ✅ زر إيقاف المتجر =====
  const handleDeactivateStore = async () => {
    if (!app.user) return;
    
    if (!tempInactiveReason.trim()) {
      toast.error(app.lang === "ar" ? "الرجاء كتابة سبب إيقاف المتجر" : "Please provide a reason for deactivating");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          store_active: false,
          store_online: false,
          store_inactive_reason: tempInactiveReason.trim(),
        })
        .eq("id", app.user.id);
      
      if (error) throw error;
      
      setStoreActive(false);
      setOnline(false);
      setStoreInactiveReason(tempInactiveReason.trim());
      setShowInactiveReason(true);
      
      toast.success(app.lang === "ar" ? "✅ تم إيقاف المتجر بنجاح" : "✅ Store deactivated successfully");
      setShowDeactivateDialog(false);
      setTempInactiveReason("");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };

  // ===== ✅ زر تشغيل المتجر =====
  const handleActivateStore = async () => {
    if (!app.user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          store_active: true,
          store_online: true,
          store_inactive_reason: null,
        })
        .eq("id", app.user.id);
      
      if (error) throw error;
      
      setStoreActive(true);
      setOnline(true);
      setStoreInactiveReason("");
      setShowInactiveReason(false);
      
      toast.success(app.lang === "ar" ? "✅ تم تفعيل المتجر بنجاح" : "✅ Store activated successfully");
      setShowActivateDialog(false);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };

  // ===== حفظ معلومات المتجر =====
  async function saveStoreInfo() {
    if (!app.user) return;
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from("profiles").update({
        store_name: storeName || null,
        store_phone: storePhone || null,
        store_description: storeDesc || null,
        store_logo_url: storeLogo || null,
        store_cover_url: storeCover || null,
        store_type: storeType,
        governorate_id: governorateId || null,
        store_address: storeType === 'physical' ? storeAddress || null : null,
        weekly_off_days: weeklyOffDays.length > 0 ? weeklyOffDays : null,
      }).eq("id", app.user.id);
      
      if (error) throw error;
      
      toast.success(app.lang === "ar" ? "✅ تم حفظ معلومات المتجر" : "✅ Store info saved");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }

  // ===== حفظ إعدادات المتجر =====
  async function savePrefs() {
    if (!app.user) return;
    setIsLoading(true);
    
    try {
      const updateData: any = {
        store_online: online,
        store_active: storeActive,
        store_opens_at: opensAt || null,
        store_closes_at: closesAt || null,
        allows_messaging: allowsMessaging,
        allows_bookings: allowsBookings,
        store_type: storeType,
        governorate_id: governorateId || null,
        store_address: storeType === 'physical' ? storeAddress || null : null,
        weekly_off_days: weeklyOffDays,
      };

      if (!storeActive && storeInactiveReason) {
        updateData.store_inactive_reason = storeInactiveReason;
      } else if (storeActive) {
        updateData.store_inactive_reason = null;
      }

      await update.mutateAsync({
        userId: app.user.id,
        ...updateData,
      });
      
      toast.success(app.lang === "ar" ? "✅ تم تحديث إعدادات المتجر" : "✅ Store settings updated");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }

  // ===== إعادة تعيين =====
  function resetToProfile() {
    if (!profile) return;
    setStoreName(profile.store_name || "");
    setStorePhone(profile.store_phone || profile.phone || "");
    setStoreDesc(profile.store_description || "");
    setStoreLogo(profile.store_logo_url || "");
    setStoreCover(profile.store_cover_url || "");
    setOnline(profile.store_online !== false);
    setStoreActive(profile.store_active !== false);
    setStoreInactiveReason(profile.store_inactive_reason || "");
    setShowInactiveReason(profile.store_active === false && profile.store_inactive_reason);
    setOpensAt(profile.store_opens_at ? profile.store_opens_at.slice(0, 5) : "");
    setClosesAt(profile.store_closes_at ? profile.store_closes_at.slice(0, 5) : "");
    setAllowsMessaging(profile.allows_messaging !== false);
    setAllowsBookings(profile.allows_bookings === true);
    setStoreType(profile.store_type || 'online');
    setGovernorateId(profile.governorate_id || "");
    setStoreAddress(profile.store_address || "");
    setWeeklyOffDays(profile.weekly_off_days || []);
    
    toast.success(app.lang === "ar" ? "🔄 تم إعادة تعيين الإعدادات" : "🔄 Settings reset");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* ===== العنوان ===== */}
      <div className="relative">
        <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
        <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#3a8a82]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#2a655f]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Settings className="h-5 w-5 group-hover:animate-spin-slow" />
                </div>
              </div>
              {app.lang === "ar" ? "إعدادات المتجر" : "Store Settings"}
              <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
                <Sliders className="h-3 w-3 mr-1" />
                {app.lang === "ar" ? "تحكم كامل" : "Full Control"}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10">
                <Store className="h-3.5 w-3.5 text-[#2a655f]" />
                <span className="text-[#2a655f] font-medium">{storeName || (app.lang === "ar" ? "متجر جديد" : "New Store")}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-medium">{app.lang === "ar" ? "محمي" : "Secure"}</span>
              </span>
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={resetToProfile}
            className="rounded-xl border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5 transition-all duration-300 group"
          >
            <RefreshCw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-700" />
            {app.lang === "ar" ? "إعادة تعيين" : "Reset"}
          </Button>
        </div>
      </div>

      {/* ===== إعدادات الإشعارات ===== */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2a655f]/20 to-[#3a8a82]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-white dark:bg-[#1e293b] rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-[#2a655f]/10">
              <Bell className="h-5 w-5 text-[#2a655f] animate-bounce" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {app.lang === "ar" ? "إعدادات الإشعارات" : "Notification Settings"}
            </h2>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] animate-pulse">
              {app.lang === "ar" ? "مهم" : "Important"}
            </Badge>
          </div>
          <NotificationSettings />
        </div>
      </div>

      {/* ============================================================ */}
      {/* ===== ✅ زر كبير لتفعيل/إيقاف المتجر ===== */}
      {/* ============================================================ */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2a655f]/20 to-[#3a8a82]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className={cn(
          "relative bg-white dark:bg-[#1e293b] rounded-2xl border p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden",
          storeActive && online 
            ? "border-emerald-500/30 dark:border-emerald-500/20" 
            : "border-red-500/30 dark:border-red-500/20"
        )}>
          {/* خط زخرفي علوي */}
          <div className={cn(
            "absolute top-0 left-0 w-full h-0.5",
            storeActive && online ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-red-400 to-rose-400"
          )} />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* ✅ أيقونة كبيرة */}
              <div className={cn(
                "h-20 w-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:scale-110",
                storeActive && online
                  ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30 animate-pulse"
                  : "bg-gradient-to-br from-red-500 to-rose-500 shadow-red-500/30"
              )}>
                {storeActive && online ? (
                  <Power className="h-10 w-10 text-white" />
                ) : (
                  <PowerOff className="h-10 w-10 text-white" />
                )}
              </div>
              
              <div>
                <h3 className={cn(
                  "text-2xl font-bold",
                  storeActive && online ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                )}>
                  {storeActive && online ? "🟢 المتجر نشط" : "🔴 المتجر غير نشط"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {storeActive && online
                    ? (app.lang === "ar" ? "متجرك ظاهر للزبائن وجاهز لاستقبال الطلبات" : "Your store is visible to customers and ready for orders")
                    : (app.lang === "ar" ? "متجرك غير ظاهر للزبائن حالياً" : "Your store is currently hidden from customers")}
                </p>
                {!storeActive && storeInactiveReason && (
                  <div className="mt-2 p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30 animate-pulse">
                    <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                      <span><span className="font-medium">{app.lang === "ar" ? "السبب:" : "Reason:"}</span> {storeInactiveReason}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ زر كبير جداً */}
            {storeActive && online ? (
              <Button
                onClick={() => setShowDeactivateDialog(true)}
                className="h-16 px-8 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-lg shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
              >
                <PowerOff className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                {app.lang === "ar" ? "إيقاف المتجر" : "Deactivate Store"}
              </Button>
            ) : (
              <Button
                onClick={() => setShowActivateDialog(true)}
                className="h-16 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
              >
                <Power className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                {app.lang === "ar" ? "تفعيل المتجر" : "Activate Store"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ===== Dialog: إيقاف المتجر ===== */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent className="rounded-2xl max-w-md border-red-200/50 dark:border-red-800/30 shadow-2xl shadow-red-500/10">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
                  {app.lang === "ar" ? "⚠️ إيقاف المتجر" : "⚠️ Deactivate Store"}
                </DialogTitle>
                <DialogDescription>
                  {app.lang === "ar" 
                    ? "سيتم إخفاء متجرك عن الزبائن ولن يتمكنوا من رؤيته"
                    : "Your store will be hidden from customers and they won't be able to see it"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {app.lang === "ar"
                  ? "📌 سيتم إخفاء جميع منتجاتك ومتجرك عن الزبائن"
                  : "📌 All your products and store will be hidden from customers"}
              </p>
              <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">
                {app.lang === "ar"
                  ? "يمكنك تفعيل المتجر مرة أخرى في أي وقت"
                  : "You can reactivate your store at any time"}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                {app.lang === "ar" ? "سبب إيقاف المتجر" : "Reason for deactivating"}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={tempInactiveReason}
                onChange={(e) => setTempInactiveReason(e.target.value)}
                placeholder={app.lang === "ar" 
                  ? "مثال: إجازة سنوية, صيانة, تغيير الموقع..." 
                  : "e.g. Annual leave, maintenance, relocating..."}
                className="mt-2 rounded-xl resize-none h-24 border-red-200/50 dark:border-red-800/30 focus:ring-red-500/20"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                {app.lang === "ar"
                  ? "سيظهر هذا السبب للزبائن عند زيارة متجرك"
                  : "This reason will be shown to customers when they visit your store"}
              </p>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeactivateDialog(false);
                setTempInactiveReason("");
              }}
              className="rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            >
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleDeactivateStore}
              disabled={isLoading || !tempInactiveReason.trim()}
              className="rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 hover:scale-[1.02]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  {app.lang === "ar" ? "جاري الإيقاف..." : "Deactivating..."}
                </span>
              ) : (
                <>
                  <PowerOff className="h-4 w-4 mr-2" />
                  {app.lang === "ar" ? "تأكيد الإيقاف" : "Confirm Deactivate"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Dialog: تفعيل المتجر ===== */}
      <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <DialogContent className="rounded-2xl max-w-md border-emerald-200/50 dark:border-emerald-800/30 shadow-2xl shadow-emerald-500/10">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center animate-bounce">
                <Power className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {app.lang === "ar" ? "✅ تفعيل المتجر" : "✅ Activate Store"}
                </DialogTitle>
                <DialogDescription>
                  {app.lang === "ar" 
                    ? "سيتم إظهار متجرك للزبائن وسيتمكنون من رؤيته"
                    : "Your store will be visible to customers and they can see it"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/30">
              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 animate-pulse" />
                {app.lang === "ar"
                  ? "✅ سيظهر متجرك ومنتجاتك للزبائن مرة أخرى"
                  : "✅ Your store and products will be visible to customers again"}
              </p>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowActivateDialog(false)}
              className="rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            >
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleActivateStore}
              disabled={isLoading}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  {app.lang === "ar" ? "جاري التفعيل..." : "Activating..."}
                </span>
              ) : (
                <>
                  <Power className="h-4 w-4 mr-2" />
                  {app.lang === "ar" ? "تأكيد التفعيل" : "Confirm Activate"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== باقي الإعدادات ===== */}
      
      {/* ===== حالة المتجر (الإعدادات الدقيقة) ===== */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2a655f]/20 to-[#3a8a82]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-white dark:bg-[#1e293b] rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-[#2a655f]/10">
              <Clock className="h-5 w-5 text-[#2a655f] animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {app.lang === "ar" ? "إعدادات المتجر الدقيقة" : "Detailed Store Settings"}
            </h2>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
              {app.lang === "ar" ? "متقدم" : "Advanced"}
            </Badge>
          </div>

          {/* ✅ أوقات العمل */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4 text-[#2a655f]" />
                {app.lang === "ar" ? "وقت الفتح" : "Opens at"}
              </Label>
              <Input
                type="time"
                value={opensAt}
                onChange={(e) => setOpensAt(e.target.value)}
                className="mt-1.5 rounded-xl border-[#2a655f]/20 bg-white/50 dark:border-[#2a655f]/30 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
              />
            </div>
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4 text-[#2a655f]" />
                {app.lang === "ar" ? "وقت الإغلاق" : "Closes at"}
              </Label>
              <Input
                type="time"
                value={closesAt}
                onChange={(e) => setClosesAt(e.target.value)}
                className="mt-1.5 rounded-xl border-[#2a655f]/20 bg-white/50 dark:border-[#2a655f]/30 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-[#2a655f]" />
            {app.lang === "ar" ? "خارج هذه الأوقات يظهر المتجر كمغلق تلقائياً" : "Outside these hours your store shows as closed automatically"}
          </p>

          {/* ✅ خيارات التواصل */}
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer p-2 rounded-lg hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all duration-300 group">
              <input
                type="checkbox"
                checked={allowsMessaging}
                onChange={(e) => setAllowsMessaging(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#2a655f]"
              />
              <MessageSquare className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
              {app.lang === "ar" ? "السماح للزبائن بمراسلتي" : "Allow customers to message me"}
            </label>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer p-2 rounded-lg hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all duration-300 group">
              <input
                type="checkbox"
                checked={allowsBookings}
                onChange={(e) => setAllowsBookings(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#2a655f]"
              />
              <BookOpen className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
              {app.lang === "ar" ? "السماح بالحجوزات" : "Accept bookings"}
            </label>
          </div>

          <Button
            onClick={savePrefs}
            disabled={isLoading || update.isPending}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] group"
          >
            {isLoading || update.isPending ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                {app.lang === "ar" ? "جاري الحفظ..." : "Saving..."}
              </span>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                {app.lang === "ar" ? "حفظ الإعدادات" : "Save Settings"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ===== معلومات المتجر ===== */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2a655f]/20 to-[#3a8a82]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-white dark:bg-[#1e293b] rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-[#2a655f]/10">
              <Store className="h-5 w-5 text-[#2a655f] animate-bounce" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {app.lang === "ar" ? "معلومات المتجر" : "Store Information"}
            </h2>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
              {app.lang === "ar" ? "رئيسي" : "Primary"}
            </Badge>
          </div>

          <div className="grid gap-4">
            {/* اسم المتجر */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <Store className="h-4 w-4 text-[#2a655f]" />
                {app.lang === "ar" ? "اسم المتجر" : "Store Name"}
              </Label>
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder={app.lang === "ar" ? "أدخل اسم متجرك" : "Enter store name"}
                className="mt-1.5 rounded-xl border-[#2a655f]/20 bg-white/50 dark:border-[#2a655f]/30 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
              />
            </div>

            {/* رقم الهاتف */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <Phone className="h-4 w-4 text-[#2a655f]" />
                {app.lang === "ar" ? "رقم الهاتف" : "Phone Number"}
              </Label>
              <Input
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                placeholder={app.lang === "ar" ? "أدخل رقم هاتف المتجر" : "Enter store phone number"}
                className="mt-1.5 rounded-xl border-[#2a655f]/20 bg-white/50 dark:border-[#2a655f]/30 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
                dir="ltr"
              />
            </div>

            {/* وصف المتجر */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <FileText className="h-4 w-4 text-[#2a655f]" />
                {app.lang === "ar" ? "وصف المتجر" : "Store Description"}
              </Label>
              <Textarea
                rows={3}
                value={storeDesc}
                onChange={(e) => setStoreDesc(e.target.value)}
                placeholder={app.lang === "ar" ? "وصف قصير لمتجرك" : "A short description of your store"}
                className="mt-1.5 rounded-xl border-[#2a655f]/20 bg-white/50 dark:border-[#2a655f]/30 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 resize-none"
              />
            </div>

            {/* صور المتجر */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#2a655f]/20 dark:border-[#2a655f]/30 pt-4">
              <div>
                <Label className="text-sm font-medium flex items-center gap-1">
                  <ImageIcon className="h-4 w-4 text-[#2a655f]" />
                  {app.lang === "ar" ? "شعار المتجر" : "Store Logo"}
                </Label>
                <ImageInput
                  value={storeLogo}
                  onChange={setStoreLogo}
                  userId={app.user?.id}
                  folder="store-logo"
                  lang={app.lang}
                  label={app.lang === "ar" ? "ارفع شعار المتجر" : "Upload store logo"}
                  hint={app.lang === "ar" ? "مربعة، 500×500 فأعلى" : "Square, 500×500 or higher"}
                  previewClassName="h-24 w-24 rounded-2xl border-2 border-[#2a655f]/20 hover:border-[#2a655f]/40 transition-all"
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex items-center gap-1">
                  <ImageIcon className="h-4 w-4 text-[#2a655f]" />
                  {app.lang === "ar" ? "صورة الغلاف" : "Store Cover"}
                </Label>
                <ImageInput
                  value={storeCover}
                  onChange={setStoreCover}
                  userId={app.user?.id}
                  folder="store-cover"
                  lang={app.lang}
                  label={app.lang === "ar" ? "ارفع صورة الغلاف" : "Upload cover image"}
                  hint={app.lang === "ar" ? "أفقية، 1600×600 فأعلى" : "Landscape, 1600×600 or higher"}
                  previewClassName="h-32 rounded-2xl border-2 border-[#2a655f]/20 hover:border-[#2a655f]/40 transition-all"
                />
              </div>
            </div>

            {/* الموقع */}
            <div className="border-t border-[#2a655f]/20 dark:border-[#2a655f]/30 pt-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <div className="p-1 rounded-lg bg-[#2a655f]/10">
                  <MapPin className="h-4 w-4 text-[#2a655f] animate-pulse" />
                </div>
                {app.lang === "ar" ? "موقع المتجر" : "Store Location"}
              </h3>

              <div className="mb-3">
                <Label className="text-sm font-medium">
                  {app.lang === "ar" ? "نوع المتجر" : "Store Type"}
                </Label>
                <RadioGroup
                  value={storeType}
                  onValueChange={(value: 'online' | 'physical') => setStoreType(value)}
                  className="flex gap-4 mt-1.5"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="online" id="settings-store-online" className="border-[#2a655f]/30 text-[#2a655f]" />
                    <Label htmlFor="settings-store-online" className="cursor-pointer text-sm hover:text-[#2a655f] transition-colors">
                      <Globe className="inline h-4 w-4 mr-1" />
                      {app.lang === "ar" ? "اونلاين" : "Online"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="physical" id="settings-store-physical" className="border-[#2a655f]/30 text-[#2a655f]" />
                    <Label htmlFor="settings-store-physical" className="cursor-pointer text-sm hover:text-[#2a655f] transition-colors">
                      <Building className="inline h-4 w-4 mr-1" />
                      {app.lang === "ar" ? "متجر حقيقي" : "Physical Store"}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mb-3">
                <Label className="text-sm font-medium">
                  <MapPin className="inline h-4 w-4 mr-1 text-[#2a655f]" />
                  {app.lang === "ar" ? "المحافظة" : "Governorate"}
                </Label>
                <Select value={governorateId} onValueChange={setGovernorateId}>
                  <SelectTrigger className="mt-1.5 rounded-xl border-[#2a655f]/20 bg-white/50 dark:border-[#2a655f]/30 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300">
                    <SelectValue placeholder={app.lang === "ar" ? "اختر المحافظة" : "Select governorate"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#2a655f]/20">
                    {governorates.map((gov: any) => (
                      <SelectItem key={gov.id} value={gov.id} className="hover:bg-[#2a655f]/10">
                        {app.lang === "ar" ? gov.name_ar : gov.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {storeType === 'physical' && (
                <div className="mb-3">
                  <Label className="text-sm font-medium">
                    {app.lang === "ar" ? "العنوان التفصيلي" : "Detailed Address"}
                  </Label>
                  <Input
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    placeholder={app.lang === "ar" ? "مثال: شارع الثورة، بناء رقم 10" : "e.g. Al-Thawra St., Building 10"}
                    className="mt-1.5 rounded-xl border-[#2a655f]/20 bg-white/50 dark:border-[#2a655f]/30 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
                  />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">
                  <Calendar className="inline h-4 w-4 mr-1 text-[#2a655f]" />
                  {app.lang === "ar" ? "أيام العطل الأسبوعية" : "Weekly Off Days"}
                </Label>
                <div className="flex flex-wrap gap-2 p-3 mt-1.5 rounded-xl border border-[#2a655f]/20 bg-white/50 dark:border-[#2a655f]/30 dark:bg-slate-900/50">
                  {WEEK_DAYS.map((day) => (
                    <label key={day.value} className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-[#2a655f]/5 transition-all duration-300 group">
                      <input
                        type="checkbox"
                        checked={weeklyOffDays.includes(day.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWeeklyOffDays([...weeklyOffDays, day.value]);
                          } else {
                            setWeeklyOffDays(weeklyOffDays.filter(d => d !== day.value));
                          }
                        }}
                        className="h-4 w-4 accent-[#2a655f] rounded border-slate-300"
                      />
                      <span className="text-sm group-hover:text-[#2a655f] transition-colors">{day.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-[#2a655f]" />
                  {app.lang === "ar" ? "اختر الأيام التي يكون فيها المتجر مغلقاً" : "Select days when the store is closed"}
                </p>
              </div>
            </div>

            <Button
              onClick={saveStoreInfo}
              disabled={isLoading}
              className="mt-4 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] group w-full"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  {app.lang === "ar" ? "جاري الحفظ..." : "Saving..."}
                </span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  {app.lang === "ar" ? "حفظ معلومات المتجر" : "Save Store Info"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ إضافة CSS للحركات
const style = document.createElement('style');
style.textContent = `
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
`;
document.head.appendChild(style);