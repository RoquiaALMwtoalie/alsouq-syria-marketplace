// src/components/dashboard/BecomeSellerCard.tsx

import { useState, useEffect } from "react";
import { 
  Store, Clock, Package, MapPin, Globe, Building, Clock as ClockIcon, 
  Calendar, Shield, TrendingUp, CheckCircle, 
  ArrowRight, Sparkles, Rocket, DollarSign, X, ArrowLeft,
  Phone, Image, Info, AlertCircle, Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { 
  useBecomeSeller, 
  useMySellerApplication, 
  useProfile, 
  useGovernorates, 
  useSendNotificationV2,
  useCanSubmitApplication,
  useLastRejectedApplication
} from "@/lib/queries";
import { ImageInput } from "@/components/ImageInput";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const WEEK_DAYS = [
  { value: 'Monday', label: 'الإثنين' },
  { value: 'Tuesday', label: 'الثلاثاء' },
  { value: 'Wednesday', label: 'الأربعاء' },
  { value: 'Thursday', label: 'الخميس' },
  { value: 'Friday', label: 'الجمعة' },
  { value: 'Saturday', label: 'السبت' },
  { value: 'Sunday', label: 'الأحد' },
];

export function BecomeSellerCard() {
  const app = useApp();
  const t = useT();
  const become = useBecomeSeller();
  const sendNotification = useSendNotificationV2();
  const { data: application, isLoading: appLoading } = useMySellerApplication(app.user?.id);
  const { data: profile } = useProfile(app.user?.id);
  const { data: governorates = [] } = useGovernorates();
  
  // ✅ hooks الجديدة للتحقق من حالة المستخدم
  const { data: canSubmitData, isLoading: checkingLoading } = useCanSubmitApplication(app.user?.id);
  const { data: lastRejected, isLoading: rejectedLoading } = useLastRejectedApplication(app.user?.id);
  
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [storeCover, setStoreCover] = useState("");
  const [allowsMessaging, setAllowsMessaging] = useState(true);
  const [allowsBookings, setAllowsBookings] = useState(false);
  const [storeType, setStoreType] = useState<'online' | 'physical'>('online');
  const [governorateId, setGovernorateId] = useState("");
  const [address, setAddress] = useState("");
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [weeklyOffDays, setWeeklyOffDays] = useState<string[]>([]);
  
  const [prefilled, setPrefilled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [rejectedReason, setRejectedReason] = useState<string | null>(null);

  // ====== التحقق من حالة الطلب المرفوض ======
  useEffect(() => {
    if (lastRejected) {
      setIsRejected(true);
      setRejectedReason(lastRejected.admin_note || 'تم رفض الطلب من قبل الإدارة');
      
      // ✅ تعبئة البيانات القديمة لتسهيل التعديل
      setStoreName(lastRejected.store_name || "");
      setStoreDesc(lastRejected.store_description || "");
      setStorePhone(lastRejected.store_phone || "");
      setStoreLogo(lastRejected.store_logo_url || "");
      setStoreCover(lastRejected.store_cover_url || "");
      setStoreType(lastRejected.store_type || 'online');
      setGovernorateId(lastRejected.governorate_id || "");
      setAddress(lastRejected.address || "");
      setOpeningTime(lastRejected.opening_time || "09:00");
      setClosingTime(lastRejected.closing_time || "22:00");
      setWeeklyOffDays(lastRejected.weekly_off_days || []);
    }
  }, [lastRejected]);

  // ====== تعبئة البيانات من البروفايل ======
  useEffect(() => {
    if (prefilled || !profile || isRejected) return;
    const p = profile as any;
    if (p.avatar_url && !storeLogo) setStoreLogo(p.avatar_url);
    setPrefilled(true);
  }, [profile, prefilled, storeLogo, isRejected]);

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return storeName.trim().length >= 2;
      case 2:
        return storeLogo.trim().length > 0 && storeCover.trim().length > 0;
      case 3:
        return storePhone.trim().length > 0 && 
               governorateId.length > 0 && 
               (storeType === 'online' || address.trim().length > 0);
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (isStepValid(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ دالة إرسال إشعار للأدمن عند طلب فتح متجر (معدلة لاستخدام V2)
  const notifyAdminForStore = async (storeName: string, userId: string) => {
    try {
      const { data: adminRole, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin")
        .limit(1)
        .maybeSingle();

      if (roleError || !adminRole) {
        console.log("ℹ️ No admin found to notify");
        return;
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name, store_name")
        .eq("id", userId)
        .maybeSingle();

      const userName = userProfile?.store_name || userProfile?.full_name || userId;

      // ✅ إرسال الإشعار باستخدام V2
      await sendNotification.mutateAsync({
        userId: adminRole.user_id,
        type: "store_application",
        titleAr: `🏪 طلب فتح متجر جديد`,
        bodyAr: `قام ${userName} بتقديم طلب فتح متجر "${storeName}"، بحاجة للمراجعة`,
        linkUrl: `/admin/applications`,
        metadata: {
          store_name: storeName,
          user_id: userId,
          action: "open_store",
        },
        actions: [
          { label_ar: 'مراجعة الطلب', url: `/admin/applications` },
        ]
      });

      console.log(`✅ Admin notified about store application: ${storeName} from ${userName}`);
    } catch (error) {
      console.error("❌ Error notifying admin about store:", error);
    }
  };

  async function handleBecome() {
    if (!app.user) return;
    
    // ✅ منع النقر المتكرر
    if (isSubmitting) {
      toast.warning(app.lang === "ar" ? "⏳ جاري الإرسال، انتظر..." : "⏳ Submitting, please wait...");
      return;
    }

    // ✅ التحقق: هل يمكن التقديم؟
    if (!canSubmitData?.canSubmit) {
      toast.error(canSubmitData?.reason || app.lang === "ar" ? "لا يمكنك التقديم" : "Cannot submit");
      return;
    }
    
    if (!storeName.trim() || storeName.trim().length < 2) {
      toast.error(app.lang === "ar" ? "اسم المتجر مطلوب (أكثر من حرفين)" : "Store name required (at least 2 characters)");
      setCurrentStep(1);
      return;
    }
    
    if (!storeLogo.trim()) {
      toast.error(app.lang === "ar" ? "شعار المتجر (Logo) مطلوب" : "Store logo is required");
      setCurrentStep(2);
      return;
    }
    if (!storeCover.trim()) {
      toast.error(app.lang === "ar" ? "صورة غلاف المتجر (Cover) مطلوبة" : "Store cover image is required");
      setCurrentStep(2);
      return;
    }
    
    if (!storePhone.trim()) {
      toast.error(app.lang === "ar" ? "رقم هاتف المتجر مطلوب" : "Store phone number is required");
      setCurrentStep(3);
      return;
    }
    if (!governorateId) {
      toast.error(app.lang === "ar" ? "الرجاء اختيار المحافظة" : "Please select governorate");
      setCurrentStep(3);
      return;
    }
    if (storeType === 'physical' && !address.trim()) {
      toast.error(app.lang === "ar" ? "العنوان مطلوب للمتاجر الحقيقية" : "Address required for physical stores");
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      await become.mutateAsync({
        userId: app.user.id,
        store_name: storeName.trim(),
        store_description: storeDesc,
        store_phone: storePhone.trim(),
        store_logo_url: storeLogo.trim(),
        store_cover_url: storeCover.trim(),
        allows_messaging: allowsMessaging,
        allows_bookings: allowsBookings,
        store_type: storeType,
        governorate_id: governorateId,
        address: storeType === 'physical' ? address.trim() : null,
        opening_time: openingTime,
        closing_time: closingTime,
        weekly_off_days: weeklyOffDays,
        application_type: 'store', 
      });
      
      await notifyAdminForStore(storeName.trim(), app.user.id);

     toast.success(
  app.lang === "ar" 
    ? "✅ تم إرسال طلبك بنجاح! سيتم مراجعته من قبل الأدمن خلال دقائق" 
    : "✅ Your application was sent successfully! It will be reviewed by the admin within minutes"
);
      // ✅ إعادة تحميل الصفحة لتحديث الحالة
      window.location.reload();
    } catch (e: any) {
      console.error("❌ Error submitting application:", e);
      const errorMessage = e.message || String(e);
      
      if (errorMessage.includes("لا يمكنك تقديم أكثر من طلب واحد")) {
        toast.error(app.lang === "ar" ? "⛔ لديك طلب سابق بالفعل" : "⛔ You already have an existing application");
      } else if (errorMessage.includes("لديك متجر مفعل")) {
        toast.error(app.lang === "ar" ? "✅ لديك متجر مفعل بالفعل" : "✅ You already have an active store");
      } else {
        toast.error(app.lang === "ar" ? `❌ فشل الإرسال: ${errorMessage}` : `❌ Submission failed: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // ====== ⏳ حالة التحميل ======
  if (appLoading || checkingLoading || rejectedLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">
          {app.lang === "ar" ? "جاري التحقق..." : "Checking..."}
        </p>
      </div>
    );
  }

  // ====== 📋 حالة: لديه طلب pending ======
 {/* ====== 📋 حالة: لديه طلب pending ====== */}
if (canSubmitData?.existingApplication?.status === 'pending') {
  const appData = canSubmitData.existingApplication;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl px-4 py-16 text-center"
    >
      <div className="rounded-3xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-2 border-yellow-200/50 dark:border-yellow-800/50 shadow-2xl p-8 md:p-12">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 grid place-items-center mb-6 shadow-xl shadow-yellow-500/30"
        >
          <Clock className="h-12 w-12 text-white" />
        </motion.div>
        <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
          {app.lang === "ar" ? "⏳ طلبك قيد المراجعة" : "⏳ Your application is pending"}
        </h1>
        <p className="text-muted-foreground mb-6 text-lg">
          {app.lang === "ar"
            ? `طلبك للمتجر "${appData.store_name}" قيد المراجعة من قبل الأدمن`
            : `Your application for "${appData.store_name}" is being reviewed`}
        </p>
        
        {/* ✅ ✅ ✅ العبارة الجديدة ✅ ✅ ✅ */}
        <div className="mb-6 p-4 rounded-xl bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-300/30 dark:border-yellow-700/30">
          <p className="text-yellow-700 dark:text-yellow-300 font-medium flex items-center justify-center gap-2">
            <Clock className="h-5 w-5" />
            {app.lang === "ar"
              ? "⏳ سيتم مراجعة طلبك بغضون دقائق فقط"
              : "⏳ Your application will be reviewed within minutes"}
          </p>
        </div>
        
        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 py-2 px-6 text-sm shadow-lg shadow-yellow-500/30">
          <Clock className="h-4 w-4 mr-2" />
          {app.lang === "ar" ? "⏳ بانتظار موافقة الأدمن" : "⏳ Awaiting admin approval"}
        </Badge>
      </div>
    </motion.div>
  );
}

  // ====== 📋 حالة: لديه طلب approved ======
  if (canSubmitData?.existingApplication?.status === 'approved') {
    const appData = canSubmitData.existingApplication;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl px-4 py-16 text-center"
      >
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-2 border-emerald-200/50 dark:border-emerald-800/50 shadow-2xl p-8 md:p-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 grid place-items-center mb-6 shadow-xl shadow-emerald-500/30">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            {app.lang === "ar" ? "✅ تمت الموافقة على متجرك" : "✅ Your store is approved"}
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">
            {app.lang === "ar"
              ? `تمت الموافقة على متجر "${appData.store_name}" 🎉`
              : `Your store "${appData.store_name}" has been approved 🎉`}
          </p>
          <Button
            onClick={() => window.location.href = '/dashboard'}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white"
          >
            {app.lang === "ar" ? "🚀 اذهب إلى متجرك" : "🚀 Go to your store"}
          </Button>
        </div>
      </motion.div>
    );
  }

  // ====== 📋 حالة: الطلب مرفوض (يظهر مع سبب الرفض) ======
  const rejected = application?.status === "rejected";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl p-8 md:p-12 mb-8"
      >
        <div className="absolute -end-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -start-16 -bottom-16 h-64 w-64 rounded-full from-purple-500/30 to-transparent bg-gradient-to-br blur-3xl" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur grid place-items-center shrink-0 shadow-xl">
            <Store className="h-10 w-10" />
          </div>
          <div className="flex-1">
            <Badge className="bg-white/25 border-0 text-white mb-3 py-1.5 px-4 text-xs font-semibold tracking-wider">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              {app.lang === "ar" ? "✨ انضم لآلاف البائعين" : "✨ Join thousands of sellers"}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              {app.lang === "ar" ? "افتح متجرك الآن" : "Open your store now"}
            </h1>
            <p className="mt-2 text-white/90 text-sm md:text-base max-w-lg">
              {app.lang === "ar"
                ? "3 خطوات بسيطة تفصلك عن أول بيعة — املأ اسم متجرك وابدأ رحلة النجاح."
                : "You're 3 simple steps away from your first sale — start your success journey today."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(step)}
                className={`
                  flex items-center justify-center h-10 w-10 rounded-full text-sm font-bold transition-all duration-300 shrink-0
                  ${currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                  ${currentStep > step ? 'scale-95' : ''}
                `}
              >
                {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
              </button>
              <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                  style={{ width: currentStep > step ? '100%' : currentStep === step ? '50%' : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>
            {app.lang === "ar" ? "المتجر" : "Store"}
          </span>
          <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>
            {app.lang === "ar" ? "الصور" : "Images"}
          </span>
          <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>
            {app.lang === "ar" ? "التفاصيل" : "Details"}
          </span>
        </div>
      </div>

      {/* ✅ عرض سبب الرفض (يظهر فقط للطلبات المرفوضة) */}
      {rejected && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 p-5 text-sm backdrop-blur"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <div className="font-bold text-amber-600 dark:text-amber-400 mb-1">
                {app.lang === "ar" ? "📋 سبب رفض طلبك السابق" : "📋 Reason for rejection"}
              </div>
              <div className="text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                {application?.admin_note || (app.lang === "ar" ? "لم يتم تحديد سبب" : "No reason specified")}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {app.lang === "ar" 
                  ? `⏳ تم الرفض في: ${new Date(application?.updated_at).toLocaleDateString('ar-SA')}`
                  : `⏳ Rejected on: ${new Date(application?.updated_at).toLocaleDateString()}`}
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400 mt-2 font-medium">
                {app.lang === "ar" 
                  ? "💡 يمكنك تعديل بياناتك وإعادة التقديم"
                  : "💡 You can update your details and re-apply"}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <div className="rounded-3xl bg-card border shadow-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 grid place-items-center text-white font-black text-sm">
            {rejected ? '♻️' : currentStep}
          </div>
          <div>
            <div className="font-black text-lg">
              {app.lang === "ar" 
                ? rejected ? "إعادة تقديم الطلب" : currentStep === 1 ? "معلومات متجرك" : currentStep === 2 ? "صور متجرك" : "تفاصيل إضافية"
                : rejected ? "Re-apply" : currentStep === 1 ? "Store details" : currentStep === 2 ? "Store images" : "Additional details"
              }
            </div>
            <div className="text-xs text-muted-foreground">
              {app.lang === "ar" 
                ? rejected ? "عدل بياناتك وأرسل طلباً جديداً" : currentStep === 1 ? "أختر اسماً مميزاً لمتجرك" : currentStep === 2 ? "أضف صوراً جذابة" : "أكمل معلومات متجرك"
                : rejected ? "Update your details and submit a new application" : currentStep === 1 ? "Choose a unique name for your store" : currentStep === 2 ? "Add attractive images" : "Complete your store details"
              }
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Store Info */}
          {currentStep === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <Label className="text-sm font-semibold flex items-center gap-1">
                  <span className="text-red-500">*</span> {app.lang === "ar" ? "اسم المتجر" : "Store name"}
                  <span className="text-xs text-muted-foreground font-normal">
                    ({storeName.length}/50)
                  </span>
                </Label>
                <Input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value.slice(0, 50))}
                  placeholder={app.lang === "ar" ? "مثلاً: متجر الأناقة" : "e.g. Elegance Store"}
                  className="mt-1.5 h-12 rounded-xl border-primary/20 bg-primary/5 text-base focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                {storeName.length > 0 && storeName.length < 2 && (
                  <p className="text-xs text-amber-500 mt-1">
                    {app.lang === "ar" ? "⚠️ الاسم قصير جداً (يلزم حرفين على الأقل)" : "⚠️ Name is too short (at least 2 characters)"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {app.lang === "ar" 
                    ? "💡 يمكنك استخدام أي اسم، غير مقيد (قابل للتكرار)"
                    : "💡 You can use any name, not unique (can be repeated)"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold">{app.lang === "ar" ? "وصف المتجر" : "Store description"}</Label>
                <Textarea
                  rows={3}
                  value={storeDesc}
                  onChange={(e) => setStoreDesc(e.target.value)}
                  placeholder={app.lang === "ar" ? "وصف قصير يعرّف زبائنك بمتجرك" : "A short line to introduce your store"}
                  className="mt-1.5 rounded-xl border-primary/20 bg-primary/5 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {app.lang === "ar" ? "اختياري — يمكنك إضافته لاحقاً" : "Optional — you can add it later"}
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Images */}
          {currentStep === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {app.lang === "ar" ? "💡 نصيحة احترافية" : "💡 Pro tip"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {app.lang === "ar"
                        ? "الصور الاحترافية تزيد ثقة الزبائن ومبيعاتك بنسبة تصل إلى 80%"
                        : "Professional images increase customer trust and sales by up to 80%"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-4 w-4 text-blue-500" />
                      <Label className="text-sm font-semibold">
                        {app.lang === "ar" ? "شعار المتجر (Logo)" : "Store logo"}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                    </div>
                    <ImageInput
                      value={storeLogo}
                      onChange={setStoreLogo}
                      userId={app.user?.id}
                      folder="store-logo"
                      lang={app.lang}
                      required
                      hint={app.lang === "ar" ? "مربعة، خلفية واضحة، دقة عالية (500×500 فأعلى)" : "Square, clear background, 500×500 or higher"}
                      previewClassName="h-28 w-28 rounded-2xl border-2 border-blue-200/30"
                    />
                    {!storeLogo && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {app.lang === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-4 w-4 text-blue-500" />
                      <Label className="text-sm font-semibold">
                        {app.lang === "ar" ? "صورة الغلاف (Cover)" : "Cover image"}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                    </div>
                    <ImageInput
                      value={storeCover}
                      onChange={setStoreCover}
                      userId={app.user?.id}
                      folder="store-cover"
                      lang={app.lang}
                      required
                      hint={app.lang === "ar" ? "أفقية، 1600×600 أو أعلى، تعبّر عن نشاطك" : "Landscape, 1600×600 or higher, represents your business"}
                      previewClassName="h-32 rounded-2xl border-2 border-blue-200/30"
                    />
                    {!storeCover && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {app.lang === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="relative">
                <Label className="text-sm font-semibold flex items-center gap-1">
                  <Phone className="h-4 w-4 text-blue-500" />
                  {app.lang === "ar" ? "رقم هاتف المتجر" : "Store phone"}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  placeholder="+963 9xx xxx xxx"
                  dir="ltr"
                  className="mt-1.5 h-12 rounded-xl border-primary/20 bg-primary/5 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                {!storePhone && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {app.lang === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  {app.lang === "ar" ? "نوع المتجر" : "Store Type"}
                </Label>
                <RadioGroup
                  value={storeType}
                  onValueChange={(value: 'online' | 'physical') => setStoreType(value)}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className={`
                    relative rounded-xl border-2 p-4 cursor-pointer transition-all
                    ${storeType === 'online' 
                      ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/20' 
                      : 'border-border hover:border-blue-300'
                    }
                  `}>
                    <RadioGroupItem value="online" id="online" className="sr-only" />
                    <Label htmlFor="online" className="flex flex-col items-center gap-2 cursor-pointer">
                      <Globe className="h-6 w-6 text-blue-500" />
                      <span className="font-medium text-sm">
                        {app.lang === "ar" ? "اونلاين" : "Online"}
                      </span>
                      <span className="text-xs text-muted-foreground text-center">
                        {app.lang === "ar" ? "بيع منتجاتك عبر الإنترنت" : "Sell your products online"}
                      </span>
                    </Label>
                  </div>
                  <div className={`
                    relative rounded-xl border-2 p-4 cursor-pointer transition-all
                    ${storeType === 'physical' 
                      ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/20' 
                      : 'border-border hover:border-blue-300'
                    }
                  `}>
                    <RadioGroupItem value="physical" id="physical" className="sr-only" />
                    <Label htmlFor="physical" className="flex flex-col items-center gap-2 cursor-pointer">
                      <Building className="h-6 w-6 text-blue-500" />
                      <span className="font-medium text-sm">
                        {app.lang === "ar" ? "متجر حقيقي" : "Physical Store"}
                      </span>
                      <span className="text-xs text-muted-foreground text-center">
                        {app.lang === "ar" ? "بيع منتجاتك من موقعك" : "Sell from your location"}
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {app.lang === "ar" ? "المحافظة" : "Governorate"}
                  <span className="text-red-500">*</span>
                </Label>
                <Select value={governorateId} onValueChange={setGovernorateId}>
                  <SelectTrigger className="h-12 rounded-xl border-primary/20 bg-primary/5 focus:ring-2 focus:ring-blue-500/20 transition-all">
                    <SelectValue placeholder={app.lang === "ar" ? "اختر المحافظة" : "Select governorate"} />
                  </SelectTrigger>
                  <SelectContent>
                    {governorates.map((gov: any) => (
                      <SelectItem key={gov.id} value={gov.id}>
                        {app.lang === "ar" ? gov.name_ar : gov.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!governorateId && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {app.lang === "ar" ? "الرجاء اختيار المحافظة" : "Please select a governorate"}
                  </p>
                )}
              </div>

              {storeType === 'physical' && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    {app.lang === "ar" ? "العنوان التفصيلي" : "Detailed Address"}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={app.lang === "ar" ? "مثال: شارع الثورة، بناء رقم 10" : "e.g. Al-Thawra St., Building 10"}
                    className="h-12 rounded-xl border-primary/20 bg-primary/5 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    <ClockIcon className="inline h-4 w-4 mr-1" />
                    {app.lang === "ar" ? "وقت الفتح" : "Opening Time"}
                  </Label>
                  <Input
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="h-12 rounded-xl border-primary/20 bg-primary/5 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    <ClockIcon className="inline h-4 w-4 mr-1" />
                    {app.lang === "ar" ? "وقت الإغلاق" : "Closing Time"}
                  </Label>
                  <Input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="h-12 rounded-xl border-primary/20 bg-primary/5 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {app.lang === "ar" ? "أيام العطل الأسبوعية" : "Weekly Off Days"}
                </Label>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl border-2 border-primary/20 bg-primary/5">
                  {WEEK_DAYS.map((day) => (
                    <label key={day.value} className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all">
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
                        className="h-4 w-4 accent-blue-600 rounded"
                      />
                      <span className="text-sm">{day.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {app.lang === "ar" ? "اختر الأيام التي يكون فيها المتجر مغلقاً" : "Select days when the store is closed"}
                </p>
              </div>

              <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 space-y-3">
                <div className="font-semibold text-sm">
                  {app.lang === "ar" ? "خيارات التواصل" : "Contact options"}
                </div>
                <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-blue-500/5 transition-all">
                  <input
                    type="checkbox"
                    checked={allowsMessaging}
                    onChange={(e) => setAllowsMessaging(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-blue-600 rounded"
                  />
                  <div>
                    <div className="text-sm font-medium">
                      {app.lang === "ar" ? "السماح بالمراسلة" : "Allow messaging"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "يقدر الزبون يراسلك داخل السستم" : "Customers can message you inside the app"}
                    </div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-blue-500/5 transition-all">
                  <input
                    type="checkbox"
                    checked={allowsBookings}
                    onChange={(e) => setAllowsBookings(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-blue-600 rounded"
                  />
                  <div>
                    <div className="text-sm font-medium">
                      {app.lang === "ar" ? "السماح بالحجز" : "Allow bookings"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "يقدر الزبون يحجز خدمتك أو منتجك" : "Customers can request bookings for your listings"}
                    </div>
                  </div>
                </label>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                className="h-12 px-6 rounded-xl border-primary/20 hover:bg-primary/5 transition-all"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {app.lang === "ar" ? "السابق" : "Previous"}
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button
                onClick={goToNextStep}
                disabled={!isStepValid(currentStep)}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {app.lang === "ar" ? "التالي" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleBecome}
                disabled={become.isPending || isSubmitting || !isStepValid(3)}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {become.isPending || isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {app.lang === "ar" ? "جاري الإرسال..." : "Submitting..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    {app.lang === "ar" ? "🚀 أرسل طلب فتح المتجر" : "🚀 Submit store application"}
                  </span>
                )}
              </Button>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 pt-4">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${currentStep === step ? 'w-8 bg-blue-600' : 'w-2 bg-muted hover:bg-muted/80'}
                  ${currentStep > step ? 'bg-blue-400' : ''}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}